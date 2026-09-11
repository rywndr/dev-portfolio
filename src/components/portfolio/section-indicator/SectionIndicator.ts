const DESKTOP_QUERY = '(min-width: 75rem)';
const SCROLL_DURATION_MS = 450;
const SCROLL_INTERRUPT_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
  'Escape',
]);

type SectionEntry = {
  link: HTMLAnchorElement;
  section: HTMLElement;
};

type DragState = {
  pointerId: number;
  index: number | null;
};

class SectionIndicator extends HTMLElement {
  private readonly desktop = window.matchMedia(DESKTOP_QUERY);
  private entries: SectionEntry[] = [];
  private listeners: AbortController | null = null;
  private updateFrame = 0;
  private scrollFrame = 0;
  private drag: DragState | null = null;

  connectedCallback() {
    if (this.listeners) return;

    // Ignore links with missing sections so they do not break the scroll logic.
    this.entries = Array.from(
      this.querySelectorAll<HTMLAnchorElement>('a'),
    ).flatMap((link) => {
      const section = document.getElementById(link.hash.slice(1));
      return section ? [{ link, section }] : [];
    });

    // Use one signal so every event listener can be removed at once.
    const listeners = new AbortController();
    this.listeners = listeners;
    this.bindEvents(listeners.signal);

    // Fonts can shift the layout, so update the active section after they load.
    document.fonts.ready.then(() => {
      if (!listeners.signal.aborted) this.scheduleUpdate();
    });
    this.updateCurrentSection();
  }

  disconnectedCallback() {
    this.endDrag();
    this.stopScroll();
    window.cancelAnimationFrame(this.updateFrame);
    this.updateFrame = 0;
    this.listeners?.abort();
    this.listeners = null;
  }

  private bindEvents(signal: AbortSignal) {
    this.addEventListener('pointerdown', this.startDrag, { signal });
    this.addEventListener('pointermove', this.moveDrag, { signal });
    this.addEventListener('pointerup', this.releaseDrag, { signal });
    this.addEventListener('pointercancel', this.releaseDrag, { signal });
    this.addEventListener('lostpointercapture', this.releaseDrag, { signal });

    // Listen on document so the header links use the same scroll animation.
    document.addEventListener('click', this.followSectionLink, { signal });

    window.addEventListener('wheel', this.stopScroll, {
      passive: true,
      signal,
    });
    window.addEventListener('touchstart', this.stopScroll, {
      passive: true,
      signal,
    });
    window.addEventListener('blur', this.resetInteraction, { signal });
    window.addEventListener('keydown', this.handleKeydown, { signal });
    window.addEventListener('scroll', this.scheduleUpdate, {
      passive: true,
      signal,
    });
    window.addEventListener('resize', this.scheduleUpdate, { signal });
    window.addEventListener('pageshow', this.scheduleUpdate, { signal });
    this.desktop.addEventListener('change', this.handleBreakpoint, { signal });
  }

  private readonly updateCurrentSection = () => {
    this.updateFrame = 0;
    if (!this.desktop.matches) return;

    // Use a reading line near the top because the center switches too late.
    const readingLine = Math.min(window.innerHeight * 0.3, 240);
    let active: SectionEntry | undefined;
    for (const entry of this.entries) {
      if (entry.section.getBoundingClientRect().top <= readingLine) {
        active = entry;
      }
    }

    // The last section can be too short to cross the line, so bottom takes over.
    const atPageBottom =
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
    if (atPageBottom) active = this.entries.at(-1);

    for (const entry of this.entries) {
      if (entry === active) {
        entry.link.setAttribute('aria-current', 'location');
      } else {
        entry.link.removeAttribute('aria-current');
      }
    }
  };

  // Scroll fires often, so only read the layout once per animation frame.
  private readonly scheduleUpdate = () => {
    if (this.updateFrame || !this.desktop.matches) return;
    this.updateFrame = window.requestAnimationFrame(this.updateCurrentSection);
  };

  private readonly scrollToSection = (section: HTMLElement) => {
    this.stopScroll();
    const from = window.scrollY;
    const margin = Number.parseFloat(
      window.getComputedStyle(section).scrollMarginTop,
    );
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const unclampedTarget =
      from + section.getBoundingClientRect().top - (margin || 0);
    // Clamp the target because the last section may not be able to reach the top.
    const to = Math.max(0, Math.min(unclampedTarget, maxScroll));

    const startedAt = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / SCROLL_DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      // Use instant because the global smooth scroll would fight this animation.
      window.scrollTo({
        top: from + (to - from) * eased,
        behavior: 'instant',
      });
      this.scrollFrame = progress < 1 ? window.requestAnimationFrame(step) : 0;
    };

    this.scrollFrame = window.requestAnimationFrame(step);
  };

  private readonly stopScroll = () => {
    window.cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = 0;
  };

  // Measure from each link center so dragging also works between the ticks.
  private selectAt(clientY: number) {
    if (!this.drag) return;

    let nearestIndex = 0;
    let nearestDistance = Infinity;
    this.entries.forEach(({ link }, index) => {
      const bounds = link.getBoundingClientRect();
      const distance = Math.abs(clientY - (bounds.top + bounds.height / 2));
      if (distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });

    const entry = this.entries[nearestIndex];
    if (!entry || nearestIndex === this.drag.index) return;

    this.drag.index = nearestIndex;
    for (const { link } of this.entries) {
      link.toggleAttribute('data-target', link === entry.link);
    }
    this.scrollToSection(entry.section);
  }

  private readonly startDrag = (event: PointerEvent) => {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      this.drag ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    this.drag = { pointerId: event.pointerId, index: null };
    // Capture the pointer so it can still drag outside the indicator
    this.setPointerCapture(event.pointerId);
    this.setAttribute('data-dragging', '');
    this.selectAt(event.clientY);
  };

  private readonly moveDrag = (event: PointerEvent) => {
    if (event.pointerId === this.drag?.pointerId) this.selectAt(event.clientY);
  };

  private readonly releaseDrag = (event: PointerEvent) => {
    if (event.pointerId === this.drag?.pointerId) this.endDrag();
  };

  private readonly endDrag = () => {
    if (!this.drag) return;

    const { pointerId } = this.drag;
    this.drag = null;
    this.removeAttribute('data-dragging');
    for (const { link } of this.entries) link.removeAttribute('data-target');
    if (this.hasPointerCapture(pointerId))
      this.releasePointerCapture(pointerId);
  };

  private readonly followSectionLink = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;

    const link =
      event.target instanceof Element ? event.target.closest('a') : null;
    if (!link) return;

    const entry = this.entries.find(
      ({ link: destination }) =>
        destination.getAttribute('href') === link.getAttribute('href'),
    );
    if (!entry) return;

    event.preventDefault();
    // Pointer dragging already scrolls, while keyboard clicks still need this.
    if (event.detail > 0 && this.contains(link)) return;

    this.scrollToSection(entry.section);
    // Preventing the anchor click also stops the hash update, so set it manually.
    if (window.location.hash !== link.hash) {
      window.history.pushState(null, '', link.hash);
    }
  };

  private readonly handleKeydown = (event: KeyboardEvent) => {
    if (!SCROLL_INTERRUPT_KEYS.has(event.key)) return;
    this.resetInteraction();
  };

  private readonly resetInteraction = () => {
    this.stopScroll();
    this.endDrag();
  };

  private readonly handleBreakpoint = () => {
    this.resetInteraction();
    this.scheduleUpdate();
  };
}

// Hot reload can run this again, but custom elements can only be defined once.
if (!customElements.get('section-indicator')) {
  customElements.define('section-indicator', SectionIndicator);
}

export type SocialLink = {
  label: string;
  href: string;
  icon: string;
};

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/rywndr/',
    icon: '/github.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/haikhal-roywendra-369b5826a',
    icon: '/linkedin.svg',
  },
  {
    label: 'X',
    href: 'https://x.com/kal_xyz',
    icon: '/x.svg',
  },
] satisfies SocialLink[];

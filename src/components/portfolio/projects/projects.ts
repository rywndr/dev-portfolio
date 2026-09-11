import type { ImageMetadata } from 'astro';

import aalawImage from '@assets/projects/aalaw.webp';
import miraiConsoleImage from '@assets/projects/mirai-console.webp';
import tiktokDappImage from '@assets/projects/tiktok-dapp.png';

export type ProjectTechnology = {
  name: string;
  icon: string;
};

export type Project = {
  name: string;
  featured: boolean;
  image: ImageMetadata | null;
  description: string;
  technologies: ProjectTechnology[];
  live: string;
  github: string;
  hasGithub: boolean;
  hasLive: boolean;
};

export const projects = [
  {
    name: 'AfiDu',
    featured: false,
    image: null,
    live: '#',
    github: 'https://github.com/rywndr/AfiDu',
    hasGithub: true,
    hasLive: false,
    description:
      'A management and e-learning platform for a private English learning center, digitizing student records, payments, grades, report cards, learning materials, and online assignments.',
    technologies: [
      { name: 'Django', icon: '/icons/tech/django.svg' },
      { name: 'Next.js', icon: '/icons/tech/nextjs.svg' },
      { name: 'PostgreSQL', icon: '/icons/tech/postgresql.svg' },
    ],
  },
  {
    name: 'Audy & Antoni Law Firm',
    featured: false,
    image: aalawImage,
    live: 'https://audyantonilaw.com/',
    github: '#',
    hasGithub: false,
    hasLive: true,
    description:
      'A production website for a South Jakarta law firm. Features bilingual content, dynamic lawyer profiles, SEO optimization, and an integrated contact system.',
    technologies: [
      { name: 'Next.js', icon: '/icons/tech/nextjs.svg' },
      { name: 'TypeScript', icon: '/icons/tech/typescript.svg' },
      { name: 'Tailwind CSS', icon: '/icons/tech/tailwind-css.svg' },
    ],
  },
  {
    name: 'Habits+',
    featured: false,
    image: null,
    live: '#',
    github: 'https://github.com/rywndr/habits-plus',
    hasGithub: true,
    hasLive: false,
    description:
      'A multi tenant student progress platform for special needs schools, combining structured behavioral observations, analytics, and LLM assisted weekly reporting with teacher review.',
    technologies: [
      { name: 'React', icon: '/icons/tech/react.svg' },
      { name: 'TanStack', icon: '/icons/tech/tanstack-start.svg' },
      { name: 'PostgreSQL', icon: '/icons/tech/postgresql.svg' },
      { name: 'Better Auth', icon: '/icons/tech/better-auth.svg' },
      { name: 'DeepSeek', icon: '/icons/tech/deepseek.svg' },
    ],
  },
  {
    name: 'Huntsman',
    featured: true,
    image: null,
    live: '#',
    github: '#',
    hasGithub: true,
    hasLive: true,
    description:
      'A full-stack e-commerce platform for a small outdoor retailer, with integrated payments, shipping, inventory management, order fulfillment, and returns.',
    technologies: [
      { name: 'Next.js', icon: '/icons/tech/nextjs.svg' },
      { name: 'PostgreSQL', icon: '/icons/tech/postgresql.svg' },
      { name: 'Midtrans', icon: '/icons/tech/midtrans.svg' },
      { name: 'RajaOngkir', icon: '/icons/tech/rajaongkir.svg' },
    ],
  },
  {
    name: 'Mirai',
    featured: true,
    image: miraiConsoleImage,
    live: '#',
    github: '#',
    hasGithub: false,
    hasLive: false,
    description:
      "Co-developed a headless Pixel Worlds automation platform built by reverse-engineering the game's network protocol. The self-hosted edition runs a Rust bot engine with a Vite/React WebSocket console, while the SaaS edition adds a multi-tenant Rust control plane, gRPC worker nodes, PostgreSQL-backed placement, and a Next.js dashboard.",
    technologies: [
      { name: 'React', icon: '/icons/tech/react.svg' },
      { name: 'Vite', icon: '/icons/tech/vite.svg' },
      { name: 'WebSocket', icon: '/icons/tech/websocket.svg' },
      { name: 'gRPC', icon: '/icons/tech/grpc.svg' },
      { name: 'PostgreSQL', icon: '/icons/tech/postgresql.svg' },
      { name: 'Next.js', icon: '/icons/tech/nextjs.svg' },
      { name: 'Rust', icon: '/icons/tech/rust.svg' },
    ],
  },
  {
    name: 'TikTok Dapp',
    featured: false,
    image: tiktokDappImage,
    live: 'https://tiktokdapp.vercel.app/',
    github: 'https://github.com/rywndr/TikTok-clone-dApp',
    hasGithub: true,
    hasLive: true,
    description:
      'A decentralized short form video app. Users connect an Ethereum wallet to publish posts and interact with content through a custom smart contract.',
    technologies: [
      { name: 'Next.js', icon: '/icons/tech/nextjs.svg' },
      { name: 'Solidity', icon: '/icons/tech/solidity.svg' },
      { name: 'Ethereum', icon: '/icons/tech/ethereum.svg' },
      { name: 'Web3.js', icon: '/icons/tech/web3js.svg' },
      { name: 'wagmi', icon: '/icons/tech/wagmi.svg' },
      { name: 'RainbowKit', icon: '/icons/tech/rainbowkit.svg' },
    ],
  },
] satisfies Project[];

import type { ImageMetadata } from 'astro';

import gcpBountyImage from '@assets/projects/gcp-bounty.webp';

export type AchievementLink = {
  label: string;
  href: string;
  ariaLabel: string;
  icon: 'medium' | 'x';
};

export type Achievement = {
  headingId: string;
  image: ImageMetadata;
  imageAlt: string;
  dates: string;
  title: string;
  description: string;
  linksLabel: string;
  links: AchievementLink[];
};

export const achievements = [
  {
    headingId: 'bounty-heading',
    image: gcpBountyImage,
    imageAlt: 'StackUp and Google Cloud Bounty Challenge',
    dates: 'Top 10 out of 500+ participants',
    title: 'Google Cloud Singapore × StackUp Bounty',
    description:
      'Built and documented a comprehensive guide to setting up and running an Ethereum validator node on Google Cloud infrastructure.',
    linksLabel: 'Bounty achievement links',
    links: [
      {
        href: 'https://medium.com/@haikhalroy/running-an-ethereum-validator-node-google-cloud-challenge-4445bfbdf2a9',
        ariaLabel: 'Read the Medium write-up',
        label: 'read the write-up',
        icon: 'medium',
      },
      {
        href: 'https://x.com/StackUpHQ/status/1701952378776486240',
        ariaLabel: 'View the post on X',
        label: 'view the post',
        icon: 'x',
      },
    ],
  },
] satisfies Achievement[];

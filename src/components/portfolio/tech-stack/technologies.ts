export type Technology = {
  name: string;
  icon: string;
};

export const technologies = [
  { name: 'React', icon: '/icons/tech/react.svg' },
  { name: 'Next.js', icon: '/icons/tech/nextjs.svg' },
  { name: 'JavaScript', icon: '/icons/tech/javascript.svg' },
  { name: 'TypeScript', icon: '/icons/tech/typescript.svg' },
  { name: 'Tailwind CSS', icon: '/icons/tech/tailwind-css.svg' },
  { name: 'PostgreSQL', icon: '/icons/tech/postgresql.svg' },
  { name: 'Docker', icon: '/icons/tech/docker.svg' },
  { name: 'Python', icon: '/icons/tech/python.svg' },
  { name: 'Linux', icon: '/icons/tech/linux.svg' },
] satisfies Technology[];

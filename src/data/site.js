import { existsSync } from 'node:fs';

// The static site is built from the project root, alongside public/.
export const cvUrl = existsSync('public/cv.pdf') ? '/cv.pdf' : null;

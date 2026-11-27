import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default [
  ...nextVitals,
  ...nextTypescript,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', '.cache/**', '*-debug.log'] },
  // Private, authorized blob URLs must not go through a public image optimizer.
  { rules: { '@next/next/no-img-element': 'off' } },
];

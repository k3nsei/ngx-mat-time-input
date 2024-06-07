/**
 * @see https://www.npmjs.com/package/lint-staged
 */
const config = {
  '.husky/!(_){/**,}': 'bunx prettier --write --parser sh',
  '*.{ts,js,mjs,cjs,json,html,css,scss,md,yml,yaml}': 'bunx prettier --write --ignore-unknown',
  'projects/{apps,libs}/**/src/**/*.{ts,html}': 'bunx eslint --fix',
};

export default config;

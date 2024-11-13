// import { join, resolve } from 'path';
const { join, resolve } = require('path');
/**
 * @type {import('@rune-ts/server').RuneConfigType}
 */
module.exports = {
  port: 3001,
  hostname: 'localhost',
  mode: 'render',
  sassOptions: {
    includePaths: [join(resolve(), '../../packages/styles')],
    additionalData: `@import "base";`,
  },
  clientEntry: './src/app/client/index.ts',
  serverEntry: './src/app/server/index.ts',
  watchToReloadPaths: ['../../packages'],
  watchToIgnorePaths: ['**/.env.*', '*.json'],
};

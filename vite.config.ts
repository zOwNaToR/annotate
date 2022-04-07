/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { chromeExtension } from 'rollup-plugin-chrome-extension';
// @ts-ignore
import manifest from './manifest.json';

const path = require('path');

export default defineConfig({
  plugins: [react(), chromeExtension({ manifest })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
  },
});

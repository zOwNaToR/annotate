/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';


export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
	},
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'lib/main.ts'),
			name: 'annotate',
			// the proper extensions will be added
			fileName: 'lib',
		},
	},
});

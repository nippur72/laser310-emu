import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'remove-non-js-assets',
      generateBundle(options, bundle) {
        // Remove any non-JS files from build output (prevent copying WASM/assets to dist)
        for (const file in bundle) {
          if (!file.endsWith('.js') && !file.endsWith('.js.map')) {
            delete bundle[file];
          }
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: '',
    emptyOutDir: false,
    rollupOptions: {
      input: join(__dirname, 'src/index.ts'),
      output: {
        entryFileNames: 'bundle.js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      }
    }
  }
});

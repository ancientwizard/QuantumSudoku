import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5 uses legacy Dart Sass APIs that are deprecated in Sass 1.x.
        // Silence these until Bootstrap ships an update.
        silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'if-function']
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

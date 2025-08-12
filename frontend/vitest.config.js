import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    include: [
      'src/**/*.{test,spec}.{js,jsx}',
      'src/__tests__/**/*.{test,spec}.{js,jsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**', 
      '**/build/**',
      '**/coverage/**',
      'tests/e2e/**', // Exclude E2E tests - these run with Playwright
      'tests/**/*.spec.js' // Exclude playwright spec files
    ],
    coverage: {
      reporter: ['text', 'html', 'json'],
      exclude: [
        'src/main.jsx',
        'src/polyfills.js',
        'src/buffer-polyfill.js',
        'src/__tests__/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
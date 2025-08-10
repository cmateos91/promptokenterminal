import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
      util: 'util',
      crypto: 'crypto-browserify',
      events: 'events'
    }
  },
  optimizeDeps: {
    include: ['buffer', 'stream-browserify', 'util', 'crypto-browserify', 'events']
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    minify: 'esbuild',
    outDir: '../dist',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          solana: ['@solana/web3.js', '@solana/spl-token']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: false
  }
})

// Polyfills for Node.js modules in browser
import { Buffer } from 'buffer'

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.global = window
  window.process = {
    env: {},
    nextTick: (cb) => setTimeout(cb, 0),
    version: '16.0.0',
    browser: true
  }
}

// Also make them available on globalThis
globalThis.Buffer = Buffer
globalThis.global = globalThis
globalThis.process = globalThis.process || {
  env: {},
  nextTick: (cb) => setTimeout(cb, 0),
  version: '16.0.0',
  browser: true
}

export { Buffer }

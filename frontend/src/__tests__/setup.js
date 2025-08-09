import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de funciones globales
global.fetch = vi.fn()

// Mock de Web3 para tests
vi.mock('@solana/web3.js', () => ({
  Connection: vi.fn().mockImplementation(() => ({
    getBalance: vi.fn().mockResolvedValue(1000000000),
    getParsedTokenAccountsByOwner: vi.fn().mockResolvedValue({ value: [] }),
    getAccountInfo: vi.fn().mockResolvedValue(null),
    getSlot: vi.fn().mockResolvedValue(123456789)
  })),
  PublicKey: vi.fn().mockImplementation((key) => {
    // Simular validación real de PublicKey
    if (typeof key !== 'string' || key === 'invalid-address') {
      throw new Error('Invalid public key input');
    }
    return {
      toBase58: () => key,
      toString: () => key,
      toBuffer: () => Buffer.from(key)
    };
  }),
  LAMPORTS_PER_SOL: 1000000000,
  clusterApiUrl: vi.fn().mockReturnValue('https://api.devnet.solana.com')
}))

// Mock de wallet providers
Object.defineProperty(window, 'phantom', {
  value: {
    solana: {
      connect: vi.fn().mockResolvedValue({
        publicKey: { toString: () => 'mock-phantom-address' }
      }),
      disconnect: vi.fn().mockResolvedValue({}),
      isConnected: false
    }
  },
  writable: true
})

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

// Limpiar mocks después de cada test
afterEach(() => {
  vi.clearAllMocks()
})

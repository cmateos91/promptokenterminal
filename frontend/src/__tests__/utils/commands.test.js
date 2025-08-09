import { describe, it, expect, vi, beforeEach } from 'vitest'
import { executeCommand, getCommandSuggestions } from '../../utils/commands'
import { mockWalletState, userProgress } from '../../utils/userState'

// Mock del logger para evitar logs en tests
vi.mock('../../utils/logger', () => ({
  commandLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

// Mock de security para tests
vi.mock('../../utils/security', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    secureCommandExecution: vi.fn((input) => ({
      valid: true,
      command: input,
      remaining: 10
    }))
  }
});

// Mock de performance
vi.mock('../../utils/performance', () => ({
  commandRateLimiter: {
    isAllowed: vi.fn(() => true),
    getRemainingTime: vi.fn(() => 0)
  }
}));

// Mock de tokenGate
vi.mock('../../utils/tokenGate', () => ({
  hasRequiredBalance: vi.fn(() => Promise.resolve(true))
}));

describe('Command System', () => {
  beforeEach(() => {
    // Reset state before each test
    mockWalletState.connected = false
    mockWalletState.address = null
    mockWalletState.balance = 0
    userProgress.commandCount = 0
    userProgress.level = 0
    userProgress.unlockedCommands = new Set([
      'help',
      'connect',
      'clear',
      'disconnect',
      'balance'
    ])
  })

  describe('Basic Commands', () => {
    it('should execute help command', async () => {
      const result = await executeCommand('help')
      expect(result.type).toBe('result')
      expect(result.content).toContain('AVAILABLE COMMANDS')
    })

    it('should execute clear command', async () => {
      const result = await executeCommand('clear')
      expect(result.type).toBe('clear')
    })

    it('should handle unknown command', async () => {
      const result = await executeCommand('nonexistent')
      expect(result.type).toBe('error')
      expect(result.content).toContain('Command not found')
    })

    it('should handle command aliases', async () => {
      const helpResult = await executeCommand('h')
      const clearResult = await executeCommand('c')
      
      expect(helpResult.type).toBe('result')
      expect(clearResult.type).toBe('clear')
    })
  })

  describe('Wallet Commands', () => {
    it('should handle connect command without wallet specified', async () => {
      const result = await executeCommand('connect')
      expect(result.type).toBe('error')
      expect(result.content).toMatch(/USAGE: connect/i)
    })

    it('should handle connect with invalid wallet', async () => {
      const result = await executeCommand('connect invalidwallet')
      expect(result.type).toBe('error')
      expect(result.content).toMatch(/WALLET NOT FOUND/i)
    })

    it('should handle disconnect when not connected', async () => {
      const result = await executeCommand('disconnect')
      expect(result.type).toBe('error')
      expect(result.content).toContain('No wallet connected')
    })

    it('should handle balance when not connected', async () => {
      const result = await executeCommand('balance')
      expect(result.type).toBe('error')
      expect(result.content).toContain('Connect wallet first')
    })
  })

  describe('Staking Commands', () => {
    beforeEach(() => {
      mockWalletState.connected = true
      mockWalletState.address = 'mock-address'
      userProgress.level = 1
      userProgress.unlockedCommands.add('stake')
      userProgress.unlockedCommands.add('status')
    })

    it('should handle stake without amount', async () => {
      const result = await executeCommand('stake')
      expect(result.type).toBe('error')
      expect(result.content).toMatch(/USAGE: stake/i)
    })

    it('should handle stake with invalid amount', async () => {
      const result = await executeCommand('stake abc')
      expect(result.type).toBe('error')
      expect(result.content).toContain('Invalid amount')
    })

    it('should handle valid stake command', async () => {
      const result = await executeCommand('stake 100')
      expect(result.type).toBe('result')
      expect(result.content).toContain('STAKING TRANSACTION COMPLETED')
      expect(mockWalletState.stakedAmount).toBe(100)
    })

    it('should show status', async () => {
      const result = await executeCommand('status')
      expect(result.type).toBe('result')
      expect(result.content).toContain('STAKING STATUS')
    })
  })

  describe('Command Suggestions', () => {
    beforeEach(() => {
      userProgress.unlockedCommands.add('help')
      userProgress.unlockedCommands.add('connect')
      userProgress.unlockedCommands.add('clear')
      userProgress.unlockedCommands.add('balance')
    })

    it('should return suggestions for partial input', () => {
      const suggestions = getCommandSuggestions('c')
      expect(suggestions).toContain('connect')
      expect(suggestions).toContain('clear')
    })

    it('should return exact match for complete command', () => {
      const suggestions = getCommandSuggestions('help')
      expect(suggestions).toContain('help')
    })

    it('should return empty array for no matches', () => {
      const suggestions = getCommandSuggestions('xyz')
      expect(suggestions).toHaveLength(0)
    })
  })

  describe('Command Count and Progression', () => {
    it('should increment command count on execution', async () => {
      const initialCount = userProgress.commandCount
      await executeCommand('help')
      expect(userProgress.commandCount).toBe(initialCount + 1)
    })
  })
})

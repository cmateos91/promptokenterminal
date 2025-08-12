import { describe, it, expect, beforeEach } from 'vitest'
import { InputValidator, CommandRateLimiter, validateTransactionAmount } from '../../utils/security'

describe('Security Utilities', () => {
  describe('InputValidator', () => {
    describe('isValidNumber', () => {
      it('should validate positive numbers', () => {
        const result = InputValidator.isValidNumber('100')
        expect(result.valid).toBe(true)
        expect(result.value).toBe(100)
      })

      it('should reject negative numbers by default', () => {
        const result = InputValidator.isValidNumber('-50')
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Minimum allowed')
      })

      it('should validate numbers within range', () => {
        const result = InputValidator.isValidNumber('50', { min: 10, max: 100 })
        expect(result.valid).toBe(true)
        expect(result.value).toBe(50)
      })

      it('should reject numbers outside range', () => {
        const result = InputValidator.isValidNumber('150', { min: 10, max: 100 })
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Maximum allowed')
      })

      it('should handle decimal validation', () => {
        const result = InputValidator.isValidNumber('10.123456789', { 
          allowDecimals: true, 
          maxDecimals: 6 
        })
        expect(result.valid).toBe(false)
        expect(result.error).toContain('decimals')
      })

      it('should reject decimals when not allowed', () => {
        const result = InputValidator.isValidNumber('10.5', { allowDecimals: false })
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Decimals are not allowed')
      })

      it('should reject invalid strings', () => {
        const result = InputValidator.isValidNumber('abc')
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Invalid')
      })
    })

    describe('isValidSolanaAddress', () => {
      it('should validate correct Solana addresses', () => {
        const validAddress = '11111111111111111111111111111112'
        const result = InputValidator.isValidSolanaAddress(validAddress)
        expect(result.valid).toBe(true)
      })

      it('should reject invalid addresses', () => {
        const result = InputValidator.isValidSolanaAddress('invalid-address')
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Invalid')
      })
    })

    describe('isValidCommand', () => {
      it('should validate normal commands', () => {
        const result = InputValidator.isValidCommand('stake 100')
        expect(result.valid).toBe(true)
      })

      it('should reject commands with dangerous characters', () => {
        const result = InputValidator.isValidCommand('stake <script>')
        expect(result.valid).toBe(false)
        expect(result.error).toContain('invalid characters')
      })

      it('should reject very long commands', () => {
        const longCommand = 'a'.repeat(150)
        const result = InputValidator.isValidCommand(longCommand)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('too long')
      })
    })

    describe('sanitizeString', () => {
      it('should remove dangerous characters', () => {
        const input = 'Hello <script>alert("xss")</script>'
        const result = InputValidator.sanitizeString(input)
        expect(result).not.toContain('<script>')
        expect(result).not.toContain('</script>')
      })

      it('should limit string length', () => {
        const longString = 'a'.repeat(50)
        const result = InputValidator.sanitizeString(longString, 20)
        expect(result.length).toBe(20)
      })

      it('should handle non-string inputs', () => {
        const result = InputValidator.sanitizeString(null)
        expect(result).toBe('')
      })
    })
  })

  describe('CommandRateLimiter', () => {
    let rateLimiter

    beforeEach(() => {
      rateLimiter = new CommandRateLimiter()
    })

    it('should allow commands within limits', () => {
      const result = rateLimiter.isAllowed(1, 'user123') // USER level: 10/min
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9)
    })

    it('should block commands when limit exceeded', () => {
      // Simulate exceeding limit for ANONYMOUS user (5/min)
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed(0, 'anon')
      }
      
      const result = rateLimiter.isAllowed(0, 'anon')
      expect(result.allowed).toBe(false)
      expect(result.error).toContain('Command limit reached')
    })

    it('should have different limits for different user levels', () => {
      const anonymousLimit = rateLimiter.userLimits[0].commands
      const userLimit = rateLimiter.userLimits[1].commands
      const hackerLimit = rateLimiter.userLimits[4].commands
      
      expect(anonymousLimit).toBe(5)
      expect(userLimit).toBe(10)
      expect(hackerLimit).toBe(50)
    })

    it('should track remaining commands correctly', () => {
      rateLimiter.isAllowed(2, 'staker123') // STAKER level: 20/min
      rateLimiter.isAllowed(2, 'staker123')
      
      const remaining = rateLimiter.getRemainingCommands(2, 'staker123')
      expect(remaining).toBe(18)
    })
  })

  describe('validateTransactionAmount', () => {
    it('should validate valid transaction amounts', () => {
      const result = validateTransactionAmount('1.5', 10.0, 9)
      expect(result.valid).toBe(true)
      expect(result.value).toBe(1.5)
    })

    it('should reject amounts larger than balance', () => {
      const result = validateTransactionAmount('15', 10.0, 9)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Maximum allowed')
    })

    it('should reject very small amounts', () => {
      const result = validateTransactionAmount('0.0001', 10.0, 9)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('too small')
    })

    it('should respect decimal limits', () => {
      const result = validateTransactionAmount('1.123456789123', 10.0, 6)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('decimals')
    })

    it('should handle edge cases', () => {
      // Exactly minimum amount
      const minResult = validateTransactionAmount('0.001', 10.0, 9)
      expect(minResult.valid).toBe(true)
      
      // Exactly maximum amount
      const maxResult = validateTransactionAmount('10', 10.0, 9)
      expect(maxResult.valid).toBe(true)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger, performanceLogger, walletLogger, rpcLogger, Logger, LogLevel } from '../../utils/logger'

describe('Logging System', () => {
  beforeEach(() => {
    // Clear console mocks
    vi.clearAllMocks()

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Reset logger state
    logger.level = LogLevel.DEBUG
    logger.enableStorage = true
    logger.clearLogs()
  })

  describe('Logger', () => {
    it('should log messages with correct level', () => {
      logger.info('Test info message')
      logger.error('Test error message')
      logger.warn('Test warning message')
      
      expect(console.log).toHaveBeenCalled()
    })

    it('should respect log levels', () => {
      // Set logger to ERROR level only
      logger.level = 0 // LogLevel.ERROR
      
      logger.error('This should appear')
      logger.info('This should not appear')
      
      // Error should be logged, info should not
      const logCalls = console.log.mock.calls
      const errorLogs = logCalls.filter(call => 
        call[0] && call[0].includes('ERROR')
      )
      const infoLogs = logCalls.filter(call => 
        call[0] && call[0].includes('INFO')
      )
      
      expect(errorLogs.length).toBeGreaterThan(0)
      expect(infoLogs.length).toBe(0)
    })

    it('should store logs when storage is enabled', () => {
      // Create a new logger instance for this test
      const testLogger = new Logger({
        enableStorage: true,
        component: 'TEST'
      });
      testLogger.clearLogs();
      
      testLogger.info('Stored message');
      
      const logs = testLogger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Stored message');
      expect(logs[0].level).toBe('INFO');
    })

    it('should filter logs correctly', () => {
      logger.enableStorage = true
      logger.clearLogs()
      
      logger.error('Error message')
      logger.info('Info message')
      logger.debug('Debug message')
      
      // Filter only ERROR level
      const errorLogs = logger.getLogs({ level: 0 })
      expect(errorLogs.length).toBe(1)
      expect(errorLogs[0].level).toBe('ERROR')
    })

    it('should export logs as text', () => {
      logger.enableStorage = true
      logger.clearLogs()
      
      logger.info('Test message 1')
      logger.error('Test message 2')
      
      const exported = logger.exportLogs()
      expect(exported).toContain('Test message 1')
      expect(exported).toContain('Test message 2')
      expect(exported).toContain('[INFO]')
      expect(exported).toContain('[ERROR]')
    })

    it('should maintain storage limits', () => {
      logger.enableStorage = true
      logger.maxStorageSize = 5
      logger.clearLogs()
      
      // Add more logs than the limit
      for (let i = 0; i < 10; i++) {
        logger.info(`Message ${i}`)
      }
      
      const logs = logger.getLogs()
      expect(logs.length).toBeLessThanOrEqual(5)
      
      // Should keep the most recent logs
      expect(logs[logs.length - 1].message).toBe('Message 9')
    })
  })

  describe('PerformanceLogger', () => {
    it('should measure operation duration', () => {
      performanceLogger.startTimer('test-operation')
      
      // Simulate some work
      const start = performance.now()
      while (performance.now() - start < 10) {
        // Wait 10ms
      }
      
      const duration = performanceLogger.endTimer('test-operation', 5)
      expect(duration).toBeGreaterThan(5)
    })

    it('should warn about slow operations', () => {
      vi.spyOn(performanceLogger.logger, 'warn')
      
      performanceLogger.startTimer('slow-operation')
      
      // Simulate slow work
      const start = performance.now()
      while (performance.now() - start < 20) {
        // Wait 20ms
      }
      
      performanceLogger.endTimer('slow-operation', 10) // 10ms threshold
      
      expect(performanceLogger.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow operation'),
        expect.objectContaining({
          duration: expect.stringContaining('ms')
        })
      )
    })

    it('should measure async functions', async () => {
      const slowAsyncFn = async (delay) => {
        await new Promise(resolve => setTimeout(resolve, delay))
        return 'completed'
      }
      
      const measuredFn = performanceLogger.measureAsync(
        'async-test',
        slowAsyncFn,
        50 // 50ms threshold
      )
      
      const result = await measuredFn(60) // 60ms delay
      expect(result).toBe('completed')
    })

    it('should handle timer errors gracefully', () => {
      vi.spyOn(performanceLogger.logger, 'warn')
      
      // Try to end a timer that was never started
      performanceLogger.endTimer('nonexistent-timer')
      
      expect(performanceLogger.logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Timer "nonexistent-timer" not found')
      )
    })
  })

  describe('Component-specific loggers', () => {
    it('should have correct component names', () => {
      walletLogger.enableStorage = true
      rpcLogger.enableStorage = true
      
      walletLogger.info('Wallet test')
      rpcLogger.error('RPC test')
      
      const walletLogs = walletLogger.getLogs()
      const rpcLogs = rpcLogger.getLogs()
      
      expect(walletLogs[walletLogs.length - 1].component).toBe('WALLET')
      expect(rpcLogs[rpcLogs.length - 1].component).toBe('RPC')
    })
  })

  describe('Error boundary logging', () => {
    it('should capture unhandled errors', () => {
      vi.spyOn(logger, 'error')
      
      // Simulate an unhandled error event
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 42,
        colno: 10,
        error: new Error('Test error')
      })
      
      window.dispatchEvent(errorEvent)
      
      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled JavaScript error',
        expect.objectContaining({
          message: 'Test error',
          filename: 'test.js',
          lineno: 42
        })
      )
    })

    it('should capture unhandled promise rejections', () => {
      vi.spyOn(logger, 'error')

      // Simulate an unhandled promise rejection
      const rejectionEvent = new Event('unhandledrejection')
      Object.assign(rejectionEvent, {
        promise: Promise.resolve(),
        reason: new Error('Test rejection')
      })

      window.dispatchEvent(rejectionEvent)

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled promise rejection',
        expect.objectContaining({
          reason: expect.stringContaining('Test rejection')
        })
      )
    })
  })
})

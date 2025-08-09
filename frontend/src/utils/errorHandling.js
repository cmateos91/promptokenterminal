/**
 * Advanced error handling and recovery system
 */

import { logger, walletLogger, rpcLogger } from './logger';

export class TerminalError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'TerminalError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class WalletError extends TerminalError {
  constructor(message, code, context = {}) {
    super(message, code, context);
    this.name = 'WalletError';
  }
}

export class RPCError extends TerminalError {
  constructor(message, code, context = {}) {
    super(message, code, context);
    this.name = 'RPCError';
  }
}

export class ValidationError extends TerminalError {
  constructor(message, field, value, context = {}) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

// Error codes
export const ErrorCodes = {
  // Wallet errors
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  WALLET_CONNECTION_FAILED: 'WALLET_CONNECTION_FAILED',
  WALLET_DISCONNECTION_FAILED: 'WALLET_DISCONNECTION_FAILED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_PUBLIC_KEY: 'INVALID_PUBLIC_KEY',
  
  // RPC errors
  RPC_CONNECTION_FAILED: 'RPC_CONNECTION_FAILED',
  RPC_TIMEOUT: 'RPC_TIMEOUT',
  RPC_RATE_LIMITED: 'RPC_RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // Command errors
  COMMAND_NOT_FOUND: 'COMMAND_NOT_FOUND',
  COMMAND_ACCESS_DENIED: 'COMMAND_ACCESS_DENIED',
  COMMAND_RATE_LIMITED: 'COMMAND_RATE_LIMITED',
  INVALID_ARGUMENTS: 'INVALID_ARGUMENTS',
  
  // Token errors
  TOKEN_FETCH_FAILED: 'TOKEN_FETCH_FAILED',
  TOKEN_BALANCE_CHECK_FAILED: 'TOKEN_BALANCE_CHECK_FAILED',
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE',
  
  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

// Error recovery strategies
export const RecoveryStrategies = {
  RETRY: 'RETRY',
  FALLBACK: 'FALLBACK',
  PROMPT_USER: 'PROMPT_USER',
  GRACEFUL_DEGRADATION: 'GRACEFUL_DEGRADATION',
  IGNORE: 'IGNORE'
};

// Error handler registry
class ErrorHandlerRegistry {
  constructor() {
    this.handlers = new Map();
    this.globalHandlers = [];
    this.setupDefaultHandlers();
  }

  setupDefaultHandlers() {
    // Wallet error handlers
    this.register(ErrorCodes.WALLET_NOT_FOUND, (error) => ({
      strategy: RecoveryStrategies.PROMPT_USER,
      message: `❌ WALLET NOT FOUND\n\nWallet: ${error.context.walletType}\nSolution: Install wallet extension or try another wallet\n\nAvailable: phantom, solflare`,
      action: 'showWalletOptions'
    }));

    this.register(ErrorCodes.WALLET_CONNECTION_FAILED, (error) => ({
      strategy: RecoveryStrategies.RETRY,
      message: `🔌 CONNECTION FAILED\n\nWallet: ${error.context.walletType}\nError: ${error.message}\n\nTry: Unlock wallet and retry connection`,
      retryable: true,
      maxRetries: 3
    }));

    this.register(ErrorCodes.INSUFFICIENT_BALANCE, (error) => ({
      strategy: RecoveryStrategies.GRACEFUL_DEGRADATION,
      message: `💰 INSUFFICIENT BALANCE\n\nRequired: ${error.context.required}\nAvailable: ${error.context.available}\n\nAdd funds to continue`,
      action: 'showBalance'
    }));

    // RPC error handlers
    this.register(ErrorCodes.RPC_CONNECTION_FAILED, (error) => ({
      strategy: RecoveryStrategies.FALLBACK,
      message: `🌐 NETWORK ERROR\n\nEndpoint: ${error.context.endpoint}\nSwitching to backup RPC...`,
      action: 'switchRPCEndpoint',
      fallbackEndpoint: error.context.fallbackEndpoint
    }));

    this.register(ErrorCodes.RPC_RATE_LIMITED, (error) => ({
      strategy: RecoveryStrategies.RETRY,
      message: `⏱️ RATE LIMITED\n\nToo many requests to ${error.context.endpoint}\nWait ${error.context.retryAfter}s before retrying`,
      retryAfter: error.context.retryAfter || 30,
      exponentialBackoff: true
    }));

    // Command error handlers
    this.register(ErrorCodes.COMMAND_ACCESS_DENIED, (error) => ({
      strategy: RecoveryStrategies.PROMPT_USER,
      message: `🔒 ACCESS DENIED\n\nCommand: ${error.context.command}\nLevel required: ${error.context.requiredLevel}\nCurrent level: ${error.context.currentLevel}\n\nLevel up to unlock this command`,
      action: 'showLevelUpInfo'
    }));

    this.register(ErrorCodes.INSUFFICIENT_TOKEN_BALANCE, (error) => ({
      strategy: RecoveryStrategies.GRACEFUL_DEGRADATION,
      message: `🪙 TOKEN BALANCE TOO LOW\n\nRequired: ${error.context.required} ${error.context.symbol}\nCurrent: ${error.context.current} ${error.context.symbol}\n\nAcquire more ${error.context.symbol} tokens to access premium features`,
      action: 'showTokenInfo'
    }));
  }

  register(errorCode, handler) {
    this.handlers.set(errorCode, handler);
  }

  registerGlobal(handler) {
    this.globalHandlers.push(handler);
  }

  handle(error) {
    logger.error('Handling error', {
      code: error.code,
      message: error.message,
      context: error.context
    });

    // Try specific handler first
    if (error.code && this.handlers.has(error.code)) {
      const handler = this.handlers.get(error.code);
      const result = handler(error);
      return this.formatHandlerResult(result, error);
    }

    // Try global handlers
    for (const handler of this.globalHandlers) {
      try {
        const result = handler(error);
        if (result) {
          return this.formatHandlerResult(result, error);
        }
      } catch (handlerError) {
        logger.error('Error in global handler', { error: handlerError.message });
      }
    }

    // Fallback to generic error handling
    return this.handleGenericError(error);
  }

  formatHandlerResult(result, originalError) {
    return {
      type: 'error',
      content: result.message,
      strategy: result.strategy,
      retryable: result.retryable || false,
      maxRetries: result.maxRetries || 1,
      retryAfter: result.retryAfter || 1,
      action: result.action,
      originalError,
      timestamp: new Date().toISOString()
    };
  }

  handleGenericError(error) {
    const message = error.message || 'An unexpected error occurred';
    
    logger.error('Unhandled error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context: error.context
    });

    return {
      type: 'error',
      content: `💥 UNEXPECTED ERROR\n\n${message}\n\nPlease try again or contact support if the problem persists.`,
      strategy: RecoveryStrategies.PROMPT_USER,
      retryable: true,
      maxRetries: 1,
      originalError: error,
      timestamp: new Date().toISOString()
    };
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandlerRegistry();

// Utility functions for creating specific errors
export function createWalletError(message, code, context = {}) {
  const error = new WalletError(message, code, context);
  walletLogger.error(message, context);
  return error;
}

export function createRPCError(message, code, context = {}) {
  const error = new RPCError(message, code, context);
  rpcLogger.error(message, context);
  return error;
}

export function createValidationError(message, field, value, context = {}) {
  const error = new ValidationError(message, field, value, context);
  logger.error(`Validation error in ${field}`, { value, context });
  return error;
}

// Async error wrapper for better error handling
export function withErrorHandling(asyncFn, context = {}) {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      // Enhance error with context
      if (error instanceof TerminalError) {
        error.context = { ...error.context, ...context };
      } else {
        // Convert generic errors to TerminalError
        const terminalError = new TerminalError(
          error.message,
          ErrorCodes.INTERNAL_ERROR,
          { ...context, originalError: error.name }
        );
        terminalError.stack = error.stack;
        throw terminalError;
      }
      throw error;
    }
  };
}

// Error boundary hook for React components
export function useErrorBoundary() {
  return {
    captureError: (error, errorInfo = {}) => {
      logger.error('React error boundary caught error', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
      
      return errorHandler.handle(error);
    }
  };
}

export default errorHandler;

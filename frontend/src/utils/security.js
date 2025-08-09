/**
 * Security utilities for input validation and sanitization
 */

import { PublicKey } from '@solana/web3.js';

/**
 * Input validation utilities
 */
export class InputValidator {
  static isValidNumber(input, options = {}) {
    const {
      min = 0,
      max = Infinity,
      allowDecimals = true,
      maxDecimals = 18
    } = options;

    if (typeof input === 'string') {
      input = input.trim();
    }

    const num = parseFloat(input);
    
    if (isNaN(num) || !isFinite(num)) {
      return { valid: false, error: 'Número inválido' };
    }

    if (num < min) {
      return { valid: false, error: `Mínimo permitido: ${min}` };
    }

    if (num > max) {
      return { valid: false, error: `Máximo permitido: ${max}` };
    }

    if (!allowDecimals && num !== Math.floor(num)) {
      return { valid: false, error: 'No se permiten decimales' };
    }

    if (allowDecimals && maxDecimals > 0) {
      const decimals = input.toString().split('.')[1];
      if (decimals && decimals.length > maxDecimals) {
        return { valid: false, error: `Máximo ${maxDecimals} decimales` };
      }
    }

    return { valid: true, value: num };
  }

  static isValidSolanaAddress(address) {
    try {
      new PublicKey(address);
      return { valid: true, address };
    } catch (error) {
      return { valid: false, error: 'Dirección de Solana inválida' };
    }
  }

  static isValidCommand(command) {
    // Solo permitir caracteres alfanuméricos, guiones y espacios
    const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
    
    if (!validPattern.test(command)) {
      return { valid: false, error: 'Comando contiene caracteres inválidos' };
    }

    if (command.length > 100) {
      return { valid: false, error: 'Comando demasiado largo' };
    }

    return { valid: true, command: command.trim() };
  }

  static sanitizeString(input, maxLength = 1000) {
    if (typeof input !== 'string') {
      return '';
    }

    // Remover caracteres peligrosos
    const sanitized = input
      .replace(/[<>\"']/g, '') // Remove HTML chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .substring(0, maxLength)
      .trim();

    return sanitized;
  }
}

/**
 * Rate limiting for commands based on user level
 */
export class CommandRateLimiter {
  constructor() {
    this.userLimits = {
      0: { commands: 5, window: 60000 },   // ANONYMOUS: 5/min
      1: { commands: 10, window: 60000 },  // USER: 10/min
      2: { commands: 20, window: 60000 },  // STAKER: 20/min
      3: { commands: 30, window: 60000 },  // EXPERT: 30/min
      4: { commands: 50, window: 60000 }   // HACKER: 50/min
    };

    this.commandHistory = new Map();
  }

  isAllowed(userLevel, userAddress) {
    const limits = this.userLimits[userLevel] || this.userLimits[0];
    const key = `${userAddress || 'anonymous'}_${userLevel}`;
    const now = Date.now();

    const history = this.commandHistory.get(key) || [];
    
    // Remove old commands outside window
    const validCommands = history.filter(timestamp => 
      now - timestamp < limits.window
    );

    if (validCommands.length >= limits.commands) {
      const oldestCommand = Math.min(...validCommands);
      const resetTime = oldestCommand + limits.window;
      const waitTime = Math.ceil((resetTime - now) / 1000);
      
      return {
        allowed: false,
        error: `Límite de comandos alcanzado. Espera ${waitTime}s`,
        resetIn: waitTime
      };
    }

    // Add current command
    validCommands.push(now);
    this.commandHistory.set(key, validCommands);

    return {
      allowed: true,
      remaining: limits.commands - validCommands.length
    };
  }

  getRemainingCommands(userLevel, userAddress) {
    const limits = this.userLimits[userLevel] || this.userLimits[0];
    const key = `${userAddress || 'anonymous'}_${userLevel}`;
    const now = Date.now();

    const history = this.commandHistory.get(key) || [];
    const validCommands = history.filter(timestamp => 
      now - timestamp < limits.window
    );

    return limits.commands - validCommands.length;
  }
}

/**
 * Wallet connection security checks
 */
export class WalletSecurityChecker {
  static validateWalletProvider(provider) {
    if (!provider) {
      return { valid: false, error: 'Proveedor de wallet no encontrado' };
    }

    // Check if provider has required methods
    const requiredMethods = ['connect', 'disconnect'];
    for (const method of requiredMethods) {
      if (typeof provider[method] !== 'function') {
        return { 
          valid: false, 
          error: `Proveedor inválido: falta método ${method}` 
        };
      }
    }

    return { valid: true };
  }

  static isValidPublicKey(publicKey) {
    try {
      if (!publicKey || typeof publicKey.toBase58 !== 'function') {
        return false;
      }
      
      const address = publicKey.toBase58();
      return address.length >= 32 && address.length <= 44;
    } catch (error) {
      return false;
    }
  }

  static checkWalletPermissions(provider) {
    // Check for suspicious wallet behavior
    const checks = {
      autoConnect: provider.isConnected === true,
      hasPublicKey: !!provider.publicKey,
      hasSignMethods: typeof provider.signTransaction === 'function'
    };

    return checks;
  }
}

/**
 * Command execution security wrapper
 */
export function secureCommandExecution(command, userLevel, userAddress) {
  // Validate command input
  const commandValidation = InputValidator.isValidCommand(command);
  if (!commandValidation.valid) {
    return { error: commandValidation.error };
  }

  // Check rate limits
  const rateLimiter = new CommandRateLimiter();
  const rateCheck = rateLimiter.isAllowed(userLevel, userAddress);
  if (!rateCheck.allowed) {
    return { error: rateCheck.error };
  }

  // Sanitize command
  const sanitizedCommand = InputValidator.sanitizeString(command, 100);
  
  return {
    valid: true,
    command: sanitizedCommand,
    remaining: rateCheck.remaining
  };
}

/**
 * Transaction amount validation
 */
export function validateTransactionAmount(amount, balance, decimals = 9) {
  const validation = InputValidator.isValidNumber(amount, {
    min: 0.000000001,
    max: balance,
    allowDecimals: true,
    maxDecimals: decimals
  });

  if (!validation.valid) {
    return validation;
  }

  // Check if amount is too small for network fees
  if (validation.value < 0.001) {
    return {
      valid: false,
      error: 'Cantidad muy pequeña para cubrir fees de red'
    };
  }

  return validation;
}

export const securityUtils = {
  InputValidator,
  CommandRateLimiter,
  WalletSecurityChecker,
  secureCommandExecution,
  validateTransactionAmount
};

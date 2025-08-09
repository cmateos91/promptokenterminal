/**
 * Advanced logging system with levels, formatting, and persistence
 */

export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

class Logger {
  constructor(options = {}) {
    this.level = options.level || LogLevel.INFO;
    this.enableConsole = options.enableConsole !== false;
    this.enableStorage = options.enableStorage || false;
    this.maxStorageSize = options.maxStorageSize || 1000;
    this.component = options.component || 'APP';
    this.logs = [];
  }

  log(level, message, data = null, component = null) {
    if (level > this.level) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: this.getLevelName(level),
      component: component || this.component,
      message,
      data: data ? JSON.stringify(data) : null,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Console output with formatting
    if (this.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Store in memory
    if (this.enableStorage) {
      this.storeLog(logEntry);
    }

    return logEntry;
  }

  error(message, data = null, component = null) {
    return this.log(LogLevel.ERROR, message, data, component);
  }

  warn(message, data = null, component = null) {
    return this.log(LogLevel.WARN, message, data, component);
  }

  info(message, data = null, component = null) {
    return this.log(LogLevel.INFO, message, data, component);
  }

  debug(message, data = null, component = null) {
    return this.log(LogLevel.DEBUG, message, data, component);
  }

  trace(message, data = null, component = null) {
    return this.log(LogLevel.TRACE, message, data, component);
  }

  getLevelName(level) {
    const names = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
    return names[level] || 'UNKNOWN';
  }

  logToConsole(entry) {
    const { level, component, message, timestamp, data } = entry;
    const timeStr = new Date(timestamp).toLocaleTimeString();
    const prefix = `[${timeStr}] ${level} [${component}]`;

    const style = this.getConsoleStyle(entry.level);
    
    if (data) {
      console.log(`%c${prefix} ${message}`, style, JSON.parse(data));
    } else {
      console.log(`%c${prefix} ${message}`, style);
    }
  }

  getConsoleStyle(level) {
    const styles = {
      ERROR: 'color: #ff4444; font-weight: bold',
      WARN: 'color: #ffaa00; font-weight: bold',
      INFO: 'color: #00ff41; font-weight: normal',
      DEBUG: 'color: #44aaff; font-weight: normal',
      TRACE: 'color: #888888; font-weight: normal'
    };
    return styles[level] || '';
  }

  storeLog(entry) {
    this.logs.push(entry);
    
    // Maintain max storage size
    if (this.logs.length > this.maxStorageSize) {
      this.logs = this.logs.slice(-this.maxStorageSize);
    }
    
    // Persist to localStorage if available
    try {
      const recentLogs = this.logs.slice(-100); // Store last 100 logs
      localStorage.setItem('terminal_logs', JSON.stringify(recentLogs));
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  getLogs(filter = {}) {
    let filteredLogs = [...this.logs];

    if (filter.level !== undefined) {
      filteredLogs = filteredLogs.filter(log => 
        LogLevel[log.level] <= filter.level
      );
    }

    if (filter.component) {
      filteredLogs = filteredLogs.filter(log => 
        log.component === filter.component
      );
    }

    if (filter.since) {
      const sinceTime = new Date(filter.since).getTime();
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp).getTime() >= sinceTime
      );
    }

    return filteredLogs;
  }

  exportLogs() {
    const logsText = this.logs
      .map(log => `${log.timestamp} [${log.level}] [${log.component}] ${log.message}${log.data ? ' ' + log.data : ''}`)
      .join('\n');
    
    return logsText;
  }

  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('terminal_logs');
    } catch (error) {
      // Ignore
    }
  }

  // Load logs from localStorage on initialization
  loadPersistedLogs() {
    try {
      const stored = localStorage.getItem('terminal_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      this.warn('Failed to load persisted logs', { error: error.message });
    }
  }
}

// Performance monitoring
export class PerformanceLogger {
  constructor(logger) {
    this.logger = logger;
    this.timers = new Map();
  }

  startTimer(name) {
    this.timers.set(name, {
      start: performance.now(),
      name
    });
  }

  endTimer(name, threshold = 1000) {
    const timer = this.timers.get(name);
    if (!timer) {
      this.logger.warn(`Timer "${name}" not found`);
      return;
    }

    const duration = performance.now() - timer.start;
    this.timers.delete(name);

    if (duration > threshold) {
      this.logger.warn(`Slow operation: ${name}`, { 
        duration: `${duration.toFixed(2)}ms`,
        threshold: `${threshold}ms`
      });
    } else {
      this.logger.debug(`Operation completed: ${name}`, { 
        duration: `${duration.toFixed(2)}ms` 
      });
    }

    return duration;
  }

  measureAsync(name, asyncFn, threshold = 1000) {
    return async (...args) => {
      this.startTimer(name);
      try {
        const result = await asyncFn(...args);
        this.endTimer(name, threshold);
        return result;
      } catch (error) {
        this.endTimer(name, threshold);
        this.logger.error(`Error in ${name}`, { error: error.message });
        throw error;
      }
    };
  }
}

// Global logger instances
export const logger = new Logger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableStorage: true,
  component: 'TERMINAL'
});

export const performanceLogger = new PerformanceLogger(logger);

// Component-specific loggers
export const walletLogger = new Logger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableStorage: true,
  component: 'WALLET'
});

export const rpcLogger = new Logger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN,
  enableConsole: true,
  enableStorage: true,
  component: 'RPC'
});

export const commandLogger = new Logger({
  level: LogLevel.INFO,
  enableConsole: true,
  enableStorage: true,
  component: 'COMMAND'
});

// Export the Logger class for testing
export { Logger, PerformanceLogger };

// Initialize persisted logs
logger.loadPersistedLogs();
walletLogger.loadPersistedLogs();
rpcLogger.loadPersistedLogs();
commandLogger.loadPersistedLogs();

// Error boundary logging
window.addEventListener('error', (event) => {
  logger.error('Unhandled JavaScript error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', {
    reason: event.reason?.toString(),
    stack: event.reason?.stack
  });
});

export default logger;

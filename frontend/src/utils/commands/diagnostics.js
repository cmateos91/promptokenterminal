/**
 * System diagnostics and monitoring commands - Simplified version
 */

import { mockWalletState, userProgress, getUserStatus } from "../userState";
import { getNetworkInfo } from "../solana";
import { devLogger, logger } from "../logger";

// Validation for development commands - only allow on localhost:3000
const isDevelopmentEnvironment = () => {
  return (
    window.location.hostname === "localhost" && window.location.port === "3000"
  );
};

const requireDevelopmentEnvironment = (commandName) => {
  if (!isDevelopmentEnvironment()) {
    return {
      type: "error",
      content: `🚫 DEVELOPMENT COMMAND RESTRICTED\n\nThe "${commandName}" command is only available in development environment.\n\nRequired: http://localhost\nCurrent: ${window.location.href}\n\n🔒 This command is restricted for security reasons.`,
    };
  }
  return null;
};

// Safe diagnostic commands for production users
export const userDiagnosticCommands = {
  logs: (args) => {
    const filter = args[0] || "all";

    try {
      let logs;

      switch (filter.toLowerCase()) {
        case "wallet":
          logs = logger.getLogs({ component: "WALLET" }).slice(-10);
          break;
        case "command":
          logs = logger.getLogs({ component: "COMMAND" }).slice(-10);
          break;
        case "error":
          logs = logger
            .getLogs()
            .filter((log) => log.level === "ERROR")
            .slice(-10);
          break;
        case "recent":
          logs = logger
            .getLogs({
              since: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
            })
            .slice(-15);
          break;
        default:
          logs = logger.getLogs().slice(-10);
      }

      if (logs.length === 0) {
        return {
          type: "result",
          content: `📋 No logs found for filter: ${filter}`,
        };
      }

      // Filter out sensitive information from logs
      const safeLogs = logs.map(log => ({
        ...log,
        message: log.message.replace(/\b[A-Za-z0-9]{32,}\b/g, '[REDACTED]'), // Hide potential addresses/keys
      }));

      const logDisplay = safeLogs
        .map((log) => {
          const time = new Date(log.timestamp).toLocaleTimeString();
          return `[${time}] ${log.level} ${log.component}: ${log.message}`;
        })
        .join("\n");

      return {
        type: "result",
        content: `📋 SYSTEM LOGS (${filter.toUpperCase()})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${logDisplay}\n\nFilters: all, wallet, command, error, recent`,
      };
    } catch (error) {
      return {
        type: "error",
        content: "Error retrieving logs: " + error.message,
      };
    }
  },

  health: async () => {
    const checks = [];

    // Wallet health (without sensitive info)
    if (mockWalletState.connected) {
      checks.push({
        component: "Wallet",
        status: "healthy",
        details: `${mockWalletState.walletType} connected`,
      });
    } else {
      checks.push({
        component: "Wallet",
        status: "disconnected",
        details: "No wallet connected",
      });
    }

    // Network health
    try {
      const networkInfo = getNetworkInfo();
      checks.push({
        component: "Network",
        status: "healthy",
        details: `Connected to ${networkInfo.network}`,
      });
    } catch (error) {
      checks.push({
        component: "Network",
        status: "unhealthy",
        details: "Network connection issues",
      });
    }

    const healthDisplay = checks
      .map((check) => {
        const statusIcon =
          check.status === "healthy"
            ? "✅"
            : check.status === "warning"
            ? "⚠️"
            : "❌";
        return `${statusIcon} ${check.component}: ${check.status}\n   ${check.details}`;
      })
      .join("\n\n");

    const overallHealth = checks.every((c) => c.status === "healthy")
      ? "HEALTHY"
      : checks.some((c) => c.status === "unhealthy")
      ? "UNHEALTHY"
      : "WARNING";

    return {
      type: "result",
      content: `🏥 SYSTEM HEALTH CHECK\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Status: ${overallHealth}\n\n${healthDisplay}\n\nLast check: ${new Date().toLocaleTimeString()}`,
    };
  },

  performance: () => {
    const stats = {
      memoryUsage: performance.memory
        ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            percentage: Math.round(
              (performance.memory.usedJSHeapSize /
                performance.memory.totalJSHeapSize) *
                100
            ),
          }
        : null,
      connectionTiming: {
        navigation: performance.timing
          ? performance.timing.loadEventEnd - performance.timing.navigationStart
          : "Not available",
        domContentLoaded: performance.timing
          ? performance.timing.domContentLoadedEventEnd -
            performance.timing.navigationStart
          : "Not available",
      },
    };

    let content =
      "⚡ PERFORMANCE METRICS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    if (stats.memoryUsage) {
      content += `Memory Usage: ${stats.memoryUsage.used}MB / ${stats.memoryUsage.total}MB (${stats.memoryUsage.percentage}%)\n`;
    }

    content += `Page Load Time: ${stats.connectionTiming.navigation}ms\n`;
    content += `DOM Ready: ${stats.connectionTiming.domContentLoaded}ms\n`;
    content += `Commands Executed: ${userProgress.commandCount}\n`;
    content += `\nSystem performance is being monitored`;

    return {
      type: "result",
      content,
    };
  },

  cache: () => {
    return {
      type: "result",
      content: `🗄️ CACHE STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCache System: Active\nStatus: Working\n\nUse: cache <status|stats|clear>`,
    };
  },
};

// Development-only commands with sensitive information
export const diagnosticCommands = {
  ...userDiagnosticCommands, // Include safe commands
  
  debug: (args) => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("debug");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const component = args[0] || "system";
    const userStatus = getUserStatus();
    const networkInfo = getNetworkInfo();

    const debugInfo = {
      system: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        performance: {
          memory: performance.memory
            ? {
                used:
                  Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) +
                  "MB",
                total:
                  Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) +
                  "MB",
                limit:
                  Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) +
                  "MB",
              }
            : "Not available",
        },
      },
      wallet: {
        connected: mockWalletState.connected,
        type: mockWalletState.walletType,
        address: mockWalletState.address,
        balance: mockWalletState.balance,
        isReal: mockWalletState.isReal,
        connectionTime: mockWalletState.connectionTime,
      },
      user: {
        level: userStatus.level,
        name: userStatus.name,
        commandCount: userStatus.commandCount,
        secretsFound: userStatus.secretsFound,
        unlockedCommands: Array.from(userProgress.unlockedCommands).length,
      },
      network: {
        ...networkInfo,
        rpcHealth: "Unknown",
      },
    };

    let displayInfo;
    switch (component.toLowerCase()) {
      case "wallet":
        displayInfo = JSON.stringify(debugInfo.wallet, null, 2);
        break;
      case "user":
        displayInfo = JSON.stringify(debugInfo.user, null, 2);
        break;
      case "network":
        displayInfo = JSON.stringify(debugInfo.network, null, 2);
        break;
      default:
        displayInfo = JSON.stringify(debugInfo, null, 2);
    }

    return {
      type: "result",
      content: `🔍 DEBUG INFO (${component.toUpperCase()})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${displayInfo}\n\nUse: debug <system|wallet|user|network>`,
    };
  },

  health: async () => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("health");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const checks = [];

    // Wallet health
    if (mockWalletState.connected) {
      checks.push({
        component: "Wallet",
        status: "healthy",
        details: `${mockWalletState.walletType} connected`,
      });
    } else {
      checks.push({
        component: "Wallet",
        status: "disconnected",
        details: "No wallet connected",
      });
    }

    // Network health
    try {
      const networkInfo = getNetworkInfo();
      checks.push({
        component: "Network",
        status: "healthy",
        details: `Connected to ${networkInfo.network}`,
      });
    } catch (error) {
      checks.push({
        component: "Network",
        status: "unhealthy",
        details: error.message,
      });
    }

    const healthDisplay = checks
      .map((check) => {
        const statusIcon =
          check.status === "healthy"
            ? "✅"
            : check.status === "warning"
            ? "⚠️"
            : "❌";
        return `${statusIcon} ${check.component}: ${check.status}\n   ${check.details}`;
      })
      .join("\n\n");

    const overallHealth = checks.every((c) => c.status === "healthy")
      ? "HEALTHY"
      : checks.some((c) => c.status === "unhealthy")
      ? "UNHEALTHY"
      : "WARNING";

    return {
      type: "result",
      content: `🏥 SYSTEM HEALTH CHECK\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Status: ${overallHealth}\n\n${healthDisplay}\n\nLast check: ${new Date().toLocaleTimeString()}`,
    };
  },

  performance: () => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("performance");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const stats = {
      memoryUsage: performance.memory
        ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            percentage: Math.round(
              (performance.memory.usedJSHeapSize /
                performance.memory.totalJSHeapSize) *
                100
            ),
          }
        : null,
      connectionTiming: {
        navigation: performance.timing
          ? performance.timing.loadEventEnd - performance.timing.navigationStart
          : "Not available",
        domContentLoaded: performance.timing
          ? performance.timing.domContentLoadedEventEnd -
            performance.timing.navigationStart
          : "Not available",
      },
    };

    let content =
      "⚡ PERFORMANCE METRICS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    if (stats.memoryUsage) {
      content += `Memory Usage: ${stats.memoryUsage.used}MB / ${stats.memoryUsage.total}MB (${stats.memoryUsage.percentage}%)\n`;
    }

    content += `Page Load Time: ${stats.connectionTiming.navigation}ms\n`;
    content += `DOM Ready: ${stats.connectionTiming.domContentLoaded}ms\n`;
    content += `Commands Executed: ${userProgress.commandCount}\n`;
    content += `\nSystem performance is being monitored`;

    return {
      type: "result",
      content,
    };
  },

  cache: () => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("cache");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    // const action = args[0] || 'status';

    return {
      type: "result",
      content: `🗄️ CACHE STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCache System: Active\nStatus: Working\n\nUse: cache <status|stats|clear>`,
    };
  },

  logs: (args) => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("logs");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const filter = args[0] || "all";

    try {
      let logs;

      switch (filter.toLowerCase()) {
        case "wallet":
          logs = logger.getLogs({ component: "WALLET" }).slice(-10);
          break;
        case "command":
          logs = logger.getLogs({ component: "COMMAND" }).slice(-10);
          break;
        case "error":
          logs = logger
            .getLogs()
            .filter((log) => log.level === "ERROR")
            .slice(-10);
          break;
        case "recent":
          logs = logger
            .getLogs({
              since: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
            })
            .slice(-15);
          break;
        default:
          logs = logger.getLogs().slice(-10);
      }

      if (logs.length === 0) {
        return {
          type: "result",
          content: `📋 No logs found for filter: ${filter}`,
        };
      }

      const logDisplay = logs
        .map((log) => {
          const time = new Date(log.timestamp).toLocaleTimeString();
          return `[${time}] ${log.level} ${log.component}: ${log.message}`;
        })
        .join("\n");

      return {
        type: "result",
        content: `📋 SYSTEM LOGS (${filter.toUpperCase()})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${logDisplay}\n\nFilters: all, wallet, command, error, recent`,
      };
    } catch (error) {
      devLogger.error("logs command", error);
      return {
        type: "error",
        content: "Error retrieving logs: " + error.message,
      };
    }
  },

  export: (args) => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("export");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const type = args[0] || "logs";

    try {
      let exported;

      switch (type.toLowerCase()) {
        case "logs":
          exported = devLogger.exportForAI();
          break;
        case "debug": {
          const debugData = {
            timestamp: new Date().toISOString(),
            wallet: mockWalletState,
            user: getUserStatus(),
            network: getNetworkInfo(),
            performance: {
              memory: performance.memory
                ? {
                    used: Math.round(
                      performance.memory.usedJSHeapSize / 1024 / 1024
                    ),
                    total: Math.round(
                      performance.memory.totalJSHeapSize / 1024 / 1024
                    ),
                  }
                : "Not available",
            },
          };
          exported = JSON.stringify(debugData, null, 2);
          // Console log for debugging
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log("🤖 Debug Data for AI:", debugData);
          }
          break;
        }
        case "ai": {
          // Export formatted for AI analysis
          const aiAnalysisData = {
            logs: logger.getLogs({
              since: new Date(Date.now() - 30 * 60 * 1000),
            }),
            wallet: mockWalletState,
            user: getUserStatus(),
            commands: userProgress,
            errors: logger.getLogs().filter((log) => log.level === "ERROR"),
          };
          exported = JSON.stringify(aiAnalysisData, null, 2);
          // Console log for debugging
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log("🤖 AI Analysis Data:", aiAnalysisData);
          }
          break;
        }
        default:
          return {
            type: "error",
            content: "Unknown export type. Use: logs, debug, ai",
          };
      }

      // Copy to clipboard if available
      if (navigator.clipboard && exported) {
        navigator.clipboard.writeText(exported).catch(() => {});
      }

      return {
        type: "result",
        content: `📤 EXPORTED ${type.toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nData exported to console and clipboard\nCheck browser console for full output\n\nTypes: logs, debug, ai`,
      };
    } catch (error) {
      devLogger.error("export command", error);
      return {
        type: "error",
        content: "Export failed: " + error.message,
      };
    }
  },

  // 🤖 Nuevo comando específico para IA
  ai: (args) => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("ai");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const action = args[0] || "status";

    switch (action.toLowerCase()) {
      case "status": {
        return {
          type: "result",
          content: `🤖 AI DEVELOPMENT MODE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nStatus: Active\nLogging: Enhanced\nDebug Mode: ${
            import.meta.env.DEV ? "ON" : "OFF"
          }\nContracts: Ready for Integration\n\nCommands:\n• ai export - Export data for AI\n• ai logs - Recent logs for analysis\n• ai debug - Debug info for AI\n• ai clear - Clear all logs\n• ai contracts - Contract development status`,
        };
      }

      case "export": {
        devLogger.exportForAI();
        return {
          type: "result",
          content: `🤖 Data exported to console for AI analysis\nCheck browser console for formatted logs`,
        };
      }

      case "logs": {
        const recentLogs = logger
          .getLogs({
            since: new Date(Date.now() - 10 * 60 * 1000),
          })
          .slice(-5);
        const logDisplay = recentLogs
          .map((log) => `${log.level}: ${log.message}`)
          .join("\n");
        return {
          type: "result",
          content: `🤖 Recent Logs for AI:\n${logDisplay}`,
        };
      }

      case "debug": {
        const debugInfo = {
          wallet: mockWalletState.connected ? "Connected" : "Disconnected",
          user: getUserStatus().name,
          commands: userProgress.commandCount,
          errors: logger.getLogs().filter((l) => l.level === "ERROR").length,
        };
        return {
          type: "result",
          content: `🤖 Debug Summary:\n${JSON.stringify(debugInfo, null, 2)}`,
        };
      }

      case "contracts": {
        // Contract development status for AI
        const contractStatus = {
          frontend_integration: true,
          service_ready: true,
          tests_available: true,
          ai_debugging: true,
          mock_mode: true,
          ready_for_deployment: false,
        };

        return {
          type: "result",
          content: `🏗️ AI CONTRACT DEVELOPMENT STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📱 Frontend Integration: ${
            contractStatus.frontend_integration ? "✅ Ready" : "❌ Missing"
          }\n🛠️ Service Layer: ${
            contractStatus.service_ready ? "✅ Implemented" : "❌ Missing"
          }\n🧪 Tests: ${
            contractStatus.tests_available ? "✅ Available" : "❌ Missing"
          }\n🤖 AI Debugging: ${
            contractStatus.ai_debugging ? "✅ Active" : "❌ Disabled"
          }\n🗂️ Mock Mode: ${
            contractStatus.mock_mode ? "✅ Running" : "❌ Off"
          }\n🚀 Deployment Ready: ${
            contractStatus.ready_for_deployment ? "✅ Yes" : "⚠️ Pending"
          }\n\n📄 Next Steps:\n• Run setup-contracts.sh\n• Install Anchor framework\n• Deploy to devnet\n• Update frontend integration\n\n🤖 All groundwork prepared for AI assistance!`,
        };
      }

      case "clear": {
        logger.clearLogs();
        return {
          type: "result",
          content: "🤖 All logs cleared for fresh AI analysis",
        };
      }

      default:
        return {
          type: "result",
          content: "AI commands: status, export, logs, debug, clear, contracts",
        };
    }
  },
};

// Add devLogger integration to existing commands
Object.keys(diagnosticCommands).forEach((cmd) => {
  const originalCommand = diagnosticCommands[cmd];
  diagnosticCommands[cmd] = (...args) => {
    const startTime = performance.now();
    try {
      const result = originalCommand(...args);
      const duration = performance.now() - startTime;
      devLogger.command(`diagnostic:${cmd}`, result, null);
      devLogger.performance(`diagnostic:${cmd}`, duration);
      return result;
    } catch (error) {
      devLogger.command(`diagnostic:${cmd}`, null, error);
      devLogger.error(`diagnostic:${cmd}`, error);
      throw error;
    }
  };
});

export default diagnosticCommands;

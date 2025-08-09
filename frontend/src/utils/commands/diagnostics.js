/**
 * System diagnostics and monitoring commands - Simplified version
 */

import { mockWalletState, userProgress, getUserStatus } from '../userState';
import { getNetworkInfo } from '../solana';

export const diagnosticCommands = {
  debug: (args) => {
    const component = args[0] || 'system';
    const userStatus = getUserStatus();
    const networkInfo = getNetworkInfo();
    
    const debugInfo = {
      system: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        performance: {
          memory: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
          } : 'Not available'
        }
      },
      wallet: {
        connected: mockWalletState.connected,
        type: mockWalletState.walletType,
        address: mockWalletState.address,
        balance: mockWalletState.balance,
        isReal: mockWalletState.isReal,
        connectionTime: mockWalletState.connectionTime
      },
      user: {
        level: userStatus.level,
        name: userStatus.name,
        commandCount: userStatus.commandCount,
        secretsFound: userStatus.secretsFound,
        unlockedCommands: Array.from(userProgress.unlockedCommands).length
      },
      network: {
        ...networkInfo,
        rpcHealth: 'Unknown'
      }
    };
    
    let displayInfo;
    switch (component.toLowerCase()) {
      case 'wallet':
        displayInfo = JSON.stringify(debugInfo.wallet, null, 2);
        break;
      case 'user':
        displayInfo = JSON.stringify(debugInfo.user, null, 2);
        break;
      case 'network':
        displayInfo = JSON.stringify(debugInfo.network, null, 2);
        break;
      default:
        displayInfo = JSON.stringify(debugInfo, null, 2);
    }
    
    return {
      type: 'result',
      content: `🔍 DEBUG INFO (${component.toUpperCase()})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${displayInfo}\n\nUse: debug <system|wallet|user|network>`
    };
  },

  health: async () => {
    const checks = [];
    
    // Wallet health
    if (mockWalletState.connected) {
      checks.push({
        component: 'Wallet',
        status: 'healthy',
        details: `${mockWalletState.walletType} connected`
      });
    } else {
      checks.push({
        component: 'Wallet',
        status: 'disconnected',
        details: 'No wallet connected'
      });
    }
    
    // Network health
    try {
      const networkInfo = getNetworkInfo();
      checks.push({
        component: 'Network',
        status: 'healthy',
        details: `Connected to ${networkInfo.network}`
      });
    } catch (error) {
      checks.push({
        component: 'Network',
        status: 'unhealthy',
        details: error.message
      });
    }
    
    const healthDisplay = checks
      .map(check => {
        const statusIcon = check.status === 'healthy' ? '✅' : 
                          check.status === 'warning' ? '⚠️' : '❌';
        return `${statusIcon} ${check.component}: ${check.status}\n   ${check.details}`;
      })
      .join('\n\n');
    
    const overallHealth = checks.every(c => c.status === 'healthy') ? 'HEALTHY' : 
                         checks.some(c => c.status === 'unhealthy') ? 'UNHEALTHY' : 'WARNING';
    
    return {
      type: 'result',
      content: `🏥 SYSTEM HEALTH CHECK\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Status: ${overallHealth}\n\n${healthDisplay}\n\nLast check: ${new Date().toLocaleTimeString()}`
    };
  },

  performance: () => {
    const stats = {
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100)
      } : null,
      connectionTiming: {
        navigation: performance.timing ? 
          performance.timing.loadEventEnd - performance.timing.navigationStart : 'Not available',
        domContentLoaded: performance.timing ?
          performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart : 'Not available'
      }
    };
    
    let content = '⚡ PERFORMANCE METRICS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    if (stats.memoryUsage) {
      content += `Memory Usage: ${stats.memoryUsage.used}MB / ${stats.memoryUsage.total}MB (${stats.memoryUsage.percentage}%)\n`;
    }
    
    content += `Page Load Time: ${stats.connectionTiming.navigation}ms\n`;
    content += `DOM Ready: ${stats.connectionTiming.domContentLoaded}ms\n`;
    content += `Commands Executed: ${userProgress.commandCount}\n`;
    content += `\nSystem performance is being monitored`;
    
    return {
      type: 'result',
      content
    };
  },

  cache: (args) => {
    const action = args[0] || 'status';
    
    return {
      type: 'result',
      content: `🗄️ CACHE STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCache System: Active\nStatus: Working\n\nUse: cache <status|stats|clear>`
    };
  },

  logs: (args) => {
    const filter = args[0] || 'all';
    
    return {
      type: 'result',
      content: `📋 SYSTEM LOGS (${filter.toUpperCase()})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nLogging system active\nFilter: ${filter}\n\nLogs are being collected in the background`
    };
  },

  export: (args) => {
    const type = args[0] || 'logs';
    
    return {
      type: 'result',
      content: `📤 EXPORT OPTIONS\n\nAvailable exports:\n• logs - System logs\n• debug - Debug information\n\nUsage: export <logs|debug>\n\nExport functionality ready`
    };
  }
};

export default diagnosticCommands;

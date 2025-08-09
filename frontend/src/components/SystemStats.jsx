import { useState, useEffect } from 'react';

export default function SystemStats() {
  const [stats, setStats] = useState({
    uptime: '0h 0m',
    commandsExecuted: 0,
    memoryUsage: 0,
    networkLatency: 0
  });

  useEffect(() => {
    const startTime = Date.now();
    let commandCount = 0;

    const updateStats = () => {
      const now = Date.now();
      const uptimeMs = now - startTime;
      const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setStats({
        uptime: `${hours}h ${minutes}m`,
        commandsExecuted: commandCount,
        memoryUsage: Math.floor(Math.random() * 20 + 40), // Simulated
        networkLatency: Math.floor(Math.random() * 50 + 20) // Simulated
      });
    };

    // Listen for command executions
    const handleCommand = () => {
      commandCount++;
      updateStats();
    };

    // Update every 10 seconds
    const interval = setInterval(updateStats, 10000);
    
    // Listen for custom events (we'll dispatch these from the terminal)
    window.addEventListener('terminal-command', handleCommand);

    updateStats();

    return () => {
      clearInterval(interval);
      window.removeEventListener('terminal-command', handleCommand);
    };
  }, []);

  return (
    <div className="system-stats">
      <div className="stat-item">
        <span className="stat-label">UPTIME</span>
        <span className="stat-value">{stats.uptime}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">CMDS</span>
        <span className="stat-value">{stats.commandsExecuted}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">MEM</span>
        <span className="stat-value">{stats.memoryUsage}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">PING</span>
        <span className="stat-value">{stats.networkLatency}ms</span>
      </div>
    </div>
  );
}

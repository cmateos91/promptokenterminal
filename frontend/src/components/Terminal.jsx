import { useTerminal } from '../hooks/useTerminal';
import { getUserStatus } from '../utils/userState';
import SystemStats from './SystemStats';
import { useState, useEffect } from 'react';

export default function Terminal() {
  const [userStatus, setUserStatus] = useState(getUserStatus());
  
  const {
    history,
    input,
    suggestions,
    showSuggestions,
    isLoading,
    inputRef,
    outputRef,
    setInput,
    handleSubmit,
    handleKeyDown
  } = useTerminal();

  // Update user status when commands are executed
  useEffect(() => {
    const handleCommand = () => {
      setUserStatus(getUserStatus());
    };
    
    window.addEventListener('terminal-command', handleCommand);
    return () => window.removeEventListener('terminal-command', handleCommand);
  }, []);

  const renderHistoryItem = (item, index) => {
    switch (item.type) {
      case 'welcome':
        return (
          <div key={index} className="welcome-text">
            <div className="ascii-art">
              {item.content}
            </div>
          </div>
        );
      case 'command':
        return (
          <div key={index} className="command-line">
            <span className="terminal-prompt">$PROMPT&gt;</span>
            <span className="command-text">{item.content}</span>
          </div>
        );
      case 'result':
        return (
          <div key={index} className="command-result success-text">
            {item.content}
          </div>
        );
      case 'error':
        return (
          <div key={index} className="command-result error-text">
            ↯ {item.content}
          </div>
        );
      case 'info':
        return (
          <div key={index} className="command-result info-text">
            … {item.content}
          </div>
        );
      case 'suggestion':
        return (
          <div key={index} className="command-result suggestion-text">
            ⋄ {item.content}
          </div>
        );
      case 'loading':
        return (
          <div key={index} className="command-result loading-text">
            <span className="loading-spinner">▒░▒</span> {item.content}
          </div>
        );
      default:
        return (
          <div key={index} className="command-result">
            {item.content}
          </div>
        );
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-logo">
          <span className="logo-text">PROMPT</span>
        </div>
        <div className="terminal-subtitle">SOLANA STAKING PROTOCOL</div>
        <div className="terminal-user-info">
          <div className="user-level" style={{color: userStatus.color}}>
            [{userStatus.level}] {userStatus.name}
          </div>
          <div className="terminal-status">
            <span className="status-dot"></span>
            <span className="status-text">OFFLINE</span>
          </div>
        </div>
      </div>
      
      <SystemStats />

      <div className="terminal-output" ref={outputRef}>
        {history.map(renderHistoryItem)}
      </div>

      <div className="terminal-input-area">
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <span 
                key={index} 
                className="suggestion-item"
                onClick={() => {
                  setInput(suggestion + ' ');
                }}
              >
                {suggestion}
              </span>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="terminal-input-container">
          <span className="terminal-prompt">$PROMPT&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            placeholder={isLoading ? "Processing..." : "Enter command..."}
            autoComplete="off"
            spellCheck="false"
            disabled={isLoading}
          />
          <span className="cursor">_</span>
        </form>
        
        <div className="terminal-footer">
          <span className="footer-text">
            TAB: autocomplete | UP/DOWN: history | ESC: clear | CTRL+C: interrupt
          </span>
        </div>
      </div>
    </div>
  );
}

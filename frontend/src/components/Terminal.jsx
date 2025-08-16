import { useTerminal } from '../hooks/useTerminal';
import { getUserStatus, mockWalletState } from '../utils/userState';
import SystemStats from './SystemStats';
import { useState, useEffect } from 'react';

export default function Terminal() {
  const [userStatus, setUserStatus] = useState(getUserStatus());
  const [connectionStatus, setConnectionStatus] = useState({
    connected: mockWalletState.connected,
    text: mockWalletState.connected ? 'ONLINE' : 'OFFLINE',
    color: mockWalletState.connected ? '#00ffff' : '#888888' // cyan for online, gray for offline
  });
  
  const {
    history,
    input,
    suggestions,
    showSuggestions,
    isLoading,
    isMobile,
    inputRef,
    outputRef,
    setInput,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick
  } = useTerminal();

  // Update user status and connection status when commands are executed
  useEffect(() => {
    const handleCommand = () => {
      setUserStatus(getUserStatus());
      setConnectionStatus({
        connected: mockWalletState.connected,
        text: mockWalletState.connected ? 'ONLINE' : 'OFFLINE',
        color: mockWalletState.connected ? '#00ffff' : '#888888'
      });
    };
    
    window.addEventListener('terminal-command', handleCommand);
    return () => window.removeEventListener('terminal-command', handleCommand);
  }, []);

  // Prevenir pull-to-refresh pero permitir scroll normal en móvil
  useEffect(() => {
    if (!isMobile) return;

    let startY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const terminalOutput = e.target.closest('.terminal-output');
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Solo prevenir pull-to-refresh cuando:
      // 1. El usuario está en el área del terminal output
      // 2. Está en el tope del scroll (scrollTop === 0)
      // 3. Está intentando deslizar hacia abajo (deltaY > 0)
      if (terminalOutput && terminalOutput.scrollTop === 0 && deltaY > 0) {
        e.preventDefault();
      }
      
      // Para áreas que no son el terminal output, prevenir pull-to-refresh
      if (!terminalOutput && deltaY > 0) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);

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
      case 'game':
        return (
          <div key={index} className="command-result game-display">
            <pre style={{
              fontFamily: 'Courier New, monospace',
              whiteSpace: 'pre',
              background: '#0a0a0a',
              color: '#00ff00',
              padding: '1rem',
              margin: '0.5rem 0',
              border: '1px solid #00ff00',
              borderRadius: '4px',
              fontSize: '12px',
              lineHeight: '1.2',
              overflow: 'auto'
            }}>
              {item.content}
            </pre>
          </div>
        );
      case 'nyx-response':
        return (
          <div key={index} className="command-result nyx-response">
            {item.content}
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

  // Handler para focus en input (móvil)
  const handleInputFocus = () => {
    if (isMobile && inputRef.current) {
      // Scroll al input cuando se enfoque en móvil
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300); // Delay para esperar a que aparezca el teclado
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-logo">
          <span className="logo-text">PROMPT</span>
        </div>
        {!isMobile && (
          <div className="terminal-subtitle">SOLANA STAKING PROTOCOL</div>
        )}
        <div className="terminal-user-info">
          <div className="user-level" style={{color: userStatus.color}}>
            [{userStatus.level}] {userStatus.name}
          </div>
          <div className="terminal-status">
            <span className="status-dot" style={{backgroundColor: connectionStatus.color}}></span>
            <span className="status-text" style={{color: connectionStatus.color}}>
              {connectionStatus.text}
            </span>
          </div>
        </div>
      </div>
      
      <SystemStats />

      <div 
        className="terminal-output" 
        ref={outputRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {history.map(renderHistoryItem)}
      </div>

      <div className="terminal-input-area">
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions" role="listbox" aria-label="Command suggestions">
            {suggestions.map((suggestion, index) => (
              <span 
                key={index} 
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }}
                role="option"
                tabIndex={isMobile ? 0 : -1}
                aria-label={`Suggestion: ${suggestion}`}
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
            onFocus={handleInputFocus}
            className="terminal-input"
            placeholder={isLoading ? "Processing..." : "Enter command..."}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            disabled={isLoading}
            aria-label="Command input"
            // Atributos específicos para móvil
            inputMode="text"
            enterKeyHint="send"
          />
          {!isMobile && <span className="cursor">_</span>}
        </form>
        
        <div className="terminal-footer">
          <span className="footer-text">
            {isMobile 
              ? "TAB: autocomplete | Type 'help' for commands"
              : "TAB: autocomplete | UP/DOWN: history | ESC: clear | CTRL+C: interrupt"
            }
          </span>
        </div>
      </div>
    </div>
  );
}

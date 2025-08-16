import { useState, useRef, useEffect, useCallback } from 'react';
import { executeCommand, getCommandSuggestions, getRandomTip } from '../utils/commands';

export function useTerminal() {
  const [history, setHistory] = useState([
    { type: 'welcome', content: 'PROMPT STAKING TERMINAL v1.0.0' },
    { type: 'info', content: 'Building a Solana staking dApp' },
    { type: 'info', content: 'Custom token staking - Earn rewards in any SPL token you choose' },
    { type: 'info', content: 'Type "help" to see available commands' }
  ]);
  
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const isMobileRef = useRef(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-focus optimizado para móvil
  useEffect(() => {
    if (!isMobileRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  // Focus management mejorado para móvil
  useEffect(() => {
    if (!isLoading && !isMobileRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [history, isLoading]);

  // Auto-scroll mejorado para móvil
  useEffect(() => {
    if (outputRef.current) {
      const scrollToBottom = () => {
        const element = outputRef.current;
        if (element) {
          // Usar requestAnimationFrame para mejor performance en móvil
          requestAnimationFrame(() => {
            element.scrollTop = element.scrollHeight;
          });
        }
      };

      scrollToBottom();
      
      // Restaurar focus solo en desktop
      if (!isMobileRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    }
  }, [history]);

  // Update suggestions optimizado
  useEffect(() => {
    if (input.trim()) {
      const newSuggestions = getCommandSuggestions(input.trim());
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  // Idle tip system con timeout más largo para móvil
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      
      // Timeout mucho más largo para que no sean molestos
      const timeout = isMobileRef.current ? 300000 : 180000; // 5 min móvil, 3 min desktop
      
      idleTimeoutRef.current = setTimeout(() => {
        setHistory(prev => [...prev, {
          type: 'info',
          content: getRandomTip()
        }]);
      }, timeout);
    };

    resetIdleTimer();
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [input, history]);

  // Click handler optimizado para móvil
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // En móvil, no forzar focus automático
      if (isMobileRef.current) {return;}
      
      const isClickOnSuggestion = e.target.closest('.suggestion-item');
      const isClickOnInput = e.target.closest('.terminal-input');
      const isClickOnScrollbar = e.target === outputRef.current;
      
      if (!isClickOnSuggestion && !isClickOnInput && !isClickOnScrollbar && !isLoading) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isLoading]);

  // Touch handlers para móvil
  useEffect(() => {
    if (!isMobileRef.current) {return;}

    const handleTouchStart = (e) => {
      // Prevenir comportamientos por defecto en ciertos elementos
      if (e.target.closest('.suggestion-item') || e.target.closest('.terminal-input')) {
        return;
      }
    };

    const handleTouchEnd = (e) => {
      // Manejar tap en suggestions
      if (e.target.closest('.suggestion-item')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const executeCommandWithLoading = useCallback(async (command) => {
    setIsLoading(true);

    // Delay más corto en móvil para mejor responsividad
    const delay = isMobileRef.current ? 150 : 300;
    await new Promise(resolve => setTimeout(resolve, Math.random() * delay + 100));
    
    try {
      return await executeCommand(command);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // HandleSubmit optimizado para móvil
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }

    const command = input.trim();
    const newEntry = { type: 'command', content: command };
    
    // Add command to history
    setCommandHistory(prev => [command, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
    
    // Show loading state for commands that might take time
    if (['connect', 'stake', 'unstake', 'claim'].includes(command.split(' ')[0])) {
      setHistory(prev => [...prev, newEntry, { type: 'loading', content: 'Processing...' }]);
    } else {
      setHistory(prev => [...prev, newEntry]);
    }
    
    // Limpiar input y suggestions
    setInput('');
    setShowSuggestions(false);
    
    // En móvil, ocultar teclado virtual si es necesario
    if (isMobileRef.current && inputRef.current) {
      inputRef.current.blur();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    
    const result = await executeCommandWithLoading(command);
    
    // Emit event for system stats
    window.dispatchEvent(new CustomEvent('terminal-command', { detail: { command } }));
    
    if (result.type === 'clear') {
      setHistory([
        { type: 'welcome', content: 'PROMPT STAKING TERMINAL v1.0.0' },
        { type: 'info', content: 'Type "help" to see available commands' }
      ]);
    } else {
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1]?.type === 'loading') {
          newHistory.pop();
        }
        
        // Handle NYX-processed messages specially
        if (result.type === 'nyx-processed') {
          return [...newHistory, {
            type: result.originalType,
            content: result.originalContent,
            timestamp: result.timestamp || Date.now()
          }, {
            type: 'nyx-response',
            content: `NYX> ${result.nyxResponse}`,
            timestamp: (result.timestamp || Date.now()) + 1
          }];
        }
        
        return [...newHistory, result];
      });
    }
    
  }, [input, isLoading, executeCommandWithLoading]);

  // HandleKeyDown mejorado para móvil
  const handleKeyDown = useCallback((e) => {
    // En móvil, simplificar navegación por teclado
    if (isMobileRef.current) {
      if (e.key === 'Enter') {
        handleSubmit(e);
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setInput('');
        setHistoryIndex(-1);
        return;
      }
      return;
    }

    // Navegación completa para desktop
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        setInput(suggestions[0] + ' ');
        setShowSuggestions(false);
      } else if (suggestions.length > 1) {
        const suggestionText = suggestions.join('  ');
        setHistory(prev => [...prev, 
          { type: 'command', content: input },
          { type: 'suggestion', content: suggestionText }
        ]);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInput('');
      setHistoryIndex(-1);
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setInput('');
      setHistory(prev => [...prev, { type: 'info', content: '^C' }]);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([
        { type: 'welcome', content: 'PROMPT STAKING TERMINAL v1.0.0' },
        { type: 'info', content: 'Type "help" to see available commands' }
      ]);
    }
  }, [historyIndex, commandHistory, suggestions, input, handleSubmit]);

  // Suggestion click handler optimizado para móvil
  const handleSuggestionClick = useCallback((suggestion) => {
    setInput(suggestion + ' ');
    setShowSuggestions(false);
    
    // En móvil, enfocar input después de seleccionar sugerencia
    if (isMobileRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const addMessage = useCallback((message) => {
    setHistory(prev => [...prev, message]);
  }, []);


  // Expose addMessage to window for games
  useEffect(() => {
    window.terminalAddMessage = addMessage;
    return () => {
      delete window.terminalAddMessage;
    };
  }, [addMessage]);

  const clearTerminal = useCallback(() => {
    setHistory([
      { type: 'welcome', content: 'PROMPT STAKING TERMINAL v1.0.0' },
      { type: 'info', content: 'Type "help" to see available commands' }
    ]);
  }, []);

  return {
    // State
    history,
    input,
    suggestions,
    showSuggestions,
    isLoading,
    isMobile: isMobileRef.current,
    
    // Refs
    inputRef,
    outputRef,
    
    // Handlers
    setInput,
    handleSubmit,
    handleKeyDown,
    handleSuggestionClick,
    
    // Utils
    addMessage,
    clearTerminal
  };
}

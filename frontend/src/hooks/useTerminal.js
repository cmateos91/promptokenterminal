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

  // Auto-focus input (existente)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // NUEVO: Mantener focus después de cambios en el historial
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [history, isLoading]);

  // NUEVO: Focus cuando termina el loading
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isLoading]);

  // Auto-scroll modificado
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
      
      // Restaurar focus después del scroll
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [history]);

  // Update suggestions based on input
  useEffect(() => {
    if (input.trim()) {
      const suggestions = getCommandSuggestions(input.trim());
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  // Idle tip system
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      
      idleTimeoutRef.current = setTimeout(() => {
        setHistory(prev => [...prev, {
          type: 'info',
          content: getRandomTip()
        }]);
      }, 30000); // Show tip after 30 seconds of inactivity
    };

    resetIdleTimer();
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [input, history]);

  // Mantener focus con event listener global
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Si el click no fue en un elemento específico, mantener focus en input
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

  const executeCommandWithLoading = useCallback(async (command) => {
    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    try {
      return executeCommand(command);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función handleSubmit MEJORADA según tu documento
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
    
    // Limpiar input inmediatamente para mejor UX
    setInput('');
    setShowSuggestions(false);
    
    // FOCUS INMEDIATO después de limpiar input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    
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
        // Remove loading message and add result
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1]?.type === 'loading') {
          newHistory.pop();
        }
        return [...newHistory, result];
      });
    }
    
    // FOCUS FINAL después de todas las actualizaciones
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    
  }, [input, isLoading, executeCommandWithLoading]);

  const handleKeyDown = useCallback((e) => {
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
  }, [historyIndex, commandHistory, suggestions, input]);

  const addMessage = useCallback((message) => {
    setHistory(prev => [...prev, message]);
  }, []);

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
    
    // Refs
    inputRef,
    outputRef,
    
    // Handlers
    setInput,
    handleSubmit,
    handleKeyDown,
    
    // Utils
    addMessage,
    clearTerminal
  };
}

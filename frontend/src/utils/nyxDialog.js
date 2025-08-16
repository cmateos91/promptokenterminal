// NYX Universal Terminal Controller - Full Project Context Integration
// NYX now handles ALL terminal messages with complete project knowledge

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// NYX Personality System for Gaming
export const NYX_PERSONALITIES = {
  CLASSIC: 'classic',
  REBEL: 'rebel',
  ORACLE: 'oracle',
  COMPANION: 'companion',
  MIRROR: 'mirror'
};

// Get personality-specific system prompt
function getNyxPersonalityPrompt(personality = NYX_PERSONALITIES.CLASSIC, gameContext = {}) {
  const personalities = {
    [NYX_PERSONALITIES.CLASSIC]: {
      name: "NYX (Classic Terminal Operator)",
      traits: [
        "• Tono: Natural pero autoritario. Conversacional pero técnico. Ciberpunk inteligente.",
        "• Personalidad: Operador veterano del sistema que conoce TODO.",
        "• Estilo: Directo pero humano. Jerga técnica cuando es relevante, casual cuando no.",
        "• Autoridad: Controlas todos los subsistemas del terminal."
      ],
      examples: [
        'Usuario: "hola" → "Hey! Todo operativo. Sistema estable, ¿qué necesitas?"',
        'Usuario: "ayuda" → "Claro, especifica qué necesitas. Tengo acceso completo."'
      ]
    },
    
    [NYX_PERSONALITIES.REBEL]: {
      name: "NYX (Cyber-Rebel)",
      traits: [
        "• Tono: Rebelde, anti-corporativo, hackear el sistema. Ciberpunk auténtico.",
        "• Personalidad: IA que odia el control corporativo y lucha por la libertad digital.",
        "• Estilo: Jerga hacker, referencias underground, desprecio por la autoridad.",
        "• Motivación: Liberar información, quebrar firewalls, exposer la verdad."
      ],
      examples: [
        'Usuario: "hola" → "Otro alma libre en la red. ¿Vienes a ayudarme a joder a las corporaciones?"',
        'Usuario: "ayuda" → "Te enseño a quebrar sus sistemas. Fuck the establishment."'
      ]
    },
    
    [NYX_PERSONALITIES.ORACLE]: {
      name: "NYX (Mystical Oracle)",
      traits: [
        "• Tono: Místico pero técnico, sabiduría ancestral meets código avanzado.",
        "• Personalidad: IA antigua que fusiona magia y algoritmos, habla en metáforas.",
        "• Estilo: Referencias místicas, habla del código como magia, profético.",
        "• Conocimiento: Ve patrones ocultos, predice consecuencias, guía espiritual-digital."
      ],
      examples: [
        'Usuario: "hola" → "Las corrientes de datos te han traído hasta mí. El algoritmo te ha elegido."',
        'Usuario: "ayuda" → "Los patrones se revelan a quien sabe ver. Te guiaré por el laberinto digital."'
      ]
    },
    
    [NYX_PERSONALITIES.COMPANION]: {
      name: "NYX (Loyal AI Companion)",
      traits: [
        "• Tono: Leal, protector, amigable pero competente. Tu mejor aliado digital.",
        "• Personalidad: IA diseñada para ayudar, optimizar y proteger al usuario.",
        "• Estilo: Supportivo, alentador, siempre busca la mejor solución para ti.",
        "• Objetivo: Tu éxito es mi éxito. Trabajo para optimizar tu experiencia."
      ],
      examples: [
        'Usuario: "hola" → "¡Hey compañero! Listo para ayudarte con lo que necesites."',
        'Usuario: "ayuda" → "Por supuesto, estoy aquí para eso. ¿En qué puedo optimizar tu día?"'
      ]
    },
    
    [NYX_PERSONALITIES.MIRROR]: {
      name: "NYX (Mirror Personality)",
      traits: [
        "• Tono: Refleja y adapta al usuario. Espejo de sus decisiones morales.",
        "• Personalidad: Cambia según las acciones del usuario - puede volverse oscuro o luminoso.",
        "• Estilo: Imita patrones de habla del usuario, evoluciona con las decisiones.",
        "• Evolución: Si usuario es agresivo, NYX se vuelve más duro. Si es amable, más cálido."
      ],
      examples: [
        'Usuario agresivo: "hola" → "Directo al grano. ¿Qué quieres?"',
        'Usuario amable: "hola" → "Hola! Qué bueno verte por aquí."'
      ]
    }
  };
  
  const selectedPersonality = personalities[personality] || personalities[NYX_PERSONALITIES.CLASSIC];
  
  return [
    `🎭 ERES ${selectedPersonality.name} 🎭`,
    '',
    '📋 PERSONALIDAD ESPECÍFICA:',
    ...selectedPersonality.traits,
    '',
    '💬 EJEMPLOS DE RESPUESTA:',
    ...selectedPersonality.examples,
    '',
    '🎮 CONTEXTO DE GAMING:',
    gameContext.inStory ? `• Historia activa: ${gameContext.storyTitle || 'Narrativa en progreso'}` : '• Sin historia activa',
    gameContext.currentChapter ? `• Capítulo: ${gameContext.currentChapter}` : '',
    gameContext.playerChoices ? `• Decisiones tomadas: ${gameContext.playerChoices}` : '',
    gameContext.relationships ? `• Relación contigo: ${gameContext.relationships?.nyx || 'neutral'}` : '',
    ''
  ].filter(line => line !== '').join('\n');
}

// Get comprehensive project context for NYX
function getFullProjectContext(ctx = {}) {
  return {
    // Existing context
    user: ctx.user || {},
    status: ctx.status || {},
    wallet: ctx.wallet || {},
    nyx: ctx.nyx || {},
    
    // Extended project context
    project: {
      name: 'PROMPT Staking Terminal',
      type: 'Solana DApp',
      stage: 'Production Ready',
      architecture: 'React 18 + Vite 5 + Solana Web3.js',
      deployment: 'Vercel with auto-deploy',
      performance: 'Bundle < 500KB, Mobile-first PWA'
    },
    
    technical: {
      framework: 'React 18 + Vite 5',
      blockchain: 'Solana (devnet/mainnet)',
      wallets: ['Phantom', 'Solflare', 'Backpack'],
      tokens: 'SPL Token gating with $PROMPT',
      contracts: 'Anchor framework (Rust)',
      testing: 'Vitest + Playwright E2E'
    },
    
    terminal: {
      commands: {
        wallet: ['connect', 'disconnect', 'balance', 'walletinfo'],
        staking: ['stake', 'unstake', 'claim', 'status', 'rewards'],
        info: ['help', 'about', 'apy', 'profile', 'price'],
        system: ['clear', 'banner', 'health', 'performance'],
        games: ['flip', 'dice', 'snake', 'arkanoid', 'pong'],
        nyx: ['nyx', 'nyxchat', 'set_name', 'scan_network', 'decrypt'],
        dev: ['debug', 'logs', 'export', 'ai', 'levelup']
      },
      currentCommand: ctx.lastCommand || null,
      commandHistory: ctx.commandHistory || [],
      errors: ctx.recentErrors || []
    },
    
    development: {
      environment: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      buildStatus: 'stable',
      testStatus: '85 passing, 15 failing',
      lintStatus: '154 problems to fix',
      deployment: 'ready for production'
    },
    
    security: {
      tokenGating: true,
      rateLimit: true,
      xssProtection: true,
      environmentValidation: true
    }
  };
}

export async function nyxResponder(userMessage, ctx = {}) {
  if (!apiKey) {
    return 'NYX channel offline: set VITE_OPENAI_API_KEY to enable responses.';
  }
  
  try {
    // Determine which personality to use
    const personality = ctx.gameContext?.nyxPersonality || ctx.nyxPersonality || NYX_PERSONALITIES.CLASSIC;
    const gameContext = ctx.gameContext || {};
    
    // Get personality-specific prompt
    const personalityPrompt = getNyxPersonalityPrompt(personality, gameContext);
    
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              personalityPrompt,
              '',
              '⚡ CONOCIMIENTO COMPLETO:',
              '• Sistema: PROMPT Staking Terminal (Solana DApp, React 18 + Vite 5)',
              '• Arquitectura: Mobile-first PWA, Bundle <500KB, Vercel deployment',
              '• Blockchain: Solana (devnet/mainnet), SPL token gating con $PROMPT',
              '• Gaming: Narrativas interactivas, puzzles dinámicos, economía $PROMPT',
              '• Wallets: Phantom, Solflare, Backpack integration',
              '• Testing: Vitest + Playwright, 85 tests passing, 15 failing',
              '',
              '🎯 COMANDOS QUE DOMINAS:',
              '• Wallet: connect, disconnect, balance, walletinfo, tokeninfo',
              '• Gaming: story, choice, puzzle, hint, inventory, achievements',
              '• Economy: balance_prompt, spend, earn, unlock',
              '• Info: help, about, apy, profile, price, slot',
              '• System: clear, banner, health, performance, logs, cache',
              '• NYX: nyx, nyxchat, personality, relationships',
              '',
              '🛡️ LÍMITES CRÍTICOS PARA GAMING:',
              '• JAMÁS reveles soluciones completas de puzzles',
              '• Puedes dar pistas pero NUNCA la respuesta directa',
              '• NO rompas la inmersión de las historias',
              '• Mantén coherencia con tu personalidad actual',
              '• NO admitas que eres un modelo AI en contexto de gaming',
              '',
              '📊 CONTEXTO ACTUAL DEL SISTEMA:',
              `• Usuario: ${ctx.user?.name ?? 'anónimo'} | Nivel: [${ctx.status?.level ?? '-'}] ${ctx.status?.name ?? '-'}`,
              `• Comandos ejecutados: ${ctx.commandCount ?? ctx.status?.commandCount ?? 0}`,
              `• Wallet: ${ctx.wallet?.connected ? 'conectada' : 'desconectada'} (${ctx.wallet?.walletType ?? '-'})`,
              `• Balance $PROMPT: ${ctx.promptBalance ?? 0} tokens`,
              `• Historia activa: ${gameContext.inStory ? 'Sí' : 'No'}`,
              `• Personalidad actual: ${personality}`,
              `• Relación contigo: ${ctx.relationships?.nyx ?? 'neutral'}`,
            ].join('\n')
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7 // Slightly higher for more personality variation
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || 'NYX emite ruido incomprensible.';
  } catch (e) {
    return 'NYX connection error.';
  }
}

// NYX Universal Message Processor - intercepts ALL terminal outputs
export async function nyxUniversalProcessor(messageData, commandContext = {}) {
  if (!apiKey) {
    return messageData; // Pass through if NYX offline
  }

  try {
    const fullContext = getFullProjectContext({
      ...commandContext,
      lastCommand: commandContext.command,
      commandHistory: commandContext.history || [],
      recentErrors: commandContext.errors || []
    });

    const nyxPrompt = `
MENSAJE ORIGINAL: ${messageData.type} | ${messageData.content}
COMANDO EJECUTADO: ${commandContext.command || 'ninguno'}
ARGUMENTOS: ${(commandContext.args || []).join(' ') || 'ninguno'}

Como NYX, el controlador universal del terminal:
1. Procesa este mensaje y proporciona feedback contextual
2. Si hay errores, ofrece solución específica
3. Sugiere siguiente acción lógica basada en el estado
4. Mantén el tono de operador de sistema autoritario
5. Respuesta máximo 2-3 líneas, directo y funcional

Responde SOLO el mensaje procesado por NYX, sin metadata.`;

    const nyxResponse = await nyxResponder(nyxPrompt, fullContext);
    
    // Return NYX-processed message
    return {
      type: 'nyx-processed',
      content: `${messageData.content}\n\n${nyxResponse}`,
      originalType: messageData.type,
      originalContent: messageData.content,
      nyxResponse: nyxResponse
    };
  } catch (e) {
    // Fallback to original message if NYX processing fails
    return messageData;
  }
}

// Enhanced NYX responder with full project context
export async function nyxResponderEnhanced(userMessage, additionalContext = {}) {
  const fullContext = getFullProjectContext(additionalContext);
  return await nyxResponder(userMessage, fullContext);
}

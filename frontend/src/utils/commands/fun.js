export const funCommands = {
  flip: async () => {
    // Animación simple y elegante de moneda
    const frames = [
      '  ___\n /   \\\n| H |\n \\___/',  // Heads
      ' ___\n(   )',                    // Side
      '  ___\n /   \\\n| T |\n \\___/',  // Tails  
      ' ___\n(   )',                    // Side
      '  ___\n /   \\\n| H |\n \\___/',  // Heads
      ' ___\n(   )',                    // Side
      '  ___\n /   \\\n| T |\n \\___/',  // Tails
      ' ___\n(   )'                     // Side
    ];

    const addMessage = window.terminalAddMessage;
    const header = (text) => ({
      type: "result",
      content: `COIN FLIP\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${text}`,
      timestamp: Date.now(),
    });

    if (!addMessage) {
      // Modo simple (sin animación) si no existe terminalAddMessage
      const isHeads = Math.random() < 0.5;
      const result = isHeads ? "Heads" : "Tails";
      return header(`Resultado: ${result}`);
    }

    // Mensaje inicial
    addMessage(header("Lanzando moneda..."));

    // Animación con desaceleración
    const base = 55;
    const growth = 22;
    for (let i = 0; i < frames.length; i++) {
      const delay = base + Math.floor(Math.pow(i + 1, 1.15) * growth);
      await new Promise((r) => setTimeout(r, delay));
      addMessage({ type: "result", content: frames[i], timestamp: Date.now() });
    }

    // Pausa final
    await new Promise((r) => setTimeout(r, 420));

    // Cara o cruz final
    const isHeads = Math.random() < 0.5;
    const finalCoin = isHeads
      ? '  ___\n /   \\\n| H |\n \\___/'
      : '  ___\n /   \\\n| T |\n \\___/';
    const result = isHeads ? "Heads" : "Tails";

    addMessage({
      type: "result",
      content: `${finalCoin}\n\nResultado: ${result}`,
      timestamp: Date.now(),
    });

    return { type: "result", content: "" };
  },

  dice: () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    return {
      type: "result",
      content: `DICE ROLL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nYou rolled a ${roll}`,
    };
  },
};

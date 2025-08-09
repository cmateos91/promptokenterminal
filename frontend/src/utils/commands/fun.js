export const funCommands = {
  flip: () => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    return {
      type: 'result',
      content: `COIN FLIP\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${result}`
    };
  },

  dice: () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    return {
      type: 'result',
      content: `DICE ROLL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nYou rolled a ${roll}`
    };
  }
};

// Gaming Commands for NYX Interactive Narratives
// Handles all gaming-related terminal commands

import { 
  promptEconomy, 
  getBalance, 
  spend, 
  earn,
  GAMING_COSTS,
  GAMING_REWARDS 
} from '../promptEconomy';

import { 
  storyManager, 
  startStory, 
  makeChoice, 
  getCurrentScene, 
  getAvailableStories,
  UNIVERSES 
} from '../gameStories';

import { 
  generatePuzzle, 
  solvePuzzle,
  PUZZLE_TYPES,
  DIFFICULTY 
} from '../gamingPuzzles';

import { 
  NYX_PERSONALITIES 
} from '../nyxDialog';

import { devLogger } from '../logger';
import { getUserStatus } from '../userState';

function okGame(content) {
  return { type: 'game', content };
}

function okInfo(content) {
  return { type: 'info', content };
}

function okResult(content) {
  return { type: 'result', content };
}

function err(content) {
  return { type: 'error', content };
}

export const gamingCommands = {
  // Show $PROMPT token balance
  balance_prompt: async () => {
    const balance = getBalance();
    const stats = promptEconomy.getStats();
    
    return okResult(`💰 $PROMPT BALANCE: ${balance} tokens

📊 STATISTICS:
• Total Earned: ${stats.totalEarned}
• Total Spent: ${stats.totalSpent}
• Transactions: ${stats.transactionCount}
• Achievements: ${stats.achievementCount}
• Unlocked Content: ${stats.unlockedContentCount}

💡 Earn tokens by solving puzzles and making story progress!`);
  },

  // Show available stories/universes
  stories: async () => {
    const availableStories = getAvailableStories();
    
    let content = `🌟 NYX INTERACTIVE NARRATIVES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    availableStories.forEach((story, index) => {
      const status = story.unlocked ? '✅' : '🔒';
      const cost = story.cost > 0 ? ` (${story.cost} $PROMPT)` : ' (FREE)';
      const progress = story.state !== 'not_started' ? ` - ${story.progress}` : '';
      
      content += `${index + 1}. ${status} ${story.title}${cost}${progress}\n`;
      content += `   ${story.description}\n\n`;
    });
    
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `💡 Use "story start <universe>" to begin a narrative`;
    
    return okGame(content);
  },

  // Start or continue a story
  story: async (args) => {
    const action = args[0];
    const universe = args[1];
    
    if (!action) {
      return gamingCommands.stories();
    }
    
    if (action === 'start') {
      if (!universe) {
        return err('Usage: story start <universe>\nAvailable: neon_oracle, quantum_heist, algorithm_wars, deep_protocol');
      }
      
      const playerData = {
        wallet: getUserStatus().wallet || 'anonymous',
        level: getUserStatus().level || 0
      };
      
      const result = startStory(universe, playerData);
      if (!result.success) {
        return err(result.message);
      }
      
      return gamingCommands.scene();
    }
    
    if (action === 'continue') {
      return gamingCommands.scene();
    }
    
    if (action === 'status') {
      const scene = getCurrentScene();
      if (!scene) {
        return okInfo('No active story. Use "stories" to see available narratives.');
      }
      
      return okInfo(`📖 Current Story: ${scene.universe}
📍 Chapter ${scene.chapter + 1}, Scene ${scene.scene + 1}
🎭 Title: ${scene.title}`);
    }
    
    return err('Usage: story <start|continue|status> [universe]');
  },

  // Display current scene
  scene: async () => {
    const scene = getCurrentScene();
    if (!scene) {
      return okInfo('No active story. Use "stories" to see available narratives.');
    }
    
    let content = `📖 ${scene.title.toUpperCase()}\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    content += `${scene.content}\n\n`;
    
    if (scene.nyxDialogue) {
      content += `NYX> ${scene.nyxDialogue}\n\n`;
    }
    
    if (scene.puzzle) {
      content += `🧩 PUZZLE DETECTED: ${scene.puzzle.title}\n`;
      content += `${scene.puzzle.description}\n`;
      content += `Challenge: ${scene.puzzle.challenge}\n\n`;
      content += `💡 Use "puzzle solve <answer>" to attempt solution\n`;
      content += `💡 Use "hint" for clues (costs $PROMPT)\n\n`;
    }
    
    if (scene.choices && scene.choices.length > 0) {
      content += `⚡ CHOICES AVAILABLE:\n`;
      scene.choices.forEach((choice, index) => {
        const cost = choice.cost > 0 ? ` (${choice.cost} $PROMPT)` : '';
        content += `${index + 1}. ${choice.text}${cost}\n`;
      });
      content += `\n💡 Use "choice <number>" to make your decision\n`;
    }
    
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    return okGame(content);
  },

  // Make a story choice
  choice: async (args) => {
    const choiceIndex = parseInt(args[0]) - 1;
    
    if (isNaN(choiceIndex)) {
      return err('Usage: choice <number>\nExample: choice 1');
    }
    
    const scene = getCurrentScene();
    if (!scene || !scene.choices) {
      return err('No choices available in current scene.');
    }
    
    if (choiceIndex < 0 || choiceIndex >= scene.choices.length) {
      return err(`Invalid choice. Choose 1-${scene.choices.length}`);
    }
    
    const choice = scene.choices[choiceIndex];
    const playerData = {
      wallet: getUserStatus().wallet || 'anonymous',
      level: getUserStatus().level || 0
    };
    
    const result = makeChoice(choice.id, playerData);
    
    if (!result.success) {
      return err(result.message);
    }
    
    let content = `✅ CHOICE MADE: ${choice.text}\n\n`;
    content += `${result.message}\n\n`;
    
    if (result.consequences && result.consequences.length > 0) {
      content += `⚡ CONSEQUENCES:\n`;
      result.consequences.forEach(consequence => {
        content += `• ${consequence.effect}\n`;
      });
      content += `\n`;
    }
    
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `💡 Use "scene" to continue the story`;
    
    return okResult(content);
  },

  // Solve a puzzle
  puzzle: async (args) => {
    const action = args[0];
    
    if (action === 'solve') {
      const answer = args.slice(1).join(' ');
      if (!answer) {
        return err('Usage: puzzle solve <your answer>');
      }
      
      const scene = getCurrentScene();
      if (!scene || !scene.puzzle) {
        return err('No puzzle active in current scene.');
      }
      
      const isCorrect = scene.puzzle.validation(answer);
      
      if (isCorrect) {
        const reward = GAMING_REWARDS.PUZZLE_SOLVED;
        earn(reward, 'puzzle_solved', { 
          puzzleId: scene.puzzle.id,
          difficulty: scene.puzzle.difficulty 
        });
        
        // Mark puzzle as solved
        solvePuzzle(scene.puzzle.id, getUserStatus());
        
        return okResult(`🎉 PUZZLE SOLVED!\n\nCorrect answer: ${answer}\n\n💰 Earned ${reward} $PROMPT tokens!\n\n💡 Use "scene" to continue the story`);
      } else {
        return err(`❌ Incorrect answer: ${answer}\n\n💡 Try again or use "hint" for clues`);
      }
    }
    
    if (action === 'hint') {
      const scene = getCurrentScene();
      if (!scene || !scene.puzzle) {
        return err('No puzzle active in current scene.');
      }
      
      const hints = scene.puzzle.hints || [];
      if (hints.length === 0) {
        return err('No hints available for this puzzle.');
      }
      
      // For now, give the first hint
      const hint = hints[0];
      const spendResult = spend(hint.cost, 'puzzle_hint', { 
        puzzleId: scene.puzzle.id 
      });
      
      if (!spendResult.success) {
        return err(spendResult.message);
      }
      
      return okInfo(`💡 HINT (Cost: ${hint.cost} $PROMPT)\n\n${hint.text}\n\nCurrent Balance: ${getBalance()} $PROMPT`);
    }
    
    return err('Usage: puzzle <solve|hint> [answer]');
  },

  // Change NYX personality
  personality: async (args) => {
    const newPersonality = args[0];
    
    if (!newPersonality) {
      const currentPersonality = localStorage.getItem('nyx_personality') || NYX_PERSONALITIES.CLASSIC;
      
      let content = `🎭 NYX PERSONALITY SYSTEM\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      content += `Current Personality: ${currentPersonality.toUpperCase()}\n\n`;
      content += `Available Personalities:\n`;
      content += `1. classic   - Terminal operator (default)\n`;
      content += `2. rebel     - Cyber-rebel hacker\n`;
      content += `3. oracle    - Mystical AI oracle\n`;
      content += `4. companion - Loyal AI assistant\n`;
      content += `5. mirror    - Reflects your behavior\n\n`;
      content += `💡 Use "personality <name>" to change NYX's personality\n`;
      content += `💡 Some personalities unlock through story progress`;
      
      return okInfo(content);
    }
    
    const validPersonalities = Object.values(NYX_PERSONALITIES);
    if (!validPersonalities.includes(newPersonality)) {
      return err(`Invalid personality: ${newPersonality}\nValid options: ${validPersonalities.join(', ')}`);
    }
    
    // Check if personality is unlocked
    const unlockedPersonalities = ['classic', 'rebel']; // Start with these unlocked
    if (!unlockedPersonalities.includes(newPersonality)) {
      const unlockCost = GAMING_COSTS.NYX_PERSONALITY_UNLOCK;
      const unlockResult = promptEconomy.unlockContent(`personality_${newPersonality}`, unlockCost);
      
      if (!unlockResult.success) {
        return err(`Personality "${newPersonality}" requires unlocking for ${unlockCost} $PROMPT tokens.\n${unlockResult.message}`);
      }
    }
    
    localStorage.setItem('nyx_personality', newPersonality);
    
    return okResult(`🎭 NYX personality changed to: ${newPersonality.toUpperCase()}\n\n💡 NYX will now respond with their ${newPersonality} personality in future interactions`);
  },

  // Show achievements
  achievements: async () => {
    const achievements = promptEconomy.getAchievements();
    const puzzleStats = promptEconomy.getStats();
    
    let content = `🏆 ACHIEVEMENTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (achievements.length === 0) {
      content += `No achievements unlocked yet.\n\n`;
      content += `💡 Achievements are earned through:\n`;
      content += `• Solving puzzles\n`;
      content += `• Completing stories\n`;
      content += `• Making choices\n`;
      content += `• Unlocking content\n`;
    } else {
      achievements.forEach(achievement => {
        content += `✅ ${achievement.replace('_', ' ').toUpperCase()}\n`;
      });
      content += `\n`;
    }
    
    content += `📊 PROGRESS:\n`;
    content += `• Puzzles Solved: ${puzzleStats.totalSolved || 0}\n`;
    content += `• Stories Completed: ${puzzleStats.completedStories || 0}\n`;
    content += `• Total Choices Made: ${puzzleStats.totalChoices || 0}\n`;
    
    return okResult(content);
  },

  // Show gaming inventory/status
  inventory: async () => {
    const balance = getBalance();
    const stats = promptEconomy.getStats();
    const storyStats = storyManager.getStats();
    const currentScene = getCurrentScene();
    
    let content = `🎒 GAMING INVENTORY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    content += `💰 $PROMPT Balance: ${balance} tokens\n\n`;
    
    content += `📖 STORY PROGRESS:\n`;
    if (currentScene) {
      content += `• Active Story: ${currentScene.universe}\n`;
      content += `• Current: Chapter ${currentScene.chapter + 1}, Scene ${currentScene.scene + 1}\n`;
    } else {
      content += `• No active story\n`;
    }
    content += `• Stories Completed: ${storyStats.completedStories}\n`;
    content += `• Total Choices: ${storyStats.totalChoices}\n\n`;
    
    content += `🧩 PUZZLE STATS:\n`;
    content += `• Puzzles Solved: ${stats.totalSolved || 0}\n`;
    content += `• Achievements: ${stats.achievementCount}\n`;
    content += `• Unlocked Content: ${stats.unlockedContentCount}\n\n`;
    
    content += `🎭 NYX RELATIONSHIP:\n`;
    const nyxRelation = storyStats.relationships?.nyx || 0;
    const relationshipText = nyxRelation > 50 ? 'Trusted Ally' : 
                           nyxRelation > 0 ? 'Friendly' : 
                           nyxRelation < -50 ? 'Hostile' : 'Neutral';
    content += `• Status: ${relationshipText} (${nyxRelation})\n`;
    
    return okResult(content);
  },

  // Generate a standalone puzzle
  generate_puzzle: async (args) => {
    const type = args[0] || 'logic';
    const difficulty = parseInt(args[1]) || 1;
    
    const validTypes = Object.values(PUZZLE_TYPES);
    if (!validTypes.includes(type)) {
      return err(`Invalid puzzle type: ${type}\nValid types: ${validTypes.join(', ')}`);
    }
    
    if (difficulty < 1 || difficulty > 5) {
      return err('Difficulty must be between 1-5');
    }
    
    const playerData = {
      wallet: getUserStatus().wallet || 'anonymous',
      level: getUserStatus().level || 0
    };
    
    const puzzle = generatePuzzle(type, difficulty, playerData, { standalone: true });
    
    let content = `🧩 ${puzzle.title.toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    content += `${puzzle.description}\n\n`;
    content += `Challenge: ${puzzle.challenge}\n\n`;
    
    if (puzzle.options) {
      content += `Options:\n`;
      puzzle.options.forEach((option, index) => {
        content += `${index + 1}. ${option}\n`;
      });
      content += `\n`;
    }
    
    content += `💡 Use "puzzle solve <answer>" to attempt solution\n`;
    content += `💡 Use "puzzle hint" for clues (costs $PROMPT)`;
    
    // Store current puzzle for solving
    localStorage.setItem('current_standalone_puzzle', JSON.stringify(puzzle));
    
    return okGame(content);
  }
};

// Add aliases
gamingCommands.prompt_balance = gamingCommands.balance_prompt;
gamingCommands.universes = gamingCommands.stories;
gamingCommands.ach = gamingCommands.achievements;
gamingCommands.inv = gamingCommands.inventory;
// Dynamic Puzzle Generation System for NYX Gaming
// Creates unique, procedural puzzles based on player data and story context

import { devLogger } from './logger';

// Puzzle difficulty levels
export const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXPERT: 4,
  NIGHTMARE: 5
};

// Puzzle types
export const PUZZLE_TYPES = {
  CRYPTOGRAPHIC: 'cryptographic',
  LOGIC: 'logic',
  PATTERN: 'pattern',
  SEQUENCE: 'sequence',
  NETWORK: 'network',
  MEMORY: 'memory',
  SOCIAL: 'social'
};

class PuzzleGenerator {
  constructor() {
    this.solvedPuzzles = new Set();
    this.loadProgress();
  }

  // Load solved puzzles from storage
  loadProgress() {
    try {
      const saved = localStorage.getItem('nyx_puzzle_progress');
      if (saved) {
        const data = JSON.parse(saved);
        this.solvedPuzzles = new Set(data.solved || []);
      }
    } catch (error) {
      devLogger.error('Puzzles', 'Failed to load puzzle progress', { error });
    }
  }

  // Save puzzle progress
  saveProgress() {
    try {
      const data = {
        solved: Array.from(this.solvedPuzzles),
        lastSave: Date.now()
      };
      localStorage.setItem('nyx_puzzle_progress', JSON.stringify(data));
    } catch (error) {
      devLogger.error('Puzzles', 'Failed to save puzzle progress', { error });
    }
  }

  // Generate unique seed for puzzles
  generateSeed(playerData, storyContext) {
    const baseString = `${playerData.wallet || 'anonymous'}_${storyContext.chapter || 0}_${storyContext.universe || 'default'}`;
    return this.simpleHash(baseString);
  }

  // Simple hash function for deterministic randomness
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Seeded random number generator
  seededRandom(seed, min = 0, max = 1) {
    const x = Math.sin(seed) * 10000;
    const random = x - Math.floor(x);
    return min + (random * (max - min));
  }

  // Generate puzzle based on type and difficulty
  generatePuzzle(type, difficulty, playerData, storyContext) {
    const seed = this.generateSeed(playerData, storyContext);
    const puzzleId = `${type}_${difficulty}_${seed % 10000}`;

    // Check if already solved
    if (this.solvedPuzzles.has(puzzleId)) {
      return this.generatePuzzle(type, difficulty + 1, playerData, storyContext);
    }

    const generators = {
      [PUZZLE_TYPES.CRYPTOGRAPHIC]: () => this.generateCryptoPuzzle(seed, difficulty),
      [PUZZLE_TYPES.LOGIC]: () => this.generateLogicPuzzle(seed, difficulty),
      [PUZZLE_TYPES.PATTERN]: () => this.generatePatternPuzzle(seed, difficulty),
      [PUZZLE_TYPES.SEQUENCE]: () => this.generateSequencePuzzle(seed, difficulty),
      [PUZZLE_TYPES.NETWORK]: () => this.generateNetworkPuzzle(seed, difficulty),
      [PUZZLE_TYPES.MEMORY]: () => this.generateMemoryPuzzle(seed, difficulty),
      [PUZZLE_TYPES.SOCIAL]: () => this.generateSocialPuzzle(seed, difficulty, storyContext)
    };

    const generator = generators[type] || generators[PUZZLE_TYPES.LOGIC];
    const puzzle = generator();

    return {
      id: puzzleId,
      type,
      difficulty,
      seed,
      ...puzzle,
      context: storyContext,
      hints: this.generateHints(puzzle, difficulty),
      maxHints: Math.min(difficulty + 1, 5)
    };
  }

  // Generate cryptographic puzzle
  generateCryptoPuzzle(seed, difficulty) {
    const messages = [
      "The key is hidden in plain sight",
      "Trust no one, not even yourself",
      "The answer lies in the pattern",
      "Break the cycle to find truth",
      "What you seek seeks you too"
    ];

    const message = messages[seed % messages.length];
    const shifts = [3, 7, 13, 17, 23];
    const shift = shifts[difficulty - 1] || 13;

    // Caesar cipher
    const encrypted = message.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const base = char.charCodeAt(0) >= 97 ? 97 : 65;
        return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
      }
      return char;
    }).join('');

    return {
      title: "Encrypted Message",
      description: "NYX has intercepted an encrypted message. Decode it to proceed.",
      challenge: encrypted,
      solution: message.toLowerCase(),
      type: 'text_input',
      validation: (input) => input.toLowerCase().trim() === message.toLowerCase()
    };
  }

  // Generate logic puzzle
  generateLogicPuzzle(seed, difficulty) {
    const puzzles = [
      {
        title: "Binary Logic Gate",
        description: "Complete the logic sequence",
        pattern: [1, 0, 1, 0],
        solution: 1
      },
      {
        title: "Fibonacci Sequence",
        description: "What comes next?",
        pattern: [1, 1, 2, 3, 5, 8],
        solution: 13
      },
      {
        title: "Prime Numbers",
        description: "Continue the sequence",
        pattern: [2, 3, 5, 7, 11],
        solution: 13
      }
    ];

    const basePuzzle = puzzles[seed % puzzles.length];
    const multiplier = Math.floor(this.seededRandom(seed + difficulty, 1, difficulty + 1));

    return {
      title: basePuzzle.title,
      description: basePuzzle.description,
      challenge: `Sequence: ${basePuzzle.pattern.join(', ')}, ?`,
      solution: basePuzzle.solution * multiplier,
      type: 'number_input',
      validation: (input) => parseInt(input) === basePuzzle.solution * multiplier
    };
  }

  // Generate pattern recognition puzzle
  generatePatternPuzzle(seed, difficulty) {
    const symbols = ['●', '○', '▲', '△', '■', '□', '♦', '♢'];
    const patternLength = 3 + difficulty;
    const pattern = [];

    for (let i = 0; i < patternLength; i++) {
      pattern.push(symbols[this.seededRandom(seed + i, 0, symbols.length)]);
    }

    const nextSymbol = pattern[0]; // Simple: repeat first symbol

    return {
      title: "Symbol Pattern",
      description: "Identify the pattern and predict the next symbol",
      challenge: `Pattern: ${pattern.join(' ')} ?`,
      solution: nextSymbol,
      type: 'symbol_input',
      options: symbols,
      validation: (input) => input === nextSymbol
    };
  }

  // Generate sequence puzzle
  generateSequencePuzzle(seed, difficulty) {
    const sequences = {
      1: { nums: [2, 4, 6, 8], next: 10, rule: "even numbers" },
      2: { nums: [1, 4, 9, 16], next: 25, rule: "perfect squares" },
      3: { nums: [1, 3, 6, 10], next: 15, rule: "triangular numbers" },
      4: { nums: [1, 2, 4, 8], next: 16, rule: "powers of 2" },
      5: { nums: [0, 1, 1, 2, 3, 5], next: 8, rule: "fibonacci" }
    };

    const seq = sequences[difficulty] || sequences[1];

    return {
      title: "Number Sequence",
      description: "Determine the rule and find the next number",
      challenge: `${seq.nums.join(', ')}, ?`,
      solution: seq.next,
      type: 'number_input',
      validation: (input) => parseInt(input) === seq.next,
      hint: `Think about ${seq.rule}`
    };
  }

  // Generate network puzzle
  generateNetworkPuzzle(seed, difficulty) {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const connections = difficulty + 2;
    
    return {
      title: "Network Topology",
      description: "Find the shortest path through the network",
      challenge: "Map the network connections to find the optimal route",
      nodes: nodes.slice(0, connections),
      solution: "A->B->C",
      type: 'path_input',
      validation: (input) => input.includes('A') && input.includes('C')
    };
  }

  // Generate memory puzzle
  generateMemoryPuzzle(seed, difficulty) {
    const sequences = [];
    const length = 3 + difficulty;
    
    for (let i = 0; i < length; i++) {
      sequences.push(Math.floor(this.seededRandom(seed + i, 1, 10)));
    }

    return {
      title: "Memory Sequence",
      description: "Memorize the sequence and repeat it",
      challenge: `Remember: ${sequences.join(' ')}`,
      solution: sequences.join(''),
      type: 'sequence_input',
      validation: (input) => input.replace(/\s/g, '') === sequences.join('')
    };
  }

  // Generate social engineering puzzle
  generateSocialPuzzle(seed, difficulty, storyContext) {
    const scenarios = [
      {
        title: "Social Engineering",
        description: "Someone is trying to gain access. What do you do?",
        options: ["Grant access", "Verify identity", "Deny access", "Report incident"],
        solution: 1, // Verify identity
        context: "Security is paramount in the digital realm"
      },
      {
        title: "Trust Decision",
        description: "NYX offers you classified information. Do you accept?",
        options: ["Accept immediately", "Question the source", "Decline", "Verify with others"],
        solution: 1, // Question the source
        context: "Trust but verify"
      }
    ];

    const scenario = scenarios[seed % scenarios.length];

    return {
      title: scenario.title,
      description: scenario.description,
      challenge: scenario.context,
      options: scenario.options,
      solution: scenario.solution,
      type: 'multiple_choice',
      validation: (input) => parseInt(input) === scenario.solution
    };
  }

  // Generate hints for puzzle
  generateHints(puzzle, difficulty) {
    const genericHints = [
      "Consider the pattern carefully",
      "Look for mathematical relationships",
      "Sometimes the answer is simpler than it appears",
      "Think about what NYX would do",
      "The solution often lies in the details"
    ];

    const hints = [];
    const hintCount = Math.min(difficulty, 3);

    for (let i = 0; i < hintCount; i++) {
      hints.push({
        cost: 5 + (i * 10),
        text: puzzle.hint || genericHints[i % genericHints.length],
        level: i + 1
      });
    }

    return hints;
  }

  // Mark puzzle as solved
  solvePuzzle(puzzleId, playerData) {
    this.solvedPuzzles.add(puzzleId);
    this.saveProgress();
    
    devLogger.command(`puzzle_solved_${puzzleId}`, { 
      player: playerData.wallet,
      totalSolved: this.solvedPuzzles.size 
    });

    return {
      success: true,
      totalSolved: this.solvedPuzzles.size,
      achievement: this.checkAchievements()
    };
  }

  // Check for puzzle achievements
  checkAchievements() {
    const count = this.solvedPuzzles.size;
    const achievements = [];

    if (count === 1) achievements.push('first_puzzle');
    if (count === 10) achievements.push('puzzle_novice');
    if (count === 50) achievements.push('puzzle_expert');
    if (count === 100) achievements.push('puzzle_master');

    return achievements;
  }

  // Get puzzle statistics
  getStats() {
    return {
      totalSolved: this.solvedPuzzles.size,
      solvedPuzzles: Array.from(this.solvedPuzzles)
    };
  }
}

// Export singleton instance
export const puzzleGenerator = new PuzzleGenerator();

// Helper functions
export const generatePuzzle = (type, difficulty, playerData, storyContext) => 
  puzzleGenerator.generatePuzzle(type, difficulty, playerData, storyContext);

export const solvePuzzle = (puzzleId, playerData) => 
  puzzleGenerator.solvePuzzle(puzzleId, playerData);

export const getPuzzleStats = () => puzzleGenerator.getStats();
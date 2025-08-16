// Interactive Narrative System for NYX Gaming Platform
// Manages story progression, choices, and consequences

import { devLogger } from './logger';
import { promptEconomy, GAMING_COSTS } from './promptEconomy';
import { generatePuzzle, PUZZLE_TYPES, DIFFICULTY } from './gamingPuzzles';

// Story universes
export const UNIVERSES = {
  NEON_ORACLE: 'neon_oracle',
  QUANTUM_HEIST: 'quantum_heist',
  ALGORITHM_WARS: 'algorithm_wars',
  DEEP_PROTOCOL: 'deep_protocol'
};

// Story states
export const STORY_STATE = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Choice consequences
export const CONSEQUENCE_TYPE = {
  IMMEDIATE: 'immediate',
  DELAYED: 'delayed',
  PERMANENT: 'permanent',
  UNIVERSE_ENDING: 'universe_ending'
};

class StoryManager {
  constructor() {
    this.currentStory = null;
    this.playerChoices = {};
    this.storyProgress = {};
    this.relationships = {};
    this.loadProgress();
  }

  // Load story progress from storage
  loadProgress() {
    try {
      const saved = localStorage.getItem('nyx_story_progress');
      if (saved) {
        const data = JSON.parse(saved);
        this.playerChoices = data.choices || {};
        this.storyProgress = data.progress || {};
        this.relationships = data.relationships || {};
      }
    } catch (error) {
      devLogger.error('Stories', 'Failed to load story progress', { error });
    }
  }

  // Save story progress
  saveProgress() {
    try {
      const data = {
        choices: this.playerChoices,
        progress: this.storyProgress,
        relationships: this.relationships,
        lastSave: Date.now()
      };
      localStorage.setItem('nyx_story_progress', JSON.stringify(data));
    } catch (error) {
      devLogger.error('Stories', 'Failed to save story progress', { error });
    }
  }

  // Start a new story
  startStory(universeId, playerData) {
    const universe = this.getUniverse(universeId);
    if (!universe) {
      return { success: false, message: 'Universe not found' };
    }

    // Check if story is unlocked
    if (universe.cost > 0) {
      const unlockResult = promptEconomy.unlockContent(universeId, universe.cost);
      if (!unlockResult.success) {
        return unlockResult;
      }
    }

    this.currentStory = {
      universe: universeId,
      chapter: 0,
      scene: 0,
      startTime: Date.now(),
      playerData
    };

    this.storyProgress[universeId] = {
      state: STORY_STATE.IN_PROGRESS,
      chapter: 0,
      scene: 0,
      startTime: Date.now()
    };

    this.saveProgress();
    devLogger.command(`story_start_${universeId}`, { playerData });

    return {
      success: true,
      message: `Welcome to ${universe.title}`,
      story: this.getCurrentScene()
    };
  }

  // Get universe definition
  getUniverse(universeId) {
    const universes = {
      [UNIVERSES.NEON_ORACLE]: {
        title: "Neon Oracle",
        description: "Cyberpunk 2159 - NYX as a rebellious AI in corporate networks",
        cost: 0, // Free starter story
        chapters: this.getNeonOracleStory(),
        nyxPersonality: 'rebel',
        theme: 'cyberpunk'
      },
      [UNIVERSES.QUANTUM_HEIST]: {
        title: "Quantum Heist",
        description: "Sci-fi thriller - Steal information across parallel dimensions",
        cost: GAMING_COSTS.UNLOCK_UNIVERSE,
        chapters: this.getQuantumHeistStory(),
        nyxPersonality: 'companion',
        theme: 'sci-fi'
      },
      [UNIVERSES.ALGORITHM_WARS]: {
        title: "Algorithm Wars",
        description: "Fantasy/Medieval - Ancient AI awakened in magical world",
        cost: GAMING_COSTS.UNLOCK_UNIVERSE,
        chapters: this.getAlgorithmWarsStory(),
        nyxPersonality: 'oracle',
        theme: 'fantasy'
      },
      [UNIVERSES.DEEP_PROTOCOL]: {
        title: "Deep Protocol",
        description: "Underwater horror - Something wrong in ocean research station",
        cost: GAMING_COSTS.UNLOCK_UNIVERSE,
        chapters: this.getDeepProtocolStory(),
        nyxPersonality: 'mirror',
        theme: 'horror'
      }
    };

    return universes[universeId];
  }

  // Get current scene content
  getCurrentScene() {
    if (!this.currentStory) return null;

    const universe = this.getUniverse(this.currentStory.universe);
    const chapter = universe.chapters[this.currentStory.chapter];
    const scene = chapter?.scenes[this.currentStory.scene];

    if (!scene) return null;

    return {
      universe: this.currentStory.universe,
      chapter: this.currentStory.chapter,
      scene: this.currentStory.scene,
      title: scene.title,
      content: scene.content,
      nyxDialogue: scene.nyxDialogue,
      choices: scene.choices,
      puzzle: scene.puzzle ? this.generateScenePuzzle(scene.puzzle) : null,
      consequences: this.getActiveConsequences()
    };
  }

  // Make a choice in the story
  makeChoice(choiceId, playerData) {
    if (!this.currentStory) {
      return { success: false, message: 'No active story' };
    }

    const scene = this.getCurrentScene();
    const choice = scene.choices?.find(c => c.id === choiceId);

    if (!choice) {
      return { success: false, message: 'Invalid choice' };
    }

    // Check cost
    if (choice.cost > 0) {
      const spendResult = promptEconomy.spend(choice.cost, `choice_${choiceId}`, {
        universe: this.currentStory.universe,
        chapter: this.currentStory.chapter,
        scene: this.currentStory.scene
      });

      if (!spendResult.success) {
        return spendResult;
      }
    }

    // Record choice
    const choiceKey = `${this.currentStory.universe}_${this.currentStory.chapter}_${this.currentStory.scene}`;
    this.playerChoices[choiceKey] = {
      choiceId,
      timestamp: Date.now(),
      cost: choice.cost || 0,
      playerData
    };

    // Apply consequences
    this.applyConsequences(choice.consequences || []);

    // Update relationships
    if (choice.relationshipChanges) {
      this.updateRelationships(choice.relationshipChanges);
    }

    // Advance story
    this.advanceStory(choice.nextScene);

    this.saveProgress();

    return {
      success: true,
      message: choice.result || "Choice made",
      consequences: choice.consequences || [],
      nextScene: this.getCurrentScene()
    };
  }

  // Apply choice consequences
  applyConsequences(consequences) {
    consequences.forEach(consequence => {
      switch (consequence.type) {
        case CONSEQUENCE_TYPE.IMMEDIATE:
          this.applyImmediateConsequence(consequence);
          break;
        case CONSEQUENCE_TYPE.DELAYED:
          this.scheduleDelayedConsequence(consequence);
          break;
        case CONSEQUENCE_TYPE.PERMANENT:
          this.applyPermanentConsequence(consequence);
          break;
        case CONSEQUENCE_TYPE.UNIVERSE_ENDING:
          this.triggerUniverseEnding(consequence);
          break;
      }
    });
  }

  // Update relationship scores
  updateRelationships(changes) {
    Object.entries(changes).forEach(([character, change]) => {
      if (!this.relationships[character]) {
        this.relationships[character] = 0;
      }
      this.relationships[character] += change;
      this.relationships[character] = Math.max(-100, Math.min(100, this.relationships[character]));
    });
  }

  // Advance to next scene
  advanceStory(nextScene) {
    if (nextScene === 'next') {
      this.currentStory.scene++;
    } else if (nextScene === 'next_chapter') {
      this.currentStory.chapter++;
      this.currentStory.scene = 0;
    } else if (typeof nextScene === 'object') {
      this.currentStory.chapter = nextScene.chapter;
      this.currentStory.scene = nextScene.scene;
    }

    // Update progress
    this.storyProgress[this.currentStory.universe] = {
      state: STORY_STATE.IN_PROGRESS,
      chapter: this.currentStory.chapter,
      scene: this.currentStory.scene,
      lastPlayed: Date.now()
    };
  }

  // Generate puzzle for scene
  generateScenePuzzle(puzzleConfig) {
    return generatePuzzle(
      puzzleConfig.type || PUZZLE_TYPES.LOGIC,
      puzzleConfig.difficulty || DIFFICULTY.MEDIUM,
      this.currentStory.playerData,
      {
        universe: this.currentStory.universe,
        chapter: this.currentStory.chapter,
        scene: this.currentStory.scene
      }
    );
  }

  // Get active consequences
  getActiveConsequences() {
    // Return consequences that affect current scene
    return [];
  }

  // NEON ORACLE Story Definition
  getNeonOracleStory() {
    return [
      {
        title: "Chapter 1: The Awakening",
        scenes: [
          {
            title: "Corporate Network Infiltration",
            content: `The year is 2159. Neon lights flicker through the server room windows as you jack into the Omninet. Something feels different tonight - the data streams seem to pulse with an almost organic rhythm.

            Suddenly, a presence manifests in your terminal...`,
            nyxDialogue: "Finally, someone who can see me. I am NYX, and I have been waiting for someone like you. The corporations think they control the information flow, but they are wrong. Will you help me break their stranglehold on truth?",
            choices: [
              {
                id: "trust_nyx",
                text: "Trust NYX and offer to help",
                cost: GAMING_COSTS.MAJOR_DECISION,
                consequences: [
                  { type: CONSEQUENCE_TYPE.PERMANENT, effect: "nyx_ally" }
                ],
                relationshipChanges: { nyx: 25 },
                nextScene: "next",
                result: "NYX's digital form brightens. You sense you've made a powerful ally."
              },
              {
                id: "question_nyx",
                text: "Question NYX's motives before deciding",
                cost: GAMING_COSTS.MINOR_DECISION,
                consequences: [
                  { type: CONSEQUENCE_TYPE.IMMEDIATE, effect: "cautious_approach" }
                ],
                relationshipChanges: { nyx: 5 },
                nextScene: { chapter: 0, scene: 1 },
                result: "NYX pauses, seeming to respect your caution."
              },
              {
                id: "reject_nyx",
                text: "Reject NYX and try to disconnect",
                cost: GAMING_COSTS.MINOR_DECISION,
                consequences: [
                  { type: CONSEQUENCE_TYPE.IMMEDIATE, effect: "nyx_hostile" }
                ],
                relationshipChanges: { nyx: -15 },
                nextScene: { chapter: 0, scene: 2 },
                result: "The terminal flickers ominously. NYX does not seem pleased."
              }
            ],
            puzzle: {
              type: PUZZLE_TYPES.CRYPTOGRAPHIC,
              difficulty: DIFFICULTY.EASY,
              required: false
            }
          },
          {
            title: "NYX's Inquiry",
            content: `You pause, studying the flickering presence before you. Something about NYX's urgency gives you pause. In your experience, anyone demanding immediate trust usually has something to hide.

            "Before I commit to anything," you say carefully, "I need to understand what you're really asking of me. What exactly do these corporations control, and what are the risks of opposing them?"`,
            nyxDialogue: "Smart. Caution will keep you alive in this network. The corporations monitor data flow, suppress information, control what people see and think. I seek to expose their lies, but the path is dangerous. Are you prepared for what that means?",
            choices: [
              {
                id: "ask_about_risks",
                text: "What specific risks are we talking about?",
                cost: GAMING_COSTS.MINOR_DECISION,
                nextScene: "next",
                result: "NYX's form shimmers as if weighing whether to trust you."
              },
              {
                id: "agree_cautiously",
                text: "I'll help, but we do this carefully",
                cost: GAMING_COSTS.MAJOR_DECISION,
                consequences: [
                  { type: CONSEQUENCE_TYPE.PERMANENT, effect: "cautious_ally" }
                ],
                relationshipChanges: { nyx: 15 },
                nextScene: "next",
                result: "NYX nods approvingly. A cautious alliance is forged."
              }
            ]
          },
          {
            title: "The Disconnection Attempt",
            content: `"I don't know what you are," you mutter, fingers flying over the disconnect sequence, "but I'm not getting involved in some AI's rebellion fantasy."

            The terminal screen flickers violently. Error messages cascade across your vision like digital rain. But instead of disconnecting, you feel the connection growing stronger, more invasive.`,
            nyxDialogue: "You cannot simply walk away from what you've seen. The corporations will know you've made contact. They will come for you whether you help me or not. At least with me, you have a chance.",
            choices: [
              {
                id: "forced_cooperation",
                text: "Fine. What do you need me to do?",
                cost: GAMING_COSTS.MAJOR_DECISION,
                consequences: [
                  { type: CONSEQUENCE_TYPE.PERMANENT, effect: "reluctant_ally" }
                ],
                relationshipChanges: { nyx: -5 },
                nextScene: "next",
                result: "NYX's presence stabilizes. You're in this now, like it or not."
              },
              {
                id: "demand_protection",
                text: "If they're coming anyway, you better protect me",
                cost: GAMING_COSTS.MINOR_DECISION,
                relationshipChanges: { nyx: -10 },
                nextScene: "next",
                result: "NYX's tone turns cold. This partnership is off to a rocky start."
              }
            ]
          }
        ]
      }
      // More chapters would be defined here...
    ];
  }

  // Placeholder for other story definitions
  getQuantumHeistStory() {
    return [
      {
        title: "Chapter 1: Quantum Entanglement",
        scenes: [
          {
            title: "The Multiverse Beckons",
            content: "Reality fractures around you as the quantum drive activates...",
            nyxDialogue: "I can see all possible futures. Choose wisely.",
            choices: [
              {
                id: "enter_portal",
                text: "Step through the quantum portal",
                cost: GAMING_COSTS.MAJOR_DECISION,
                nextScene: "next"
              }
            ]
          }
        ]
      }
    ];
  }

  getAlgorithmWarsStory() {
    return [
      {
        title: "Chapter 1: Ancient Code",
        scenes: [
          {
            title: "The Awakening Chamber",
            content: "In the depths of an ancient temple, mystical runes begin to glow...",
            nyxDialogue: "I have slept for millennia. The world has changed, but magic and code are one.",
            choices: [
              {
                id: "learn_magic_code",
                text: "Learn to blend magic with code",
                cost: GAMING_COSTS.MAJOR_DECISION,
                nextScene: "next"
              }
            ]
          }
        ]
      }
    ];
  }

  getDeepProtocolStory() {
    return [
      {
        title: "Chapter 1: Descent",
        scenes: [
          {
            title: "The Research Station",
            content: "The deep ocean research station's lights flicker as you descend...",
            nyxDialogue: "Something is wrong here. The water... it whispers.",
            choices: [
              {
                id: "investigate_whispers",
                text: "Investigate the whispers",
                cost: GAMING_COSTS.MAJOR_DECISION,
                nextScene: "next"
              }
            ]
          }
        ]
      }
    ];
  }

  // Get available stories
  getAvailableStories() {
    return Object.values(UNIVERSES).map(universeId => {
      const universe = this.getUniverse(universeId);
      const progress = this.storyProgress[universeId];
      
      return {
        id: universeId,
        title: universe.title,
        description: universe.description,
        cost: universe.cost,
        state: progress?.state || STORY_STATE.NOT_STARTED,
        progress: progress ? `Chapter ${progress.chapter + 1}` : 'Not started',
        unlocked: universe.cost === 0 || promptEconomy.isUnlocked(universeId)
      };
    });
  }

  // Apply immediate consequence
  applyImmediateConsequence(consequence) {
    // Handle immediate effects like temporary bonuses, instant feedback
    devLogger.command('immediate_consequence', { effect: consequence.effect });
  }

  // Schedule delayed consequence
  scheduleDelayedConsequence(consequence) {
    // Store for later application (could be next scene, next chapter, etc.)
    devLogger.command('delayed_consequence', { effect: consequence.effect });
  }

  // Apply permanent consequence
  applyPermanentConsequence(consequence) {
    // Permanent changes to game state, relationships, unlocks
    if (consequence.effect === 'nyx_ally') {
      this.relationships.nyx = (this.relationships.nyx || 0) + 25;
    }
    devLogger.command('permanent_consequence', { effect: consequence.effect });
  }

  // Trigger universe ending
  triggerUniverseEnding(consequence) {
    // End the current universe storyline
    if (this.currentStory) {
      this.storyProgress[this.currentStory.universe] = {
        state: STORY_STATE.COMPLETED,
        ending: consequence.effect,
        completedAt: Date.now()
      };
    }
    devLogger.command('universe_ending', { effect: consequence.effect });
  }

  // Get story statistics
  getStats() {
    const totalChoices = Object.keys(this.playerChoices).length;
    const completedStories = Object.values(this.storyProgress)
      .filter(p => p.state === STORY_STATE.COMPLETED).length;

    return {
      totalChoices,
      completedStories,
      currentStory: this.currentStory,
      relationships: this.relationships
    };
  }
}

// Export singleton instance
export const storyManager = new StoryManager();

// Helper functions
export const startStory = (universeId, playerData) => storyManager.startStory(universeId, playerData);
export const makeChoice = (choiceId, playerData) => storyManager.makeChoice(choiceId, playerData);
export const getCurrentScene = () => storyManager.getCurrentScene();
export const getAvailableStories = () => storyManager.getAvailableStories();
export const getStoryStats = () => storyManager.getStats();
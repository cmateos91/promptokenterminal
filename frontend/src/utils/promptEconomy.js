// $PROMPT Token Economy for NYX Gaming Platform
// Handles all token transactions, balances, and gaming costs

import { userProgress } from './userState';
import { devLogger } from './logger';

// Gaming Economy Configuration
export const GAMING_COSTS = {
  // Decision Points
  MINOR_DECISION: 10,
  MAJOR_DECISION: 50,
  CRITICAL_DECISION: 100,
  UNIVERSE_ENDING: 250,
  
  // Hint System
  BASIC_HINT: 5,
  ADVANCED_HINT: 15,
  COMPLEX_HINT: 25,
  EMERGENCY_HINT: 50,
  
  // Story Features
  SAVE_STATE: 20,
  REWIND_DECISION: 75,
  UNLOCK_STORY: 100,
  UNLOCK_UNIVERSE: 500,
  
  // Social Features
  SHARE_PROGRESS: 10,
  GIFT_HINT: 25,
  COLLABORATIVE_PUZZLE: 50,
  
  // Premium Features
  NYX_PERSONALITY_UNLOCK: 200,
  CUSTOM_NYX_SKIN: 150,
  EARLY_ACCESS_STORY: 300
};

// Gaming Rewards
export const GAMING_REWARDS = {
  PUZZLE_SOLVED: 25,
  STORY_COMPLETED: 100,
  PERFECT_RUN: 200,
  ACHIEVEMENT_UNLOCK: 50,
  COMMUNITY_CHALLENGE: 75,
  REFERRAL_BONUS: 100
};

class PromptEconomy {
  constructor() {
    this.balance = 0;
    this.transactions = [];
    this.achievements = new Set();
    this.unlockedContent = new Set();
    this.loadFromStorage();
  }

  // Load economy data from localStorage
  loadFromStorage() {
    try {
      const savedData = localStorage.getItem('prompt_economy');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.balance = data.balance || 0;
        this.transactions = data.transactions || [];
        this.achievements = new Set(data.achievements || []);
        this.unlockedContent = new Set(data.unlockedContent || []);
      }
    } catch (error) {
      devLogger.error('Economy', 'Failed to load economy data', { error });
    }
  }

  // Save economy data to localStorage
  saveToStorage() {
    try {
      const data = {
        balance: this.balance,
        transactions: this.transactions.slice(-100), // Keep last 100 transactions
        achievements: Array.from(this.achievements),
        unlockedContent: Array.from(this.unlockedContent),
        lastSave: Date.now()
      };
      localStorage.setItem('prompt_economy', JSON.stringify(data));
    } catch (error) {
      devLogger.error('Economy', 'Failed to save economy data', { error });
    }
  }

  // Get current balance
  getBalance() {
    return this.balance;
  }

  // Check if user can afford an action
  canAfford(cost) {
    return this.balance >= cost;
  }

  // Spend tokens
  spend(amount, action, context = {}) {
    if (!this.canAfford(amount)) {
      return {
        success: false,
        message: `Insufficient $PROMPT tokens. Need ${amount}, have ${this.balance}`,
        balance: this.balance
      };
    }

    this.balance -= amount;
    this.addTransaction({
      type: 'spend',
      amount: -amount,
      action,
      context,
      timestamp: Date.now(),
      balanceAfter: this.balance
    });

    this.saveToStorage();
    devLogger.command(`spend_${action}`, { 
      amount: -amount,
      newBalance: this.balance, 
      context 
    });

    return {
      success: true,
      message: `Spent ${amount} $PROMPT for ${action}`,
      balance: this.balance
    };
  }

  // Earn tokens
  earn(amount, reason, context = {}) {
    this.balance += amount;
    this.addTransaction({
      type: 'earn',
      amount: +amount,
      reason,
      context,
      timestamp: Date.now(),
      balanceAfter: this.balance
    });

    this.saveToStorage();
    devLogger.command(`earn_${reason}`, { 
      amount: +amount,
      newBalance: this.balance, 
      context 
    });

    return {
      success: true,
      message: `Earned ${amount} $PROMPT for ${reason}`,
      balance: this.balance
    };
  }

  // Add transaction to history
  addTransaction(transaction) {
    this.transactions.unshift(transaction);
    // Keep only last 100 transactions
    if (this.transactions.length > 100) {
      this.transactions = this.transactions.slice(0, 100);
    }
  }

  // Get transaction history
  getTransactions(limit = 10) {
    return this.transactions.slice(0, limit);
  }

  // Unlock content
  unlockContent(contentId, cost) {
    if (this.unlockedContent.has(contentId)) {
      return {
        success: false,
        message: 'Content already unlocked',
        balance: this.balance
      };
    }

    const spendResult = this.spend(cost, `unlock_${contentId}`, { contentId });
    if (spendResult.success) {
      this.unlockedContent.add(contentId);
      this.saveToStorage();
    }

    return spendResult;
  }

  // Check if content is unlocked
  isUnlocked(contentId) {
    return this.unlockedContent.has(contentId);
  }

  // Award achievement
  awardAchievement(achievementId, reward = 0) {
    if (this.achievements.has(achievementId)) {
      return {
        success: false,
        message: 'Achievement already earned'
      };
    }

    this.achievements.add(achievementId);
    
    if (reward > 0) {
      this.earn(reward, `achievement_${achievementId}`, { achievementId });
    }

    this.saveToStorage();
    devLogger.command(`achievement_${achievementId}`, { reward });

    return {
      success: true,
      message: `Achievement unlocked: ${achievementId}`,
      reward,
      balance: this.balance
    };
  }

  // Get achievements
  getAchievements() {
    return Array.from(this.achievements);
  }

  // Get economy statistics
  getStats() {
    const totalSpent = this.transactions
      .filter(t => t.type === 'spend')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalEarned = this.transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: this.balance,
      totalSpent,
      totalEarned,
      transactionCount: this.transactions.length,
      achievementCount: this.achievements.size,
      unlockedContentCount: this.unlockedContent.size,
      lastActivity: this.transactions[0]?.timestamp || null
    };
  }

  // Reset economy (for testing)
  reset() {
    this.balance = 0;
    this.transactions = [];
    this.achievements.clear();
    this.unlockedContent.clear();
    localStorage.removeItem('prompt_economy');
    devLogger.command('economy_reset', {});
  }

  // Add starting balance for new users
  initializeNewUser() {
    if (this.balance === 0 && this.transactions.length === 0) {
      this.earn(1000, 'welcome_bonus', { newUser: true });
      this.awardAchievement('first_login', 50);
    }
  }
}

// Export singleton instance
export const promptEconomy = new PromptEconomy();

// Initialize for new users
promptEconomy.initializeNewUser();

// Helper functions for easy access
export const canAfford = (cost) => promptEconomy.canAfford(cost);
export const spend = (amount, action, context) => promptEconomy.spend(amount, action, context);
export const earn = (amount, reason, context) => promptEconomy.earn(amount, reason, context);
export const getBalance = () => promptEconomy.getBalance();
export const unlockContent = (contentId, cost) => promptEconomy.unlockContent(contentId, cost);
export const isUnlocked = (contentId) => promptEconomy.isUnlocked(contentId);
export const awardAchievement = (id, reward) => promptEconomy.awardAchievement(id, reward);
import { describe, it, expect, beforeEach } from 'vitest'
import { 
  mockWalletState, 
  userProgress, 
  checkLevelUp, 
  getUserStatus,
  getNextLevelRequirement 
} from '../../utils/userState'

describe('User State Management', () => {
  beforeEach(() => {
    // Reset state
    mockWalletState.connected = false
    mockWalletState.address = null
    mockWalletState.balance = 0
    mockWalletState.stakedAmount = 0
    mockWalletState.rewards = 0
    
    userProgress.level = 0
    userProgress.commandCount = 0
    userProgress.secretsFound = 0
    userProgress.achievements = []
    userProgress.unlockedCommands.clear()
    userProgress.secretsFoundSet.clear()
  })

  describe('Level Progression', () => {
    it('should start at level 0 (ANONYMOUS)', () => {
      const status = getUserStatus()
      expect(status.level).toBe(0)
      expect(status.name).toBe('ANONYMOUS')
    })

    it('should level up to USER when connecting wallet', () => {
      mockWalletState.connected = true
      const leveledUp = checkLevelUp('connect')
      
      expect(leveledUp).toBe(true)
      expect(userProgress.level).toBe(1)
      
      const status = getUserStatus()
      expect(status.name).toBe('USER')
    })

    it('should level up to STAKER when staking tokens', () => {
      // Setup prerequisite
      mockWalletState.connected = true
      userProgress.level = 1
      mockWalletState.stakedAmount = 100
      
      const leveledUp = checkLevelUp('stake')
      
      expect(leveledUp).toBe(true)
      expect(userProgress.level).toBe(2)
      
      const status = getUserStatus()
      expect(status.name).toBe('STAKER')
    })

    it('should level up to EXPERT with 15+ commands', () => {
      userProgress.level = 2
      userProgress.commandCount = 15
      
      const leveledUp = checkLevelUp('somecommand')
      
      expect(leveledUp).toBe(true)
      expect(userProgress.level).toBe(3)
      
      const status = getUserStatus()
      expect(status.name).toBe('EXPERT')
    })

    it('should level up to HACKER with 3 secrets found', () => {
      userProgress.level = 3
      userProgress.secretsFound = 3
      
      const leveledUp = checkLevelUp('somecommand')
      
      expect(leveledUp).toBe(true)
      expect(userProgress.level).toBe(4)
      
      const status = getUserStatus()
      expect(status.name).toBe('HACKER')
    })

    it('should not level up without meeting requirements', () => {
      const leveledUp = checkLevelUp('help')
      expect(leveledUp).toBe(false)
      expect(userProgress.level).toBe(0)
    })
  })

  describe('Next Level Requirements', () => {
    it('should show correct requirement for level 0', () => {
      const requirement = getNextLevelRequirement()
      expect(requirement).toContain('Connect a wallet')
    })

    it('should show correct requirement for level 1', () => {
      userProgress.level = 1
      const requirement = getNextLevelRequirement()
      expect(requirement).toContain('Stake tokens')
    })

    it('should show correct requirement for level 2', () => {
      userProgress.level = 2
      userProgress.commandCount = 5
      const requirement = getNextLevelRequirement()
      expect(requirement).toContain('10 more commands')
    })

    it('should show correct requirement for level 3', () => {
      userProgress.level = 3
      userProgress.secretsFound = 1
      const requirement = getNextLevelRequirement()
      expect(requirement).toContain('2 more secrets')
    })

    it('should show max level achieved for level 4', () => {
      userProgress.level = 4
      const requirement = getNextLevelRequirement()
      expect(requirement).toBe('Maximum level achieved')
    })
  })

  describe('Command Unlocking', () => {
    it('should unlock basic commands at level 1', () => {
      mockWalletState.connected = true
      checkLevelUp('connect')
      
      expect(userProgress.unlockedCommands.has('disconnect')).toBe(true)
      expect(userProgress.unlockedCommands.has('balance')).toBe(true)
      expect(userProgress.unlockedCommands.has('status')).toBe(true)
    })

    it('should unlock staking commands at level 2', () => {
      userProgress.level = 1
      mockWalletState.stakedAmount = 100
      checkLevelUp('stake')
      
      expect(userProgress.unlockedCommands.has('unstake')).toBe(true)
      expect(userProgress.unlockedCommands.has('claim')).toBe(true)
      expect(userProgress.unlockedCommands.has('rewards')).toBe(true)
    })
  })
})

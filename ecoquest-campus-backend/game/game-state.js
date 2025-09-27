const { getDB } = require('../config/firebase-config');

class GameStateManager {
  constructor() {
    this.achievements = {
      'first_scan': {
        name: 'Getting Started',
        description: 'Scan your first object',
        icon: '🔍',
        points: 100,
        requirement: { scanCount: 1 }
      },
      'eco_warrior': {
        name: 'Eco Warrior',
        description: 'Save 10kg of CO2',
        icon: '🌱',
        points: 500,
        requirement: { carbonSaved: 10 }
      },
      'recycling_master': {
        name: 'Recycling Master',
        description: 'Recycle 25 items',
        icon: '♻️',
        points: 750,
        requirement: { recycleCount: 25 }
      },
      'scanner_pro': {
        name: 'Scanner Pro',
        description: 'Scan 100 objects',
        icon: '📱',
        points: 600,
        requirement: { scanCount: 100 }
      }
    };
  }

  async getPlayerState(userId) {
    try {
      const db = getDB();
      const playerDoc = await db.collection('players').doc(userId).get();
      
      if (!playerDoc.exists) {
        const newPlayer = this.createNewPlayer();
        await db.collection('players').doc(userId).set(newPlayer);
        return newPlayer;
      }
      
      return playerDoc.data();
    } catch (error) {
      console.error('Error getting player state:', error);
      throw error;
    }
  }

  createNewPlayer() {
    return {
      level: 1,
      xp: 0,
      totalPoints: 0,
      achievements: [],
      stats: {
        scanCount: 0,
        recycleCount: 0,
        sellCount: 0,
        donateCount: 0,
        carbonSaved: 0,
        moneyEarned: 0,
        streakDays: 0,
        lastScanDate: null,
        joinDate: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updatePlayerStats(userId, scanResult, action) {
    try {
      const db = getDB();
      const playerRef = db.collection('players').doc(userId);
      
      return await db.runTransaction(async (transaction) => {
        const playerDoc = await transaction.get(playerRef);
        const playerData = playerDoc.data();
        
        // Calculate points earned
        const pointsEarned = this.calculatePoints(scanResult, action, playerData);
        
        // Update stats
        const updatedStats = {
          ...playerData.stats,
          scanCount: playerData.stats.scanCount + 1,
          carbonSaved: playerData.stats.carbonSaved + (scanResult.environmental?.carbonSaved || 0),
          moneyEarned: playerData.stats.moneyEarned + (action === 'sell' ? scanResult.price?.estimated || 0 : 0),
          lastScanDate: new Date()
        };

        // Update action-specific stats
        if (action === 'recycle') updatedStats.recycleCount = playerData.stats.recycleCount + 1;
        if (action === 'sell') updatedStats.sellCount = playerData.stats.sellCount + 1;
        if (action === 'donate') updatedStats.donateCount = playerData.stats.donateCount + 1;

        // Calculate streak
        updatedStats.streakDays = this.calculateStreak(playerData.stats.lastScanDate);

        // Calculate new level
        const newXP = playerData.xp + pointsEarned;
        const newLevel = this.calculateLevel(newXP);
        
        // Check for new achievements
        const newAchievements = this.checkAchievements(playerData, updatedStats);
        
        const updatedPlayer = {
          ...playerData,
          xp: newXP,
          level: newLevel,
          totalPoints: playerData.totalPoints + pointsEarned,
          stats: updatedStats,
          achievements: [...new Set([...playerData.achievements, ...newAchievements])],
          updatedAt: new Date()
        };
        
        transaction.update(playerRef, updatedPlayer);
        
        return {
          pointsEarned,
          newLevel: newLevel > playerData.level,
          newAchievements,
          playerState: updatedPlayer
        };
      });

    } catch (error) {
      console.error('Error updating player stats:', error);
      throw error;
    }
  }

  calculatePoints(scanResult, action, playerData) {
    const basePoints = {
      'scan': 10,
      'recycle': 50,
      'sell': 30,
      'donate': 40,
      'share': 20
    };
    
    const points = basePoints[action] || basePoints['scan'];
    const levelMultiplier = 1 + (playerData.level * 0.1);
    const environmentalBonus = scanResult.environmental?.carbonSaved > 1 ? 1.5 : 1.0;
    const streakBonus = 1 + (playerData.stats.streakDays * 0.05); // 5% bonus per streak day
    
    return Math.floor(points * levelMultiplier * environmentalBonus * streakBonus);
  }

  calculateLevel(xp) {
    // Level formula: square root progression
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  calculateStreak(lastScanDate) {
    if (!lastScanDate) return 1;
    
    const now = new Date();
    const lastScan = new Date(lastScanDate);
    const diffHours = (now - lastScan) / (1000 * 60 * 60);
    
    // If scanned within 48 hours, maintain streak
    if (diffHours <= 48) {
      return Math.floor(diffHours / 24) + 1;
    }
    return 1; // Reset streak
  }

  checkAchievements(oldPlayerData, newStats) {
    const newAchievements = [];
    
    for (const [achievementId, achievement] of Object.entries(this.achievements)) {
      if (oldPlayerData.achievements.includes(achievementId)) continue;
      
      const req = achievement.requirement;
      let achieved = false;
      
      if (req.scanCount && newStats.scanCount >= req.scanCount) achieved = true;
      if (req.carbonSaved && newStats.carbonSaved >= req.carbonSaved) achieved = true;
      if (req.recycleCount && newStats.recycleCount >= req.recycleCount) achieved = true;
      
      if (achieved) {
        newAchievements.push(achievementId);
      }
    }
    
    return newAchievements;
  }

  getXPToNextLevel(currentXP) {
    const currentLevel = this.calculateLevel(currentXP);
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    return Math.max(0, nextLevelXP - currentXP);
  }

  getAchievementProgress(playerData, achievement) {
    const req = achievement.requirement;
    const stats = playerData.stats;
    
    if (req.scanCount) {
      return Math.min(100, Math.round((stats.scanCount / req.scanCount) * 100));
    }
    if (req.carbonSaved) {
      return Math.min(100, Math.round((stats.carbonSaved / req.carbonSaved) * 100));
    }
    if (req.recycleCount) {
      return Math.min(100, Math.round((stats.recycleCount / req.recycleCount) * 100));
    }
    
    return 0;
  }
}



module.exports = new GameStateManager();
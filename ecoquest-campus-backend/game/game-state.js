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

  // Updated to accept name/email and PATCH missing info for existing users
  async getPlayerState(userId, name = null, email = null) {
    try {
      const db = getDB();
      const playerRef = db.collection('players').doc(userId);
      const playerDoc = await playerRef.get();

      if (!playerDoc.exists) {
        const newPlayer = this.createNewPlayer(name, email);
        await playerRef.set(newPlayer);
        return newPlayer;
      }

      // PATCH: If player exists but no name/email, update it!
      const playerData = playerDoc.data();
      let patchNeeded = false;
      let patchData = {};
      if (!playerData.name && name) {
        patchData.name = name;
        patchNeeded = true;
      }
      if (!playerData.email && email) {
        patchData.email = email;
        patchNeeded = true;
      }
      if (patchNeeded) {
        await playerRef.set(patchData, { merge: true });
        return { ...playerData, ...patchData };
      }

      return playerData;
    } catch (error) {
      console.error('Error getting player state:', error);
      throw error;
    }
  }

  // Accept name and email for new players
  createNewPlayer(name = null, email = null) {
    return {
      name: name,
      email: email,
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
        let playerData = playerDoc.exists ? playerDoc.data() : this.createNewPlayer();

        const xpEarned = this.calculateXPEarned(scanResult, action, playerData);
        const pointsEarned = this.calculatePoints(scanResult, action, playerData);

        const updatedStats = {
          ...playerData.stats,
          scanCount: playerData.stats.scanCount + 1,
          carbonSaved: playerData.stats.carbonSaved + (scanResult.environmental?.carbonSaved || 0),
          moneyEarned: playerData.stats.moneyEarned + (action === 'sell' ? scanResult.price?.estimated || 0 : 0),
          lastScanDate: new Date()
        };

        if (action === 'recycle') updatedStats.recycleCount = playerData.stats.recycleCount + 1;
        if (action === 'sell') updatedStats.sellCount = playerData.stats.sellCount + 1;
        if (action === 'donate') updatedStats.donateCount = playerData.stats.donateCount + 1;

        updatedStats.streakDays = this.calculateStreak(playerData.stats.lastScanDate);

        const newXP = (playerData.xp || 0) + xpEarned;
        const newLevel = this.calculateLevel(newXP);
        const newTotalPoints = (playerData.totalPoints || 0) + pointsEarned;
        const newAchievements = this.checkAchievements(playerData, updatedStats);

        const updatedPlayer = {
          ...playerData,
          xp: newXP,
          level: newLevel,
          totalPoints: newTotalPoints,
          stats: updatedStats,
          achievements: [...new Set([...playerData.achievements, ...newAchievements])],
          updatedAt: new Date()
        };

        transaction.set(playerRef, updatedPlayer, { merge: true });

        return {
          xpEarned,
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
    const levelMultiplier = 1 + (playerData.level * 0.05);
    const environmentalBonus = (scanResult.environmental?.carbonSaved > 2) ? 1.25 : 1.0;
    const streakBonus = 1 + (playerData.stats.streakDays * 0.03);

    return Math.floor(points * levelMultiplier * environmentalBonus * streakBonus);
  }

  calculateXPEarned(scanResult, action, playerData) {
    const baseXP = {
      'scan': 15,
      'recycle': 20,
      'sell': 25,
      'donate': 18,
      'share': 10
    };
    const xp = baseXP[action] || baseXP['scan'];
    const environmentalBonus = (scanResult.environmental?.carbonSaved > 2) ? 1.5 : 1.0;
    const streakBonus = 1 + (playerData.stats.streakDays * 0.05);

    return Math.floor(xp * environmentalBonus * streakBonus);
  }

  calculateLevel(xp) {
    return Math.floor(Math.sqrt(xp / 120)) + 1;
  }

  calculateStreak(lastScanDate) {
    if (!lastScanDate) return 1;
    const now = new Date();
    const lastScan = new Date(lastScanDate);
    const diffHours = (now - lastScan) / (1000 * 60 * 60);
    if (diffHours <= 48) {
      return Math.floor(diffHours / 24) + 1;
    }
    return 1;
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
    const nextLevelXP = Math.pow(currentLevel, 2) * 120;
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
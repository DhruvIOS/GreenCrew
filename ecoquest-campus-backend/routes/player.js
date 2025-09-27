const express = require('express');
const gameState = require('../game/game-state');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Get player profile and game state
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const playerState = await gameState.getPlayerState(req.user.uid);
    res.json({
      success: true,
      player: playerState
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get player achievements
router.get('/achievements', authenticateUser, async (req, res) => {
  try {
    const playerData = await gameState.getPlayerState(req.user.uid);
    const allAchievements = gameState.achievements;
    
    const achievementsWithStatus = Object.entries(allAchievements).map(([id, achievement]) => ({
      id,
      ...achievement,
      unlocked: playerData.achievements.includes(id),
      progress: gameState.getAchievementProgress(playerData, achievement)
    }));
    
    res.json({
      success: true,
      achievements: achievementsWithStatus,
      unlockedCount: playerData.achievements.length,
      totalCount: Object.keys(allAchievements).length
    });
  } catch (error) {
    console.error('Achievements fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get player stats
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    const playerData = await gameState.getPlayerState(req.user.uid);
    
    const stats = {
      level: playerData.level,
      xp: playerData.xp,
      xpToNextLevel: gameState.getXPToNextLevel(playerData.xp),
      totalPoints: playerData.totalPoints,
      ...playerData.stats,
      joinedDaysAgo: Math.floor((new Date() - new Date(playerData.stats.joinDate)) / (1000 * 60 * 60 * 24))
    };
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
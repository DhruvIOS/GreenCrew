const express = require('express');
const router = express.Router();
const gameState = require('../game/game-state');
const authenticateUser = require('../middleware/auth');

// Get player profile and game state
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    // Use displayName or name or email from req.user
    const name = req.user.displayName || req.user.name || req.user.email;
    const email = req.user.email;
    // Ensure name/email are set on player doc
    const playerState = await gameState.getPlayerState(req.user.uid, name, email);
    res.json({
      success: true,
      player: {
        name: playerState.name,         // <-- now included!
        email: playerState.email,       // <-- now included!
        xp: playerState.xp,
        level: playerState.level,
        totalPoints: playerState.totalPoints,
        achievements: playerState.achievements,
        stats: playerState.stats
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get player achievements
router.get('/achievements', authenticateUser, async (req, res) => {
  try {
    const name = req.user.displayName || req.user.name || req.user.email;
    const email = req.user.email;
    const playerData = await gameState.getPlayerState(req.user.uid, name, email);
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
    const name = req.user.displayName || req.user.name || req.user.email;
    const email = req.user.email;
    const playerData = await gameState.getPlayerState(req.user.uid, name, email);

    const stats = {
      level: playerData.level,
      xp: playerData.xp,
      xpToNextLevel: gameState.getXPToNextLevel(playerData.xp),
      totalPoints: playerData.totalPoints,
      ...playerData.stats,
      joinedDaysAgo: Math.floor((new Date() - new Date(playerData.stats.joinDate)) / (1000 * 60 * 60 * 24))
    };

    res.json({ success: true, stats: stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
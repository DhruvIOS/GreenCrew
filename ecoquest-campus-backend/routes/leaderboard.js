const express = require('express');
const leaderboard = require('../game/leaderboard');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Get leaderboard - fixed route syntax
router.get('/', authenticateUser, async (req, res) => {
  try {
    const type = req.query.type || 'weekly';
    const limit = parseInt(req.query.limit) || 50;
    
    const leaderboardData = await leaderboard.getLeaderboard(type, limit);
    const playerRank = await leaderboard.getPlayerRank(req.user.uid, type);
    
    res.json({
      success: true,
      leaderboard: leaderboardData,
      playerRank: playerRank,
      type: type,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get specific leaderboard type
router.get('/weekly', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const leaderboardData = await leaderboard.getLeaderboard('weekly', limit);
    const playerRank = await leaderboard.getPlayerRank(req.user.uid, 'weekly');
    
    res.json({
      success: true,
      leaderboard: leaderboardData,
      playerRank: playerRank,
      type: 'weekly'
    });
  } catch (error) {
    console.error('Weekly leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly leaderboard' });
  }
});

// Get monthly leaderboard
router.get('/monthly', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const leaderboardData = await leaderboard.getLeaderboard('monthly', limit);
    const playerRank = await leaderboard.getPlayerRank(req.user.uid, 'monthly');
    
    res.json({
      success: true,
      leaderboard: leaderboardData,
      playerRank: playerRank,
      type: 'monthly'
    });
  } catch (error) {
    console.error('Monthly leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly leaderboard' });
  }
});

// Get campus statistics
router.get('/stats/campus', authenticateUser, async (req, res) => {
  try {
    const stats = await leaderboard.getCampusStats();
    
    res.json({
      success: true,
      stats: stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Campus stats error:', error);
    res.status(500).json({ error: 'Failed to fetch campus stats' });
  }
});

module.exports = router;
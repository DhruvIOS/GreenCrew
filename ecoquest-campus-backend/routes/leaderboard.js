const express = require('express');
const router = express.Router();
const { getDB } = require('../config/firebase-config');

// GET /api/leaderboard/global - returns top 20 players sorted by totalPoints
router.get('/global', async (req, res) => {
  try {
    const db = getDB();
    const snapshot = await db.collection('players')
      .orderBy('totalPoints', 'desc')
      .limit(20)
      .get();

    // Use a counter for rank
    let rank = 1;
    const leaderboard = [];
    snapshot.forEach((doc) => {
      const player = doc.data();
      leaderboard.push({
        rank: rank++, // <------ THIS guarantees numbering!
        name: player.name || player.displayName || player.email || 'Anonymous',
        level: player.level || 1,
        xp: player.xp || 0,
        totalPoints: player.totalPoints || 0,
        achievements: player.achievements || [],
      });
    });
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
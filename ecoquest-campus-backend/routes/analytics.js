const express = require('express');
const { getDB } = require('../config/firebase-config');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Campus-wide statistics
router.get('/campus', authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    
    // Get all active players
    const playersSnapshot = await db.collection('players')
      .where('stats.scanCount', '>', 0)
      .get();

    let stats = {
      totalPlayers: 0,
      totalScans: 0,
      totalCarbonSaved: 0,
      totalMoneyEarned: 0,
      totalRecycles: 0,
      totalSells: 0,
      totalDonations: 0,
      avgLevel: 0,
      topCategories: {},
      dailyActivity: []
    };

    let totalLevels = 0;

    playersSnapshot.forEach(doc => {
      const data = doc.data();
      stats.totalPlayers++;
      stats.totalScans += data.stats?.scanCount || 0;
      stats.totalCarbonSaved += data.stats?.carbonSaved || 0;
      stats.totalMoneyEarned += data.stats?.moneyEarned || 0;
      stats.totalRecycles += data.stats?.recycleCount || 0;
      stats.totalSells += data.stats?.sellCount || 0;
      stats.totalDonations += data.stats?.donateCount || 0;
      totalLevels += data.level || 1;
    });

    // Calculate averages
    if (stats.totalPlayers > 0) {
      stats.avgLevel = Math.round((totalLevels / stats.totalPlayers) * 10) / 10;
      stats.avgScansPerPlayer = Math.round((stats.totalScans / stats.totalPlayers) * 10) / 10;
      stats.avgCarbonPerPlayer = Math.round((stats.totalCarbonSaved / stats.totalPlayers) * 100) / 100;
    }

    // Environmental impact calculations
    stats.environmental = {
      treesEquivalent: Math.round(stats.totalCarbonSaved / 21.77 * 10) / 10, // 1 tree = ~21.77kg CO2/year
      carsOffRoad: Math.round(stats.totalCarbonSaved / 4600 * 100) / 100, // Average car = 4.6 tons CO2/year
      energyEquivalent: Math.round(stats.totalCarbonSaved * 2.2 * 10) / 10, // Rough estimate: 1kg CO2 = 2.2 kWh
    };

    // Round financial data
    stats.totalCarbonSaved = Math.round(stats.totalCarbonSaved * 100) / 100;
    stats.totalMoneyEarned = Math.round(stats.totalMoneyEarned * 100) / 100;

    res.json({
      success: true,
      stats: stats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Campus analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch campus analytics' });
  }
});

// Player personal analytics
router.get('/personal', authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    
    // Get player data
    const playerDoc = await db.collection('players').doc(req.user.uid).get();
    if (!playerDoc.exists) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const playerData = playerDoc.data();
    
    // Get player's scan history
    const scansSnapshot = await db.collection('scans')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    // Analyze scan patterns
    const scanAnalytics = {
      totalScans: playerData.stats?.scanCount || 0,
      categoryCounts: {},
      dailyActivity: {},
      avgPerDay: 0,
      favoriteAction: null,
      totalImpact: {
        carbon: playerData.stats?.carbonSaved || 0,
        money: playerData.stats?.moneyEarned || 0
      }
    };

    // Process scan history
    scansSnapshot.forEach(doc => {
      const scan = doc.data();
      const category = scan.object?.category || 'Unknown';
      const date = scan.timestamp.toDate().toDateString();
      
      scanAnalytics.categoryCounts[category] = (scanAnalytics.categoryCounts[category] || 0) + 1;
      scanAnalytics.dailyActivity[date] = (scanAnalytics.dailyActivity[date] || 0) + 1;
    });

    // Calculate daily average
    const daysSinceJoin = Math.max(1, Math.floor(
      (new Date() - playerData.stats.joinDate.toDate()) / (1000 * 60 * 60 * 24)
    ));
    scanAnalytics.avgPerDay = Math.round((scanAnalytics.totalScans / daysSinceJoin) * 100) / 100;

    res.json({
      success: true,
      analytics: scanAnalytics,
      playerLevel: playerData.level,
      achievements: playerData.achievements?.length || 0,
      joinDate: playerData.stats?.joinDate,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Personal analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch personal analytics' });
  }
});

module.exports = router;
const { getDB } = require('../config/firebase-config');

class LeaderboardManager {
  async getLeaderboard(type = 'weekly', limit = 50) {
    try {
      const db = getDB();
      
      let query = db.collection('players')
        .where('stats.scanCount', '>', 0)
        .orderBy('totalPoints', 'desc')
        .limit(limit);

      // Add time filtering for weekly/monthly
      if (type === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        // Note: In production, you'd want to structure data differently for time-based queries
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          uid: doc.id,
          rank: index + 1,
          name: data.name || data.email || 'Anonymous',
          level: data.level,
          totalPoints: data.totalPoints,
          carbonSaved: data.stats?.carbonSaved || 0,
          scanCount: data.stats?.scanCount || 0,
          achievements: data.achievements?.length || 0,
          streakDays: data.stats?.streakDays || 0
        };
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  async getPlayerRank(userId, type = 'weekly') {
    try {
      const leaderboard = await this.getLeaderboard(type, 1000);
      const playerIndex = leaderboard.findIndex(player => player.uid === userId);
      return playerIndex >= 0 ? playerIndex + 1 : null;
    } catch (error) {
      console.error('Error getting player rank:', error);
      return null;
    }
  }

  async getCampusStats() {
    try {
      const db = getDB();
      const playersSnapshot = await db.collection('players')
        .where('stats.scanCount', '>', 0)
        .get();

      let totalPlayers = 0;
      let totalScans = 0;
      let totalCarbon = 0;
      let totalMoney = 0;

      playersSnapshot.forEach(doc => {
        const data = doc.data();
        totalPlayers++;
        totalScans += data.stats?.scanCount || 0;
        totalCarbon += data.stats?.carbonSaved || 0;
        totalMoney += data.stats?.moneyEarned || 0;
      });

      return {
        totalPlayers,
        totalScans,
        totalCarbonSaved: Math.round(totalCarbon * 100) / 100,
        totalMoneyEarned: Math.round(totalMoney * 100) / 100,
        avgScansPerPlayer: Math.round(totalScans / totalPlayers * 10) / 10,
        treesEquivalent: Math.round(totalCarbon / 21.77 * 10) / 10 // 1 tree = ~21.77kg CO2/year
      };
    } catch (error) {
      console.error('Error getting campus stats:', error);
      throw error;
    }
  }
}

module.exports = new LeaderboardManager();
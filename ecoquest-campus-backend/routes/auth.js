const express = require('express');
const { getDB, getAuth } = require('../config/firebase-config');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Register/Update user profile
router.post('/register', authenticateUser, async (req, res) => {
  try {
    const { name, dormId, email } = req.body;
    
    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const auth = getAuth();
    await auth.updateUser(req.user.uid, {
      displayName: name
    });
    
    const db = getDB();
    const playerRef = db.collection('players').doc(req.user.uid);
    const playerDoc = await playerRef.get();
    
    if (!playerDoc.exists) {
      // Create new player
      const newPlayer = {
        name: name,
        email: email,
        dormId: dormId || null,
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
          joinDate: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await playerRef.set(newPlayer);
      
      res.json({ 
        success: true, 
        message: 'Account created successfully',
        player: newPlayer
      });
    } else {
      // Update existing player
      await playerRef.update({
        name: name,
        dormId: dormId || null,
        updatedAt: new Date()
      });
      
      const updatedPlayer = await playerRef.get();
      res.json({ 
        success: true, 
        message: 'Profile updated successfully',
        player: updatedPlayer.data()
      });
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const db = getDB();
    const playerDoc = await db.collection('players').doc(req.user.uid).get();
    
    if (!playerDoc.exists) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ player: playerDoc.data() });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Delete account
router.delete('/account', authenticateUser, async (req, res) => {
  try {
    const auth = getAuth();
    const db = getDB();
    
    // Delete from Firestore
    await db.collection('players').doc(req.user.uid).delete();
    
    // Delete from Firebase Auth
    await auth.deleteUser(req.user.uid);
    
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
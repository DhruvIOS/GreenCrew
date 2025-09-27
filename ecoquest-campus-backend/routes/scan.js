const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const { mlModels } = require('../ml/models');
const gameState = require('../game/game-state');
const { getDB } = require('../config/firebase-config');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Main scanning endpoint
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image provided',
        code: 'NO_IMAGE'
      });
    }

    // Optimize image for ML processing
    const optimizedImage = await sharp(req.file.buffer)
      .resize(640, 640, { 
        fit: 'contain', 
        background: { r: 255, g: 255, b: 255 } 
      })
      .jpeg({ quality: parseInt(process.env.IMAGE_QUALITY) || 85 })
      .toBuffer();

    // Run ML object detection
    const detections = await mlModels.detectObjects(optimizedImage);
    
    if (detections.length === 0) {
      return res.json({
        success: false,
        message: 'No objects detected in the image',
        suggestions: [
          'Ensure good lighting conditions',
          'Hold the camera steady',
          'Focus on a single object',
          'Try a different angle',
          'Remove background clutter',
          'Move closer to the object'
        ],
        code: 'NO_OBJECTS_DETECTED'
      });
    }

    // Get the highest confidence detection
    const mainDetection = detections.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    // Get price and environmental analysis
    const priceAnalysis = mlModels.predictPrice(
      mainDetection.class, 
      req.body.condition || 'good',
      req.body.estimatedAge || 12
    );
    
    const environmentalImpact = mlModels.calculateEnvironmentalImpact(
      mainDetection.class, 
      'recycle'
    );

    // Create scan result
    const scanResult = {
      id: generateScanId(),
      object: {
        class: mainDetection.class,
        confidence: mainDetection.confidence,
        name: formatObjectName(mainDetection.class),
        bbox: mainDetection.bbox,
        category: getCategoryFromClass(mainDetection.class)
      },
      price: priceAnalysis,
      environmental: environmentalImpact,
      actions: getSuggestedActions(mainDetection.class, priceAnalysis, environmentalImpact),
      metadata: {
        imageSize: req.file.size,
        detectionTime: Date.now() - startTime,
        totalDetections: detections.length,
        location: req.body.location || null,
        timestamp: new Date().toISOString()
      }
    };

    // Store scan in database for analytics
    await storeScanResult(req.user.uid, scanResult, detections);

    res.json({
      success: true,
      result: scanResult,
      detections: detections.slice(0, 3), // Include top 3 for debugging
      processingTime: Date.now() - startTime
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to analyze image',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      code: 'ANALYSIS_FAILED'
    });
  }
});

// Action completion endpoint
router.post('/action', authenticateUser, async (req, res) => {
  try {
    const { scanId, action, scanResult } = req.body;
    
    // Validate action
    if (!['recycle', 'sell', 'donate', 'share'].includes(action)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid action. Must be one of: recycle, sell, donate, share' 
      });
    }

    // Validate scan result
    if (!scanResult || !scanResult.object) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scan result provided'
      });
    }

    // Update player stats and calculate rewards
    const result = await gameState.updatePlayerStats(req.user.uid, scanResult, action);
    
    // Log the action for analytics
    await logPlayerAction(req.user.uid, scanId, action, scanResult, result);

    // Calculate achievements and bonuses
    const responseData = {
      success: true,
      action: action,
      pointsEarned: result.pointsEarned,
      totalPoints: result.playerState.totalPoints,
      newLevel: result.newLevel,
      currentLevel: result.playerState.level,
      newAchievements: result.newAchievements.map(id => ({
        id,
        ...gameState.achievements[id]
      })),
      playerState: {
        level: result.playerState.level,
        xp: result.playerState.xp,
        totalPoints: result.playerState.totalPoints,
        stats: result.playerState.stats
      },
      environmental: {
        carbonSaved: scanResult.environmental.carbonSaved,
        actionScore: scanResult.environmental.actionScore
      }
    };

    // Add level up celebration data
    if (result.newLevel) {
      responseData.levelUp = {
        newLevel: result.playerState.level,
        bonus: 'Congratulations on leveling up!',
        rewards: ['Increased point multiplier', 'New achievements unlocked']
      };
    }

    res.json(responseData);

  } catch (error) {
    console.error('Action processing error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process action',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get scan history
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const db = getDB();
    const scansSnapshot = await db.collection('scans')
      .where('userId', '==', req.user.uid)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get();
    
    const scans = scansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      scans: scans,
      total: scans.length,
      hasMore: scans.length === limit
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch scan history' });
  }
});

// Helper functions
function generateScanId() {
  return 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatObjectName(className) {
  const nameMap = {
    'cell phone': 'Cell Phone',
    'dining table': 'Dining Table',
    'wine glass': 'Wine Glass',
    'sports ball': 'Sports Ball',
    'tv': 'Television',
    'laptop': 'Laptop Computer',
    'mouse': 'Computer Mouse',
    'keyboard': 'Keyboard',
    'remote': 'Remote Control',
    'book': 'Book',
    'chair': 'Chair',
    'couch': 'Couch/Sofa',
    'bed': 'Bed',
    'microwave': 'Microwave Oven',
    'toaster': 'Toaster',
    'refrigerator': 'Refrigerator',
    'bottle': 'Bottle',
    'cup': 'Cup',
    'backpack': 'Backpack',
    'handbag': 'Handbag',
    'suitcase': 'Suitcase',
    'bicycle': 'Bicycle',
    'skateboard': 'Skateboard'
  };
  
  return nameMap[className] || className.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getCategoryFromClass(className) {
  const categories = {
    'cell phone': 'Electronics',
    'laptop': 'Electronics',
    'tv': 'Electronics',
    'keyboard': 'Electronics',
    'mouse': 'Electronics',
    'remote': 'Electronics',
    'book': 'Books & Media',
    'chair': 'Furniture',
    'couch': 'Furniture',
    'dining table': 'Furniture',
    'bed': 'Furniture',
    'microwave': 'Appliances',
    'toaster': 'Appliances',
    'refrigerator': 'Appliances',
    'bottle': 'Recyclables',
    'cup': 'Recyclables',
    'wine glass': 'Glassware',
    'backpack': 'Accessories',
    'handbag': 'Accessories',
    'suitcase': 'Accessories',
    'bicycle': 'Sports & Recreation',
    'sports ball': 'Sports & Recreation',
    'skateboard': 'Sports & Recreation'
  };
  
  return categories[className] || 'General';
}

function getSuggestedActions(objectClass, priceAnalysis, environmentalImpact) {
  const actions = [];
  const price = priceAnalysis.estimated;
  
  // Primary action based on value and environmental impact
  if (price > 50) {
    actions.push({
      type: 'sell',
      title: 'Sell Online',
      description: `Estimated value: $${price.toFixed(2)}. Try Facebook Marketplace, eBay, or Mercari.`,
      priority: 1,
      expectedPoints: 75,
      platforms: ['Facebook Marketplace', 'eBay', 'Mercari', 'OfferUp'],
      tips: ['Take good photos', 'Write detailed description', 'Price competitively']
    });
  }
  
  if (environmentalImpact.recyclable) {
    actions.push({
      type: 'recycle',
      title: 'Recycle Properly',
      description: `This item is ${Math.round(environmentalImpact.recycleRate * 100)}% recyclable. Save ${environmentalImpact.carbonSaved}kg CO2!`,
      priority: environmentalImpact.toxicMaterials ? 1 : 2,
      expectedPoints: 100,
      impact: {
        carbonSaved: environmentalImpact.carbonSaved,
        waterSaved: environmentalImpact.waterSaved,
        energySaved: environmentalImpact.energySaved
      },
      locations: getRecyclingLocations(objectClass)
    });
  }
  
  if (price > 10 && price < 100) {
    actions.push({
      type: 'donate',
      title: 'Donate to Charity',
      description: 'Give it a second life and help someone in need.',
      priority: 2,
      expectedPoints: 60,
      suggestions: ['Goodwill', 'Salvation Army', 'Local shelters', 'Campus organizations'],
      benefits: ['Tax deduction', 'Helps community', 'Prevents waste']
    });
  }
  
  // Special handling for electronics
  if (['cell phone', 'laptop', 'tv', 'keyboard', 'mouse'].includes(objectClass)) {
    actions.unshift({
      type: 'recycle',
      title: 'E-Waste Recycling',
      description: 'Electronics contain valuable and toxic materials. Use certified e-waste recycling.',
      priority: 1,
      expectedPoints: 150,
      warning: '⚠️ Contains toxic materials - do not throw in regular trash',
      locations: ['Best Buy', 'Staples', 'Campus IT Department', 'Municipal e-waste centers'],
      importance: 'critical'
    });
  }
  
  // Add share option for reusable items
  if (!['bottle', 'cup'].includes(objectClass)) {
    actions.push({
      type: 'share',
      title: 'Share with Campus',
      description: 'Post in campus groups to see if anyone needs this item.',
      priority: 3,
      expectedPoints: 40,
      platforms: ['Campus Facebook Groups', 'Discord', 'GroupMe', 'Reddit'],
      hashtags: ['#CampusShare', '#SustainableU', '#EcoQuest']
    });
  }
  
  return actions.sort((a, b) => a.priority - b.priority);
}

function getRecyclingLocations(objectClass) {
  const locationMap = {
    'electronics': ['Best Buy', 'Staples', 'Campus IT Department'],
    'paper': ['Campus Recycling Center', 'Local Recycling Facility'],
    'plastic': ['Campus Recycling Bins', 'Grocery Store Collection'],
    'metal': ['Scrap Metal Dealers', 'Campus Recycling Center'],
    'glass': ['Glass Recycling Centers', 'Some Grocery Stores']
  };
  
  if (['cell phone', 'laptop', 'tv'].includes(objectClass)) {
    return locationMap['electronics'];
  }
  if (objectClass === 'book') {
    return locationMap['paper'];
  }
  if (['bottle', 'cup'].includes(objectClass)) {
    return locationMap['plastic'];
  }
  
  return ['Campus Recycling Center', 'Local Recycling Facility'];
}

async function storeScanResult(userId, scanResult, allDetections) {
  try {
    const db = getDB();
    await db.collection('scans').add({
      userId: userId,
      scanId: scanResult.id,
      object: scanResult.object,
      price: scanResult.price,
      environmental: scanResult.environmental,
      allDetections: allDetections,
      timestamp: new Date(),
      processed: false
    });
  } catch (error) {
    console.error('Failed to store scan result:', error);
    // Don't throw - this shouldn't break the main flow
  }
}

async function logPlayerAction(userId, scanId, action, scanResult, gameResult) {
  try {
    const db = getDB();
    await db.collection('actions').add({
      userId: userId,
      scanId: scanId,
      action: action,
      object: scanResult.object.class,
      pointsEarned: gameResult.pointsEarned,
      carbonSaved: scanResult.environmental.carbonSaved,
      moneyValue: scanResult.price.estimated,
      newAchievements: gameResult.newAchievements,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to log player action:', error);
    // Don't throw - this shouldn't break the main flow
  }
}

module.exports = router;
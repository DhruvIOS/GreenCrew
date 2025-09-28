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
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper: Check if action already processed for a scanId/user
async function isActionAlreadyProcessed(userId, scanId, action) {
  const db = getDB();
  const actions = await db.collection('actions')
    .where('userId', '==', userId)
    .where('scanId', '==', scanId)
    .where('action', '==', action)
    .get();
  return !actions.empty;
}

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
    const optimizedImage = await sharp(req.file.buffer)
      .resize(640, 640, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: parseInt(process.env.IMAGE_QUALITY) || 85 })
      .toBuffer();

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

    const mainDetection = detections.reduce((prev, current) => (prev.score > current.score) ? prev : current);

    const priceAnalysis = mlModels.predictPrice(
      mainDetection.class,
      req.body.condition || 'good',
      req.body.estimatedAge || 12
    );

    const environmentalImpact = mlModels.calculateEnvironmentalImpact(
      mainDetection.class,
      'recycle'
    );

    const scanId = "scan_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    const scanResult = {
      id: scanId,
      object: {
        class: mainDetection.class,
        confidence: mainDetection.confidence,
        name: mainDetection.class,
        bbox: mainDetection.bbox,
        category: 'General'
      },
      price: priceAnalysis,
      environmental: environmentalImpact
    };

    // Update player stats for a scan action
    const updateResult = await gameState.updatePlayerStats(req.user.uid, scanResult, 'scan');

    res.json({
      success: true,
      result: scanResult,
      playerState: updateResult.playerState,
      detections: detections.slice(0, 3),
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
    if (!['recycle', 'sell', 'donate', 'share'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be one of: recycle, sell, donate, share'
      });
    }
    if (!scanResult || !scanResult.object) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scan result provided'
      });
    }

    // Prevent double-processing
    const alreadyProcessed = await isActionAlreadyProcessed(req.user.uid, scanId, action);
    if (alreadyProcessed) {
      return res.status(409).json({
        success: false,
        error: 'This action has already been processed for this scan.'
      });
    }

    // Update player stats
    const result = await gameState.updatePlayerStats(req.user.uid, scanResult, action);

    // Log the action
    const db = getDB();
    await db.collection('actions').add({
      userId: req.user.uid,
      scanId: scanId,
      action: action,
      timestamp: new Date(),
      pointsEarned: result.pointsEarned
    });

    res.json({
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
      }
    });
  } catch (error) {
    console.error('Action processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process action',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
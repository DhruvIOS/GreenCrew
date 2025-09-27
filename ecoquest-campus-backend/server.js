const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Import modules
const { initializeFirebase } = require('./config/firebase-config');
const { initializeML } = require('./ml/models');

// Import all routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');
const leaderboardRoutes = require('./routes/leaderboard');
const scanRoutes = require('./routes/scan');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Global state
let isReady = false;
let initializationStatus = {
  firebase: false,
  mlModels: false,
  startTime: Date.now()
};

// Initialize services
async function initialize() {
  try {
    console.log('🚀 Starting EcoQuest Campus Backend...');
    
    // Initialize Firebase
    console.log('🔥 Initializing Firebase...');
    await initializeFirebase();
    initializationStatus.firebase = true;
    console.log('✅ Firebase initialized successfully');
    
    // Initialize ML Models
    console.log('🤖 Loading ML models...');
    await initializeML();
    initializationStatus.mlModels = true;
    console.log('✅ ML models loaded successfully');
    
    isReady = true;
    const initTime = ((Date.now() - initializationStatus.startTime) / 1000).toFixed(2);
    console.log(`✅ Backend fully initialized in ${initTime}s!`);
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    console.log('💡 Check your Firebase configuration');
  }
}

// Enhanced health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    ready: isReady,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      authentication: initializationStatus.firebase,
      objectDetection: initializationStatus.mlModels,
      gameSystem: true,
      leaderboards: true,
      analytics: true
    }
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'EcoQuest Campus API',
    version: '1.0.0',
    endpoints: {
      'POST /api/scan': 'Upload image for object detection',
      'POST /api/scan/action': 'Process user action',
      'GET /api/player/profile': 'Get player profile',
      'GET /api/leaderboard': 'Get leaderboard',
      'GET /api/health': 'Health check'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler - FIXED
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`
  });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
initialize().then(() => {
  app.listen(PORT, () => {
    console.log('🎮 ========================================');
    console.log('🚀 EcoQuest Campus Backend is LIVE!');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
    console.log(`📋 Docs: http://localhost:${PORT}/api/docs`);
    console.log('🎮 ========================================');
  });
});

module.exports = app;
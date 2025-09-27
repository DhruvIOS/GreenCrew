const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');

class MLModels {
  constructor() {
    this.objectDetectionModel = null;
    this.isReady = false;
    this.confidenceThreshold = parseFloat(process.env.ML_CONFIDENCE_THRESHOLD) || 0.6;
    this.maxDetections = parseInt(process.env.ML_MAX_DETECTIONS) || 5;
  }

  async initialize() {
    try {
      console.log('🤖 Loading COCO-SSD model...');
      this.objectDetectionModel = await cocoSsd.load();
      console.log('✅ Object detection model loaded successfully');
      
      this.isReady = true;
      return true;
    } catch (error) {
      console.error('❌ Error loading ML models:', error);
      this.isReady = false;
      throw error;
    }
  }

  async detectObjects(imageBuffer) {
    if (!this.isReady) {
      throw new Error('ML models not ready');
    }
    
    try {
      // Convert buffer to tensor
      const tensor = tf.node.decodeImage(imageBuffer, 3);
      
      // Run detection
      const predictions = await this.objectDetectionModel.detect(tensor);
      
      // Clean up tensor memory
      tensor.dispose();
      
      // Filter by confidence and limit results
      const filteredPredictions = predictions
        .filter(pred => pred.score >= this.confidenceThreshold)
        .slice(0, this.maxDetections)
        .map(pred => ({
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox,
          confidence: Math.round(pred.score * 100)
        }));
      
      return filteredPredictions;
    } catch (error) {
      console.error('Object detection error:', error);
      throw new Error('Failed to detect objects in image');
    }
  }

  predictPrice(objectClass, condition = 'good', age = 12) {
    // Comprehensive price database
    const priceData = {
      // Electronics
      'cell phone': { base: 400, depreciation: 0.15, category: 'electronics' },
      'laptop': { base: 800, depreciation: 0.12, category: 'electronics' },
      'keyboard': { base: 60, depreciation: 0.08, category: 'electronics' },
      'mouse': { base: 25, depreciation: 0.10, category: 'electronics' },
      'remote': { base: 15, depreciation: 0.05, category: 'electronics' },
      'tv': { base: 300, depreciation: 0.18, category: 'electronics' },
      
      // Books and Media
      'book': { base: 45, depreciation: 0.20, category: 'books' },
      
      // Furniture
      'chair': { base: 80, depreciation: 0.08, category: 'furniture' },
      'couch': { base: 200, depreciation: 0.10, category: 'furniture' },
      'dining table': { base: 150, depreciation: 0.06, category: 'furniture' },
      'bed': { base: 180, depreciation: 0.07, category: 'furniture' },
      
      // Kitchen Items
      'microwave': { base: 70, depreciation: 0.12, category: 'appliances' },
      'toaster': { base: 35, depreciation: 0.10, category: 'appliances' },
      'refrigerator': { base: 400, depreciation: 0.08, category: 'appliances' },
      'oven': { base: 250, depreciation: 0.09, category: 'appliances' },
      
      // Sports & Recreation
      'sports ball': { base: 20, depreciation: 0.15, category: 'sports' },
      'bicycle': { base: 150, depreciation: 0.10, category: 'sports' },
      'skateboard': { base: 60, depreciation: 0.12, category: 'sports' },
      
      // Containers & Recyclables
      'bottle': { base: 0.05, depreciation: 0.00, category: 'recyclable' },
      'cup': { base: 0.02, depreciation: 0.00, category: 'recyclable' },
      'wine glass': { base: 3, depreciation: 0.05, category: 'glassware' },
      
      // Bags & Accessories
      'backpack': { base: 40, depreciation: 0.12, category: 'accessories' },
      'handbag': { base: 60, depreciation: 0.15, category: 'accessories' },
      'suitcase': { base: 80, depreciation: 0.08, category: 'accessories' },
      
      // Default fallback
      'default': { base: 25, depreciation: 0.10, category: 'general' }
    };

    const data = priceData[objectClass] || priceData['default'];
    
    // Condition multipliers
    const conditionMultipliers = {
      'excellent': 0.85,
      'very good': 0.75,
      'good': 0.65,
      'fair': 0.45,
      'poor': 0.25
    };

    // Calculate depreciation based on age
    const ageDepreciation = Math.max(0.1, 1 - (age * data.depreciation));
    const conditionMultiplier = conditionMultipliers[condition] || 0.65;

    // Calculate final price
    const finalPrice = Math.max(
      data.category === 'recyclable' ? 0.01 : 0.50, // Minimum prices
      Math.round(data.base * conditionMultiplier * ageDepreciation * 100) / 100
    );

    return {
      estimated: finalPrice,
      confidence: this.getPriceConfidence(objectClass, data.category),
      breakdown: {
        basePrice: data.base,
        condition: condition,
        conditionMultiplier: conditionMultiplier,
        ageDepreciation: ageDepreciation,
        category: data.category
      }
    };
  }

  getPriceConfidence(objectClass, category) {
    // Higher confidence for common items
    const highConfidenceItems = ['cell phone', 'laptop', 'book', 'bicycle'];
    const mediumConfidenceItems = ['chair', 'microwave', 'backpack'];
    
    if (highConfidenceItems.includes(objectClass)) return 'high';
    if (mediumConfidenceItems.includes(objectClass)) return 'medium';
    return 'low';
  }

  calculateEnvironmentalImpact(objectClass, action = 'recycle') {
    const environmentalData = {
      // Electronics - High carbon footprint
      'cell phone': {
        carbonFootprint: 85.0,
        recyclable: false,
        recycleRate: 0.20,
        energySaved: 0.85,
        waterSaved: 3240,
        rareEarths: true,
        toxicMaterials: true
      },
      'laptop': {
        carbonFootprint: 450.0,
        recyclable: false,
        recycleRate: 0.15,
        energySaved: 0.90,
        waterSaved: 8500,
        rareEarths: true,
        toxicMaterials: true
      },
      'tv': {
        carbonFootprint: 320.0,
        recyclable: false,
        recycleRate: 0.25,
        energySaved: 0.80,
        waterSaved: 6200,
        rareEarths: true
      },
      
      // Books and Paper
      'book': {
        carbonFootprint: 2.1,
        recyclable: true,
        recycleRate: 0.85,
        energySaved: 0.60,
        waterSaved: 15,
        treesEquivalent: 0.02
      },
      
      // Furniture
      'chair': {
        carbonFootprint: 25.0,
        recyclable: true,
        recycleRate: 0.65,
        energySaved: 0.45,
        waterSaved: 120,
        treesEquivalent: 0.15
      },
      'couch': {
        carbonFootprint: 85.0,
        recyclable: true,
        recycleRate: 0.40,
        energySaved: 0.50,
        waterSaved: 380,
        treesEquivalent: 0.35
      },
      
      // Recyclable Containers
      'bottle': {
        carbonFootprint: 0.08,
        recyclable: true,
        recycleRate: 0.75,
        energySaved: 0.70,
        waterSaved: 3,
        oilSaved: 0.15
      },
      'cup': {
        carbonFootprint: 0.05,
        recyclable: true,
        recycleRate: 0.60,
        energySaved: 0.50,
        waterSaved: 2
      },
      
      // Sports Equipment
      'bicycle': {
        carbonFootprint: 95.0,
        recyclable: true,
        recycleRate: 0.85,
        energySaved: 0.75,
        waterSaved: 450
      },
      
      // Default
      'default': {
        carbonFootprint: 5.0,
        recyclable: true,
        recycleRate: 0.50,
        energySaved: 0.50,
        waterSaved: 25
      }
    };

    const data = environmentalData[objectClass] || environmentalData['default'];
    
    // Action impact multipliers
    const actionMultipliers = {
      'recycle': 1.0,
      'sell': 0.9,
      'donate': 0.8,
      'share': 0.7,
      'trash': -0.2
    };

    const multiplier = actionMultipliers[action] || 0.5;
    const recycleEfficiency = data.recyclable ? data.recycleRate : 0.1;
    
    const impact = {
      carbonFootprint: data.carbonFootprint,
      carbonSaved: Number((data.carbonFootprint * multiplier * recycleEfficiency).toFixed(2)),
      energySaved: Number((data.energySaved * multiplier).toFixed(2)),
      waterSaved: Number((data.waterSaved * multiplier).toFixed(1)),
      recyclable: data.recyclable,
      recycleRate: data.recycleRate,
      actionScore: this.getActionScore(action, data),
      recommendations: this.getEnvironmentalRecommendations(objectClass, data, action)
    };

    // Add optional properties
    if (data.rareEarths) impact.rareEarths = true;
    if (data.toxicMaterials) impact.toxicMaterials = true;
    if (data.treesEquivalent) impact.treesEquivalent = Number((data.treesEquivalent * multiplier).toFixed(3));
    if (data.oilSaved) impact.oilSaved = Number((data.oilSaved * multiplier).toFixed(2));

    return impact;
  }

  getActionScore(action, objectData) {
    const baseScore = {
      'recycle': 85,
      'sell': 75,
      'donate': 70,
      'share': 65,
      'trash': 10
    };

    let score = baseScore[action] || 50;
    
    // Bonus for highly recyclable items
    if (objectData.recyclable && objectData.recycleRate > 0.8) {
      score += 10;
    }
    
    // Penalty for toxic materials going to trash
    if (action === 'trash' && objectData.toxicMaterials) {
      score -= 30;
    }
    
    // Bonus for high carbon footprint items being recycled
    if (action === 'recycle' && objectData.carbonFootprint > 50) {
      score += 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  getEnvironmentalRecommendations(objectClass, data, action) {
    const recommendations = [];
    
    if (data.toxicMaterials && action !== 'recycle') {
      recommendations.push('⚠️ Contains toxic materials - should be recycled at certified e-waste center');
    }
    
    if (data.rareEarths) {
      recommendations.push('💎 Contains rare earth elements - recycling recovers valuable materials');
    }
    
    if (data.carbonFootprint > 100 && action === 'trash') {
      recommendations.push('🌍 High carbon footprint - consider selling or donating instead');
    }
    
    if (data.recyclable && data.recycleRate > 0.7) {
      recommendations.push('♻️ Highly recyclable - great choice for the environment');
    }
    
    return recommendations;
  }
}

const mlModels = new MLModels();

async function initializeML() {
  await mlModels.initialize();
  return mlModels;
}

module.exports = { initializeML, mlModels };
import { create } from 'zustand';
import { apiService } from '../services/api';

const useGameStore = create((set, get) => ({
  // UI state
  showConfetti: false,
  floatingXP: null,
  scanModalOpen: false,
  scanResult: null,
  loading: false,
  error: null,

  // Data state
  user: null,
  leaderboard: [],
  badges: [],
  history: [],
  campusStats: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch user data
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const user = await apiService.getUser();
      set({ user, loading: false });
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch leaderboard
  fetchLeaderboard: async () => {
    try {
      set({ loading: true, error: null });
      const leaderboard = await apiService.getLeaderboard();
      set({ leaderboard, loading: false });
      return leaderboard;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch badges
  fetchBadges: async () => {
    try {
      set({ loading: true, error: null });
      const badges = await apiService.getBadges();
      set({ badges, loading: false });
      return badges;
    } catch (error) {
      console.error('Failed to fetch badges:', error);
      // Fallback to local badges if API fails
      const fallbackBadges = [
        { id: 'first_scan', name: 'Getting Started', description: 'Scan your first object', unlocked: true },
        { id: 'eco_warrior', name: 'Eco Warrior', description: 'Save 10kg of CO2', unlocked: false },
        { id: 'recycling_master', name: 'Recycling Master', description: 'Recycle 25 items', unlocked: false },
        { id: 'scanner_pro', name: 'Scanner Pro', description: 'Scan 100 objects', unlocked: false }
      ];
      set({ badges: fallbackBadges, error: null, loading: false });
      return fallbackBadges;
    }
  },

  // Fetch history
  fetchHistory: async () => {
    try {
      set({ loading: true, error: null });
      const history = await apiService.getHistory();
      set({ history, loading: false });
      return history;
    } catch (error) {
      console.error('Failed to fetch history:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch campus stats
  fetchCampusStats: async () => {
    try {
      const campusStats = await apiService.getCampusStats();
      set({ campusStats });
      return campusStats;
    } catch (error) {
      console.error('Failed to fetch campus stats:', error);
      throw error;
    }
  },

  // Scan item
  scanItem: async (imageData) => {
    try {
      set({ loading: true, error: null });
      const scanResult = await apiService.scan(imageData);
      set({
        scanResult,
        scanModalOpen: true,
        loading: false
      });
      return scanResult;
    } catch (error) {
      console.error('Failed to scan item:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Submit action
  submitAction: async (actionData) => {
    try {
      set({ loading: true, error: null });
      const result = await apiService.submitAction(actionData);

      // Update local user data
      const currentUser = get().user;
      if (currentUser && result.newXP !== undefined) {
        const updatedUser = {
          ...currentUser,
          xp: result.newXP,
          level: Math.floor(result.newXP / 100) + 1
        };
        set({ user: updatedUser });
      }

      // Show visual effects
      if (result.xpEarned > 0) {
        set({
          showConfetti: true,
          floatingXP: `+${result.xpEarned} XP`
        });

        // Clear effects after 3 seconds
        setTimeout(() => {
          set({ showConfetti: false, floatingXP: null });
        }, 3000);
      }

      // Refresh data
      get().fetchHistory();
      get().fetchLeaderboard();

      set({
        scanModalOpen: false,
        scanResult: null,
        loading: false
      });

      return result;
    } catch (error) {
      console.error('Failed to submit action:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // UI actions
  openScanModal: (result) => {
    set({ scanModalOpen: true, scanResult: result });
  },

  closeScanModal: () => {
    set({ scanModalOpen: false, scanResult: null });
  },

  clearError: () => {
    set({ error: null });
  },

  // Trigger scan with simulated camera - integrated with your backend
  triggerScan: async () => {
    try {
      set({ loading: true, error: null });

      // Create a demo image for scanning
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      // Draw a simple demo image
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Demo Scan Image', 320, 240);

      // Convert to blob and then to File
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      const imageFile = new File([blob], 'demo-scan.jpg', { type: 'image/jpeg' });

      // Call your backend scan endpoint
      const scanData = await apiService.scan(imageFile);

      if (scanData.success) {
        // Transform backend response to match frontend expectations
        const scanResult = {
          id: scanData.result.id,
          item: scanData.result.object.name,
          type: scanData.result.object.class,
          confidence: Math.round(scanData.result.object.confidence * 100),
          options: ['recycle', 'sell', 'dispose'], // Standard options
          estimatedValue: scanData.result.price?.estimatedValue || 0,
          environmentalImpact: scanData.result.environmental || {}
        };

        set({
          scanResult: scanResult,
          scanModalOpen: true,
          loading: false
        });

        return scanResult;
      } else {
        throw new Error(scanData.message || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan failed, showing demo result:', error);

      // If backend fails, show mock result for demo
      const mockResults = [
        { item: 'Plastic Water Bottle', type: 'plastic', confidence: 95, options: ['recycle', 'sell', 'dispose'] },
        { item: 'Aluminum Can', type: 'metal', confidence: 92, options: ['recycle', 'sell', 'dispose'] },
        { item: 'Paper Cup', type: 'paper', confidence: 88, options: ['recycle', 'dispose'] },
        { item: 'Cardboard Box', type: 'cardboard', confidence: 94, options: ['recycle', 'sell'] },
        { item: 'Glass Bottle', type: 'glass', confidence: 89, options: ['recycle', 'sell', 'dispose'] }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      randomResult.id = 'demo_' + Date.now();

      set({
        scanResult: randomResult,
        scanModalOpen: true,
        loading: false
      });
    }
  },

  // Process action choice - integrated with your backend
  processAction: async (choice, scanResult) => {
    try {
      set({ loading: true, error: null });

      // Prepare action data for your backend
      const actionData = {
        scanId: scanResult.id,
        action: choice,
        scanResult: {
          object: {
            class: scanResult.type,
            name: scanResult.item,
            confidence: scanResult.confidence / 100
          },
          price: { estimatedValue: scanResult.estimatedValue || 0 },
          environmental: scanResult.environmentalImpact || {}
        }
      };

      // Call your backend action endpoint
      const response = await apiService.submitAction(actionData);

      if (response.success) {
        const pointsEarned = response.pointsEarned || 10;

        // Show floating XP
        set({ floatingXP: `+${pointsEarned} XP` });

        // Show confetti for big gains or level up
        if (pointsEarned >= 15 || response.newLevel) {
          set({ showConfetti: true });
          setTimeout(() => set({ showConfetti: false }), 3000);
        }

        // Clear floating XP after animation
        setTimeout(() => set({ floatingXP: null }), 3000);

        // Update user data with backend response
        if (response.playerState) {
          const currentUser = get().user;
          set({
            user: {
              ...currentUser,
              xp: response.playerState.xp,
              level: response.playerState.level,
              totalPoints: response.playerState.totalPoints
            }
          });
        }

        // Refresh data to get latest state
        setTimeout(() => {
          get().fetchUser();
          get().fetchHistory();
        }, 1000);

        // Close modal
        set({ scanModalOpen: false, scanResult: null, loading: false });

        return {
          success: true,
          pointsEarned,
          newLevel: response.newLevel,
          newAchievements: response.newAchievements
        };
      } else {
        throw new Error(response.error || 'Action failed');
      }
    } catch (error) {
      console.error('Backend action failed, simulating local response:', error);

      // If action endpoint fails, simulate local response for demo
      const xpMap = {
        'plastic': 10,
        'paper': 8,
        'metal': 12,
        'cardboard': 15,
        'glass': 10
      };

      const xpEarned = xpMap[scanResult.type] || 10;
      const currentUser = get().user;

      if (currentUser) {
        const newXP = (currentUser.xp || 0) + xpEarned;
        const updatedUser = {
          ...currentUser,
          xp: newXP,
          level: Math.floor(newXP / 100) + 1
        };

        set({
          user: updatedUser,
          showConfetti: true,
          floatingXP: `+${xpEarned} XP`,
          scanModalOpen: false,
          scanResult: null,
          loading: false
        });

        setTimeout(() => {
          set({ showConfetti: false, floatingXP: null });
        }, 3000);
      }
    }
  },

  // Initialize data
  initializeData: async () => {
    try {
      // Always try to fetch public data (leaderboard, campus stats)
      await Promise.allSettled([
        get().fetchLeaderboard(),
        get().fetchCampusStats()
      ]);

      // Try to fetch user-specific data (only if authenticated)
      try {
        await Promise.allSettled([
          get().fetchUser(),
          get().fetchBadges(),
          get().fetchHistory()
        ]);
      } catch (error) {
        console.log('User not authenticated, skipping user-specific data');
      }
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  },

  // Test backend connection
  testConnection: async () => {
    try {
      const health = await apiService.checkHealth();
      console.log('✅ Backend connection successful:', health);
      return health;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      set({ error: 'Cannot connect to backend server' });
      throw error;
    }
  }
}));

export default useGameStore;
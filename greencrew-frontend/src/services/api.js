import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Firebase auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    // Get auth from Firebase SDK
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();

    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect automatically, let AuthContext handle it
      console.warn('Authentication error, user needs to login');
    }
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Health check
  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  },

  // Player endpoints
  async getUser() {
    const response = await api.get('/player/profile');
    return response.data.player;
  },

  async getUserStats() {
    const response = await api.get('/player/stats');
    return response.data.stats;
  },

  // Leaderboard endpoint
  async getLeaderboard() {
    const response = await api.get('/leaderboard/global');
    return response.data.leaderboard;
  },

  // Badges/Achievements endpoint
  async getBadges() {
    const response = await api.get('/player/achievements');
    return response.data.achievements;
  },

  // Scan endpoints
  async scan(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Action endpoint
  async submitAction(actionData) {
    const response = await api.post('/scan/action', actionData);
    return response.data;
  },

  // Auth endpoints
  async registerUser(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getUserProfile() {
    const response = await api.get('/auth/profile');
    return response.data.player;
  },

  // Campus stats endpoint
  async getCampusStats() {
    try {
      const response = await api.get('/analytics/campus');
      return response.data;
    } catch (error) {
      console.warn('Campus stats endpoint not available, using mock data');
      return {
        totalRecycled: 1247,
        activeUsers: 156,
        co2Saved: 89.5,
        bottlesRecycled: 456
      };
    }
  },

  // History/Recent actions
  async getHistory() {
    try {
      const response = await api.get('/analytics/recent');
      return response.data.actions || [];
    } catch (error) {
      console.warn('History endpoint not available, using mock data');
      return [
        {
          id: 1,
          item: '🥤',
          action: 'Recycled a plastic bottle',
          timestamp: 'Recently',
          xp: 10
        },
        {
          id: 2,
          item: '📄',
          action: 'Recycled paper',
          timestamp: '2 minutes ago',
          xp: 8
        }
      ];
    }
  }
};

export default api;
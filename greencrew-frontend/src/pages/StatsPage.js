import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapConfig';
import useGameStore from '../store/gameStore';
import {
  TrendingUp,
  Leaf,
  Recycle,
  Award,
  Calendar,
  Target,
  Zap,
  Globe
} from 'lucide-react';

const StatsPage = () => {
  const { user, history, fetchHistory, fetchUser } = useGameStore();
  const containerRef = useRef(null);
  const statsCardsRef = useRef([]);

  useEffect(() => {
    // Fetch data on component mount
    fetchUser();
    fetchHistory();
  }, [fetchUser, fetchHistory]);

  useEffect(() => {
    // Animate stats cards on load
    if (statsCardsRef.current.length > 0) {
      gsap.fromTo(
        statsCardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [user, history]);

  // Calculate stats from user data and history
  const stats = {
    totalScans: history?.length || 0,
    totalXP: user?.xp || 0,
    currentLevel: user?.level || 1,
    co2Saved: Math.round((history?.length || 0) * 2.3), // Mock calculation
    itemsRecycled: history?.filter(item => item.action === 'recycle')?.length || 0,
    weeklyGoal: 20,
    weeklyProgress: Math.min(history?.filter(item => {
      const itemDate = new Date(item.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate > weekAgo;
    })?.length || 0, 20),
    streak: 5 // Mock streak calculation
  };

  const achievements = [
    { id: 1, name: 'First Scan', icon: '🎯', completed: stats.totalScans > 0 },
    { id: 2, name: 'Eco Warrior', icon: '🌱', completed: stats.co2Saved > 10 },
    { id: 3, name: 'Recycling Hero', icon: '♻️', completed: stats.itemsRecycled > 5 },
    { id: 4, name: 'Level Master', icon: '⭐', completed: stats.currentLevel > 2 },
    { id: 5, name: 'Weekly Goal', icon: '🏆', completed: stats.weeklyProgress >= stats.weeklyGoal },
    { id: 6, name: 'Streak Master', icon: '🔥', completed: stats.streak >= 7 }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "emerald", index }) => (
    <div
      ref={el => statsCardsRef.current[index] = el}
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const ProgressBar = ({ progress, max, label, color = "emerald" }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{progress}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min((progress / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Impact Stats</h1>
        <p className="text-gray-600">Track your environmental contribution at UMBC</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={Target}
          title="Total Scans"
          value={stats.totalScans}
          subtitle="Items detected"
          index={0}
        />
        <StatCard
          icon={Zap}
          title="Total XP"
          value={stats.totalXP}
          subtitle={`Level ${stats.currentLevel}`}
          color="blue"
          index={1}
        />
        <StatCard
          icon={Globe}
          title="CO₂ Saved"
          value={`${stats.co2Saved}kg`}
          subtitle="Environmental impact"
          color="green"
          index={2}
        />
        <StatCard
          icon={Recycle}
          title="Items Recycled"
          value={stats.itemsRecycled}
          subtitle="Proper disposal"
          color="teal"
          index={3}
        />
      </div>

      {/* Weekly Goal Progress */}
      <div
        ref={el => statsCardsRef.current[4] = el}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Weekly Goal</h2>
          <Calendar className="w-6 h-6 text-emerald-600" />
        </div>
        <ProgressBar
          progress={stats.weeklyProgress}
          max={stats.weeklyGoal}
          label="Scans This Week"
          color="emerald"
        />
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm text-gray-600">On track</span>
          </div>
          <div className="text-sm text-gray-500">
            {stats.weeklyGoal - stats.weeklyProgress} more to reach goal
          </div>
        </div>
      </div>

      {/* Current Streak */}
      <div
        ref={el => statsCardsRef.current[5] = el}
        className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 shadow-lg mb-8"
      >
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold mb-2">Current Streak</h2>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">{stats.streak}</span>
              <span className="text-lg">days</span>
              <div className="text-2xl">🔥</div>
            </div>
          </div>
          <div className="text-white/80">
            <p className="text-sm">Keep it up!</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div
        ref={el => statsCardsRef.current[6] = el}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
          <Award className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`text-center p-4 rounded-xl transition-all duration-200 ${
                achievement.completed
                  ? 'bg-emerald-50 border-2 border-emerald-200'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <p className={`text-xs font-medium ${
                achievement.completed ? 'text-emerald-700' : 'text-gray-500'
              }`}>
                {achievement.name}
              </p>
              {achievement.completed && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {achievements.filter(a => a.completed).length} of {achievements.length} completed
          </p>
        </div>
      </div>

      {/* Campus Impact Summary */}
      <div
        ref={el => statsCardsRef.current[7] = el}
        className="bg-emerald-600 rounded-2xl p-6 shadow-lg mt-8 mb-4"
      >
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Your UMBC Impact</h2>
          <p className="text-emerald-100 mb-4">
            You're making a real difference on campus
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">{stats.totalScans}</p>
              <p className="text-emerald-200 text-sm">Items Processed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.co2Saved}kg</p>
              <p className="text-emerald-200 text-sm">CO₂ Prevented</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/gameStore";
import {
  Camera,
  Trophy,
  TrendingUp,
  Leaf,
  Target,
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles,
  Scan,
  Zap,
  Globe,
  Users
} from "lucide-react";

const FloatingElement = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : -60,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const ParallaxSection = ({ children, offset = 50 }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -offset]);

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
};

const InteractiveCard = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const {
    user,
    leaderboard,
    history,
    campusStats,
    loading,
    initializeData,
    triggerScan
  } = useGameStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleScan = async () => {
    navigate('/scan');
  };

  // Calculate user stats
  const stats = {
    totalScans: history?.length || 0,
    xp: user?.xp || 0,
    level: user?.level || 1,
    co2Saved: Math.round((history?.length || 0) * 2.3),
    rank: leaderboard?.findIndex(u => u.id === user?.id) + 1 || 0
  };

  // Prepare recent activity: sort by timestamp desc if available and take top 3
  const parseTs = (ts) => {
    const d = ts ? new Date(ts) : null;
    return d && !isNaN(d.getTime()) ? d.getTime() : 0;
    };
  const recentActivity = Array.isArray(history)
    ? [...history]
        .sort((a, b) => parseTs(b?.timestamp) - parseTs(a?.timestamp))
        .slice(0, 3)
    : [];

  const quickStats = [
    {
      icon: Target,
      label: "Items Scanned",
      value: stats.totalScans,
      subtitle: "This week",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
      icon: Leaf,
      label: "CO₂ Saved",
      value: `${stats.co2Saved}kg`,
      subtitle: "Environmental impact",
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.1)"
    },
    {
      icon: Trophy,
      label: "Campus Rank",
      value: stats.rank > 0 ? `#${stats.rank}` : "Unranked",
      subtitle: "UMBC Leaderboard",
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section with Parallax */}
      <div className="relative bg-white min-h-screen flex items-center">
        {/* Background Elements */}
        <ParallaxSection offset={30}>
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </ParallaxSection>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center">
            {/* Welcome Message with Mixed Typography */}
            <FloatingElement delay={0.1}>
              <div className="mb-12">
                <motion.h1
                  className="text-6xl lg:text-8xl font-bold mb-6 leading-tight"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {(() => {
                    const first = authUser?.name?.split(' ')[0] || authUser?.displayName?.split(' ')[0] || '';
                    return first ? `Welcome ${first} - Lets Make Campus NEXT LEVEL` : 'Welcome - Lets Make Campus NEXT LEVEL';
                  })()}
                </motion.h1>
                <motion.p
                  className="text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  Ready to make <span className="font-semibold text-emerald-600">UMBC</span> the most
                  <br />sustainable campus in the world?
                </motion.p>
              </div>
            </FloatingElement>

            {/* Interactive Level Display */}
            <FloatingElement delay={0.3}>
              <motion.div
                className="mb-16 inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-1">
                  <div className="bg-white rounded-full px-8 py-4 flex items-center space-x-4">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-white font-bold text-xl" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {stats.level}
                      </span>
                    </motion.div>
                    <div className="text-left">
                      <p className="text-gray-900 font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Level {stats.level} Eco Warrior
                      </p>
                      <p className="text-emerald-600 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {stats.xp} XP • {100 - (stats.xp % 100)} to next level
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FloatingElement>

            {/* Interactive Scan Button */}
            <FloatingElement delay={0.5}>
              <motion.div className="mb-20">
                <motion.button
                  onClick={handleScan}
                  disabled={loading}
                  className="group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="w-40 h-40 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden"
                    animate={{
                      boxShadow: [
                        "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
                        "0 25px 50px -12px rgba(16, 185, 129, 0.4)",
                        "0 25px 50px -12px rgba(16, 185, 129, 0.25)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera className="w-16 h-16 text-white relative z-10" />

                    {/* Scan Line Animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                      animate={{
                        y: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Scan Item
                    </span>
                    <motion.div
                      className="w-full h-0.5 bg-emerald-500 rounded-full mt-2"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    />
                  </motion.div>
                </motion.button>
              </motion.div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Stats Section with Staggered Animation */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <FloatingElement delay={0.1}>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Impact Dashboard
          </motion.h2>
        </FloatingElement>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <FloatingElement key={index} delay={0.2 + index * 0.1}>
                <InteractiveCard className="h-full">
                  <motion.div
                    className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, white 0%, ${stat.bgColor} 100%)`
                    }}
                  >
                    {/* Floating Icon */}
                    <motion.div
                      className="flex items-center justify-between mb-8"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: stat.bgColor }}
                      >
                        <Icon className="w-8 h-8" style={{ color: stat.color }} />
                      </div>
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </motion.div>

                    <div>
                      <motion.h3
                        className="text-4xl lg:text-5xl font-bold mb-3"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: stat.color
                        }}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        {stat.value}
                      </motion.h3>
                      <p
                        className="text-gray-900 font-semibold text-lg mb-2"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-gray-600"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {stat.subtitle}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10"
                      style={{ backgroundColor: stat.color }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </InteractiveCard>
              </FloatingElement>
            );
          })}
        </div>

        {/* Recent Activity with Smooth Transitions */}
        <FloatingElement delay={0.4}>
          <InteractiveCard>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Recent Activity
                </h2>
                <motion.button
                  onClick={() => navigate('/stats')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const displayItem = activity.item || activity.object?.name || activity.name || 'Item';
                    const actionText = activity.action || activity.type || 'Activity';
                    const xpValue = typeof activity.xp === 'number' ? activity.xp : (typeof activity.points === 'number' ? activity.points : null);
                    const ts = activity.timestamp;
                    let when = 'Recently';
                    if (ts) {
                      const dt = new Date(ts);
                      if (!isNaN(dt.getTime())) {
                        const diffMs = Date.now() - dt.getTime();
                        const mins = Math.floor(diffMs / 60000);
                        const hours = Math.floor(mins / 60);
                        const days = Math.floor(hours / 24);
                        when = mins < 1 ? 'Just now'
                          : mins < 60 ? `${mins} min ago`
                          : hours < 24 ? `${hours} hr${hours>1?'s':''} ago`
                          : `${days} day${days>1?'s':''} ago`;
                      } else if (typeof ts === 'string') {
                        when = ts;
                      }
                    }
                    return (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </motion.div>
                      <div className="flex-1">
                        <p
                          className="text-gray-900 font-semibold text-lg"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {displayItem}
                        </p>
                        <p
                          className="text-gray-600"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {actionText}{when ? ` • ${when}` : ''}
                        </p>
                      </div>
                      <motion.div
                        className="text-emerald-600 font-bold text-lg"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        {xpValue !== null ? `+${xpValue} XP` : ''}
                      </motion.div>
                    </motion.div>
                  );})}
                </div>
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Camera className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <p
                    className="text-gray-500 mb-6 text-lg"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    No recent activity
                  </p>
                  <motion.button
                    onClick={handleScan}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Start scanning to see your activity
                  </motion.button>
                </motion.div>
              )}
            </div>
          </InteractiveCard>
        </FloatingElement>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <FloatingElement delay={0.5}>
            <InteractiveCard>
              <motion.div
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white cursor-pointer overflow-hidden relative"
                onClick={() => navigate('/leaderboard')}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80" />
                </div>

                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Campus Leaderboard
                </h3>
                <p
                  className="text-blue-100 mb-4 text-lg"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  See how you rank among UMBC students
                </p>
                <div
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {stats.rank > 0 ? `Currently #${stats.rank}` : 'Join the competition'}
                </div>
              </motion.div>
            </InteractiveCard>
          </FloatingElement>

          <FloatingElement delay={0.6}>
            <InteractiveCard>
              <motion.div
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white cursor-pointer overflow-hidden relative"
                onClick={() => navigate('/rewards')}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80" />
                </div>

                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Rewards Center
                </h3>
                <p
                  className="text-purple-100 mb-4 text-lg"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Redeem XP for campus rewards
                </p>
                <div
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {stats.xp} XP available
                </div>
              </motion.div>
            </InteractiveCard>
          </FloatingElement>
        </div>

        {/* Campus Impact Summary */}
        <FloatingElement delay={0.7}>
          <motion.div
            className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)'
            }}
          >
            <ParallaxSection offset={20}>
              <motion.div
                className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </ParallaxSection>

            <div className="text-center relative z-10">
              <motion.h2
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Your UMBC Impact
              </motion.h2>
              <motion.p
                className="text-emerald-100 mb-12 max-w-3xl mx-auto text-xl"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Every scan contributes to making our campus more sustainable.
                You're part of something bigger.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { label: "Items Processed", value: stats.totalScans, suffix: "" },
                  { label: "CO₂ Prevented", value: stats.co2Saved, suffix: "kg" },
                  { label: "Campus Level", value: stats.level, suffix: "" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  >
                    <motion.div
                      className="text-5xl lg:text-6xl font-bold mb-3"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      animate={{
                        textShadow: [
                          "0px 0px 0px rgba(255,255,255,0)",
                          "0px 0px 20px rgba(255,255,255,0.5)",
                          "0px 0px 0px rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {item.value}{item.suffix}
                    </motion.div>
                    <div
                      className="text-emerald-100 text-lg"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </FloatingElement>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, arcadeAnimations } from "../utils/gsapConfig";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import useGameStore from "../store/gameStore";
import {
  Award,
  Star,
  Trophy,
  Shield,
  Zap,
  Target,
  ArrowLeft,
  Crown,
  Medal,
  Flame,
  Leaf,
  Recycle,
  Users,
  TrendingUp,
  Gamepad2,
  Lock,
  Unlock,
  CheckCircle
} from "lucide-react";

export default function BadgesPage() {
  const { user: authUser } = useAuth();
  const {
    user,
    badges,
    initializeData,
    fetchBadges
  } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);

  // GSAP Refs
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const categoriesRef = useRef(null);
  const badgeGridRef = useRef([]);
  const progressRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    initializeData();
    fetchBadges();
  }, [initializeData, fetchBadges]);

  // Badge categories and their badges
  const badgeCategories = {
    all: 'ALL BADGES',
    recycling: 'RECYCLING',
    environmental: 'ENVIRONMENTAL',
    social: 'SOCIAL',
    achievement: 'ACHIEVEMENT',
    special: 'SPECIAL'
  };

  // Use badges from backend or fallback to default
  const allBadges = badges && badges.length > 0 ? badges.map(badge => ({
    ...badge,
    category: badge.category || 'achievement',
    rarity: badge.rarity || 'common',
    xpReward: badge.points || badge.xpReward || 100,
    requirements: badge.requirement ?
      Object.entries(badge.requirement).map(([key, value]) => `${key}: ${value}`).join(', ') :
      badge.requirements || badge.description,
    unlocked: user?.achievements?.includes(badge.id) || badge.unlocked || false
  })) : [
    {
      id: 'first_scan',
      name: 'Getting Started',
      description: 'Scan your first object',
      category: 'achievement',
      icon: '🔍',
      rarity: 'common',
      xpReward: 100,
      requirements: 'Scan 1 item',
      unlocked: user?.achievements?.includes('first_scan') || false
    },
    {
      id: 'eco_warrior',
      name: 'Eco Warrior',
      description: 'Save 10kg of CO2',
      category: 'environmental',
      icon: '🌱',
      rarity: 'uncommon',
      xpReward: 500,
      requirements: 'Save 10kg CO₂',
      unlocked: user?.achievements?.includes('eco_warrior') || false
    },
    {
      id: 'recycling_master',
      name: 'Recycling Master',
      description: 'Recycle 25 items',
      category: 'recycling',
      icon: '♻️',
      rarity: 'rare',
      xpReward: 750,
      requirements: 'Recycle 25 items',
      unlocked: user?.achievements?.includes('recycling_master') || false
    },
    {
      id: 'scanner_pro',
      name: 'Scanner Pro',
      description: 'Scan 100 objects',
      category: 'achievement',
      icon: '📱',
      rarity: 'epic',
      xpReward: 600,
      requirements: 'Scan 100 objects',
      unlocked: user?.achievements?.includes('scanner_pro') || false
    }
  ];

  const filteredBadges = selectedCategory === 'all'
    ? allBadges
    : allBadges.filter(badge => badge.category === selectedCategory);

  const earnedBadges = allBadges.filter(badge => badge.unlocked);
  const totalBadges = allBadges.length;
  const completionPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

  const currentUser = user || authUser;

  // GSAP Entrance Animations
  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const categories = categoriesRef.current;
    const badgeItems = badgeGridRef.current.filter(Boolean);
    const progress = progressRef.current;

    if (!container) return;

    // Set initial states
    gsap.set([title, categories, progress, ...badgeItems], {
      opacity: 0,
      y: 50
    });

    // Create master timeline
    const tl = gsap.timeline();

    // Entrance sequence
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(categories, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3")
    .to(progress, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2")
    .to(badgeItems, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out"
    }, "-=0.3");

    // Badge glow animations
    badgeItems.forEach((badge, index) => {
      if (badge && allBadges[index]?.unlocked) {
        gsap.to(badge, {
          boxShadow: "0 0 20px currentColor, 0 0 40px currentColor",
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2
        });
      }
    });

    return () => tl.kill();
  }, [filteredBadges]);

  // Badge hover animations
  const handleBadgeHover = (index, isEntering, badge) => {
    const badgeElement = badgeGridRef.current[index];
    if (badgeElement) {
      if (badge.unlocked) {
        gsap.to(badgeElement, {
          scale: isEntering ? 1.1 : 1,
          rotation: isEntering ? 5 : 0,
          duration: 0.3,
          ease: "back.out(1.7)"
        });

        gsap.to(badgeElement, {
          filter: isEntering
            ? "drop-shadow(0 0 30px currentColor) brightness(1.2)"
            : "drop-shadow(0 0 20px currentColor) brightness(1)",
          duration: 0.3
        });
      } else {
        gsap.to(badgeElement, {
          scale: isEntering ? 1.05 : 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };

  // Badge click animation
  const handleBadgeClick = (badge, index) => {
    const badgeElement = badgeGridRef.current[index];
    if (badgeElement) {
      gsap.to(badgeElement, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
    setSelectedBadge(badge);
  };

  // Get rarity color
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-400 border-gray-400/30',
      uncommon: 'text-neon-green border-neon-green/30',
      rare: 'text-neon-blue border-neon-blue/30',
      epic: 'text-neon-purple border-neon-purple/30',
      legendary: 'text-neon-yellow border-neon-yellow/30'
    };
    return colors[rarity] || colors.common;
  };

  // Get rarity glow
  const getRarityGlow = (rarity) => {
    const glows = {
      common: 'rgba(156, 163, 175, 0.3)',
      uncommon: 'rgba(34, 197, 94, 0.3)',
      rare: 'rgba(59, 130, 246, 0.3)',
      epic: 'rgba(147, 51, 234, 0.3)',
      legendary: 'rgba(250, 204, 21, 0.3)'
    };
    return glows[rarity] || glows.common;
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-dark-900 relative overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 arcade-grid opacity-20" />

      {/* Neon Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-neon-yellow/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-neon-green/3 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

      {/* HUD Status Bar */}
      <div className="status-bar fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="w-5 h-5 text-neon-green" />
          <span>BADGE COLLECTION</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>COLLECTED: {earnedBadges.length}/{totalBadges}</span>
          <div className="flex items-center space-x-2">
            <span>STATUS: COLLECTING</span>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div
            ref={titleRef}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Link
                to="/dashboard"
                className="btn-neon-green mr-6 p-3 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>

              <h1 className="text-5xl lg:text-7xl font-arcade font-black">
                <span className="text-neon-purple">BADGE</span>
                <span className="text-neon-yellow">VAULT</span>
              </h1>
            </div>

            <div className="text-xl text-neon-green font-arcade mb-4">
              🏆 ACHIEVEMENT GALLERY 🏆
            </div>
            <div className="text-white/70 font-game max-w-2xl mx-auto">
              Showcase your recycling achievements and unlock powerful rewards!
            </div>
          </div>

          {/* Progress Section */}
          <div
            ref={progressRef}
            className="mb-12"
          >
            <div className="hud-panel p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-4xl font-arcade font-bold text-neon-purple mb-2">
                    {earnedBadges.length}
                  </div>
                  <div className="text-white/60 font-game">BADGES EARNED</div>
                </div>

                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={`${351.86 * (completionPercentage / 100)} 351.86`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="50%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#facc15" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-arcade font-bold text-neon-yellow">
                          {completionPercentage}%
                        </div>
                        <div className="text-xs text-white/60 font-game">COMPLETE</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-arcade font-bold text-neon-green mb-2">
                    {earnedBadges.reduce((sum, badge) => sum + badge.xpReward, 0)}
                  </div>
                  <div className="text-white/60 font-game">BONUS XP EARNED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div
            ref={categoriesRef}
            className="flex justify-center mb-12"
          >
            <div className="hud-panel p-2 flex flex-wrap gap-2 justify-center">
              {Object.entries(badgeCategories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg font-arcade text-sm transition-all duration-300 ${
                    selectedCategory === key
                      ? 'bg-neon-gradient text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            {filteredBadges.map((badge, index) => (
              <div
                key={badge.id}
                ref={el => badgeGridRef.current[index] = el}
                onMouseEnter={() => handleBadgeHover(index, true, badge)}
                onMouseLeave={() => handleBadgeHover(index, false, badge)}
                onClick={() => handleBadgeClick(badge, index)}
                className={`
                  relative p-6 rounded-xl cursor-pointer transition-all duration-300 border-2
                  ${badge.unlocked
                    ? `${getRarityColor(badge.rarity)} badge-earned`
                    : 'border-gray-600/30 badge-locked'
                  }
                  ${badge.unlocked ? 'hud-panel' : 'bg-dark-800/50'}
                `}
                style={{
                  boxShadow: badge.unlocked
                    ? `0 0 20px ${getRarityGlow(badge.rarity)}, inset 0 0 20px rgba(26, 26, 26, 0.8)`
                    : 'none'
                }}
              >
                {/* Lock/Unlock indicator */}
                <div className="absolute top-2 right-2">
                  {badge.unlocked ? (
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {/* Badge Icon */}
                <div className="text-center mb-4">
                  <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale opacity-40'}`}>
                    {badge.icon}
                  </div>
                  <div className={`text-xs font-arcade uppercase tracking-wider ${
                    badge.unlocked ? getRarityColor(badge.rarity).split(' ')[0] : 'text-gray-500'
                  }`}>
                    {badge.rarity}
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <h3 className={`font-arcade font-bold text-sm mb-2 ${
                    badge.unlocked ? 'text-white' : 'text-gray-500'
                  }`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs font-game leading-tight ${
                    badge.unlocked ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    {badge.description}
                  </p>
                </div>

                {/* XP Reward */}
                {badge.unlocked && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-neon-gradient text-white text-xs font-arcade font-bold px-2 py-1 rounded text-center">
                      +{badge.xpReward} XP
                    </div>
                  </div>
                )}

                {/* Rarity glow effect for earned badges */}
                {badge.unlocked && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${getRarityGlow(badge.rarity)} 0%, transparent 70%)`
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Badge Details Modal */}
          {selectedBadge && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div
                ref={modalRef}
                className="hud-panel p-8 max-w-md w-full mx-4 relative"
              >
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
                >
                  ✕
                </button>

                <div className="text-center">
                  <div className={`text-6xl mb-4 ${selectedBadge.unlocked ? '' : 'grayscale opacity-40'}`}>
                    {selectedBadge.icon}
                  </div>

                  <h2 className="text-2xl font-arcade font-bold text-white mb-2">
                    {selectedBadge.name}
                  </h2>

                  <div className={`text-sm font-arcade uppercase tracking-wider mb-4 ${getRarityColor(selectedBadge.rarity).split(' ')[0]}`}>
                    {selectedBadge.rarity} BADGE
                  </div>

                  <p className="text-white/80 font-game mb-6">
                    {selectedBadge.description}
                  </p>

                  <div className="hud-panel-blue p-4 mb-6">
                    <h3 className="text-neon-blue font-arcade font-bold mb-2">REQUIREMENTS</h3>
                    <p className="text-white/80 font-game text-sm">
                      {selectedBadge.requirements}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-neon-green/20">
                      <div className="text-lg font-arcade font-bold text-neon-green">
                        +{selectedBadge.xpReward}
                      </div>
                      <div className="text-white/60 text-xs font-game">XP REWARD</div>
                    </div>
                    <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-neon-yellow/20">
                      <div className="text-lg font-arcade font-bold text-neon-yellow">
                        {selectedBadge.unlocked ? 'EARNED' : 'LOCKED'}
                      </div>
                      <div className="text-white/60 text-xs font-game">STATUS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Panel */}
          <div className="text-center">
            <div className="hud-panel-purple p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-arcade font-bold text-neon-purple mb-4">
                🎯 NEXT CHALLENGE 🎯
              </h3>
              <p className="text-white/80 font-game mb-6">
                Keep recycling to unlock more badges and earn bonus XP!
                <br />
                Each badge brings you closer to becoming a campus legend.
              </p>

              <Link
                to="/dashboard"
                className="btn-neon-purple text-xl px-8 py-4"
              >
                <span className="flex items-center space-x-2">
                  <Award className="w-6 h-6" />
                  <span>CONTINUE QUEST</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
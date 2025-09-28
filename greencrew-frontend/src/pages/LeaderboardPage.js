import React, { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, arcadeAnimations } from "../utils/gsapConfig";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import useGameStore from "../store/gameStore";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  ArrowLeft,
  Zap,
  Target,
  Users,
  TrendingUp,
  Award,
  Flame,
  Shield,
  Gamepad2
} from "lucide-react";

export default function LeaderboardPage() {
  const { user: authUser } = useAuth();
  const {
    leaderboard,
    user,
    campusStats,
    initializeData
  } = useGameStore();

  const [timeframe, setTimeframe] = useState('weekly');
  const [query, setQuery] = useState('');

  // GSAP Refs
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const podiumRef = useRef(null);
  const leaderboardListRef = useRef([]);
  const statsRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // GSAP Entrance Animations
  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const podium = podiumRef.current;
    const leaderboardItems = leaderboardListRef.current.filter(Boolean);
    const stats = statsRef.current;
    const filter = filterRef.current;

    if (!container) return;

    // Set initial states
    gsap.set([title, podium, filter, stats, ...leaderboardItems], {
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
    .to(filter, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3")
    .to(podium, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "bounce.out"
    }, "-=0.2")
    .to(leaderboardItems, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.4")
    .to(stats, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");

    // Podium crown animations
    const crowns = podium?.querySelectorAll('.crown-icon');
    if (crowns) {
      crowns.forEach((crown, index) => {
        gsap.to(crown, {
          rotation: index === 0 ? 10 : index === 1 ? -5 : 5,
          scale: 1.1,
          duration: 2 + index * 0.5,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    }

    return () => tl.kill();
  }, [leaderboard]);

  // Row hover animations
  const handleRowHover = (index, isEntering) => {
    const row = leaderboardListRef.current[index];
    if (row) {
      gsap.to(row, {
        scale: isEntering ? 1.02 : 1,
        x: isEntering ? 10 : 0,
        duration: 0.3,
        ease: "power2.out"
      });

      // Add glow effect
      gsap.to(row, {
        boxShadow: isEntering
          ? "0 0 30px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.1)"
          : "0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(26, 26, 26, 0.8)",
        duration: 0.3
      });
    }
  };

  const currentUser = user || authUser;
  const userRank = leaderboard.findIndex(player =>
    player.id === currentUser?.uid || player.email === currentUser?.email
  ) + 1 || 'N/A';

  const timeframeData = {
    daily: { label: 'TODAY', period: '24H' },
    weekly: { label: 'THIS WEEK', period: '7D' },
    monthly: { label: 'THIS MONTH', period: '30D' },
    allTime: { label: 'ALL TIME', period: '∞' }
  };

  const filteredLeaderboard = leaderboard.filter((player) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (player.name || '').toLowerCase().includes(q) ||
      (player.email || '').toLowerCase().includes(q)
    );
  });
  const topThree = filteredLeaderboard.slice(0, 3);
  const restOfLeaderboard = filteredLeaderboard.slice(3);

  // Auto-scroll current user into view in the list
  useEffect(() => {
    const idx = filteredLeaderboard.findIndex(p => p.id === (user?.uid || authUser?.uid) || p.email === (user?.email || authUser?.email));
    if (idx > 2) {
      const listIndex = idx - 3;
      const el = leaderboardListRef.current[listIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [filteredLeaderboard, user, authUser]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-dark-900 relative overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 arcade-grid opacity-20" />

      {/* Neon Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-yellow/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-neon-purple/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-neon-blue/3 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

      {/* HUD Status Bar */}
      <div className="status-bar fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="w-5 h-5 text-neon-green" />
          <span>LEADERBOARD SYSTEM</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>YOUR RANK: #{userRank}</span>
          <div className="flex items-center space-x-2">
            <span>STATUS: COMPETING</span>
            <div className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">

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
                <span className="text-neon-yellow">LEADER</span>
                <span className="text-neon-blue">BOARD</span>
              </h1>
            </div>

            <div className="text-xl text-neon-purple font-arcade mb-4">
              ⚡ HALL OF CHAMPIONS ⚡
            </div>
            <div className="text-white/70 font-game max-w-2xl mx-auto">
              The ultimate arena where eco-warriors compete for recycling supremacy!
            </div>
          </div>

          {/* Time Filter */}
          <div
            ref={filterRef}
            className="flex flex-col items-center gap-4 md:flex-row md:justify-center mb-12"
          >
            <div className="hud-panel p-2 flex space-x-2">
              {Object.entries(timeframeData).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setTimeframe(key)}
                  className={`px-4 py-2 rounded-lg font-arcade text-sm transition-all duration-300 ${
                    timeframe === key
                      ? 'bg-neon-gradient text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {data.label}
                </button>
              ))}
            </div>
            <div className="hud-panel p-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search players by name or email"
                className="bg-dark-800 text-white/90 placeholder-white/40 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green font-game w-64"
                aria-label="Search players"
              />
            </div>
          </div>

          {/* Podium - Top 3 */}
          <div
            ref={podiumRef}
            className="mb-16"
          >
            <div className="flex justify-center items-end space-x-8">
              {/* Second Place */}
              {topThree[1] && (
                <div className="text-center">
                  <div className="hud-panel-blue p-6 mb-4 relative">
                    <div className="crown-icon absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Medal className="w-8 h-8 text-neon-blue" />
                    </div>
                    <img
                      src={topThree[1].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[1].name)}&background=3b82f6&color=fff&size=80`}
                      alt={topThree[1].name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-neon-blue"
                    />
                    <h3 className="text-lg font-arcade font-bold text-neon-blue mb-1">
                      {topThree[1].name}
                    </h3>
                    <div className="text-2xl font-arcade font-bold text-white mb-1">
                      {topThree[1].xp} XP
                    </div>
                    <div className="text-sm text-white/60 font-game">
                      Level {topThree[1].level || Math.floor(topThree[1].xp / 100) + 1}
                    </div>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-t from-neon-blue/30 to-neon-blue/10 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl font-arcade font-bold text-neon-blue">2</span>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="text-center">
                  <div className="hud-panel p-8 mb-4 relative border-neon-yellow/50 bg-gradient-to-b from-neon-yellow/10 to-transparent">
                    <div className="crown-icon absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <Crown className="w-12 h-12 text-neon-yellow animate-bounce-glow" />
                    </div>
                    <img
                      src={topThree[0].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[0].name)}&background=facc15&color=000&size=96`}
                      alt={topThree[0].name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-neon-yellow"
                    />
                    <h3 className="text-xl font-arcade font-bold text-neon-yellow mb-2">
                      {topThree[0].name}
                    </h3>
                    <div className="text-3xl font-arcade font-bold text-white mb-2">
                      {topThree[0].xp} XP
                    </div>
                    <div className="text-sm text-white/60 font-game">
                      Level {topThree[0].level || Math.floor(topThree[0].xp / 100) + 1} • Champion
                    </div>
                  </div>
                  <div className="w-32 h-32 bg-gradient-to-t from-neon-yellow/30 to-neon-yellow/10 rounded-t-lg flex items-center justify-center">
                    <span className="text-5xl font-arcade font-bold text-neon-yellow">1</span>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="text-center">
                  <div className="hud-panel-purple p-6 mb-4 relative">
                    <div className="crown-icon absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Award className="w-8 h-8 text-neon-purple" />
                    </div>
                    <img
                      src={topThree[2].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[2].name)}&background=9333ea&color=fff&size=80`}
                      alt={topThree[2].name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-neon-purple"
                    />
                    <h3 className="text-lg font-arcade font-bold text-neon-purple mb-1">
                      {topThree[2].name}
                    </h3>
                    <div className="text-2xl font-arcade font-bold text-white mb-1">
                      {topThree[2].xp} XP
                    </div>
                    <div className="text-sm text-white/60 font-game">
                      Level {topThree[2].level || Math.floor(topThree[2].xp / 100) + 1}
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-t from-neon-purple/30 to-neon-purple/10 rounded-t-lg flex items-center justify-center">
                    <span className="text-3xl font-arcade font-bold text-neon-purple">3</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats in place of Full Rankings */}
          <div className="mb-8">
            <div className="hud-panel p-6">
              <h3 className="text-2xl font-arcade font-bold text-neon-green mb-6 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6" />
                <span>ARENA & MY STATS</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Arena Stats */}
                <div
                  ref={statsRef}
                  className="hud-panel-purple p-6"
                >
                  <h3 className="text-xl font-arcade font-bold text-neon-purple mb-6 flex items-center space-x-2">
                    <Target className="w-6 h-6" />
                    <span>ARENA STATS</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-dark-800/50 rounded-lg border border-neon-green/20">
                      <div className="text-3xl font-arcade font-bold text-neon-green">
                        {leaderboard.length}
                      </div>
                      <div className="text-white/60 text-sm font-game">TOTAL PLAYERS</div>
                    </div>

                    <div className="text-center p-4 bg-dark-800/50 rounded-lg border border-neon-blue/20">
                      <div className="text-3xl font-arcade font-bold text-neon-blue">
                        {campusStats?.totalRecycled || '1,247'}
                      </div>
                      <div className="text-white/60 text-sm font-game">ITEMS RECYCLED</div>
                    </div>

                    <div className="text-center p-4 bg-dark-800/50 rounded-lg border border-neon-yellow/20">
                      <div className="text-3xl font-arcade font-bold text-neon-yellow">
                        {Math.round((leaderboard.reduce((sum, p) => sum + (p.xp || 0), 0) / leaderboard.length) || 0)}
                      </div>
                      <div className="text-white/60 text-sm font-game">AVG XP</div>
                    </div>

                    <div className="text-center p-4 bg-dark-800/50 rounded-lg border border-neon-purple/20">
                      <div className="text-3xl font-arcade font-bold text-neon-purple">
                        {campusStats?.co2Saved || '89.5'}kg
                      </div>
                      <div className="text-white/60 text-sm font-game">CO₂ SAVED</div>
                    </div>
                  </div>
                </div>

                {/* My Stats */}
                {currentUser && (
                  <div className="hud-panel p-6">
                    <h3 className="text-xl font-arcade font-bold text-neon-green mb-4 flex items-center space-x-2">
                      <Zap className="w-6 h-6" />
                      <span>MY STATS</span>
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 font-game">Current Rank</span>
                        <span className="text-neon-yellow font-arcade font-bold">#{userRank}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 font-game">Total XP</span>
                        <span className="text-neon-green font-arcade font-bold">{currentUser.xp || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 font-game">Current Level</span>
                        <span className="text-neon-blue font-arcade font-bold">{currentUser.level || Math.floor((currentUser.xp || 0) / 100) + 1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 font-game">Items Recycled</span>
                        <span className="text-neon-purple font-arcade font-bold">{currentUser.totalRecycled || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Panel removed */}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [earthRotation, setEarthRotation] = useState(0);
  const [impactAnimation, setImpactAnimation] = useState(0);
  const [dataStream, setDataStream] = useState([]);
  const animationRef = useRef();

  // Enhanced Data with Real-time Updates
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2847,
    nextLevelXp: 3000,
    streak: 7,
    totalImpact: {
      co2Saved: 47.3, // kg
      plasticDiverted: 2.1, // kg
      itemsRecycled: 124,
      treesEquivalent: 12.8,
      energySaved: 234.5, // kWh
      waterSaved: 1567 // liters
    },
    realTimeData: {
      co2Rate: 0.5, // kg/min
      globalImpact: 15847, // total users
      campusRank: 2
    }
  });

  // Generate Particles for CO2 Reduction Animation
  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.7 + 0.3,
        color: `hsl(${120 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`,
        life: 1
      });
    }
    return newParticles;
  };

  // Animation Loop
  const animate = () => {
    setEarthRotation(prev => prev + 0.5);
    setImpactAnimation(prev => (prev + 1) % 360);

    // Update particles
    setParticles(prev =>
      prev.map(particle => ({
        ...particle,
        x: particle.x + particle.speedX,
        y: particle.y + particle.speedY,
        life: particle.life - 0.01,
        opacity: particle.opacity * particle.life
      })).filter(p => p.life > 0)
    );

    // Generate data stream
    if (Math.random() < 0.1) {
      setDataStream(prev => [...prev.slice(-20), {
        id: Date.now(),
        value: Math.random() * userStats.totalImpact.co2Saved,
        timestamp: Date.now(),
        type: ['co2', 'plastic', 'energy'][Math.floor(Math.random() * 3)]
      }]);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setParticles(generateParticles());
    animate();

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setUserStats(prev => ({
        ...prev,
        totalImpact: {
          ...prev.totalImpact,
          co2Saved: prev.totalImpact.co2Saved + Math.random() * 0.1
        }
      }));
    }, 2000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(interval);
    };
  }, []);

  const dailyGoals = [
    { id: 1, title: "Recycle 3 items", progress: 2, target: 3, category: "recycling", points: 50 },
    { id: 2, title: "Walk to recycling center", progress: 0, target: 1, category: "mobility", points: 75 },
    { id: 3, title: "Share green tip", progress: 1, target: 1, category: "social", points: 25 }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Chen", points: 3247, avatar: "/api/placeholder/32/32" },
    { rank: 2, name: "You", points: 2847, avatar: user?.photoURL },
    { rank: 3, name: "Sarah Kim", points: 2654, avatar: "/api/placeholder/32/32" }
  ];

  const achievements = [
    { id: 1, title: "First Step", description: "Complete first recycling", unlocked: true, rarity: "common" },
    { id: 2, title: "Streak Master", description: "7-day recycling streak", unlocked: true, rarity: "rare" },
    { id: 3, title: "Campus Hero", description: "Top 10 this month", unlocked: false, rarity: "epic" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)'
    }}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              transform: `scale(${particle.life})`,
              transition: 'all 0.1s ease'
            }}
          />
        ))}
      </div>

      {/* Floating Data Streams */}
      <div className="absolute inset-0 pointer-events-none">
        {dataStream.map((data, index) => (
          <div
            key={data.id}
            className="absolute text-xs font-mono text-cyan-400 opacity-70"
            style={{
              left: `${20 + index * 60}px`,
              top: `${100 + Math.sin(Date.now() / 1000 + index) * 50}px`,
              transform: `translateY(${Math.sin(data.timestamp / 1000) * 20}px)`,
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            +{data.value.toFixed(1)} {data.type}
          </div>
        ))}
      </div>

      {/* Status Bar - Futuristic */}
      <div className="flex justify-between items-center px-4 py-2 bg-black/30 backdrop-blur-md text-cyan-400 text-sm border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-mono">LIVE</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-mono">NEURAL LINK ACTIVE</span>
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-1 h-3 bg-cyan-400 rounded-full opacity-${100 - i * 20}`}
                style={{animation: `pulse ${1 + i * 0.2}s infinite`}} />
            ))}
          </div>
        </div>
      </div>

      {/* Holographic Header */}
      <div className="relative bg-black/40 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
        <div className="relative px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 3D Rotating Avatar */}
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/50"
                  style={{
                    transform: `rotateY(${earthRotation}deg)`,
                    background: `conic-gradient(from ${earthRotation}deg, #00f5ff, #8a2be2, #00f5ff)`,
                    animation: 'glow 2s ease-in-out infinite alternate'
                  }}
                >
                  <img
                    src={user?.photoURL || "/api/placeholder/64/64"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center border-2 border-black">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Holographic Text */}
              <div>
                <h1 className="text-xl font-bold text-white mb-1" style={{
                  textShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff',
                  fontFamily: 'monospace'
                }}>
                  AGENT {user?.displayName?.split(' ')[0]?.toUpperCase() || 'ALEX'}
                </h1>

                {/* Animated XP Bar */}
                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400 font-mono text-sm">LVL {userStats.level}</span>
                  <div className="relative w-32 h-3 bg-black/50 rounded-full border border-cyan-400/50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(userStats.xp / userStats.nextLevelXp) * 100}%`,
                        boxShadow: '0 0 10px currentColor'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                  <span className="text-purple-400 font-mono text-xs">{userStats.xp}/{userStats.nextLevelXp}</span>
                </div>

                {/* Real-time Status */}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-mono">REAL-TIME</span>
                  </div>
                  <div className="text-cyan-400 text-xs font-mono">
                    RANK #{userStats.realTimeData.campusRank} GLOBAL
                  </div>
                </div>
              </div>
            </div>

            {/* Futuristic Logout */}
            <button
              onClick={logout}
              className="p-3 text-red-400 hover:text-red-300 transition-all duration-300 bg-red-500/10 rounded-full border border-red-500/30 hover:bg-red-500/20"
              style={{
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Holographic Navigation */}
      <div className="relative bg-black/50 backdrop-blur-xl border-b border-cyan-500/30">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
        </div>
        <div className="relative flex">
          {[
            { id: 'home', label: 'NEURAL', icon: '🧠', color: 'cyan' },
            { id: 'scan', label: 'SCAN', icon: '📡', color: 'green' },
            { id: 'leaderboard', label: 'RANKS', icon: '🏆', color: 'yellow' },
            { id: 'profile', label: 'AGENT', icon: '👤', color: 'purple' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-4 px-2 text-xs font-mono font-bold transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: isActive ? `linear-gradient(135deg, ${tab.color === 'cyan' ? '#00f5ff' : tab.color === 'green' ? '#00ff41' : tab.color === 'yellow' ? '#ffff00' : '#8a2be2'}20, transparent)` : 'transparent',
                  borderBottom: isActive ? `2px solid ${tab.color === 'cyan' ? '#00f5ff' : tab.color === 'green' ? '#00ff41' : tab.color === 'yellow' ? '#ffff00' : '#8a2be2'}` : 'none',
                  textShadow: isActive ? `0 0 10px ${tab.color === 'cyan' ? '#00f5ff' : tab.color === 'green' ? '#00ff41' : tab.color === 'yellow' ? '#ffff00' : '#8a2be2'}` : 'none'
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse"></div>
                )}
                <div className={`text-xl mb-1 relative z-10 ${
                  isActive ? 'animate-bounce' : ''
                }`}>
                  {tab.icon}
                </div>
                <span className="relative z-10">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full animate-ping"
                    style={{
                      backgroundColor: tab.color === 'cyan' ? '#00f5ff' : tab.color === 'green' ? '#00ff41' : tab.color === 'yellow' ? '#ffff00' : '#8a2be2'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Revolutionary Content */}
      <div className="flex-1 overflow-y-auto pb-6 relative">
        {activeTab === 'home' && (
          <div className="px-4 pt-6 space-y-8">
            {/* 3D Interactive Earth Impact Visualization */}
            <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-green-500/10 animate-pulse"></div>
                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 font-mono" style={{
                  textShadow: '0 0 20px #00f5ff'
                }}>🌍 PLANETARY IMPACT MATRIX</h2>

                <div className="grid grid-cols-3 gap-8">
                  {/* 3D CO2 Sphere */}
                  <div className="text-center relative">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div
                        className="absolute inset-0 rounded-full border-2 border-green-400"
                        style={{
                          background: `conic-gradient(from ${earthRotation}deg, #00ff41, #00ff85, #00ffaa, #00ff41)`,
                          transform: `rotateY(${earthRotation}deg) rotateX(${Math.sin(impactAnimation * Math.PI / 180) * 10}deg)`,
                          boxShadow: '0 0 30px #00ff41, inset 0 0 30px #00ff41'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl animate-pulse">🌱</span>
                      </div>
                      {/* Floating particles around sphere */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-green-400 rounded-full"
                          style={{
                            top: `${50 + Math.sin((impactAnimation + i * 45) * Math.PI / 180) * 40}%`,
                            left: `${50 + Math.cos((impactAnimation + i * 45) * Math.PI / 180) * 40}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 10px #00ff41',
                            animation: `float ${2 + i * 0.3}s ease-in-out infinite`
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-4xl font-bold text-green-400 font-mono" style={{
                      textShadow: '0 0 20px #00ff41'
                    }}>{userStats.totalImpact.co2Saved.toFixed(1)}</div>
                    <div className="text-green-300 text-sm font-mono">KG CO₂ NEUTRALIZED</div>
                    <div className="text-xs text-cyan-400 mt-1 font-mono">+{userStats.realTimeData.co2Rate}/min</div>
                  </div>

                  {/* Holographic Plastic Counter */}
                  <div className="text-center relative">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                        style={{
                          background: `conic-gradient(from ${-earthRotation}deg, #0099ff, #0066cc, #003399, #0099ff)`,
                          transform: `rotateX(${earthRotation}deg) rotateZ(${Math.sin(impactAnimation * Math.PI / 180) * 15}deg)`,
                          boxShadow: '0 0 30px #0099ff, inset 0 0 30px #0099ff'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl animate-spin">♻️</span>
                      </div>
                      {/* Orbital rings */}
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute inset-0 border border-blue-400/30 rounded-full"
                          style={{
                            transform: `scale(${1.3 + i * 0.3}) rotateX(${45 + i * 15}deg)`,
                            animation: `spin ${3 + i}s linear infinite`
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-4xl font-bold text-blue-400 font-mono" style={{
                      textShadow: '0 0 20px #0099ff'
                    }}>{userStats.totalImpact.plasticDiverted}</div>
                    <div className="text-blue-300 text-sm font-mono">KG PLASTIC DIVERTED</div>
                    <div className="text-xs text-cyan-400 mt-1 font-mono">FROM OCEANS</div>
                  </div>

                  {/* Energy Crystal */}
                  <div className="text-center relative">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div
                        className="absolute inset-0 rounded-full border-2 border-purple-400"
                        style={{
                          background: `conic-gradient(from ${earthRotation * 2}deg, #8a2be2, #9932cc, #ba55d3, #8a2be2)`,
                          transform: `rotateZ(${earthRotation}deg) scale(${1 + Math.sin(impactAnimation * Math.PI / 180) * 0.1})`,
                          boxShadow: '0 0 30px #8a2be2, inset 0 0 30px #8a2be2'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl animate-bounce">⚡</span>
                      </div>
                      {/* Energy sparks */}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-4 bg-purple-400 rounded-full"
                          style={{
                            top: `${50 + Math.sin((impactAnimation * 2 + i * 60) * Math.PI / 180) * 35}%`,
                            left: `${50 + Math.cos((impactAnimation * 2 + i * 60) * Math.PI / 180) * 35}%`,
                            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
                            opacity: Math.sin((impactAnimation + i * 30) * Math.PI / 180) * 0.5 + 0.5,
                            boxShadow: '0 0 10px #8a2be2'
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-4xl font-bold text-purple-400 font-mono" style={{
                      textShadow: '0 0 20px #8a2be2'
                    }}>{userStats.totalImpact.energySaved}</div>
                    <div className="text-purple-300 text-sm font-mono">KWH ENERGY SAVED</div>
                    <div className="text-xs text-cyan-400 mt-1 font-mono">≈ {userStats.totalImpact.treesEquivalent} TREES</div>
                  </div>
                </div>

                {/* Holographic Stats Bar */}
                <div className="mt-8 p-4 bg-black/30 rounded-2xl border border-cyan-500/20">
                  <div className="flex justify-between items-center text-sm font-mono">
                    <div className="text-cyan-400">GLOBAL NETWORK: {userStats.realTimeData.globalImpact.toLocaleString()} AGENTS</div>
                    <div className="text-green-400">CAMPUS RANK: #{userStats.realTimeData.campusRank}</div>
                    <div className="text-purple-400">WATER SAVED: {userStats.totalImpact.waterSaved}L</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cyberpunk Scan Portal */}
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-green-400/50 overflow-hidden group hover:border-green-400 transition-all duration-300">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-cyan-500/10 to-green-500/20 group-hover:opacity-80 transition-opacity duration-300"></div>
                {/* Scanning lines animation */}
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-0.5 bg-green-400/30"
                      style={{
                        top: `${i * 25}%`,
                        animation: `scanLine ${2 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3 font-mono" style={{
                    textShadow: '0 0 20px #00ff41'
                  }}>🎯 NEURAL SCAN PORTAL</h3>
                  <p className="text-green-300 text-lg mb-4 font-mono">AI-POWERED IMPACT DETECTION</p>
                  <div className="flex items-center space-x-4 text-sm font-mono">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      <span className="text-green-400">QUANTUM READY</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-400">AR ENABLED</span>
                    </div>
                  </div>
                </div>

                {/* 3D Scan Button */}
                <Link
                  to="/scan"
                  className="relative group bg-gradient-to-r from-green-400 to-cyan-400 text-black px-8 py-4 rounded-2xl font-bold text-lg transform hover:scale-110 transition-all duration-300 overflow-hidden"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 255, 65, 0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center space-x-3">
                    <div className="text-2xl animate-spin">🔍</div>
                    <span className="font-mono">INITIATE SCAN</span>
                    <div className="text-xl animate-bounce">⚡</div>
                  </div>
                </Link>
              </div>

              {/* Floating scan indicators */}
              <div className="absolute top-4 right-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{
                      animation: `float ${1.5 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                      right: `${i * 15}px`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Daily Goals */}
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-heading-md text-gray-900">Today's Goals</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                      <span className="text-body-sm font-medium text-gray-700">{userStats.streak} day streak</span>
                    </div>
                    <div className="badge badge-success">{dailyGoals.filter(g => g.progress >= g.target).length}/{dailyGoals.length} done</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {dailyGoals.map((goal) => {
                    const progressPercent = (goal.progress / goal.target) * 100;
                    const isComplete = goal.progress >= goal.target;
                    return (
                      <div key={goal.id} className={`relative p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isComplete ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isComplete ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <span className={`text-body-md font-medium ${
                              isComplete ? 'text-green-700' : 'text-gray-900'
                            }`}>{goal.title}</span>
                          </div>
                          <div className="text-right">
                            <div className="badge badge-gray">+{goal.points} pts</div>
                          </div>
                        </div>
                        <div className="progress-bar mb-2">
                          <div
                            className={`progress-fill transition-all duration-500 ${
                              isComplete ? 'progress-fill-success' : ''
                            }`}
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-caption">
                          <span>{goal.progress}/{goal.target}</span>
                          <span>{Math.round(progressPercent)}% complete</span>
                        </div>
                        {isComplete && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Campus Leaderboard Preview */}
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-heading-md text-gray-900">Campus Rankings</h3>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="btn btn-sm btn-secondary text-primary border-primary hover:bg-primary/5"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {leaderboard.slice(0, 3).map((user, index) => (
                    <div key={user.rank} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                      user.name === 'You' ? 'bg-primary/5 border-2 border-primary/20' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                        user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                        'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
                      }`}>
                        {user.rank === 1 ? '👑' : user.rank}
                      </div>
                      <img
                        src={user.avatar || "/api/placeholder/40/40"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <div className={`text-body-md font-semibold ${
                          user.name === 'You' ? 'text-primary' : 'text-gray-900'
                        }`}>{user.name}</div>
                        <div className="text-caption">Rank #{user.rank} on campus</div>
                      </div>
                      <div className="text-right">
                        <div className="text-body-md font-bold text-gray-900">{user.points.toLocaleString()}</div>
                        <div className="text-caption">points</div>
                      </div>
                      {user.name === 'You' && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="px-4 pt-6 space-y-8">
            {/* AR Scan Interface */}
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-green-400 overflow-hidden">
              <div className="absolute inset-0 neural-grid opacity-30"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-bold text-white mb-4 font-mono glitch-text" style={{
                  textShadow: '0 0 30px #00ff41'
                }}>🤖 NEURAL SCANNER MATRIX</h2>
                <p className="text-green-300 text-lg mb-8 font-mono">AI-POWERED QUANTUM DETECTION SYSTEM</p>

                {/* 3D Scanning Interface */}
                <div className="relative w-64 h-64 mx-auto mb-8 transform-3d">
                  <div className="absolute inset-0 border-4 border-green-400 rounded-full quantum-state">
                    {/* Scanning rings */}
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
                        style={{
                          transform: `scale(${1 + i * 0.2}) rotateX(${45 + i * 15}deg)`,
                          animation: `orbitalRing ${3 + i}s linear infinite`
                        }}
                      />
                    ))}

                    {/* Center scan target */}
                    <div className="absolute inset-1/4 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center energy-orb">
                      <div className="text-6xl animate-spin" style={{
                        animation: 'spin 2s linear infinite'
                      }}>🔍</div>
                    </div>

                    {/* Floating scan indicators */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-green-400 rounded-full"
                        style={{
                          top: `${50 + Math.sin((impactAnimation + i * 45) * Math.PI / 180) * 45}%`,
                          left: `${50 + Math.cos((impactAnimation + i * 45) * Math.PI / 180) * 45}%`,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: '0 0 20px #00ff41',
                          animation: `float ${2 + i * 0.3}s ease-in-out infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <Link
                  to="/scan"
                  className="cyberpunk-button px-12 py-4 rounded-2xl font-bold text-xl text-black transform hover:scale-110 transition-all duration-300 inline-block font-mono"
                >
                  📱 ACTIVATE SCANNER ⚡
                </Link>
              </div>
            </div>

            {/* Real-time Scan Feed */}
            <div className="holographic-card rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 font-mono" style={{
                textShadow: '0 0 20px #00f5ff'
              }}>📡 LIVE SCAN MATRIX</h3>
              <div className="space-y-4">
                {[
                  { item: "PLASTIC_BOTTLE_001", points: 25, time: "00:02:34", type: "plastic", confidence: 98.7 },
                  { item: "ALUMINUM_CAN_045", points: 30, time: "00:47:12", type: "metal", confidence: 99.2 },
                  { item: "PAPER_CUP_ORGANIC", points: 15, time: "01:23:45", type: "paper", confidence: 94.5 }
                ].map((scan, index) => (
                  <div key={index} className="relative bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 group hover:border-cyan-400 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center energy-orb ${
                          scan.type === 'plastic' ? 'border-2 border-blue-400' :
                          scan.type === 'metal' ? 'border-2 border-gray-400' :
                          'border-2 border-green-400'
                        }`}>
                          <span className="text-xl">
                            {scan.type === 'plastic' ? '🗋' :
                             scan.type === 'metal' ? '🪙' : '📄'}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-mono font-bold">{scan.item}</div>
                          <div className="text-cyan-400 text-sm font-mono">CONF: {scan.confidence}% | T+{scan.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400 font-mono">+{scan.points}</div>
                        <div className="text-green-300 text-sm font-mono">XP GAINED</div>
                      </div>
                    </div>

                    {/* Scan confidence bar */}
                    <div className="mt-3 bg-black/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all duration-1000"
                        style={{ width: `${scan.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {activeTab === 'leaderboard' && (
          <div className="px-4 pt-6 space-y-8">
            {/* Cyberpunk Leaderboard Header */}
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-400 overflow-hidden">
              <div className="absolute inset-0 neural-grid opacity-20"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-4xl font-bold text-white mb-4 font-mono" style={{
                  textShadow: '0 0 30px #ffff00'
                }}>🏆 GLOBAL NEURAL NETWORK</h2>
                <p className="text-yellow-300 text-lg font-mono">PLANETARY IMPACT RANKINGS</p>
              </div>
            </div>

            {/* Your Agent Status */}
            <div className="relative holographic-card rounded-3xl p-8 border-2 border-green-400">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-cyan-500/10 to-yellow-500/20 animate-pulse"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-full border-4 border-green-400 quantum-state"
                      style={{
                        background: `conic-gradient(from ${earthRotation}deg, #00ff41, #00f5ff, #ffff00, #00ff41)`
                      }}
                    >
                      <img
                        src={user?.photoURL || "/api/placeholder/80/80"}
                        alt="Agent"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center font-bold text-black text-sm">
                      2
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-mono" style={{
                      textShadow: '0 0 20px #00ff41'
                    }}>AGENT {user?.displayName?.split(' ')[0]?.toUpperCase() || 'ALEX'}</h3>
                    <div className="flex items-center space-x-4 text-sm font-mono">
                      <div className="text-green-400">RANK: #2 / 1,247</div>
                      <div className="text-cyan-400">STREAK: {userStats.streak} DAYS</div>
                      <div className="text-yellow-400">TIER: QUANTUM</div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-green-400 font-mono" style={{
                    textShadow: '0 0 20px #00ff41'
                  }}>{userStats.xp.toLocaleString()}</div>
                  <div className="text-green-300 text-sm font-mono">NEURAL POINTS</div>
                </div>
              </div>
            </div>

            {/* Elite Agent Rankings */}
            <div className="holographic-card rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 font-mono" style={{
                textShadow: '0 0 20px #00f5ff'
              }}>🧠 ELITE NEURAL AGENTS</h3>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "ALEX_CHEN_PRIME", points: 3247, level: 15, avatar: "/api/placeholder/40/40", change: "+12", tier: "QUANTUM" },
                  { rank: 2, name: "YOU", points: 2847, level: 12, avatar: user?.photoURL, change: "+5", tier: "QUANTUM" },
                  { rank: 3, name: "SARAH_KIM_ALPHA", points: 2654, level: 11, avatar: "/api/placeholder/40/40", change: "-1", tier: "PLASMA" },
                  { rank: 4, name: "MIKE_NEURAL_X", points: 2401, level: 10, avatar: "/api/placeholder/40/40", change: "+3", tier: "PLASMA" },
                  { rank: 5, name: "EMMA_MATRIX_99", points: 2398, level: 10, avatar: "/api/placeholder/40/40", change: "-2", tier: "DIGITAL" }
                ].map((agent) => {
                  const isCurrentUser = agent.name === 'YOU';
                  const rankColors = {
                    1: { bg: 'from-yellow-400 to-yellow-600', border: 'border-yellow-400', glow: '#ffff00' },
                    2: { bg: 'from-gray-300 to-gray-500', border: 'border-gray-400', glow: '#c0c0c0' },
                    3: { bg: 'from-orange-400 to-orange-600', border: 'border-orange-400', glow: '#ff8c00' },
                    default: { bg: 'from-cyan-400 to-cyan-600', border: 'border-cyan-400', glow: '#00f5ff' }
                  };
                  const colors = rankColors[agent.rank] || rankColors.default;

                  return (
                    <div key={agent.rank} className={`relative bg-black/60 backdrop-blur-xl border-2 rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                      isCurrentUser ? 'border-green-400 bg-green-500/10' : colors.border
                    }`} style={{
                      boxShadow: isCurrentUser ? '0 0 30px rgba(0, 255, 65, 0.5)' : `0 0 20px ${colors.glow}40`
                    }}>
                      <div className="flex items-center space-x-4">
                        {/* 3D Rank Badge */}
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br ${colors.bg} quantum-state`}>
                            {agent.rank === 1 ? '👑' : agent.rank}
                          </div>
                          {agent.rank <= 3 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <span className="text-xs">{agent.rank === 1 ? '🏆' : agent.rank === 2 ? '🥈' : '🥉'}</span>
                            </div>
                          )}
                        </div>

                        {/* Agent Avatar */}
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-full border-2 border-white/50"
                            style={{
                              background: `conic-gradient(from ${earthRotation + agent.rank * 60}deg, ${colors.glow}, transparent, ${colors.glow})`,
                              animation: `quantumFlux ${3 + agent.rank * 0.5}s ease-in-out infinite`
                            }}
                          >
                            <img
                              src={agent.avatar || "/api/placeholder/64/64"}
                              alt={agent.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 px-2 py-1 bg-black rounded-full border border-cyan-400">
                            <span className="text-xs text-cyan-400 font-mono">{agent.tier}</span>
                          </div>
                        </div>

                        {/* Agent Info */}
                        <div className="flex-1">
                          <div className={`text-lg font-bold font-mono ${
                            isCurrentUser ? 'text-green-400' : 'text-white'
                          }`} style={{
                            textShadow: isCurrentUser ? '0 0 10px #00ff41' : 'none'
                          }}>{agent.name}</div>
                          <div className="text-sm text-cyan-400 font-mono">LEVEL {agent.level} NEURAL AGENT</div>
                        </div>

                        {/* Points and Change */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-white font-mono">{agent.points.toLocaleString()}</div>
                          <div className={`text-sm font-mono ${
                            agent.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>{agent.change} PTS</div>
                        </div>

                        {isCurrentUser && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Challenge</h3>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Campus Clean Energy Week</h4>
                <p className="text-sm text-gray-600 mb-3">Participate in sustainability activities to earn bonus points</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress: 67%</span>
                  <span className="text-sm font-semibold text-purple-600">2,450 pts available</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="px-4 pt-6 space-y-8">
            {/* Agent Profile Matrix */}
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-400 overflow-hidden">
              <div className="absolute inset-0 neural-grid opacity-20"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-6 mb-8">
                  {/* 3D Holographic Avatar */}
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full border-4 border-purple-400 quantum-state"
                      style={{
                        background: `conic-gradient(from ${earthRotation}deg, #8a2be2, #00f5ff, #00ff41, #ffff00, #8a2be2)`,
                        boxShadow: '0 0 40px rgba(138, 43, 226, 0.8)'
                      }}
                    >
                      <img
                        src={user?.photoURL || "/api/placeholder/96/96"}
                        alt="Agent Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center font-bold text-black">
                      {userStats.level}
                    </div>
                    <div className="absolute -bottom-2 -left-2 px-3 py-1 bg-green-400 rounded-full">
                      <span className="text-black font-mono font-bold text-sm">ACTIVE</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-2 font-mono" style={{
                      textShadow: '0 0 20px #8a2be2'
                    }}>AGENT_{user?.displayName?.replace(' ', '_').toUpperCase() || "ALEX_CHEN"}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="text-purple-400 font-mono">LEVEL {userStats.level} QUANTUM</div>
                      <div className="text-cyan-400 font-mono">{userStats.xp.toLocaleString()} NEURAL_PTS</div>
                    </div>
                    <div className="text-green-300 text-sm font-mono">STANFORD_UNIVERSITY.CS_2026.CLEARANCE_ALPHA</div>
                  </div>
                </div>

                {/* Neural Stats Grid */}
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { value: userStats.totalImpact.itemsRecycled, label: "SCANS", color: "green", icon: "🔍" },
                    { value: userStats.streak, label: "STREAK", color: "orange", icon: "🔥" },
                    { value: "15", label: "BADGES", color: "purple", icon: "🏅" },
                    { value: "#2", label: "RANK", color: "yellow", icon: "🏆" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl flex items-center justify-center ${
                        stat.color === 'green' ? 'bg-green-400/20 border-2 border-green-400' :
                        stat.color === 'orange' ? 'bg-orange-400/20 border-2 border-orange-400' :
                        stat.color === 'purple' ? 'bg-purple-400/20 border-2 border-purple-400' :
                        'bg-yellow-400/20 border-2 border-yellow-400'
                      } energy-orb`}>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <div className={`text-2xl font-bold font-mono ${
                        stat.color === 'green' ? 'text-green-400' :
                        stat.color === 'orange' ? 'text-orange-400' :
                        stat.color === 'purple' ? 'text-purple-400' :
                        'text-yellow-400'
                      }`}>{stat.value}</div>
                      <div className="text-gray-400 text-xs font-mono">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Neural Achievements */}
            <div className="holographic-card rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 font-mono" style={{
                textShadow: '0 0 20px #00f5ff'
              }}>🏅 NEURAL ACHIEVEMENTS</h3>
              <div className="space-y-4">
                {[
                  { id: 1, title: "FIRST_NEURAL_LINK", description: "Establish primary connection to the matrix", unlocked: true, rarity: "COMMON", icon: "🧠" },
                  { id: 2, title: "QUANTUM_STREAK_MASTER", description: "Maintain 7-day neural synchronization", unlocked: true, rarity: "RARE", icon: "⚡" },
                  { id: 3, title: "CAMPUS_NEURAL_ELITE", description: "Achieve top 10 campus ranking", unlocked: false, rarity: "EPIC", icon: "👑" }
                ].map((achievement) => {
                  const rarityColors = {
                    'COMMON': { bg: 'from-gray-400 to-gray-600', border: 'border-gray-400', glow: '#9ca3af' },
                    'RARE': { bg: 'from-blue-400 to-blue-600', border: 'border-blue-400', glow: '#3b82f6' },
                    'EPIC': { bg: 'from-purple-400 to-purple-600', border: 'border-purple-400', glow: '#8b5cf6' }
                  };
                  const colors = rarityColors[achievement.rarity];

                  return (
                    <div key={achievement.id} className={`relative bg-black/60 backdrop-blur-xl border-2 rounded-xl p-4 transition-all duration-300 ${
                      achievement.unlocked ? colors.border + ' hover:scale-105' : 'border-gray-600 opacity-60'
                    }`} style={{
                      boxShadow: achievement.unlocked ? `0 0 20px ${colors.glow}40` : 'none'
                    }}>
                      <div className="flex items-center space-x-4">
                        {/* Achievement Icon */}
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                          achievement.unlocked ? `bg-gradient-to-br ${colors.bg} quantum-state` : 'bg-gray-600'
                        }`}>
                          {achievement.unlocked ? achievement.icon : '🔒'}
                        </div>

                        {/* Achievement Info */}
                        <div className="flex-1">
                          <div className={`text-lg font-bold font-mono ${
                            achievement.unlocked ? 'text-white' : 'text-gray-500'
                          }`}>{achievement.title}</div>
                          <div className={`text-sm font-mono ${
                            achievement.unlocked ? 'text-gray-300' : 'text-gray-600'
                          }`}>{achievement.description}</div>
                        </div>

                        {/* Rarity Badge */}
                        <div className={`px-3 py-1 rounded-full border font-mono text-sm ${
                          achievement.unlocked ? colors.border + ' text-white' : 'border-gray-600 text-gray-500'
                        }`} style={{
                          background: achievement.unlocked ? colors.glow + '20' : 'transparent'
                        }}>
                          {achievement.rarity}
                        </div>

                        {achievement.unlocked && (
                          <div className="absolute top-2 right-2">
                            <div className="w-3 h-3 rounded-full animate-ping" style={{
                              backgroundColor: colors.glow
                            }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Planetary Impact Matrix */}
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-green-400">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-cyan-500/10 to-blue-500/10 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 font-mono" style={{
                  textShadow: '0 0 20px #00ff41'
                }}>🌍 PLANETARY IMPACT ANALYSIS</h3>
                <div className="space-y-6">
                  {[
                    { metric: "CO2_NEUTRALIZED", value: userStats.totalImpact.co2Saved, unit: "KG", equivalent: `≈ ${userStats.totalImpact.treesEquivalent} TREES`, color: "green", icon: "🌱" },
                    { metric: "PLASTIC_DIVERTED", value: userStats.totalImpact.plasticDiverted, unit: "KG", equivalent: "FROM_OCEAN_STREAMS", color: "blue", icon: "♻️" },
                    { metric: "ENERGY_CONSERVED", value: userStats.totalImpact.energySaved, unit: "KWH", equivalent: "GRID_OPTIMIZATION", color: "yellow", icon: "⚡" },
                    { metric: "WATER_PRESERVED", value: userStats.totalImpact.waterSaved, unit: "L", equivalent: "AQUIFER_PROTECTION", color: "cyan", icon: "💧" }
                  ].map((impact, index) => (
                    <div key={index} className={`relative bg-black/50 backdrop-blur-xl border-2 rounded-xl p-4 ${
                      impact.color === 'green' ? 'border-green-400/50' :
                      impact.color === 'blue' ? 'border-blue-400/50' :
                      impact.color === 'yellow' ? 'border-yellow-400/50' :
                      'border-cyan-400/50'
                    } hover:scale-105 transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center energy-orb ${
                            impact.color === 'green' ? 'bg-green-400/20 border-2 border-green-400' :
                            impact.color === 'blue' ? 'bg-blue-400/20 border-2 border-blue-400' :
                            impact.color === 'yellow' ? 'bg-yellow-400/20 border-2 border-yellow-400' :
                            'bg-cyan-400/20 border-2 border-cyan-400'
                          }`}>
                            <span className="text-2xl">{impact.icon}</span>
                          </div>
                          <div>
                            <div className="text-white font-mono font-bold">{impact.metric}</div>
                            <div className={`text-sm font-mono ${
                              impact.color === 'green' ? 'text-green-400' :
                              impact.color === 'blue' ? 'text-blue-400' :
                              impact.color === 'yellow' ? 'text-yellow-400' :
                              'text-cyan-400'
                            }`}>{impact.equivalent}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold font-mono ${
                            impact.color === 'green' ? 'text-green-400' :
                            impact.color === 'blue' ? 'text-blue-400' :
                            impact.color === 'yellow' ? 'text-yellow-400' :
                            'text-cyan-400'
                          }`} style={{
                            textShadow: `0 0 20px ${impact.color === 'green' ? '#00ff41' : impact.color === 'blue' ? '#3b82f6' : impact.color === 'yellow' ? '#eab308' : '#06b6d4'}`
                          }}>{impact.value}</div>
                          <div className="text-gray-400 text-sm font-mono">{impact.unit}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Neural Control Panel */}
            <div className="holographic-card rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 font-mono" style={{
                textShadow: '0 0 20px #00f5ff'
              }}>⚙️ NEURAL CONTROL PANEL</h3>
              <div className="space-y-3">
                {[
                  { label: "NEURAL_NOTIFICATIONS", icon: "🔔", color: "cyan" },
                  { label: "QUANTUM_PRIVACY_MATRIX", icon: "🔐", color: "purple" },
                  { label: "NEURAL_SUPPORT_LINK", icon: "🌐", color: "green" }
                ].map((setting, index) => (
                  <button key={index} className={`w-full flex items-center justify-between p-4 bg-black/50 backdrop-blur-xl border-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                    setting.color === 'cyan' ? 'border-cyan-400/30 hover:border-cyan-400' :
                    setting.color === 'purple' ? 'border-purple-400/30 hover:border-purple-400' :
                    'border-green-400/30 hover:border-green-400'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{setting.icon}</span>
                      <span className="font-mono font-bold text-white">{setting.label}</span>
                    </div>
                    <div className="text-cyan-400">❯</div>
                  </button>
                ))}

                {/* Disconnect Button */}
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-between p-4 bg-red-500/20 backdrop-blur-xl border-2 border-red-400/50 hover:border-red-400 rounded-xl transition-all duration-300 hover:scale-105 mt-6"
                  style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔌</span>
                    <span className="font-mono font-bold text-red-400">DISCONNECT_NEURAL_LINK</span>
                  </div>
                  <div className="text-red-400">⚠️</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
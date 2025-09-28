import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function LeaderboardPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  // Mock data for demonstration - replace with real API call
  const mockLeaderboard = [
    { id: 1, name: "Alex Chen", email: "alex@example.com", totalPoints: 2850, level: 12, photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face", co2Saved: 145.2, streak: 15 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", totalPoints: 2720, level: 11, photoURL: "https://images.unsplash.com/photo-1494790108755-2616b812b3c3?w=50&h=50&fit=crop&crop=face", co2Saved: 134.8, streak: 12 },
    { id: 3, name: "Mike Rodriguez", email: "mike@example.com", totalPoints: 2650, level: 10, photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", co2Saved: 128.3, streak: 9 },
    { id: 4, name: "Emma Davis", email: "emma@example.com", totalPoints: 2480, level: 9, photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face", co2Saved: 119.7, streak: 8 },
    { id: 5, name: "David Kim", email: "david@example.com", totalPoints: 2310, level: 9, photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face", co2Saved: 112.4, streak: 6 },
    { id: 6, name: "Lisa Wang", email: "lisa@example.com", totalPoints: 2180, level: 8, photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face", co2Saved: 105.9, streak: 7 },
    { id: 7, name: "James Wilson", email: "james@example.com", totalPoints: 2050, level: 8, photoURL: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face", co2Saved: 98.2, streak: 5 },
    { id: 8, name: "Anna Martinez", email: "anna@example.com", totalPoints: 1920, level: 7, photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face", co2Saved: 91.5, streak: 4 },
  ];

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setData(mockLeaderboard);
      setLoading(false);
    }, 1000);

    // Uncomment below for real API integration
    // fetch(`${process.env.REACT_APP_API_BASE_URL}/leaderboard`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setData(json.leaderboard || []);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setError("Failed to load leaderboard.");
    //     setLoading(false);
    //   });
  }, [token]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "🏅";
    }
  };

  const getUserRank = () => {
    const userInLeaderboard = data.findIndex(u => u.email === user?.email);
    return userInLeaderboard !== -1 ? userInLeaderboard + 1 : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
              <div className="text-white font-bold text-xl font-orbitron">GC</div>
            </div>
            <span className="text-2xl font-bold text-white font-orbitron tracking-wider">GreenCrew</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <img
                src={user?.photoURL || "/api/placeholder/32/32"}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-cyan-400"
              />
              <span className="text-white font-space-grotesk font-medium">{user?.name || "Player"}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-orbitron">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Global Leaderboard</span>
              </h1>
              <p className="text-xl text-gray-300 font-space-grotesk font-light">Compete with eco-warriors worldwide</p>
            </div>

            {/* Period Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                {['daily', 'weekly', 'monthly', 'all-time'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-6 py-3 rounded-xl font-space-grotesk font-semibold transition-all duration-300 ${
                      selectedPeriod === period
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Your Rank Card */}
            {getUserRank() && (
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-cyan-400/30 p-6 mb-8 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getRankIcon(getUserRank())}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-orbitron">Your Rank</h3>
                      <p className="text-cyan-300 font-space-grotesk">#{getUserRank()} out of {data.length} players</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white font-jetbrains">{user?.totalPoints || 0}</div>
                    <div className="text-gray-300 text-sm font-space-grotesk">Total Points</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-6 py-4 rounded-2xl mb-6 shadow">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium font-space-grotesk">{error}</p>
                </div>
              </div>
            )}

            {/* Top 3 Podium */}
            {!loading && data.length >= 3 && (
              <div className="flex justify-center items-end space-x-4 mb-12">
                {/* Second Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-2xl flex items-end justify-center pb-4 shadow-xl">
                      <span className="text-white font-bold text-xl font-orbitron">2</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-silver/50 transition-all duration-300">
                    <img
                      src={data[1]?.photoURL || "/api/placeholder/64/64"}
                      alt={data[1]?.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-gray-400"
                    />
                    <h3 className="text-white font-orbitron font-bold">{data[1]?.name}</h3>
                    <p className="text-yellow-400 font-jetbrains font-bold">{data[1]?.totalPoints}</p>
                    <p className="text-gray-300 text-sm font-space-grotesk">Level {data[1]?.level}</p>
                  </div>
                </div>

                {/* First Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-40 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-2xl flex items-end justify-center pb-4 shadow-xl">
                      <span className="text-white font-bold text-xl font-orbitron">1</span>
                    </div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-yellow-800 text-lg">👑</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/50 hover:border-yellow-400/70 transition-all duration-300 shadow-2xl">
                    <img
                      src={data[0]?.photoURL || "/api/placeholder/64/64"}
                      alt={data[0]?.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-yellow-400"
                    />
                    <h3 className="text-white font-orbitron font-bold">{data[0]?.name}</h3>
                    <p className="text-yellow-400 font-jetbrains font-bold">{data[0]?.totalPoints}</p>
                    <p className="text-gray-300 text-sm font-space-grotesk">Level {data[0]?.level}</p>
                  </div>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-28 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-2xl flex items-end justify-center pb-4 shadow-xl">
                      <span className="text-white font-bold text-xl font-orbitron">3</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-amber-500/50 transition-all duration-300">
                    <img
                      src={data[2]?.photoURL || "/api/placeholder/64/64"}
                      alt={data[2]?.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-amber-600"
                    />
                    <h3 className="text-white font-orbitron font-bold">{data[2]?.name}</h3>
                    <p className="text-yellow-400 font-jetbrains font-bold">{data[2]?.totalPoints}</p>
                    <p className="text-gray-300 text-sm font-space-grotesk">Level {data[2]?.level}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Rankings</h2>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-white/10 rounded-2xl p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-white/20 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-white/10 rounded w-1/2"></div>
                          </div>
                          <div className="h-6 bg-white/20 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.map((player, idx) => (
                      <div
                        key={player.id || idx}
                        className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                          player.email === user?.email
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-cyan-400/50 shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 text-white font-bold font-orbitron">
                              {idx < 3 ? getRankIcon(idx + 1) : idx + 1}
                            </div>
                            <img
                              src={player.photoURL || "/api/placeholder/48/48"}
                              alt={player.name}
                              className="w-12 h-12 rounded-full border-2 border-cyan-400"
                            />
                            <div>
                              <h3 className="text-white font-space-grotesk font-semibold">{player.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-300 font-jetbrains">
                                <span>Level {player.level}</span>
                                <span>🔥 {player.streak} day streak</span>
                                <span>🌱 {player.co2Saved}g CO₂ saved</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-400 font-jetbrains">{player.totalPoints}</div>
                            <div className="text-gray-300 text-sm font-space-grotesk">points</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Link to="/dashboard" className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold font-orbitron">Dashboard</h3>
                    <p className="text-sm opacity-80 font-space-grotesk">View missions</p>
                  </div>
                </div>
              </Link>

              <Link to="/scan" className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold font-orbitron">Scan Items</h3>
                    <p className="text-sm opacity-80 font-space-grotesk">Earn points</p>
                  </div>
                </div>
              </Link>

              <Link to="/profile" className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold font-orbitron">Profile</h3>
                    <p className="text-sm opacity-80 font-space-grotesk">View stats</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
        .font-jetbrains { font-family: 'JetBrains Mono', monospace; }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
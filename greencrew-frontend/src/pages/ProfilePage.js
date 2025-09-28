import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { token, user, logout } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);

    // Simulate API call with user data
    setTimeout(() => {
      setProfile({
        name: user?.name || "Eco Warrior",
        email: user?.email || "player@greencrew.com",
        photoURL: user?.photoURL || "/api/placeholder/120/120",
        level: user?.level || 1,
        xp: user?.xp || 0,
        totalPoints: user?.totalPoints || 0,
        dormId: user?.dormId || "Not assigned",
        joinDate: "September 2024",
        co2Saved: 124.5,
        itemsScanned: 47,
        streakRecord: 15,
        badges: [
          { name: "First Scan", icon: "🔍", earned: true },
          { name: "Week Warrior", icon: "⚡", earned: true },
          { name: "Eco Champion", icon: "🌱", earned: true },
          { name: "Carbon Crusher", icon: "💨", earned: false },
          { name: "Recycle Master", icon: "♻️", earned: false },
          { name: "Green Legend", icon: "🏆", earned: false },
        ],
        recentActivity: [
          { action: "Completed plastic bottle scan", time: "2 hours ago", xp: 50 },
          { action: "Achieved 7-day streak", time: "1 day ago", xp: 100 },
          { action: "Level up to Level 1", time: "3 days ago", xp: 0 },
          { action: "First scan completed", time: "1 week ago", xp: 25 },
        ]
      });
      setLoading(false);
    }, 800);

    // Uncomment for real API integration
    // fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/profile`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setProfile(json.player || {});
    //     setLoading(false);
    //   })
    //   .catch(() => setLoading(false));
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-space-grotesk text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

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

          <button
            onClick={logout}
            className="bg-red-500/20 backdrop-blur-sm text-red-200 px-4 py-2 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 font-space-grotesk font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            {/* Profile Header */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <img
                    src={profile.photoURL || "/api/placeholder/120/120"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/10">
                    <span className="text-white font-bold text-lg font-orbitron">{profile.level}</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-orbitron">
                    {profile.name}
                  </h1>
                  <p className="text-gray-300 text-lg font-space-grotesk mb-4">{profile.email}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 font-jetbrains">{profile.totalPoints}</div>
                      <div className="text-gray-300 text-sm font-space-grotesk">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 font-jetbrains">{profile.xp}</div>
                      <div className="text-gray-300 text-sm font-space-grotesk">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-jetbrains">{profile.co2Saved}g</div>
                      <div className="text-gray-300 text-sm font-space-grotesk">CO₂ Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 font-jetbrains">{profile.itemsScanned}</div>
                      <div className="text-gray-300 text-sm font-space-grotesk">Items Scanned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                {['overview', 'badges', 'activity', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-3 rounded-xl font-space-grotesk font-semibold transition-all duration-300 ${
                      selectedTab === tab
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {selectedTab === 'overview' && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Progress Card */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Progress Overview</h2>

                    <div className="space-y-6">
                      {/* Level Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-space-grotesk font-semibold">Level {profile.level}</span>
                          <span className="text-cyan-400 font-jetbrains">{profile.xp}/350 XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: `${(profile.xp / 350) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white">🌱</span>
                            </div>
                            <span className="text-white font-space-grotesk">Environmental Impact</span>
                          </div>
                          <span className="text-green-400 font-jetbrains font-bold">{profile.co2Saved}g CO₂</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white">🔥</span>
                            </div>
                            <span className="text-white font-space-grotesk">Best Streak</span>
                          </div>
                          <span className="text-orange-400 font-jetbrains font-bold">{profile.streakRecord} days</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white">📅</span>
                            </div>
                            <span className="text-white font-space-grotesk">Member Since</span>
                          </div>
                          <span className="text-blue-400 font-jetbrains font-bold">{profile.joinDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Quick Actions</h2>

                    <div className="grid gap-4">
                      <Link to="/scan" className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold font-orbitron">Scan Items</h3>
                            <p className="text-sm opacity-80 font-space-grotesk">Scan recyclables to earn XP</p>
                          </div>
                        </div>
                      </Link>

                      <Link to="/leaderboard" className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold font-orbitron">View Leaderboard</h3>
                            <p className="text-sm opacity-80 font-space-grotesk">See global rankings</p>
                          </div>
                        </div>
                      </Link>

                      <Link to="/dashboard" className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold font-orbitron">Dashboard</h3>
                            <p className="text-sm opacity-80 font-space-grotesk">View active missions</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'badges' && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Achievement Badges</h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.badges?.map((badge, index) => (
                      <div key={index} className={`p-6 rounded-2xl border transition-all duration-300 ${
                        badge.earned
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-lg'
                          : 'bg-white/5 border-white/10 opacity-60'
                      }`}>
                        <div className="text-center">
                          <div className="text-4xl mb-3">{badge.icon}</div>
                          <h3 className="text-white font-orbitron font-bold mb-2">{badge.name}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-jetbrains font-bold ${
                            badge.earned ? 'bg-yellow-400/20 text-yellow-300' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {badge.earned ? 'Earned' : 'Locked'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'activity' && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Recent Activity</h2>

                  <div className="space-y-4">
                    {profile.recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-white font-space-grotesk">{activity.action}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-400 text-sm font-jetbrains">{activity.time}</span>
                            {activity.xp > 0 && (
                              <span className="text-yellow-400 text-sm font-jetbrains font-bold">+{activity.xp} XP</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'settings' && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Settings</h2>

                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl">
                      <h3 className="text-white font-space-grotesk font-semibold mb-4">Account Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-space-grotesk">Name</span>
                          <span className="text-white font-jetbrains">{profile.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-space-grotesk">Email</span>
                          <span className="text-white font-jetbrains">{profile.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-space-grotesk">Dorm Assignment</span>
                          <span className="text-white font-jetbrains">{profile.dormId || "Not assigned"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl">
                      <h3 className="text-white font-space-grotesk font-semibold mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-space-grotesk">Email Notifications</span>
                          <button className="bg-cyan-500 w-12 h-6 rounded-full relative">
                            <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-space-grotesk">Push Notifications</span>
                          <button className="bg-gray-500 w-12 h-6 rounded-full relative">
                            <div className="bg-white w-5 h-5 rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
                      <h3 className="text-red-300 font-space-grotesk font-semibold mb-4">Danger Zone</h3>
                      <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-space-grotesk font-semibold transition-all duration-300"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { googleSignIn, authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Remove auto-redirect to allow viewing the landing page
    // if (user) {
    //   navigate('/dashboard');
    // }
  }, [user, navigate]);

  const handleGetStarted = async () => {
    // Direct Google Sign In on landing page
    try {
      await googleSignIn();
      if (user) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Fallback to login page if direct sign in fails
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6 lg:px-8">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            {/* Custom GreenCrew Logo */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-6">
                <div className="text-white font-bold text-xl font-orbitron">GC</div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold text-white font-orbitron tracking-wider">GreenCrew</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-space-grotesk font-medium">Features</a>
            <a href="#impact" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-space-grotesk font-medium">Impact</a>
            <a href="#community" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-space-grotesk font-medium">Community</a>
            <button
              onClick={handleGetStarted}
              disabled={authLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-space-grotesk font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Signing In...' : 'Sign In with Google'}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-12 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Badge */}
          <div className={`text-center mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 text-sm px-6 py-3 rounded-full font-medium border border-cyan-500/30 backdrop-blur-sm font-jetbrains">
              🚀 SUSTAINABILITY REVOLUTION STARTS HERE
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight font-orbitron">
                Transform
                <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"> Impact</span>,
                <br />Earn
                <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">Rewards</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed font-space-grotesk font-light">
                Join the <span className="text-cyan-400 font-semibold">ultimate sustainability platform</span> where every eco-action matters.
                Complete missions, climb leaderboards, and unlock exclusive rewards while
                <span className="text-purple-400 font-semibold"> making real environmental impact</span>.
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-space-grotesk font-medium">Mission Streaks</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-space-grotesk font-medium">XP System</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-space-grotesk font-medium">CO₂ Tracking</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={handleGetStarted}
                  disabled={authLoading}
                  className="group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-12 py-4 rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl font-space-grotesk font-bold text-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>{authLoading ? 'Signing In...' : 'Start Your Journey'}</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content - 3D Phone Mockup */}
            <div className={`relative flex justify-center lg:justify-end transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative perspective-1000">
                {/* Floating UI Cards */}
                <div className="absolute -top-16 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300 z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">12</span>
                    </div>
                    <div>
                      <div className="text-gray-800 font-bold font-space-grotesk">PENDING REWARDS</div>
                      <div className="text-gray-600 text-sm font-jetbrains">~321g saved CO₂</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-12 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300 z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-800 font-bold font-space-grotesk">MISSION STREAK</div>
                      <div className="text-purple-600 text-sm font-jetbrains">2-missions in a row!</div>
                    </div>
                  </div>
                </div>

                {/* Phone Frame */}
                <div className="w-80 h-96 lg:w-96 lg:h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl transform-gpu rotate-y-12 hover:rotate-y-6 transition-transform duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-cyan-100">
                      <span className="text-gray-800 font-jetbrains font-bold">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="w-6 h-4 border border-gray-800 rounded-sm relative">
                          <div className="w-3 h-2 bg-gray-800 rounded-sm absolute top-0.5 left-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Journey Map Interface */}
                    <div className="p-6 h-full bg-gradient-to-br from-purple-50 via-cyan-50 to-pink-50 relative">
                      {/* Journey Path */}
                      <div className="relative h-full">
                        {/* Mission Nodes */}
                        <div className="absolute top-16 left-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <span className="text-white font-bold font-orbitron">5</span>
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                        </div>

                        <div className="absolute top-32 right-12">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute top-56 left-16">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        {/* Connecting Path */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 400">
                          <path
                            d="M 60 80 Q 150 120, 240 160 Q 180 200, 80 240 Q 120 280, 160 320"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="5,5"
                            className="animate-dash"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="50%" stopColor="#06B6D4" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Progress Indicator */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-800 font-space-grotesk font-semibold text-sm">Journey Progress</span>
                            <span className="text-purple-600 font-jetbrains font-bold text-sm">Level 3</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
                      <div className="flex justify-around items-center py-3">
                        <div className="text-center">
                          <div className="text-gray-400 text-xs">🏠</div>
                          <span className="text-xs text-gray-400 font-space-grotesk">Home</span>
                        </div>
                        <div className="text-center">
                          <div className="text-cyan-500 text-xs">🗺️</div>
                          <span className="text-xs text-cyan-500 font-space-grotesk font-semibold">Journey</span>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 text-xs">♻️</div>
                          <span className="text-xs text-gray-400 font-space-grotesk">Recycle</span>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 text-xs">🏆</div>
                          <span className="text-xs text-gray-400 font-space-grotesk">Rewards</span>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 text-xs">👤</div>
                          <span className="text-xs text-gray-400 font-space-grotesk">Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 py-20 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-orbitron">
              Revolutionary <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-300 font-space-grotesk font-light">
              Experience sustainability like never before with cutting-edge gamification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Mission System */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-orbitron">Mission System</h3>
              <p className="text-gray-300 font-space-grotesk font-light">
                Complete dynamic eco-missions, build streaks, and unlock progressively challenging sustainability goals.
              </p>
            </div>

            {/* XP & Levels */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-orbitron">XP & Levels</h3>
              <p className="text-gray-300 font-space-grotesk font-light">
                Gain experience points for every action, level up your profile, and unlock exclusive rewards and features.
              </p>
            </div>

            {/* Impact Tracking */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-pink-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-orbitron">Impact Analytics</h3>
              <p className="text-gray-300 font-space-grotesk font-light">
                Visualize your environmental impact with real-time CO₂ savings, waste reduction metrics, and progress insights.
              </p>
            </div>

            {/* Community */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-orbitron">Global Community</h3>
              <p className="text-gray-300 font-space-grotesk font-light">
                Join millions of eco-warriors, compete on leaderboards, and collaborate on global sustainability challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 font-orbitron">
            Ready to <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Transform</span> the World?
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-space-grotesk font-light">
            Join the sustainability revolution and start making an impact today
          </p>

          <button
            onClick={handleGetStarted}
            disabled={authLoading}
            className="group bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-16 py-6 rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl font-space-grotesk font-bold text-xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center space-x-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h7a3 3 0 013 3v1" />
              </svg>
              <span>{authLoading ? 'Signing In...' : 'Launch Your Journey'}</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-lg font-orbitron">GC</div>
            </div>
            <span className="text-2xl font-bold text-white font-orbitron tracking-wider">GreenCrew</span>
          </div>
          <p className="text-gray-400 mb-6 font-space-grotesk">Transforming the world through sustainable action</p>
          <div className="flex justify-center space-x-8">
            <a href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors font-space-grotesk">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors font-space-grotesk">Terms</a>
            <a href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors font-space-grotesk">Support</a>
          </div>
        </div>
      </footer>

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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes dash {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-dash { animation: dash 3s ease-in-out infinite; }

        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(12deg); }
        .rotate-y-6 { transform: rotateY(6deg); }
      `}</style>
    </div>
  );
};

export default LandingPage;
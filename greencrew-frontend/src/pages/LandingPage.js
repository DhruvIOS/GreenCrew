import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Trophy,
  Camera,
  Users,
  Star,
  ChevronRight,
  Play,
  Smartphone,
  Award
} from "lucide-react";
import "../styles/animations.css";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">GreenCrew</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-600 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">How it Works</a>
                <a href="#leaderboard" className="text-gray-600 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">Leaderboard</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float ${isLoaded ? 'animate-scale-in' : ''}`}>
                  <Leaf className="h-10 w-10 text-white" />
                </div>
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse-glow ${isLoaded ? 'animate-scale-in animate-delay-200' : ''}`}>
                  <Star className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className={`text-4xl sm:text-6xl font-bold text-gray-900 mb-6 ${isLoaded ? 'animate-slide-in-up animate-delay-300' : ''}`}>
              Campus Goes
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"> Green</span>
            </h1>
            <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto ${isLoaded ? 'animate-slide-in-up animate-delay-400' : ''}`}>
              Transform your campus into a sustainable community. Scan items, earn points, compete with friends,
              and make a real environmental impact together.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isLoaded ? 'animate-slide-in-up animate-delay-500' : ''}`}>
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center gap-2 button-spring"
              >
                <Play className="h-5 w-5" />
                Start Your Journey
              </Link>
              <button className="text-green-600 hover:text-green-700 px-8 py-4 rounded-2xl text-lg font-semibold transition-colors flex items-center gap-2 button-spring">
                <Camera className="h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">10K+</div>
              <div className="text-gray-600">Items Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Campus Dorms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">95%</div>
              <div className="text-gray-600">Waste Reduced</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="text-green-500"> Sustainable Living</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make your campus more sustainable, gamified and engaging.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 hover-lift ${isLoaded ? 'animate-slide-in-up animate-delay-100' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-ios">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Scanning</h3>
              <p className="text-gray-600 mb-6">
                Use AI-powered camera to scan recyclable items and get instant feedback on sustainability impact.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 hover-lift ${isLoaded ? 'animate-slide-in-up animate-delay-200' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-ios">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gamified Experience</h3>
              <p className="text-gray-600 mb-6">
                Earn XP, level up, and compete with friends through engaging sustainability challenges.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 hover-lift ${isLoaded ? 'animate-slide-in-up animate-delay-300' : ''}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-ios">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Leaderboard</h3>
              <p className="text-gray-600 mb-6">
                See how your dorm ranks against others and build a competitive sustainable community.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps and begin making a difference today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sign Up & Join</h3>
              <p className="text-gray-600">
                Create your account and join your campus dorm community to start your sustainable journey.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scan & Recycle</h3>
              <p className="text-gray-600">
                Use your camera to scan recyclable items and get instant points for your sustainable actions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Compete & Win</h3>
              <p className="text-gray-600">
                Climb the leaderboard, earn achievements, and help your dorm become the most sustainable on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make Your Campus Greener?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already making a difference. Start your sustainable journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              Join GreenCrew Now
            </Link>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-bold">GreenCrew</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making campus sustainability fun, competitive, and rewarding for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">About</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GreenCrew. Built for sustainable campus communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
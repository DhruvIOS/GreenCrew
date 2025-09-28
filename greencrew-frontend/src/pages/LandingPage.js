import React, { useEffect, useRef, useState } from "react";
import { gsap } from "../utils/gsapConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Leaf,
  Users,
  Award,
  Recycle,
  TreePine,
  Smartphone,
  ArrowRight,
  Globe,
  Target,
  BarChart3
} from "lucide-react";

export default function LandingPage() {
  const { user, authLoading, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  // GSAP Refs
  const heroRef = useRef(null);
  const welcomeRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollRef = useRef(null);
  const factsRef = useRef(null);
  const ctaButtonRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const welcome = welcomeRef.current;
    const subtitle = subtitleRef.current;
    const scroll = scrollRef.current;

    // Set initial states
    gsap.set([welcome, subtitle, scroll], {
      opacity: 0,
      y: 50
    });

    // Welcome animation sequence
    const tl = gsap.timeline({
      onComplete: () => setWelcomeComplete(true)
    });

    tl.to(welcome, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    })
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to(scroll, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.3");

    // Scroll arrow animation
    gsap.to(scroll, {
      y: 10,
      duration: 1.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    return () => {
      tl.kill();
    };
  }, []);

  const scrollToFacts = () => {
    const factsElement = factsRef.current;
    if (factsElement) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: factsElement,
        ease: "power2.inOut"
      });
    }
  };

  const handleGetStarted = async () => {
    gsap.to(ctaButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    if (user) {
      navigate('/dashboard');
    } else {
      googleSignIn();
    }
  };

  const campusStats = [
    { icon: <Users className="w-6 h-6" />, value: "2,847", label: "Students Engaged" },
    { icon: <Recycle className="w-6 h-6" />, value: "12,456", label: "Items Recycled" },
    { icon: <TreePine className="w-6 h-6" />, value: "145kg", label: "CO₂ Saved" },
    { icon: <Award className="w-6 h-6" />, value: "89%", label: "Participation Rate" }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Scan",
      description: "Use your phone camera to scan recyclable items around campus",
      icon: <Smartphone className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Learn",
      description: "Get instant feedback on environmental impact and proper disposal",
      icon: <Globe className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Act",
      description: "Make sustainable choices and track your positive campus impact",
      icon: <Target className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center relative px-6"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)'
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-200/25 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
        </div>

        {/* Campus Branding Header */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-900">GreenCrew</span>
          </div>
          <div className="text-sm text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full">
            UMBC Campus
          </div>
        </div>

        {/* Welcome Animation */}
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1
            ref={welcomeRef}
            className="text-5xl lg:text-7xl font-bold mb-8 leading-tight"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome to GreenCrew
            <br />
            <span className="text-3xl lg:text-5xl text-emerald-700 block mt-4">
              THE NEXT GEN SUSTAINABLE
              <br />
              Campus Solution
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl lg:text-2xl text-emerald-800 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Transform your campus into a sustainability powerhouse.
            <br />
            Let's turn UMBC into the next level of environmental leadership.
            <br />
            <span className="text-emerald-600 font-semibold">Help Earth. Help Tomorrow. Start Today.</span>
          </p>

          <button
            ref={ctaButtonRef}
            onClick={handleGetStarted}
            disabled={authLoading}
            className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 mb-16"
          >
            {authLoading ? 'Connecting...' : user ? 'Enter Campus Hub' : 'Join the Movement'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Scroll Down Arrow */}
        <div
          ref={scrollRef}
          onClick={scrollToFacts}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        >
          <div className="text-center">
            <p className="text-emerald-700 text-sm mb-2 group-hover:text-emerald-800">Discover How</p>
            <ChevronDown className="w-8 h-8 text-emerald-600 group-hover:text-emerald-800 transition-colors" />
          </div>
        </div>
      </div>

      {/* Facts and Impact Section */}
      <div
        ref={factsRef}
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Campus Sustainability in Action
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              Real students. Real impact. Real change happening at UMBC every day.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {campusStats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="text-emerald-400 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-emerald-200 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Environmental Facts */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Why Campus Sustainability Matters
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Campus Impact</h4>
                    <p className="text-emerald-200">Universities generate 30% more waste per person than typical communities. Small actions create massive campus-wide change.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Global Reach</h4>
                    <p className="text-emerald-200">Students carry sustainable habits beyond campus, multiplying environmental impact across communities worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Measurable Results</h4>
                    <p className="text-emerald-200">Every scanned item, every sustainable choice, every point earned contributes to real environmental progress data.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-6xl mb-6">🌱</div>
                <h4 className="text-2xl font-bold text-white mb-4">Together We Grow</h4>
                <p className="text-emerald-200 mb-6">
                  Join thousands of UMBC students making our campus a model for sustainable living.
                </p>
                <div className="text-4xl font-bold text-emerald-400">1 Campus</div>
                <div className="text-emerald-200">Infinite Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-emerald-900 mb-6">
              How GreenCrew Works
            </h2>
            <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
              Three simple steps to transform your daily campus routine into environmental action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-emerald-100 group-hover:bg-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <div className="text-emerald-600">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-emerald-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
            <h3 className="text-3xl font-bold text-emerald-900 mb-4">
              Ready to Lead UMBC's Sustainable Future?
            </h3>
            <p className="text-emerald-700 mb-8 max-w-2xl mx-auto">
              Every sustainable action starts with a single choice. Make yours count.
              Join the campus sustainability revolution today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Impact Journey
              </button>
              <button
                onClick={scrollToFacts}
                className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-xl transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
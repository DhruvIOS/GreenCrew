import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import useGameStore from '../store/gameStore';
import {
  Gift,
  Star,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Coffee,
  ShoppingBag,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';

const FloatingElement = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

const RewardCard = ({ reward, index, userXP }) => {
  const [claimed, setClaimed] = useState(false);
  const canAfford = userXP >= reward.points;

  const handleClaim = () => {
    if (canAfford && !claimed) {
      setClaimed(true);
    }
  };

  return (
    <FloatingElement delay={index * 0.1}>
      <motion.div
        className="relative overflow-hidden rounded-3xl"
        whileHover={{ scale: canAfford ? 1.02 : 1, y: canAfford ? -8 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`p-8 text-white relative ${
            claimed ? 'bg-gray-400' : canAfford ? 'cursor-pointer' : 'opacity-60'
          }`}
          style={{
            background: claimed
              ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
              : `linear-gradient(135deg, ${reward.gradient})`
          }}
          onClick={handleClaim}
        >
          {/* Floating Background Elements */}
          <motion.div
            className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">{reward.emoji}</div>
              <div className="text-right">
                <p
                  className="text-sm opacity-90 mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {reward.points} XP
                </p>
                {canAfford && !claimed && (
                  <motion.div
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {claimed && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {reward.name}
            </h3>
            <p
              className="opacity-90 mb-4 text-lg"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {reward.description}
            </p>
            <p
              className="text-sm opacity-75"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {reward.details}
            </p>

            {/* Status */}
            <motion.div className="mt-6">
              {claimed ? (
                <span
                  className="text-white font-semibold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  ✓ CLAIMED
                </span>
              ) : canAfford ? (
                <span
                  className="text-white font-semibold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  TAP TO CLAIM
                </span>
              ) : (
                <span
                  className="text-white/70 font-semibold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {reward.points - userXP} XP NEEDED
                </span>
              )}
            </motion.div>
          </div>

          {/* Claim Animation */}
          {claimed && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
                <p
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Claimed!
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </FloatingElement>
  );
};

export default function RewardsPage() {
  const { user, fetchUser } = useGameStore();
  const userXP = user?.xp || 0;

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const rewardTiers = [
    {
      tier: "Campus Essentials",
      subtitle: "Perfect for daily campus life",
      rewards: [
        {
          name: "Starbucks",
          description: "$5 Gift Card",
          details: "Valid at UMBC Commons Starbucks",
          points: 500,
          emoji: "☕",
          gradient: "#10b981 0%, #059669 100%"
        },
        {
          name: "Dunkin'",
          description: "$5 Gift Card",
          details: "Any participating location",
          points: 500,
          emoji: "🍩",
          gradient: "#f97316 0%, #ea580c 100%"
        },
        {
          name: "Campus Store",
          description: "$10 Voucher",
          details: "UMBC merchandise and supplies",
          points: 800,
          emoji: "🏪",
          gradient: "#3b82f6 0%, #2563eb 100%"
        }
      ]
    },
    {
      tier: "Premium Rewards",
      subtitle: "For the dedicated eco-warriors",
      rewards: [
        {
          name: "Chick-fil-A",
          description: "$10 Gift Card",
          details: "Any participating restaurant",
          points: 1000,
          emoji: "🐔",
          gradient: "#ef4444 0%, #dc2626 100%"
        },
        {
          name: "Amazon",
          description: "$15 Gift Card",
          details: "Digital delivery via email",
          points: 1500,
          emoji: "📦",
          gradient: "#8b5cf6 0%, #7c3aed 100%"
        },
        {
          name: "Target",
          description: "$20 Gift Card",
          details: "In-store or online purchase",
          points: 2000,
          emoji: "🎯",
          gradient: "#06b6d4 0%, #0891b2 100%"
        }
      ]
    },
    {
      tier: "Elite Rewards",
      subtitle: "Exclusive perks for sustainability leaders",
      rewards: [
        {
          name: "Apple Store",
          description: "$25 Gift Card",
          details: "Any Apple Store or apple.com",
          points: 2500,
          emoji: "🍎",
          gradient: "#1f2937 0%, #374151 100%"
        },
        {
          name: "UMBC Parking Pass",
          description: "1 Month Free",
          details: "Any campus parking lot",
          points: 3000,
          emoji: "🅿️",
          gradient: "#059669 0%, #047857 100%"
        },
        {
          name: "Eco Champion Badge",
          description: "Official Recognition",
          details: "Certificate + priority registration",
          points: 5000,
          emoji: "🏆",
          gradient: "#fbbf24 0%, #f59e0b 100%"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <FloatingElement>
              <motion.div
                className="inline-block mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Gift className="w-20 h-20 text-white" />
              </motion.div>
            </FloatingElement>

            <FloatingElement delay={0.2}>
              <h1
                className="text-5xl lg:text-7xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Rewards Center
              </h1>
            </FloatingElement>

            <FloatingElement delay={0.4}>
              <p
                className="text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Turn your sustainability efforts into real rewards.
                <br />Every scan brings you closer to amazing prizes.
              </p>
            </FloatingElement>

            <FloatingElement delay={0.6}>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <div className="flex items-center space-x-4">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                  <div className="text-left">
                    <p
                      className="text-white/90 text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Your Balance
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {userXP} XP
                    </p>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Rewards Sections */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {rewardTiers.map((tier, tierIndex) => (
          <FloatingElement key={tierIndex} delay={tierIndex * 0.2}>
            <div className="mb-20">
              <div className="text-center mb-12">
                <motion.h2
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {tier.tier}
                </motion.h2>
                <p
                  className="text-xl text-gray-600"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {tier.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tier.rewards.map((reward, index) => (
                  <RewardCard
                    key={index}
                    reward={reward}
                    index={index}
                    userXP={userXP}
                  />
                ))}
              </div>
            </div>
          </FloatingElement>
        ))}
      </div>

      {/* How to Earn More */}
      <FloatingElement>
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Need More XP?
              </h2>
              <p
                className="text-xl mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                Keep scanning items around campus to earn more XP and unlock better rewards!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { icon: "📱", title: "Scan Items", xp: "10-25 XP" },
                  { icon: "♻️", title: "Recycle Action", xp: "15-30 XP" },
                  { icon: "🏆", title: "Daily Streaks", xp: "50+ XP" }
                ].map((method, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-4xl mb-4">{method.icon}</div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {method.title}
                    </h3>
                    <p
                      className="text-green-100 font-bold"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {method.xp}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FloatingElement>
    </div>
  );
}
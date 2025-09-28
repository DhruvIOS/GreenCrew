import React, { useEffect, useRef } from 'react';
import { gsap, useGSAP, arcadeAnimations } from '../utils/gsapConfig';

const XPRing = ({
  currentXP = 0,
  level = 1,
  size = 140,
  strokeWidth = 8,
  avatarUrl = null,
  name = "Player"
}) => {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const avatarRef = useRef(null);
  const levelBadgeRef = useRef(null);
  const textRef = useRef(null);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate XP progress within current level
  const xpInCurrentLevel = currentXP % 100;
  const xpForNextLevel = 100;
  const progress = (xpInCurrentLevel / xpForNextLevel) * 100;

  useEffect(() => {
    const container = containerRef.current;
    const ring = ringRef.current;
    const avatar = avatarRef.current;
    const levelBadge = levelBadgeRef.current;
    const text = textRef.current;

    if (!ring || !container) return;

    // Set initial states
    gsap.set(ring, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
      transformOrigin: "center"
    });

    gsap.set([avatar, levelBadge, text], {
      opacity: 0,
      scale: 0
    });

    // Create timeline for entrance animation
    const tl = gsap.timeline();

    // Ring draw animation
    tl.to(ring, {
      strokeDashoffset: circumference - (progress / 100) * circumference,
      duration: 2,
      ease: "power2.out"
    })
    // Avatar and elements appear
    .to([avatar, text], {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=1")
    .to(levelBadge, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "back.out(2)",
    }, "-=0.3");

    // Continuous pulsing glow animation
    gsap.to(ring, {
      filter: "drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor)",
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    // Avatar hover effect setup
    const hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(avatar, {
      scale: 1.1,
      filter: "brightness(1.2)",
      duration: 0.3,
      ease: "power2.out"
    })
    .to(container, {
      boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)",
      duration: 0.3,
      ease: "power2.out"
    }, 0);

    // Mouse events
    const handleMouseEnter = () => hoverTl.play();
    const handleMouseLeave = () => hoverTl.reverse();

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Level badge pulse
    gsap.to(levelBadge, {
      scale: 1.1,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    return () => {
      tl.kill();
      hoverTl.kill();
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [currentXP, circumference, progress]);

  // Function to update XP (can be called externally)
  const updateXP = (newXP) => {
    const newProgress = ((newXP % 100) / 100) * 100;
    const newDashOffset = circumference - (newProgress / 100) * circumference;

    gsap.to(ringRef.current, {
      strokeDashoffset: newDashOffset,
      duration: 1.5,
      ease: "power2.out"
    });

    // XP gain flash effect
    gsap.fromTo(ringRef.current,
      { filter: "drop-shadow(0 0 5px currentColor)" },
      {
        filter: "drop-shadow(0 0 30px currentColor) drop-shadow(0 0 50px currentColor)",
        duration: 0.5,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      }
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* XP Ring Container */}
      <div
        ref={containerRef}
        className="relative cursor-pointer transition-all duration-300"
        style={{ width: size, height: size }}
      >
        {/* Background Ring */}
        <svg
          className="transform -rotate-90 absolute inset-0"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress Ring */}
          <circle
            ref={ringRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#xpGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            className="text-neon-green"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>

        {/* Avatar in Center */}
        <div
          ref={avatarRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            border: `3px solid rgba(34, 197, 94, 0.3)`,
            boxShadow: 'inset 0 0 20px rgba(34, 197, 94, 0.1)'
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neon-gradient flex items-center justify-center text-white font-arcade font-bold text-2xl">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Level Badge */}
        <div
          ref={levelBadgeRef}
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-neon-gradient rounded-full flex items-center justify-center text-white font-arcade font-bold text-sm border-2 border-dark-800"
          style={{
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)'
          }}
        >
          {level}
        </div>

        {/* Floating XP indicators */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neon-blue rounded-full opacity-60 animate-float"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* XP Text Info */}
      <div
        ref={textRef}
        className="mt-6 text-center"
      >
        <div className="text-xl font-arcade font-bold text-neon-green mb-1">
          LEVEL {level} RECYCLER
        </div>
        <div className="text-sm font-game text-white/80 mb-1">
          {xpInCurrentLevel}/{xpForNextLevel} XP
        </div>
        <div className="text-xs font-game text-white/60">
          {xpForNextLevel - xpInCurrentLevel} XP TO LEVEL {level + 1}
        </div>

        {/* XP Bar */}
        <div className="mt-3 w-32 h-2 bg-dark-700 rounded-full overflow-hidden border border-neon-green/30">
          <div
            className="h-full bg-neon-gradient transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Export the updateXP function for external use
XPRing.updateXP = (ref, newXP) => {
  if (ref && ref.current) {
    ref.current.updateXP(newXP);
  }
};

export default XPRing;
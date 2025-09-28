import React, { useRef, useEffect } from 'react';
import { gsap, useGSAP, arcadeAnimations } from '../utils/gsapConfig';
import { Gamepad2, Zap } from 'lucide-react';

const LoadingScreen = ({ message = "INITIALIZING GAME SYSTEMS..." }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const particlesRef = useRef([]);

  useGSAP(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const progress = progressRef.current;

    if (!container) return;

    // Scramble text animation
    arcadeAnimations.createScrambleText(text, message, 2);

    // Progress bar animation
    gsap.fromTo(progress,
      { width: "0%" },
      {
        width: "100%",
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      }
    );

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-neon-green rounded-full opacity-60';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      container.appendChild(particle);
      particlesRef.current.push(particle);

      gsap.to(particle, {
        y: -50,
        opacity: 0,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        ease: "power1.out",
        delay: Math.random() * 2
      });
    }

    // Pulsing glow effect
    gsap.to(container, {
      filter: "drop-shadow(0 0 30px rgba(34, 197, 94, 0.3))",
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

  }, [message]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-dark-900 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 arcade-grid opacity-20" />

      {/* Neon Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-neon-blue/5 rounded-full blur-2xl animate-pulse" />

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-glow">
            <Gamepad2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-arcade font-bold text-neon-green mb-2">
            GREENCREW
          </h1>
        </div>

        {/* Loading Text */}
        <div
          ref={textRef}
          className="text-xl font-arcade text-neon-blue mb-8 min-h-[2rem]"
        >
          {message}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-dark-700 rounded-full overflow-hidden mx-auto mb-4 border border-neon-green/30">
          <div
            ref={progressRef}
            className="h-full bg-neon-gradient rounded-full shadow-lg"
            style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' }}
          />
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm font-arcade text-white/70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span>SYSTEMS ONLINE</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-neon-yellow" />
            <span>CHARGING...</span>
          </div>
        </div>
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-60 animate-pulse"
          style={{
            top: '30%',
            animation: 'scanLine 2s linear infinite'
          }}
        />
        <div
          className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-40 animate-pulse"
          style={{
            top: '70%',
            animation: 'scanLine 3s linear infinite reverse'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes scanLine {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
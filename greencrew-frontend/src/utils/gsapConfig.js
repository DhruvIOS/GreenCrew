import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Core plugins
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomWiggle } from "gsap/CustomWiggle";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

// Interactive plugins
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";

// SVG and morphing plugins
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";

// Scroll plugins
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Text and effects plugins
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

// Physics and specialized plugins
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { Flip } from "gsap/Flip";

// Development tools
import { GSDevTools } from "gsap/GSDevTools";

// Third-party integrations (if using these libraries)
// import { EaselPlugin } from "gsap/EaselPlugin";
// import { PixiPlugin } from "gsap/PixiPlugin";

// Register all plugins
gsap.registerPlugin(
  useGSAP,

  // Core easing and animation
  CustomEase,
  CustomBounce,
  CustomWiggle,
  RoughEase,
  ExpoScaleEase,
  SlowMo,

  // Interactive
  Draggable,
  InertiaPlugin,
  Observer,

  // SVG and paths
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  MotionPathHelper,

  // Scroll animations
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,

  // Text effects
  SplitText,
  TextPlugin,
  ScrambleTextPlugin,

  // Physics and layout
  Physics2DPlugin,
  PhysicsPropsPlugin,
  Flip,

  // Development
  GSDevTools
);

// Custom eases for arcade-style animations
CustomEase.create("arcadeBounce", "M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,0.963 0.362,1 0.37,0.985 0.414,0.7 0.455,0.676 0.51,0.639 0.549,0.6 0.588,0.6 0.661,0.6 0.818,0.748 0.818,0.9 0.818,0.948 0.798,1.001 0.84,1.001 0.882,1.001 0.901,0.948 0.901,0.9 0.901,0.748 1.058,0.6 1.131,0.6 1.17,0.6 1.209,0.639 1.264,0.676 1.305,0.7 1.349,0.985 1.357,1 1.365,0.963 1.406,0.728 1.447,0.561 1.477,0.438 1.579,0 1.719,0 ");

CustomEase.create("arcadeSlam", "M0,0 C0.126,0 0.282,0.294 0.44,0.686 0.556,0.952 0.67,1.372 0.776,1.372 0.882,1.372 0.996,0.952 1.112,0.686 1.27,0.294 1.426,0 1.552,0 ");

CustomEase.create("powerPulse", "M0,0,C0.11,0,0.5,1,0.5,1,0.5,1,0.89,0,1,0");

// Arcade-style bounce for scan button
CustomBounce.create("scanButtonBounce", {
  strength: 0.3,
  endAtStart: false,
  squash: 2
});

// Wiggle effect for success celebrations
CustomWiggle.create("celebrationWiggle", {
  wiggles: 6,
  type: "anticipate"
});

// XP number floating effect
CustomEase.create("xpFloat", "M0,0 C0.165,0.84 0.44,1.005 1,1");

// Enhanced GSAP timeline for complex sequences
export const createXPGainSequence = (element, xpAmount) => {
  const tl = gsap.timeline();

  // Stage 1: Impact with custom bounce
  tl.fromTo(element,
    {
      scale: 0,
      rotation: -180,
      opacity: 0,
      filter: "drop-shadow(0 0 0px currentColor)"
    },
    {
      scale: 1.5,
      rotation: 0,
      opacity: 1,
      filter: "drop-shadow(0 0 30px currentColor)",
      duration: 0.4,
      ease: "arcadeBounce"
    }
  )

  // Stage 2: Power pulse
  .to(element, {
    scale: 2,
    filter: "drop-shadow(0 0 50px currentColor) brightness(1.5)",
    duration: 0.3,
    ease: "powerPulse",
    yoyo: true,
    repeat: 1
  })

  // Stage 3: Float away with custom ease
  .to(element, {
    y: -150,
    opacity: 0,
    scale: 0.8,
    rotation: 360,
    filter: "drop-shadow(0 0 10px currentColor)",
    duration: 2,
    ease: "xpFloat"
  }, "-=0.3");

  return tl;
};

// Enhanced scan button animation with physics
export const createScanButtonSequence = (button) => {
  const tl = gsap.timeline();

  // Press down with anticipation
  tl.to(button, {
    scale: 0.9,
    duration: 0.1,
    ease: "power2.in"
  })

  // Spring back with custom bounce
  .to(button, {
    scale: 1.2,
    duration: 0.6,
    ease: "scanButtonBounce"
  })

  // Settle to normal
  .to(button, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out"
  });

  return tl;
};

// Particle burst with physics
export const createPhysicsParticleBurst = (element, particleCount = 20) => {
  const particles = [];
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'fixed w-2 h-2 rounded-full pointer-events-none z-50';
    particle.style.background = `hsl(${Math.random() * 60 + 100}, 70%, 60%)`;
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.boxShadow = '0 0 10px currentColor';

    document.body.appendChild(particle);
    particles.push(particle);

    // Physics-based motion
    gsap.set(particle, {
      physics2D: {
        velocity: Math.random() * 400 + 200,
        angle: Math.random() * 360,
        gravity: 300
      }
    });

    gsap.to(particle, {
      physics2D: {
        velocity: 0
      },
      opacity: 0,
      duration: 2,
      ease: "none",
      onComplete: () => particle.remove()
    });
  }

  return particles;
};

// Text scramble effect for loading states
export const createScrambleText = (element, newText, duration = 1) => {
  return gsap.to(element, {
    duration: duration,
    scrambleText: {
      text: newText,
      chars: "0123456789!@#$%^&*()_+=-[]{}|;':\",./<>?",
      revealDelay: 0.5,
      tweenLength: false
    }
  });
};

// Morphing SVG effects for icons
export const createIconMorph = (svgPath, newPath, duration = 0.8) => {
  return gsap.to(svgPath, {
    duration: duration,
    morphSVG: newPath,
    ease: "power2.inOut"
  });
};

// Flip animations for card reveals
export const createCardFlip = (element, callback) => {
  const state = Flip.getState(element);

  // Modify the element (callback should change its state)
  if (callback) callback();

  return Flip.from(state, {
    duration: 0.7,
    ease: "power2.inOut",
    scale: true,
    absolute: true
  });
};

// Advanced scroll-triggered animations
export const createScrollReveal = (elements, options = {}) => {
  const defaults = {
    trigger: elements,
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1,
    ...options
  };

  return gsap.fromTo(elements,
    {
      y: 100,
      opacity: 0,
      scale: 0.8
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.1,
      scrollTrigger: defaults
    }
  );
};

// Export GSAP and useGSAP for easy importing
export { gsap, useGSAP };

// Export custom animations
export const arcadeAnimations = {
  createXPGainSequence,
  createScanButtonSequence,
  createPhysicsParticleBurst,
  createScrambleText,
  createIconMorph,
  createCardFlip,
  createScrollReveal
};

export default gsap;
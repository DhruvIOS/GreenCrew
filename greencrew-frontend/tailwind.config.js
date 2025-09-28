/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Arcade neon colors
        neon: {
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#9333ea',
          pink: '#ec4899',
          cyan: '#06b6d4',
          yellow: '#facc15',
        },
        // Dark arcade background
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
        }
      },
      fontFamily: {
        'arcade': ['Orbitron', 'monospace'],
        'game': ['Lexend', 'system-ui', 'sans-serif'],
        'pixel': ['Courier New', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'bounce-glow': 'bounceGlow 2s ease-in-out infinite',
        'neon-flicker': 'neonFlicker 0.1s ease-in-out infinite alternate',
        'scan-pulse': 'scanPulse 1.5s ease-in-out infinite',
        'grid-move': 'gridMove 20s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': {
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor, inset 0 0 5px currentColor',
            transform: 'scale(1)'
          },
          '100%': {
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor, inset 0 0 10px currentColor',
            transform: 'scale(1.05)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceGlow: {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
            boxShadow: '0 0 20px currentColor'
          },
          '50%': {
            transform: 'translateY(-15px) scale(1.1)',
            boxShadow: '0 0 40px currentColor, 0 0 60px currentColor'
          },
        },
        neonFlicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        scanPulse: {
          '0%': {
            transform: 'scale(1)',
            opacity: 1
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: 0.7
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1
          },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        }
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #9333ea 100%)',
        'arcade-grid': `
          linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
        `,
        'hud-panel': 'linear-gradient(145deg, rgba(26, 26, 26, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
      },
      backdropBlur: {
        'hud': '10px',
      },
      borderRadius: {
        'hud': '1rem',
      }
    },
  },
  plugins: [],
}

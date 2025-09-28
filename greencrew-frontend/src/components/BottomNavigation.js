import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Camera,
  Trophy,
  Gift,
  BarChart3,
  Settings,
  Home
} from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      activeColor: '#10b981',
      inactiveColor: '#6b7280'
    },
    {
      id: 'scan',
      label: 'Scan',
      icon: Camera,
      path: '/scan',
      activeColor: '#10b981',
      inactiveColor: '#6b7280'
    },
    {
      id: 'board',
      label: 'Board',
      icon: Trophy,
      path: '/leaderboard',
      activeColor: '#10b981',
      inactiveColor: '#6b7280'
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: Gift,
      path: '/rewards',
      activeColor: '#10b981',
      inactiveColor: '#6b7280'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      activeColor: '#10b981',
      inactiveColor: '#6b7280'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Glass morphism background */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-around py-3 px-6 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 relative"
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-emerald-100 rounded-2xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon with enhanced animations */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className="w-6 h-6 transition-colors duration-200"
                    style={{
                      color: isActive ? item.activeColor : item.inactiveColor
                    }}
                  />

                  {/* Active glow effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 blur-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>

                {/* Label with enhanced typography */}
                <motion.span
                  className="text-xs mt-1 font-medium transition-colors duration-200 relative z-10"
                  style={{
                    color: isActive ? item.activeColor : item.inactiveColor,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: isActive ? 600 : 500
                  }}
                  animate={{
                    scale: isActive ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {item.label}
                </motion.span>

                {/* Enhanced active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-2 h-2 bg-emerald-500 rounded-full"
                    initial={{ scale: 0, x: "-50%" }}
                    animate={{ scale: 1, x: "-50%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Enhanced iPhone home indicator */}
        <div className="flex justify-center pb-2">
          <motion.div
            className="w-32 h-1 bg-gray-300 rounded-full"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
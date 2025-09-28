import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsapConfig';
import { useAuth } from '../context/AuthContext';
import useGameStore from '../store/gameStore';
import {
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  LogOut,
  Edit3,
  ChevronRight,
  Award
} from 'lucide-react';

const SettingsPage = () => {
  const { user: authUser, logout } = useAuth();
  const { user: gameUser, fetchUser } = useGameStore();
  const [selectedAvatar, setSelectedAvatar] = useState('🌱');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    // Animate sections on load
    if (sectionRefs.current.length > 0) {
      gsap.fromTo(
        sectionRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, []);

  const avatarOptions = [
    '🌱', '🌿', '🌳', '🌲', '🍃', '🌴',
    '♻️', '🌍', '🌎', '🌏', '🌸', '🌺',
    '🦋', '🐝', '🐛', '🌻', '🌼', '🌷',
    '🌵', '🍀', '🌾', '🌿', '🍂', '🌰'
  ];

  // Rewards Center removed per request

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const SettingSection = ({ icon: Icon, title, subtitle, action, index, children }) => (
    <div
      ref={el => sectionRefs.current[index] = el}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-4"
    >
      <div className="flex items-center justify-between" onClick={action}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {action && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
      {children}
    </div>
  );

  // RewardCard removed per request

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header with top-right Logout */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your GreenCrew experience</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>

      {/* Profile Section */}
      <SettingSection
        icon={User}
        title="Profile"
        subtitle={`${authUser?.name || authUser?.displayName || ''} • Level ${gameUser?.level || 1}`}
        index={0}
      >
        <div className="mt-6 flex items-center space-x-4">
          {/* Avatar Display */}
          <div className="relative">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl border-4 border-emerald-200">
              {selectedAvatar}
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {authUser?.name || authUser?.displayName || ''}
            </h3>
            <p className="text-emerald-600 font-medium">{gameUser?.xp || 0} XP</p>
            <p className="text-sm text-gray-500">UMBC Campus</p>
          </div>
        </div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Choose Avatar</h4>
            <div className="grid grid-cols-6 gap-3">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setShowAvatarPicker(false);
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 ${
                    selectedAvatar === avatar
                      ? 'bg-emerald-200 border-2 border-emerald-500'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        )}
      </SettingSection>

      {/* Rewards Center removed */}

      {/* Achievements Preview */}
      <SettingSection
        icon={Award}
        title="Achievements"
        subtitle="Track your campus impact milestones"
        index={1}
      >
        <div className="mt-6 flex space-x-4 overflow-x-auto">
          {['🎯', '🌱', '♻️', '⭐', '🏆', '🔥'].map((emoji, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl"
            >
              {emoji}
            </div>
          ))}
        </div>
      </SettingSection>

      {/* App Settings */}
      <SettingSection
        icon={Bell}
        title="Notifications"
        subtitle="Manage your notification preferences"
        action={() => {}}
        index={2}
      />

      <SettingSection
        icon={Palette}
        title="Appearance"
        subtitle="Theme and display options"
        action={() => {}}
        index={3}
      />

      <SettingSection
        icon={Shield}
        title="Privacy & Security"
        subtitle="Control your data and privacy"
        action={() => {}}
        index={4}
      />

      <SettingSection
        icon={HelpCircle}
        title="Help & Support"
        subtitle="Get help and contact support"
        action={() => {}}
        index={5}
      />

      {/* Logout section removed in favor of top-right button */}

      {/* App Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>GreenCrew v1.0.0</p>
        <p>Sustainable Campus Solutions</p>
        <p className="mt-2">🌱 Making UMBC Greener, One Scan at a Time</p>
      </div>
    </div>
  );
};

export default SettingsPage;

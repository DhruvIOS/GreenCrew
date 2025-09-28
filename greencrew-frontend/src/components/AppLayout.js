import React from 'react';
import BottomNavigation from './BottomNavigation';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area with bottom padding for navigation */}
      <div className="pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
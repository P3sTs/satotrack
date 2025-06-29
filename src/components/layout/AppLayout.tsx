
import React from 'react';
import MainNavigation from '../navigation/MainNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dashboard-dark">
      <MainNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;


import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
import MobileNavigation from '../mobile/MobileNavigation';
import GlobalErrorBoundary from '../error/GlobalErrorBoundary';
import NavigationAudit from '../navigation/NavigationAudit';
import { Toaster } from '@/components/ui/sonner';

const AppLayout: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-dashboard-dark text-satotrack-text">
        <NavBar />
        
        <main className="pb-20 md:pb-0">
          <Outlet />
        </main>
        
        <MobileNavigation />
        
        {process.env.NODE_ENV === 'development' && <NavigationAudit />}
      </div>
      <Toaster />
    </GlobalErrorBoundary>
  );
};

export default AppLayout;

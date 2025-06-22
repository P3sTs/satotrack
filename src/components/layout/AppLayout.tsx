
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
import MobileNavigation from '../navigation/MobileNavigation';
import GlobalErrorBoundary from '../error/GlobalErrorBoundary';
import NavigationAudit from '../navigation/NavigationAudit';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-dashboard-dark text-satotrack-text">
        <NavBar />
        
        <main className={isMobile ? "pb-20" : "pb-0"}>
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

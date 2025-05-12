
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';
import NavBar from '../NavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '../Footer';
import { useAuth } from '@/contexts/auth';
import { Advertisement } from '../monetization/Advertisement';

const AppLayout = () => {
  const { userPlan } = useAuth();
  const isMobile = useIsMobile();
  const showAds = userPlan === 'free';
  
  return (
    <div className="flex flex-col min-h-screen">
      {isMobile && <NavBar />}
      
      <div className="flex flex-1 relative">
        {!isMobile && <AppSidebar />}
        
        <main className="flex-1 flex flex-col bg-dashboard-dark text-white">
          {!isMobile && <TopBar />}
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
          <Footer />
          {showAds && <Advertisement position="footer" />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

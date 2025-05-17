
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import NavBar from '../NavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from '../Footer';
import { useAuth } from '@/contexts/auth';
import { Advertisement } from '../monetization/Advertisement';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, SidebarRail, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import NewAppSidebar from './NewAppSidebar';

const LoadingFallback = () => (
  <div className="p-4">
    <div className="space-y-4">
      <Skeleton className="h-8 w-full max-w-md" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);

const AppLayout = () => {
  const { userPlan } = useAuth();
  const isMobile = useIsMobile();
  const showAds = userPlan === 'free';
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen w-full">
        {isMobile && <NavBar />}
        
        <div className="flex flex-1 relative w-full">
          {/* Always show sidebar */}
          <NewAppSidebar />
          <SidebarRail />
          
          <SidebarInset className="bg-dashboard-dark text-white">
            {!isMobile && (
              <div className="flex items-center p-2 border-b border-dashboard-medium">
                <SidebarTrigger />
                <TopBar />
              </div>
            )}
            
            <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-dashboard-medium p-4">
              <Suspense fallback={<LoadingFallback />}>
                <Outlet />
              </Suspense>
            </div>
            
            <Footer />
            {showAds && <Advertisement position="footer" />}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

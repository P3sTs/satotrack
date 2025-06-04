
import React, { Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth';
import { Advertisement } from '../monetization/Advertisement';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, SidebarRail, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import NewAppSidebar from './NewAppSidebar';
import MobileNavigation from '../navigation/MobileNavigation';
import ContextualHeader from './ContextualHeader';
import Footer from '../Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-full max-w-md" />
      <Skeleton className="h-4 w-full max-w-lg" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { userPlan } = useAuth();
  const isMobile = useIsMobile();
  const showAds = userPlan === 'free';
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex flex-col min-h-screen w-full bg-dashboard-dark">
        {/* Mobile Navigation - only shown on mobile devices */}
        {isMobile && <MobileNavigation />}
        
        <div className="flex flex-1 relative w-full">
          {/* Desktop sidebar - hidden on mobile */}
          {!isMobile && <NewAppSidebar />}
          <SidebarRail className={isMobile ? "hidden" : "block"} />
          
          <SidebarInset className="bg-dashboard-dark text-white flex flex-col">
            {/* Contextual Header */}
            {!isMobile && (
              <div className="flex items-center border-b border-dashboard-medium/30">
                <div className="p-2">
                  <SidebarTrigger />
                </div>
                <div className="flex-1">
                  <ContextualHeader />
                </div>
              </div>
            )}
            
            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6">
                <Suspense fallback={<LoadingFallback />}>
                  {children}
                </Suspense>
              </div>
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

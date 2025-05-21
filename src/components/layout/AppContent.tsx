
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '../Footer';
import { Advertisement } from '../monetization/Advertisement';

interface AppContentProps {
  showAds?: boolean;
}

/**
 * Loading state placeholder for main content
 */
const ContentLoadingState = () => (
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

/**
 * Main content area component 
 * Contains outlet for route content and footer
 */
const AppContent: React.FC<AppContentProps> = ({ showAds = false }) => {
  return (
    <>
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-dashboard-medium p-2 sm:p-4">
        <Suspense fallback={<ContentLoadingState />}>
          <Outlet />
        </Suspense>
      </div>
      
      <Footer />
      {showAds && <Advertisement position="footer" />}
    </>
  );
};

export default AppContent;

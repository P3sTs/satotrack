
import React from 'react';
import {
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavigation from './sidebar/SidebarNavigation';
import SidebarFooter from './sidebar/SidebarFooter';
import { useAuth } from '@/contexts/auth';

const NewAppSidebar = () => {
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  // Debug to track auth status
  React.useEffect(() => {
    console.log("NewAppSidebar: Authentication status =", isAuthenticated, "User =", !!user);
  }, [isAuthenticated, user]);

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <Sidebar variant="sidebar" className="bg-dashboard-dark border-r border-dashboard-medium">
      <SidebarHeader />
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default NewAppSidebar;

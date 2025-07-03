
import React from 'react';
import { Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNavigation from './sidebar/SidebarNavigation';
import MainNavigation from '../navigation/MainNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full bg-dashboard-dark">
      {/* Sidebar */}
      <Sidebar className="w-64 border-r border-border/50">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
              alt="SatoTrack" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-satotrack-neon">SatoTrack</span>
          </div>
        </div>
        <SidebarContent>
          <SidebarNavigation />
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b border-border/50 px-4">
          <SidebarTrigger className="mr-4" />
          <MainNavigation />
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

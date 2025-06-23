
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';
import MobileNavigation from '../MobileNavigation';
import GlobalErrorBoundary from '../error/GlobalErrorBoundary';
import NavigationAudit from '../navigation/NavigationAudit';
import FloatingSatoAIChat from '../chat/FloatingSatoAIChat';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <GlobalErrorBoundary>
      <div className="min-h-screen bg-dashboard-dark text-satotrack-text">
        {/* NavBar para Desktop */}
        <NavBar />
        
        {/* Mobile Navigation (top header + bottom bar) */}
        <MobileNavigation />
        
        {/* Conteúdo Principal */}
        <main className={`min-h-screen ${isMobile ? "pt-14 pb-16" : "pt-0 pb-0"}`}>
          <Outlet />
        </main>
        
        {/* Chat SatoAI Flutuante */}
        <FloatingSatoAIChat />
        
        {/* Audit de Navegação (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && <NavigationAudit />}
      </div>
      
      {/* Toaster para notificações */}
      <Toaster />
    </GlobalErrorBoundary>
  );
};

export default AppLayout;

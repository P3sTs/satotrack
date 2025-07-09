import React from 'react';
import { useAuth } from '@/contexts/auth';
import AppLayout from './AppLayout';
import PublicLayout from './PublicLayout';

interface AppContentProps {
  children: React.ReactNode;
}

const AppContent: React.FC<AppContentProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🎯 AppContent render:', { isAuthenticated, loading });

  // Show loading state while checking authentication
  if (loading) {
    console.log('⏳ AppContent showing loading state');
    return (
      <div className="min-h-screen bg-dashboard-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-t-satotrack-neon border-x-transparent border-b-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack" 
                className="h-8 w-8 opacity-70"
              />
            </div>
          </div>
          <p className="text-satotrack-text">Carregando SatoTracker...</p>
        </div>
      </div>
    );
  }

  // Use different layouts based on authentication status
  if (isAuthenticated) {
    console.log('🔒 Using AppLayout (authenticated)');
    return <AppLayout>{children}</AppLayout>;
  }

  console.log('🌐 Using PublicLayout (not authenticated)');
  return <PublicLayout>{children}</PublicLayout>;
};

export default AppContent;
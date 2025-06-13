
import React from 'react';
import { AuthProvider } from '@/contexts/auth';
import AlertsManager from '@/components/alerts/AlertsManager';

const Alerts: React.FC = () => {
  return (
    <AuthProvider>
      <div className="container mx-auto p-6">
        <AlertsManager />
      </div>
    </AuthProvider>
  );
};

export default Alerts;

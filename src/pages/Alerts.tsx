
import React from 'react';
import AlertsManager from '@/components/alerts/AlertsManager';

const Alerts = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Alertas Personalizados</h1>
        <p className="text-muted-foreground">
          Configure alertas para ser notificado sobre eventos importantes em suas carteiras e no mercado.
        </p>
      </div>
      
      <AlertsManager />
    </div>
  );
};

export default Alerts;

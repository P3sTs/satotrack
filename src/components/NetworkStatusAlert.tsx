
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface NetworkStatus {
  network: string;
  status: 'online' | 'offline' | 'slow';
  lastCheck: Date;
}

interface NetworkStatusAlertProps {
  networks: string[];
}

const NetworkStatusAlert: React.FC<NetworkStatusAlertProps> = ({ networks }) => {
  const [networkStatuses, setNetworkStatuses] = useState<NetworkStatus[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Simular verificação de status das redes
    const checkNetworkStatus = async () => {
      const statuses = networks.map(network => ({
        network,
        status: Math.random() > 0.1 ? 'online' : 'offline' as 'online' | 'offline',
        lastCheck: new Date()
      }));
      
      setNetworkStatuses(statuses);
      setShowAlert(statuses.some(s => s.status === 'offline'));
    };

    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [networks]);

  const offlineNetworks = networkStatuses.filter(s => s.status === 'offline');

  if (!showAlert || offlineNetworks.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Redes temporariamente indisponíveis:</strong>
        <div className="mt-1">
          {offlineNetworks.map(network => (
            <span key={network.network} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs mr-2 mt-1">
              {network.network.toUpperCase()}
            </span>
          ))}
        </div>
        <p className="text-xs mt-2">
          Você ainda pode adicionar carteiras, mas os dados podem não ser atualizados imediatamente.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatusAlert;

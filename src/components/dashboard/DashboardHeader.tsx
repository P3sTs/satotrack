
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import ViewModeSelector from '../wallet/ViewModeSelector';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import DebugLogger from '../debug/DebugLogger';

interface DashboardHeaderProps {
  onNewWallet?: () => void;
  reachedLimit: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onNewWallet,
  reachedLimit
}) => {
  const { executeWithErrorHandling } = useErrorHandler();

  const handleNewWallet = async () => {
    if (onNewWallet) {
      await executeWithErrorHandling(
        async () => onNewWallet(),
        'Abrindo formulário...'
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
      <DebugLogger 
        data={{ reachedLimit, hasOnNewWallet: !!onNewWallet }}
        label="Dashboard Header"
      />
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitore todas as suas carteiras Bitcoin</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {reachedLimit ? (
          <Link to="/planos">
            <Button variant="neon" className="text-white">
              Fazer Upgrade
            </Button>
          </Link>
        ) : (
          <Link to="/nova-carteira">
            <Button className="bg-bitcoin hover:bg-bitcoin-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Carteira
            </Button>
          </Link>
        )}
        
        <Link to="/carteiras">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Gerenciar</span>
          </Button>
        </Link>
        
        <ViewModeSelector />
      </div>
    </div>
  );
};

export default DashboardHeader;

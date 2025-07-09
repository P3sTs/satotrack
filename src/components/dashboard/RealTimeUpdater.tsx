import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RealTimeUpdaterProps {
  onUpdate: () => Promise<void>;
  interval?: number;
  autoUpdate?: boolean;
  children?: React.ReactNode;
}

export const RealTimeUpdater: React.FC<RealTimeUpdaterProps> = ({
  onUpdate,
  interval = 30000, // 30 seconds default
  autoUpdate = true,
  children
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [nextUpdate, setNextUpdate] = useState<Date>(new Date(Date.now() + interval));

  const handleManualUpdate = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onUpdate();
      setLastUpdate(new Date());
      setNextUpdate(new Date(Date.now() + interval));
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!autoUpdate) return;

    const intervalId = setInterval(async () => {
      if (!isUpdating) {
        setIsUpdating(true);
        try {
          await onUpdate();
          setLastUpdate(new Date());
          setNextUpdate(new Date(Date.now() + interval));
        } catch (error) {
          console.error('Erro na atualização automática:', error);
        } finally {
          setIsUpdating(false);
        }
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [onUpdate, interval, autoUpdate, isUpdating]);

  return (
    <div className="flex items-center gap-4">
      {children}
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Última atualização: {lastUpdate.toLocaleTimeString()}</span>
        {autoUpdate && (
          <span>• Próxima: {nextUpdate.toLocaleTimeString()}</span>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleManualUpdate}
        disabled={isUpdating}
        className="border-dashboard-light text-white"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
        {isUpdating ? 'Atualizando...' : 'Atualizar'}
      </Button>
    </div>
  );
};
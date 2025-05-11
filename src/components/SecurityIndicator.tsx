
import React from 'react';
import { useAuth } from '../contexts/auth';
import { Shield, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export function SecurityIndicator() {
  const { lastActivity, securityStatus, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;

  // Calcula tempo desde última atividade
  const getTimeSinceLastActivity = () => {
    if (!lastActivity) return 'Desconhecido';
    const diffMinutes = Math.floor((Date.now() - lastActivity) / 60000);
    
    if (diffMinutes < 1) return 'Agora';
    if (diffMinutes === 1) return '1 minuto atrás';
    if (diffMinutes < 60) return `${diffMinutes} minutos atrás`;
    
    const hours = Math.floor(diffMinutes / 60);
    if (hours === 1) return '1 hora atrás';
    return `${hours} horas atrás`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center">
          <div className={cn(
            "flex items-center p-1.5 rounded-full",
            securityStatus === 'secure' && "text-green-500 bg-green-500/10",
            securityStatus === 'warning' && "text-yellow-500 bg-yellow-500/10",
            securityStatus === 'danger' && "text-red-500 bg-red-500/10",
          )}>
            {securityStatus === 'secure' && <ShieldCheck className="h-4 w-4" />}
            {securityStatus === 'warning' && <Shield className="h-4 w-4" />}
            {securityStatus === 'danger' && <ShieldAlert className="h-4 w-4" />}
          </div>
          <div className="text-xs text-muted-foreground ml-1.5 hidden sm:flex items-center">
            <Clock className="h-3 w-3 mr-0.5" />
            <span>{getTimeSinceLastActivity()}</span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="text-sm">
          <div className="font-semibold mb-1">
            {securityStatus === 'secure' && 'Conexão segura'}
            {securityStatus === 'warning' && 'Atenção à segurança'}
            {securityStatus === 'danger' && 'Alerta de segurança'}
          </div>
          <div className="text-xs">
            {securityStatus === 'secure' && 'Sua sessão está protegida.'}
            {securityStatus === 'warning' && 'Sua sessão pode expirar em breve.'}
            {securityStatus === 'danger' && 'Detectamos atividade suspeita.'}
          </div>
          <div className="text-xs mt-1">
            Última atividade: {getTimeSinceLastActivity()}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

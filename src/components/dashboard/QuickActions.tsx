import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  TrendingUp, 
  Activity, 
  Send, 
  Download,
  Zap,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react';

interface QuickActionsProps {
  hasGeneratedWallets: boolean;
  onShowSwapModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  hasGeneratedWallets,
  onShowSwapModal
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Nova Carteira',
      icon: PlusCircle,
      color: 'neon',
      onClick: () => navigate('/nova-carteira'),
      description: 'Criar nova carteira cripto'
    },
    {
      label: 'Mercado',
      icon: TrendingUp,
      color: 'emerald',
      onClick: () => navigate('/mercado'),
      description: 'Análise de mercado'
    },
    {
      label: 'Histórico',
      icon: Activity,
      color: 'blue',
      onClick: () => navigate('/historico'),
      description: 'Transações detalhadas'
    },
    {
      label: 'Token Swap',
      icon: Send,
      color: 'purple',
      onClick: onShowSwapModal,
      disabled: !hasGeneratedWallets,
      description: 'Trocar tokens'
    },
    {
      label: 'Performance',
      icon: BarChart3,
      color: 'orange',
      onClick: () => navigate('/performance-analytics'),
      description: 'Analytics detalhada'
    },
    {
      label: 'Configurações',
      icon: Settings,
      color: 'yellow',
      onClick: () => navigate('/configuracoes'),
      description: 'Configurar app'
    },
    {
      label: 'Segurança',
      icon: Shield,
      color: 'neon',
      onClick: () => navigate('/security'),
      description: 'Configurações de segurança'
    },
    {
      label: 'Converter',
      icon: Zap,
      color: 'emerald',
      onClick: () => navigate('/currency-converter'),
      description: 'Conversor de moedas'
    }
  ];

  const colorSchemes = {
    neon: 'border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10',
    emerald: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10',
    blue: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10',
    purple: 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10',
    orange: 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10',
    yellow: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
  };

  return (
    <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-satotrack-neon" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const colorScheme = colorSchemes[action.color as keyof typeof colorSchemes];
            
            return (
              <Button
                key={action.label}
                variant="outline"
                className={`h-20 flex-col gap-2 p-3 ${colorScheme}`}
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.description}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
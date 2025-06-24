
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ArrowUpCircle, 
  FileText, 
  Settings,
  TrendingUp,
  Download,
  Zap,
  Wallet,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const QuickActionsPanel: React.FC = () => {
  const navigate = useNavigate();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  const quickActions = [
    {
      title: 'Nova Carteira Bitcoin',
      description: 'Adicionar carteira Bitcoin',
      icon: Plus,
      onClick: () => navigate('/carteiras'),
      color: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
    },
    {
      title: 'Carteira Web3',
      description: 'Criar carteira cripto (BTC/ETH/MATIC)',
      icon: Zap,
      onClick: () => navigate('/web3'),
      color: 'bg-satotrack-neon/20 text-satotrack-neon hover:bg-satotrack-neon/30',
      highlight: true
    },
    {
      title: 'Mercado',
      description: 'Ver cotações e gráficos',
      icon: TrendingUp,
      onClick: () => navigate('/mercado'),
      color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
    },
    {
      title: 'Histórico',
      description: 'Extrato de transações',
      icon: FileText,
      onClick: () => navigate('/carteiras'),
      color: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
    },
    {
      title: 'Configurações',
      description: 'Ajustar preferências',
      icon: Settings,
      onClick: () => navigate('/configuracoes'),
      color: 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
    },
    {
      title: 'Exportar Dados',
      description: 'Download de relatórios',
      icon: Download,
      onClick: () => console.log('Export functionality'),
      color: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30',
      premium: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpCircle className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => {
            const isDisabled = action.premium && !isPremium;
            
            return (
              <Button
                key={index}
                variant="ghost"
                className={`${action.color} w-full justify-start h-auto p-4 relative ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${action.highlight ? 'ring-2 ring-satotrack-neon/30' : ''}`}
                onClick={isDisabled ? undefined : action.onClick}
                disabled={isDisabled}
              >
                <div className="flex items-center gap-3 w-full">
                  <action.icon className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {action.title}
                      {action.highlight && (
                        <Shield className="h-3 w-3 text-satotrack-neon" />
                      )}
                    </div>
                    <div className="text-xs opacity-70">{action.description}</div>
                    {action.premium && !isPremium && (
                      <div className="text-xs text-yellow-400 mt-1">Premium</div>
                    )}
                  </div>
                </div>
                {action.highlight && (
                  <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 bg-satotrack-neon rounded-full animate-pulse"></div>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;

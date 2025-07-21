import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Shield, Coins, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Earn: React.FC = () => {
  const navigate = useNavigate();

  const stakingOpportunities = [
    {
      id: 1,
      currency: 'ETH',
      name: 'Ethereum 2.0 Staking',
      apy: '4.2%',
      minAmount: '0.1 ETH',
      risk: 'Baixo',
      description: 'Stake ETH e ganhe recompensas na rede Ethereum 2.0',
      icon: '🔵'
    },
    {
      id: 2,
      currency: 'BTC',
      name: 'Bitcoin Lending',
      apy: '6.5%',
      minAmount: '0.001 BTC',
      risk: 'Médio',
      description: 'Empreste Bitcoin e receba juros mensais',
      icon: '🟠'
    },
    {
      id: 3,
      currency: 'USDT',
      name: 'Stablecoin Yield',
      apy: '8.0%',
      minAmount: '100 USDT',
      risk: 'Baixo',
      description: 'Rendimento estável com stablecoins',
      icon: '🟢'
    },
    {
      id: 4,
      currency: 'MATIC',
      name: 'Polygon Staking',
      apy: '12.3%',
      minAmount: '10 MATIC',
      risk: 'Médio',
      description: 'Faça staking na rede Polygon',
      icon: '🟣'
    }
  ];

  const handleStake = (opportunity: any) => {
    toast.info(`Iniciando staking de ${opportunity.currency} - APY ${opportunity.apy}`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Baixo': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Médio': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Alto': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-satotrack-text hover:text-white hover:bg-dashboard-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-satotrack-text">Earn - Ganhe com suas Criptos</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-satotrack-neon mx-auto mb-2" />
              <div className="text-xl font-bold text-satotrack-text">8.2%</div>
              <div className="text-xs text-muted-foreground">APY Médio</div>
            </CardContent>
          </Card>
          <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
            <CardContent className="p-4 text-center">
              <Coins className="h-6 w-6 text-satotrack-neon mx-auto mb-2" />
              <div className="text-xl font-bold text-satotrack-text">12</div>
              <div className="text-xs text-muted-foreground">Moedas Suportadas</div>
            </CardContent>
          </Card>
          <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-satotrack-neon mx-auto mb-2" />
              <div className="text-xl font-bold text-satotrack-text">100%</div>
              <div className="text-xs text-muted-foreground">Seguro</div>
            </CardContent>
          </Card>
          <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
            <CardContent className="p-4 text-center">
              <Lock className="h-6 w-6 text-satotrack-neon mx-auto mb-2" />
              <div className="text-xl font-bold text-satotrack-text">24h</div>
              <div className="text-xs text-muted-foreground">Desbloqueio</div>
            </CardContent>
          </Card>
        </div>

        {/* Staking Opportunities */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-satotrack-text">Oportunidades de Staking</h2>
          
          {stakingOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{opportunity.icon}</div>
                    <div>
                      <h3 className="font-semibold text-satotrack-text">{opportunity.name}</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Min: {opportunity.minAmount}
                        </Badge>
                        <Badge className={`text-xs ${getRiskColor(opportunity.risk)}`}>
                          {opportunity.risk} Risco
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-satotrack-neon mb-2">
                      {opportunity.apy}
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">APY</div>
                    <Button
                      onClick={() => handleStake(opportunity)}
                      className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                      size="sm"
                    >
                      Fazer Staking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-400">Segurança Garantida</h4>
                <p className="text-sm text-blue-300">
                  Todas as operações de staking são protegidas por contratos inteligentes auditados 
                  e seguros multisig. Seus fundos estão sempre seguros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Earn;
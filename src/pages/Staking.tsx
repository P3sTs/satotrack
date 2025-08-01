
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock, TrendingUp, Shield, Info, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStaking } from '@/hooks/useStaking';
import { useWeb3 } from '@/contexts/web3/Web3Context';
import { StakingProtocolCard } from '@/components/staking/StakingProtocolCard';
import { StakingPositionCard } from '@/components/staking/StakingPositionCard';

const Staking: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useWeb3();
  const {
    protocols,
    positions,
    stats,
    isLoading,
    loadProtocols,
    loadPositions,
    executeStaking,
    unstake,
    claimRewards
  } = useStaking();

  useEffect(() => {
    loadProtocols();
    if (isConnected) {
      loadPositions();
    }
  }, [loadProtocols, loadPositions, isConnected]);

  const handleStake = async (protocolId: string, amount: string, walletAddress: string) => {
    try {
      await executeStaking(protocolId, amount, walletAddress);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleUnstake = async (positionId: string, amount: string) => {
    try {
      await unstake(positionId, amount);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleClaimRewards = async (positionId: string) => {
    try {
      await claimRewards(positionId);
    } catch (error) {
      // Error já tratado no hook
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
          <div>
            <h1 className="text-2xl font-bold text-satotrack-text">Staking DeFi</h1>
            <p className="text-sm text-muted-foreground">
              Ganhe rendimentos com seus tokens em protocolos seguros
            </p>
          </div>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <Card className="mb-6 bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Conecte sua Carteira Web3</h4>
                  <p className="text-sm text-yellow-300">
                    Para fazer staking, você precisa conectar sua carteira Web3 primeiro.
                    Vá para o Dashboard e conecte sua carteira.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Cards */}
        {isConnected && positions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardContent className="p-4 text-center">
                <Lock className="h-6 w-6 text-satotrack-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-satotrack-text">
                  {stats.totalStaked.toFixed(4)}
                </div>
                <div className="text-xs text-muted-foreground">Total em Staking</div>
              </CardContent>
            </Card>
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {stats.totalRewards.toFixed(6)}
                </div>
                <div className="text-xs text-muted-foreground">Recompensas Totais</div>
              </CardContent>
            </Card>
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-satotrack-text">
                  {stats.activePositions}
                </div>
                <div className="text-xs text-muted-foreground">Posições Ativas</div>
              </CardContent>
            </Card>
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardContent className="p-4 text-center">
                <Coins className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">
                  {stats.totalValue.toFixed(4)}
                </div>
                <div className="text-xs text-muted-foreground">Valor Total</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Positions */}
        {isConnected && positions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-satotrack-text mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Minhas Posições de Staking ({positions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map((position) => {
                const protocol = position.protocol || protocols.find(p => p.id === position.protocol_id);
                if (!protocol) return null;
                
                return (
                  <StakingPositionCard
                    key={position.id}
                    position={position}
                    protocol={protocol}
                    onUnstake={handleUnstake}
                    onClaimRewards={handleClaimRewards}
                    isLoading={isLoading}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Available Protocols */}
        <div>
          <h2 className="text-xl font-semibold text-satotrack-text mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Protocolos de Staking Disponíveis ({protocols.length})
          </h2>
          
          {protocols.length === 0 ? (
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardContent className="p-8 text-center">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Carregando protocolos de staking...
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocols.map((protocol) => (
                <StakingProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  onStake={handleStake}
                  isLoading={isLoading}
                  userWalletAddress={address}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Staking Seguro e Descentralizado</h4>
                <p className="text-sm text-blue-300 leading-relaxed">
                  Todas as operações de staking são executadas diretamente nos contratos 
                  oficiais dos protocolos. Seus fundos permanecem sempre sob seu controle.
                  Utilizamos a Tatum para facilitar a interação com os contratos inteligentes,
                  garantindo máxima segurança e transparência.
                </p>
                <div className="mt-3 text-xs text-blue-200">
                  ⚡ Transações rápidas • 🔒 Contratos auditados • 💰 Rendimentos competitivos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Staking;

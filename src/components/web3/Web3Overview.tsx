
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Web3Wallet, Web3Transaction } from '@/hooks/useWeb3Wallet';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield,
  Zap,
  DollarSign
} from 'lucide-react';

interface Web3OverviewProps {
  wallets: Web3Wallet[];
  transactions: Web3Transaction[];
}

const Web3Overview: React.FC<Web3OverviewProps> = ({
  wallets,
  transactions
}) => {
  // Calculate portfolio metrics
  const totalWallets = wallets.length;
  const activeNetworks = new Set(wallets.map(w => w.network)).size;
  const totalTransactions = transactions.length;
  const confirmedTransactions = transactions.filter(tx => tx.status === 'confirmed').length;
  
  const totalBalance = wallets.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance || '0');
  }, 0);

  const recentTransactions = transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const networkDistribution = wallets.reduce((acc, wallet) => {
    acc[wallet.network] = (acc[wallet.network] || 0) + parseFloat(wallet.balance || '0');
    return acc;
  }, {} as Record<string, number>);

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'BTC': return 'bg-orange-500';
      case 'ETH': return 'bg-blue-500';
      case 'MATIC': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNetworkName = (network: string) => {
    switch (network) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'MATIC': return 'Polygon';
      default: return network;
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="bg-gradient-to-r from-satotrack-neon/10 to-bitcoin/10 border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-satotrack-neon" />
            Resumo do Portfólio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-satotrack-neon">{totalWallets}</p>
              <p className="text-sm text-muted-foreground">Carteiras</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{activeNetworks}</p>
              <p className="text-sm text-muted-foreground">Redes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{confirmedTransactions}</p>
              <p className="text-sm text-muted-foreground">TX Confirmadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">${totalBalance.toFixed(6)}</p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-satotrack-neon" />
              Distribuição por Rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(networkDistribution).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma carteira criada ainda
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(networkDistribution).map(([network, balance]) => {
                  const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
                  return (
                    <div key={network} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getNetworkColor(network)}`} />
                          <span className="font-medium">{getNetworkName(network)}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {balance.toFixed(6)} {network}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getNetworkColor(network)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">
                        {percentage.toFixed(1)}% do total
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-satotrack-neon" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma transação recente
              </p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <div key={`${tx.network}-${tx.txId}-${index}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${
                        tx.status === 'confirmed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {tx.status === 'confirmed' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {parseFloat(tx.amount).toFixed(4)} {tx.network}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      tx.status === 'confirmed' ? 'border-green-500 text-green-500' : 
                      'border-yellow-500 text-yellow-500'
                    }>
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security & Tips */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Dicas de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-500">Segurança das Chaves</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Faça backup das suas chaves privadas</li>
                <li>• Nunca compartilhe suas chaves privadas</li>
                <li>• Use hardware wallets para grandes valores</li>
                <li>• Verifique sempre os endereços antes de enviar</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-500">Boas Práticas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Teste com pequenos valores primeiro</li>
                <li>• Monitore suas transações regularmente</li>
                <li>• Mantenha-se atualizado sobre segurança</li>
                <li>• Use conexões seguras (HTTPS)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Web3Overview;

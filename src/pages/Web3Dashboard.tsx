
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnectButton from '@/components/web3/WalletConnectButton';
import TransactionSigner from '@/components/web3/TransactionSigner';
import { useAuth } from '@/contexts/auth';
import { Zap, PenTool, Network, Shield } from 'lucide-react';

const Web3Dashboard: React.FC = () => {
  const { userPlan } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-satotrack-text mb-2">
          🌐 Web3 Dashboard
        </h1>
        <p className="text-muted-foreground">
          Conecte carteiras reais e interaja diretamente com a blockchain
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletConnectButton />
          
          <Card className="bg-dashboard-dark border-satotrack-neon/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-satotrack-neon" />
                Recursos Web3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <Zap className="h-8 w-8 text-blue-400 mb-2" />
                  <h4 className="font-medium">Multi-Chain</h4>
                  <p className="text-xs text-muted-foreground">Ethereum, BSC, Polygon</p>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg">
                  <PenTool className="h-8 w-8 text-green-400 mb-2" />
                  <h4 className="font-medium">Assinatura</h4>
                  <p className="text-xs text-muted-foreground">Transações seguras</p>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg">
                  <Network className="h-8 w-8 text-purple-400 mb-2" />
                  <h4 className="font-medium">DeFi</h4>
                  <p className="text-xs text-muted-foreground">Protocolos integrados</p>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg">
                  <Shield className="h-8 w-8 text-orange-400 mb-2" />
                  <h4 className="font-medium">Segurança</h4>
                  <p className="text-xs text-muted-foreground">Verificação em tempo real</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="signer" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signer">Assinador</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="defi">DeFi Tracker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signer" className="space-y-6">
            <TransactionSigner />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Web3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Em breve: Análise avançada de portfólio Web3, histórico de transações e performance de tokens.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="defi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DeFi Protocol Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Em breve: Monitoramento de posições em Uniswap, PancakeSwap, Compound e outros protocolos DeFi.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Web3Dashboard;

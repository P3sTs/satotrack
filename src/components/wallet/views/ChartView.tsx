
import React from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { TransacaoBTC } from '@/types/types';
import WalletAnalytics from '@/components/wallet/WalletAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import TransacoesList from '@/components/TransacoesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import PremiumBanner from '@/components/monetization/PremiumBanner';

interface ChartViewProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId: string;
  transacoes: TransacaoBTC[];
}

const ChartView: React.FC<ChartViewProps> = ({ bitcoinData, walletId, transacoes }) => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Show premium banner for free users */}
      {!isPremium && (
        <PremiumBanner className="mb-2" />
      )}
      
      <WalletAnalytics bitcoinData={bitcoinData} walletId={walletId} />
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transações Recentes</h2>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="received">Recebidas</TabsTrigger>
                <TabsTrigger value="sent">Enviadas</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all">
              <TransacoesList transacoes={transacoes.slice(0, 5)} />
            </TabsContent>
            
            <TabsContent value="received">
              <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'entrada').slice(0, 5)} />
            </TabsContent>
            
            <TabsContent value="sent">
              <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'saida').slice(0, 5)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartView;


import React, { Suspense } from 'react';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { TransacaoBTC } from '@/types/types';
import WalletAnalytics from '@/components/wallet/WalletAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import TransacoesList from '@/components/TransacoesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import PremiumBanner from '@/components/monetization/PremiumBanner';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartViewProps {
  bitcoinData?: BitcoinPriceData | null;
  walletId: string;
  transacoes: TransacaoBTC[];
}

const LoadingTransactions = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

const ChartView: React.FC<ChartViewProps> = ({ bitcoinData, walletId, transacoes }) => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Mostrar banner premium para usuários gratuitos */}
      {!isPremium && (
        <PremiumBanner className="mb-2" />
      )}
      
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <WalletAnalytics bitcoinData={bitcoinData} walletId={walletId} />
      </Suspense>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-semibold">Transações Recentes</h2>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="received">Recebidas</TabsTrigger>
                <TabsTrigger value="sent">Enviadas</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all">
              <Suspense fallback={<LoadingTransactions />}>
                <TransacoesList transacoes={transacoes.slice(0, 5)} />
                {transacoes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma transação encontrada
                  </p>
                )}
              </Suspense>
            </TabsContent>
            
            <TabsContent value="received">
              <Suspense fallback={<LoadingTransactions />}>
                <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'entrada').slice(0, 5)} />
                {transacoes.filter(tx => tx.tipo === 'entrada').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma transação de entrada encontrada
                  </p>
                )}
              </Suspense>
            </TabsContent>
            
            <TabsContent value="sent">
              <Suspense fallback={<LoadingTransactions />}>
                <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'saida').slice(0, 5)} />
                {transacoes.filter(tx => tx.tipo === 'saida').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma transação de saída encontrada
                  </p>
                )}
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartView;

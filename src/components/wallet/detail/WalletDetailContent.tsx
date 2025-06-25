
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletBalanceSummary from '../WalletBalanceSummary';
import WalletAnalytics from '../WalletAnalytics';
import TransactionList from '../../TransacoesList';
import WalletBalanceInsights from '../WalletBalanceInsights';
import WalletAdvancedMetrics from '../WalletAdvancedMetrics';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { TransacaoBTC, CarteiraBTC } from '@/types/types';

interface WalletDetailContentProps {
  carteira: CarteiraBTC;
  bitcoinData?: BitcoinPriceData | null;
  transacoes: TransacaoBTC[];
}

export const WalletDetailContent: React.FC<WalletDetailContentProps> = ({
  carteira,
  bitcoinData,
  transacoes
}) => {
  return (
    <>
      {/* Resumo de Saldo */}
      <WalletBalanceSummary carteira={carteira} bitcoinData={bitcoinData} />
      
      {/* Métricas Avançadas */}
      <WalletAdvancedMetrics wallet={carteira} bitcoinData={bitcoinData} />
      
      {/* Insights de Saldo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletAnalytics bitcoinData={bitcoinData} walletId={carteira.id} />
        </div>
        <div>
          <div className="bitcoin-card p-6">
            <h2 className="text-xl font-semibold mb-4">Insights</h2>
            <WalletBalanceInsights walletId={carteira.id} bitcoinData={bitcoinData} />
          </div>
        </div>
      </div>

      {/* Transações */}
      <Tabs defaultValue="all" className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Transações</h2>
          <TabsList className="bg-muted/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-satotrack-neon/20 data-[state=active]:text-satotrack-neon">
              Todas
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500">
              Recebidas
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500">
              Enviadas
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="bg-dashboard-medium border border-dashboard-light rounded-lg mt-2">
          <TabsContent value="all" className="m-0 py-1">
            <TransactionList transacoes={transacoes} />
          </TabsContent>
          
          <TabsContent value="received" className="m-0 py-1">
            <TransactionList 
              transacoes={transacoes.filter(tx => tx.tipo === 'entrada')} 
            />
          </TabsContent>
          
          <TabsContent value="sent" className="m-0 py-1">
            <TransactionList 
              transacoes={transacoes.filter(tx => tx.tipo === 'saida')} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

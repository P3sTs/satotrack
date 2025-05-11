
import React from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransacoesList from '../TransacoesList';
import { TransacaoBTC } from '@/types/types';

interface WalletTransactionsProps {
  transacoes: TransacaoBTC[];
}

const WalletTransactions: React.FC<WalletTransactionsProps> = ({ transacoes }) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transações</h2>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="received">Recebidas</TabsTrigger>
          <TabsTrigger value="sent">Enviadas</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="mt-0">
        <TransacoesList transacoes={transacoes} />
      </TabsContent>
      
      <TabsContent value="received" className="mt-0">
        <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'entrada')} />
      </TabsContent>
      
      <TabsContent value="sent" className="mt-0">
        <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'saida')} />
      </TabsContent>
    </Tabs>
  );
};

export default WalletTransactions;

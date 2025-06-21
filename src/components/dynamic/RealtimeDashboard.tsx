
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealtimeBitcoinPrice } from './RealtimeBitcoinPrice';
import { RealtimeWalletBalance } from './RealtimeWalletBalance';
import { RealtimeTransactions } from './RealtimeTransactions';
import { useRealtimeBitcoinPrice } from '@/hooks/useRealtimeData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RealtimeDashboardProps {
  walletId?: string;
  bitcoinRefreshInterval?: number;
  walletRefreshInterval?: number;
}

const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({
  walletId,
  bitcoinRefreshInterval = 30000,
  walletRefreshInterval = 60000,
}) => {
  const { 
    data: bitcoinData, 
    isLoading: bitcoinLoading 
  } = useRealtimeBitcoinPrice();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Bitcoin em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent>
            <RealtimeBitcoinPrice 
              refreshInterval={bitcoinRefreshInterval}
              size="lg"
              currency="USD"
            />
          </CardContent>
        </Card>
        
        {walletId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Saldo da Carteira</CardTitle>
            </CardHeader>
            <CardContent>
              <RealtimeWalletBalance 
                walletId={walletId}
                refreshInterval={walletRefreshInterval}
                bitcoinData={bitcoinData}
                size="lg"
              />
            </CardContent>
          </Card>
        )}
      </div>
      
      {walletId && (
        <Tabs defaultValue="realtime">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Atividade da Carteira</h2>
            <TabsList>
              <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="realtime" className="mt-0">
            <RealtimeTransactions 
              walletId={walletId}
              refreshInterval={walletRefreshInterval}
              showHeader={false}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-4">
                  Histórico completo de transações
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RealtimeDashboard;

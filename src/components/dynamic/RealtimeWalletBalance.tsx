
import React, { useEffect } from 'react';
import { useRealtimeData, useValueChange } from '@/hooks/useRealtimeData';
import { DynamicValue } from './DynamicValue';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { useCarteiras } from '@/contexts/carteiras';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface RealtimeWalletBalanceProps {
  walletId: string;
  refreshInterval?: number;
  showRefreshButton?: boolean;
  showFiatValue?: boolean;
  bitcoinData?: BitcoinPriceData | null;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente que exibe o saldo de uma carteira Bitcoin em tempo real
 */
export const RealtimeWalletBalance: React.FC<RealtimeWalletBalanceProps> = ({
  walletId,
  refreshInterval = 60000, // 1 minuto por padrão
  showRefreshButton = true,
  showFiatValue = true,
  bitcoinData,
  size = 'md'
}) => {
  const { atualizarCarteira, isUpdating } = useCarteiras();
  
  // Função para buscar dados da carteira
  const fetchWalletData = async (): Promise<CarteiraBTC> => {
    await atualizarCarteira(walletId);
    
    // A função atualizarCarteira já atualiza o contexto,
    // mas precisamos buscar os dados atualizados do contexto
    const { carteiras } = useCarteiras();
    const wallet = carteiras.find(c => c.id === walletId);
    
    if (!wallet) {
      throw new Error("Carteira não encontrada");
    }
    
    return wallet;
  };
  
  // Buscar carteira no contexto para dados iniciais
  const { carteiras } = useCarteiras();
  const initialWallet = carteiras.find(c => c.id === walletId);
  
  const { 
    data: wallet, 
    previousData: previousWallet,
    isLoading, 
    isRefreshing,
    refresh
  } = useRealtimeData<CarteiraBTC>(
    fetchWalletData,
    initialWallet || null,
    refreshInterval
  );
  
  const balanceChangeState = useValueChange(wallet?.saldo, previousWallet?.saldo);
  
  // Valor em moeda fiduciária
  const usdValue = wallet?.saldo && bitcoinData?.price_usd 
    ? wallet.saldo * bitcoinData.price_usd
    : null;
    
  const brlValue = wallet?.saldo && bitcoinData?.price_brl
    ? wallet.saldo * bitcoinData.price_brl
    : null;
  
  // Forçar refresh quando a prop isUpdating mudar
  useEffect(() => {
    if (!isUpdating[walletId] && isRefreshing) {
      refresh();
    }
  }, [isUpdating[walletId]]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }
  
  return (
    <div className="wallet-balance-container">
      <div className="flex items-start md:items-center gap-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <DynamicValue
              value={wallet?.saldo}
              previousValue={previousWallet?.saldo}
              formatFunc={formatBitcoinValue}
              changeState={balanceChangeState}
              size={size}
              className={size === 'lg' ? "text-xl md:text-2xl font-bold" : ""}
            />
            
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={isRefreshing || isUpdating[walletId]}
                className="ml-2 h-7 w-7 p-0"
              >
                <RefreshCw 
                  className={`h-3 w-3 ${(isRefreshing || isUpdating[walletId]) ? 'animate-spin' : ''}`} 
                />
                <span className="sr-only">Atualizar saldo</span>
              </Button>
            )}
          </div>
          
          {showFiatValue && (
            <div className="flex flex-col sm:flex-row sm:gap-3 text-xs text-muted-foreground mt-1">
              {usdValue !== null && (
                <span>≈ {formatCurrency(usdValue, 'USD')}</span>
              )}
              {brlValue !== null && (
                <span>≈ {formatCurrency(brlValue, 'BRL')}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

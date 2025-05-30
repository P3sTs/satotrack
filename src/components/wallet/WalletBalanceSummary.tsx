
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { formatarBTC, formatDate } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { RealtimeWalletBalance } from '@/components/dynamic/RealtimeWalletBalance';

interface WalletBalanceSummaryProps {
  carteira: CarteiraBTC;
  bitcoinData?: BitcoinPriceData | null;
}

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({ 
  carteira,
  bitcoinData
}) => {
  const valorEmUSD = carteira.saldo * (bitcoinData?.price_usd || 0);
  const valorEmBRL = carteira.saldo * (bitcoinData?.price_brl || 0);

  return (
    <div className="bitcoin-card p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-muted-foreground mb-1">Saldo Total</h2>
          <RealtimeWalletBalance
            walletId={carteira.id}
            showFiatValue={false}
            bitcoinData={bitcoinData}
            size="lg"
            showRefreshButton={true}
          />
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-muted-foreground text-sm">
            <div>
              <span>≈ USD {valorEmUSD.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span>≈ R$ {valorEmBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 md:text-right">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Transações</div>
            <div className="text-xl md:text-2xl font-mono">{carteira.qtde_transacoes}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Recebido</div>
            <div className="text-xl md:text-2xl font-mono text-green-500">{formatarBTC(carteira.total_entradas)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Enviado</div>
            <div className="text-xl md:text-2xl font-mono text-red-500">{formatarBTC(carteira.total_saidas)}</div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mt-4 text-right">
        Atualizado em: {formatDate(carteira.ultimo_update)}
      </div>
    </div>
  );
};

export default WalletBalanceSummary;


import React, { useState } from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { Bitcoin, QrCode, Clock, ArrowDownUp } from 'lucide-react';
import { formatBitcoinValue, formatDate, formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import WalletQRCode from './WalletQRCode';
import WalletTransactionHistory from './WalletTransactionHistory';
import WalletBalanceInsights from './WalletBalanceInsights';

interface WalletDetailCardProps {
  carteira: CarteiraBTC;
  bitcoinData?: BitcoinPriceData | null;
}

const WalletDetailCard: React.FC<WalletDetailCardProps> = ({ 
  carteira, 
  bitcoinData 
}) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  
  // Calculate fiat values
  const fiatValueUSD = carteira.saldo * (bitcoinData?.price_usd || 0);
  const fiatValueBRL = carteira.saldo * (bitcoinData?.price_brl || 0);
  
  // Determine wallet status
  const getWalletStatus = () => {
    if (!carteira.ultimo_update) return 'inativa';
    
    const lastUpdateDate = new Date(carteira.ultimo_update);
    const currentDate = new Date();
    
    // If last update was more than 30 days ago, consider inactive
    if ((currentDate.getTime() - lastUpdateDate.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
      return 'inativa';
    }
    
    // Could add logic for suspicious wallets here
    return 'ativa';
  };
  
  const walletStatus = getWalletStatus();
  
  return (
    <Card className="shadow-md animate-fade-in">
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {/* Balance Section */}
          <AccordionItem value="balance" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-bitcoin" />
                <h3 className="text-lg font-medium">Saldo</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-bitcoin-gradient">
                    {formatBitcoinValue(carteira.saldo)}
                  </p>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-2">
                    <p>≈ {formatCurrency(fiatValueUSD, 'USD')}</p>
                    <p>≈ {formatCurrency(fiatValueBRL, 'BRL')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recebido Total</p>
                    <p className="text-lg font-medium text-green-500">{formatBitcoinValue(carteira.total_entradas)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Enviado Total</p>
                    <p className="text-lg font-medium text-red-500">{formatBitcoinValue(carteira.total_saidas)}</p>
                  </div>
                </div>
                
                {/* Balance Insights with real-time comparison */}
                <WalletBalanceInsights walletId={carteira.id} bitcoinData={bitcoinData} />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Transactions Section */}
          <AccordionItem value="transactions" className="border-t">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5 text-bitcoin" />
                <h3 className="text-lg font-medium">Movimentações</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <WalletTransactionHistory walletId={carteira.id} />
            </AccordionContent>
          </AccordionItem>
          
          {/* Technical Details Section */}
          <AccordionItem value="technical" className="border-t">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-bitcoin" />
                <h3 className="text-lg font-medium">Detalhes Técnicos</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                  <p className="text-sm font-mono break-all bg-muted p-2 rounded">{carteira.endereco}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transações Totais</p>
                    <p>{carteira.qtde_transacoes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        walletStatus === 'ativa' ? 'bg-green-500' : 
                        walletStatus === 'inativa' ? 'bg-gray-400' : 'bg-red-500'
                      }`}></span>
                      <span className="capitalize">{walletStatus}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Última Movimentação</p>
                  <p>{formatDate(carteira.ultimo_update)}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Expandable Details Section */}
        <Collapsible
          open={expandedDetails}
          onOpenChange={setExpandedDetails}
          className="mt-6 space-y-4"
        >
          <div className="flex justify-center">
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                {expandedDetails ? 'Ver Menos' : 'Ver Mais'}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-4">
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code para Depósito
                </h4>
                <WalletQRCode address={carteira.endereco} />
                <p className="text-xs text-muted-foreground mt-2">
                  Escaneie este código para enviar Bitcoin para esta carteira
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default WalletDetailCard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface RealTimeBalanceCardProps {
  title: string;
  value: number;
  fiatValue: number;
  currency: 'BRL' | 'USD';
  icon: LucideIcon;
  trend: 'positive' | 'negative' | 'neutral';
  bitcoinData?: BitcoinPriceData | null;
  isCount?: boolean;
}

const RealTimeBalanceCard: React.FC<RealTimeBalanceCardProps> = ({
  title,
  value,
  fiatValue,
  currency,
  icon: Icon,
  trend,
  bitcoinData,
  isCount = false
}) => {
  const [previousValue, setPreviousValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (value !== previousValue) {
      setIsUpdating(true);
      const timer = setTimeout(() => {
        setPreviousValue(value);
        setIsUpdating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  const getTrendColor = () => {
    switch (trend) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDetailedInfo = () => {
    switch (title) {
      case 'Saldo Total':
        return 'Valor total disponível em todas as suas carteiras Bitcoin';
      case 'Total Recebido':
        return 'Soma de todos os depósitos e recebimentos realizados';
      case 'Total Enviado':
        return 'Soma de todos os saques e envios realizados';
      case 'Carteiras Ativas':
        return 'Número total de carteiras cadastradas no sistema';
      default:
        return 'Informação não disponível';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`cursor-pointer transition-all hover:shadow-lg ${isUpdating ? 'ring-2 ring-bitcoin' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${getTrendColor()}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {title}
                  </span>
                </div>
                
                {isCount ? (
                  <div className="text-2xl font-bold text-white">
                    {value}
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-bitcoin">
                      {formatBitcoinValue(value)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ≈ {formatCurrency(fiatValue, currency)}
                    </div>
                  </>
                )}
              </div>
              
              {isUpdating && (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Atualizando
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">{getDetailedInfo()}</p>
          
          {!isCount && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Valor em Bitcoin</span>
                <p className="text-xl font-bold text-bitcoin">{formatBitcoinValue(value)}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Valor em {currency}</span>
                <p className="text-xl font-bold">{formatCurrency(fiatValue, currency)}</p>
              </div>
            </div>
          )}
          
          {bitcoinData && !isCount && (
            <div className="border-t pt-4">
              <span className="text-sm font-medium">Cotações Atuais</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="text-xs text-muted-foreground">BTC/USD</span>
                  <p className="font-medium">${bitcoinData.price_usd.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">BTC/BRL</span>
                  <p className="font-medium">R$ {bitcoinData.price_brl.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RealTimeBalanceCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { CarteiraBTC } from '../types/types';
import { formatBitcoinValue, formatDate, formatCurrency } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCarteiras } from '../contexts/CarteirasContext';

interface AnimatedWalletCardProps {
  carteira: CarteiraBTC;
  bitcoinPrice?: number;
}

const AnimatedWalletCard: React.FC<AnimatedWalletCardProps> = ({ 
  carteira, 
  bitcoinPrice = 0 
}) => {
  const { atualizarCarteira, isUpdating } = useCarteiras();

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await atualizarCarteira(carteira.id);
  };

  const getNetworkColor = (symbol?: string) => {
    const colors: Record<string, string> = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-blue-500',
      'SOL': 'bg-green-500',
      'LTC': 'bg-gray-500',
      'DOGE': 'bg-yellow-600',
      'BNB': 'bg-yellow-500',
      'MATIC': 'bg-purple-500'
    };
    return colors[symbol || 'BTC'] || 'bg-gray-500';
  };

  const getNetworkIcon = (symbol?: string) => {
    // You can replace these with actual crypto icons
    return symbol || 'BTC';
  };

  const fiatValue = carteira.saldo * bitcoinPrice;
  const hasPositiveChange = (carteira.total_entradas - carteira.total_saidas) > 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getNetworkColor(carteira.network?.symbol)} flex items-center justify-center text-white font-bold text-sm`}>
              {getNetworkIcon(carteira.network?.symbol)}
            </div>
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{carteira.nome}</h3>
              <Badge variant="outline" className="text-xs">
                {carteira.network?.name || 'Bitcoin'}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isUpdating[carteira.id]}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating[carteira.id] ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Saldo</p>
            <p className="text-2xl font-bold">{formatBitcoinValue(carteira.saldo)}</p>
            {bitcoinPrice > 0 && (
              <p className="text-sm text-muted-foreground">
                ≈ {formatCurrency(fiatValue, 'USD')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Recebido</span>
              </div>
              <p className="font-medium">{formatBitcoinValue(carteira.total_entradas)}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-3 w-3" />
                <span>Enviado</span>
              </div>
              <p className="font-medium">{formatBitcoinValue(carteira.total_saidas)}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{carteira.qtde_transacoes} transações</span>
              <span>{formatDate(carteira.ultimo_update)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link to={`/carteira/${carteira.id}`}>
            <Button variant="ghost" className="w-full justify-between hover:bg-muted/50">
              Ver detalhes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimatedWalletCard;

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp } from 'lucide-react';

interface SatoTrackerWalletHeaderProps {
  selectedCurrency: 'USD' | 'BRL' | 'BTC';
  onCurrencyChange: (currency: 'USD' | 'BRL' | 'BTC') => void;
  totalBalance: number;
  walletsCount: number;
}

export const SatoTrackerWalletHeader: React.FC<SatoTrackerWalletHeaderProps> = ({
  selectedCurrency,
  onCurrencyChange,
  totalBalance,
  walletsCount
}) => {
  const formatBalance = (balance: number, currency: string) => {
    switch (currency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(balance * 50000); // Mock conversion rate
      case 'BRL':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(balance * 280000); // Mock conversion rate
      case 'BTC':
        return `${balance.toFixed(8)} BTC`;
      default:
        return `${balance.toFixed(2)}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Carteiras</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus ativos com segurança e estilo via SatoTracker
            </p>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-center">
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-32 bg-dashboard-medium border-dashboard-light">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dashboard-medium border-dashboard-light">
              <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
              <SelectItem value="USD">🇺🇸 USD</SelectItem>
              <SelectItem value="BTC">₿ BTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-dashboard-medium to-dashboard-dark border-satotrack-neon/20 shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-satotrack-neon" />
              <span className="text-sm text-muted-foreground">Saldo Total</span>
            </div>
            
            <div className="text-4xl font-bold text-white mb-2">
              {formatBalance(totalBalance, selectedCurrency)}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                {walletsCount} Carteira{walletsCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
                🔒 SatoTracker KMS
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Sparkles, Loader2, Shield, Zap } from 'lucide-react';

interface EmptyWalletStateProps {
  isGenerating: boolean;
  onGenerateMainWallets: () => void;
}

export const EmptyWalletState: React.FC<EmptyWalletStateProps> = ({
  isGenerating,
  onGenerateMainWallets
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      {/* Hero Card */}
      <Card className="w-full max-w-2xl bg-gradient-to-br from-dashboard-medium via-dashboard-dark to-dashboard-medium border border-satotrack-neon/30 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center shadow-xl">
                <Wallet className="h-10 w-10 text-black" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">
              SatoTracker Wallet
            </h2>
            <p className="text-xl text-muted-foreground">
              Segurança real com liberdade cripto
            </p>
          </div>

          {/* Description */}
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-muted-foreground">
              Comece sua jornada cripto com as principais redes blockchain. 
              Gere carteiras seguras para Bitcoin, Ethereum, Polygon e USDT em segundos.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-4 w-4" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="h-4 w-4" />
                <span>Multi-Chain</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span>KMS Avançado</span>
              </div>
              <div className="flex items-center gap-2 text-satotrack-neon">
                <Wallet className="h-4 w-4" />
                <span>Fácil de Usar</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              onClick={onGenerateMainWallets}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-satotrack-neon to-emerald-400 hover:from-satotrack-neon/90 hover:to-emerald-400/90 text-black font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Gerando carteiras seguras...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Começar agora
                </>
              )}
            </Button>
          </div>

          {/* Networks Preview */}
          <div className="pt-6 border-t border-dashboard-light/20">
            <p className="text-xs text-muted-foreground mb-3">Redes principais incluídas:</p>
            <div className="flex justify-center gap-3">
              {[
                { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'from-orange-500 to-yellow-500' },
                { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'from-blue-500 to-purple-500' },
                { symbol: 'MATIC', name: 'Polygon', icon: '⬟', color: 'from-purple-500 to-pink-500' },
                { symbol: 'USDT', name: 'Tether', icon: '₮', color: 'from-green-500 to-teal-500' }
              ].map((network) => (
                <div key={network.symbol} className="text-center">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${network.color} flex items-center justify-center text-white font-bold mb-1 shadow-md`}>
                    {network.icon}
                  </div>
                  <Badge variant="outline" className="text-xs border-dashboard-light/30">
                    {network.symbol}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="text-center max-w-md">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">
            Apenas dados públicos são armazenados. Chaves privadas protegidas por KMS.
          </span>
        </div>
      </div>
    </div>
  );
};
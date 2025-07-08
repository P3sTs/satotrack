import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowUpDown, 
  ArrowDownUp, 
  Wallet,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface TokenSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Array<{
    id: string;
    name: string;
    currency: string;
    balance: string;
    address: string;
  }>;
}

const TokenSwapModal: React.FC<TokenSwapModalProps> = ({ 
  isOpen, 
  onClose, 
  wallets 
}) => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [swapRate, setSwapRate] = useState<number | null>(null);
  const [estimatedFee, setEstimatedFee] = useState<string>('');

  const supportedTokens = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether USD', icon: '₮' },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬟' }
  ];

  const getTokenIcon = (symbol: string) => {
    const token = supportedTokens.find(t => t.symbol === symbol);
    return token?.icon || '●';
  };

  const getWalletBalance = (currency: string) => {
    const wallet = wallets.find(w => w.currency === currency);
    return wallet ? parseFloat(wallet.balance) : 0;
  };

  const handleSwapTokens = () => {
    const tempFrom = fromToken;
    const tempTo = toToken;
    setFromToken(tempTo);
    setToToken(tempFrom);
    setFromAmount('');
    setToAmount('');
    setSwapRate(null);
  };

  const getSwapQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulated swap rates for demo
      const mockRates: Record<string, Record<string, number>> = {
        'BTC': { 'ETH': 15.2, 'USDT': 42000, 'MATIC': 45000 },
        'ETH': { 'BTC': 0.066, 'USDT': 2800, 'MATIC': 3100 },
        'USDT': { 'BTC': 0.000024, 'ETH': 0.00036, 'MATIC': 1.1 },
        'MATIC': { 'BTC': 0.000022, 'ETH': 0.00032, 'USDT': 0.91 }
      };

      const rate = mockRates[fromToken]?.[toToken] || 1;
      const calculatedAmount = parseFloat(fromAmount) * rate;
      
      setSwapRate(rate);
      setToAmount(calculatedAmount.toFixed(6));
      setEstimatedFee('0.001 ETH');

      toast.success('Cotação atualizada!');
    } catch (error) {
      toast.error('Erro ao obter cotação');
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !swapRate) {
      toast.error('Preencha todos os campos');
      return;
    }

    const fromWallet = wallets.find(w => w.currency === fromToken);
    if (!fromWallet) {
      toast.error('Carteira de origem não encontrada');
      return;
    }

    if (parseFloat(fromAmount) > parseFloat(fromWallet.balance)) {
      toast.error('Saldo insuficiente');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate Tatum swap execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(
        `🚀 Swap executado com sucesso! ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`,
        {
          description: '🚧 Funcionalidade em desenvolvimento com Tatum'
        }
      );
      
      onClose();
    } catch (error) {
      toast.error('Erro ao executar swap');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-satotrack-neon" />
            Token Swap
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* From Token */}
          <div className="space-y-3">
            <Label>De:</Label>
            <Card className="border-dashboard-light/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecionar token" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{token.icon}</span>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="text-lg font-semibold"
                  />
                  {fromToken && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Saldo: {getWalletBalance(fromToken).toFixed(6)} {fromToken}</span>
                      <button 
                        onClick={() => setFromAmount(getWalletBalance(fromToken).toString())}
                        className="text-satotrack-neon hover:underline"
                      >
                        MAX
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapTokens}
              className="w-10 h-10 rounded-full border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-3">
            <Label>Para:</Label>
            <Card className="border-dashboard-light/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecionar token" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{token.icon}</span>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={toAmount}
                    readOnly
                    className="text-lg font-semibold bg-muted/30"
                  />
                  {toToken && (
                    <div className="text-xs text-muted-foreground">
                      Saldo: {getWalletBalance(toToken).toFixed(6)} {toToken}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote Button */}
          <Button
            onClick={getSwapQuote}
            disabled={!fromToken || !toToken || !fromAmount || isLoading}
            className="w-full bg-satotrack-neon/20 text-satotrack-neon border border-satotrack-neon/30 hover:bg-satotrack-neon/30"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Buscando cotação...
              </>
            ) : (
              'Obter Cotação'
            )}
          </Button>

          {/* Swap Details */}
          {swapRate && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Cotação Encontrada</span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span>1 {fromToken} = {swapRate.toFixed(6)} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa estimada:</span>
                    <span>{estimatedFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Você receberá:</span>
                    <span className="font-semibold text-emerald-400">
                      {toAmount} {toToken}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-orange-300">
              <p className="font-medium mb-1">🚧 Funcionalidade em Desenvolvimento</p>
              <p>O swap de tokens está sendo integrado com Tatum. Esta é uma demonstração das funcionalidades que estarão disponíveis.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <Button
              onClick={executeSwap}
              disabled={!swapRate || isLoading}
              className="flex-1 bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Executar Swap
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSwapModal;
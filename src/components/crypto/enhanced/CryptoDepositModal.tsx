import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  Copy, 
  QrCode, 
  CheckCircle2, 
  Shield,
  Info,
  ExternalLink,
  Wallet,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';

interface CryptoDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: MultiChainWallet;
}

export const CryptoDepositModal: React.FC<CryptoDepositModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [copied, setCopied] = useState(false);
  const [expectedAmount, setExpectedAmount] = useState('');

  const getCryptoIcon = (currency: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      MATIC: '⬟',
      USDT: '₮',
      SOL: '◎',
      AVAX: '🔺',
      BSC: '💎'
    };
    return icons[currency as keyof typeof icons] || '●';
  };

  const getCryptoGradient = (currency: string) => {
    const gradients = {
      BTC: 'from-orange-500 to-yellow-500',
      ETH: 'from-blue-500 to-purple-500',
      MATIC: 'from-purple-500 to-pink-500',
      USDT: 'from-green-500 to-teal-500',
      SOL: 'from-purple-600 to-blue-600',
      AVAX: 'from-red-500 to-pink-500',
      BSC: 'from-yellow-500 to-orange-500'
    };
    return gradients[currency as keyof typeof gradients] || 'from-gray-500 to-gray-600';
  };

  const getNetworkInfo = (currency: string) => {
    const networks = {
      BTC: { name: 'Bitcoin', confirmations: '6 confirmações', time: '~60 min' },
      ETH: { name: 'Ethereum', confirmations: '12 confirmações', time: '~3 min' },
      MATIC: { name: 'Polygon', confirmations: '20 confirmações', time: '~30 seg' },
      USDT: { name: 'Ethereum (ERC-20)', confirmations: '12 confirmações', time: '~3 min' },
      SOL: { name: 'Solana', confirmations: '32 confirmações', time: '~1 min' },
      AVAX: { name: 'Avalanche', confirmations: '20 confirmações', time: '~1 min' },
      BSC: { name: 'Binance Smart Chain', confirmations: '15 confirmações', time: '~1 min' }
    };
    return networks[currency as keyof typeof networks] || { name: currency, confirmations: '10 confirmações', time: '~5 min' };
  };

  const getExplorerUrl = (currency: string, address: string) => {
    const explorers = {
      BTC: `https://blockstream.info/address/${address}`,
      ETH: `https://etherscan.io/address/${address}`,
      MATIC: `https://polygonscan.com/address/${address}`,
      USDT: `https://etherscan.io/address/${address}`,
      SOL: `https://explorer.solana.com/address/${address}`,
      AVAX: `https://snowtrace.io/address/${address}`,
      BSC: `https://bscscan.com/address/${address}`
    };
    return explorers[currency as keyof typeof explorers] || '#';
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      toast.success('Endereço copiado para área de transferência!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar endereço');
    }
  };

  const networkInfo = getNetworkInfo(wallet.currency);

  const handleClose = () => {
    setExpectedAmount('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getCryptoGradient(wallet.currency)} flex items-center justify-center text-white text-lg font-bold`}>
              {getCryptoIcon(wallet.currency)}
            </div>
            <div>
              <span className="text-xl">Depositar {wallet.currency}</span>
              <p className="text-sm text-muted-foreground font-normal">
                Rede: {networkInfo.name}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card className="bg-dashboard-dark/50 border-dashboard-light/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-satotrack-neon" />
                  <span className="text-muted-foreground">Saldo atual:</span>
                </div>
                <span className="text-lg font-semibold text-white">
                  {wallet.balance} {wallet.currency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Expected Amount (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="expectedAmount" className="text-sm">
              Valor esperado (opcional)
            </Label>
            <Input
              id="expectedAmount"
              type="number"
              step="any"
              placeholder={`Ex: 0.001 ${wallet.currency}`}
              value={expectedAmount}
              onChange={(e) => setExpectedAmount(e.target.value)}
              className="bg-dashboard-dark/50 border-dashboard-light/30"
            />
            <p className="text-xs text-muted-foreground">
              Informar o valor ajuda a rastrear o depósito
            </p>
          </div>

          {/* QR Code Placeholder */}
          <Card className="bg-dashboard-dark/30 border-2 border-dashed border-satotrack-neon/30">
            <CardContent className="p-8 text-center">
              <QrCode className="h-20 w-20 text-satotrack-neon mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                QR Code será implementado em breve
              </p>
            </CardContent>
          </Card>

          {/* Wallet Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Endereço da carteira {wallet.currency}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs text-muted-foreground hover:text-satotrack-neon"
              >
                <a 
                  href={getExplorerUrl(wallet.currency, wallet.address)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Explorer
                </a>
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={wallet.address}
                readOnly
                className="font-mono text-sm bg-dashboard-dark/50 border-dashboard-light/30 selection:bg-satotrack-neon/20"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyAddress}
                className="flex-shrink-0 border-satotrack-neon/30 hover:bg-satotrack-neon/10"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Network Info */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-300">
                    Informações da rede {networkInfo.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Confirmações:</span>
                      <p className="text-blue-300">{networkInfo.confirmations}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempo médio:</span>
                      <p className="text-blue-300">{networkInfo.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Alert className="border-satotrack-neon/30 bg-satotrack-neon/10">
            <ArrowDown className="h-4 w-4 text-satotrack-neon" />
            <AlertDescription className="text-satotrack-neon">
              <strong>Como depositar {wallet.currency}:</strong>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                <li>Copie o endereço da carteira acima</li>
                <li>Envie {wallet.currency} de sua exchange ou carteira</li>
                <li>Aguarde as confirmações da rede</li>
                <li>O saldo será atualizado automaticamente</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Security Warning */}
          <Alert className="border-orange-500/30 bg-orange-500/10">
            <Shield className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300">
              <strong>Importante:</strong> Envie apenas <strong>{wallet.currency}</strong> para este endereço. 
              Outros tokens ou moedas podem ser perdidos permanentemente.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1 border-dashboard-light/30"
            >
              Fechar
            </Button>
            <Button 
              onClick={handleCopyAddress} 
              className="flex-1 bg-gradient-to-r from-satotrack-neon to-emerald-400 hover:from-satotrack-neon/90 hover:to-emerald-400/90 text-black font-semibold"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Endereço
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Calculator, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { useBiometric } from '@/contexts/BiometricContext';

interface CryptoSenderProps {
  userWallets?: any[];
}

const CryptoSender: React.FC<CryptoSenderProps> = ({ userWallets = [] }) => {
  const { requireAuth } = useBiometric();
  
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [memo, setMemo] = useState('');
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const availableTokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.50' },
    { symbol: 'USDT', name: 'Tether USD', balance: '1,000.00' },
    { symbol: 'USDC', name: 'USD Coin', balance: '500.00' }
  ];

  const handleEstimateFee = async () => {
    if (!fromAddress || !toAddress || !amount) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsEstimating(true);
    try {
      console.log('⛽ Estimando taxa de transação...');
      
      // Simular chamada Tatum API para estimar gas
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockFee = (Math.random() * 0.01 + 0.005).toFixed(6);
      setEstimatedFee(mockFee);
      
      toast.success(`✅ Taxa estimada: ${mockFee} ETH`);
      
    } catch (error) {
      console.error('Error estimating fee:', error);
      toast.error('❌ Erro ao estimar taxa');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSendTransaction = async () => {
    if (!fromAddress || !toAddress || !amount || !estimatedFee) {
      toast.error('Complete todas as informações e estime a taxa primeiro');
      return;
    }

    try {
      // Verificar autenticação biométrica/PIN primeiro
      const authSuccess = await requireAuth();
      if (!authSuccess) {
        toast.error('❌ Autenticação necessária para enviar transação');
        return;
      }

      setIsSending(true);
      console.log('🔐 Iniciando transação via Tatum KMS...');
      
      // Simular envio via Tatum KMS
      // POST /v3/{chain}/transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      toast.success(
        `✅ Transação enviada com sucesso!\nHash: ${mockTxHash.substring(0, 20)}...`,
        { duration: 5000 }
      );
      
      // Reset form
      setToAddress('');
      setAmount('');
      setMemo('');
      setEstimatedFee(null);
      
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('❌ Erro ao enviar transação');
    } finally {
      setIsSending(false);
    }
  };

  const validateAddress = (address: string): boolean => {
    return address.startsWith('0x') && address.length === 42;
  };

  const isFormValid = () => {
    return (
      validateAddress(fromAddress) &&
      validateAddress(toAddress) &&
      parseFloat(amount) > 0 &&
      estimatedFee !== null
    );
  };

  return (
    <div className="space-y-6">
      {/* Send Form */}
      <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="h-5 w-5 text-orange-400" />
            Enviar Criptomoedas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">De (Endereço de Origem)</Label>
              <Select value={fromAddress} onValueChange={setFromAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua carteira" />
                </SelectTrigger>
                <SelectContent>
                  {userWallets.map((wallet, index) => (
                    <SelectItem key={index} value={wallet.address || 'mock'}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {wallet.address ? `${wallet.address.substring(0, 10)}...` : 'Mock Wallet'}
                        </span>
                        <Badge variant="secondary">{wallet.currency || 'ETH'}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="0x742d35cc6632c0532925a3b8da4c0b07f3b5c7e2">
                    Mock Wallet (Demo)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Token/Moeda</Label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center justify-between w-full">
                        <span>{token.name}</span>
                        <Badge variant="outline">
                          {token.balance} {token.symbol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Para (Endereço de Destino)</Label>
            <Input
              id="to"
              placeholder="0x..."
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className={`font-mono ${
                toAddress && !validateAddress(toAddress) 
                  ? 'border-red-500 focus:border-red-500' 
                  : ''
              }`}
            />
            {toAddress && !validateAddress(toAddress) && (
              <p className="text-xs text-red-400">
                Endereço inválido. Use o formato 0x...
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Taxa Estimada</Label>
              <div className="flex gap-2">
                <Input
                  value={estimatedFee ? `${estimatedFee} ETH` : 'Não estimada'}
                  readOnly
                  className="bg-muted/30"
                />
                <Button
                  variant="outline"
                  onClick={handleEstimateFee}
                  disabled={isEstimating || !amount || !toAddress}
                  className="border-orange-500/30 text-orange-400"
                >
                  {isEstimating ? (
                    <Calculator className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Calculator className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Opcional)</Label>
            <Textarea
              id="memo"
              placeholder="Adicione uma descrição ou memo para esta transação"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      {estimatedFee && isFormValid() && (
        <Card className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-orange-400" />
              Resumo da Transação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor a Enviar:</p>
                <p className="text-lg font-bold text-white">
                  {amount} {selectedToken}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Rede:</p>
                <p className="text-lg font-bold text-orange-400">
                  {estimatedFee} ETH
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-dashboard-dark/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Total Estimado:</p>
              <p className="text-xl font-bold text-white">
                {amount} {selectedToken} + {estimatedFee} ETH (taxa)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Send Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSendTransaction}
          disabled={!isFormValid() || isSending}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 text-lg font-semibold"
          size="lg"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Enviando via KMS...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Enviar Transação
            </>
          )}
        </Button>
      </div>

      {/* Security Warning */}
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-red-300">⚠️ Importante:</p>
              <ul className="text-red-200 space-y-1 text-xs">
                <li>• Verifique cuidadosamente o endereço de destino</li>
                <li>• Transações em blockchain são irreversíveis</li>
                <li>• A taxa pode variar conforme a rede</li>
                <li>• Autenticação biométrica será solicitada</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KMS Security */}
      <Card className="bg-emerald-500/10 border-emerald-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-emerald-300">🔐 Segurança KMS:</p>
              <ul className="text-emerald-200 space-y-1 text-xs">
                <li>• Chaves privadas protegidas pelo Tatum KMS</li>
                <li>• Assinatura remota de transações</li>
                <li>• Nunca exposição de dados sensíveis</li>
                <li>• Auditoria completa de operações</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoSender;
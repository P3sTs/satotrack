import React, { useState } from 'react';
import { ArrowRight, X, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SendCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Array<{
    id: string;
    name: string;
    currency: string;
    balance: number;
    network: string;
  }>;
}

export const SendCryptoModal: React.FC<SendCryptoModalProps> = ({
  isOpen,
  onClose,
  wallets
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');

  const selectedWalletData = wallets.find(w => w.id === selectedWallet);
  const amountNumber = parseFloat(amount) || 0;
  const isValidAmount = amountNumber > 0 && selectedWalletData && amountNumber <= selectedWalletData.balance;
  const isValidAddress = recipientAddress.length >= 20; // Basic validation

  const handleSend = async () => {
    if (!isValidAmount || !isValidAddress) {
      toast.error('Verifique os dados inseridos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Tatum API or your wallet service
      console.log('Sending transaction:', {
        wallet: selectedWalletData,
        recipient: recipientAddress,
        amount: amountNumber,
        memo
      });
      
      setStep('success');
      toast.success('Transação enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar transação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    setStep('confirm');
  };

  const resetForm = () => {
    setStep('form');
    setSelectedWallet('');
    setRecipientAddress('');
    setAmount('');
    setMemo('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Enviar Criptomoeda</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            {/* Wallet Selection */}
            <div className="space-y-2">
              <Label>Carteira de Origem</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{wallet.name} ({wallet.currency})</span>
                        <Badge variant="outline">
                          {wallet.balance.toFixed(4)} {wallet.currency}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedWalletData && (
                <p className="text-xs text-muted-foreground">
                  Saldo disponível: {selectedWalletData.balance.toFixed(4)} {selectedWalletData.currency}
                </p>
              )}
            </div>

            {/* Recipient Address */}
            <div className="space-y-2">
              <Label>Endereço de Destino</Label>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Digite o endereço da carteira de destino"
                className="font-mono text-sm"
              />
              {recipientAddress && !isValidAddress && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Endereço inválido
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Valor</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.000001"
                  min="0"
                />
                {selectedWalletData && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-muted-foreground">
                      {selectedWalletData.currency}
                    </span>
                  </div>
                )}
              </div>
              {selectedWalletData && (
                <div className="flex justify-between text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmount((selectedWalletData.balance * 0.25).toString())}
                    className="h-6 px-2"
                  >
                    25%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmount((selectedWalletData.balance * 0.5).toString())}
                    className="h-6 px-2"
                  >
                    50%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmount((selectedWalletData.balance * 0.75).toString())}
                    className="h-6 px-2"
                  >
                    75%
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmount(selectedWalletData.balance.toString())}
                    className="h-6 px-2"
                  >
                    MAX
                  </Button>
                </div>
              )}
            </div>

            {/* Memo (optional) */}
            <div className="space-y-2">
              <Label>Memo (Opcional)</Label>
              <Input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Adicione uma nota para esta transação"
                maxLength={100}
              />
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleConfirm}
              disabled={!isValidAmount || !isValidAddress}
              className="w-full"
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'confirm' && selectedWalletData && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Verifique cuidadosamente os dados da transação. Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">De:</span>
                <span className="font-medium">{selectedWalletData.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Para:</span>
                <span className="font-mono text-sm">
                  {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-6)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-bold">
                  {amountNumber.toFixed(6)} {selectedWalletData.currency}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rede:</span>
                <span>{selectedWalletData.network}</span>
              </div>
              
              {memo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memo:</span>
                  <span className="text-sm">{memo}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('form')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Enviando...' : 'Confirmar Envio'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Transação Enviada!</h3>
              <p className="text-muted-foreground text-sm">
                Sua transação foi enviada para a rede blockchain
              </p>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
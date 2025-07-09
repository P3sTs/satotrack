
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Web3Wallet } from '@/hooks/useWeb3Wallet';
import { 
  Loader2, 
  Send, 
  AlertTriangle, 
  Info,
  Copy,
  QrCode 
} from 'lucide-react';
import { toast } from 'sonner';
const anime = require('animejs');

interface SendTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Web3Wallet;
  onSendTransaction: (
    wallet: Web3Wallet,
    recipient: string,
    amount: string,
    memo?: string
  ) => Promise<void>;
  isLoading: boolean;
}

const SendTransactionModal: React.FC<SendTransactionModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onSendTransaction,
  isLoading
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validação de endereço básica
    if (recipient.length < 26 || recipient.length > 62) {
      toast.error('Endereço inválido');
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(wallet.balance || '0');

    if (amountNum <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    if (amountNum > balanceNum) {
      toast.error('Saldo insuficiente');
      return;
    }

    // Animação de transição
    anime({
      targets: '.send-form',
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 300,
      easing: 'easeInQuad',
      complete: () => setShowConfirmation(true)
    });
  };

  const confirmTransaction = async () => {
    try {
      // Animação de loading
      anime({
        targets: '.confirm-button',
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      });

      await onSendTransaction(wallet, recipient, amount, memo || undefined);
      
      // Animação de sucesso
      anime({
        targets: '.confirmation-modal',
        scale: [1, 1.05, 0.95],
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInBack',
        complete: () => {
          resetForm();
          setShowConfirmation(false);
        }
      });
      
    } catch (error) {
      setShowConfirmation(false);
      console.error('Error sending transaction:', error);
    }
  };

  const resetForm = () => {
    setRecipient('');
    setAmount('');
    setMemo('');
    setShowConfirmation(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const getNetworkFee = (network: string) => {
    switch (network) {
      case 'BTC': return '~0.0001 BTC';
      case 'ETH': return '~0.002 ETH';
      case 'MATIC': return '~0.01 MATIC';
      default: return 'Taxa variável';
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipient(text);
      toast.success('Endereço colado!');
    } catch (error) {
      toast.error('Erro ao colar endereço');
    }
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="confirmation-modal sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Transação
            </DialogTitle>
            <DialogDescription>
              Revise os detalhes antes de enviar. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">De:</span>
                  <span className="font-mono text-sm">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Para:</span>
                  <span className="font-mono text-sm">
                    {recipient.slice(0, 8)}...{recipient.slice(-8)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-bold text-satotrack-neon">
                    {amount} {wallet.network}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa estimada:</span>
                  <span className="text-sm">{getNetworkFee(wallet.network)}</span>
                </div>
                
                {memo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Memo:</span>
                    <span className="text-sm">{memo}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
              <p className="text-sm text-red-400">
                ⚠️ Verifique cuidadosamente o endereço de destino. 
                Transações na blockchain não podem ser revertidas.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmTransaction}
              disabled={isLoading}
              className="confirm-button bg-red-500 hover:bg-red-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar Envio'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-satotrack-neon" />
            Enviar {wallet.network}
          </DialogTitle>
          <DialogDescription>
            Envie {wallet.network} de forma segura para outro endereço
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="send-form space-y-6">
          {/* Wallet Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Saldo: {wallet.balance} {wallet.network}
                  </p>
                </div>
                <Badge>{wallet.network}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Endereço de Destino *</Label>
            <div className="flex gap-2">
              <Input
                id="recipient"
                placeholder={`Endereço ${wallet.network}...`}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isLoading}
                className="font-mono text-sm"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={pasteFromClipboard}
                disabled={isLoading}
                className="px-3"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="px-3"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {wallet.network}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Disponível: {wallet.balance} {wallet.network}</span>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setAmount(wallet.balance)}
                disabled={isLoading}
              >
                Usar máximo
              </Button>
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo/Nota (opcional)</Label>
            <Textarea
              id="memo"
              placeholder="Adicione uma nota para esta transação..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Fee Info */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-500 font-medium">Taxa da rede</p>
                <p className="text-muted-foreground">
                  Taxa estimada: {getNetworkFee(wallet.network)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!recipient || !amount || isLoading}
              className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              Continuar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendTransactionModal;

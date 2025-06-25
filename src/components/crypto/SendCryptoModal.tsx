
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
}

interface SendCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CryptoWallet;
  onSend: (recipient: string, amount: string, memo?: string) => Promise<void>;
}

const SendCryptoModal: React.FC<SendCryptoModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onSend
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!recipient.trim()) {
      newErrors.push('Endereço de destino é obrigatório');
    } else if (recipient.length < 20) {
      newErrors.push('Endereço de destino inválido');
    }

    if (!amount.trim()) {
      newErrors.push('Valor é obrigatório');
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.push('Valor deve ser maior que zero');
    } else if (parseFloat(amount) > parseFloat(wallet.balance || '0')) {
      newErrors.push('Saldo insuficiente');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSend(recipient.trim(), amount.trim(), memo.trim() || undefined);
      toast.success(`${amount} ${wallet.currency} enviado com sucesso!`);
      handleClose();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast.error(`Erro ao enviar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRecipient('');
    setAmount('');
    setMemo('');
    setErrors([]);
    setIsLoading(false);
    onClose();
  };

  const maxAmount = parseFloat(wallet.balance || '0');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar {wallet.currency}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Info */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Carteira:</span>
              <span className="font-medium">{wallet.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Saldo disponível:</span>
              <span className="font-medium">{wallet.balance} {wallet.currency}</span>
            </div>
          </div>

          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Endereço de destino</Label>
            <Input
              id="recipient"
              placeholder={`Cole o endereço ${wallet.currency} aqui`}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setAmount(wallet.balance)}
                disabled={isLoading || maxAmount <= 0}
              >
                Máximo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Máximo: {wallet.balance} {wallet.currency}
            </p>
          </div>

          {/* Memo (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo (opcional)</Label>
            <Input
              id="memo"
              placeholder="Descrição da transação"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-600">
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Warning */}
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-600">
              <strong>Atenção:</strong> Transações em blockchain são irreversíveis. 
              Verifique cuidadosamente o endereço de destino antes de enviar.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !recipient.trim() || !amount.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendCryptoModal;

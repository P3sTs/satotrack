
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { SendModalHeader } from './send/SendModalHeader';
import { SendModalForm } from './send/SendModalForm';
import { SendModalActions } from './send/SendModalActions';

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

  const setMaxAmount = () => {
    setAmount(wallet.balance);
  };

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
          <SendModalHeader wallet={wallet} />
          
          <SendModalForm
            recipient={recipient}
            amount={amount}
            memo={memo}
            wallet={wallet}
            errors={errors}
            isLoading={isLoading}
            onRecipientChange={setRecipient}
            onAmountChange={setAmount}
            onMemoChange={setMemo}
            onSetMaxAmount={setMaxAmount}
          />

          <SendModalActions
            isLoading={isLoading}
            canSend={!!(recipient.trim() && amount.trim())}
            onCancel={handleClose}
            onSend={handleSend}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendCryptoModal;

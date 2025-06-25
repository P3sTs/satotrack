
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
}

interface SendModalFormProps {
  recipient: string;
  amount: string;
  memo: string;
  wallet: CryptoWallet;
  errors: string[];
  isLoading: boolean;
  onRecipientChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onSetMaxAmount: () => void;
}

export const SendModalForm: React.FC<SendModalFormProps> = ({
  recipient,
  amount,
  memo,
  wallet,
  errors,
  isLoading,
  onRecipientChange,
  onAmountChange,
  onMemoChange,
  onSetMaxAmount
}) => {
  const maxAmount = parseFloat(wallet.balance || '0');

  return (
    <>
      {/* Recipient Address */}
      <div className="space-y-2">
        <Label htmlFor="recipient">Endereço de destino</Label>
        <Input
          id="recipient"
          placeholder={`Cole o endereço ${wallet.currency} aqui`}
          value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
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
            onChange={(e) => onAmountChange(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onSetMaxAmount}
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
          onChange={(e) => onMemoChange(e.target.value)}
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
    </>
  );
};

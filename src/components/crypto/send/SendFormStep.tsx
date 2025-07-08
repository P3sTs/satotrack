import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  AlertTriangle, 
  Copy,
  QrCode,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';

interface SendFormStepProps {
  wallet: MultiChainWallet;
  formData: {
    recipient: string;
    amount: string;
    memo: string;
  };
  updateFormData: (updates: any) => void;
  errors: string[];
}

export const SendFormStep: React.FC<SendFormStepProps> = ({
  wallet,
  formData,
  updateFormData,
  errors
}) => {
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    type?: string;
    network?: string;
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Address validation function
  const validateAddress = async (address: string) => {
    if (!address || address.length < 10) {
      setAddressValidation(null);
      return;
    }

    setIsValidatingAddress(true);
    try {
      // Simulate address validation with timeout
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Basic validation patterns
      const validationPatterns = {
        BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
        ETH: /^0x[a-fA-F0-9]{40}$/,
        MATIC: /^0x[a-fA-F0-9]{40}$/,
        USDT: /^0x[a-fA-F0-9]{40}$/,
      };

      const pattern = validationPatterns[wallet.currency as keyof typeof validationPatterns];
      const isValid = pattern ? pattern.test(address) : address.length > 20;

      setAddressValidation({
        isValid,
        type: isValid ? wallet.currency : 'invalid',
        network: wallet.currency
      });
    } catch (error) {
      setAddressValidation({ isValid: false });
    } finally {
      setIsValidatingAddress(false);
    }
  };

  // Debounced address validation
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (formData.recipient && formData.recipient.length > 10) {
      timeoutRef.current = setTimeout(() => {
        validateAddress(formData.recipient);
      }, 500);
    } else {
      setAddressValidation(null);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData.recipient]);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      updateFormData({ recipient: text });
      toast.success('Endereço colado!');
    } catch (error) {
      toast.error('Erro ao colar endereço');
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{wallet.name}</p>
              <p className="text-sm text-muted-foreground">
                Saldo: {wallet.balance} {wallet.currency}
              </p>
            </div>
            <Badge>{wallet.currency}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recipient */}
      <div className="space-y-2">
        <Label htmlFor="recipient">Endereço de Destino *</Label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              id="recipient"
              placeholder={`Endereço ${wallet.currency}...`}
              value={formData.recipient}
              onChange={(e) => updateFormData({ recipient: e.target.value })}
              className="font-mono text-sm pr-10"
              required
            />
            {isValidatingAddress && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
            {addressValidation && !isValidatingAddress && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {addressValidation.isValid ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={pasteFromClipboard}
            className="px-3"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="px-3"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        {addressValidation && !addressValidation.isValid && (
          <p className="text-sm text-red-500">Endereço inválido para {wallet.currency}</p>
        )}
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
            placeholder="0.00000000"
            value={formData.amount}
            onChange={(e) => updateFormData({ amount: e.target.value })}
            required
            className="pr-20"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {wallet.currency}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Disponível: {wallet.balance} {wallet.currency}</span>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => updateFormData({ amount: wallet.balance })}
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
          value={formData.memo}
          onChange={(e) => updateFormData({ memo: e.target.value })}
          rows={3}
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-600">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
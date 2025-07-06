import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Loader2, 
  Send, 
  AlertTriangle, 
  Info,
  Copy,
  QrCode,
  Calculator,
  Clock,
  Zap,
  Shield,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';

interface FeeOption {
  type: 'slow' | 'standard' | 'fast';
  label: string;
  fee: string;
  time: string;
  satPerByte?: number;
}

interface EnhancedSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: MultiChainWallet;
  onSendTransaction: (
    wallet: MultiChainWallet,
    recipient: string,
    amount: string,
    memo?: string,
    feeLevel?: string
  ) => Promise<void>;
  isLoading: boolean;
}

export const EnhancedSendModal: React.FC<EnhancedSendModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onSendTransaction,
  isLoading
}) => {
  const [step, setStep] = useState<'form' | 'fees' | 'confirmation'>('form');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState<'slow' | 'standard' | 'fast'>('standard');
  const [customFee, setCustomFee] = useState('');
  const [useCustomFee, setUseCustomFee] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    type?: string;
    network?: string;
  } | null>(null);

  const feeOptions: Record<string, FeeOption[]> = {
    BTC: [
      { type: 'slow', label: 'Lenta', fee: '0.00001000', time: '~60 min', satPerByte: 1 },
      { type: 'standard', label: 'Padrão', fee: '0.00003000', time: '~30 min', satPerByte: 5 },
      { type: 'fast', label: 'Rápida', fee: '0.00008000', time: '~10 min', satPerByte: 15 }
    ],
    ETH: [
      { type: 'slow', label: 'Lenta', fee: '0.001', time: '~5 min' },
      { type: 'standard', label: 'Padrão', fee: '0.003', time: '~2 min' },
      { type: 'fast', label: 'Rápida', fee: '0.008', time: '~30 seg' }
    ],
    MATIC: [
      { type: 'slow', label: 'Lenta', fee: '0.001', time: '~10 seg' },
      { type: 'standard', label: 'Padrão', fee: '0.005', time: '~5 seg' },
      { type: 'fast', label: 'Rápida', fee: '0.01', time: '~2 seg' }
    ]
  };

  const currentFeeOptions = feeOptions[wallet.currency] || feeOptions.BTC;
  const selectedFee = currentFeeOptions.find(f => f.type === selectedFeeType);

  const validateAddress = async (address: string) => {
    if (!address || address.length < 10) {
      setAddressValidation(null);
      return;
    }

    setIsValidatingAddress(true);
    try {
      // Simulate address validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!recipient) {
      newErrors.push('Endereço de destino é obrigatório');
    } else if (addressValidation && !addressValidation.isValid) {
      newErrors.push('Endereço de destino inválido');
    }

    if (!amount) {
      newErrors.push('Valor é obrigatório');
    } else {
      const amountNum = parseFloat(amount);
      const balanceNum = parseFloat(wallet.balance || '0');
      const feeNum = parseFloat(selectedFee?.fee || '0');

      if (amountNum <= 0) {
        newErrors.push('Valor deve ser maior que zero');
      }

      if (amountNum + feeNum > balanceNum) {
        newErrors.push('Saldo insuficiente (incluindo taxa)');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (step === 'form' && validateForm()) {
      setStep('fees');
    } else if (step === 'fees') {
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'fees') {
      setStep('form');
    } else if (step === 'confirmation') {
      setStep('fees');
    }
  };

  const handleConfirmSend = async () => {
    try {
      await onSendTransaction(
        wallet, 
        recipient, 
        amount, 
        memo || undefined,
        selectedFeeType
      );
      resetForm();
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const resetForm = () => {
    setStep('form');
    setRecipient('');
    setAmount('');
    setMemo('');
    setSelectedFeeType('standard');
    setUseCustomFee(false);
    setCustomFee('');
    setErrors([]);
    setAddressValidation(null);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
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

  const calculateTotal = () => {
    const amountNum = parseFloat(amount || '0');
    const feeNum = parseFloat(useCustomFee ? customFee : selectedFee?.fee || '0');
    return (amountNum + feeNum).toFixed(8);
  };

  const formatCurrency = (value: string) => {
    return `${value} ${wallet.currency}`;
  };

  useEffect(() => {
    if (recipient) {
      validateAddress(recipient);
    }
  }, [recipient]);

  const renderFormStep = () => (
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
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
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

  const renderFeesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Selecione a Taxa de Rede</h3>
        
        <div className="grid gap-3">
          {currentFeeOptions.map((fee) => (
            <Card 
              key={fee.type}
              className={`cursor-pointer border-2 transition-colors ${
                selectedFeeType === fee.type 
                  ? 'border-satotrack-neon bg-satotrack-neon/5' 
                  : 'border-transparent hover:border-muted'
              }`}
              onClick={() => setSelectedFeeType(fee.type)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      {fee.type === 'slow' && <Clock className="h-4 w-4" />}
                      {fee.type === 'standard' && <Calculator className="h-4 w-4" />}
                      {fee.type === 'fast' && <Zap className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{fee.label}</p>
                      <p className="text-sm text-muted-foreground">{fee.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">{formatCurrency(fee.fee)}</p>
                    {fee.satPerByte && (
                      <p className="text-xs text-muted-foreground">{fee.satPerByte} sat/byte</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Fee Option */}
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomFee}
              onChange={(e) => setUseCustomFee(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Usar taxa personalizada</span>
          </label>
          
          {useCustomFee && (
            <div className="mt-2">
              <Input
                type="number"
                step="any"
                placeholder="Taxa customizada..."
                value={customFee}
                onChange={(e) => setCustomFee(e.target.value)}
                className="font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {/* Fee Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Resumo da Taxa</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Valor a enviar:</span>
              <span className="font-mono">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de rede:</span>
              <span className="font-mono">
                {formatCurrency(useCustomFee ? customFee : selectedFee?.fee || '0')}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="font-mono">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <Alert className="border-orange-500/30 bg-orange-500/10">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-orange-600">
          <strong>Confirmar Transação</strong><br />
          Revise todos os detalhes antes de enviar. Esta ação não pode ser desfeita.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-satotrack-neon mb-2">
              {formatCurrency(amount)}
            </div>
            <p className="text-muted-foreground">será enviado para</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">De:</span>
              <span className="font-mono text-sm">
                {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Para:</span>
              <span className="font-mono text-sm">
                {recipient.slice(0, 8)}...{recipient.slice(-8)}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Valor:</span>
              <span className="font-bold">{formatCurrency(amount)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Taxa:</span>
              <span>{formatCurrency(useCustomFee ? customFee : selectedFee?.fee || '0')}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Velocidade:</span>
              <span>{selectedFee?.label} ({selectedFee?.time})</span>
            </div>
            
            {memo && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Memo:</span>
                <span className="text-sm">{memo}</span>
              </div>
            )}

            <Separator />
            
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total:</span>
              <span className="text-satotrack-neon">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-satotrack-neon/10 border border-satotrack-neon/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-satotrack-neon" />
          <span className="text-sm font-medium text-satotrack-neon">Assinatura Segura</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Esta transação será assinada com segurança usando SatoTracker KMS.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-satotrack-neon" />
            Enviar {wallet.currency}
            {step === 'fees' && ' - Taxas'}
            {step === 'confirmation' && ' - Confirmação'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form' && `Envie ${wallet.currency} de forma segura`}
            {step === 'fees' && 'Escolha a velocidade da sua transação'}
            {step === 'confirmation' && 'Confirme os detalhes da transação'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'form' && renderFormStep()}
          {step === 'fees' && renderFeesStep()}
          {step === 'confirmation' && renderConfirmationStep()}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {step !== 'form' && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Voltar
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            
            {step !== 'confirmation' ? (
              <Button
                onClick={handleNext}
                disabled={!validateForm() || isLoading}
                className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
              >
                Continuar
              </Button>
            ) : (
              <Button
                onClick={handleConfirmSend}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Confirmar Envio
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
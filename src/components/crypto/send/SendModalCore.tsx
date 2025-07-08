import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';
import { SendFormStep } from './SendFormStep';
import { SendFeesStep } from './SendFeesStep';
import { SendConfirmationStep } from './SendConfirmationStep';

interface SendModalCoreProps {
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

type Step = 'form' | 'fees' | 'confirmation';

export const SendModalCore: React.FC<SendModalCoreProps> = ({
  isOpen,
  onClose,
  wallet,
  onSendTransaction,
  isLoading
}) => {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    memo: '',
    selectedFeeType: 'standard' as 'slow' | 'standard' | 'fast',
    useCustomFee: false,
    customFee: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const feeOptions = useMemo(() => ({
    BTC: [
      { type: 'slow' as const, label: 'Lenta', fee: '0.00001000', time: '~60 min', satPerByte: 1 },
      { type: 'standard' as const, label: 'Padrão', fee: '0.00003000', time: '~30 min', satPerByte: 5 },
      { type: 'fast' as const, label: 'Rápida', fee: '0.00008000', time: '~10 min', satPerByte: 15 }
    ],
    ETH: [
      { type: 'slow' as const, label: 'Lenta', fee: '0.001', time: '~5 min' },
      { type: 'standard' as const, label: 'Padrão', fee: '0.003', time: '~2 min' },
      { type: 'fast' as const, label: 'Rápida', fee: '0.008', time: '~30 seg' }
    ],
    MATIC: [
      { type: 'slow' as const, label: 'Lenta', fee: '0.001', time: '~10 seg' },
      { type: 'standard' as const, label: 'Padrão', fee: '0.005', time: '~5 seg' },
      { type: 'fast' as const, label: 'Rápida', fee: '0.01', time: '~2 seg' }
    ]
  }), []);

  const currentFeeOptions = feeOptions[wallet.currency as keyof typeof feeOptions] || feeOptions.BTC;
  const selectedFee = currentFeeOptions.find(f => f.type === formData.selectedFeeType);

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Validate form when data changes
  useEffect(() => {
    const newErrors: string[] = [];

    if (!formData.recipient) {
      newErrors.push('Endereço de destino é obrigatório');
    }

    if (!formData.amount) {
      newErrors.push('Valor é obrigatório');
    } else {
      const amountNum = parseFloat(formData.amount);
      const balanceNum = parseFloat(wallet.balance || '0');
      const feeNum = parseFloat(selectedFee?.fee || '0');

      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.push('Valor deve ser maior que zero');
      }

      if (amountNum + feeNum > balanceNum) {
        newErrors.push('Saldo insuficiente (incluindo taxa)');
      }
    }

    setErrors(newErrors);
    setIsFormValid(newErrors.length === 0);
  }, [formData.recipient, formData.amount, wallet.balance, selectedFee?.fee]);

  const handleNext = useCallback(() => {
    if (step === 'form' && isFormValid) {
      setStep('fees');
    } else if (step === 'fees') {
      setStep('confirmation');
    }
  }, [step, isFormValid]);

  const handleBack = useCallback(() => {
    if (step === 'fees') {
      setStep('form');
    } else if (step === 'confirmation') {
      setStep('fees');
    }
  }, [step]);

  const handleConfirmSend = useCallback(async () => {
    try {
      await onSendTransaction(
        wallet, 
        formData.recipient, 
        formData.amount, 
        formData.memo || undefined,
        formData.selectedFeeType
      );
      handleClose();
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  }, [wallet, formData, onSendTransaction]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setStep('form');
      setFormData({
        recipient: '',
        amount: '',
        memo: '',
        selectedFeeType: 'standard',
        useCustomFee: false,
        customFee: ''
      });
      setErrors([]);
      onClose();
    }
  }, [isLoading, onClose]);

  const calculateTotal = useCallback(() => {
    const amountNum = parseFloat(formData.amount || '0');
    const feeNum = parseFloat(formData.useCustomFee ? formData.customFee : selectedFee?.fee || '0');
    return (amountNum + feeNum).toFixed(8);
  }, [formData.amount, formData.useCustomFee, formData.customFee, selectedFee?.fee]);

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
          {step === 'form' && (
            <SendFormStep
              wallet={wallet}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          
          {step === 'fees' && (
            <SendFeesStep
              wallet={wallet}
              formData={formData}
              updateFormData={updateFormData}
              currentFeeOptions={currentFeeOptions}
              selectedFee={selectedFee}
              calculateTotal={calculateTotal}
            />
          )}
          
          {step === 'confirmation' && (
            <SendConfirmationStep
              wallet={wallet}
              formData={formData}
              selectedFee={selectedFee}
              calculateTotal={calculateTotal}
            />
          )}
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
                disabled={step === 'form' ? !isFormValid : false}
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
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { 
  Shield, 
  Lock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { usePinAuth } from '@/hooks/usePinAuth';
import { toast } from 'sonner';

interface PinSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPinSetup: () => void;
  title?: string;
  description?: string;
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({
  isOpen,
  onClose,
  onPinSetup,
  title = 'Configurar PIN de Segurança',
  description = 'Crie um PIN de 6 dígitos para proteger suas carteiras.'
}) => {
  const { setupPin } = usePinAuth();
  
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstPinComplete = (pin: string) => {
    if (pin.length === 6) {
      setFirstPin(pin);
      setStep('confirm');
    }
  };

  const handleConfirmPinComplete = async (pin: string) => {
    if (pin.length === 6) {
      setConfirmPin(pin);
      
      if (pin === firstPin) {
        setIsLoading(true);
        try {
          const success = await setupPin(pin);
          if (success) {
            onPinSetup();
            onClose();
            toast.success('🔢 PIN configurado com sucesso!');
            resetModal();
          } else {
            toast.error('❌ Erro ao configurar PIN');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error('❌ PINs não coincidem. Tente novamente.');
        setStep('setup');
        setFirstPin('');
        setConfirmPin('');
      }
    }
  };

  const resetModal = () => {
    setStep('setup');
    setFirstPin('');
    setConfirmPin('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5 text-satotrack-neon" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card className="bg-satotrack-neon/10 border-satotrack-neon/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-satotrack-neon mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-satotrack-neon">
                    {step === 'setup' ? 'Criar PIN' : 'Confirmar PIN'}
                  </p>
                  <p className="text-sm text-satotrack-neon/80">
                    {step === 'setup' 
                      ? description
                      : 'Digite novamente o PIN para confirmar'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PIN Input */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {step === 'setup' ? 'Digite 6 números' : 'Confirme seu PIN'}
              </p>
              
              <InputOTP
                maxLength={6}
                value={step === 'setup' ? firstPin : confirmPin}
                onChange={step === 'setup' ? setFirstPin : setConfirmPin}
                onComplete={step === 'setup' ? handleFirstPinComplete : handleConfirmPinComplete}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {step === 'confirm' && firstPin && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  PIN criado
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {step === 'confirm' && (
              <Button
                variant="outline"
                onClick={() => {
                  setStep('setup');
                  setFirstPin('');
                  setConfirmPin('');
                }}
                className="w-full text-muted-foreground"
                disabled={isLoading}
              >
                ← Voltar
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full text-muted-foreground"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>

          {/* Security Notice */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-200">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>• Memorize bem seu PIN</p>
                  <p>• Não compartilhe com ninguém</p>
                  <p>• Será solicitado apenas uma vez por sessão</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinSetupModal;
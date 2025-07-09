import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { 
  Shield, 
  Lock,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { usePinAuth } from '@/hooks/usePinAuth';
import { useBiometric } from '@/contexts/BiometricContext';
import { toast } from 'sonner';

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  showBiometricOption?: boolean;
}

const PinVerificationModal: React.FC<PinVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Digite seu PIN',
  description = 'Digite o PIN de 6 dígitos para acessar suas carteiras.',
  showBiometricOption = true
}) => {
  const { verifyPin } = usePinAuth();
  const { isBiometricAvailable, authenticateWithBiometric } = useBiometric();
  
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handlePinComplete = async (enteredPin: string) => {
    if (enteredPin.length === 6) {
      setIsVerifying(true);
      try {
        const isValid = await verifyPin(enteredPin);
        
        if (isValid) {
          onSuccess();
          onClose();
          resetModal();
          toast.success('🔓 Acesso liberado!');
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          
          if (newAttempts >= 3) {
            toast.error('❌ Muitas tentativas incorretas. Tente novamente mais tarde.');
            onClose();
          } else {
            toast.error(`❌ PIN incorreto. Tentativas restantes: ${3 - newAttempts}`);
          }
          setPin('');
        }
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateWithBiometric();
      if (success) {
        onSuccess();
        onClose();
        resetModal();
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
    }
  };

  const resetModal = () => {
    setPin('');
    setAttempts(0);
    setIsVerifying(false);
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
                    Acesso Protegido
                  </p>
                  <p className="text-sm text-satotrack-neon/80">
                    {description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PIN Input */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Digite seu PIN de 6 dígitos
              </p>
              
              <InputOTP
                maxLength={6}
                value={pin}
                onChange={setPin}
                onComplete={handlePinComplete}
                disabled={isVerifying}
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

              {attempts > 0 && (
                <p className="text-sm text-orange-400 mt-2">
                  Tentativas restantes: {3 - attempts}
                </p>
              )}
            </div>
          </div>

          {/* Alternative Auth Options */}
          {showBiometricOption && isBiometricAvailable && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleBiometricAuth}
                className="w-full border-satotrack-neon/30 text-satotrack-neon"
                disabled={isVerifying}
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                Usar Biometria
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full text-muted-foreground"
              disabled={isVerifying}
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
                  <p className="font-medium mb-1">Segurança:</p>
                  <p>• Após 3 tentativas incorretas, o acesso será bloqueado</p>
                  <p>• Suas chaves privadas estão protegidas pelo Tatum KMS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinVerificationModal;
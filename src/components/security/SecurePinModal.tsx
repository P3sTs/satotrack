import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onPinVerified: (pin: string) => Promise<boolean>;
  title?: string;
  description?: string;
  maxAttempts?: number;
}

export const SecurePinModal: React.FC<SecurePinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onPinVerified,
  title = "Verificação de Segurança",
  description = "Digite seu PIN de 6 dígitos para continuar",
  maxAttempts = 5
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handlePinChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setPin(numericValue);
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      toast({
        title: "PIN Inválido",
        description: "O PIN deve ter exatamente 6 dígitos",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const isValid = await onPinVerified(pin);
      
      if (isValid) {
        setPin('');
        setAttempts(0);
        onSuccess();
        toast({
          title: "Verificação Bem-sucedida",
          description: "PIN verificado com sucesso",
          variant: "default"
        });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin('');
        
        if (newAttempts >= maxAttempts) {
          toast({
            title: "Conta Bloqueada",
            description: "Muitas tentativas incorretas. Tente novamente em 30 minutos.",
            variant: "destructive"
          });
          onClose();
        } else {
          toast({
            title: "PIN Incorreto",
            description: `Tentativa ${newAttempts} de ${maxAttempts}. Tente novamente.`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro de Verificação",
        description: "Ocorreu um erro durante a verificação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 6) {
      handleSubmit();
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setAttempts(0);
      setShowPin(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">{description}</p>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">PIN de Segurança</label>
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                autoFocus
                disabled={isVerifying}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {attempts > 0 && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <Lock className="w-4 h-4" />
                <span>
                  Tentativas restantes: {maxAttempts - attempts}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isVerifying}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={pin.length !== 6 || isVerifying}
            >
              {isVerifying ? "Verificando..." : "Confirmar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
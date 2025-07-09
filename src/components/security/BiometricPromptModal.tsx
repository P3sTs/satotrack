import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Fingerprint, 
  Shield, 
  Eye, 
  Lock,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { useBiometric } from '@/contexts/BiometricContext';
import { Preferences } from '@capacitor/preferences';
import { toast } from 'sonner';

interface BiometricPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
  dataType?: string;
  title?: string;
  description?: string;
}

const BiometricPromptModal: React.FC<BiometricPromptModalProps> = ({
  isOpen,
  onClose,
  onActivate,
  dataType = 'dados sensíveis',
  title = 'Ativar Proteção Biométrica',
  description = 'Para maior segurança, recomendamos ativar a biometria antes de visualizar dados sensíveis.'
}) => {
  const {
    isBiometricAvailable,
    enableBiometric
  } = useBiometric();
  
  const [isActivating, setIsActivating] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const handleActivateBiometric = async () => {
    setIsActivating(true);
    try {
      const success = await enableBiometric();
      if (success) {
        onActivate();
        onClose();
        toast.success('🔐 Biometria ativada! Seus dados estão protegidos.');
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleSkipAndContinue = async () => {
    // Salvar que o usuário escolheu pular por enquanto
    await Preferences.set({ 
      key: 'biometric_prompt_skipped', 
      value: Date.now().toString() 
    });
    onClose();
  };

  const handleDontShowAgain = async () => {
    await Preferences.set({ 
      key: 'biometric_prompt_disabled', 
      value: 'true' 
    });
    onClose();
    toast.info('Prompt de biometria desativado. Você pode reativar nas configurações.');
  };

  if (!isBiometricAvailable) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Biometria Indisponível
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-orange-200">
                  A biometria não está disponível neste dispositivo. Seus dados ainda estão protegidos pelo Tatum KMS.
                </p>
              </CardContent>
            </Card>
            
            <Button onClick={onClose} className="w-full">
              Continuar Sem Biometria
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Fingerprint className="h-5 w-5 text-satotrack-neon" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Alert */}
          <Card className="bg-satotrack-neon/10 border-satotrack-neon/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-satotrack-neon mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-satotrack-neon">
                    Proteja seus {dataType}
                  </p>
                  <p className="text-sm text-satotrack-neon/80">
                    {description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Toggle */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBenefits(!showBenefits)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showBenefits ? '🔽' : '▶️'} Por que ativar a biometria?
            </Button>

            {showBenefits && (
              <Card className="bg-dashboard-dark/30 border-dashboard-light/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-200">Acesso rápido e seguro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-200">Proteção contra acesso não autorizado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-200">Dados sempre criptografados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-200">Chaves privadas no Tatum KMS</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleActivateBiometric}
              disabled={isActivating}
              className="w-full bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
            >
              {isActivating ? (
                <>
                  <Fingerprint className="h-4 w-4 mr-2 animate-pulse" />
                  Ativando...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Ativar Biometria Agora
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleSkipAndContinue}
                className="text-xs border-muted text-muted-foreground"
              >
                <Eye className="h-3 w-3 mr-1" />
                Pular por Agora
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleDontShowAgain}
                className="text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Não Mostrar Mais
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-200">
                  <p className="font-medium mb-1">Seus dados estão sempre seguros:</p>
                  <p>• Chaves privadas nunca ficam no dispositivo</p>
                  <p>• Transações assinadas remotamente pelo KMS</p>
                  <p>• Biometria protege apenas o acesso local</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricPromptModal;
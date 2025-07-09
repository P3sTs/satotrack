import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Fingerprint, 
  Lock, 
  Shield, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useBiometric } from '@/contexts/BiometricContext';
import { toast } from 'sonner';

interface SecureWalletAccessProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const SecureWalletAccess: React.FC<SecureWalletAccessProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const {
    isBiometricEnabled,
    isAuthenticated,
    authenticateWithBiometric,
    requireBiometricAuth
  } = useBiometric();
  
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [isAuthenticated, isBiometricEnabled]);

  const checkAccess = async () => {
    if (!requireAuth) {
      setShowContent(true);
      return;
    }

    if (isBiometricEnabled && !isAuthenticated) {
      setShowContent(false);
    } else {
      setShowContent(true);
    }
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const success = await requireBiometricAuth();
      if (success) {
        setShowContent(true);
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  if (!requireAuth || showContent) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {/* Unlock Screen */}
      <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
        <CardContent className="p-8 text-center space-y-6">
          {/* Security Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="h-10 w-10 text-black" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Acesso Protegido</h3>
            <p className="text-muted-foreground">
              Suas carteiras estão protegidas por biometria
            </p>
          </div>

          {/* Security Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Proteção KMS Ativa</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Fingerprint className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Biometria Configurada</span>
            </div>
          </div>

          {/* Unlock Button */}
          <Button
            onClick={handleUnlock}
            disabled={isUnlocking}
            className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold px-8 py-3"
          >
            {isUnlocking ? (
              <>
                <Lock className="h-5 w-5 mr-2 animate-pulse" />
                Autenticando...
              </>
            ) : (
              <>
                <Fingerprint className="h-5 w-5 mr-2" />
                Desbloquear com Biometria
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>🔐 Suas chaves privadas nunca ficam no dispositivo</p>
            <p>⚡ Transações assinadas pelo Tatum KMS</p>
            <p>🛡️ Máxima segurança para seus ativos</p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Access */}
      <Card className="bg-orange-500/10 border-orange-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-orange-300">Problema com a biometria?</p>
              <p className="text-orange-200 text-xs">
                Você pode desativar a proteção biométrica nas configurações de segurança.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureWalletAccess;
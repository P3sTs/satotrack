import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Fingerprint, 
  Shield, 
  Lock, 
  Unlock,
  CheckCircle,
  AlertTriangle,
  Info,
  Hash
} from 'lucide-react';
import { useBiometric } from '@/contexts/BiometricContext';
import PinSetupModal from './PinSetupModal';
import PinVerificationModal from './PinVerificationModal';
import { toast } from 'sonner';

const BiometricSetup: React.FC = () => {
  const {
    isBiometricAvailable,
    isBiometricEnabled,
    isPinEnabled,
    isAuthenticated,
    enableBiometric,
    disableBiometric,
    setupPin,
    removePin,
    authenticateWithBiometric,
    authenticateWithPin,
    hasAnySecurityMethod
  } = useBiometric();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);

  const handleToggleBiometric = async () => {
    setIsLoading(true);
    try {
      if (isBiometricEnabled) {
        await disableBiometric();
      } else {
        await enableBiometric();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAuthentication = async () => {
    setIsLoading(true);
    try {
      await authenticateWithBiometric();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePin = async () => {
    if (isPinEnabled) {
      await removePin();
    } else {
      setShowPinSetup(true);
    }
  };

  const handlePinSetup = () => {
    setShowPinSetup(false);
  };

  const handleTestPin = () => {
    setShowPinVerification(true);
  };

  const handlePinVerificationSuccess = () => {
    setShowPinVerification(false);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-satotrack-neon" />
            Configurações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Availability Status */}
          <div className="flex items-center justify-between p-3 bg-dashboard-dark/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${isBiometricAvailable ? 'bg-emerald-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                {isBiometricAvailable ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">Disponibilidade</p>
                <p className="text-xs text-muted-foreground">
                  {isBiometricAvailable ? 'Biometria detectada' : 'Biometria indisponível'}
                </p>
              </div>
            </div>
            <Badge variant={isBiometricAvailable ? 'default' : 'destructive'} className="text-xs">
              {isBiometricAvailable ? 'Disponível' : 'Indisponível'}
            </Badge>
          </div>

          {/* Enable/Disable Toggle */}
          {isBiometricAvailable && (
            <div className="flex items-center justify-between p-3 bg-dashboard-dark/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${isBiometricEnabled ? 'bg-satotrack-neon/20' : 'bg-gray-500/20'} flex items-center justify-center`}>
                  {isBiometricEnabled ? (
                    <Lock className="h-5 w-5 text-satotrack-neon" />
                  ) : (
                    <Unlock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">Proteção Biométrica</p>
                  <p className="text-xs text-muted-foreground">
                    {isBiometricEnabled ? 'Ativada' : 'Desativada'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isBiometricEnabled}
                onCheckedChange={handleToggleBiometric}
                disabled={isLoading || !isBiometricAvailable}
              />
            </div>
          )}

          {/* Authentication Status */}
          {isBiometricEnabled && (
            <div className="flex items-center justify-between p-3 bg-dashboard-dark/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${isAuthenticated ? 'bg-emerald-500/20' : 'bg-orange-500/20'} flex items-center justify-center`}>
                  <Shield className={`h-5 w-5 ${isAuthenticated ? 'text-emerald-400' : 'text-orange-400'}`} />
                </div>
                <div>
                  <p className="font-medium text-white">Status de Acesso</p>
                  <p className="text-xs text-muted-foreground">
                    {isAuthenticated ? 'Autenticado' : 'Requer autenticação'}
                  </p>
                </div>
              </div>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestAuthentication}
                  disabled={isLoading}
                  className="border-satotrack-neon/30 text-satotrack-neon"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Autenticar
                </Button>
              )}
            </div>
          )}

          {/* PIN Security Section */}
          <div className="flex items-center justify-between p-3 bg-dashboard-dark/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${isPinEnabled ? 'bg-purple-500/20' : 'bg-gray-500/20'} flex items-center justify-center`}>
                {isPinEnabled ? (
                  <Hash className="h-5 w-5 text-purple-400" />
                ) : (
                  <Hash className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">PIN de Segurança</p>
                <p className="text-xs text-muted-foreground">
                  {isPinEnabled ? 'PIN de 6 dígitos configurado' : 'Configurar PIN como alternativa'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isPinEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestPin}
                  className="border-purple-500/30 text-purple-400"
                >
                  Testar
                </Button>
              )}
              <Switch
                checked={isPinEnabled}
                onCheckedChange={handleTogglePin}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-300">🔐 Como funciona a segurança:</p>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Biometria protege chave de sessão local</li>
                <li>• Chaves privadas ficam no Tatum KMS</li>
                <li>• Nunca armazenamos dados sensíveis</li>
                <li>• Transações sempre assinadas remotamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-medium text-emerald-300 mb-1">KMS Protection</p>
            <p className="text-xs text-emerald-200">Chaves gerenciadas pela Tatum</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Fingerprint className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-blue-300 mb-1">Biometric Auth</p>
            <p className="text-xs text-blue-200">Acesso protegido por biometria</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Hash className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-purple-300 mb-1">PIN Security</p>
            <p className="text-xs text-purple-200">Proteção por PIN de 6 dígitos</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <PinSetupModal
        isOpen={showPinSetup}
        onClose={() => setShowPinSetup(false)}
        onPinSetup={handlePinSetup}
      />

      <PinVerificationModal
        isOpen={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onSuccess={handlePinVerificationSuccess}
        showBiometricOption={isBiometricAvailable && isBiometricEnabled}
      />
    </div>
  );
};

export default BiometricSetup;
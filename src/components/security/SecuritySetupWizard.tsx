import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Fingerprint, 
  Hash, 
  Lock,
  CheckCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useBiometric } from '@/contexts/BiometricContext';
import PinSetupModal from './PinSetupModal';
import { toast } from 'sonner';

const SecuritySetupWizard: React.FC = () => {
  const { 
    isBiometricAvailable,
    isBiometricEnabled,
    isPinEnabled,
    hasAnySecurityMethod,
    enableBiometric,
    disableBiometric,
    setupPin 
  } = useBiometric();

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    try {
      const success = await enableBiometric();
      if (success) {
        toast.success('🔐 Biometria ativada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao ativar biometria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableBiometric = async () => {
    setIsLoading(true);
    try {
      await disableBiometric();
      toast.success('🔓 Biometria desativada');
    } catch (error) {
      console.error('Erro ao desativar biometria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSetupSuccess = () => {
    setShowPinSetup(false);
    toast.success('🔢 PIN configurado com sucesso!');
  };

  const getSecurityLevel = () => {
    if (isBiometricEnabled && isPinEnabled) return 'Máxima';
    if (isBiometricEnabled || isPinEnabled) return 'Boa';
    return 'Baixa';
  };

  const getSecurityColor = () => {
    const level = getSecurityLevel();
    switch (level) {
      case 'Máxima': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Boa': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-red-400 border-red-500/30 bg-red-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status */}
      <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
              <Shield className="h-6 w-6 text-black" />
            </div>
            Status de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Nível de Proteção:</span>
            <Badge className={getSecurityColor()}>
              {getSecurityLevel()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${isBiometricEnabled ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-dashboard-light/30 bg-dashboard-dark/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Fingerprint className={`h-5 w-5 ${isBiometricEnabled ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                <span className="font-medium text-white">Biometria</span>
                {isBiometricEnabled && <CheckCircle className="h-4 w-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {isBiometricEnabled ? 'Proteção biométrica ativa' : 'Biometria não configurada'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isPinEnabled ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-dashboard-light/30 bg-dashboard-dark/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Hash className={`h-5 w-5 ${isPinEnabled ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                <span className="font-medium text-white">PIN</span>
                {isPinEnabled && <CheckCircle className="h-4 w-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {isPinEnabled ? 'PIN de 6 dígitos ativo' : 'PIN não configurado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup */}
      {!hasAnySecurityMethod() && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="font-semibold text-amber-300 mb-1">
                    Proteja seus dados sensíveis
                  </h3>
                  <p className="text-sm text-amber-200">
                    Configure pelo menos um método de segurança para proteger seus endereços e chaves privadas.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {isBiometricAvailable && (
                    <Button
                      onClick={handleEnableBiometric}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Ativar Biometria
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => setShowPinSetup(true)}
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Configurar PIN
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biometric Authentication */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Fingerprint className="h-5 w-5 text-blue-400" />
              Autenticação Biométrica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use sua impressão digital, Face ID ou reconhecimento facial para proteger seus dados.
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant={isBiometricAvailable ? 'default' : 'secondary'}>
                  {isBiometricAvailable ? 'Disponível' : 'Indisponível'}
                </Badge>
                {isBiometricEnabled && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Ativo
                  </Badge>
                )}
              </div>
            </div>

            {isBiometricAvailable && (
              <Button
                onClick={isBiometricEnabled ? handleDisableBiometric : handleEnableBiometric}
                disabled={isLoading}
                className={`w-full ${
                  isBiometricEnabled 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                }`}
                variant={isBiometricEnabled ? 'outline' : 'default'}
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                {isLoading ? 'Processando...' : (isBiometricEnabled ? 'Desativar' : 'Ativar Biometria')}
              </Button>
            )}

            {!isBiometricAvailable && (
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">
                  Biometria não disponível neste dispositivo
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PIN Authentication */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Hash className="h-5 w-5 text-emerald-400" />
              PIN de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Configure um PIN de 6 dígitos para acessar suas carteiras e dados sensíveis.
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="default">Sempre Disponível</Badge>
                {isPinEnabled && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Configurado
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={() => setShowPinSetup(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              <Hash className="h-4 w-4 mr-2" />
              {isPinEnabled ? 'Alterar PIN' : 'Configurar PIN'}
            </Button>

            {isPinEnabled && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs text-emerald-300">PIN configurado e ativo</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Tips */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-300">
            <Lock className="h-5 w-5" />
            Dicas de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Use biometria quando disponível para máxima segurança
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Escolha um PIN único que apenas você conhece
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Ative ambos os métodos para proteção máxima
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Mantenha seus dispositivos atualizados
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* PIN Setup Modal */}
      <PinSetupModal
        isOpen={showPinSetup}
        onClose={() => setShowPinSetup(false)}
        onPinSetup={handlePinSetupSuccess}
      />
    </div>
  );
};

export default SecuritySetupWizard;
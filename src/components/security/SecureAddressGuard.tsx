import React, { useState, useEffect, ReactNode } from 'react';
import { useBiometric } from '@/contexts/BiometricContext';
import PinVerificationModal from './PinVerificationModal';
import BiometricPromptModal from './BiometricPromptModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Fingerprint, Hash } from 'lucide-react';

interface SecureAddressGuardProps {
  children: ReactNode;
  walletAddress?: string;
  privateKey?: string;
  sensitiveData?: string;
  dataType?: string;
  showMasked?: boolean;
}

const SecureAddressGuard: React.FC<SecureAddressGuardProps> = ({
  children,
  walletAddress,
  privateKey,
  sensitiveData,
  dataType = 'dados sensíveis',
  showMasked = true
}) => {
  const { 
    hasAnySecurityMethod, 
    requireAuth, 
    isPinEnabled,
    isBiometricEnabled,
    isAuthenticated,
    authenticateWithPin,
    authenticateWithBiometric
  } = useBiometric();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se já está autenticado no contexto global
    if (isAuthenticated) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  }, [isAuthenticated]);

  const handleUnlock = async () => {
    setIsLoading(true);
    
    try {
      // Se não há métodos de segurança, liberar acesso
      if (!hasAnySecurityMethod()) {
        setIsUnlocked(true);
        return;
      }

      // Se já autenticado globalmente, liberar acesso
      const hasAuth = await requireAuth();
      if (hasAuth) {
        setIsUnlocked(true);
        return;
      }

      // Mostrar opções de autenticação
      if (isBiometricEnabled) {
        setShowBiometricModal(true);
      } else if (isPinEnabled) {
        setShowPinModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSuccess = () => {
    setIsUnlocked(true);
    setShowPinModal(false);
  };

  const handleBiometricSuccess = () => {
    setIsUnlocked(true);
    setShowBiometricModal(false);
  };

  const maskSensitiveData = (data: string, type: 'address' | 'key' | 'generic' = 'generic'): string => {
    if (!data) return '';
    
    switch (type) {
      case 'address':
        // Mostrar primeiros 6 e últimos 4 caracteres
        if (data.length <= 10) return '*'.repeat(data.length);
        return `${data.substring(0, 6)}...${data.substring(data.length - 4)}`;
      
      case 'key':
        // Mostrar apenas os primeiros 4 caracteres
        return `${data.substring(0, 4)}${'*'.repeat(Math.max(0, data.length - 4))}`;
      
      default:
        // Mascarar completamente exceto primeiros 2 caracteres
        return `${data.substring(0, 2)}${'*'.repeat(Math.max(0, data.length - 2))}`;
    }
  };

  // Se está desbloqueado, mostrar o conteúdo
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Se deve mostrar versão mascarada
  if (showMasked && (walletAddress || privateKey || sensitiveData)) {
    return (
      <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {walletAddress && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Endereço:</p>
                  <p className="font-mono text-sm text-white">
                    {maskSensitiveData(walletAddress, 'address')}
                  </p>
                </div>
              )}
              
              {privateKey && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">Chave Privada:</p>
                  <p className="font-mono text-sm text-white">
                    {maskSensitiveData(privateKey, 'key')}
                  </p>
                </div>
              )}
              
              {sensitiveData && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">{dataType}:</p>
                  <p className="font-mono text-sm text-white">
                    {maskSensitiveData(sensitiveData)}
                  </p>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnlock}
              disabled={isLoading}
              className="ml-4 border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              {isBiometricEnabled ? (
                <Fingerprint className="h-4 w-4 mr-2" />
              ) : (
                <Hash className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Desbloqueando...' : 'Desbloquear'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar interface de bloqueio
  return (
    <>
      <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {dataType} Protegidos
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {hasAnySecurityMethod() 
                  ? 'Seus dados sensíveis estão protegidos. Autentique-se para visualizar.'
                  : 'Configure a proteção biométrica ou PIN para proteger seus dados.'
                }
              </p>
            </div>
            
            {hasAnySecurityMethod() ? (
              <Button
                onClick={handleUnlock}
                disabled={isLoading}
                className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
              >
                {isBiometricEnabled ? (
                  <Fingerprint className="h-4 w-4 mr-2" />
                ) : (
                  <Hash className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Desbloqueando...' : 'Desbloquear Dados'}
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/security'}
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <Shield className="h-4 w-4 mr-2" />
                Configurar Segurança
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de verificação PIN */}
      <PinVerificationModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        title="Verificar PIN"
        description="Digite seu PIN de 6 dígitos para acessar os dados sensíveis."
      />

      {/* Modal de verificação biométrica */}
      <BiometricPromptModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onActivate={handleBiometricSuccess}
        dataType={dataType}
        title="Autenticação Biométrica"
        description="Use sua biometria para acessar os dados sensíveis."
      />
    </>
  );
};

export default SecureAddressGuard;
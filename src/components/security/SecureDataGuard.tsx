import React, { useState, ReactNode } from 'react';
import { useBiometricPrompt } from '@/hooks/useBiometricPrompt';
import { useBiometric } from '@/contexts/BiometricContext';
import BiometricPromptModal from './BiometricPromptModal';
import PinVerificationModal from './PinVerificationModal';

interface SecureDataGuardProps {
  children: ReactNode;
  dataType?: string;
  fallbackComponent?: ReactNode;
  onAccessGranted?: () => void;
}

const SecureDataGuard: React.FC<SecureDataGuardProps> = ({ 
  children, 
  dataType = 'dados sensíveis',
  fallbackComponent,
  onAccessGranted
}) => {
  // All hooks must be called at the top level
  const { hasAnySecurityMethod, requireAuth } = useBiometric();
  const { shouldShowPrompt, checkAndPrompt, hidePrompt } = useBiometricPrompt();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckAccess = async () => {
    setIsChecking(true);
    
    if (!hasAnySecurityMethod()) {
      // Se não há métodos de segurança, mostrar prompt para configurar
      const canAccess = await checkAndPrompt(dataType);
      if (canAccess) {
        setHasAccess(true);
        onAccessGranted?.();
      }
    } else {
      // Se há métodos configurados, verificar autenticação
      const canAccess = await requireAuth();
      if (canAccess) {
        setHasAccess(true);
        onAccessGranted?.();
      }
    }
    
    setIsChecking(false);
  };

  const handleBiometricActivated = () => {
    setHasAccess(true);
    onAccessGranted?.();
  };

  // useEffect must be called before any early returns
  React.useEffect(() => {
    handleCheckAccess();
  }, []);

  // Se já tem acesso, mostrar conteúdo
  if (hasAccess) {
    return <>{children}</>;
  }

  // Se está verificando, mostrar loading ou fallback
  if (isChecking) {
    return fallbackComponent || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-satotrack-neon"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mostrar fallback enquanto não tem acesso */}
      {fallbackComponent || (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          <span className="text-sm">Verificando permissões...</span>
        </div>
      )}

      {/* Modal de prompt biométrico */}
      <BiometricPromptModal
        isOpen={shouldShowPrompt}
        onClose={hidePrompt}
        onActivate={handleBiometricActivated}
        dataType={dataType}
        title={`Proteger ${dataType}`}
        description={`Para visualizar ${dataType}, recomendamos ativar a proteção biométrica.`}
      />
    </>
  );
};

export default SecureDataGuard;
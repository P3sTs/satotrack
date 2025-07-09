import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { usePinAuth } from '@/hooks/usePinAuth';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface BiometricContextType {
  isBiometricAvailable: boolean;
  isBiometricEnabled: boolean;
  isPinEnabled: boolean;
  isAuthenticated: boolean;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  setupPin: (pin: string) => Promise<boolean>;
  removePin: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  authenticateWithPin: (pin: string) => Promise<boolean>;
  requireAuth: () => Promise<boolean>;
  hasAnySecurityMethod: () => boolean;
  requireBiometricAuth: () => Promise<boolean>; // Compatibilidade
}

const BiometricContext = createContext<BiometricContextType | null>(null);

interface BiometricProviderProps {
  children: ReactNode;
}

export const BiometricProvider: React.FC<BiometricProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const biometric = useBiometricAuth();
  const pinAuth = usePinAuth();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, [user]);

  const checkBiometricStatus = async () => {
    if (!user) {
      console.log('👤 Usuário não logado - resetando estados');
      setIsAuthenticated(false);
      setIsBiometricEnabled(false);
      setIsPinEnabled(false);
      return;
    }

    console.log('🔍 Verificando status da segurança...');
    const biometricEnabled = await biometric.isBiometricEnabled();
    const pinEnabled = await pinAuth.checkPinStatus();
    
    console.log('🔐 Biometria habilitada:', biometricEnabled);
    console.log('🔢 PIN habilitado:', pinEnabled);
    
    setIsBiometricEnabled(biometricEnabled);
    setIsPinEnabled(pinEnabled);
    
    // Se algum método está habilitado, exigir autenticação
    if (biometricEnabled || pinEnabled) {
      console.log('🔒 Segurança ativa - requer autenticação');
      setIsAuthenticated(false);
    } else {
      console.log('🔓 Nenhuma segurança ativa - acesso livre');
      setIsAuthenticated(true);
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    try {
      console.log('🔐 Tentando ativar biometria...');
      
      // Primeiro autentica para ativar
      const authSuccess = await biometric.authenticate({
        reason: 'Confirme sua identidade para ativar a proteção biométrica',
        title: 'SatoTracker - Ativar Biometria',
        subtitle: 'Use sua biometria para confirmar',
        description: 'Isso protegerá seus dados sensíveis'
      });

      if (!authSuccess) {
        console.log('❌ Autenticação para ativação falhou');
        toast.error('❌ Autenticação necessária para ativar biometria');
        return false;
      }

      const success = await biometric.enableBiometric();
      if (success) {
        console.log('✅ Biometria ativada com sucesso');
        setIsBiometricEnabled(true);
        setIsAuthenticated(true); // Já autenticado após ativação
        toast.success('🔐 Biometria ativada com sucesso!');
        return true;
      }
      console.log('❌ Falha ao ativar biometria');
      toast.error('❌ Falha ao ativar biometria');
      return false;
    } catch (error) {
      console.error('Enable biometric error:', error);
      toast.error('❌ Erro ao ativar biometria');
      return false;
    }
  };

  const disableBiometric = async (): Promise<void> => {
    try {
      await biometric.disableBiometric();
      setIsBiometricEnabled(false);
      setIsAuthenticated(true);
      toast.success('🔓 Biometria desativada');
    } catch (error) {
      console.error('Disable biometric error:', error);
      toast.error('❌ Erro ao desativar biometria');
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      const success = await biometric.authenticate({
        reason: 'Autentique-se para acessar suas carteiras',
        title: 'SatoTracker - Acesso Seguro',
        subtitle: 'Use sua biometria para continuar',
        description: 'Suas chaves privadas estão protegidas'
      });

      if (success) {
        setIsAuthenticated(true);
        toast.success('🔓 Acesso liberado!');
        return true;
      } else {
        toast.error('❌ Autenticação biométrica falhou');
        return false;
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      toast.error('❌ Erro na autenticação biométrica');
      return false;
    }
  };

  const setupPin = async (pin: string): Promise<boolean> => {
    try {
      const success = await pinAuth.setupPin(pin);
      if (success) {
        setIsPinEnabled(true);
        setIsAuthenticated(true); // Já autenticado após configuração
        toast.success('🔢 PIN configurado com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Setup pin error:', error);
      toast.error('❌ Erro ao configurar PIN');
      return false;
    }
  };

  const removePin = async (): Promise<void> => {
    try {
      await pinAuth.removePin();
      setIsPinEnabled(false);
      // Se não há biometria, liberar acesso
      if (!isBiometricEnabled) {
        setIsAuthenticated(true);
      }
      toast.success('🗑️ PIN removido');
    } catch (error) {
      console.error('Remove pin error:', error);
      toast.error('❌ Erro ao remover PIN');
    }
  };

  const authenticateWithPin = async (pin: string): Promise<boolean> => {
    try {
      const success = await pinAuth.verifyPin(pin);
      if (success) {
        setIsAuthenticated(true);
        toast.success('🔓 Acesso liberado!');
        return true;
      } else {
        toast.error('❌ PIN incorreto');
        return false;
      }
    } catch (error) {
      console.error('Pin authentication error:', error);
      toast.error('❌ Erro na autenticação por PIN');
      return false;
    }
  };

  const requireAuth = async (): Promise<boolean> => {
    // Se não há métodos de segurança ativados, permitir acesso
    if (!isBiometricEnabled && !isPinEnabled) {
      return true;
    }

    // Se já autenticado, permitir acesso
    if (isAuthenticated) {
      return true;
    }

    // Caso contrário, precisa autenticar
    return false;
  };

  const hasAnySecurityMethod = (): boolean => {
    return isBiometricEnabled || isPinEnabled;
  };

  // Manter compatibilidade com código existente
  const requireBiometricAuth = async (): Promise<boolean> => {
    return await requireAuth();
  };

  const value: BiometricContextType = {
    isBiometricAvailable: biometric.isAvailable,
    isBiometricEnabled,
    isPinEnabled,
    isAuthenticated,
    enableBiometric,
    disableBiometric,
    setupPin,
    removePin,
    authenticateWithBiometric,
    authenticateWithPin,
    requireAuth,
    hasAnySecurityMethod,
    // Compatibilidade
    requireBiometricAuth
  };

  return (
    <BiometricContext.Provider value={value}>
      {children}
    </BiometricContext.Provider>
  );
};

export const useBiometric = (): BiometricContextType => {
  const context = useContext(BiometricContext);
  if (!context) {
    throw new Error('useBiometric must be used within BiometricProvider');
  }
  return context;
};
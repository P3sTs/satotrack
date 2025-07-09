import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface BiometricContextType {
  isBiometricAvailable: boolean;
  isBiometricEnabled: boolean;
  isAuthenticated: boolean;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  requireBiometricAuth: () => Promise<boolean>;
}

const BiometricContext = createContext<BiometricContextType | null>(null);

interface BiometricProviderProps {
  children: ReactNode;
}

export const BiometricProvider: React.FC<BiometricProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const biometric = useBiometricAuth();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, [user]);

  const checkBiometricStatus = async () => {
    if (!user) {
      console.log('👤 Usuário não logado - resetando estados');
      setIsAuthenticated(false);
      setIsBiometricEnabled(false);
      return;
    }

    console.log('🔍 Verificando status da biometria...');
    const enabled = await biometric.isBiometricEnabled();
    console.log('🔐 Biometria habilitada:', enabled);
    
    setIsBiometricEnabled(enabled);
    
    // Se biometria está habilitada, exigir autenticação
    if (enabled) {
      console.log('🔒 Biometria ativa - requer autenticação');
      setIsAuthenticated(false);
    } else {
      console.log('🔓 Biometria inativa - acesso livre');
      setIsAuthenticated(true); // Se não tem biometria, acesso direto
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

  const requireBiometricAuth = async (): Promise<boolean> => {
    if (!isBiometricEnabled) {
      return true; // Se biometria não está ativa, permite acesso
    }

    if (isAuthenticated) {
      return true; // Já autenticado
    }

    return await authenticateWithBiometric();
  };

  const value: BiometricContextType = {
    isBiometricAvailable: biometric.isAvailable,
    isBiometricEnabled,
    isAuthenticated,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
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
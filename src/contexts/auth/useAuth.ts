
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { AuthContextType } from './types';

// Hook for accessing the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};


import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

interface ErrorState {
  error: Error | null;
  isLoading: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false
  });

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('🚨 Error handled:', error);
    
    let errorMessage = customMessage || 'Algo deu errado. Tente novamente.';
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('network')) {
        errorMessage = '🌐 Problema de conexão. Verifique sua internet.';
      } else if (error.message.includes('unauthorized')) {
        errorMessage = '🔒 Sessão expirada. Faça login novamente.';
      } else if (error.message.includes('not found')) {
        errorMessage = '📭 Dados não encontrados.';
      }
    }
    
    setErrorState({ error: error as Error, isLoading: false });
    toast.error(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null, isLoading: false });
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    loadingMessage?: string,
    successMessage?: string
  ): Promise<T | null> => {
    try {
      setErrorState({ error: null, isLoading: true });
      
      if (loadingMessage) {
        toast.info(loadingMessage);
      }
      
      const result = await asyncFunction();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      setErrorState({ error: null, isLoading: false });
      return result;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [handleError]);

  return {
    ...errorState,
    handleError,
    clearError,
    executeWithErrorHandling
  };
};

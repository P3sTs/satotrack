import React from 'react';
import { SecurePinModal } from './SecurePinModal';
import { useSecureSession } from '@/hooks/useSecureSession';

interface ScreenLockOverlayProps {
  children: React.ReactNode;
}

export const ScreenLockOverlay: React.FC<ScreenLockOverlayProps> = ({ children }) => {
  const { isLocked, unlockScreen } = useSecureSession();

  const handleUnlock = async () => {
    // Modal will handle the unlock logic
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-6">
        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Sessão Bloqueada</h2>
          <p className="text-muted-foreground">
            Por segurança, sua sessão foi bloqueada automaticamente.
            <br />
            Digite seu PIN para continuar.
          </p>
        </div>
      </div>

      <SecurePinModal
        isOpen={isLocked}
        onClose={() => {}}
        onSuccess={handleUnlock}
        onPinVerified={unlockScreen}
        title="Desbloquear Sessão"
        description="Digite seu PIN de 6 dígitos para desbloquear"
      />
    </div>
  );
};

import React, { memo } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

interface SecurityStatusProps {
  securityStatus: 'secure' | 'warning' | 'danger';
}

export const SecurityStatus: React.FC<SecurityStatusProps> = memo(({ securityStatus }) => {
  const SecurityIcon = () => {
    switch (securityStatus) {
      case 'secure':
        return <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-green-500" />;
      case 'warning':
        return <Shield className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />;
      case 'danger':
        return <ShieldAlert className="h-4 w-4 md:h-5 md:w-5 text-red-500" />;
      default:
        return <Lock className="h-4 w-4 md:h-5 md:w-5" />;
    }
  };

  return (
    <div className="flex items-center" data-testid="security-status">
      <SecurityIcon />
      <span className="ml-1 text-xs md:text-sm">
        {securityStatus === 'secure' && 'Conexão segura'}
        {securityStatus === 'warning' && 'Atenção necessária'}
        {securityStatus === 'danger' && 'Risco de segurança'}
      </span>
    </div>
  );
});

SecurityStatus.displayName = 'SecurityStatus';

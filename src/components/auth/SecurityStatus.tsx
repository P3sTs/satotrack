
import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

interface SecurityStatusProps {
  securityStatus: 'secure' | 'warning' | 'danger';
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({ securityStatus }) => {
  const SecurityIcon = () => {
    switch (securityStatus) {
      case 'secure':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      case 'danger':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Lock className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-center">
      <SecurityIcon />
      <span className="ml-1 text-sm">
        {securityStatus === 'secure' && 'Conexão segura'}
        {securityStatus === 'warning' && 'Atenção necessária'}
        {securityStatus === 'danger' && 'Risco de segurança'}
      </span>
    </div>
  );
};

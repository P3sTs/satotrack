import React from 'react';
import { ArrowUp, ArrowDown, Zap, Building2 } from 'lucide-react';

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}

const NativeActionButtons: React.FC = () => {
  const actions: ActionButton[] = [
    {
      icon: <ArrowUp className="h-5 w-5" />,
      label: 'Enviar',
      variant: 'default'
    },
    {
      icon: <ArrowDown className="h-5 w-5" />,
      label: 'Receber',
      variant: 'default'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      label: 'Comprar',
      variant: 'primary'
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: 'Vender',
      variant: 'default'
    }
  ];

  return (
    <div className="flex justify-between items-center px-6 py-4 gap-4">
      {actions.map((action, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            action.variant === 'primary' 
              ? 'bg-satotrack-neon text-black' 
              : 'bg-dashboard-medium/50 text-satotrack-text'
          }`}>
            {action.icon}
          </div>
          <span className="text-xs text-satotrack-text">{action.label}</span>
        </div>
      ))}
    </div>
  );
};

export default NativeActionButtons;
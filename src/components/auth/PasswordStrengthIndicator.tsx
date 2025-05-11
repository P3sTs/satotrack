
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  score: number;
  feedback: string;
  password: string;
}

export const PasswordStrengthIndicator = ({ 
  score, 
  feedback, 
  password 
}: PasswordStrengthIndicatorProps) => {
  
  // Cor da barra de progresso baseada na força da senha
  const getPasswordStrengthColor = () => {
    switch (score) {
      case 0: return 'bg-gray-300';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-2">
      <Progress 
        value={score * 20} 
        className={cn("h-1", getPasswordStrengthColor())} 
      />
      
      <div className="text-xs text-muted-foreground mt-2 space-y-1">
        <p>A senha deve ter pelo menos:</p>
        <ul className="list-disc pl-5 space-y-0.5">
          <li className={password.length >= 8 ? "text-green-500" : ""}>8 caracteres</li>
          <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>Uma letra maiúscula</li>
          <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>Uma letra minúscula</li>
          <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>Um número</li>
          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : ""}>Um caractere especial</li>
        </ul>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  autoComplete?: string;
  className?: string;
}

export const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  error, 
  autoComplete,
  className 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input 
        id={id} 
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={`pr-10 border-input focus-visible:ring-bitcoin ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

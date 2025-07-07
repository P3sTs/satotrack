import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/theme/ThemeContext';
import { toast } from 'sonner';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    toast.success(
      theme === 'dark' 
        ? '🌞 Tema claro ativado' 
        : '🌙 Tema escuro ativado',
      { duration: 2000 }
    );
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="relative w-10 h-10 rounded-full border border-border/50 hover:border-border transition-all duration-300"
      aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
            theme === 'dark' 
              ? 'scale-0 rotate-90 opacity-0' 
              : 'scale-100 rotate-0 opacity-100'
          }`} 
        />
        <Moon 
          className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
            theme === 'dark' 
              ? 'scale-100 rotate-0 opacity-100' 
              : 'scale-0 -rotate-90 opacity-0'
          }`} 
        />
      </div>
    </Button>
  );
};
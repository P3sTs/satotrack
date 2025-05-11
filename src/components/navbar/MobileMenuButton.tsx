
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className="md:hidden flex items-center p-2 text-gray-200 hover:text-satotrack-neon transition-colors border border-transparent rounded-md hover:border-satotrack-neon/20"
      onClick={onClick}
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
};

export default MobileMenuButton;

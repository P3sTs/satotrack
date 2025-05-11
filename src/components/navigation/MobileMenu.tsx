import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Wallet, Mail } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
}

interface MobileMenuProps {
  user: AuthUser | null;
  isActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
  handleLogout: () => Promise<void>;
  getUserInitials: () => string;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  user,
  isActive,
  handleNavigation,
  handleLogout,
  getUserInitials,
  setIsMobileMenuOpen
}) => {
  return (
    <div className="space-y-3 py-3">
      {user && (
        <div className="flex flex-col items-center py-4 mb-2 border-b border-dashboard-medium/30">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-satotrack-text mt-1">Usuário SatoTrack</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => handleNavigation('/')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Início
      </button>
      
      {user && (
        <>
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/dashboard') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button 
            onClick={() => handleNavigation('/carteiras')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/carteiras') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Gerenciar Carteiras
          </button>
          <button 
            onClick={() => handleNavigation('/nova-carteira')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/nova-carteira') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'} ml-6`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Nova Carteira
          </button>
        </>
      )}
      
      <button 
        onClick={() => handleNavigation('/sobre')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/sobre') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Sobre
      </button>

      <button 
        onClick={() => handleNavigation('/privacidade')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/privacidade') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Privacidade
      </button>
      
      <div className="pt-2 border-t border-dashboard-medium/30 mt-2">
        {user ? (
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        ) : (
          <Button 
            variant="neon" 
            className="w-full justify-start" 
            onClick={() => {
              handleNavigation('/auth');
              setIsMobileMenuOpen(false);
            }}
          >
            <User className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

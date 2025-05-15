
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Wallet, Mail, BarChart3, Bell, Settings, Info, Shield, Star } from 'lucide-react';
import { AuthUser } from '@/contexts/auth/types';

interface MobileMenuProps {
  user: AuthUser | null;
  isActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
  handleLogout: () => void; // Updated to match MobileMenuContainer
  getUserInitials: () => string;
  onClose: () => void;
  isPremium?: boolean;
  onPremiumClick?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  user,
  isActive,
  handleNavigation,
  handleLogout,
  getUserInitials,
  onClose,
  isPremium = false,
  onPremiumClick
}) => {
  const navigate = (path: string) => {
    handleNavigation(path);
    onClose();
  };

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
            <p className="text-xs text-satotrack-text mt-1">
              {isPremium ? (
                <span className="flex items-center justify-center text-bitcoin">
                  <Star className="h-3 w-3 mr-1 fill-bitcoin" /> Usuário Premium
                </span>
              ) : (
                "Usuário SatoTrack"
              )}
            </p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => navigate('/')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Início
      </button>
      
      {user && (
        <>
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/dashboard') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/carteiras')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/carteiras') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Gerenciar Carteiras
          </button>
          
          <button 
            onClick={() => navigate('/nova-carteira')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/nova-carteira') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'} ml-6`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Nova Carteira
          </button>
          
          <button 
            onClick={() => navigate('/mercado')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/mercado') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Mercado
          </button>
          
          <button 
            onClick={() => navigate('/notificacoes')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/notificacoes') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </button>
          
          <button 
            onClick={() => navigate('/configuracoes')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/configuracoes') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </button>
          
          {/* Premium Button */}
          {onPremiumClick && (
            <button 
              onClick={onPremiumClick}
              className={`flex w-full items-center py-2 px-4 rounded-md mt-2 ${
                isPremium 
                  ? 'bg-bitcoin/20 text-bitcoin' 
                  : 'border border-bitcoin/30 text-bitcoin hover:bg-bitcoin/10'
              }`}
            >
              <Star className={`h-4 w-4 mr-2 ${isPremium ? 'fill-bitcoin' : ''}`} />
              {isPremium ? 'Painel Premium' : 'Quero ser Premium'}
            </button>
          )}
        </>
      )}
      
      <button 
        onClick={() => navigate('/sobre')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/sobre') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <Info className="h-4 w-4 mr-2" />
        Sobre
      </button>

      <button 
        onClick={() => navigate('/privacidade')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/privacidade') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <Shield className="h-4 w-4 mr-2" />
        Privacidade
      </button>
      
      <div className="pt-2 border-t border-dashboard-medium/30 mt-2">
        {user ? (
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        ) : (
          <Button 
            variant="neon" 
            className="w-full justify-start" 
            onClick={() => {
              navigate('/auth');
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

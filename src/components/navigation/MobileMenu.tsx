
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Wallet, Mail, BarChart3, Bell, Settings, Info, Shield, Star, X } from 'lucide-react';
import { AuthUser } from '@/contexts/auth/types';
import { PlanBadge } from '../monetization/PlanDisplay';

interface MobileMenuProps {
  user: AuthUser | null;
  isActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
  handleLogout: () => void;
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
    <div className="flex flex-col h-full">
      {/* Botão fechar e informações do usuário */}
      <div className="flex justify-between items-center p-4 border-b border-dashboard-medium/30">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-satotrack-text" />
        </Button>
        
        {user ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm truncate max-w-[120px] text-satotrack-text">{user.email}</p>
              <PlanBadge />
            </div>
          </div>
        ) : (
          <Button 
            variant="neon" 
            size="sm" 
            onClick={() => navigate('/auth')}
          >
            <User className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        )}
      </div>
      
      {/* Links de navegação */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
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
        </nav>
      </div>
      
      {/* Ações de rodapé */}
      <div className="p-4 border-t border-dashboard-medium/30">
        {user ? (
          <Button 
            variant="outline" 
            className="w-full justify-start text-satotrack-text border-dashboard-medium"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        ) : (
          <Button 
            variant="neon" 
            className="w-full justify-start"
            onClick={() => navigate('/auth')}
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


import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Wallet, BarChart3, Bell, Settings, Home, PlusCircle, History, Star, Crown, X } from 'lucide-react';
import { AuthUser } from '@/contexts/auth/types';
import { Separator } from '@/components/ui/separator';

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
  onPremiumClick,
}) => {
  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/carteiras', label: 'Carteiras', icon: Wallet },
    { path: '/nova-carteira', label: 'Nova Carteira', icon: PlusCircle },
    { path: '/mercado', label: 'Mercado', icon: BarChart3 },
    { path: '/historico', label: 'Histórico', icon: History },
    { path: '/notificacoes', label: 'Notificações', icon: Bell },
    { path: '/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleItemClick = (path: string) => {
    handleNavigation(path);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-dark text-satotrack-text">
      {/* Header do Menu */}
      <div className="flex items-center justify-between p-4 border-b border-dashboard-medium">
        <h2 className="text-lg font-semibold text-white">Menu</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-white/60 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-dashboard-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-dashboard-medium text-satotrack-text">
              {user ? getUserInitials() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {user ? user.email : 'Visitante'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-bitcoin/20 text-bitcoin rounded-full">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Plano Gratuito</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`w-full justify-start gap-3 text-left h-12 ${
              isActive(item.path) 
                ? 'bg-dashboard-medium text-white border-l-2 border-l-satotrack-neon' 
                : 'text-satotrack-text hover:text-white hover:bg-dashboard-medium/50'
            }`}
            onClick={() => handleItemClick(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.label}</span>
          </Button>
        ))}

        {onPremiumClick && (
          <>
            <Separator className="my-2 bg-dashboard-medium" />
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-left h-12 ${
                isPremium 
                  ? 'border border-bitcoin/30 text-bitcoin hover:bg-bitcoin/10' 
                  : 'text-satotrack-text hover:text-white hover:bg-dashboard-medium/50'
              }`}
              onClick={() => {
                onPremiumClick();
                onClose();
              }}
            >
              <Star className={`h-5 w-5 ${isPremium ? 'fill-bitcoin' : ''}`} />
              <span className="text-sm">{isPremium ? 'Painel Premium' : 'Ser Premium'}</span>
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      {user && (
        <div className="p-4 border-t border-dashboard-medium">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 h-12"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

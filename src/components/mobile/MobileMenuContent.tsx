
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LogOut, 
  User, 
  Settings, 
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { PlanBadge } from '../monetization/PlanDisplay';

interface NavigationItem {
  to: string;
  label: string;
  icon: any;
  description: string;
  premium?: boolean;
}

interface MobileMenuContentProps {
  setIsMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  getUserInitials: () => string;
  navigationItems: NavigationItem[];
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  setIsMenuOpen,
  handleLogout,
  getUserInitials,
  navigationItems
}) => {
  const { user, userPlan, securityStatus } = useAuth();
  const isPremium = userPlan === 'premium';

  return (
    <div className="flex flex-col h-full">
      {/* Header do Menu */}
      <div className="p-6 border-b border-dashboard-medium/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-satotrack-text truncate">
              {user?.email || 'Usuário'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <PlanBadge />
              {securityStatus === 'secure' && (
                <Shield className="h-3 w-3 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.premium && !isPremium;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-dashboard-medium/50 text-satotrack-text hover:text-satotrack-neon'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Zap className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer do Menu */}
      <div className="border-t border-dashboard-medium/30 p-4 space-y-2">
        <Link
          to="/configuracoes"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-dashboard-medium/50 text-satotrack-text hover:text-satotrack-neon transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
        
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};

export default MobileMenuContent;

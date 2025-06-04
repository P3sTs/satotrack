
import React from 'react';
import { Home, TrendingUp, Wallet, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n/I18nContext';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/common/LanguageSelector';
import { toast } from '@/hooks/use-toast';

const SidebarNavigation: React.FC = () => {
  const { isAuthenticated, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const navigationItems = [
    { name: t.menu.dashboard, href: '/dashboard', icon: Home },
    { name: t.menu.market, href: '/mercado', icon: TrendingUp },
    { name: t.menu.wallet, href: '/carteiras', icon: Wallet },
    { name: t.menu.charts, href: '/crypto', icon: BarChart3 },
    { name: t.menu.referral, href: '/referral', icon: Users },
    { name: t.menu.settings, href: '/configuracoes', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <NavItem
            key={item.name}
            name={item.name}
            href={item.href}
            icon={item.icon}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </nav>
      
      {/* Language Selector */}
      <LanguageSelector variant="sidebar" />
      
      {/* Logout Button */}
      {isAuthenticated && (
        <div className="p-3 border-t border-dashboard-medium/30">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-white hover:bg-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            {t.menu.logout}
          </Button>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isAuthenticated: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, isAuthenticated }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-dashboard-medium ${
          isActive 
            ? 'bg-dashboard-medium text-bitcoin shadow-sm' 
            : 'text-muted-foreground hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {name}
    </NavLink>
  );
};

export default SidebarNavigation;

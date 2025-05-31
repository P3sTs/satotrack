
import React from 'react';
import { Home, Wallet, Plus, TrendingUp, BarChart3, Target, History, Bell, Users, ExternalLink, Settings, Activity, Search, Box, Code } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const SidebarNavigation: React.FC = () => {
  const { isAuthenticated, userPlan } = useAuth();
  const location = useLocation();
  const isPremium = userPlan === 'premium';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'OnChain Monitor', href: '/onchain', icon: Activity },
    { name: 'Carteiras', href: '/carteiras', icon: Wallet },
    { name: 'Nova Carteira', href: '/nova-carteira', icon: Plus },
    { name: 'Mercado', href: '/mercado', icon: TrendingUp },
    { name: 'Análises', href: '/crypto', icon: BarChart3 },
    { name: 'Consulta BTC', href: '/bitcoin-lookup', icon: Search },
    { name: 'Visualização 3D', href: '/3d-visualization', icon: Box },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
    { name: 'Programa Referência', href: '/referral', icon: Users },
    { name: 'Growth Metrics', href: '/growth', icon: TrendingUp },
    { name: 'Landing Page', href: '/landing', icon: ExternalLink },
    // Itens Premium
    ...(isPremium ? [
      { name: 'Projeções', href: '/projecao-lucros', icon: Target, premium: true },
      { name: 'Histórico', href: '/historico', icon: History, premium: true },
      { name: 'Notificações', href: '/notificacoes', icon: Bell, premium: true },
      { name: 'API', href: '/api', icon: Code, premium: true },
    ] : [])
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navigationItems.map((item) => (
        <NavItem
          key={item.name}
          name={item.name}
          href={item.href}
          icon={item.icon}
          isAuthenticated={isAuthenticated}
          isPremium={item.premium || false}
        />
      ))}
    </nav>
  );
};

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isAuthenticated: boolean;
  isPremium?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, isAuthenticated, isPremium }) => {
  // If the route is /auth and the user is authenticated, don't render the link
  if (href === '/auth' && isAuthenticated) {
    return null;
  }

  // If the route is /auth and the user is not authenticated, render the link
  if (href === '/auth' && !isAuthenticated) {
    return (
      <NavLink
        to={href}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground ${
            isActive ? 'bg-secondary text-accent-foreground' : 'text-muted-foreground'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        {name}
      </NavLink>
    );
  }

  // If the route is /register and the user is authenticated, don't render the link
  if (href === '/register' && isAuthenticated) {
    return null;
  }

  // If the route is /register and the user is not authenticated, render the link
  if (href === '/register' && !isAuthenticated) {
    return (
      <NavLink
        to={href}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground ${
            isActive ? 'bg-secondary text-accent-foreground' : 'text-muted-foreground'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        {name}
      </NavLink>
    );
  }

  // If the route is / and the user is not authenticated, render the link
  if (href === '/' && !isAuthenticated) {
    return (
      <NavLink
        to={href}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground ${
            isActive ? 'bg-secondary text-accent-foreground' : 'text-muted-foreground'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        {name}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground ${
          isActive ? 'bg-secondary text-accent-foreground' : 'text-muted-foreground'
        } ${isPremium ? 'border-l-2 border-bitcoin' : ''}`
      }
    >
      <Icon className="h-4 w-4" />
      {name}
      {isPremium && (
        <span className="ml-auto text-xs bg-bitcoin/20 text-bitcoin px-1 rounded">
          PRO
        </span>
      )}
    </NavLink>
  );
};

export default SidebarNavigation;


import React from 'react';
import { Home, Wallet, Plus, TrendingUp, BarChart3, Target, History, Bell, Users, ExternalLink, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SidebarNavigation: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Carteiras', href: '/carteiras', icon: Wallet },
    { name: 'Nova Carteira', href: '/nova-carteira', icon: Plus },
    { name: 'Mercado', href: '/mercado', icon: TrendingUp },
    { name: 'Análises', href: '/crypto', icon: BarChart3 },
    { name: 'Projeções', href: '/projecao-lucros', icon: Target },
    { name: 'Histórico', href: '/historico', icon: History },
    { name: 'Notificações', href: '/notificacoes', icon: Bell },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
    { name: 'Programa Referência', href: '/referral', icon: Users },
    { name: 'Growth Metrics', href: '/growth', icon: TrendingUp },
    { name: 'Landing Page', href: '/landing', icon: ExternalLink },
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
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, isAuthenticated }) => {
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
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {name}
    </NavLink>
  );
};

export default SidebarNavigation;

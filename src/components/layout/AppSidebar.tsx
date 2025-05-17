
import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Wallet, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings, 
  Code, 
  Bell,
  Star 
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';

const AppSidebar = () => {
  const { user, userPlan } = useAuth();
  const isMobile = useIsMobile();
  const isPremium = userPlan === 'premium';
  
  const navigationItems = [
    { 
      label: 'Dashboard', 
      icon: <Home className="h-5 w-5" />, 
      href: '/dashboard' 
    },
    { 
      label: 'Minhas Carteiras', 
      icon: <Wallet className="h-5 w-5" />, 
      href: '/carteiras' 
    },
    { 
      label: 'Adicionar Carteira', 
      icon: <PlusCircle className="h-5 w-5" />, 
      href: '/nova-carteira',
      requiresAuth: true
    },
    { 
      label: 'Histórico', 
      icon: <History className="h-5 w-5" />, 
      href: '/historico',
      requiresAuth: true 
    },
    { 
      label: 'Mercado', 
      icon: <BarChart3 className="h-5 w-5" />, 
      href: '/mercado' 
    },
    { 
      label: 'Notificações', 
      icon: <Bell className="h-5 w-5" />, 
      href: '/notificacoes',
      requiresAuth: true 
    },
    { 
      label: 'Configurações', 
      icon: <Settings className="h-5 w-5" />, 
      href: '/configuracoes',
      requiresAuth: true 
    }
  ];
  
  // Mostrar link da API apenas para usuários premium
  if (isPremium) {
    navigationItems.push({
      label: 'API',
      icon: <Code className="h-5 w-5" />,
      href: '/api',
      requiresAuth: true
    });
  }

  return (
    <div className="h-screen flex flex-col w-64 bg-dashboard-dark border-r border-dashboard-medium">
      <div className="p-4 border-b border-dashboard-medium">
        <NavLink to="/dashboard" className="flex items-center">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="h-8 w-8 mr-2"
            loading="eager"
          />
          <span className="text-xl font-bold text-white">SatoTrack</span>
        </NavLink>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-dashboard-medium">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-dashboard-medium",
                    isActive 
                      ? "bg-dashboard-medium text-white font-medium" 
                      : "text-white/70 hover:text-white"
                  )
                }
                aria-label={item.label}
              >
                {item.icon}
                {item.label}
                {item.label === 'API' && <Star className="h-3 w-3 ml-1 fill-bitcoin" />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-dashboard-medium">
        <div className="text-xs text-white/50 mb-2">
          {user ? `Logado como ${user.email}` : 'Não logado'}
        </div>
      </div>
    </div>
  );
};

export default memo(AppSidebar);

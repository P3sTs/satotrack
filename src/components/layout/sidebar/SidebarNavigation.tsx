
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';

// Define the interface for navigation items
interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  requiresAuth: boolean;
  isPremium?: boolean;
}

const SidebarNavigation: React.FC = () => {
  const { isAuthenticated, userPlan } = useAuth();
  const location = useLocation();
  const isPremium = userPlan === 'premium';

  // Determine menu items based on auth state
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { 
        label: 'Dashboard', 
        icon: <Home className="h-5 w-5" />, 
        href: '/dashboard',
        requiresAuth: true
      },
      { 
        label: 'Minhas Carteiras', 
        icon: <Wallet className="h-5 w-5" />, 
        href: '/carteiras',
        requiresAuth: true
      }
    ];
    
    const authRequiredItems: NavigationItem[] = [
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
    
    const publicItems: NavigationItem[] = [
      { 
        label: 'Início', 
        icon: <Home className="h-5 w-5" />, 
        href: '/',
        requiresAuth: false
      },
      { 
        label: 'Mercado', 
        icon: <BarChart3 className="h-5 w-5" />, 
        href: '/mercado',
        requiresAuth: false
      },
      {
        label: 'Redes Crypto',
        icon: <Code className="h-5 w-5" />,
        href: '/crypto',
        requiresAuth: false
      }
    ];
    
    // Show premium API feature if user has premium plan
    const premiumItems: NavigationItem[] = isPremium ? [
      {
        label: 'API',
        icon: <Code className="h-5 w-5" />,
        href: '/api',
        requiresAuth: true,
        isPremium: true
      }
    ] : [];
    
    // Combine items based on authentication state
    if (isAuthenticated) {
      return [...baseItems, ...authRequiredItems, ...publicItems, ...premiumItems];
    } else {
      return [...publicItems];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegação</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
                tooltip={item.label}
              >
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center",
                      isActive ? "text-satotrack-neon" : "text-white/70 hover:text-white"
                    )
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                  {item.isPremium && <Star className="h-3 w-3 ml-1 fill-bitcoin" />}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

// Import the Lucide icons separately to avoid circular dependencies
import { 
  Home, 
  Wallet, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings, 
  Code, 
  Bell 
} from 'lucide-react';

export default SidebarNavigation;

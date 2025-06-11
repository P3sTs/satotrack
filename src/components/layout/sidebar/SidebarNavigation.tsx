
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Wallet, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings, 
  Bell,
  TrendingUp,
  Trophy,
  GitCompare,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const SidebarNavigation = () => {
  const { user, userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const mainItems = [
    { 
      label: 'Dashboard', 
      icon: Home, 
      href: '/dashboard' 
    },
    { 
      label: 'Carteiras', 
      icon: Wallet, 
      href: '/carteiras' 
    },
    { 
      label: 'Mercado', 
      icon: BarChart3, 
      href: '/mercado' 
    },
    { 
      label: 'Web3 Connect', 
      icon: Zap, 
      href: '/web3',
      premium: true
    }
  ];

  const analyticsItems = [
    { 
      label: 'Histórico', 
      icon: History, 
      href: '/historico' 
    },
    { 
      label: 'Projeções', 
      icon: TrendingUp, 
      href: '/projecao' 
    },
    { 
      label: 'Comparação', 
      icon: GitCompare, 
      href: '/comparison' 
    }
  ];

  const systemItems = [
    { 
      label: 'Alertas', 
      icon: Bell, 
      href: '/alerts' 
    },
    { 
      label: 'Conquistas', 
      icon: Trophy, 
      href: '/achievements' 
    },
    { 
      label: 'Configurações', 
      icon: Settings, 
      href: '/configuracoes' 
    }
  ];

  const renderNavItem = (item: any) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-dashboard-medium",
              isActive 
                ? "bg-dashboard-medium text-white font-medium" 
                : "text-white/70 hover:text-white",
              item.premium && !isPremium && "opacity-50"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
          {item.premium && !isPremium && (
            <span className="text-xs bg-bitcoin/20 text-bitcoin px-1 py-0.5 rounded">
              Pro
            </span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <div className="flex flex-col gap-2">
      <SidebarGroup>
        <SidebarGroupLabel>Principal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Analytics</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {analyticsItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Sistema</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {systemItems.map(renderNavItem)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default SidebarNavigation;

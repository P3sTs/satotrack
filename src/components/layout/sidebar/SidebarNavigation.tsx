
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Settings, 
  Bell, 
  Plus,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    group: 'Principal'
  },
  {
    title: 'Carteiras',
    url: '/carteiras',
    icon: Wallet,
    group: 'Principal'
  },
  {
    title: 'Nova Carteira',
    url: '/nova-carteira',
    icon: Plus,
    group: 'Principal'
  },
  {
    title: 'Crypto Dashboard',
    url: '/crypto-dashboard',
    icon: TrendingUp,
    group: 'Ferramentas'
  },
  {
    title: 'Web3 Dashboard',
    url: '/web3',
    icon: Globe,
    group: 'Ferramentas'
  },
  {
    title: 'Projeção',
    url: '/projecao',
    icon: Zap,
    group: 'Ferramentas'
  },
  {
    title: 'Notificações',
    url: '/notificacoes',
    icon: Bell,
    group: 'Conta'
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
    group: 'Conta'
  }
];

const SidebarNavigation: React.FC = () => {
  const groups = [...new Set(navigationItems.map(item => item.group))];

  return (
    <div className="space-y-4">
      {groups.map((groupName) => {
        const groupItems = navigationItems.filter(item => item.group === groupName);
        
        return (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel className="text-satotrack-neon/80 font-semibold">
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-satotrack-neon/20 text-satotrack-neon border-l-2 border-satotrack-neon'
                              : 'text-muted-foreground hover:text-satotrack-text hover:bg-dashboard-light/50'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </div>
  );
};

export default SidebarNavigation;

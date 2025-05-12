
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  BarChart, 
  Settings, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { PlanBadge } from '../monetization/PlanDisplay';
import { useAuth } from '@/contexts/auth';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleItem {
  title: string;
  path: string;
  icon: React.ElementType;
  requiresAuth: boolean;
}

const AppSidebar = () => {
  const location = useLocation();
  const { user, userPlan } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const modules: ModuleItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      requiresAuth: true
    },
    {
      title: 'Carteiras',
      path: '/carteiras',
      icon: Wallet,
      requiresAuth: true
    },
    {
      title: 'Histórico',
      path: '/historico',
      icon: History,
      requiresAuth: true
    },
    {
      title: 'Mercado',
      path: '/mercado',
      icon: BarChart,
      requiresAuth: false
    },
    {
      title: 'Configurações',
      path: '/configuracoes',
      icon: Settings,
      requiresAuth: true
    },
    {
      title: 'Premium',
      path: '/planos',
      icon: Award,
      requiresAuth: false
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const visibleModules = modules.filter(module => 
    !module.requiresAuth || (module.requiresAuth && user)
  );

  return (
    <SidebarProvider defaultOpen={!collapsed}>
      <Sidebar className="border-r border-dashboard-medium/30 bg-dashboard-dark" collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
              alt="SatoTrack Logo" 
              className="h-6 w-6 md:h-8 md:w-8" 
            />
            <span className="font-orbitron text-lg font-bold text-transparent bg-clip-text bg-satotrack-logo-gradient">
              SatoTrack
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <TooltipProvider>
                  {visibleModules.map((module) => (
                    <SidebarMenuItem key={module.path}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive(module.path)} 
                            tooltip={module.title}
                          >
                            <Link to={module.path} className="flex items-center gap-3">
                              <module.icon className="h-5 w-5" />
                              <span>{module.title}</span>
                              {module.path === '/planos' && userPlan === 'free' && (
                                <span className="bg-satotrack-neon text-xs px-1.5 py-0.5 rounded text-black">
                                  Upgrade
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {module.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </TooltipProvider>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          {user && userPlan && (
            <div className={cn(
              "transition-all duration-200 flex items-center gap-2",
              collapsed ? "flex-col justify-center" : "justify-between"
            )}>
              <PlanBadge />
              <span className="text-xs text-satotrack-text">{collapsed ? '' : 'SatoTrack'}</span>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;

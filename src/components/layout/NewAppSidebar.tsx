
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Star,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlanBadge } from '../monetization/PlanDisplay';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { SecurityStatus } from '../auth/SecurityStatus';

// Define the interface for navigation items to include the optional isPremium property
interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  requiresAuth: boolean;
  isPremium?: boolean;
}

const NewAppSidebar = () => {
  const { user, signOut, userPlan, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isPremium = userPlan === 'premium';

  // Debug to track auth status
  React.useEffect(() => {
    console.log("NewAppSidebar: Authentication status =", isAuthenticated, "User =", !!user);
  }, [isAuthenticated, user]);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout",
        variant: "destructive"
      });
    }
  };

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

  // Sidebar header with logo
  const renderSidebarHeader = () => (
    <SidebarHeader>
      <NavLink to="/" className="flex items-center p-2">
        <img
          src="/favicon.ico"
          alt="Logo"
          className="h-8 w-8 mr-2"
          loading="eager"
        />
        <span className="text-xl font-bold text-white">SatoTrack</span>
      </NavLink>
    </SidebarHeader>
  );

  // Main navigation menu
  const renderNavMenu = () => (
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

  // Footer with user info or login button
  const renderFooter = () => (
    <SidebarFooter>
      {isAuthenticated ? (
        <div className="p-4 border-t border-dashboard-medium flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium truncate max-w-[120px]" title={user?.email || ''}>
                {user?.email || 'Usuário'}
              </p>
              <PlanBadge />
            </div>
          </div>
          
          {user?.securityStatus && user.securityStatus !== 'secure' && (
            <SecurityStatus securityStatus={user.securityStatus} />
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="w-full mt-2 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      ) : (
        <div className="p-4 border-t border-dashboard-medium">
          <Button 
            variant="neon" 
            size="sm" 
            onClick={() => navigate('/auth')} 
            className="w-full justify-start"
          >
            <User className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        </div>
      )}
    </SidebarFooter>
  );

  return (
    <Sidebar variant="sidebar" className="bg-dashboard-dark border-r border-dashboard-medium">
      {renderSidebarHeader()}
      <SidebarContent>
        {renderNavMenu()}
      </SidebarContent>
      {renderFooter()}
    </Sidebar>
  );
};

export default NewAppSidebar;

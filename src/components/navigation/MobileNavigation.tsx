
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Wallet, BarChart3, Bell, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlanBadge } from '../monetization/PlanDisplay';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, userPlan, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPremium = userPlan === 'premium';
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsOpen(false);
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
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  // Check if route is active
  const isActive = (path: string) => location.pathname === path;

  // Navigation items based on authentication state
  const navigationItems = [
    {
      label: 'Início',
      icon: <Home className="h-5 w-5" />,
      href: '/',
      requiresAuth: false
    },
    {
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      href: '/dashboard',
      requiresAuth: true
    },
    {
      label: 'Carteiras',
      icon: <Wallet className="h-5 w-5" />,
      href: '/carteiras',
      requiresAuth: true
    },
    {
      label: 'Mercado',
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/mercado',
      requiresAuth: false
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

  // Filter items based on authentication
  const filteredItems = navigationItems.filter(
    item => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="bg-dashboard-dark border-b border-dashboard-medium/30 sticky top-0 z-50">
      <div className="flex justify-between items-center h-14 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src="/favicon.ico" alt="SatoTrack Logo" className="h-6 w-6" />
            <span className="font-bold text-lg text-white">SatoTrack</span>
          </button>
        </div>
        
        {/* Mobile menu trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] max-w-xs border-dashboard-medium bg-dashboard-dark p-0">
            <div className="flex flex-col h-full">
              {/* Close button and user info */}
              <div className="flex justify-between items-center p-4 border-b border-dashboard-medium/30">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
                
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm truncate max-w-[120px]">{user?.email}</p>
                      <PlanBadge />
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="neon" 
                    size="sm" 
                    onClick={() => {
                      handleNavigation('/auth');
                      setIsOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                )}
              </div>
              
              {/* Navigation links */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                  {filteredItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-md text-sm",
                        isActive(item.href)
                          ? "bg-dashboard-medium/30 text-satotrack-neon"
                          : "text-white hover:bg-dashboard-medium/20"
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Footer actions */}
              {isAuthenticated && (
                <div className="p-4 border-t border-dashboard-medium/30">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-white border-dashboard-medium"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;

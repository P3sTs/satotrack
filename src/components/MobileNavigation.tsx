
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth';
import { 
  Menu, 
  Home, 
  BarChart3, 
  Wallet,
  Plus,
  Settings, 
  LogOut,
  User,
  Star,
  Bell,
  History,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userPlan, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isPremium = userPlan === 'premium';

  // Só renderiza no mobile
  if (!isMobile) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMenuOpen(false);
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast.error("Erro ao realizar logout");
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  const navigationItems = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Visão geral das suas carteiras'
    },
    { 
      to: '/carteiras', 
      label: 'Carteiras', 
      icon: Wallet,
      description: 'Gerenciar suas carteiras Bitcoin'
    },
    { 
      to: '/nova-carteira', 
      label: 'Nova Carteira', 
      icon: Plus,
      description: 'Adicionar nova carteira'
    },
    { 
      to: '/mercado', 
      label: 'Mercado', 
      icon: BarChart3,
      description: 'Análises de mercado Bitcoin'
    },
    { 
      to: '/historico', 
      label: 'Histórico', 
      icon: History,
      description: 'Histórico de transações'
    },
    { 
      to: '/notificacoes', 
      label: 'Notificações', 
      icon: Bell,
      description: 'Alertas e notificações',
      premium: true
    },
    { 
      to: '/configuracoes', 
      label: 'Configurações', 
      icon: Settings,
      description: 'Ajustes da conta'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Header Mobile */}
      <header className="fixed top-0 left-0 right-0 bg-dashboard-dark border-b border-dashboard-medium/30 z-50 md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="Logo SatoTrack" 
                className="h-6 w-6 opacity-80" 
              />
            </div>
            <span className="font-orbitron text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
              SatoTrack
            </span>
          </Link>

          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-satotrack-text hover:text-satotrack-neon"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className="w-80 bg-dashboard-dark border-dashboard-medium p-0"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <SheetHeader className="p-6 border-b border-dashboard-medium">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                        <img 
                          src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                          alt="Logo SatoTrack" 
                          className="h-7 w-7 opacity-80" 
                        />
                      </div>
                      <span className="font-orbitron text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                        SatoTrack
                      </span>
                    </SheetTitle>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-muted-foreground hover:text-satotrack-neon"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* User Info */}
                  {user && (
                    <div className="flex items-center gap-3 mt-4 p-3 bg-dashboard-medium rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-satotrack-neon to-bitcoin flex items-center justify-center">
                        <span className="text-sm font-bold text-black">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-satotrack-text truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className={`h-3 w-3 ${isPremium ? 'text-bitcoin fill-bitcoin' : 'text-muted-foreground'}`} />
                          <span className="text-xs text-muted-foreground">
                            {isPremium ? 'Premium' : 'Gratuito'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </SheetHeader>

                {/* Navigation Items */}
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    const isPremiumFeature = item.premium && !isPremium;
                    
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                          ${active 
                            ? 'bg-satotrack-neon text-black' 
                            : 'text-satotrack-text hover:bg-dashboard-medium hover:text-satotrack-neon'
                          }
                          ${isPremiumFeature ? 'opacity-60' : ''}
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.label}</span>
                            {item.premium && (
                              <Star className="h-3 w-3 text-bitcoin fill-bitcoin" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-dashboard-medium space-y-2">
                  {/* Premium Button */}
                  {!isPremium && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate('/planos');
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 border-bitcoin/50 text-bitcoin hover:bg-bitcoin/10"
                    >
                      <Star className="h-5 w-5" />
                      <span>Quero ser Premium</span>
                    </Button>
                  )}

                  {/* Profile & Logout */}
                  {user && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate('/configuracoes');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start gap-3 text-satotrack-text hover:text-satotrack-neon"
                      >
                        <User className="h-5 w-5" />
                        <span>Meu Perfil</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sair</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Bottom Navigation Bar (Quick Access) */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark border-t border-dashboard-medium/30 md:hidden z-40">
          <div className="flex justify-around items-center h-16 px-2">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive('/dashboard') 
                  ? 'text-satotrack-neon' 
                  : 'text-satotrack-text hover:text-satotrack-neon'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
            
            <Link
              to="/carteiras"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive('/carteiras') 
                  ? 'text-satotrack-neon' 
                  : 'text-satotrack-text hover:text-satotrack-neon'
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Carteiras</span>
            </Link>
            
            <Link
              to="/nova-carteira"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive('/nova-carteira') 
                  ? 'text-satotrack-neon' 
                  : 'text-satotrack-text hover:text-satotrack-neon'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Adicionar</span>
            </Link>
            
            <Link
              to="/mercado"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive('/mercado') 
                  ? 'text-satotrack-neon' 
                  : 'text-satotrack-text hover:text-satotrack-neon'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Mercado</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;

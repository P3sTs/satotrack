
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n/I18nContext';
import { 
  Menu, 
  Home, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  LogOut,
  User,
  Star,
  Languages,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, userPlan } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const isPremium = userPlan === 'premium';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsOpen(false);
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast.error("Erro ao realizar logout");
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
    toast.success(`Idioma alterado para ${newLanguage === 'pt' ? 'Português' : 'English'}`);
  };

  const navigationItems = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Visão geral das suas carteiras'
    },
    { 
      to: '/projections', 
      label: 'Projeções', 
      icon: TrendingUp,
      description: 'Análises e projeções de lucro'
    },
    { 
      to: '/analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Análises avançadas de performance',
      premium: true
    },
    { 
      to: '/settings', 
      label: 'Configurações', 
      icon: Settings,
      description: 'Ajustes da conta e notificações'
    }
  ];

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden text-satotrack-text hover:text-satotrack-neon"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
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
                onClick={() => setIsOpen(false)}
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
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              const isPremiumFeature = item.premium && !isPremium;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${isActive 
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
            {/* Language Toggle */}
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="w-full justify-start gap-3 text-satotrack-text hover:text-satotrack-neon"
            >
              <Languages className="h-5 w-5" />
              <span>{language === 'pt' ? 'English' : 'Português'}</span>
            </Button>

            {/* Premium Button */}
            {!isPremium && (
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/planos');
                  setIsOpen(false);
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
                    navigate('/profile');
                    setIsOpen(false);
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
  );
};

export default MobileNavigation;


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, userPlan, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      setIsMobileMenuOpen(false);
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error('Erro de logout:', error);
      toast.error("Erro ao realizar logout");
    }
  };
  
  // Obter iniciais do usuário para avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  // Verificar se a rota está ativa
  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  
  const handlePremiumClick = () => {
    if (isPremium) {
      handleNavigation('/premium-dashboard');
      toast.success("Bem-vindo ao painel Premium!");
    } else {
      handleNavigation('/planos');
      toast.info("Conheça os benefícios do plano Premium!");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark border-t border-dashboard-medium/30 md:hidden z-50">
      <div className="flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/lovable-uploads/649570ea-d0b0-4784-a1f4-bb7771034ef5.png" alt="Logo SatoTrack" className="h-5 w-5 opacity-80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-full"></div>
            </div>
            <span className="font-orbitron font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">SatoTrack</span>
          </button>
        </div>
        
        {/* Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button 
              className="p-2 text-satotrack-text hover:text-white transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[300px] bg-dashboard-dark border-dashboard-medium p-0"
          >
            <MobileMenu
              user={user}
              isActive={isActive}
              handleNavigation={handleNavigation}
              handleLogout={handleLogout}
              getUserInitials={getUserInitials}
              onClose={() => setIsMobileMenuOpen(false)}
              isPremium={isPremium}
              onPremiumClick={handlePremiumClick}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;

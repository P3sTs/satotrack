
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';
import MobileMenuContainer from './MobileMenuContainer';

const MobileNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, userPlan, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPremium = userPlan === 'premium';
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMobileMenuOpen(false);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Erro de logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout",
        variant: "destructive"
      });
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
      toast({
        title: "Painel Premium",
        description: "Bem-vindo ao seu painel exclusivo premium!",
        variant: "default"
      });
    } else {
      handleNavigation('/planos');
      toast({
        title: "Upgrade disponível",
        description: "Conheça os benefícios do plano Premium!",
        variant: "default"
      });
    }
  };

  return (
    <div className="bg-dashboard-dark border-b border-dashboard-light/10 sticky top-0 z-50">
      <div className="flex justify-between items-center h-14 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/lovable-uploads/649570ea-d0b0-4784-a1f4-bb7771034ef5.png" alt="Logo SatoTrack" className="h-5 w-5 opacity-80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-full"></div>
            </div>
            <span className="font-orbitron font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">SatoTrack</span>
          </button>
        </div>
        
        {/* Gatilho do menu mobile */}
        <MobileMenuContainer
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          isActive={isActive}
          handleNavigation={handleNavigation}
          handleLogout={handleLogout}
          getUserInitials={getUserInitials}
          trigger={<Menu className="h-6 w-6" />}
          isPremium={isPremium}
          onPremiumClick={handlePremiumClick}
        />
      </div>
    </div>
  );
};

export default MobileNavigation;

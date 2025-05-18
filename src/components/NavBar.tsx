
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Star } from 'lucide-react';
import MainNav from './MainNav';
import UserMenu from './navigation/UserMenu';
import { PlanBadge } from './monetization/PlanDisplay';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const { user, signOut, userPlan, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPremium = userPlan === 'premium';
  const isMobile = useIsMobile();
  
  // Debug log to track authentication status
  useEffect(() => {
    console.log("NavBar: Authentication status =", isAuthenticated, "User =", !!user);
  }, [isAuthenticated, user]);
  
  const handleLogout = () => {
    try {
      signOut();
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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  // Handle premium button click
  const handlePremiumClick = () => {
    if (isPremium) {
      navigate('/premium-dashboard');
      toast({
        title: "Painel Premium",
        description: "Bem-vindo ao seu painel exclusivo premium!",
        variant: "default"
      });
    } else {
      navigate('/planos');
      toast({
        title: "Upgrade disponível",
        description: "Conheça os benefícios do plano Premium!",
        variant: "default"
      });
    }
  };

  // Don't render on mobile as we have MobileNavigation
  if (isMobile) {
    return null;
  }

  return (
    <header className="bg-dashboard-dark text-white sticky top-0 z-50 border-b border-dashboard-medium/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" alt="SatoTrack Logo" className="h-6 w-6 md:h-8 md:w-8" />
              <span className="font-orbitron text-lg md:text-xl font-bold text-transparent bg-clip-text bg-satotrack-logo-gradient">
                SatoTrack
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <MainNav />
          </div>
          
          {/* Premium Button for all users */}
          <Button 
            variant={isPremium ? "bitcoin" : "outline"} 
            size="sm"
            className={`mr-2 hidden md:flex items-center ${isPremium ? 'bg-bitcoin hover:bg-bitcoin/90 text-white' : 'border-bitcoin/50 text-bitcoin hover:bg-bitcoin/10'}`}
            onClick={handlePremiumClick}
          >
            <Star className={`h-4 w-4 mr-1 ${isPremium ? 'fill-white' : ''}`} />
            {isPremium ? 'Premium' : 'Quero ser Premium'}
          </Button>
          
          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-2">
            {user && <PlanBadge />}
            <UserMenu 
              user={user} 
              getUserInitials={getUserInitials} 
              handleLogout={handleLogout}
              navigate={navigate} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

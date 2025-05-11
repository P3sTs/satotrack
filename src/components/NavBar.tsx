import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Menu, X, LogOut, User, Wallet, Mail } from 'lucide-react';
import UserSettings from './UserSettings';
import MainNav from './MainNav';
import { SecurityIndicator } from './SecurityIndicator';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMobileMenuOpen(false); // Close mobile menu after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Handle navigation in mobile menu
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const MobileMenu = () => (
    <div className="space-y-3 py-3">
      {user && (
        <div className="flex flex-col items-center py-4 mb-2 border-b border-dashboard-medium/30">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-satotrack-text mt-1">Usuário SatoTrack</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => handleNavigation('/')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Início
      </button>
      
      {user && (
        <>
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/dashboard') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button 
            onClick={() => handleNavigation('/carteiras')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/carteiras') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Gerenciar Carteiras
          </button>
          <button 
            onClick={() => handleNavigation('/nova-carteira')}
            className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/nova-carteira') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'} ml-6`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Nova Carteira
          </button>
        </>
      )}
      
      <button 
        onClick={() => handleNavigation('/sobre')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/sobre') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Sobre
      </button>

      <button 
        onClick={() => handleNavigation('/privacidade')}
        className={`flex w-full items-center py-2 px-4 rounded-md ${isActive('/privacidade') ? 'bg-dashboard-medium/30 text-satotrack-neon' : 'hover:bg-dashboard-medium/20'}`}
      >
        <User className="h-4 w-4 mr-2" />
        Privacidade
      </button>
      
      <div className="pt-2 border-t border-dashboard-medium/30 mt-2">
        {user ? (
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        ) : (
          <Button 
            variant="neon" 
            className="w-full justify-start" 
            onClick={() => {
              navigate('/auth');
              setIsMobileMenuOpen(false);
            }}
          >
            <User className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        )}
      </div>
    </div>
  );

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
          
          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <SecurityIndicator />
                <div className="flex items-center gap-2 border-l border-dashboard-medium/30 pl-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <UserSettings />
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-1">
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <Button variant="neon" size="sm" onClick={() => navigate('/auth')}>
                <User className="h-4 w-4 mr-1" />
                Entrar
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          {isMobile ? (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[350px] bg-dashboard-dark border-dashboard-medium/30">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between py-4 border-b border-dashboard-medium/30">
                    <div className="flex items-center gap-2">
                      <img src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" alt="SatoTrack Logo" className="h-6 w-6" />
                      <span className="font-orbitron text-lg font-bold text-transparent bg-clip-text bg-satotrack-logo-gradient">
                        SatoTrack
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <MobileMenu />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-dashboard-dark border-dashboard-medium/30 text-white">
                <MobileMenu />
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;

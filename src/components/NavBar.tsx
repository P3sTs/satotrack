
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Menu, X, LogOut, User, Wallet } from 'lucide-react';
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

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const MobileMenu = () => (
    <div className="space-y-3 py-3">
      <Link 
        to="/" 
        className="block py-2 px-4 rounded-md hover:bg-dashboard-medium/20"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Início
      </Link>
      
      {user && (
        <>
          <Link 
            to="/dashboard" 
            className="block py-2 px-4 rounded-md hover:bg-dashboard-medium/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/carteiras" 
            className="flex items-center py-2 px-4 rounded-md hover:bg-dashboard-medium/20"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Gerenciar Carteiras
          </Link>
          <Link 
            to="/nova-carteira" 
            className="flex items-center py-2 px-4 rounded-md hover:bg-dashboard-medium/20 ml-6"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Nova Carteira
          </Link>
        </>
      )}
      
      <Link 
        to="/sobre" 
        className="block py-2 px-4 rounded-md hover:bg-dashboard-medium/20"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Sobre
      </Link>
      
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <MainNav />
          </div>
          
          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <SecurityIndicator />
                <UserSettings />
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
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

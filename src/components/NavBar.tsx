
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, Eye, Wallet, BarChart2, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserSettings from './UserSettings';
import NewWalletModal from './NewWalletModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";

const NavBar: React.FC = () => {
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const mainNavItems = [
    { 
      label: 'Dashboard', 
      href: '/dashboard', 
      icon: <BarChart2 className="w-4 h-4 mr-2" />,
      onlyAuthenticated: true
    },
    { 
      label: 'Carteiras', 
      href: '/carteiras', 
      icon: <Wallet className="w-4 h-4 mr-2" />,
      onlyAuthenticated: true
    },
    { 
      label: 'Mercado', 
      href: '/', 
      icon: <BarChart2 className="w-4 h-4 mr-2" />,
      onlyAuthenticated: false
    }
  ];

  return (
    <nav className="sticky top-0 z-30 w-full bg-dashboard-dark/90 backdrop-blur-sm border-b border-satotrack-neon/10 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative transition-all duration-300 group-hover:scale-110">
              <img 
                src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
                alt="SatoTrack Logo" 
                className="h-8 w-8 object-contain satotrack-logo"
              />
            </div>
            <span className="font-orbitron font-bold text-xl tracking-wider text-white">
              <span className="satotrack-gradient-text">SatoTrack</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {mainNavItems
              .filter(item => !item.onlyAuthenticated || (item.onlyAuthenticated && user))
              .map((item, i) => (
                <Link 
                  key={i} 
                  to={item.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-satotrack-neon
                    ${location.pathname === item.href ? 'text-satotrack-neon' : 'text-gray-300'}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))
            }
          </div>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="neon"
                  size="sm"
                  onClick={() => setIsNewWalletModalOpen(true)}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Carteira
                </Button>
                <UserSettings />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white hover:bg-dashboard-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </>
            ) : (
              location.pathname !== '/auth' && (
                <Link to="/auth">
                  <Button 
                    variant="neon" 
                    size="sm"
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center p-2 text-gray-200 hover:text-satotrack-neon transition-colors border border-transparent rounded-md hover:border-satotrack-neon/20"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dashboard-dark/95 backdrop-blur-md border-t border-satotrack-neon/10 animate-fade-in">
          <div className="container mx-auto py-3 px-4">
            <div className="space-y-4 py-4">
              {mainNavItems
                .filter(item => !item.onlyAuthenticated || (item.onlyAuthenticated && user))
                .map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.href}
                    className={`flex items-center py-2 text-base font-medium transition-colors hover:text-satotrack-neon
                      ${location.pathname === item.href ? 'text-satotrack-neon' : 'text-gray-300'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))
              }
              
              <div className="pt-4 border-t border-satotrack-neon/10">
                {user ? (
                  <>
                    <Button 
                      variant="neon"
                      onClick={() => {
                        setIsNewWalletModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full mb-3 justify-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Nova Carteira
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full justify-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Sair
                    </Button>
                  </>
                ) : (
                  location.pathname !== '/auth' && (
                    <Link to="/auth" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="neon" 
                        className="w-full justify-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Login
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </nav>
  );
};

export default NavBar;

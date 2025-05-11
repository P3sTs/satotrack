
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, User, Wallet } from 'lucide-react';
import UserSettings from './UserSettings';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-dashboard-dark text-white sticky top-0 z-50 border-b border-dashboard-medium/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" alt="SatoTrack Logo" className="h-8 w-8" />
              <span className="font-orbitron text-xl font-bold text-transparent bg-clip-text bg-satotrack-logo-gradient">
                SatoTrack
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'font-medium text-satotrack-neon' : ''}`}>
              Início
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'font-medium text-satotrack-neon' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/carteiras" className={`nav-link ${location.pathname === '/carteiras' ? 'font-medium text-satotrack-neon' : ''}`}>
                  Carteiras
                </Link>
              </>
            )}
            
            <Link to="/sobre" className={`nav-link ${location.pathname === '/sobre' ? 'font-medium text-satotrack-neon' : ''}`}>
              Sobre
            </Link>
          </nav>
          
          {/* Auth actions */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
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
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-40 bg-dashboard-dark border-t border-dashboard-medium/30 shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link 
              to="/" 
              className={`block py-2 px-4 rounded-md ${location.pathname === '/' ? 'font-medium text-satotrack-neon bg-dashboard-medium/20' : 'hover:bg-dashboard-medium/20'}`}
              onClick={toggleMobileMenu}
            >
              Início
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block py-2 px-4 rounded-md ${location.pathname === '/dashboard' ? 'font-medium text-satotrack-neon bg-dashboard-medium/20' : 'hover:bg-dashboard-medium/20'}`}
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/carteiras" 
                  className={`flex items-center py-2 px-4 rounded-md ${location.pathname === '/carteiras' ? 'font-medium text-satotrack-neon bg-dashboard-medium/20' : 'hover:bg-dashboard-medium/20'}`}
                  onClick={toggleMobileMenu}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Gerenciar Carteiras
                </Link>
              </>
            )}
            
            <Link 
              to="/sobre" 
              className={`block py-2 px-4 rounded-md ${location.pathname === '/sobre' ? 'font-medium text-satotrack-neon bg-dashboard-medium/20' : 'hover:bg-dashboard-medium/20'}`}
              onClick={toggleMobileMenu}
            >
              Sobre
            </Link>
            
            <div className="pt-2 border-t border-dashboard-medium/30 mt-2">
              {user ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="neon" 
                  className="w-full justify-start" 
                  onClick={() => {
                    navigate('/auth');
                    toggleMobileMenu();
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;

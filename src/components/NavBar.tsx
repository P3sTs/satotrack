
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserSettings from './UserSettings';
import NewWalletModal from './NewWalletModal';
import { useAuth } from '../contexts/AuthContext';

const NavBar: React.FC = () => {
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-dashboard-dark/90 backdrop-blur-sm border-b border-satotrack-neon/10 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
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
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {location.pathname !== '/dashboard' && (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10">
                    Dashboard
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsNewWalletModalOpen(true)}
                className="hidden md:flex items-center border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova Carteira
              </Button>
              
              <Button 
                onClick={() => setIsNewWalletModalOpen(true)}
                size="icon" 
                variant="outline"
                className="md:hidden border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <UserSettings />
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-dashboard-medium"
              >
                Sair
              </Button>
            </>
          ) : (
            location.pathname !== '/auth' && (
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-satotrack-neon/50 text-satotrack-neon hover:bg-satotrack-neon/10"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </nav>
  );
};

export default NavBar;

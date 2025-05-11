
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bitcoin, Plus } from 'lucide-react';
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
    <nav className="sticky top-0 z-10 w-full bg-card/80 backdrop-blur-sm border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Bitcoin className="h-6 w-6 text-bitcoin" />
          <span className="font-bold text-xl tracking-tight">SatoTrack</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {location.pathname !== '/dashboard' && (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsNewWalletModalOpen(true)}
                className="hidden md:flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova Carteira
              </Button>
              
              <Button 
                onClick={() => setIsNewWalletModalOpen(true)}
                size="icon" 
                variant="outline"
                className="md:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <UserSettings />
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            location.pathname !== '/auth' && (
              <Link to="/auth">
                <Button variant="outline" size="sm">
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

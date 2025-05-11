
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBarLinks from './NavBarLinks';
import { NavItem } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  navItems: NavItem[];
  onNewWalletClick: () => void;
  onNavItemClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  navItems, 
  onNewWalletClick,
  onNavItemClick
}) => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!isOpen) return null;

  const filteredItems = navItems.filter(item => 
    !item.onlyAuthenticated || (item.onlyAuthenticated && user)
  );
  
  return (
    <div className="md:hidden bg-dashboard-dark/95 backdrop-blur-md border-t border-satotrack-neon/10 animate-fade-in">
      <div className="container mx-auto py-3 px-4">
        <div className="space-y-4 py-4">
          <NavBarLinks 
            items={filteredItems} 
            isMobile={true}
            onMobileItemClick={onNavItemClick}
          />
          
          <div className="pt-4 border-t border-satotrack-neon/10">
            {user ? (
              <>
                <Button 
                  variant="neon"
                  onClick={() => {
                    onNewWalletClick();
                    onNavItemClick();
                  }}
                  className="w-full mb-3 justify-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Carteira
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    onNavItemClick();
                  }}
                  className="w-full justify-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth" className="block w-full" onClick={onNavItemClick}>
                <Button 
                  variant="neon" 
                  className="w-full justify-center"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;

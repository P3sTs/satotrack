
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserSettings from '../UserSettings';
import NavBarLinks from './NavBarLinks';
import { NavItem } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface DesktopNavProps {
  navItems: NavItem[];
  onNewWalletClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navItems, onNewWalletClick }) => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const filteredItems = navItems.filter(item => 
    !item.onlyAuthenticated || (item.onlyAuthenticated && user)
  );
  
  return (
    <>
      <div className="hidden md:flex items-center space-x-6">
        <NavBarLinks items={filteredItems} />
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <Button 
              variant="neon"
              size="sm"
              onClick={onNewWalletClick}
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
        )}
      </div>
    </>
  );
};

export default DesktopNav;

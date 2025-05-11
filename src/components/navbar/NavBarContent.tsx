
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart2, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NavBarLogo from './NavBarLogo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import MobileMenuButton from './MobileMenuButton';
import { NavItem } from './types';

interface NavBarContentProps {
  onNewWalletClick: () => void;
}

const NavBarContent: React.FC<NavBarContentProps> = ({ onNewWalletClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const mainNavItems: NavItem[] = [
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
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <NavBarLogo />
        
        <DesktopNav 
          navItems={mainNavItems} 
          onNewWalletClick={onNewWalletClick} 
        />
        
        <MobileMenuButton 
          isOpen={isMobileMenuOpen} 
          onClick={toggleMobileMenu} 
        />
      </div>
      
      <MobileNav 
        isOpen={isMobileMenuOpen}
        navItems={mainNavItems}
        onNewWalletClick={onNewWalletClick}
        onNavItemClick={closeMobileMenu}
      />
    </div>
  );
};

export default NavBarContent;

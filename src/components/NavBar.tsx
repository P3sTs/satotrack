
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBarContent from './navbar/NavBarContent';
import NewWalletModal from './NewWalletModal';

const NavBar: React.FC = () => {
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const location = useLocation();

  const handleOpenNewWalletModal = () => {
    setIsNewWalletModalOpen(true);
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-dashboard-dark/90 backdrop-blur-sm border-b border-satotrack-neon/10 shadow-md transition-all duration-300">
      <NavBarContent onNewWalletClick={handleOpenNewWalletModal} />
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </nav>
  );
};

export default NavBar;

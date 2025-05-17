
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { AuthUser } from '@/contexts/auth/types';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';
import { useLocation } from 'react-router-dom';

export interface MobileMenuContainerProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  user: AuthUser | null;
  isActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
  handleLogout: () => void;
  getUserInitials: () => string;
  trigger: React.ReactNode;
  isPremium?: boolean;
  onPremiumClick?: () => void;
}

const MobileMenuContainer: React.FC<MobileMenuContainerProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  isActive,
  handleNavigation,
  handleLogout,
  getUserInitials,
  trigger,
  isPremium = false,
  onPremiumClick,
}) => {
  const location = useLocation();
  
  // Fecha o menu quando a rota mudar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);
  
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Menu">
        {trigger}
      </Button>
      <SheetContent side="right" className="w-full max-w-xs p-0">
        <MobileMenu
          user={user}
          isActive={isActive}
          handleNavigation={handleNavigation}
          handleLogout={handleLogout}
          getUserInitials={getUserInitials}
          onClose={() => setIsMobileMenuOpen(false)}
          isPremium={isPremium}
          onPremiumClick={onPremiumClick}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuContainer;

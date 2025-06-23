
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from './mobile/MobileHeader';
import MobileMenuContent from './mobile/MobileMenuContent';
import MobileBottomNavigation from './mobile/MobileBottomNavigation';
import { useMobileNavigation } from './mobile/hooks/useMobileNavigation';

const MobileNavigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  const {
    isMenuOpen,
    setIsMenuOpen,
    handleLogout,
    getUserInitials,
    navigationItems
  } = useMobileNavigation();

  // Só renderiza no mobile
  if (!isMobile) {
    return null;
  }

  console.log('MobileNavigation renderizando - isMobile:', isMobile, 'isAuthenticated:', isAuthenticated, 'isMenuOpen:', isMenuOpen);

  return (
    <>
      {/* Top Header Mobile */}
      <MobileHeader 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Side Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent 
          side="right" 
          className="w-80 bg-dashboard-dark border-dashboard-medium p-0 z-[60]"
        >
          <MobileMenuContent 
            setIsMenuOpen={setIsMenuOpen}
            handleLogout={handleLogout}
            getUserInitials={getUserInitials}
            navigationItems={navigationItems}
          />
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation Bar (Quick Access) */}
      {isAuthenticated && <MobileBottomNavigation />}
    </>
  );
};

export default MobileNavigation;

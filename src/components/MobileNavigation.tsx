
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

  // Só renderiza no mobile E quando usuário está autenticado
  if (!isMobile || !isAuthenticated) {
    return null;
  }

  return (
    <div className="md:hidden">
      {/* Top Header Mobile */}
      <MobileHeader 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Side Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent 
          side="right" 
          className="w-80 bg-dashboard-dark border-dashboard-medium p-0 z-[200]"
        >
          <MobileMenuContent 
            setIsMenuOpen={setIsMenuOpen}
            handleLogout={handleLogout}
            getUserInitials={getUserInitials}
            navigationItems={navigationItems}
          />
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation Bar - Always visible when authenticated */}
      <MobileBottomNavigation />
    </div>
  );
};

export default MobileNavigation;

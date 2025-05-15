
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import MobileMenu from './MobileMenu';
import { AuthUser } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileMenuContainerProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  user: AuthUser | null;
  isActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
  handleLogout: () => Promise<void>;
  getUserInitials: () => string;
  trigger: React.ReactNode;
}

const MobileMenuContainer: React.FC<MobileMenuContainerProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  isActive,
  handleNavigation,
  handleLogout,
  getUserInitials,
  trigger
}) => {
  // Use the isMobile hook directly in the component
  const isMobile = useIsMobile();
  
  const mobileMenuProps = {
    user,
    isActive,
    handleNavigation,
    handleLogout,
    getUserInitials,
    setIsMobileMenuOpen
  };

  if (isMobile) {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] sm:w-[350px] bg-dashboard-dark border-dashboard-medium/30 z-50">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between py-4 border-b border-dashboard-medium/30">
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" alt="SatoTrack Logo" className="h-6 w-6" />
                <span className="font-orbitron text-lg font-bold text-transparent bg-clip-text bg-satotrack-logo-gradient">
                  SatoTrack
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <MobileMenu {...mobileMenuProps} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="bg-dashboard-dark border-dashboard-medium/30 text-white z-50 max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <MobileMenu {...mobileMenuProps} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenuContainer;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-dashboard-dark border-b border-dashboard-medium/30 z-50 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
            <img 
              src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
              alt="Logo SatoTrack" 
              className="h-6 w-6 opacity-80" 
            />
          </div>
          <span className="font-orbitron text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
            SatoTrack
          </span>
        </Link>

        {/* Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-satotrack-text hover:text-satotrack-neon relative z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileHeader;

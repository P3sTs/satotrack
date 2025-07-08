
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-md border-b border-dashboard-medium/30 z-50 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/home"} className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
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

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          
          {/* Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-satotrack-text hover:text-satotrack-neon relative z-[60] hover:bg-dashboard-medium/50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;


import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen
}) => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  return (
    <div className="fixed top-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-lg border-b border-dashboard-medium/30 md:hidden z-50">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
            alt="SatoTrack" 
            className="h-8 w-8 rounded-full"
          />
          <span className="font-orbitron text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
            SatoTrack
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isPremium && (
            <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon text-xs">
              Premium
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-satotrack-text hover:text-satotrack-neon"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-satotrack-text hover:text-satotrack-neon"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;

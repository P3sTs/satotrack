
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { SecurityStatus } from '../auth/SecurityStatus';
import UserSettings from '../UserSettings';
import { AuthUser } from '@/contexts/auth/types';
import { PlanBadge } from '../monetization/PlanDisplay';

interface UserMenuProps {
  user: AuthUser | null;
  getUserInitials: () => string;
  handleLogout: () => void;
  navigate: (path: string) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, getUserInitials, handleLogout, navigate }) => {
  if (!user) {
    return (
      <Button variant="neon" size="sm" onClick={() => navigate('/auth')}>
        <User className="h-4 w-4 mr-1" />
        Entrar
      </Button>
    );
  }

  // Use the global securityStatus from context or fallback to 'secure'
  const securityStatus = user.securityStatus || 'secure';

  return (
    <div className="flex items-center gap-3">
      <SecurityStatus securityStatus={securityStatus} />
      <div className="flex items-center gap-2 border-l border-dashboard-medium/30 pl-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden lg:block">
          <p className="text-sm font-medium truncate max-w-[120px]" title={user.email || ''}>
            {user.email}
          </p>
          <div className="flex items-center gap-1">
            <PlanBadge />
          </div>
        </div>
        <UserSettings />
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout} 
        className="ml-1"
        aria-label="Sair da conta"
      >
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </div>
  );
};

export default UserMenu;

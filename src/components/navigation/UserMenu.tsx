
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { SecurityIndicator } from '../SecurityIndicator';
import UserSettings from '../UserSettings';
import { AuthUser } from '@/contexts/auth/types';

interface UserMenuProps {
  user: AuthUser | null;
  getUserInitials: () => string;
  handleLogout: () => Promise<void>;
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

  return (
    <div className="flex items-center gap-3">
      <SecurityIndicator />
      <div className="flex items-center gap-2 border-l border-dashboard-medium/30 pl-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden lg:block">
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <UserSettings />
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-1">
        <LogOut className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </div>
  );
};

export default UserMenu;

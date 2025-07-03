
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  Shield,
  Key,
  Zap,
  TrendingUp
} from 'lucide-react';

const MainNavigation: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-end flex-1">
        <div className="flex items-center gap-2">
          <Link to="/sobre">
            <Button variant="ghost" size="sm">Sobre</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90">
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end flex-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-satotrack-text">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.email}</span>
        </div>
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default MainNavigation;

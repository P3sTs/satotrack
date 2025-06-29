
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
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/carteiras', icon: Wallet, label: 'Carteiras' },
    { path: '/crypto', icon: Shield, label: 'Crypto Seguro' },
    { path: '/kms', icon: Key, label: 'KMS' },
    { path: '/web3', icon: Zap, label: 'Web3' },
    { path: '/mercado', icon: TrendingUp, label: 'Mercado' },
    { path: '/crypto-security', icon: Shield, label: 'Segurança' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  if (!isAuthenticated) {
    return (
      <nav className="bg-dashboard-medium border-b border-satotrack-neon/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
              alt="SatoTrack" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-satotrack-neon">SatoTrack</span>
          </Link>
          
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
      </nav>
    );
  }

  return (
    <nav className="bg-dashboard-medium border-b border-satotrack-neon/20 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
            alt="SatoTrack" 
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-satotrack-neon">SatoTrack</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navigationItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path}>
              <Button
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                className={`gap-2 ${
                  isActive(path) 
                    ? 'bg-satotrack-neon text-black' 
                    : 'text-satotrack-text hover:text-satotrack-neon'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

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
      
      {/* Mobile Navigation */}
      <div className="md:hidden mt-3 flex overflow-x-auto gap-2 pb-2">
        {navigationItems.map(({ path, icon: Icon, label }) => (
          <Link key={path} to={path} className="flex-shrink-0">
            <Button
              variant={isActive(path) ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${
                isActive(path) 
                  ? 'bg-satotrack-neon text-black' 
                  : 'text-satotrack-text hover:text-satotrack-neon'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MainNavigation;

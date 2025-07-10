import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, RefreshCw, Diamond, Compass } from 'lucide-react';

const NativeBottomNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Página Inicial' },
    { to: '/mercado', icon: TrendingUp, label: 'Em alta' },
    { to: '/swap', icon: RefreshCw, label: 'Swap' },
    { to: '/earn', icon: Diamond, label: 'Earn' },
    { to: '/discover', icon: Compass, label: 'Descubra' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-lg border-t border-dashboard-medium/30 z-40">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isActive(to) 
                ? 'text-satotrack-neon' 
                : 'text-satotrack-text hover:text-satotrack-neon'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs text-center leading-tight max-w-full truncate">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NativeBottomNav;
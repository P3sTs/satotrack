
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Plus, BarChart3, Zap } from 'lucide-react';

const MobileBottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/carteiras', icon: Wallet, label: 'Carteiras' },
    { to: '/nova-carteira', icon: Plus, label: 'Adicionar' },
    { to: '/mercado', icon: BarChart3, label: 'Mercado' },
    { to: '/web3', icon: Zap, label: 'Web3' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark border-t border-dashboard-medium/50 md:hidden z-[100] safe-area-pb">
      <div className="flex justify-around items-center h-16 px-2 bg-dashboard-dark/95 backdrop-blur-lg">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isActive(to) 
                ? 'text-satotrack-neon bg-satotrack-neon/10' 
                : 'text-satotrack-text hover:text-satotrack-neon hover:bg-dashboard-medium/30'
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs truncate font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;

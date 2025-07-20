
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Plus, BarChart3, Zap } from 'lucide-react';

const MobileBottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/carteiras', icon: Wallet, label: 'Carteiras' },
    { to: '/web3', icon: Zap, label: 'Web3' },
    { to: '/nova-carteira', icon: Plus, label: 'Adicionar' },
    { to: '/mercado', icon: BarChart3, label: 'Mercado' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-lg border-t border-dashboard-medium/30 md:hidden z-50">
      <div className="flex justify-around items-center h-16 px-2">
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
            <Icon className="h-5 w-5" />
            <span className="text-xs truncate">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;

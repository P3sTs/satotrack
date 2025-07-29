
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, TrendingUp, Lock, Wrench } from 'lucide-react';

const NativeBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/web3', icon: Wallet, label: 'Web3' },
    { path: '/earn', icon: TrendingUp, label: 'Earn' },
    { path: '/staking', icon: Lock, label: 'Staking' },
    { path: '/tools', icon: Wrench, label: 'Tools' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark/95 backdrop-blur-lg border-t border-satotrack-neon/20 z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-satotrack-neon bg-satotrack-neon/10'
                  : 'text-muted-foreground hover:text-satotrack-text'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive(item.path) ? 'text-satotrack-neon' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NativeBottomNav;

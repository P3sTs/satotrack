
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { Home, Wallet, Plus, Zap, BarChart3, Clock, Bell, Settings } from 'lucide-react';

const MainNav: React.FC = () => {
  const location = useLocation();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/carteiras', label: 'Carteiras', icon: Wallet },
    { path: '/web3', label: 'Web3', icon: Zap },
    { path: '/nova-carteira', label: 'Nova Carteira', icon: Plus },
    { path: '/mercado', label: 'Mercado', icon: BarChart3 },
    { path: '/historico', label: 'Histórico', icon: Clock },
    { path: '/notificacoes', label: 'Notificações', icon: Bell, premium: true },
    { path: '/configuracoes', label: 'Configurações', icon: Settings }
  ];
  
  return (
    <nav className="flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hidden bg-dashboard-dark/50 rounded-lg p-2">
      {navItems.map(({ path, label, icon, premium }) => (
        <Link
          key={path}
          to={path}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap relative min-w-fit",
            isActive(path)
              ? 'text-white bg-satotrack-neon/20 border border-satotrack-neon/30 shadow-sm'
              : 'text-satotrack-text hover:text-white hover:bg-dashboard-medium/50 border border-transparent',
            premium && !isPremium && 'opacity-60'
          )}
          aria-current={isActive(path) ? 'page' : undefined}
        >
          {label}
          {premium && !isPremium && (
            <span className="absolute -top-1 -right-1 text-xs bg-bitcoin text-white px-1 rounded-full text-[10px]">
              PRO
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;

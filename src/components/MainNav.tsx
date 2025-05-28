
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/carteiras', label: 'Carteiras' },
    { path: '/nova-carteira', label: 'Nova Carteira' },
    { path: '/mercado', label: 'Mercado BTC' },
    { path: '/crypto', label: 'Redes Crypto' },
    { path: '/configuracoes', label: 'Configurações' },
  ];
  
  return (
    <nav className="flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hidden">
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={cn(
            "px-2 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
            isActive(path)
              ? 'text-satotrack-neon bg-dashboard-light'
              : 'text-muted-foreground hover:text-white hover:bg-dashboard-light/50'
          )}
          aria-current={isActive(path) ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;

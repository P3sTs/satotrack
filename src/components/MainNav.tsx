
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/carteiras', label: 'Carteiras' },
    { path: '/mercado', label: 'Mercado BTC' },
    { path: '/crypto', label: 'Redes Crypto' },
  ];
  
  return (
    <nav className="flex space-x-2 md:space-x-4">
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`px-2 py-1 text-sm font-medium rounded-md transition-colors
            ${isActive(path)
              ? 'text-satotrack-neon bg-dashboard-light'
              : 'text-muted-foreground hover:text-white hover:bg-dashboard-light/50'
            }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;

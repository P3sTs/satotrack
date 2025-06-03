
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';

const MainNav: React.FC = () => {
  const location = useLocation();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/carteiras', label: 'Carteiras' },
    { path: '/bitcoin-lookup', label: 'Consulta BTC' },
    { path: '/nova-carteira', label: 'Nova Carteira' },
    { path: '/mercado', label: 'Mercado BTC' },
    { path: '/crypto', label: 'Redes Crypto' },
    { path: '/referral', label: 'Indicações' },
    { path: '/configuracoes', label: 'Configurações' },
    // Itens Premium condicionais
    ...(isPremium ? [
      { path: '/api', label: 'API', premium: true },
      { path: '/historico', label: 'Histórico', premium: true },
      { path: '/notificacoes', label: 'Alertas', premium: true },
    ] : [])
  ];
  
  return (
    <nav className="flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hidden">
      {navItems.map(({ path, label, premium }) => (
        <Link
          key={path}
          to={path}
          className={cn(
            "px-2 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap relative",
            isActive(path)
              ? 'text-satotrack-neon bg-dashboard-light'
              : 'text-muted-foreground hover:text-white hover:bg-dashboard-light/50',
            premium && 'border border-bitcoin/30'
          )}
          aria-current={isActive(path) ? 'page' : undefined}
        >
          {label}
          {premium && (
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


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  History,
  Settings,
  CircleDollarSign,
  Bell,
  Code,
  Lock,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  premiumOnly?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, premiumOnly = false }) => {
  const location = useLocation();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const active = location.pathname === to;
  
  return (
    <NavLink
      to={premiumOnly && !isPremium ? '/planos' : to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-white',
          {
            'bg-dashboard-medium text-white': isActive,
            'hover:bg-dashboard-medium/50': !isActive,
            'relative': premiumOnly && !isPremium
          }
        )
      }
    >
      {icon}
      <span>{label}</span>
      
      {premiumOnly && !isPremium && (
        <Lock className="h-3.5 w-3.5 absolute right-2 text-satotrack-neon" />
      )}
    </NavLink>
  );
};

const SidebarNavigation: React.FC = () => {
  const { isAuthenticated, userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-1">
      <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
      <SidebarLink to="/carteiras" icon={<Wallet className="h-5 w-5" />} label="Carteiras" />
      <SidebarLink to="/historico" icon={<History className="h-5 w-5" />} label="Histórico" />
      <SidebarLink 
        to="/projecao-lucros" 
        icon={<TrendingUp className="h-5 w-5" />} 
        label="Projeção de Lucros" 
        premiumOnly={true}
      />
      <SidebarLink to="/notificacoes" icon={<Bell className="h-5 w-5" />} label="Notificações" />
      {isPremium && (
        <SidebarLink to="/api-docs" icon={<Code className="h-5 w-5" />} label="API Docs" />
      )}
      <SidebarLink to="/configuracoes" icon={<Settings className="h-5 w-5" />} label="Configurações" />
    </div>
  );
};

export default SidebarNavigation;

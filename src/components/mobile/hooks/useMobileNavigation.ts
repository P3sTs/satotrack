
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { 
  Home, 
  BarChart3, 
  Wallet,
  Plus,
  Settings, 
  Bell,
  History
} from 'lucide-react';

export const useMobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userPlan } = useAuth();
  const navigate = useNavigate();
  const isPremium = userPlan === 'premium';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMenuOpen(false);
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast.error("Erro ao realizar logout");
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  const navigationItems = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Visão geral das suas carteiras'
    },
    { 
      to: '/carteiras', 
      label: 'Carteiras', 
      icon: Wallet,
      description: 'Gerenciar suas carteiras Bitcoin'
    },
    { 
      to: '/nova-carteira', 
      label: 'Nova Carteira', 
      icon: Plus,
      description: 'Adicionar nova carteira'
    },
    { 
      to: '/mercado', 
      label: 'Mercado', 
      icon: BarChart3,
      description: 'Análises de mercado Bitcoin'
    },
    { 
      to: '/historico', 
      label: 'Histórico', 
      icon: History,
      description: 'Histórico de transações'
    },
    { 
      to: '/notificacoes', 
      label: 'Notificações', 
      icon: Bell,
      description: 'Alertas e notificações',
      premium: true
    },
    { 
      to: '/configuracoes', 
      label: 'Configurações', 
      icon: Settings,
      description: 'Ajustes da conta'
    }
  ];

  return {
    isMenuOpen,
    setIsMenuOpen,
    handleLogout,
    getUserInitials,
    navigationItems,
    navigate
  };
};

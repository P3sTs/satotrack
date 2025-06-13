
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/sonner';

const RouteValidator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Rotas que precisam de autenticação
    const protectedRoutes = [
      '/dashboard',
      '/carteiras',
      '/nova-carteira',
      '/carteira',
      '/configuracoes',
      '/mercado',
      '/historico',
      '/projecao',
      '/web3'
    ];

    // Verificar se a rota atual requer autenticação
    const requiresAuth = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    );

    if (requiresAuth && !isAuthenticated) {
      console.log('🔒 Acesso negado - usuário não autenticado:', currentPath);
      toast.error('Você precisa estar logado para acessar esta página');
      navigate('/auth');
      return;
    }

    // Redirecionar usuários logados da página de auth
    if (currentPath === '/auth' && isAuthenticated) {
      console.log('✅ Usuário já autenticado, redirecionando para dashboard');
      navigate('/dashboard');
      return;
    }

    // Validar rotas de carteira específica
    if (currentPath.startsWith('/carteira/') && currentPath !== '/carteiras') {
      const walletId = currentPath.split('/')[2];
      if (!walletId || walletId.length < 10) {
        console.log('❌ ID de carteira inválido:', walletId);
        toast.error('Carteira não encontrada');
        navigate('/carteiras');
        return;
      }
    }

    // Log de navegação em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🧭 Navegação validada:', {
        path: currentPath,
        authenticated: isAuthenticated,
        userId: user?.id?.substring(0, 8) + '...'
      });
    }
  }, [location.pathname, isAuthenticated, user, navigate]);

  return null;
};

export default RouteValidator;

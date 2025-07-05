
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

const RouteValidator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Não fazer nada se ainda está carregando
    if (loading) return;

    const currentPath = location.pathname;
    
    // Rotas que precisam de autenticação
    const protectedRoutes = [
      '/dashboard',
      '/carteiras',
      '/wallets',
      '/nova-carteira',
      '/carteira',
      '/configuracoes',
      '/historico',
      '/historico-premium',
      '/projecao',
      '/projecao-premium',
      '/projections',
      '/performance',
      '/wallet-comparison',
      '/web3',
      '/onchain',
      '/growth',
      '/api',
      '/api-docs',
      '/alerts',
      '/notificacoes',
      '/notificacoes-premium',
      '/referral',
      '/achievements',
      '/planos',
      '/checkout-success',
      '/crypto-security',
      '/crypto',
      '/crypto-3d',
      '/mercado',
      '/bitcoin-lookup',
      '/kms',
      '/enderecos',
      '/qrcode',
      '/tx'
    ];

    // Verificar se a rota atual requer autenticação
    const requiresAuth = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    );

    // Apenas bloquear acesso se for rota protegida E usuário não autenticado
    if (requiresAuth && !isAuthenticated) {
      console.log('🔒 Acesso negado - usuário não autenticado:', currentPath);
      toast.error('Você precisa estar logado para acessar esta página');
      navigate('/auth');
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
  }, [location.pathname, isAuthenticated, loading]);

  return null;
};

export default RouteValidator;

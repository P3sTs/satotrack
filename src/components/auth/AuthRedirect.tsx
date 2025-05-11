
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Se o usuário já estiver autenticado, redireciona para o dashboard
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Não renderiza nada, apenas faz o redirecionamento
  return null;
};

export default AuthRedirect;

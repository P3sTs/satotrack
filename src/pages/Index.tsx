
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const { user, loading, updateLastActivity } = useAuth();
  const navigate = useNavigate();

  // Efeito para redirecionamento com base no estado de autenticação
  useEffect(() => {
    console.log("Index - Auth state:", !!user, "Loading:", loading);
    
    if (!loading) {
      if (!user) {
        // Se não estiver autenticado, redirecionar para home
        console.log("Redirecionando para /home (não autenticado)");
        navigate('/home', { replace: true });
      } else {
        // Se estiver autenticado, registrar atividade e ir para dashboard
        console.log("Redirecionando para /dashboard (autenticado)");
        updateLastActivity();
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, updateLastActivity]);

  // Tela de carregamento durante a verificação de autenticação
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dashboard-dark">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bitcoin mb-4"></div>
        <div className="text-white flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
          <span>Verificando sessão segura...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;

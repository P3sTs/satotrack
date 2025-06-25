
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const { user, loading, updateLastActivity, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionamento mais inteligente
  useEffect(() => {
    console.log("Index - Estado de autenticação:", {
      user: !!user,
      loading,
      isAuthenticated
    });
    
    if (!loading) {
      // Se usuário está autenticado, ir para dashboard
      if (user && isAuthenticated) {
        console.log("Usuário autenticado, redirecionando para dashboard");
        updateLastActivity();
        navigate('/dashboard', { replace: true });
      } else {
        // Se não autenticado, ir para home
        console.log("Usuário não autenticado, redirecionando para home");
        navigate('/home', { replace: true });
      }
    }
  }, [user, loading, navigate, updateLastActivity, isAuthenticated]);

  // Tela de carregamento durante a verificação de autenticação
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dashboard-dark">
        <div className="relative h-16 w-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-t-satotrack-neon border-x-transparent border-b-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
              alt="SatoTrack" 
              className="h-8 w-8 opacity-70"
            />
          </div>
        </div>
        <div className="text-satotrack-text flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-satotrack-neon" />
          <span>Verificando sessão segura...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;

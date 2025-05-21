
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const { user, loading, updateLastActivity } = useAuth();
  const navigate = useNavigate();

  // Efeito para redirecionamento com base no estado de autenticação
  useEffect(() => {
    console.log("Index - Estado de autenticação:", !!user, "Carregando:", loading);
    
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
        <div className="relative h-16 w-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-t-satotrack-neon border-x-transparent border-b-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/649570ea-d0b0-4784-a1f4-bb7771034ef5.png" 
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

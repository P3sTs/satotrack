
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const { user, loading, updateLastActivity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Redirecionamento corrigido
  useEffect(() => {
    console.log('🔄 Index mounted:', { loading, isAuthenticated, user: !!user, hasRedirected });
    
    if (loading) {
      console.log('⏳ Still loading, waiting...');
      return; 
    }

    if (hasRedirected) {
      console.log('✅ Already redirected, skipping...');
      return;
    }

    // Redirecionamento sem delay
    if (isAuthenticated && user) {
      console.log('🚀 User authenticated, redirecting to dashboard');
      updateLastActivity();
      setHasRedirected(true);
      navigate('/dashboard', { replace: true });
    } else {
      console.log('🏠 User not authenticated, redirecting to home');
      setHasRedirected(true);
      navigate('/home', { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate, updateLastActivity, hasRedirected]);

  // Tela de carregamento durante a verificação de autenticação
  if (loading || hasRedirected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-dashboard-dark">
        <div className="relative h-16 w-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-t-satotrack-neon border-x-transparent border-b-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
              alt="SatoTrack" 
              className="h-8 w-8 opacity-70"
              onError={(e) => {
                console.log('❌ Logo failed to load');
                e.currentTarget.style.display = 'none';
              }}
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

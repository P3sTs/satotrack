
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const { user, loading, updateLastActivity } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/home');
      } else {
        updateLastActivity();
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, updateLastActivity]);

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

import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Badge } from '@/components/ui/badge';

export const AuthDebugPanel: React.FC = () => {
  const { user, isGuestMode, loading, isAuthenticated } = useAuth();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50 space-y-1">
      <div className="font-bold">🐛 Auth Debug</div>
      <div>Loading: <Badge variant={loading ? "destructive" : "default"}>{loading ? "Sim" : "Não"}</Badge></div>
      <div>User: <Badge variant={user ? "default" : "secondary"}>{user ? "Logado" : "Não logado"}</Badge></div>
      <div>Authenticated: <Badge variant={isAuthenticated ? "default" : "secondary"}>{isAuthenticated ? "Sim" : "Não"}</Badge></div>
      <div>Guest Mode: <Badge variant={isGuestMode ? "outline" : "secondary"}>{isGuestMode ? "Ativo" : "Inativo"}</Badge></div>
      <div>Demo Mode: <Badge variant={localStorage.getItem('guest_demo_mode') === 'true' ? "outline" : "secondary"}>
        {localStorage.getItem('guest_demo_mode') === 'true' ? "Ativo" : "Inativo"}
      </Badge></div>
    </div>
  );
};
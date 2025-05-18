
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarFooter as BaseSidebarFooter } from '@/components/ui/sidebar';
import { PlanBadge } from '../../monetization/PlanDisplay';
import { SecurityStatus } from '../../auth/SecurityStatus';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

const SidebarFooter: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout",
        variant: "destructive"
      });
    }
  };

  return (
    <BaseSidebarFooter>
      {isAuthenticated ? (
        <div className="p-4 border-t border-dashboard-medium flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-satotrack-neon/20 text-satotrack-neon">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium truncate max-w-[120px]" title={user?.email || ''}>
                {user?.email || 'Usuário'}
              </p>
              <PlanBadge />
            </div>
          </div>
          
          {user?.securityStatus && user.securityStatus !== 'secure' && (
            <SecurityStatus securityStatus={user.securityStatus} />
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="w-full mt-2 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      ) : (
        <div className="p-4 border-t border-dashboard-medium">
          <Button 
            variant="neon" 
            size="sm" 
            onClick={() => navigate('/auth')} 
            className="w-full justify-start"
          >
            <User className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        </div>
      )}
    </BaseSidebarFooter>
  );
};

export default SidebarFooter;

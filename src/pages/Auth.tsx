
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { SecurityStatus } from '@/components/auth/SecurityStatus';
import { LoginSecurityAlert } from '@/components/auth/LoginSecurityAlert';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import AuthRedirect from '@/components/auth/AuthRedirect';
import { useIsMobile } from '@/hooks/use-mobile';

const Auth = () => {
  const { failedLoginAttempts, securityStatus, resetFailedLoginAttempts } = useAuth();
  const isMobile = useIsMobile();

  // Resetar contador de tentativas de login após 15 minutos
  React.useEffect(() => {
    if (failedLoginAttempts > 0) {
      const timer = setTimeout(() => {
        resetFailedLoginAttempts();
      }, 15 * 60 * 1000); // 15 minutos

      return () => clearTimeout(timer);
    }
  }, [failedLoginAttempts, resetFailedLoginAttempts]);

  return (
    <>
      {/* Redirecionar usuários logados */}
      <AuthRedirect />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background px-4 py-8 md:py-12">
        <div className="w-full max-w-sm md:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/lovable-uploads/649570ea-d0b0-4784-a1f4-bb7771034ef5.png" alt="Logo SatoTrack" className="h-6 w-6 md:h-7 md:w-7 opacity-80" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-full"></div>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-satotrack-text">Monitoramento Bitcoin</h1>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs md:text-sm text-muted-foreground">Área segura</div>
            <SecurityStatus securityStatus={securityStatus} />
          </div>
          
          <LoginSecurityAlert failedAttempts={failedLoginAttempts} />
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Auth;

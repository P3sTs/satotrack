
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { SecurityStatus } from '@/components/auth/SecurityStatus';
import { LoginSecurityAlert } from '@/components/auth/LoginSecurityAlert';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <HeroGeometric 
        badge="SatoTracker"
        title1="Sua carteira multichain"
        title2="segura e sem complicações"
      />
      
      {/* Auth Form Overlay */}
      <div className="relative z-10 flex items-center justify-center px-4 py-8 md:py-12 min-h-screen">
        <div className="w-full max-w-sm md:max-w-md bg-background/98 backdrop-blur-xl border border-border/40 rounded-lg p-6 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-satotrack-secondary/20 to-satotrack-neon/20 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/lovable-uploads/649570ea-d0b0-4784-a1f4-bb7771034ef5.png" alt="Logo SatoTrack" className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-satotrack-neon/10 to-satotrack-secondary/20 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-lg md:text-xl font-bold text-foreground mb-2">
              Entre ou crie sua conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe e movimente seus criptoativos com segurança
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs md:text-sm text-muted-foreground">Área segura</div>
            <SecurityStatus securityStatus={securityStatus} />
          </div>
          
          <LoginSecurityAlert failedAttempts={failedLoginAttempts} />
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
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
    </div>
  );
};

export default Auth;

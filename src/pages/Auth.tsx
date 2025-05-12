
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bitcoin } from 'lucide-react';
import { SecurityStatus } from '@/components/auth/SecurityStatus';
import { LoginSecurityAlert } from '@/components/auth/LoginSecurityAlert';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import AuthRedirect from '@/components/auth/AuthRedirect';

const Auth = () => {
  const { failedLoginAttempts, securityStatus, resetFailedLoginAttempts } = useAuth();

  // Reset login attempt counter after 15 minutes
  React.useEffect(() => {
    if (failedLoginAttempts > 0) {
      const timer = setTimeout(() => {
        resetFailedLoginAttempts();
      }, 15 * 60 * 1000); // 15 minutes

      return () => clearTimeout(timer);
    }
  }, [failedLoginAttempts, resetFailedLoginAttempts]);

  return (
    <>
      {/* Redirect logged in users */}
      <AuthRedirect />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background px-4 py-8 md:py-12">
        <div className="w-full max-w-sm md:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Bitcoin size={28} className="text-bitcoin" />
              <h1 className="text-xl md:text-2xl font-bold">Bitcoin Wallet Monitor</h1>
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

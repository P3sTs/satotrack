
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { toast } from '@/hooks/use-toast';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuário já autenticado, redirecionando...");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Iniciando processo de login...");
      
      // Validação de campos vazios
      if (!email || !password) {
        throw new Error("Todos os campos são obrigatórios");
      }
      
      // Validação de email
      if (!isEmailValid(email)) {
        throw new Error("Email inválido");
      }
      
      await signIn(email, password);
      
      // Toast de sucesso
      toast({
        title: "Login realizado",
        description: "Redirecionando para o dashboard...",
      });
      
    } catch (err) {
      console.error("Erro de login:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar sessão. Tente novamente ou verifique seu e-mail.';
      setError(errorMessage);
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validação de email
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para ir manualmente ao dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com sua conta para acessar seu painel de carteiras
            </CardDescription>
          </div>
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {error.includes('Erro ao iniciar sessão') && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToDashboard}
                    className="text-xs"
                  >
                    Ir para o Dashboard
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-input focus-visible:ring-bitcoin"
              aria-invalid={error ? 'true' : 'false'}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <PasswordInput 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-bitcoin hover:bg-bitcoin/80" 
          onClick={handleLogin} 
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

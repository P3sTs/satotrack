
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
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

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Validação de campos vazios
      if (!email || !password) {
        throw new Error("Todos os campos são obrigatórios");
      }
      
      // Validação de email
      if (!isEmailValid(email)) {
        throw new Error("Email inválido");
      }
      
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro na autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  // Validação de email
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-bitcoin hover:bg-bitcoin/80" 
          onClick={handleLogin} 
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Entrar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

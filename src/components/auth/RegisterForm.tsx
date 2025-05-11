
import React, { useState, useEffect } from 'react';
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
import { AlertCircle, Shield } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const { signUp, passwordStrength } = useAuth();

  // Verificar força da senha quando mudar
  useEffect(() => {
    if (password) {
      const { score, feedback } = passwordStrength(password);
      setPasswordStrengthScore(score);
      setPasswordFeedback(feedback);
    } else {
      setPasswordStrengthScore(0);
      setPasswordFeedback('');
    }
  }, [password, passwordStrength]);

  const handleRegister = async () => {
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
      
      // Validações adicionais para registro
      if (!fullName) {
        throw new Error("Por favor, informe seu nome completo");
      }
      
      if (password !== passwordConfirm) {
        throw new Error("As senhas não coincidem");
      }
      
      if (passwordStrengthScore < 3) {
        throw new Error(`Senha fraca: ${passwordFeedback}`);
      }
      
      await signUp(email, password, fullName);
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
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Registre-se para começar a monitorar suas carteiras Bitcoin
            </CardDescription>
          </div>
          <Shield className="h-5 w-5 text-muted-foreground" />
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
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input 
            id="fullName" 
            type="text" 
            placeholder="Seu nome completo" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border-input focus-visible:ring-bitcoin"
            autoComplete="name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input 
            id="register-email" 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-input focus-visible:ring-bitcoin"
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="register-password">Senha</Label>
            <span className="text-xs text-muted-foreground">{passwordFeedback}</span>
          </div>
          <PasswordInput 
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator 
            score={passwordStrengthScore} 
            feedback={passwordFeedback} 
            password={password} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
          <PasswordInput 
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-bitcoin hover:bg-bitcoin/80" 
          onClick={handleRegister} 
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Criar Conta'}
        </Button>
      </CardFooter>
    </Card>
  );
};


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
import { AlertCircle, Shield, Gift, CheckCircle } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { toast } from 'sonner';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const { signUp, passwordStrength, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuário já autenticado, redirecionando...");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Capturar código de referência da URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      toast.success(`Código de indicação aplicado: ${refCode}`);
    }
  }, []);

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
      console.log("Iniciando processo de registro...");
      
      // Validação de campos vazios
      if (!email || !password || !fullName) {
        throw new Error("Todos os campos são obrigatórios");
      }
      
      // Validação de email
      if (!isEmailValid(email)) {
        throw new Error("Email inválido");
      }
      
      // Validações adicionais para registro
      if (password !== passwordConfirm) {
        throw new Error("As senhas não coincidem");
      }
      
      if (passwordStrengthScore < 3) {
        throw new Error(`Senha fraca: ${passwordFeedback}`);
      }
      
      console.log('Criando conta com código de referência:', referralCode || 'nenhum');
      
      await signUp(email, password, fullName, referralCode);
      
      setRegistrationSuccess(true);
      
      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        if (!isAuthenticated) {
          // Se não foi automaticamente autenticado, mostrar botão manual
          console.log("Usuário não foi automaticamente autenticado");
        }
      }, 3000);
      
    } catch (err) {
      console.error('Erro no registro:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro na autenticação';
      setError(errorMessage);
      toast.error(errorMessage);
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

  // Se registro foi bem-sucedido
  if (registrationSuccess) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-green-600">Conta Criada!</CardTitle>
              <CardDescription>
                Sua conta foi criada com sucesso
              </CardDescription>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {isAuthenticated ? 
                "Você foi automaticamente logado! Redirecionando..." : 
                "Conta criada! Se não foi redirecionado automaticamente, clique no botão abaixo."
              }
            </AlertDescription>
          </Alert>
          
          {!isAuthenticated && (
            <div className="text-center">
              <Button 
                onClick={goToDashboard}
                className="w-full bg-bitcoin hover:bg-bitcoin/80"
              >
                Ir para o Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

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

        {referralCode && (
          <Alert className="bg-green-50 border-green-200">
            <Gift className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Você foi convidado! Código de indicação: <strong>{referralCode}</strong>
            </AlertDescription>
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralCode">Código de Indicação (opcional)</Label>
          <Input 
            id="referralCode" 
            type="text" 
            placeholder="Digite o código de indicação" 
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="border-input focus-visible:ring-bitcoin"
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-bitcoin hover:bg-bitcoin/80" 
          onClick={handleRegister} 
          disabled={isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </CardFooter>
    </Card>
  );
};

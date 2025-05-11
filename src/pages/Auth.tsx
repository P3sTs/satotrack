
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bitcoin, AlertCircle, Shield, ShieldAlert, ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const { signIn, signUp, passwordStrength, failedLoginAttempts, securityStatus, resetFailedLoginAttempts } = useAuth();

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

  // Resetar contador de tentativas ao carregar para prevenir bloqueio permanente
  useEffect(() => {
    if (failedLoginAttempts > 0) {
      const timer = setTimeout(() => {
        resetFailedLoginAttempts();
      }, 15 * 60 * 1000); // 15 minutos

      return () => clearTimeout(timer);
    }
  }, [failedLoginAttempts, resetFailedLoginAttempts]);

  // Status de segurança visual
  const SecurityIcon = () => {
    switch (securityStatus) {
      case 'secure':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      case 'danger':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Lock className="h-5 w-5" />;
    }
  };

  // Validação de email
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async (action: 'signIn' | 'signUp') => {
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
      
      if (action === 'signIn') {
        await signIn(email, password);
      } else {
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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro na autenticação');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cor da barra de progresso baseada na força da senha
  const getPasswordStrengthColor = () => {
    switch (passwordStrengthScore) {
      case 0: return 'bg-gray-300';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Bitcoin size={32} className="text-bitcoin" />
            <h1 className="text-2xl font-bold">Bitcoin Wallet Monitor</h1>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">Área segura</div>
          <div className="flex items-center">
            <SecurityIcon />
            <span className="ml-1 text-sm">
              {securityStatus === 'secure' && 'Conexão segura'}
              {securityStatus === 'warning' && 'Atenção necessária'}
              {securityStatus === 'danger' && 'Risco de segurança'}
            </span>
          </div>
        </div>
        
        {failedLoginAttempts > 0 && (
          <Alert variant="warning" className="mb-4 bg-yellow-500/10 border-yellow-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {failedLoginAttempts >= 3 
                ? `Alerta: ${failedLoginAttempts} tentativas de login falhas recentes` 
                : `${failedLoginAttempts} tentativa(s) de login falha(s)`}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
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
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 border-input focus-visible:ring-bitcoin"
                      aria-invalid={error ? 'true' : 'false'}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-bitcoin hover:bg-bitcoin/80" 
                  onClick={() => handleAuth('signIn')} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Entrar'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
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
                  <div className="relative">
                    <Input 
                      id="register-password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 border-input focus-visible:ring-bitcoin"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Progress 
                    value={passwordStrengthScore * 20} 
                    className={cn("h-1", getPasswordStrengthColor())} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
                  <Input 
                    id="passwordConfirm" 
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="border-input focus-visible:ring-bitcoin"
                    autoComplete="new-password"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>A senha deve ter pelo menos:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li className={password.length >= 8 ? "text-green-500" : ""}>8 caracteres</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>Uma letra maiúscula</li>
                    <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>Uma letra minúscula</li>
                    <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>Um número</li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : ""}>Um caractere especial</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-bitcoin hover:bg-bitcoin/80" 
                  onClick={() => handleAuth('signUp')} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Criar Conta'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;

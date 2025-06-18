
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type VerificationStatus = 'loading' | 'success' | 'error' | 'timeout';

const CheckoutSuccess = () => {
  const { checkSubscriptionStatus, userPlan } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);

  const sessionId = searchParams.get('session_id');
  const maxRetries = 5;

  const verifySubscription = async (attempt = 1) => {
    try {
      setProgress((attempt / maxRetries) * 100);
      await checkSubscriptionStatus();
      
      // Check if subscription was activated
      setTimeout(() => {
        if (userPlan === 'premium') {
          setVerificationStatus('success');
          setProgress(100);
          toast({
            title: "Sucesso!",
            description: "Sua assinatura Premium foi ativada com sucesso!",
          });
        } else if (attempt < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          setTimeout(() => verifySubscription(attempt + 1), delay);
          setRetryCount(attempt);
        } else {
          setVerificationStatus('timeout');
          toast({
            title: "Verificação demorada",
            description: "A ativação pode levar alguns minutos. Tente verificar novamente.",
            variant: "destructive"
          });
        }
      }, 2000);
    } catch (error) {
      console.error('Erro na verificação:', error);
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        setTimeout(() => verifySubscription(attempt + 1), delay);
        setRetryCount(attempt);
      } else {
        setVerificationStatus('error');
        toast({
          title: "Erro na verificação",
          description: "Não foi possível verificar sua assinatura. Entre em contato conosco.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    if (!sessionId) {
      navigate('/planos');
      return;
    }

    verifySubscription();
  }, [sessionId]);

  const handleManualRetry = () => {
    setVerificationStatus('loading');
    setRetryCount(0);
    setProgress(0);
    verifySubscription();
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToPlans = () => {
    navigate('/planos');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl relative overflow-hidden">
      {/* Confetti Animation */}
      {verificationStatus === 'success' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                top: '-10px'
              }}
            >
              <div
                className="w-3 h-3 rotate-45"
                style={{
                  backgroundColor: ['#F7931A', '#00D4AA', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            {verificationStatus === 'loading' && (
              <div className="relative">
                <Loader2 className="h-16 w-16 text-bitcoin animate-spin mx-auto" />
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-bitcoin h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Verificando assinatura... Tentativa {retryCount + 1} de {maxRetries}
                  </p>
                </div>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
            )}
            
            {(verificationStatus === 'error' || verificationStatus === 'timeout') && (
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            )}
          </div>

          <CardTitle className="text-2xl">
            {verificationStatus === 'loading' && 'Ativando sua assinatura...'}
            {verificationStatus === 'success' && '🎉 Pagamento Confirmado! 🎉'}
            {verificationStatus === 'error' && 'Erro na Verificação'}
            {verificationStatus === 'timeout' && 'Verificação Demorada'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {verificationStatus === 'loading' && (
            <div>
              <p className="text-muted-foreground">
                Estamos processando seu pagamento e ativando sua assinatura Premium. 
                Isso pode levar alguns momentos...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Não feche esta página, o processo é automático.
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div>
              <p className="text-lg text-green-600 font-medium mb-2">
                Bem-vindo ao SatoTrack Premium! 🚀
              </p>
              <p className="text-muted-foreground mb-4">
                Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos premium:
              </p>
              <ul className="text-left text-sm space-y-1 mb-4">
                <li>✅ Carteiras ilimitadas</li>
                <li>✅ Alertas em tempo real</li>
                <li>✅ Relatórios avançados</li>
                <li>✅ Acesso à API</li>
                <li>✅ Suporte prioritário</li>
              </ul>
              <div className="bg-gradient-to-r from-bitcoin/10 to-green-500/10 p-4 rounded-lg border border-bitcoin/20">
                <p className="text-sm font-medium text-bitcoin">
                  🎁 Obrigado por escolher o SatoTrack Premium!
                </p>
              </div>
            </div>
          )}

          {verificationStatus === 'timeout' && (
            <div>
              <p className="text-muted-foreground mb-4">
                A verificação está levando mais tempo que o esperado. Isso é normal e pode 
                levar alguns minutos para processar completamente.
              </p>
              <p className="text-sm text-muted-foreground">
                Você pode tentar verificar novamente ou ir para seus planos para acompanhar o status.
              </p>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div>
              <p className="text-muted-foreground mb-4">
                Ocorreu um erro ao verificar sua assinatura. Seu pagamento pode ter sido processado 
                com sucesso, mas precisamos verificar manualmente.
              </p>
              <p className="text-sm text-muted-foreground">
                Entre em contato conosco se o problema persistir.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {verificationStatus === 'success' && (
              <Button 
                onClick={handleGoToDashboard}
                className="bg-bitcoin hover:bg-bitcoin/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                🚀 Ir para Dashboard
              </Button>
            )}

            {(verificationStatus === 'timeout' || verificationStatus === 'error') && (
              <>
                <Button 
                  onClick={handleManualRetry}
                  className="bg-bitcoin hover:bg-bitcoin/90 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <Button 
                  onClick={handleGoToPlans}
                  variant="outline"
                >
                  Ver Meus Planos
                </Button>
              </>
            )}

            {verificationStatus === 'loading' && (
              <Button 
                onClick={handleGoToPlans}
                variant="outline"
              >
                Verificar Depois
              </Button>
            )}
          </div>

          {sessionId && (
            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                ID da Sessão: {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;

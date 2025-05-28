
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Lock, Star, Settings } from 'lucide-react';
import { Advertisement } from '@/components/monetization/Advertisement';
import { toast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface PlanFeatureProps {
  text: string;
  included: boolean;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ text, included }) => (
  <div className="flex items-center py-2">
    {included ? (
      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
    )}
    <span className={!included ? 'text-muted-foreground' : ''}>{text}</span>
  </div>
);

const PlanosPage: React.FC = () => {
  const { userPlan, createCheckoutSession, openCustomerPortal, checkSubscriptionStatus, isLoading } = useAuth();
  const isPremium = userPlan === 'premium';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Verificar se houve sucesso no checkout e atualizar status
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (checkout === 'success') {
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Bem-vindo ao SatoTrack Premium! Verificando seu status...",
      });
      
      // Verificar status da assinatura após checkout bem-sucedido
      const verifySubscription = async () => {
        await checkSubscriptionStatus?.();
        // Redirecionar para dashboard após verificação
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      };
      
      verifySubscription();
    } else if (checkout === 'canceled') {
      toast({
        title: "Checkout cancelado",
        description: "Você pode tentar novamente quando quiser.",
        variant: "destructive"
      });
    }
  }, [searchParams, checkSubscriptionStatus, navigate]);
  
  const handleUpgrade = async () => {
    if (createCheckoutSession) {
      await createCheckoutSession();
    }
  };

  const handleManageSubscription = async () => {
    if (openCustomerPortal) {
      await openCustomerPortal();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Escolha o melhor plano para você</h1>
        <p className="text-muted-foreground">
          Monitore suas carteiras Bitcoin com o SatoTrack e tenha acesso às melhores ferramentas de análise
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plano Gratuito */}
        <Card className={`relative ${!isPremium ? 'border-bitcoin' : ''}`}>
          {!isPremium && (
            <div className="absolute top-0 right-0 bg-bitcoin text-white text-xs py-1 px-3 rounded-bl">
              Seu plano atual
            </div>
          )}
          <CardHeader>
            <CardTitle>Plano Gratuito</CardTitle>
            <CardDescription>Perfeito para iniciantes</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <PlanFeature text="1 carteira monitorada" included={true} />
            <PlanFeature text="Dados de mercado básicos (24h e 7d)" included={true} />
            <PlanFeature text="Monitoramento de saldo" included={true} />
            <PlanFeature text="Gráficos interativos básicos" included={true} />
            <PlanFeature text="Carteiras múltiplas" included={false} />
            <PlanFeature text="Gráficos avançados (30d, 90d, YTD)" included={false} />
            <PlanFeature text="Exportação de dados em PDF/CSV" included={false} />
            <PlanFeature text="Alertas por Telegram/Email" included={false} />
            <PlanFeature text="Comparação de carteiras" included={false} />
            <PlanFeature text="Screenshot de gráficos" included={false} />
            <PlanFeature text="Relatórios mensais" included={false} />
            <PlanFeature text="Acesso à API de dados" included={false} />
            <PlanFeature text="Sem anúncios" included={false} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">
              Plano Atual
            </Button>
          </CardFooter>
        </Card>
        
        {/* Plano Premium */}
        <Card className={`relative ${isPremium ? 'border-bitcoin' : ''}`}>
          {isPremium && (
            <div className="absolute top-0 right-0 bg-bitcoin text-white text-xs py-1 px-3 rounded-bl">
              Seu plano atual
            </div>
          )}
          <CardHeader>
            <CardTitle>Plano Premium</CardTitle>
            <CardDescription>Para usuários avançados</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 19,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <PlanFeature text="Carteiras ilimitadas" included={true} />
            <PlanFeature text="Dados de mercado completos" included={true} />
            <PlanFeature text="Monitoramento avançado" included={true} />
            <PlanFeature text="Gráficos interativos avançados (30d, 90d, YTD)" included={true} />
            <PlanFeature text="Exportação de dados em PDF/CSV" included={true} />
            <PlanFeature text="Alertas por Telegram/Email" included={true} />
            <PlanFeature text="Comparação de carteiras" included={true} />
            <PlanFeature text="Screenshot de gráficos" included={true} />
            <PlanFeature text="Relatórios mensais completos" included={true} />
            <PlanFeature text="Painel exclusivo Premium" included={true} />
            <PlanFeature text="Acesso à API de dados" included={true} />
            <PlanFeature text="Suporte prioritário" included={true} />
            <PlanFeature text="Sem anúncios" included={true} />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {isPremium ? (
              <>
                <Button disabled className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white">
                  <Star className="h-4 w-4 mr-2 fill-white" />
                  Plano Atual
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gerenciar Assinatura
                </Button>
              </>
            ) : (
              <Button 
                className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white" 
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isLoading ? 'Processando...' : 'Fazer upgrade'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {!isPremium && (
        <div className="max-w-4xl mx-auto mt-8">
          <Advertisement position="panel" />
        </div>
      )}
      
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-bold mb-4">Perguntas Frequentes</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Como funciona o pagamento?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              O pagamento é processado de forma segura através do Stripe. Você será redirecionado para uma página segura 
              de checkout onde poderá inserir seus dados de cartão de crédito.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Posso cancelar minha assinatura Premium?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sim! Você pode cancelar sua assinatura a qualquer momento através do botão "Gerenciar Assinatura". 
              O acesso Premium continua disponível até o final do período pago.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Como funciona a exportação de relatórios?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Assinantes Premium podem exportar dados em formato PDF e CSV de qualquer período, incluindo relatórios 
              completos para declaração de impostos.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">É seguro fornecer meus dados de pagamento?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sim! Utilizamos o Stripe, uma das plataformas de pagamento mais seguras do mundo. Seus dados de cartão 
              são criptografados e nunca passam pelos nossos servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosPage;

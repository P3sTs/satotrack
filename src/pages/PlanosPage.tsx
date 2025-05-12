
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Lock } from 'lucide-react';
import { Advertisement } from '@/components/monetization/Advertisement';

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
  const { userPlan, upgradeUserPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
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
            <PlanFeature text="Dados de mercado básicos" included={true} />
            <PlanFeature text="Monitoramento de saldo" included={true} />
            <PlanFeature text="Carteiras múltiplas" included={false} />
            <PlanFeature text="Alertas por Telegram/Email" included={false} />
            <PlanFeature text="Relatórios mensais" included={false} />
            <PlanFeature text="Gráficos interativos avançados" included={false} />
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
              <span className="text-3xl font-bold">R$ 29,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <PlanFeature text="Carteiras ilimitadas" included={true} />
            <PlanFeature text="Dados de mercado completos" included={true} />
            <PlanFeature text="Monitoramento avançado" included={true} />
            <PlanFeature text="Relatórios personalizados" included={true} />
            <PlanFeature text="Alertas por Telegram/Email" included={true} />
            <PlanFeature text="Relatórios mensais completos" included={true} />
            <PlanFeature text="Gráficos interativos avançados" included={true} />
            <PlanFeature text="Acesso à API de dados" included={true} />
            <PlanFeature text="Sem anúncios" included={true} />
          </CardContent>
          <CardFooter>
            {isPremium ? (
              <Button disabled className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white">
                Plano Atual
              </Button>
            ) : (
              <Button 
                className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white" 
                onClick={upgradeUserPlan}
              >
                <Lock className="h-4 w-4 mr-2" />
                Fazer upgrade
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
            <h3 className="font-medium">Como funciona o upgrade para Premium?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ao clicar em "Fazer upgrade", você será redirecionado para nosso sistema de pagamento seguro. Após a confirmação, seu plano será atualizado automaticamente.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Posso cancelar minha assinatura Premium?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sim! Você pode cancelar sua assinatura a qualquer momento. O acesso Premium continua disponível até o final do período pago.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Como funciona o acesso à API?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Assinantes Premium recebem um token de API exclusivo com até 1000 requisições por mês, permitindo integrar dados em suas aplicações.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">É possível comprar relatórios sem ser Premium?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sim! Usuários do plano gratuito podem comprar relatórios avulsos por R$9,90 cada, enquanto assinantes Premium têm acesso ilimitado a relatórios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosPage;

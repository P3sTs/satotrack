
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { Check, Star, Zap, Shield, Crown } from 'lucide-react';
import { PlanComparisonTable } from '@/components/monetization/PlanDisplay';

const PlanosPage = () => {
  const { userPlan, upgradeUserPlan, isLoading } = useAuth();

  const handleUpgrade = async (planType: 'premium') => {
    try {
      await upgradeUserPlan(planType);
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
    }
  };

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar a monitorar seus primeiros bitcoins',
      icon: Shield,
      current: userPlan === 'free',
      features: [
        '1 carteira monitorada',
        'Dados básicos de mercado',
        'Alertas limitados',
        'Histórico de 30 dias',
        'Suporte por email'
      ],
      limitations: [
        'Sem alertas por Telegram/Email',
        'Sem relatórios mensais',
        'Gráficos básicos apenas',
        'Sem acesso à API',
        'Com anúncios'
      ]
    },
    {
      name: 'Premium',
      price: 'R$ 29',
      period: '/mês',
      description: 'Para traders sérios que precisam de monitoramento completo',
      icon: Crown,
      popular: true,
      current: userPlan === 'premium',
      features: [
        'Carteiras ilimitadas',
        'Dados avançados de mercado',
        'Alertas por Telegram/Email',
        'Histórico completo',
        'Relatórios mensais detalhados',
        'Gráficos interativos avançados',
        'Acesso completo à API',
        'Sem anúncios',
        'Suporte prioritário',
        'Análises de mercado exclusivas'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold mb-4">
            Escolha seu <span className="text-bitcoin">Plano</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitore suas carteiras Bitcoin com as ferramentas mais avançadas do mercado
          </p>
        </div>

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card key={index} className={`relative ${plan.popular ? 'border-bitcoin shadow-lg scale-105' : ''} ${plan.current ? 'ring-2 ring-bitcoin' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-bitcoin text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Plano Atual
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-bitcoin/10' : 'bg-muted'}`}>
                      <Icon className={`h-8 w-8 ${plan.popular ? 'text-bitcoin' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="flex items-baseline justify-center mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations && plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                        <div className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500">×</div>
                        <span className="text-sm line-through">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    {plan.current ? (
                      <Button className="w-full" variant="outline" disabled>
                        Plano Atual
                      </Button>
                    ) : plan.name === 'Premium' ? (
                      <Button 
                        className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white"
                        onClick={() => handleUpgrade('premium')}
                        disabled={isLoading}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {isLoading ? 'Processando...' : 'Upgrade para Premium'}
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        Plano Gratuito
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabela de Comparação */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Comparação Detalhada</h2>
          <PlanComparisonTable />
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim, você pode cancelar sua assinatura Premium a qualquer momento. 
                  Você continuará tendo acesso aos recursos Premium até o final do período pago.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o programa de indicações?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A cada 20 indicações válidas, você ganha 1 mês Premium gratuito! 
                  Acesse o programa de indicações para obter seu código único e começar a indicar amigos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meus dados estão seguros?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutamente. Utilizamos as melhores práticas de segurança e criptografia. 
                  Seus dados nunca são compartilhados com terceiros e você mantém total controle sobre suas informações.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosPage;

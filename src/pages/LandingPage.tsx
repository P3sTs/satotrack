
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: 'Grátis',
      description: 'Para começar sua jornada',
      features: [
        '1 carteira monitorada',
        'Alertas básicos',
        'Relatórios mensais',
        'Suporte por email'
      ],
      limitations: [
        'Histórico limitado (30 dias)',
        'Sem alertas ML',
        'Sem API access'
      ],
      cta: 'Começar Grátis',
      popular: false,
      target: 'Iniciantes'
    },
    {
      name: 'Premium',
      price: 'R$ 19,90',
      priceNote: '/mês',
      description: 'Para traders e investidores',
      features: [
        'Carteiras ilimitadas',
        'Relatórios PDF personalizados',
        'API básica (1000 req/mês)',
        'Alertas inteligentes',
        'Análise de impostos',
        'Gráficos avançados',
        'Exportação de dados',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      limitations: [],
      cta: 'Começar Teste Grátis',
      popular: true,
      target: 'Traders e Investidores',
      badge: 'Mais Popular'
    }
  ];

  const differentials = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Alertas com IA',
      description: 'Machine Learning para detectar oportunidades antes do mercado'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Privacidade Total',
      description: 'Modo anonimização completa dos seus dados de investimento'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Análise de Impostos',
      description: 'Relatórios automáticos para Receita Federal brasileira'
    }
  ];

  const handlePlanSelect = (planName: string) => {
    if (user) {
      navigate('/planos');
    } else {
      navigate('/auth', { state: { plan: planName } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-bitcoin/20 text-bitcoin border-bitcoin/30">
              🚀 Lançamento SatoTrack 3.0
            </Badge>
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 satotrack-gradient-text">
              O Único Tracker que Combina 
              <span className="block text-bitcoin">IA com Privacidade Total</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Proteja seus investimentos com inteligência artificial avançada. 
              Monitore carteiras Bitcoin com alertas preditivos e relatórios fiscais automáticos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-bitcoin hover:bg-bitcoin/90 text-white"
                onClick={() => navigate('/auth')}
              >
                Começar Grátis Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Planos e Preços
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-dashboard-medium/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-bitcoin mb-2">10,000+</div>
              <div className="text-muted-foreground">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bitcoin mb-2">R$ 500M+</div>
              <div className="text-muted-foreground">Volume Monitorado</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bitcoin mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Garantido</div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12">
            Por que escolher o <span className="text-bitcoin">SatoTrack</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {differentials.map((item, index) => (
              <Card key={index} className="text-center border-bitcoin/20 hover:border-bitcoin/50 transition-colors">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-bitcoin/10 rounded-full flex items-center justify-center text-bitcoin mb-4">
                    {item.icon}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-dashboard-medium/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-orbitron font-bold mb-4">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desde iniciantes até investidores profissionais, temos o plano perfeito para suas necessidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-bitcoin shadow-lg scale-105' : 'border-dashboard-medium'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-bitcoin text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="py-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.priceNote && <span className="text-muted-foreground">{plan.priceNote}</span>}
                  </div>
                  <Badge variant="outline" className="mx-auto">
                    <Users className="h-3 w-3 mr-1" />
                    {plan.target}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-green-500">✓ Incluído:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-yellow-500">⚠ Limitações:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-center text-sm text-muted-foreground">
                            <span className="w-4 h-4 mr-2">−</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-bitcoin hover:bg-bitcoin/90 text-white' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-orbitron font-bold mb-4">
            Comece Hoje Mesmo
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de investidores que já protegem seus ativos com SatoTrack
          </p>
          <Button 
            size="lg" 
            className="bg-bitcoin hover:bg-bitcoin/90 text-white"
            onClick={() => navigate('/auth')}
          >
            Criar Conta Grátis
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  BarChart3, 
  Shield, 
  Route, 
  FileText, 
  Settings,
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Zap,
  Play,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const benefits = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Rastreamento em Tempo Real',
      description: 'Monitore seus veículos e ativos 24/7 com precisão e em tempo real.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Telemetria Avançada',
      description: 'Obtenha insights valiosos sobre o desempenho da sua frota com dados detalhados.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Segurança e Alertas',
      description: 'Receba alertas instantâneos sobre eventos críticos e garanta a segurança dos seus bens.'
    },
    {
      icon: <Route className="h-8 w-8" />,
      title: 'Otimização de Rotas',
      description: 'Planeje e otimize rotas para reduzir custos e aumentar a eficiência.'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Relatórios Personalizados',
      description: 'Gere relatórios completos e personalizados para uma gestão mais inteligente.'
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Integração Simplificada',
      description: 'Integre facilmente a SatoTrack com seus sistemas existentes.'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'R$ 49',
      priceNote: '/mês',
      description: 'Ideal para pequenas empresas',
      features: [
        'Até 5 veículos monitorados',
        'Rastreamento básico',
        'Relatórios mensais',
        'Suporte por email',
        'Alertas básicos'
      ],
      cta: 'Começar Agora',
      popular: false
    },
    {
      name: 'Professional',
      price: 'R$ 149',
      priceNote: '/mês',
      description: 'Para empresas em crescimento',
      features: [
        'Até 25 veículos monitorados',
        'Telemetria avançada',
        'Relatórios personalizados',
        'Suporte prioritário',
        'Alertas inteligentes',
        'Otimização de rotas',
        'API completa',
        'Dashboard avançado'
      ],
      cta: 'Teste Grátis por 14 dias',
      popular: true,
      badge: 'Mais Popular'
    },
    {
      name: 'Enterprise',
      price: 'Customizado',
      priceNote: '',
      description: 'Para grandes operações',
      features: [
        'Veículos ilimitados',
        'Integração personalizada',
        'Suporte dedicado',
        'SLA garantido',
        'Treinamento incluso',
        'Relatórios avançados',
        'White label disponível'
      ],
      cta: 'Falar com Especialista',
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      company: 'Logística Express',
      content: 'A SatoTrack revolucionou nossa operação. Reduzimos custos em 30% e aumentamos a eficiência significativamente.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      company: 'Transportes Unidos',
      content: 'Excelente plataforma! O suporte é excepcional e a integração foi muito simples.',
      rating: 5
    },
    {
      name: 'Roberto Lima',
      company: 'Frota Segura',
      content: 'Os relatórios personalizados nos ajudaram a tomar decisões mais assertivas. Recomendo!',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'Como funciona o período de teste?',
      answer: 'Oferecemos 14 dias grátis para você testar todas as funcionalidades da plataforma, sem compromisso.'
    },
    {
      question: 'É possível integrar com meus sistemas atuais?',
      answer: 'Sim! Nossa API robusta permite integração com a maioria dos sistemas de gestão existentes.'
    },
    {
      question: 'Que tipo de suporte vocês oferecem?',
      answer: 'Temos suporte por email, chat e telefone. Clientes Enterprise contam com suporte dedicado.'
    },
    {
      question: 'Os dados são seguros?',
      answer: 'Absoluta segurança! Utilizamos criptografia de ponta e seguimos rigorosos protocolos de segurança.'
    }
  ];

  const handlePlanSelect = (planName: string) => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth', { state: { plan: planName } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              🚀 Nova Era do Rastreamento Inteligente
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              SatoTrack: Rastreamento
              <span className="block text-blue-200">Inteligente para o Seu Negócio</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Soluções completas de rastreamento e telemetria para otimizar sua operação 
              e garantir segurança. Nunca foi tão preciso monitorar seus ativos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
                onClick={() => navigate('/auth')}
              >
                <Play className="h-5 w-5 mr-2" />
                Solicitar Demonstração Gratuita
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Planos e Preços
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600 text-lg">Veículos Monitorados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 text-lg">Empresas Satisfeitas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600 text-lg">Uptime Garantido</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher a <span className="text-blue-600">SatoTrack</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recursos que impulsionam seu negócio e garantem resultados excepcionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">Resultados que falam por si</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-blue-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções flexíveis para empresas de todos os tamanhos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative h-full ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <div className="py-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.priceNote && <span className="text-gray-600 text-lg">{plan.priceNote}</span>}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-8 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handlePlanSelect(plan.name)}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dúvidas Frequentes
            </h2>
            <p className="text-xl text-gray-600">Tudo que você precisa saber sobre a SatoTrack</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para otimizar sua operação?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já transformaram suas operações com a SatoTrack
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
              onClick={() => navigate('/auth')}
            >
              Agendar Demonstração
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-xl">
                SatoTrack
              </span>
            </div>
            
            <div className="flex flex-wrap gap-8 text-gray-300">
              <Link to="/termos-uso" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/sobre" className="hover:text-white transition-colors">
                Sobre
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} SatoTrack. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  BarChart3,
  Shield,
  Wallet,
  TrendingUp,
  Bell,
  Eye,
  Lock,
  Zap,
  Globe
} from 'lucide-react';

const FeaturesSection = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Eye,
      title: 'Monitoramento Avançado',
      description: 'Acompanhe todas as suas transações em tempo real com alertas inteligentes',
      features: ['Rastreamento multi-blockchain', 'Alertas personalizáveis', 'Análise de padrões'],
      cta: 'Começar Monitoramento',
      route: '/auth?mode=signup'
    },
    {
      icon: BarChart3,
      title: 'Análise Inteligente',
      description: 'Relatórios avançados com IA para insights de mercado e portfolio',
      features: ['Machine Learning', 'Previsões de mercado', 'Otimização de portfolio'],
      cta: 'Ver Análises',
      route: '/auth?mode=signup'
    },
    {
      icon: Wallet,
      title: 'Carteira Segura',
      description: 'Gerencie seus ativos em 50+ blockchains com segurança máxima',
      features: ['Multi-blockchain', 'Chaves seguras', 'Interface unificada'],
      cta: 'Criar Carteira',
      route: '/auth?mode=signup'
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: 'Segurança Bancária',
      description: 'Criptografia de nível militar para proteger seus ativos'
    },
    {
      icon: TrendingUp,
      title: 'Insights de Mercado',
      description: 'Análise preditiva com IA para decisões inteligentes'
    },
    {
      icon: Bell,
      title: 'Alertas Inteligentes',
      description: 'Notificações personalizadas para oportunidades'
    },
    {
      icon: Lock,
      title: 'Chaves Privadas',
      description: 'Controle total sobre suas chaves de acesso'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Interface ultra-rápida e responsiva'
    },
    {
      icon: Globe,
      title: 'Acesso Global',
      description: 'Disponível 24/7 em qualquer lugar do mundo'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-dashboard-dark to-dashboard-medium/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">
            Funcionalidades <span className="satotrack-gradient-text">Principais</span>
          </h2>
          <p className="text-xl text-satotrack-text max-w-3xl mx-auto font-inter">
            Descubra todas as ferramentas e recursos que tornam o SatoTracker a plataforma 
            mais completa para gerenciamento de criptoativos
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="cyberpunk-card group hover:transform hover:scale-105 transition-all duration-500 h-full"
            >
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-satotrack-neon/20 to-satotrack-neon/10 rounded-2xl flex items-center justify-center mb-4 group-hover:from-satotrack-neon/30 group-hover:to-satotrack-neon/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-satotrack-neon" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-satotrack-text font-inter leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="flex-grow space-y-3 mb-6">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-satotrack-neon"></div>
                      <span className="text-sm text-satotrack-text font-inter">{item}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate(feature.route)}
                  className="w-full bg-gradient-to-r from-satotrack-neon to-satotrack-neon/80 text-black hover:from-satotrack-neon/90 hover:to-satotrack-neon/70 font-semibold font-inter group"
                >
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="cyberpunk-card group hover:border-satotrack-neon/50 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-satotrack-neon/10 to-transparent group-hover:from-satotrack-neon/20 transition-colors flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-satotrack-neon" />
                  </div>
                  <div>
                    <h4 className="text-lg font-orbitron font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-satotrack-text font-inter leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  TrendingUp, 
  Wallet, 
  Eye, 
  Lock, 
  Zap,
  BarChart3,
  Bell,
  Globe,
  Smartphone
} from 'lucide-react';

const PlatformInfo = () => {
  const features = [
    {
      icon: Eye,
      title: 'Monitoramento em Tempo Real',
      description: 'Acompanhe suas transações blockchain 24/7 com alertas instantâneos e análise detalhada de movimentações.',
      details: ['Rastreamento multi-blockchain', 'Alertas personalizáveis', 'Histórico completo']
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteja seus ativos com criptografia de nível bancário e autenticação multi-fator.',
      details: ['Criptografia AES-256', 'Autenticação 2FA', 'Chaves privadas seguras']
    },
    {
      icon: BarChart3,
      title: 'Análise Inteligente',
      description: 'Relatórios avançados com IA para identificar padrões e oportunidades de investimento.',
      details: ['Machine Learning', 'Análise preditiva', 'Insights personalizados']
    },
    {
      icon: Wallet,
      title: 'Carteira Multi-Chain',
      description: 'Gerencie Bitcoin, Ethereum, Polygon e mais de 50 redes em uma única plataforma.',
      details: ['50+ blockchains', 'Interface unificada', 'Conversão automática']
    },
    {
      icon: Bell,
      title: 'Alertas Personalizados',
      description: 'Configure notificações para movimentações, preços e eventos importantes.',
      details: ['Alertas de preço', 'Notificações push', 'Email e SMS']
    },
    {
      icon: Globe,
      title: 'Acesso Global',
      description: 'Acesse sua carteira de qualquer lugar do mundo com total segurança.',
      details: ['Web e mobile', 'Sincronização global', 'Backup automático']
    }
  ];

  const stats = [
    { value: '50+', label: 'Blockchains Suportadas' },
    { value: '10k+', label: 'Usuários Ativos' },
    { value: '99.9%', label: 'Uptime Garantido' },
    { value: '24/7', label: 'Monitoramento' }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-dashboard-dark via-dashboard-medium/10 to-dashboard-dark">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-satotrack-neon/20 text-satotrack-neon border-satotrack-neon/30">
            🚀 Plataforma Avançada
          </Badge>
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="satotrack-gradient-text">SatoTracker</span>
          </h2>
          <p className="text-xl md:text-2xl text-satotrack-text max-w-4xl mx-auto leading-relaxed font-inter">
            A plataforma mais completa para monitoramento, análise e gerenciamento de criptoativos. 
            Transforme dados blockchain em insights acionáveis com tecnologia de ponta.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-orbitron font-bold satotrack-gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-satotrack-text font-inter">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="cyberpunk-card group hover:transform hover:scale-105 transition-all duration-300 h-full"
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-satotrack-neon/20 to-satotrack-neon/10 group-hover:from-satotrack-neon/30 group-hover:to-satotrack-neon/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-satotrack-neon" />
                  </div>
                  <h3 className="text-xl font-orbitron font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-satotrack-text font-inter mb-4 leading-relaxed flex-grow">
                  {feature.description}
                </p>
                
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-satotrack-neon"></div>
                      <span className="text-sm text-satotrack-text/80 font-inter">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-8">
            Tecnologia de Ponta
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyberpunk-card p-4 flex flex-col items-center space-y-2">
              <Lock className="h-8 w-8 text-satotrack-neon" />
              <span className="text-sm font-inter text-satotrack-text">Blockchain</span>
            </div>
            <div className="cyberpunk-card p-4 flex flex-col items-center space-y-2">
              <Zap className="h-8 w-8 text-satotrack-neon" />
              <span className="text-sm font-inter text-satotrack-text">IA Avançada</span>
            </div>
            <div className="cyberpunk-card p-4 flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-satotrack-neon" />
              <span className="text-sm font-inter text-satotrack-text">Segurança</span>
            </div>
            <div className="cyberpunk-card p-4 flex flex-col items-center space-y-2">
              <Smartphone className="h-8 w-8 text-satotrack-neon" />
              <span className="text-sm font-inter text-satotrack-text">Multi-Platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformInfo;

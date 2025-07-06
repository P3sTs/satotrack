import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, Wallet, Send, Eye, Shield, Globe, Zap, Lock } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: LogIn,
      title: 'Faça login com Google ou email',
      description: 'Acesso rápido e seguro com autenticação Google ou email verificado',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: 2,
      icon: Wallet,
      title: 'Gere seu endereço em mais de 50 blockchains',
      description: 'Bitcoin, Ethereum, Polygon, Solana, BNB Chain e dezenas de outras redes',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: 3,
      icon: Send,
      title: 'Receba e envie criptoativos com segurança total',
      description: 'Transações protegidas por KMS descentralizado e aprovação multi-fator',
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: 4,
      icon: Eye,
      title: 'Veja seu saldo em BRL, USD, BTC ou moeda desejada',
      description: 'Cotação em tempo real e conversão automática para sua moeda preferida',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    {
      icon: Lock,
      title: 'Sem armazenar chaves privadas',
      description: 'Suas chaves nunca são expostas ou armazenadas em nossos servidores'
    },
    {
      icon: Shield,
      title: 'Integrado com SatoCore KMS',
      description: 'Sistema de gerenciamento de chaves militar para máxima segurança'
    },
    {
      icon: Globe,
      title: 'Suporte a múltiplas redes',
      description: 'BTC, ETH, MATIC, SOL, XRP, TRX, BNB e 40+ blockchains'
    },
    {
      icon: Zap,
      title: 'Transações otimizadas',
      description: 'Taxas inteligentes e velocidade de confirmação otimizada'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Como <span className="satotrack-gradient-text">Funciona</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Quatro passos simples para começar a usar a plataforma mais segura de criptoativos do Brasil
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {steps.map((step, index) => (
          <Card key={step.number} className="bg-dashboard-medium/50 border-dashboard-light/20 backdrop-blur-sm relative overflow-hidden group hover:border-satotrack-neon/50 transition-all duration-300">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <CardContent className="p-6 relative z-10">
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="outline" 
                  className="text-xs font-bold px-3 py-1 border-satotrack-neon/30 text-satotrack-neon bg-satotrack-neon/10"
                >
                  Passo {step.number}
                </Badge>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} bg-opacity-20`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3 leading-tight">
                {step.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </CardContent>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
                <div className="w-6 h-0.5 bg-gradient-to-r from-satotrack-neon to-transparent"></div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🔐 Destaques de Segurança
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tecnologia de ponta para proteger seus ativos digitais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="bg-dashboard-medium/30 border-dashboard-light/20 backdrop-blur-sm hover:bg-dashboard-medium/50 transition-all duration-300 group"
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-satotrack-neon/10 rounded-xl border border-satotrack-neon/30 group-hover:border-satotrack-neon/50 transition-colors">
                  <feature.icon className="h-6 w-6 text-satotrack-neon" />
                </div>
              </div>
              
              <h4 className="font-semibold text-white mb-2">
                {feature.title}
              </h4>
              
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
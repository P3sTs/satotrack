
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Smartphone, Users, Award } from 'lucide-react';
import { TrustWalletCard, StatsCardContent } from '@/components/ui/trust-wallet-card';

const TrustWalletFeatures = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança Total",
      value: "Nível militar",
      subtitle: "Criptografia KMS avançada",
      trend: "up" as const,
      trendValue: "99.9% seguro"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Velocidade",
      value: "< 3 seg",
      subtitle: "Transações instantâneas",
      trend: "up" as const,
      trendValue: "Mais rápido"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Redes Suportadas",
      value: "70+",
      subtitle: "Blockchains conectadas",
      trend: "up" as const,
      trendValue: "+10 este mês"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Multiplataforma",
      value: "100%",
      subtitle: "Web, iOS, Android",
      trend: "neutral" as const,
      trendValue: "Sempre disponível"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Usuários Ativos",
      value: "70M+",
      subtitle: "Comunidade global",
      trend: "up" as const,
      trendValue: "+2M este mês"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Confiabilidade",
      value: "13 anos",
      subtitle: "De experiência",
      trend: "up" as const,
      trendValue: "Líder mundial"
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm border border-border/30 rounded-full px-4 py-2 mb-6">
            <Award className="h-4 w-4 text-satotrack-neon" />
            <span className="text-sm font-medium text-satotrack-neon">Por que escolher SatoTrack</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Construída para ser a</span><br />
            <span className="text-satotrack-neon">carteira mais segura</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Com tecnologia de ponta e foco na experiência do usuário, oferecemos 
            a plataforma mais confiável para gerenciar seus ativos digitais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TrustWalletCard variant="stats" className="h-full hover:scale-105 transition-transform duration-200">
                <StatsCardContent
                  icon={feature.icon}
                  title={feature.title}
                  value={feature.value}
                  subtitle={feature.subtitle}
                  trend={feature.trend}
                  trendValue={feature.trendValue}
                />
              </TrustWalletCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-2">
            Junte-se a milhões de usuários que confiam na SatoTrack
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                    i === 1 ? 'from-blue-400 to-blue-600' :
                    i === 2 ? 'from-purple-400 to-purple-600' :
                    i === 3 ? 'from-green-400 to-green-600' :
                    i === 4 ? 'from-yellow-400 to-yellow-600' :
                    'from-pink-400 to-pink-600'
                  } border-2 border-background`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">+70M usuários</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustWalletFeatures;

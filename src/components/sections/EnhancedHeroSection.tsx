import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import FluidBackground from '../ui/enhanced/FluidBackground';
import TextShimmer from '../ui/enhanced/TextShimmer';
import EnhancedButton from '../ui/enhanced/EnhancedButton';
import GlassCard from '../ui/enhanced/GlassCard';
import FloatingElements from '../ui/enhanced/FloatingElements';
import { useNavigate } from 'react-router-dom';

export const EnhancedHeroSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Monitoramento em tempo real com IA avançada"
    },
    {
      icon: TrendingUp,
      title: "Análise Inteligente", 
      description: "Insights preditivos para suas decisões"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Interface ultra-rápida e responsiva"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FluidBackground intensity={0.8} />
      <FloatingElements count={12} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Title */}
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <TextShimmer className="block">
                SatoTrack
              </TextShimmer>
              <span className="block text-3xl md:text-5xl text-muted-foreground mt-2">
                O olho invisível da blockchain
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Monitore, analise e otimize suas carteiras cripto com inteligência artificial de última geração
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <EnhancedButton
              effect="rainbow"
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </EnhancedButton>
            
            <EnhancedButton
              effect="glass"
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/crypto-3d')}
            >
              Explorar em 3D
            </EnhancedButton>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <GlassCard className="p-6 text-center h-full">
                  <feature.icon className="h-12 w-12 text-satotrack-neon mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-satotrack-neon rounded-full flex justify-center"
          animate={{ 
            boxShadow: [
              '0 0 10px rgba(0, 255, 198, 0.5)',
              '0 0 20px rgba(0, 255, 198, 0.8)',
              '0 0 10px rgba(0, 255, 198, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-2 h-2 bg-satotrack-neon rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedHeroSection;
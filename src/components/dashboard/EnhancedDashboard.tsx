import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Shield, Zap, Activity, Eye } from 'lucide-react';
import GlassCard from '../ui/enhanced/GlassCard';
import HolographicCard from '../ui/enhanced/HolographicCard';
import TextShimmer from '../ui/enhanced/TextShimmer';
import EnhancedButton from '../ui/enhanced/EnhancedButton';
import ModernLoader from '../ui/enhanced/ModernLoader';
import MorphingShapes from '../ui/enhanced/MorphingShapes';
import { useNavigate } from 'react-router-dom';

const statCards = [
  {
    title: "Total em BTC",
    value: "2.34567890",
    suffix: "BTC",
    trend: "+12.5%",
    icon: TrendingUp,
    color: "text-green-400"
  },
  {
    title: "Valor em USD",
    value: "$245,678",
    trend: "+8.3%",
    icon: Wallet,
    color: "text-blue-400"
  },
  {
    title: "Carteiras Ativas",
    value: "12",
    trend: "+2",
    icon: Eye,
    color: "text-cyan-400"
  },
  {
    title: "Score de Segurança",
    value: "98%",
    trend: "Excelente",
    icon: Shield,
    color: "text-green-400"
  }
];

const quickActions = [
  {
    title: "Adicionar Carteira",
    description: "Monitore uma nova carteira Bitcoin",
    icon: Wallet,
    action: "add-wallet",
    color: "neon"
  },
  {
    title: "Visualização 3D",
    description: "Explore em ambiente 3D interativo",
    icon: Activity,
    action: "crypto-3d",
    color: "rainbow"
  },
  {
    title: "Análise IA",
    description: "Insights inteligentes e previsões",
    icon: Zap,
    action: "ai-analysis",
    color: "glass"
  }
];

export const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-wallet':
        navigate('/carteiras');
        break;
      case 'crypto-3d':
        navigate('/crypto-3d');
        break;
      case 'ai-analysis':
        navigate('/analise-ia');
        break;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <TextShimmer className="text-4xl font-bold">
          Dashboard SatoTrack
        </TextShimmer>
        <p className="text-xl text-muted-foreground">
          Monitore, analise e otimize seus ativos crypto
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <HolographicCard className="h-full">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                {index === 0 && <ModernLoader variant="pulse" size="sm" />}
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {stat.title}
              </h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.suffix && (
                    <p className="text-xs text-muted-foreground">{stat.suffix}</p>
                  )}
                </div>
                <span className={`text-sm font-medium ${stat.color}`}>
                  {stat.trend}
                </span>
              </div>
            </HolographicCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          <TextShimmer>Ações Rápidas</TextShimmer>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <GlassCard 
                className="p-6 text-center cursor-pointer"
                onClick={() => handleQuickAction(action.action)}
              >
                <action.icon className="h-12 w-12 text-satotrack-neon mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <EnhancedButton 
                  effect={action.color as any}
                  className="w-full"
                  onClick={() => handleQuickAction(action.action)}
                >
                  Acessar
                </EnhancedButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3D Visualization Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">
            <TextShimmer>Visualização Interativa</TextShimmer>
          </h3>
          <MorphingShapes />
          <div className="text-center mt-4">
            <EnhancedButton
              effect="rainbow"
              onClick={() => navigate('/crypto-3d')}
            >
              Explorar em 3D
            </EnhancedButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;
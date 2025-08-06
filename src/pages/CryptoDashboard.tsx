
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import CryptoDashboardNew from '@/components/crypto/CryptoDashboardNew';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { motion } from 'framer-motion';

const CryptoDashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedGradientBackground 
          startingGap={120}
          Breathing={true}
          gradientColors={["#0A0A0A", "#00ff88", "#0080ff", "#8000ff", "#ff0080"]}
          gradientStops={[20, 40, 60, 80, 100]}
        />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-satotrack-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-satotrack-neon">Carregando Crypto Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedGradientBackground 
        startingGap={120}
        Breathing={true}
        gradientColors={["#0A0A0A", "#00ff88", "#0080ff", "#8000ff", "#ff0080"]}
        gradientStops={[20, 40, 60, 80, 100]}
      />
      
      <div className="relative z-10 min-h-screen bg-background/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CryptoDashboardNew />
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoDashboard;

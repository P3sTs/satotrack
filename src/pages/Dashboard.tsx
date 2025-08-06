
import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import AnimatedLayout from '@/components/ui/enhanced/AnimatedLayout';
import SkeletonLoader from '@/components/ui/enhanced/SkeletonLoader';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Loading state with premium skeleton
  if (loading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedGradientBackground 
          startingGap={120}
          Breathing={true}
          gradientColors={["#0A0A0A", "#00ff88", "#0080ff", "#8000ff", "#ff0080"]}
          gradientStops={[20, 40, 60, 80, 100]}
        />
        <AnimatedLayout>
          <div className="relative z-10 min-h-screen bg-background/80">
            <div className="container mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    className="w-8 h-8 border-2 border-satotrack-neon border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h1 className="text-2xl font-orbitron font-bold text-satotrack-neon">
                    Carregando Dashboard
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Preparando seus dados financeiros...
                </p>
              </motion.div>
              
              <SkeletonLoader variant="dashboard" />
            </div>
          </div>
        </AnimatedLayout>
      </div>
    );
  }

  // Redirect if not authenticated
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
      
      <AnimatedLayout>
        <div className={`relative z-10 min-h-screen bg-background/80 ${isMobile ? 'pb-20' : ''}`}>
          {/* Welcome Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className={isMobile ? 'px-2 py-4' : 'p-6'}
          >
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-satotrack-neon">
                    Dashboard SatoTrack
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Bem-vindo de volta, {user.email?.split('@')[0]}! 👋
                  </p>
                </div>
                
                <motion.div
                  className="hidden md:block"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 5,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-satotrack-neon/20 border-2 border-satotrack-neon/40 flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Dashboard Content with stagger animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <UnifiedDashboard />
            </motion.div>
          </motion.div>
        </div>
      </AnimatedLayout>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import AnimatedLayout from '@/components/ui/enhanced/AnimatedLayout';
import SkeletonLoader from '@/components/ui/enhanced/SkeletonLoader';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Loading state with premium skeleton
  if (loading) {
    return (
      <AnimatedLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h1 className="text-2xl font-orbitron font-bold text-gradient-premium">
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
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AnimatedLayout>
      <div className={`relative min-h-screen bg-gradient-mesh ${isMobile ? 'pb-20' : ''}`}>
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
                <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-gradient-premium">
                  Dashboard Unificado
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
                <div className="w-16 h-16 rounded-full bg-gradient-premium flex items-center justify-center shadow-glow">
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

        {/* Background Decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Dashboard;

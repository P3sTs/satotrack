
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, BarChart3, Eye } from 'lucide-react';
import PremiumButton from '@/components/ui/enhanced/PremiumButton';
import PremiumCard from '@/components/ui/enhanced/PremiumCard';
import AnimatedLayout from '@/components/ui/enhanced/AnimatedLayout';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import PlatformInfo from '@/components/home/PlatformInfo';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import { useAuth } from '@/contexts/auth';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/auth');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Cores customizadas para o tema SatoTrack
  const satoTrackGradient = [
    "#0A0A0A",           // Dashboard dark
    "#00FFC6",           // SatoTrack neon
    "#06B6D4",           // Cyan-500
    "#3B82F6",           // Blue-500  
    "#8B5CF6",           // Violet-500
    "#10B981",           // Emerald-500
    "#F59E0B"            // Amber-500
  ];

  return (
    <AnimatedLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Gradient Animado */}
        <AnimatedGradientBackground
          Breathing={true}
          gradientColors={satoTrackGradient}
          gradientStops={[20, 35, 50, 65, 75, 85, 100]}
          startingGap={120}
          breathingRange={8}
          animationSpeed={0.015}
          topOffset={10}
        />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
            <motion.div
              className="text-center max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Logo and Brand */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-8"
                variants={itemVariants}
              >
                <div className="relative">
                  <img 
                    src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                    alt="SatoTrack Logo" 
                    className="h-16 w-16 md:h-20 md:w-20"
                  />
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-gradient-premium">
                  SatoTrack
                </h1>
              </motion.div>

              {/* Hero Headline */}
              <motion.h2
                className="text-2xl md:text-4xl lg:text-5xl font-urbanist font-bold text-foreground mb-6 leading-tight"
                variants={itemVariants}
              >
                Rastreie suas carteiras{' '}
                <span className="text-neon-green">Bitcoin</span>{' '}
                com inteligência
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                A plataforma mais avançada para monitoramento de ativos cripto. 
                Análises em tempo real, alertas inteligentes e insights poderosos 
                para maximizar seus investimentos.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                variants={itemVariants}
              >
                <PremiumButton
                  size="lg"
                  variant="primary"
                  glow={true}
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto"
                >
                  {isAuthenticated ? 'Acessar Dashboard' : 'Começar Agora'}
                </PremiumButton>

                <PremiumButton
                  size="lg"
                  variant="ghost"
                  icon={<Eye className="h-5 w-5" />}
                  onClick={() => navigate('/sobre')}
                  className="w-full sm:w-auto"
                >
                  Conhecer Plataforma
                </PremiumButton>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <PremiumCard 
                    variant="glass" 
                    interactive={true}
                    className="text-center h-full hover-lift"
                  >
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
                    <p className="text-muted-foreground">
                      Seus dados protegidos com criptografia de ponta
                    </p>
                  </PremiumCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <PremiumCard 
                    variant="glass" 
                    interactive={true}
                    className="text-center h-full hover-lift"
                  >
                    <Zap className="h-12 w-12 text-neon-green mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Tempo Real</h3>
                    <p className="text-muted-foreground">
                      Atualizações instantâneas de seus ativos
                    </p>
                  </PremiumCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <PremiumCard 
                    variant="glass" 
                    interactive={true}
                    className="text-center h-full hover-lift"
                  >
                    <BarChart3 className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Análises Pro</h3>
                    <p className="text-muted-foreground">
                      Insights avançados para decisões inteligentes
                    </p>
                  </PremiumCard>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Platform Info Section */}
        <PlatformInfo />

        {/* Features Section */}
        <FeaturesSection />

        {/* Call to Action Section */}
        <CallToActionSection />

        {/* Footer */}
        <footer className="bg-dashboard-dark/50 backdrop-blur-md border-t border-border/30 py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                    alt="SatoTrack Logo" 
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-orbitron font-bold text-gradient-premium">
                    SatoTrack
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  A plataforma mais confiável para rastrear seus ativos Bitcoin.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Plataforma</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                  <li><Link to="/carteiras" className="hover:text-foreground transition-colors">Carteiras</Link></li>
                  <li><Link to="/mercado" className="hover:text-foreground transition-colors">Mercado</Link></li>
                  <li><Link to="/planos" className="hover:text-foreground transition-colors">Planos</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/sobre" className="hover:text-foreground transition-colors">Sobre</Link></li>
                  <li><Link to="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link></li>
                  <li><Link to="/termos" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Contato</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>suporte@satotrack.com</li>
                  <li>+55 (11) 99999-9999</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/30 mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} SatoTrack. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedLayout>
  );
};

export default Home;

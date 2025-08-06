
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrustWalletCard, CryptoCardContent } from '@/components/ui/trust-wallet-card';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { useAuth } from '@/contexts/auth';

const TrustWalletStyleHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const satoTrackGradient = [
    "#0A0A0A",
    "#00FFC6",
    "#06B6D4", 
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B"
  ];

  const cryptoAssets = [
    {
      icon: "₿",
      name: "Bitcoin",
      symbol: "BTC",
      balance: "0.00",
      balanceUSD: "$0.00",
      change: 2.5
    },
    {
      icon: "Ξ", 
      name: "Ethereum",
      symbol: "ETH",
      balance: "0.00",
      balanceUSD: "$0.00",
      change: -1.2
    },
    {
      icon: "◎",
      name: "Solana", 
      symbol: "SOL",
      balance: "0.00",
      balanceUSD: "$0.00",
      change: 5.8
    }
  ];

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <AnimatedGradientBackground
        Breathing={true}
        gradientColors={satoTrackGradient}
        gradientStops={[20, 35, 50, 65, 75, 85, 100]}
        startingGap={120}
        breathingRange={8}
        animationSpeed={0.015}
        topOffset={10}
      />

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm border border-border/30 rounded-full px-4 py-2"
              >
                <Shield className="h-4 w-4 text-satotrack-neon" />
                <span className="text-sm font-medium text-satotrack-neon">Segurança Garantida</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">A carteira</span><br />
                <span className="text-satotrack-neon">mais confiável</span><br />
                <span className="text-foreground">do mundo</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Compre, armazene, troque e ganhe crypto com a SatoTrack. 
                Mais de 70 milhões de carteiras criadas para acessar Web3.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90 text-lg px-8 py-6 rounded-2xl font-semibold group"
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
              >
                <Download className="h-5 w-5 mr-2" />
                {user ? 'Abrir Carteira' : 'Criar Carteira'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button 
                variant="outline"
                size="lg" 
                className="border-border/50 text-foreground hover:bg-card/50 text-lg px-8 py-6 rounded-2xl font-semibold"
                onClick={() => navigate('/sobre')}
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Saiba Mais
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>70M+ usuários</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>100+ países</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>13 anos</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Crypto Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="grid gap-4 max-w-md mx-auto lg:mx-0">
              {cryptoAssets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                >
                  <TrustWalletCard variant="crypto" className="hover:scale-105 transition-transform duration-200">
                    <CryptoCardContent
                      icon={<span className="text-2xl">{asset.icon}</span>}
                      name={asset.name}
                      symbol={asset.symbol}
                      balance={`${asset.balance} ${asset.symbol}`}
                      balanceUSD={asset.balanceUSD}
                      change={asset.change}
                    />
                  </TrustWalletCard>
                </motion.div>
              ))}
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
            />
            
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustWalletStyleHero;


import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, CreditCard, TrendingUp, Shield, Coins, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrustWalletCard } from '@/components/ui/trust-wallet-card';

const TrustWalletProducts = () => {
  const products = [
    {
      icon: <Wallet className="h-12 w-12 text-blue-400" />,
      title: "Carteira Multi-chain",
      description: "Gerencie Bitcoin, Ethereum, Solana e mais de 70 redes em um só lugar.",
      features: ["70+ blockchains", "Importação fácil", "Backup seguro"],
      gradient: "from-blue-400/10 to-cyan-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      icon: <CreditCard className="h-12 w-12 text-purple-400" />,
      title: "Cartão SatoTrack",
      description: "Gaste suas criptos no mundo real com nosso cartão de débito crypto.",
      features: ["Cashback em crypto", "Sem taxas anuais", "Global"],
      gradient: "from-purple-400/10 to-pink-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-green-400" />,
      title: "DeFi & Staking",
      description: "Ganhe recompensas fazendo stake e participando do ecossistema DeFi.",
      features: ["APY até 20%", "Staking líquido", "Auto-compound"],
      gradient: "from-green-400/10 to-emerald-400/10",
      borderColor: "border-green-400/20"
    },
    {
      icon: <Shield className="h-12 w-12 text-orange-400" />,
      title: "Segurança Avançada",
      description: "Proteção multicamadas com tecnologia KMS e autenticação biométrica.",
      features: ["KMS Enterprise", "2FA", "Backup criptografado"],
      gradient: "from-orange-400/10 to-red-400/10",
      borderColor: "border-orange-400/20"
    }
  ];

  return (
    <section className="py-20 bg-card/20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-satotrack-neon/20 border border-satotrack-neon/30 rounded-full px-4 py-2 mb-6">
            <Coins className="h-4 w-4 text-satotrack-neon" />
            <span className="text-sm font-medium text-satotrack-neon">Produtos SatoTrack</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Tudo que você precisa</span><br />
            <span className="text-satotrack-neon">em um só lugar</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma suíte completa de produtos para suas necessidades crypto, 
            desde armazenamento seguro até gastos no mundo real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TrustWalletCard 
                className={`h-full bg-gradient-to-br ${product.gradient} border ${product.borderColor} hover:scale-105 transition-all duration-300 group`}
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-card/50 rounded-2xl backdrop-blur-sm`}>
                      {product.icon}
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">{product.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full text-foreground font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TrustWalletCard>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-satotrack-neon/10 to-blue-400/10 border border-satotrack-neon/20 rounded-3xl p-8 max-w-2xl mx-auto">
            <Zap className="h-16 w-16 text-satotrack-neon mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Pronto para começar?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Crie sua conta gratuita e tenha acesso a todos os produtos SatoTrack
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90 font-semibold px-8 py-3 rounded-2xl group"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-border/50 text-foreground hover:bg-card/50 font-semibold px-8 py-3 rounded-2xl"
              >
                Ver Todos os Produtos
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustWalletProducts;

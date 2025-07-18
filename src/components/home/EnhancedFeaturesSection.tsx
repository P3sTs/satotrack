
import React, { useState } from 'react';
import { 
  Shield, 
  BarChart3, 
  ArrowLeftRight, 
  Lightbulb, 
  Wallet, 
  Lock,
  TrendingUp,
  CreditCard,
  Smartphone,
  Zap
} from 'lucide-react';
import { InteractiveFeatureCard } from './InteractiveFeatureCard';
import { FeatureModal } from './FeatureModal';

interface FeatureData {
  id: string;
  icon: typeof Shield;
  title: string;
  description: string;
  detailedContent: string;
  actionType: 'modal' | 'route';
  actionTarget?: string;
  actionButton?: {
    text: string;
    route: string;
  };
  premium?: boolean;
  color: 'blue' | 'purple' | 'emerald' | 'orange' | 'yellow' | 'neon';
}

const featuresData: FeatureData[] = [
  {
    id: 'security',
    icon: Shield,
    title: 'Segurança KMS',
    description: 'Saiba como suas chaves são protegidas com criptografia de nível bancário.',
    detailedContent: 'Nossa plataforma utiliza Key Management System (KMS) para proteger suas chaves privadas. Todas as informações sensíveis são criptografadas usando algoritmos de ponta, garantindo que nem mesmo nós temos acesso às suas chaves. Sua segurança é nossa prioridade máxima.',
    actionType: 'modal',
    actionButton: {
      text: 'Configurar Segurança',
      route: '/security'
    },
    color: 'neon'
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Relatórios Avançados',
    description: 'Veja seu resumo de movimentações e performance de ativos.',
    detailedContent: 'Acesse relatórios detalhados sobre sua carteira, incluindo histórico de transações, performance de investimentos, análise de portfólio e insights personalizados para otimizar seus ganhos.',
    actionType: 'route',
    actionTarget: '/performance-analytics',
    premium: true,
    color: 'purple'
  },
  {
    id: 'converter',
    icon: ArrowLeftRight,
    title: 'Conversor Cripto',
    description: 'Ferramenta rápida de conversão entre criptomoedas e moedas fiduciárias.',
    detailedContent: 'Converta instantaneamente entre mais de 50 criptomoedas e moedas tradicionais com taxas em tempo real. Nossa ferramenta oferece as melhores cotações do mercado.',
    actionType: 'route',
    actionTarget: '/currency-converter',
    color: 'emerald'
  },
  {
    id: 'wallet',
    icon: Wallet,
    title: 'Carteira Multi-Chain',
    description: 'Gerencie Bitcoin, Ethereum, Polygon e mais em uma única interface.',
    detailedContent: 'Nossa carteira suporta múltiplas blockchains, permitindo que você gerencie todos seus ativos cripto em um só lugar. Envie, receba e monitore suas criptomoedas com facilidade.',
    actionType: 'route',
    actionTarget: '/wallet-dashboard',
    color: 'blue'
  },
  {
    id: 'tips',
    icon: Lightbulb,
    title: 'Insights de Mercado',
    description: 'Receba dicas e análises sobre o mercado cripto atual.',
    detailedContent: 'Nosso sistema de IA analisa o mercado 24/7 para trazer insights valiosos, alertas de preço e oportunidades de investimento personalizadas para seu perfil.',
    actionType: 'modal',
    actionButton: {
      text: 'Ver Análises',
      route: '/mercado'
    },
    color: 'orange'
  },
  {
    id: 'security-pin',
    icon: Lock,
    title: 'PIN & Biometria',
    description: 'Configure PIN de 6 dígitos e autenticação biométrica.',
    detailedContent: 'Proteja sua conta com PIN personalizado e autenticação biométrica. Adicione uma camada extra de segurança que só você pode acessar.',
    actionType: 'route',
    actionTarget: '/security-pin',
    color: 'yellow'
  },
  {
    id: 'trading',
    icon: TrendingUp,
    title: 'Trading Signals',
    description: 'Sinais de trading baseados em IA para maximizar seus lucros.',
    detailedContent: 'Receba sinais de compra e venda baseados em análise técnica avançada e machine learning. Aumente suas chances de sucesso no trading.',
    actionType: 'modal',
    premium: true,
    color: 'purple'
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Pagamentos',
    description: 'Aceite pagamentos cripto e fiat em seus produtos e serviços.',
    detailedContent: 'Crie links de pagamento personalizados para vender produtos digitais. Aceite Bitcoin, Ethereum, PIX e cartão de crédito com facilidade.',
    actionType: 'modal',
    actionButton: {
      text: 'Criar Link',
      route: '/payments'
    },
    premium: true,
    color: 'emerald'
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'App Mobile',
    description: 'Acesse sua carteira pelo celular com nossa PWA.',
    detailedContent: 'Instale nosso Progressive Web App e tenha acesso completo à sua carteira cripto no celular, com todas as funcionalidades da versão web.',
    actionType: 'modal',
    color: 'blue'
  },
  {
    id: 'api',
    icon: Zap,
    title: 'API Premium',
    description: 'Integre nossa API em seus projetos e aplicações.',
    detailedContent: 'Para desenvolvedores: acesse nossa API REST completa para integrar funcionalidades de carteira cripto em suas aplicações.',
    actionType: 'modal',
    actionButton: {
      text: 'Ver Documentação',
      route: '/api-docs'
    },
    premium: true,
    color: 'neon'
  }
];

export const EnhancedFeaturesSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  const handleCardClick = (feature: FeatureData) => {
    if (feature.actionType === 'modal') {
      setSelectedFeature(feature);
    }
  };

  const handleCloseModal = () => {
    setSelectedFeature(null);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Explore Nossas Funcionalidades
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra todas as ferramentas e recursos que a SatoTracker oferece para gerenciar seus ativos digitais com segurança e eficiência.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuresData.map((feature) => (
            <InteractiveFeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              actionType={feature.actionType}
              actionTarget={feature.actionTarget}
              onCardClick={() => handleCardClick(feature)}
              premium={feature.premium}
              color={feature.color}
            />
          ))}
        </div>

        {selectedFeature && (
          <FeatureModal
            isOpen={!!selectedFeature}
            onClose={handleCloseModal}
            icon={selectedFeature.icon}
            title={selectedFeature.title}
            description={selectedFeature.description}
            detailedContent={selectedFeature.detailedContent}
            actionButton={selectedFeature.actionButton}
            color={selectedFeature.color}
          />
        )}
      </div>
    </section>
  );
};

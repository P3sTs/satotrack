
import React from 'react';
import { Bitcoin, Bell, FileText } from 'lucide-react';
import PremiumFeatureCard from '@/components/monetization/PremiumFeatureCard';

const PremiumFeatures: React.FC = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-3 md:mb-4">Recursos Premium</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PremiumFeatureCard
          title="Múltiplas Carteiras"
          description="Adicione e gerencie múltiplas carteiras Bitcoin para monitoramento completo."
          icon={<Bitcoin className="text-bitcoin h-5 w-5" />}
          benefits={[
            "Adicione carteiras ilimitadas",
            "Organize em grupos personalizados",
            "Compare performance entre carteiras",
            "Monitore saldo total de todas as carteiras"
          ]}
        />
        
        <PremiumFeatureCard
          title="Alertas Inteligentes"
          description="Receba notificações de movimentações importantes em suas carteiras."
          icon={<Bell className="text-satotrack-neon h-5 w-5" />}
          benefits={[
            "Notificações de transações em tempo real",
            "Alertas de variação de preço do Bitcoin",
            "Notificações por e-mail e Telegram",
            "Alertas de segurança personalizados"
          ]}
        />
        
        <PremiumFeatureCard
          title="Relatórios Avançados"
          description="Exporte relatórios completos da atividade de suas carteiras."
          icon={<FileText className="text-blue-400 h-5 w-5" />}
          benefits={[
            "Relatórios em formato PDF e CSV",
            "Histórico completo de transações",
            "Análises de ganhos e perdas",
            "Dados fiscais para declaração"
          ]}
        />
      </div>
    </div>
  );
};

export default PremiumFeatures;

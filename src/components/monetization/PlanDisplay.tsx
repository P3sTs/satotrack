
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LockOpen, Lock, CheckCircle, XCircle } from 'lucide-react';
import { PlanType } from '@/contexts/auth/types';

export const PlanBadge = () => {
  const { userPlan } = useAuth();
  
  return (
    <Badge className={userPlan === 'premium' ? "bg-bitcoin text-white" : "bg-muted text-muted-foreground"}>
      {userPlan === 'premium' ? 'Premium' : 'Plano Gratuito'}
    </Badge>
  );
};

interface PlanFeatureProps {
  feature: string;
  includedIn: PlanType[];
  isHighlighted?: boolean;
}

export const PlanFeature: React.FC<PlanFeatureProps> = ({ feature, includedIn, isHighlighted }) => {
  return (
    <div className={`flex items-center py-2 ${isHighlighted ? 'font-medium' : ''}`}>
      {includedIn.includes('free') ? (
        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
      ) : (
        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
      )}
      <span>{feature}</span>
    </div>
  );
};

export const PlanComparisonTable: React.FC = () => {
  const { userPlan, upgradeUserPlan } = useAuth();
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 p-4 border-b">
        <div className="font-medium">Recurso</div>
        <div className="font-medium text-center">Gratuito</div>
        <div className="font-medium text-center">Premium</div>
      </div>
      
      <div className="grid grid-cols-3 p-4 border-b">
        <div>Carteiras monitoradas</div>
        <div className="text-center">1</div>
        <div className="text-center">Ilimitadas</div>
      </div>
      
      <div className="grid grid-cols-3 p-4 border-b">
        <div>Dados de mercado</div>
        <div className="text-center">Básico</div>
        <div className="text-center">Avançado</div>
      </div>
      
      <div className="grid grid-cols-3 p-4 border-b">
        <div>Alertas por Telegram/Email</div>
        <div className="text-center"><XCircle className="h-4 w-4 mx-auto text-red-500" /></div>
        <div className="text-center"><CheckCircle className="h-4 w-4 mx-auto text-green-500" /></div>
      </div>
      
      <div className="grid grid-cols-3 p-4 border-b">
        <div>Relatórios mensais</div>
        <div className="text-center"><XCircle className="h-4 w-4 mx-auto text-red-500" /></div>
        <div className="text-center"><CheckCircle className="h-4 w-4 mx-auto text-green-500" /></div>
      </div>
      
      <div className="grid grid-cols-3 p-4 border-b">
        <div>Gráficos interativos</div>
        <div className="text-center">Básico</div>
        <div className="text-center">Avançado</div>
      </div>
      
      <div className="grid grid-cols-3 p-4 border-b">
        <div>Acesso à API</div>
        <div className="text-center"><XCircle className="h-4 w-4 mx-auto text-red-500" /></div>
        <div className="text-center"><CheckCircle className="h-4 w-4 mx-auto text-green-500" /></div>
      </div>
      
      <div className="grid grid-cols-3 p-4">
        <div>Sem anúncios</div>
        <div className="text-center"><XCircle className="h-4 w-4 mx-auto text-red-500" /></div>
        <div className="text-center"><CheckCircle className="h-4 w-4 mx-auto text-green-500" /></div>
      </div>
      
      {userPlan !== 'premium' && (
        <div className="p-4 bg-muted/30 flex justify-center">
          <Button 
            onClick={upgradeUserPlan} 
            className="bg-bitcoin hover:bg-bitcoin/90 text-white"
          >
            <LockOpen className="h-4 w-4 mr-2" />
            Upgrade para Premium
          </Button>
        </div>
      )}
    </div>
  );
};

export const UpgradeButton: React.FC<{ className?: string }> = ({ className }) => {
  const { userPlan, upgradeUserPlan } = useAuth();
  
  if (userPlan === 'premium') return null;
  
  return (
    <Button 
      onClick={upgradeUserPlan}
      className={`bg-bitcoin hover:bg-bitcoin/90 text-white ${className}`}
      size="sm"
    >
      <LockOpen className="h-4 w-4 mr-2" />
      Upgrade para Premium
    </Button>
  );
};

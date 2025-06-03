
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RewardsCardProps {
  referralsNeeded: number;
}

const RewardsCard: React.FC<RewardsCardProps> = ({ referralsNeeded }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistema de Recompensas</CardTitle>
        <CardDescription>
          Veja o que você ganha a cada marco de indicações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
            <div>
              <div className="font-medium">20 Indicações</div>
              <div className="text-sm text-muted-foreground">Primeiro marco</div>
            </div>
            <Badge className="bg-bitcoin text-white">
              1 Mês Premium
            </Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
            <div>
              <div className="font-medium">40 Indicações</div>
              <div className="text-sm text-muted-foreground">Segundo marco</div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              +1 Mês Premium
            </Badge>
          </div>

          <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
            <div>
              <div className="font-medium">60+ Indicações</div>
              <div className="text-sm text-muted-foreground">Cada 20 indicações</div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">
              +1 Mês Premium
            </Badge>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-bitcoin/10 rounded-lg border border-bitcoin/20">
          <h4 className="font-medium mb-2 text-bitcoin">🎯 Próxima Meta</h4>
          <div className="text-lg font-bold">
            {referralsNeeded === 20 ? '20 indicações' : `${referralsNeeded} indicações restantes`}
          </div>
          <div className="text-sm text-muted-foreground">
            Para ganhar 1 mês Premium gratuito
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;

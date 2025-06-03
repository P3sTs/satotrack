
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Trophy, Clock, Coins } from 'lucide-react';

interface ReferralStatsProps {
  totalReferrals: number;
  referralsNeeded: number;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ totalReferrals, referralsNeeded }) => {
  const progress = ((totalReferrals % 20) / 20) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 text-bitcoin mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalReferrals}</div>
          <div className="text-sm text-muted-foreground">Total de Indicações</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{Math.floor(totalReferrals / 20)}</div>
          <div className="text-sm text-muted-foreground">Prêmios Ganhos</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{referralsNeeded}</div>
          <div className="text-sm text-muted-foreground">Faltam para Próximo</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Coins className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Progresso Atual</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;

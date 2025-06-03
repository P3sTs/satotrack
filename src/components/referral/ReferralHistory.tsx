
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { ReferralData } from '@/contexts/referral/ReferralContext';

interface ReferralHistoryProps {
  referralHistory: ReferralData[];
}

const ReferralHistory: React.FC<ReferralHistoryProps> = ({ referralHistory }) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Histórico de Indicações</CardTitle>
        <CardDescription>
          Acompanhe suas indicações mais recentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referralHistory.length > 0 ? (
          <div className="space-y-4">
            {referralHistory.map((referral) => (
              <div key={referral.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{referral.referred_user_email}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(referral.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <Badge 
                  variant={referral.status === 'completed' ? 'default' : 'secondary'}
                  className={referral.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                >
                  {referral.status === 'completed' ? 'Válida' : 'Pendente'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Você ainda não fez nenhuma indicação. Comece compartilhando seu código!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralHistory;

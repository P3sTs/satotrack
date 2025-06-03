
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Mail } from 'lucide-react';
import { ReferralData } from '@/contexts/referral/ReferralContext';

interface ReferralHistoryProps {
  referralHistory: ReferralData[];
}

const ReferralHistory: React.FC<ReferralHistoryProps> = ({ referralHistory }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Válida';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Histórico de Indicações
        </CardTitle>
        <CardDescription>
          Acompanhe suas indicações mais recentes e seu status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referralHistory.length > 0 ? (
          <div className="space-y-4">
            {referralHistory.map((referral) => (
              <div 
                key={referral.id} 
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-2 sm:space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm sm:text-base">
                      {referral.referred_user_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(referral.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(referral.status)}
                  >
                    {getStatusText(referral.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma indicação ainda</h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não fez nenhuma indicação. Comece compartilhando seu código!
            </p>
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p>💡 <strong>Dica:</strong> Compartilhe seu código com amigos e familiares</p>
              <p>para começar a ganhar meses Premium gratuitos!</p>
            </div>
          </div>
        )}
        
        {referralHistory.length > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {referralHistory.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Indicações Válidas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {referralHistory.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralHistory;

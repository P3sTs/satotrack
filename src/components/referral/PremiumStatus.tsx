
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Calendar } from 'lucide-react';

interface PremiumStatusProps {
  isPremium: boolean;
  premiumExpiry?: string | null;
}

const PremiumStatus: React.FC<PremiumStatusProps> = ({ isPremium, premiumExpiry }) => {
  if (!isPremium) return null;

  const expiryDate = premiumExpiry ? new Date(premiumExpiry) : null;
  const isExpired = expiryDate && expiryDate < new Date();

  return (
    <div className="mb-6">
      <Card className={`bg-gradient-to-r ${isExpired ? 'from-red-100 to-red-200 border-red-300' : 'from-bitcoin/10 to-bitcoin/20 border-bitcoin/30'}`}>
        <CardContent className="p-6 text-center">
          <Star className={`h-8 w-8 mx-auto mb-2 ${isExpired ? 'text-red-600' : 'text-bitcoin'}`} />
          <h3 className={`text-xl font-bold ${isExpired ? 'text-red-600' : 'text-bitcoin'}`}>
            {isExpired ? '⚠️ Premium Expirado' : '🌟 Usuário Premium Ativo'}
          </h3>
          <p className="text-muted-foreground">
            {isExpired 
              ? 'Seu plano Premium expirou. Continue indicando amigos para renovar!'
              : 'Você tem acesso completo a todas as funcionalidades!'
            }
          </p>
          {expiryDate && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {isExpired ? 'Expirou em' : 'Válido até'}: {expiryDate.toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumStatus;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface PremiumStatusProps {
  isPremium: boolean;
}

const PremiumStatus: React.FC<PremiumStatusProps> = ({ isPremium }) => {
  if (!isPremium) return null;

  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-bitcoin/10 to-bitcoin/20 border-bitcoin/30">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 text-bitcoin mx-auto mb-2" />
          <h3 className="text-xl font-bold text-bitcoin">🌟 Usuário Premium Ativo</h3>
          <p className="text-muted-foreground">Você tem acesso completo a todas as funcionalidades!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumStatus;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface FreePlanNoticeProps {
  walletLimit: number | null;
  usedWallets: number;
}

const FreePlanNotice: React.FC<FreePlanNoticeProps> = ({ walletLimit, usedWallets }) => {
  return (
    <div className="mb-6 p-4 border border-dashboard-light/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="bg-dashboard-medium rounded-full p-2">
          <Lock className="h-5 w-5 text-satotrack-neon" />
        </div>
        <div>
          <h3 className="font-medium text-satotrack-text">Plano Gratuito</h3>
          <p className="text-sm text-muted-foreground">
            Você pode adicionar {walletLimit} {walletLimit === 1 ? 'carteira' : 'carteiras'}.
            {walletLimit && ` ${usedWallets}/${walletLimit} utilizada.`}
          </p>
        </div>
      </div>
      <Link to="/planos">
        <Button variant="outline" size="sm" className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10">
          Ver planos
        </Button>
      </Link>
    </div>
  );
};

export default FreePlanNotice;

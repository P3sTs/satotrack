
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
    <div className="mb-6 p-4 border border-dashed rounded-lg flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-full p-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">Plano Gratuito</h3>
          <p className="text-sm text-muted-foreground">
            Você pode adicionar {walletLimit} {walletLimit === 1 ? 'carteira' : 'carteiras'}.
            {walletLimit && ` ${usedWallets}/${walletLimit} utilizado.`}
          </p>
        </div>
      </div>
      <Link to="/planos">
        <Button variant="neon" size="sm">Ver planos</Button>
      </Link>
    </div>
  );
};

export default FreePlanNotice;

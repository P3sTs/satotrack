import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Repeat, 
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';

interface TokenSwapProps {
  userWallets?: any[];
}

const TokenSwap: React.FC<TokenSwapProps> = ({ userWallets = [] }) => {
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = async () => {
    setIsSwapping(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('🔄 Swap simulado - Feature em desenvolvimento');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Repeat className="h-5 w-5 text-yellow-400" />
            Token Swap
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <ArrowUpDown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Swap de Tokens</h3>
            <p className="text-muted-foreground mb-4">Funcionalidade em desenvolvimento</p>
            <Button
              onClick={handleSwap}
              disabled={isSwapping}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
            >
              {isSwapping ? 'Processando...' : 'Testar Swap (Demo)'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-red-300">⚠️ Versão Beta:</p>
              <ul className="text-red-200 space-y-1 text-xs">
                <li>• Funcionalidade em desenvolvimento</li>
                <li>• Use com cautela em produção</li>
                <li>• Integração Tatum API em progresso</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenSwap;
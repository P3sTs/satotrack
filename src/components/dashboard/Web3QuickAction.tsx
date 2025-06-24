
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, ArrowRight, Shield, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Web3QuickAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-satotrack-neon/10 via-blue-500/5 to-purple-500/10 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-all duration-300 group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-satotrack-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-satotrack-neon/20 rounded-lg">
              <Zap className="h-6 w-6 text-satotrack-neon" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-satotrack-text">Web3 Wallets</h3>
              <p className="text-sm text-muted-foreground">Carteiras cripto seguras</p>
            </div>
          </div>
          <Badge variant="outline" className="border-satotrack-neon/50 text-satotrack-neon">
            Novo
          </Badge>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-muted-foreground">Chaves privadas seguras</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4 text-blue-400" />
            <span className="text-muted-foreground">Suporte BTC, ETH, MATIC</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4 text-purple-400" />
            <span className="text-muted-foreground">Envio e recebimento direto</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/web3')}
            className="gap-2 hover:bg-satotrack-neon/10 hover:border-satotrack-neon/50"
          >
            <Zap className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/web3')}
            className="gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            Criar Carteira
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Web3QuickAction;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Wallet, Activity, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface WalletStatusSectionProps {
  walletsCount: number;
  isGenerating: boolean;
}

export const WalletStatusSection: React.FC<WalletStatusSectionProps> = ({
  walletsCount,
  isGenerating
}) => {
  const { user } = useAuth();

  return (
    <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-satotrack-neon" />
          Status da Conta
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-dashboard-dark/50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-white truncate">
                {user?.email || 'Não disponível'}
              </p>
            </div>
          </div>

          {/* Wallet Count */}
          <div className="flex items-center gap-3 p-3 bg-dashboard-dark/50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carteiras Ativas</p>
              <p className="text-sm font-medium text-white">
                {walletsCount} redes
              </p>
            </div>
          </div>

          {/* Security Status */}
          <div className="flex items-center gap-3 p-3 bg-dashboard-dark/50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-satotrack-neon/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-satotrack-neon" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Segurança</p>
              <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon text-xs">
                SatoTracker KMS
              </Badge>
            </div>
          </div>
        </div>

        {/* User ID */}
        <div className="p-3 bg-dashboard-dark/30 rounded-xl border border-dashboard-light/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">ID do Usuário:</span>
            <span className="text-xs font-mono text-white">
              {user?.id ? `${user.id.slice(0, 8)}...${user.id.slice(-8)}` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-yellow-400">
                Gerando novas carteiras...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
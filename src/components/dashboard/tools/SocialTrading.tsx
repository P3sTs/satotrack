
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  MessageSquare
} from 'lucide-react';

const SocialTrading: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Users className="h-5 w-5" />
          Trading Social
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">
                CR
              </div>
              <div>
                <div className="text-sm font-medium">CryptoRocker</div>
                <div className="text-xs text-muted-foreground">+34.5% este mês</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
              Seguir
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                BT
              </div>
              <div>
                <div className="text-sm font-medium">BitTrader99</div>
                <div className="text-xs text-muted-foreground">+28.2% este mês</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
              Seguir
            </Button>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium">Chat da Comunidade</span>
          </div>
          <div className="text-xs text-muted-foreground">
            🚀 "BTC rompeu resistência! Próximo target: $50k"
          </div>
        </div>
        
        <Button className="w-full bg-green-500 text-black hover:bg-green-600">
          Entrar na Comunidade
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialTrading;

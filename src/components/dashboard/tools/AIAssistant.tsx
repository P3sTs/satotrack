
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  Clock,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import SatoAIChat from '../chat/SatoAIChat';

const AIAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Brain className="h-5 w-5" />
          SatoAI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <div className="text-sm">
            <strong>💡 Insight do Dia:</strong>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            "Com base no seu perfil de risco, recomendo rebalancear 15% do portfólio para altcoins antes do próximo halving."
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span className="text-sm">Próxima análise: 2h 15m</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm">Confiança da IA: 87%</span>
          </div>
        </div>
        
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400">
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversar com SatoAI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-transparent border-none p-0">
            <div className="flex justify-center">
              <SatoAIChat 
                context="Dashboard - Ferramentas"
                onToggleMinimize={() => setIsChatOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;

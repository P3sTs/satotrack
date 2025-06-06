
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  Zap, 
  Brain, 
  Gamepad2,
  Trophy,
  Clock,
  Users,
  MessageSquare
} from 'lucide-react';

const ImmersiveTools: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState('1000');
  const [targetProfit, setTargetProfit] = useState('20');
  const [timeFrame, setTimeFrame] = useState('30');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculadora de Investimentos */}
      <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-satotrack-neon">
            <Calculator className="h-5 w-5" />
            Calculadora de ROI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Valor do Investimento (USD)</label>
            <Input 
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta de Lucro (%)</label>
            <Input 
              value={targetProfit}
              onChange={(e) => setTargetProfit(e.target.value)}
              placeholder="20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Prazo (dias)</label>
            <Input 
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              placeholder="30"
            />
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50 border border-satotrack-neon/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                ${(parseFloat(investmentAmount) * (1 + parseFloat(targetProfit) / 100)).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Valor projetado em {timeFrame} dias
              </div>
              <div className="text-sm text-green-500">
                +${(parseFloat(investmentAmount) * parseFloat(targetProfit) / 100).toFixed(2)} lucro
              </div>
            </div>
          </div>
          
          <Button className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90">
            Calcular Estratégia
          </Button>
        </CardContent>
      </Card>

      {/* Gamificação */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Gamepad2 className="h-5 w-5" />
            Centro de Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
              <div className="text-sm font-medium">Primeiro Milhão</div>
              <div className="text-xs text-muted-foreground">75% completo</div>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Target className="h-6 w-6 text-blue-400 mb-2" />
              <div className="text-sm font-medium">Meta Mensal</div>
              <div className="text-xs text-muted-foreground">12/30 dias</div>
            </div>
            
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <TrendingUp className="h-6 w-6 text-green-400 mb-2" />
              <div className="text-sm font-medium">Streak</div>
              <div className="text-xs text-muted-foreground">7 dias</div>
            </div>
            
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Zap className="h-6 w-6 text-orange-400 mb-2" />
              <div className="text-sm font-medium">Power User</div>
              <div className="text-xs text-muted-foreground">Nível 3</div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">XP do Dia</span>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                +250 XP
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Continue negociando para ganhar mais XP!
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IA Assistant */}
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
          
          <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400">
            Conversar com SatoAI
          </Button>
        </CardContent>
      </Card>

      {/* Social Trading */}
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
    </div>
  );
};

export default ImmersiveTools;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Gamepad2,
  Trophy
} from 'lucide-react';

const AchievementsCenter: React.FC = () => {
  return (
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
  );
};

export default AchievementsCenter;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { useProgressTracker } from './hooks/useProgressTracker';
import ProgressOverview from './components/ProgressOverview';
import ProgressDetail from './components/ProgressDetail';

const ProgressTracker: React.FC = () => {
  const { goals, loading } = useProgressTracker();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-muted/20">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nenhuma meta ativa</h3>
          <p className="text-muted-foreground">
            Crie uma meta para acompanhar seu progresso aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressOverview goals={goals} />
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <ProgressDetail key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;

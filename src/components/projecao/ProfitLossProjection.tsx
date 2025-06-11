
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import GoalsManager from './GoalsManager';
import ProgressTracker from './ProgressTracker';
import ProjectionsChart from './ProjectionsChart';
import NewGoalModal from './NewGoalModal';

const ProfitLossProjection: React.FC = () => {
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">🎯 Metas e Projeções</h1>
          <p className="text-muted-foreground">
            Defina objetivos financeiros e acompanhe seu progresso em tempo real
          </p>
        </div>
        <Button onClick={() => setIsNewGoalModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Minhas Metas</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="projections">Projeções</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-6">
          <GoalsManager />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <ProgressTracker />
        </TabsContent>
        
        <TabsContent value="projections" className="space-y-6">
          <ProjectionsChart />
        </TabsContent>
      </Tabs>

      <NewGoalModal 
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
      />
    </div>
  );
};

export default ProfitLossProjection;

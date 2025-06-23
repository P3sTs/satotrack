
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Brain, Loader2 } from 'lucide-react';
import { TimeframeType, ScenarioType } from '../types/projectionTypes';

interface ProjectionControlsProps {
  timeframe: TimeframeType;
  scenario: ScenarioType;
  isAnalyzing: boolean;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  onScenarioChange: (scenario: ScenarioType) => void;
  onGenerateAnalysis: () => void;
}

const ProjectionControls: React.FC<ProjectionControlsProps> = ({
  timeframe,
  scenario,
  isAnalyzing,
  onTimeframeChange,
  onScenarioChange,
  onGenerateAnalysis
}) => {
  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-400" />
          Configurações de Projeção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Período</label>
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 meses</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="12m">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Cenário</label>
            <Select value={scenario} onValueChange={onScenarioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cenário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservador (2% ao mês)</SelectItem>
                <SelectItem value="moderate">Moderado (5% ao mês)</SelectItem>
                <SelectItem value="aggressive">Agressivo (10% ao mês)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={onGenerateAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-satotrack-neon hover:bg-satotrack-neon/80"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Análise IA
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionControls;

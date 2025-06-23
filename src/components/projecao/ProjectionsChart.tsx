
import React, { useState, useEffect } from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useSatoAI } from '@/hooks/useSatoAI';
import { TimeframeType, ScenarioType, ProjectionDataPoint } from './types/projectionTypes';
import { generateProjectionData, calculateGrowthPercentage } from './utils/projectionCalculations';
import ProjectionControls from './components/ProjectionControls';
import AIAnalysisCard from './components/AIAnalysisCard';
import ProjectionChart from './components/ProjectionChart';
import ProjectionSummaryCards from './components/ProjectionSummaryCards';

const ProjectionsChart: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const { askSatoAI } = useSatoAI();
  const [timeframe, setTimeframe] = useState<TimeframeType>('6m');
  const [scenario, setScenario] = useState<ScenarioType>('moderate');
  const [projectionData, setProjectionData] = useState<ProjectionDataPoint[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateProjections();
  }, [carteiras, bitcoinData, timeframe, scenario]);

  const generateProjections = () => {
    if (!bitcoinData || carteiras.length === 0) return;

    const data = generateProjectionData(carteiras, bitcoinData, timeframe, scenario);
    setProjectionData(data);
  };

  const generateAIAnalysis = async () => {
    if (!bitcoinData || !projectionData.length) return;

    setIsAnalyzing(true);
    try {
      const currentBalance = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
      const finalProjection = projectionData[projectionData.length - 1];
      const growthPercentage = calculateGrowthPercentage(projectionData);

      const context = `
        Análise de Projeções de Portfólio:
        - Saldo atual: ${currentBalance.toFixed(6)} BTC
        - Valor atual: R$ ${projectionData[0]?.value.toLocaleString()}
        - Projeção ${timeframe}: R$ ${finalProjection?.value.toLocaleString()}
        - Crescimento projetado: ${growthPercentage.toFixed(2)}%
        - Cenário: ${scenario}
        - Preço atual BTC: R$ ${bitcoinData.price_brl.toLocaleString()}
        - Variação 24h: ${bitcoinData.price_change_percentage_24h?.toFixed(2)}%
        - Volume 24h: ${bitcoinData.volume_24h_usd ? (bitcoinData.volume_24h_usd / 1e9).toFixed(2) + 'B USD' : 'N/A'}
      `;

      const aiResponse = await askSatoAI(
        `Analise minhas projeções de portfólio e forneça insights detalhados sobre:
        1. Viabilidade das projeções considerando o mercado atual
        2. Fatores de risco que podem afetar essas projeções
        3. Recomendações estratégicas para maximizar ganhos
        4. Momentos ideais para entrada/saída baseado nas tendências`,
        context
      );

      if (aiResponse) {
        setAiAnalysis(aiResponse);
      }
    } catch (error) {
      console.error('Erro na análise de IA:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProjectionControls
        timeframe={timeframe}
        scenario={scenario}
        isAnalyzing={isAnalyzing}
        onTimeframeChange={setTimeframe}
        onScenarioChange={setScenario}
        onGenerateAnalysis={generateAIAnalysis}
      />

      <AIAnalysisCard analysis={aiAnalysis} />

      <ProjectionChart data={projectionData} />

      <ProjectionSummaryCards 
        projectionData={projectionData}
        timeframe={timeframe}
      />
    </div>
  );
};

export default ProjectionsChart;

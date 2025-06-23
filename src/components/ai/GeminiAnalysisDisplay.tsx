
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Sparkles } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import AnalysisCard from './AnalysisCard';

interface GeminiAnalysisDisplayProps {
  analysisType: 'market_analysis' | 'portfolio_risk' | 'opportunity_detection' | 'trading_insights';
  data: any;
  context?: string;
  title?: string;
  className?: string;
}

const GeminiAnalysisDisplay: React.FC<GeminiAnalysisDisplayProps> = ({ 
  analysisType, 
  data, 
  context,
  title = "Análise IA",
  className = ""
}) => {
  const { analyzeWithGemini, parseGeminiResponse, isLoading, lastAnalysis } = useGeminiAI();
  const [analysis, setAnalysis] = useState<any>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleAnalyze = async () => {
    const result = await analyzeWithGemini({
      type: analysisType,
      data,
      context
    });

    if (result) {
      setAnalysis(result);
      const parsed = parseGeminiResponse(result.analysis);
      setParsedData(parsed);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header com botão */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Análise IA
            </>
          )}
        </Button>
      </motion.div>

      {/* Resultado da análise */}
      <AnimatePresence mode="wait">
        {parsedData && (
          <motion.div
            key="analysis-result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisCard data={parsedData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado vazio com animação */}
      {!parsedData && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-slate-400"
        >
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Clique no botão acima para gerar uma análise inteligente</p>
        </motion.div>
      )}
    </div>
  );
};

export default GeminiAnalysisDisplay;

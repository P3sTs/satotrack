
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Target, Bell, Shield, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ParsedGeminiData {
  risco?: string;
  sugestao?: string;
  projecao?: string;
  alerta?: string;
  tipo?: 'baixo' | 'moderado' | 'alto';
  score?: number;
}

interface AnalysisCardProps {
  data: ParsedGeminiData;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ data, className = "" }) => {
  const getRiskColor = (risco?: string) => {
    switch (risco?.toLowerCase()) {
      case 'alto': return 'bg-red-600 text-white';
      case 'moderado': return 'bg-yellow-600 text-black';
      case 'baixo': return 'bg-green-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getRiskIcon = (risco?: string) => {
    switch (risco?.toLowerCase()) {
      case 'alto': return <AlertTriangle className="h-4 w-4" />;
      case 'moderado': return <Activity className="h-4 w-4" />;
      case 'baixo': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full ${className}`}
    >
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-xl">
        <CardContent className="p-6 space-y-4">
          {/* Risk Badge */}
          {data.risco && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Badge className={`${getRiskColor(data.risco)} flex items-center gap-1 px-3 py-1`}>
                {getRiskIcon(data.risco)}
                Risco: {data.risco}
              </Badge>
            </motion.div>
          )}

          {/* Sugestão */}
          {data.sugestao && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-blue-400">
                <Target className="h-5 w-5" />
                <h3 className="text-lg font-semibold">💡 Sugestão Principal</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">{data.sugestao}</p>
            </motion.div>
          )}

          {/* Projeção */}
          {data.projecao && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-5 w-5" />
                <h3 className="text-lg font-semibold">📈 Projeção</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">{data.projecao}</p>
            </motion.div>
          )}

          {/* Alerta */}
          {data.alerta && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.5,
                repeat: 3,
                repeatType: 'mirror',
                duration: 0.8
              }}
              className="mt-4"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-lg shadow-lg border border-red-400">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-5 w-5" />
                  <span className="font-bold">🚨 Alerta Importante</span>
                </div>
                <p className="text-sm">{data.alerta}</p>
              </div>
            </motion.div>
          )}

          {/* Score visual (se disponível) */}
          {data.score && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-4"
            >
              <div className="text-sm text-slate-400 mb-1">Confiança da Análise</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisCard;

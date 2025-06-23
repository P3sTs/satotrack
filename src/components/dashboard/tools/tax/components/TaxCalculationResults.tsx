
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, FileText, Brain } from 'lucide-react';
import { TaxCalculation } from '../types';
import { exportTaxReport } from '../utils/exportUtils';
import { TaxTransaction } from '../types';

interface TaxCalculationResultsProps {
  calculation: TaxCalculation;
  transactions: TaxTransaction[];
}

const TaxCalculationResults: React.FC<TaxCalculationResultsProps> = ({ 
  calculation, 
  transactions 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted/50 border border-yellow-500/20">
          <div className="text-sm text-muted-foreground">Total de Ganhos</div>
          <div className="text-lg font-bold text-green-400">
            R$ {calculation.totalGains.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-yellow-500/20">
          <div className="text-sm text-muted-foreground">Valor Isento</div>
          <div className="text-lg font-bold text-blue-400">
            R$ {calculation.exemptAmount.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-yellow-500/20">
          <div className="text-sm text-muted-foreground">Base de Cálculo</div>
          <div className="text-lg font-bold text-yellow-400">
            R$ {calculation.taxableAmount.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50 border border-yellow-500/20">
          <div className="text-sm text-muted-foreground">Imposto a Pagar</div>
          <div className="text-lg font-bold text-red-400">
            R$ {calculation.taxOwed.toLocaleString()}
          </div>
        </div>
      </div>

      {calculation.exemption && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-2 text-green-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Isento de Imposto!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Suas vendas não ultrapassaram o limite de R$ 35.000 mensais.
          </p>
        </div>
      )}

      {calculation.aiInsights && (
        <div className="p-4 rounded-lg bg-satotrack-neon/10 border border-satotrack-neon/30">
          <div className="flex items-center gap-2 text-satotrack-neon mb-2">
            <Brain className="h-5 w-5" />
            <span className="font-medium">Análise Inteligente SatoAI</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{calculation.aiInsights}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={() => exportTaxReport(transactions)} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar Relatório CSV
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Gerar Relatório PDF
        </Button>
      </div>
    </div>
  );
};

export default TaxCalculationResults;

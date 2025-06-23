
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Brain, Loader2 } from 'lucide-react';
import { useSatoAI } from '@/hooks/useSatoAI';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { TaxTransaction, TaxCalculation } from './tax/types';
import { calculateTax } from './tax/utils/taxCalculations';
import TaxInfoAlert from './tax/components/TaxInfoAlert';
import TransactionsDisplay from './tax/components/TransactionsDisplay';
import TaxCalculationResults from './tax/components/TaxCalculationResults';

const TaxCalculator: React.FC = () => {
  const [transactions] = useState<TaxTransaction[]>([
    { type: 'buy', amount: 1000, date: '2024-01-15', price: 40000 },
    { type: 'sell', amount: 500, date: '2024-03-20', price: 45000 }
  ]);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { askSatoAI } = useSatoAI();
  const { data: bitcoinData } = useBitcoinPrice();

  const handleCalculateTax = async () => {
    const basicCalculation = calculateTax(transactions);
    setCalculation(basicCalculation);

    // Usar IA para análise inteligente
    if (bitcoinData) {
      setIsAnalyzing(true);
      try {
        const context = `
          Análise de Impostos sobre Criptomoedas:
          - Total de vendas: R$ ${basicCalculation.exemptAmount.toLocaleString()}
          - Ganhos calculados: R$ ${basicCalculation.totalGains.toLocaleString()}
          - Imposto devido: R$ ${basicCalculation.taxOwed.toLocaleString()}
          - Isento: ${basicCalculation.exemption ? 'Sim' : 'Não'}
          - Preço atual BTC: R$ ${bitcoinData.price_brl.toLocaleString()}
          - Variação 24h: ${bitcoinData.price_change_percentage_24h?.toFixed(2)}%
        `;

        const aiResponse = await askSatoAI(
          'Analise minha situação tributária com criptomoedas e dê recomendações para otimização fiscal. Considere o cenário atual do mercado.',
          context
        );

        if (aiResponse) {
          setCalculation(prev => prev ? { ...prev, aiInsights: aiResponse } : null);
        }
      } catch (error) {
        console.error('Erro na análise de IA:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Calculator className="h-5 w-5" />
          Calculadora de Imposto (Brasil)
          <Brain className="h-4 w-4 text-satotrack-neon" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaxInfoAlert />
        <TransactionsDisplay transactions={transactions} />

        <Button 
          onClick={handleCalculateTax} 
          className="w-full bg-yellow-600 hover:bg-yellow-700"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Calcular com IA
            </>
          )}
        </Button>

        {calculation && (
          <TaxCalculationResults 
            calculation={calculation} 
            transactions={transactions} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;

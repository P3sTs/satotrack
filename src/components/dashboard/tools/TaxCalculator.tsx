
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Calculator, AlertCircle, Brain, Loader2 } from 'lucide-react';
import { useSatoAI } from '@/hooks/useSatoAI';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

interface TaxCalculation {
  totalGains: number;
  exemptAmount: number;
  taxableAmount: number;
  taxOwed: number;
  exemption: boolean;
  aiInsights?: string;
}

const TaxCalculator: React.FC = () => {
  const [transactions, setTransactions] = useState([
    { type: 'buy', amount: 1000, date: '2024-01-15', price: 40000 },
    { type: 'sell', amount: 500, date: '2024-03-20', price: 45000 }
  ]);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { askSatoAI } = useSatoAI();
  const { data: bitcoinData } = useBitcoinPrice();

  const EXEMPT_LIMIT = 35000; // R$ 35.000 limite de isenção
  const TAX_RATE = 0.15; // 15% de imposto sobre ganho de capital

  const calculateTax = async () => {
    let totalGains = 0;
    let totalSales = 0;

    // Simular cálculo de ganhos
    transactions.forEach(tx => {
      if (tx.type === 'sell') {
        totalSales += tx.amount;
        // Simular ganho (preço de venda - preço médio de compra)
        totalGains += tx.amount * 0.1; // 10% de ganho simulado
      }
    });

    const exemption = totalSales <= EXEMPT_LIMIT;
    const taxableAmount = exemption ? 0 : Math.max(0, totalGains);
    const taxOwed = taxableAmount * TAX_RATE;

    const basicCalculation = {
      totalGains,
      exemptAmount: Math.min(totalSales, EXEMPT_LIMIT),
      taxableAmount,
      taxOwed,
      exemption
    };

    setCalculation(basicCalculation);

    // Usar IA para análise inteligente
    if (bitcoinData) {
      setIsAnalyzing(true);
      try {
        const context = `
          Análise de Impostos sobre Criptomoedas:
          - Total de vendas: R$ ${totalSales.toLocaleString()}
          - Ganhos calculados: R$ ${totalGains.toLocaleString()}
          - Imposto devido: R$ ${taxOwed.toLocaleString()}
          - Isento: ${exemption ? 'Sim' : 'Não'}
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

  const exportReport = () => {
    // Simular exportação de relatório
    const csvContent = [
      'Data,Tipo,Valor,Preço,Ganho/Perda',
      ...transactions.map(tx => 
        `${tx.date},${tx.type},${tx.amount},${tx.price},${tx.type === 'sell' ? tx.amount * 0.1 : 0}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-imposto-crypto.csv';
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-400">Informação Importante</h5>
              <p className="text-sm text-muted-foreground mt-1">
                Vendas mensais até R$ 35.000 são isentas de imposto sobre ganho de capital.
                Acima desse valor, a alíquota é de 15%.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-3">Suas Transações (Simuladas)</h5>
          <div className="space-y-2">
            {transactions.map((tx, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 border border-yellow-500/20 flex justify-between items-center">
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.type === 'buy' ? 'COMPRA' : 'VENDA'}
                  </span>
                  <span className="ml-2">{tx.date}</span>
                </div>
                <div className="text-right">
                  <div>R$ {tx.amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">@ R$ {tx.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={calculateTax} 
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
              <Button onClick={exportReport} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Relatório CSV
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Gerar Relatório PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;

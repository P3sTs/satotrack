
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimulationResult {
  investmentAmount: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  crypto: string;
  investmentDate: string;
}

const TradingSimulator: React.FC = () => {
  const [amount, setAmount] = useState('1000');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [investmentDate, setInvestmentDate] = useState('2024-01-01');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [savedSimulations, setSavedSimulations] = useState<SimulationResult[]>([]);

  const cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin', historicalPrice: 35000, currentPrice: 43250 },
    { value: 'ETH', label: 'Ethereum', historicalPrice: 2200, currentPrice: 2650 },
    { value: 'ADA', label: 'Cardano', historicalPrice: 0.35, currentPrice: 0.48 },
    { value: 'SOL', label: 'Solana', historicalPrice: 45, currentPrice: 65.80 }
  ];

  const mockChartData = [
    { date: '01/01', value: 1000 },
    { date: '15/01', value: 1100 },
    { date: '01/02', value: 950 },
    { date: '15/02', value: 1200 },
    { date: '01/03', value: 1350 },
    { date: '15/03', value: 1280 },
    { date: 'Hoje', value: 1237 }
  ];

  const runSimulation = () => {
    const crypto = cryptoOptions.find(c => c.value === selectedCrypto);
    if (!crypto) return;

    const investmentAmount = parseFloat(amount);
    const cryptosOwned = investmentAmount / crypto.historicalPrice;
    const currentValue = cryptosOwned * crypto.currentPrice;
    const profitLoss = currentValue - investmentAmount;
    const profitLossPercentage = ((currentValue - investmentAmount) / investmentAmount) * 100;

    const result: SimulationResult = {
      investmentAmount,
      currentValue,
      profitLoss,
      profitLossPercentage,
      crypto: selectedCrypto,
      investmentDate
    };

    setSimulationResult(result);
  };

  const saveSimulation = () => {
    if (simulationResult) {
      setSavedSimulations([...savedSimulations, simulationResult]);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 border-indigo-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-400">
          <DollarSign className="h-5 w-5" />
          Simulador de Trading
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Valor do Investimento</label>
            <Input 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              type="number"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Criptomoeda</label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map(crypto => (
                  <SelectItem key={crypto.value} value={crypto.value}>
                    {crypto.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Data do Investimento</label>
            <Input 
              value={investmentDate}
              onChange={(e) => setInvestmentDate(e.target.value)}
              type="date"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={runSimulation} className="bg-indigo-600 hover:bg-indigo-700">
            Simular
          </Button>
          {simulationResult && (
            <Button onClick={saveSimulation} variant="outline">
              Salvar Simulação
            </Button>
          )}
        </div>

        {simulationResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-indigo-500/20">
                <div className="text-sm text-muted-foreground">Investimento</div>
                <div className="text-lg font-bold">${simulationResult.investmentAmount.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-indigo-500/20">
                <div className="text-sm text-muted-foreground">Valor Atual</div>
                <div className="text-lg font-bold">${simulationResult.currentValue.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-indigo-500/20">
                <div className="text-sm text-muted-foreground">Lucro/Prejuízo</div>
                <div className={`text-lg font-bold flex items-center gap-1 ${
                  simulationResult.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {simulationResult.profitLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  ${Math.abs(simulationResult.profitLoss).toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-indigo-500/20">
                <div className="text-sm text-muted-foreground">Retorno %</div>
                <div className={`text-lg font-bold ${
                  simulationResult.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {simulationResult.profitLossPercentage >= 0 ? '+' : ''}{simulationResult.profitLossPercentage.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {savedSimulations.length > 0 && (
          <div className="mt-6">
            <h5 className="font-medium mb-3">Simulações Salvas</h5>
            <div className="space-y-2">
              {savedSimulations.map((sim, index) => (
                <div key={index} className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{sim.crypto}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ${sim.investmentAmount} em {sim.investmentDate}
                    </span>
                  </div>
                  <div className={`font-bold ${sim.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {sim.profitLoss >= 0 ? '+' : ''}${sim.profitLoss.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingSimulator;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3, Plus, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CryptoComparator: React.FC = () => {
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(['BTC']);
  const [timeframe, setTimeframe] = useState('7d');

  const availableCryptos = [
    { id: 'BTC', name: 'Bitcoin', price: 43250, change7d: 5.2 },
    { id: 'ETH', name: 'Ethereum', price: 2650, change7d: -2.1 },
    { id: 'ADA', name: 'Cardano', price: 0.48, change7d: 8.7 },
    { id: 'SOL', name: 'Solana', price: 65.80, change7d: 12.4 },
    { id: 'DOT', name: 'Polkadot', price: 7.20, change7d: -4.5 }
  ];

  const mockChartData = [
    { name: '7d ago', BTC: 41000, ETH: 2700, ADA: 0.44, SOL: 58, DOT: 7.5 },
    { name: '6d ago', BTC: 41500, ETH: 2680, ADA: 0.45, SOL: 60, DOT: 7.3 },
    { name: '5d ago', BTC: 42000, ETH: 2650, ADA: 0.46, SOL: 62, DOT: 7.1 },
    { name: '4d ago', BTC: 42500, ETH: 2630, ADA: 0.47, SOL: 64, DOT: 6.9 },
    { name: '3d ago', BTC: 43000, ETH: 2640, ADA: 0.47, SOL: 65, DOT: 7.0 },
    { name: '2d ago', BTC: 43100, ETH: 2655, ADA: 0.48, SOL: 65.5, DOT: 7.2 },
    { name: 'Hoje', BTC: 43250, ETH: 2650, ADA: 0.48, SOL: 65.8, DOT: 7.2 }
  ];

  const addCrypto = (cryptoId: string) => {
    if (selectedCryptos.length < 3 && !selectedCryptos.includes(cryptoId)) {
      setSelectedCryptos([...selectedCryptos, cryptoId]);
    }
  };

  const removeCrypto = (cryptoId: string) => {
    setSelectedCryptos(selectedCryptos.filter(c => c !== cryptoId));
  };

  const colors = ['#f7931a', '#627eea', '#3cc3f0', '#9945ff', '#e6007a'];

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <BarChart3 className="h-5 w-5" />
          Comparador de Criptos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {availableCryptos.map((crypto, index) => (
            <Button
              key={crypto.id}
              variant={selectedCryptos.includes(crypto.id) ? "default" : "outline"}
              size="sm"
              onClick={() => selectedCryptos.includes(crypto.id) ? removeCrypto(crypto.id) : addCrypto(crypto.id)}
              disabled={!selectedCryptos.includes(crypto.id) && selectedCryptos.length >= 3}
              className="flex items-center gap-1"
            >
              {selectedCryptos.includes(crypto.id) ? (
                <Minus className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              {crypto.id}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              {selectedCryptos.map((crypto, index) => (
                <Line
                  key={crypto}
                  type="monotone"
                  dataKey={crypto}
                  stroke={colors[index]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedCryptos.map((cryptoId) => {
            const crypto = availableCryptos.find(c => c.id === cryptoId);
            if (!crypto) return null;
            
            return (
              <div key={cryptoId} className="p-3 rounded-lg bg-muted/50 border border-purple-500/20">
                <div className="font-medium text-purple-400">{crypto.name}</div>
                <div className="text-lg font-bold">${crypto.price.toLocaleString()}</div>
                <div className={`flex items-center gap-1 text-sm ${crypto.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.change7d >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {crypto.change7d >= 0 ? '+' : ''}{crypto.change7d}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoComparator;

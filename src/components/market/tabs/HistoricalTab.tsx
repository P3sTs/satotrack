
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface HistoricalTabProps {
  bitcoinData: BitcoinPriceData;
}

const HistoricalTab: React.FC<HistoricalTabProps> = ({ bitcoinData }) => {
  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-satotrack-neon" />
          Dados Históricos
        </CardTitle>
        <CardDescription>Preço do Bitcoin em períodos anteriores</CardDescription>
      </CardHeader>
      <CardContent>
        <PremiumFeatureGate>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Variações Históricas</h3>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Período</th>
                    <th className="text-right py-2">Variação</th>
                    <th className="text-right py-2">Preço Mín.</th>
                    <th className="text-right py-2">Preço Máx.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">7 dias</td>
                    <td className={`text-right ${bitcoinData.price_change_percentage_7d && bitcoinData.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {bitcoinData.price_change_percentage_7d && bitcoinData.price_change_percentage_7d >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_7d?.toFixed(2) || 'N/A'}%
                    </td>
                    <td className="text-right">${bitcoinData.price_low_7d?.toLocaleString('pt-BR') || 'N/A'}</td>
                    <td className="text-right">${bitcoinData.price_high_7d?.toLocaleString('pt-BR') || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="py-2">30 dias</td>
                    <td className={`text-right ${bitcoinData.price_change_percentage_30d && bitcoinData.price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {bitcoinData.price_change_percentage_30d && bitcoinData.price_change_percentage_30d >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_30d?.toFixed(2) || 'N/A'}%
                    </td>
                    <td className="text-right">${bitcoinData.price_low_30d?.toLocaleString('pt-BR') || 'N/A'}</td>
                    <td className="text-right">${bitcoinData.price_high_30d?.toLocaleString('pt-BR') || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="py-2">1 ano</td>
                    <td className={`text-right ${bitcoinData.price_change_percentage_1y && bitcoinData.price_change_percentage_1y >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {bitcoinData.price_change_percentage_1y && bitcoinData.price_change_percentage_1y >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_1y?.toFixed(2) || 'N/A'}%
                    </td>
                    <td className="text-right">${bitcoinData.price_low_1y?.toLocaleString('pt-BR') || 'N/A'}</td>
                    <td className="text-right">${bitcoinData.price_high_1y?.toLocaleString('pt-BR') || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Indicadores de Mercado</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medo e Ganância</span>
                    <span className="font-medium">67 - Ganância</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{width: "67%"}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dominância BTC</span>
                    <span className="font-medium">42.5%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-bitcoin h-2.5 rounded-full" style={{width: "42.5%"}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Liquidez do Mercado</span>
                    <span className="font-medium">Alta</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: "80%"}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PremiumFeatureGate>
      </CardContent>
    </Card>
  );
};

export default HistoricalTab;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import InteractiveChart from '@/components/charts/InteractiveChart';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface OverviewTabProps {
  bitcoinData: BitcoinPriceData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ bitcoinData }) => {
  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-satotrack-neon" />
          Gráfico de Preço
        </CardTitle>
        <CardDescription>Histórico de preços do Bitcoin</CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <InteractiveChart bitcoinData={bitcoinData} />
      </CardContent>
    </Card>
  );
};

export default OverviewTab;

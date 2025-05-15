
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useCarteiras } from '@/contexts/carteiras';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const PremiumChartDisplay: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();
  const { carteiraPrincipal, carteiras } = useCarteiras();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | 'ytd'>('7d');
  const [chartRef] = React.useState<React.RefObject<HTMLDivElement>>(React.createRef());
  
  const currentWallet = carteiras.find(c => c.id === carteiraPrincipal);
  
  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    
    try {
      const now = new Date().toLocaleDateString('pt-BR');
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `SatoTrack-Analise-${now}.png`);
        }
      });
    } catch (error) {
      console.error("Erro ao gerar screenshot:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium">
            {currentWallet ? currentWallet.nome : 'Análise de Mercado'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {bitcoinData ? `BTC: $${bitcoinData.current_price.toLocaleString()}` : 'Carregando...'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <TabsList>
            <TabsTrigger 
              value="24h" 
              onClick={() => setTimeRange('24h')}
              className={timeRange === '24h' ? 'data-[state=active]:bg-satotrack-neon/20' : ''}
            >
              24H
            </TabsTrigger>
            <TabsTrigger 
              value="7d" 
              onClick={() => setTimeRange('7d')}
              className={timeRange === '7d' ? 'data-[state=active]:bg-satotrack-neon/20' : ''}
            >
              7D
            </TabsTrigger>
            <TabsTrigger 
              value="30d" 
              onClick={() => setTimeRange('30d')}
              className={timeRange === '30d' ? 'data-[state=active]:bg-satotrack-neon/20' : ''}
            >
              30D
            </TabsTrigger>
            <TabsTrigger 
              value="90d" 
              onClick={() => setTimeRange('90d')}
              className={timeRange === '90d' ? 'data-[state=active]:bg-satotrack-neon/20' : ''}
            >
              90D
            </TabsTrigger>
            <TabsTrigger 
              value="ytd" 
              onClick={() => setTimeRange('ytd')}
              className={timeRange === 'ytd' ? 'data-[state=active]:bg-satotrack-neon/20' : ''}
            >
              YTD
            </TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleScreenshot}
            title="Salvar análise"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div ref={chartRef} className="p-4 bg-dashboard-dark border border-dashboard-medium rounded-lg">
        <div className="aspect-video bg-gradient-to-b from-dashboard-medium to-dashboard-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Gráfico avançado {timeRange.toUpperCase()}</p>
            {currentWallet && <p className="font-medium mt-1">{currentWallet.nome}</p>}
            <p className="text-xs mt-3">
              Data: {new Date().toLocaleDateString('pt-BR')} • SatoTrack Premium
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-dashboard-medium/30 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Variação {timeRange.toUpperCase()}</h4>
          <p className="text-xl font-mono text-green-500">+12.45%</p>
        </div>
        
        <div className="p-4 bg-dashboard-medium/30 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Volume Negociado</h4>
          <p className="text-xl font-mono">฿ 0.0324</p>
        </div>
        
        <div className="p-4 bg-dashboard-medium/30 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Taxa Média</h4>
          <p className="text-xl font-mono">12 sat/vB</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumChartDisplay;

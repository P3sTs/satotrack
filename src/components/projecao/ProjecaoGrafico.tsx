
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { useAuth } from '@/contexts/auth';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartLine, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import PremiumChartModal from '@/components/charts/modals/PremiumChartModal';
import { calculateProjecaoData } from '@/utils/projecaoCalculations';

type TimeRangeType = '7D' | '30D' | '3M' | '6M' | '1Y';

interface ProjecaoGraficoProps {
  walletId: string;
}

const ProjecaoGrafico: React.FC<ProjecaoGraficoProps> = ({ walletId }) => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>('7D');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { userPlan } = useAuth();
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  
  const carteira = carteiras.find(c => c.id === walletId);
  const isPremium = userPlan === 'premium';
  
  // Available time ranges based on user's plan
  const availableTimeRanges: TimeRangeType[] = isPremium 
    ? ['7D', '30D', '3M', '6M', '1Y']
    : ['7D'];
  
  if (!carteira) {
    return <div>Carteira não encontrada</div>;
  }
  
  // Get projection data based on wallet and time range
  const projectionData = calculateProjecaoData(carteira, timeRange, bitcoinData);
  
  // Handle time range change with premium restriction
  const handleTimeRangeChange = (range: TimeRangeType) => {
    if (!isPremium && range !== '7D') {
      setShowPremiumModal(true);
      return;
    }
    setTimeRange(range);
  };
  
  // Function to format the tooltip values
  const formatTooltip = (value: number) => {
    return `${value.toFixed(2)} %`;
  };
  
  // Calculate if projection shows profit or loss
  const isProfit = projectionData.length > 0 && 
    projectionData[projectionData.length - 1].projecao > projectionData[0].projecao;
  
  // Calculate percentage change from first to last point
  const percentageChange = projectionData.length > 0 
    ? ((projectionData[projectionData.length - 1].projecao - projectionData[0].projecao) / 
       projectionData[0].projecao) * 100
    : 0;
  
  const config = {
    positive: {
      color: "hsl(143, 85%, 42%)",
      theme: { dark: "hsl(143, 80%, 44%)", light: "hsl(143, 70%, 50%)" },
      label: "Projeção"
    },
    negative: {
      color: "hsl(3, 100%, 59%)",
      theme: { dark: "hsl(3, 90%, 60%)", light: "hsl(3, 85%, 64%)" },
      label: "Projeção"
    },
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="text-satotrack-neon h-5 w-5" />
            Projeção de {timeRange}
          </CardTitle>
          
          <div className="flex items-center">
            <span className={`mr-2 flex items-center ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              {Math.abs(percentageChange).toFixed(2)}%
            </span>
            
            <PremiumFeatureGate
              fallback={
                <TabsList>
                  <TabsTrigger 
                    value="7D" 
                    onClick={() => handleTimeRangeChange('7D')}
                    className={timeRange === '7D' ? 'active' : ''}
                  >
                    7D
                  </TabsTrigger>
                  <TabsTrigger 
                    value="premium" 
                    onClick={() => setShowPremiumModal(true)}
                    className="relative"
                  >
                    30D+
                    <span className="absolute -top-1 -right-1 w-3 h-3">
                      <span className="absolute animate-ping w-full h-full rounded-full bg-satotrack-neon opacity-75"></span>
                      <span className="absolute w-full h-full rounded-full bg-satotrack-neon"></span>
                    </span>
                  </TabsTrigger>
                </TabsList>
              }
            >
              <TabsList>
                {availableTimeRanges.map((range) => (
                  <TabsTrigger 
                    key={range}
                    value={range} 
                    onClick={() => handleTimeRangeChange(range)}
                    className={timeRange === range ? 'active' : ''}
                  >
                    {range}
                  </TabsTrigger>
                ))}
              </TabsList>
            </PremiumFeatureGate>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[300px] w-full pt-4 px-4">
          <ChartContainer 
            config={isProfit ? { positive: config.positive } : { negative: config.negative }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projectionData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(143, 85%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(143, 85%, 42%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(3, 100%, 59%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(3, 100%, 59%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{ 
                    backgroundColor: '#1A1F2C', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '4px' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="projecao" 
                  stroke={isProfit ? config.positive.color : config.negative.color}
                  fillOpacity={1}
                  fill={isProfit ? "url(#colorProfit)" : "url(#colorLoss)"}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      
      <PremiumChartModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal} 
      />
    </Card>
  );
};

export default ProjecaoGrafico;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Wifi, 
  Zap,
  Clock
} from 'lucide-react';

interface NetworkStatusProps {
  userWallets?: any[];
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ userWallets = [] }) => {
  const [networkData, setNetworkData] = useState({
    ethereum: { status: 'active', gasPrice: '25', latency: '120ms' },
    polygon: { status: 'active', gasPrice: '2', latency: '80ms' },
    bsc: { status: 'active', gasPrice: '3', latency: '95ms' }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prev => ({
        ethereum: { ...prev.ethereum, gasPrice: (Math.random() * 50 + 10).toFixed(0) },
        polygon: { ...prev.polygon, gasPrice: (Math.random() * 5 + 1).toFixed(0) },
        bsc: { ...prev.bsc, gasPrice: (Math.random() * 8 + 1).toFixed(0) }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Status das Redes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(networkData).map(([network, data]) => (
              <Card key={network} className="bg-dashboard-medium/30 border-dashboard-light/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white capitalize">{network}</h3>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Wifi className="h-3 w-3 mr-1" />
                      {data.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Gas Price:
                      </span>
                      <span className="text-sm font-medium text-white">{data.gasPrice} gwei</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Latência:
                      </span>
                      <span className="text-sm font-medium text-white">{data.latency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkStatus;
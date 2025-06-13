
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Volume2, Plus, AlertCircle } from 'lucide-react';

interface Opportunity {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  opportunity_type: 'volume_spike' | 'price_dip' | 'new_listing';
  confidence: number;
  reason: string;
}

const OpportunityDetector: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      symbol: 'MATIC',
      name: 'Polygon',
      price: 0.85,
      change24h: -12.5,
      volume: 245000000,
      opportunity_type: 'price_dip',
      confidence: 78,
      reason: 'Queda significativa com volume alto - possível reversão'
    },
    {
      id: '2',
      symbol: 'AVAX',
      name: 'Avalanche',
      price: 28.50,
      change24h: 8.3,
      volume: 180000000,
      opportunity_type: 'volume_spike',
      confidence: 65,
      reason: 'Volume 340% acima da média - momentum forte'
    },
    {
      id: '3',
      symbol: 'FTM',
      name: 'Fantom',
      price: 0.32,
      change24h: -8.1,
      volume: 95000000,
      opportunity_type: 'price_dip',
      confidence: 82,
      reason: 'Preço próximo ao suporte histórico'
    }
  ];

  const scanMarket = async () => {
    setIsScanning(true);
    // Simulate API call
    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setIsScanning(false);
    }, 2000);
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'volume_spike': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'price_dip': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'new_listing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'volume_spike': return <Volume2 className="h-4 w-4" />;
      case 'price_dip': return <TrendingUp className="h-4 w-4" />;
      case 'new_listing': return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getOpportunityLabel = (type: string) => {
    switch (type) {
      case 'volume_spike': return 'Volume Alto';
      case 'price_dip': return 'Queda de Preço';
      case 'new_listing': return 'Nova Listagem';
      default: return 'Oportunidade';
    }
  };

  useEffect(() => {
    scanMarket();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Target className="h-5 w-5" />
            Detector de Oportunidades
          </CardTitle>
          <Button 
            onClick={scanMarket} 
            disabled={isScanning}
            size="sm"
            variant="outline"
            className="border-green-500/50"
          >
            {isScanning ? 'Escaneando...' : 'Escanear Mercado'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isScanning ? 'Escaneando o mercado...' : 'Nenhuma oportunidade encontrada'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 rounded-lg bg-muted/50 border border-green-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{opportunity.symbol}</span>
                        <Badge className={getOpportunityColor(opportunity.opportunity_type)}>
                          {getOpportunityIcon(opportunity.opportunity_type)}
                          {getOpportunityLabel(opportunity.opportunity_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{opportunity.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${opportunity.price}</div>
                    <div className={`text-sm flex items-center gap-1 ${
                      opportunity.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {opportunity.change24h >= 0 ? '+' : ''}{opportunity.change24h}%
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-2">{opportunity.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Volume: ${(opportunity.volume / 1000000).toFixed(1)}M</span>
                    <span>Confiança: {opportunity.confidence}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => addToWatchlist(opportunity.symbol)}
                    disabled={watchlist.includes(opportunity.symbol)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {watchlist.includes(opportunity.symbol) ? 'Na Watchlist' : 'Adicionar Watchlist'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {watchlist.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h5 className="font-medium text-green-400 mb-2">📋 Sua Watchlist</h5>
            <div className="flex flex-wrap gap-2">
              {watchlist.map((symbol) => (
                <Badge key={symbol} variant="outline" className="border-green-500/50">
                  {symbol}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunityDetector;

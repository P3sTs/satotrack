
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import HeroSection from '@/components/home/HeroSection';
import MarketSection from '@/components/home/MarketSection';

interface BitcoinData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  last_updated: string;
}

const Home = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const fetchBitcoinData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do Bitcoin');
      }
      
      const data = await response.json();
      
      setBitcoinData({
        price_usd: data.market_data.current_price.usd,
        price_brl: data.market_data.current_price.brl,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        market_cap_usd: data.market_data.market_cap.usd,
        volume_24h_usd: data.market_data.total_volume.usd,
        last_updated: data.market_data.last_updated
      });
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Erro ao buscar dados do Bitcoin:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os dados mais recentes do Bitcoin.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Carregar dados iniciais
  useEffect(() => {
    fetchBitcoinData();
    
    // Configurar auto-refresh a cada 30 segundos
    const intervalId = setInterval(() => {
      fetchBitcoinData();
    }, 30000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  
  const handleRefresh = () => {
    fetchBitcoinData();
    toast({
      title: "Dados atualizados",
      description: "Os dados de mercado do Bitcoin foram atualizados.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeroSection />
      <MarketSection 
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        bitcoinData={bitcoinData}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default Home;

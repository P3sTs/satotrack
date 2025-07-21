import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  TrendingUp, 
  Flame, 
  Star, 
  Eye, 
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const trendingCoins = [
    {
      symbol: 'PEPE',
      name: 'Pepe',
      price: '$0.00001234',
      change: '+245.67%',
      volume: '$2.4B',
      marketCap: '$5.2B',
      category: 'Meme',
      icon: '🐸'
    },
    {
      symbol: 'ARB',
      name: 'Arbitrum',
      price: '$1.23',
      change: '+18.45%',
      volume: '$890M',
      marketCap: '$2.1B',
      category: 'Layer 2',
      icon: '🔵'
    },
    {
      symbol: 'OP',
      name: 'Optimism',
      price: '$2.45',
      change: '+12.34%',
      volume: '$654M',
      marketCap: '$3.8B',
      category: 'Layer 2',
      icon: '🔴'
    }
  ];

  const newListings = [
    {
      symbol: 'NEW1',
      name: 'New Protocol',
      price: '$0.45',
      launchDate: '2024-01-15',
      category: 'DeFi',
      description: 'Protocolo DeFi revolucionário',
      icon: '🆕'
    },
    {
      symbol: 'NEW2', 
      name: 'Future Chain',
      price: '$1.78',
      launchDate: '2024-01-12',
      category: 'Blockchain',
      description: 'Nova blockchain de alta performance',
      icon: '⚡'
    }
  ];

  const categories = [
    { name: 'DeFi', count: 245, icon: '💰', color: 'text-green-400' },
    { name: 'NFTs', count: 189, icon: '🎨', color: 'text-purple-400' },
    { name: 'Gaming', count: 156, icon: '🎮', color: 'text-blue-400' },
    { name: 'Meme', count: 89, icon: '😂', color: 'text-yellow-400' },
    { name: 'AI', count: 67, icon: '🤖', color: 'text-pink-400' },
    { name: 'Layer 2', count: 45, icon: '⚡', color: 'text-cyan-400' }
  ];

  const filteredCoins = trendingCoins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-satotrack-text hover:text-white hover:bg-dashboard-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-satotrack-text">Discover - Explore Cripto</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar criptomoedas, projetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-dashboard-dark/80 border-satotrack-neon/20"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {categories.map((category) => (
            <Card key={category.name} className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-satotrack-text">{category.name}</div>
                <div className="text-xs text-muted-foreground">{category.count} projetos</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="trending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Em Alta
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Novos
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-satotrack-text">Tendências do Mercado</h2>
            </div>
            
            {filteredCoins.map((coin) => (
              <Card key={coin.symbol} className="bg-dashboard-dark/80 border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{coin.icon}</div>
                      <div>
                        <h3 className="font-semibold text-satotrack-text">{coin.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{coin.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {coin.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-satotrack-text">{coin.price}</div>
                      <div className="text-sm text-green-400">{coin.change}</div>
                      <div className="text-xs text-muted-foreground">Vol: {coin.volume}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-satotrack-text">Novos Lançamentos</h2>
            </div>
            
            {newListings.map((coin) => (
              <Card key={coin.symbol} className="bg-dashboard-dark/80 border-satotrack-neon/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{coin.icon}</div>
                      <div>
                        <h3 className="font-semibold text-satotrack-text">{coin.name}</h3>
                        <p className="text-sm text-muted-foreground">{coin.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {coin.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(coin.launchDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-satotrack-text">{coin.price}</div>
                      <Button size="sm" className="mt-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-4">
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-satotrack-text mb-2">Sua Lista de Favoritos</h3>
              <p className="text-muted-foreground mb-4">
                Adicione criptomoedas aos seus favoritos para acompanhar facilmente
              </p>
              <Button variant="outline" className="border-satotrack-neon/50 text-satotrack-neon">
                Explorar Mercado
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discover;
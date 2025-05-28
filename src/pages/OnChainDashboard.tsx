
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, TrendingUp, TrendingDown, Wallet, Activity, Bell, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const OnChainDashboard: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [selectedToken, setSelectedToken] = useState('all');
  const [volumeFilter, setVolumeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data para demonstração
  const walletBalance = {
    total: 2.45678,
    usdValue: 156789.32,
    change24h: 5.67,
    changePercentage: 3.8
  };

  const chartData = [
    { time: '00:00', inflow: 0.5, outflow: 0.2 },
    { time: '04:00', inflow: 0.8, outflow: 0.4 },
    { time: '08:00', inflow: 1.2, outflow: 0.6 },
    { time: '12:00', inflow: 0.9, outflow: 0.8 },
    { time: '16:00', inflow: 1.5, outflow: 0.3 },
    { time: '20:00', inflow: 1.1, outflow: 0.7 },
    { time: '24:00', inflow: 0.7, outflow: 0.5 }
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'in',
      amount: 0.5678,
      token: 'ETH',
      from: '0x1234...5678',
      timestamp: '2 min ago',
      usdValue: 1234.56,
      network: 'ethereum'
    },
    {
      id: '2',
      type: 'out',
      amount: 0.2345,
      token: 'USDC',
      to: '0x9876...5432',
      timestamp: '5 min ago',
      usdValue: 234.50,
      network: 'ethereum'
    },
    {
      id: '3',
      type: 'in',
      amount: 1.2345,
      token: 'BTC',
      from: '0xabcd...efgh',
      timestamp: '10 min ago',
      usdValue: 45678.90,
      network: 'bitcoin'
    }
  ];

  const realTimeAlerts = [
    {
      id: '1',
      type: 'whale',
      message: 'Whale movement detected: 1000 ETH transferred',
      severity: 'high',
      timestamp: '1 min ago'
    },
    {
      id: '2',
      type: 'bot',
      message: 'Sniper bot activity on PEPE token',
      severity: 'medium',
      timestamp: '3 min ago'
    },
    {
      id: '3',
      type: 'liquidity',
      message: 'Large liquidity removal on Uniswap V3',
      severity: 'high',
      timestamp: '7 min ago'
    }
  ];

  const networks = [
    { value: 'ethereum', label: 'Ethereum', color: 'text-blue-400' },
    { value: 'bsc', label: 'BSC', color: 'text-yellow-400' },
    { value: 'arbitrum', label: 'Arbitrum', color: 'text-cyan-400' },
    { value: 'polygon', label: 'Polygon', color: 'text-purple-400' },
    { value: 'solana', label: 'Solana', color: 'text-green-400' },
    { value: 'base', label: 'Base', color: 'text-blue-500' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-green-500 bg-green-500/10 text-green-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Moedaki Track Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Real-time on-chain wallet monitoring</p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search wallet or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 w-64"
            />
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800/50 hover:bg-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {networks.map((network) => (
              <SelectItem key={network.value} value={network.value} className="text-white hover:bg-gray-700">
                <span className={network.color}>{network.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedToken} onValueChange={setSelectedToken}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Token" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-700">All Tokens</SelectItem>
            <SelectItem value="eth" className="text-white hover:bg-gray-700">ETH</SelectItem>
            <SelectItem value="usdc" className="text-white hover:bg-gray-700">USDC</SelectItem>
            <SelectItem value="btc" className="text-white hover:bg-gray-700">BTC</SelectItem>
          </SelectContent>
        </Select>

        <Select value={volumeFilter} onValueChange={setVolumeFilter}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Volume" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-700">All Volumes</SelectItem>
            <SelectItem value="whale" className="text-white hover:bg-gray-700">&gt; $100K</SelectItem>
            <SelectItem value="large" className="text-white hover:bg-gray-700">&gt; $10K</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="1h" className="text-white hover:bg-gray-700">1 Hour</SelectItem>
            <SelectItem value="24h" className="text-white hover:bg-gray-700">24 Hours</SelectItem>
            <SelectItem value="7d" className="text-white hover:bg-gray-700">7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Wallet Balance & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Balance Card */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="h-5 w-5 text-cyan-400" />
                Portfolio Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {walletBalance.total.toFixed(4)} ETH
                  </p>
                  <p className="text-gray-400 text-sm">
                    ${walletBalance.usdValue.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {walletBalance.changePercentage > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`font-semibold ${walletBalance.changePercentage > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {walletBalance.changePercentage > 0 ? '+' : ''}{walletBalance.changePercentage}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {walletBalance.change24h > 0 ? '+' : ''}${walletBalance.change24h.toFixed(2)} (24h)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flow Chart */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-purple-400" />
                Fund Flows (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="inflow" 
                      stackId="1" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Inflow"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outflow" 
                      stackId="2" 
                      stroke="#EF4444" 
                      fill="#EF4444" 
                      fillOpacity={0.3}
                      name="Outflow"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-blue-400" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === 'in' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {tx.type === 'in' ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {tx.type === 'in' ? '+' : '-'}{tx.amount} {tx.token}
                        </p>
                        <p className="text-sm text-gray-400">
                          {tx.type === 'in' ? 'From' : 'To'}: {tx.type === 'in' ? tx.from : tx.to}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        ${tx.usdValue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">{tx.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5 text-orange-400" />
                Real-time Alerts
                <Badge variant="destructive" className="ml-auto">
                  {realTimeAlerts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realTimeAlerts.map((alert) => (
                  <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} border-2`}>
                    <Bell className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className="text-xs opacity-70 ml-2">{alert.timestamp}</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-gray-700 bg-gray-800/50 hover:bg-gray-700">
                <Eye className="h-4 w-4 mr-2" />
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Wallets Tracked</span>
                  <span className="text-white font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Networks</span>
                  <span className="text-white font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Transactions</span>
                  <span className="text-white font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alerts Today</span>
                  <span className="text-orange-400 font-semibold">23</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnChainDashboard;

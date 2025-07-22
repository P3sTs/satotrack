import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowUpDown, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  History,
  Wallet,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSwapManager } from '@/hooks/useSwapManager';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { toast } from 'sonner';

const Swap: React.FC = () => {
  const navigate = useNavigate();
  const { carteiras } = useCarteiras();
  const {
    isLoading,
    swapHistory,
    currentQuote,
    getSwapQuote,
    executeSwap,
    getPlatformFeeSettings,
    clearQuote
  } = useSwapManager();

  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [feeType, setFeeType] = useState<'fixed' | 'percentage'>('percentage');
  const [feeSettings, setFeeSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('swap');

  const supportedTokens = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether USD', icon: '₮' },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬟' }
  ];

  // Load fee settings on mount
  useEffect(() => {
    const loadFeeSettings = async () => {
      const settings = await getPlatformFeeSettings();
      setFeeSettings(settings);
    };
    loadFeeSettings();
  }, [getPlatformFeeSettings]);

  // Get wallet by currency (using simplified mock data)
  const getWallet = (currency: string) => {
    return { endereco: `mock_address_${currency.toLowerCase()}`, saldo: '1.0' };
  };

  // Get wallet balance (using mock data)
  const getWalletBalance = (currency: string) => {
    return parseFloat('1.0'); // Mock balance
  };

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount('');
    clearQuote();
  };

  // Handle get quote
  const handleGetQuote = async () => {
    const fromWallet = getWallet(fromCurrency);
    const toWallet = getWallet(toCurrency);

    if (!fromWallet || !toWallet) {
      toast.error('Carteiras não encontradas');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    if (parseFloat(fromAmount) > getWalletBalance(fromCurrency)) {
      toast.error('Saldo insuficiente');
      return;
    }

    await getSwapQuote(
      fromCurrency,
      toCurrency,
      fromAmount,
      fromWallet.endereco,
      toWallet.endereco,
      feeType
    );
  };

  // Handle execute swap
  const handleExecuteSwap = async () => {
    if (!currentQuote) {
      toast.error('Obtenha uma cotação primeiro');
      return;
    }

    const fromWallet = getWallet(fromCurrency);
    const toWallet = getWallet(toCurrency);

    if (!fromWallet || !toWallet) {
      toast.error('Carteiras não encontradas');
      return;
    }

    const success = await executeSwap({
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount: currentQuote.toAmount,
      fromAddress: fromWallet.endereco,
      toAddress: toWallet.endereco,
      feeType
    });

    if (success) {
      setFromAmount('');
      clearQuote();
    }
  };

  // Get token icon
  const getTokenIcon = (symbol: string) => {
    const token = supportedTokens.find(t => t.symbol === symbol);
    return token?.icon || '●';
  };

  // Format status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400">Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
          <h1 className="text-2xl font-bold text-satotrack-text">Swap de Criptomoedas</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-dashboard-dark/50 border border-satotrack-neon/20">
            <TabsTrigger value="swap" className="data-[state=active]:bg-satotrack-neon/20">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Swap
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-satotrack-neon/20">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-satotrack-neon/20">
              <Settings className="h-4 w-4 mr-2" />
              Taxas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swap" className="space-y-6">
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardHeader>
                <CardTitle className="text-center text-satotrack-text">Trocar Criptomoedas</CardTitle>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  Taxa da SatoTracker incluída
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fee Type Toggle */}
                <Card className="bg-dashboard-medium/30 border-satotrack-neon/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="fee-mode" className="text-sm font-medium">
                          Modo de Taxa:
                        </Label>
                        <Badge variant={feeType === 'fixed' ? 'default' : 'secondary'}>
                          {feeType === 'fixed' ? 'Taxa Fixa' : 'Percentual (0.5%)'}
                        </Badge>
                      </div>
                      <Switch
                        id="fee-mode"
                        checked={feeType === 'fixed'}
                        onCheckedChange={(checked) => {
                          setFeeType(checked ? 'fixed' : 'percentage');
                          clearQuote();
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* From Token */}
                <div className="space-y-3">
                  <Label>De:</Label>
                  <Card className="border-dashboard-light/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Select value={fromCurrency} onValueChange={(value) => {
                          setFromCurrency(value);
                          clearQuote();
                        }}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecionar token" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportedTokens.map((token) => (
                              <SelectItem key={token.symbol} value={token.symbol}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{token.icon}</span>
                                  <span>{token.symbol}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={fromAmount}
                          onChange={(e) => {
                            setFromAmount(e.target.value);
                            clearQuote();
                          }}
                          className="text-lg font-semibold"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Saldo: {getWalletBalance(fromCurrency).toFixed(6)} {fromCurrency}</span>
                          <button 
                            onClick={() => {
                              setFromAmount(getWalletBalance(fromCurrency).toString());
                              clearQuote();
                            }}
                            className="text-satotrack-neon hover:underline"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwapTokens}
                    className="w-10 h-10 rounded-full border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-3">
                  <Label>Para:</Label>
                  <Card className="border-dashboard-light/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Select value={toCurrency} onValueChange={(value) => {
                          setToCurrency(value);
                          clearQuote();
                        }}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecionar token" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportedTokens.map((token) => (
                              <SelectItem key={token.symbol} value={token.symbol}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{token.icon}</span>
                                  <span>{token.symbol}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder="0.00"
                          value={currentQuote ? currentQuote.toAmount : ''}
                          readOnly
                          className="text-lg font-semibold bg-muted/30"
                        />
                        <div className="text-xs text-muted-foreground">
                          Saldo: {getWalletBalance(toCurrency).toFixed(6)} {toCurrency}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quote Button */}
                <Button
                  onClick={handleGetQuote}
                  disabled={!fromAmount || fromCurrency === toCurrency || isLoading}
                  className="w-full bg-satotrack-neon/20 text-satotrack-neon border border-satotrack-neon/30 hover:bg-satotrack-neon/30"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Buscando cotação...
                    </>
                  ) : (
                    'Obter Cotação'
                  )}
                </Button>

                {/* Quote Details */}
                {currentQuote && (
                  <Card className="border-emerald-500/20 bg-emerald-500/5">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Cotação Válida</span>
                        <Badge variant="outline" className="ml-auto">
                          <Clock className="h-3 w-3 mr-1" />
                          5 min
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taxa de Câmbio:</span>
                          <span>1 {fromCurrency} = {currentQuote.rate.toFixed(6)} {toCurrency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taxa de Rede:</span>
                          <span>{currentQuote.estimatedFee}</span>
                        </div>
                        <div className="flex justify-between border-t border-satotrack-neon/20 pt-2">
                          <span className="text-muted-foreground">Taxa SatoTracker:</span>
                          <span className="text-yellow-400">
                            {currentQuote.platformFee.amount.toFixed(8)} {currentQuote.platformFee.currency}
                            <Badge className="ml-2 text-xs bg-yellow-500/20 text-yellow-400">
                              {currentQuote.platformFee.type === 'fixed' ? 'Fixa' : '0.5%'}
                            </Badge>
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-emerald-500/20 pt-2 font-semibold">
                          <span className="text-emerald-400">Você receberá:</span>
                          <span className="text-emerald-400">
                            {currentQuote.toAmount} {toCurrency}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total a enviar:</span>
                          <span>{currentQuote.totalFromAmount} {fromCurrency}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Execute Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleExecuteSwap}
                    disabled={!currentQuote || isLoading}
                    className="w-full bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Executar Swap
                      </>
                    )}
                  </Button>
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-emerald-300">
                    <p className="font-medium mb-1">✅ Integração Ativa com Tatum</p>
                    <p>Swaps com cotações em tempo real via API da Tatum. Taxa transparente da SatoTracker para manutenção da plataforma.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardHeader>
                <CardTitle className="text-satotrack-text">Histórico de Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                {swapHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum swap realizado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {swapHistory.map((swap) => (
                      <Card key={swap.id} className="bg-dashboard-medium/30 border-dashboard-light/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTokenIcon(swap.from_currency)}</span>
                              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                              <span className="text-lg">{getTokenIcon(swap.to_currency)}</span>
                              <span className="font-medium">
                                {swap.from_amount} {swap.from_currency} → {swap.to_amount.toFixed(6)} {swap.to_currency}
                              </span>
                            </div>
                            {getStatusBadge(swap.status)}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Taxa paga: {swap.platform_fee_amount.toFixed(8)} {swap.platform_fee_currency}</span>
                            <span>{new Date(swap.created_at).toLocaleString('pt-BR')}</span>
                          </div>
                          {swap.transaction_hash && (
                            <div className="mt-2 text-xs">
                              <span className="text-muted-foreground">Hash: </span>
                              <span className="font-mono text-satotrack-neon">
                                {swap.transaction_hash.slice(0, 10)}...{swap.transaction_hash.slice(-10)}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-dashboard-dark/80 border-satotrack-neon/20">
              <CardHeader>
                <CardTitle className="text-satotrack-text">Configurações de Taxa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feeSettings && (
                  <>
                    <Card className="bg-blue-500/10 border-blue-500/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-300 mb-2">Taxa Percentual (Padrão)</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feeSettings.percentage.rate}% do valor do swap
                        </p>
                        <p className="text-xs text-blue-200">
                          Taxa mínima: ${feeSettings.percentage.min_fee_usd} USD
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-yellow-500/10 border-yellow-500/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-yellow-300 mb-2">Taxas Fixas por Token</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(feeSettings.fixed).map(([currency, fee]: [string, any]) => (
                            <div key={currency} className="flex justify-between text-sm">
                              <span className="flex items-center gap-1">
                                {getTokenIcon(currency)} {currency}:
                              </span>
                              <span className="text-yellow-400">{fee}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-amber-300">
                        <p className="font-medium mb-1">ℹ️ Sobre as Taxas</p>
                        <p>As taxas da SatoTracker são utilizadas para manutenção da plataforma, desenvolvimento de novas funcionalidades e cobertura dos custos operacionais.</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Swap;
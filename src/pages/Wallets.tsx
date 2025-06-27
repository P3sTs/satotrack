
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { useCryptoWallets } from '../hooks/useCryptoWallets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Copy, Send, Download, QrCode, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Wallets: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { wallets, isLoading, refreshAllBalances } = useCryptoWallets();
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Filter only active wallets (not pending)
  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');

  const getCryptoColor = (currency: string) => {
    const colors = {
      BTC: 'bg-gradient-to-r from-orange-500 to-yellow-500',
      ETH: 'bg-gradient-to-r from-blue-500 to-purple-500',
      MATIC: 'bg-gradient-to-r from-purple-500 to-pink-500',
      USDT: 'bg-gradient-to-r from-green-500 to-teal-500',
      SOL: 'bg-gradient-to-r from-purple-600 to-blue-600',
    };
    return colors[currency as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getCryptoIcon = (currency: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      MATIC: '⬟',
      USDT: '₮',
      SOL: '◎'
    };
    return icons[currency as keyof typeof icons] || '●';
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllBalances();
      toast.success('Saldos atualizados!');
    } catch (error) {
      toast.error('Erro ao atualizar saldos');
    } finally {
      setRefreshing(false);
    }
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0.00';
    if (num < 0.01) return '<0.01';
    return num.toFixed(4);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-white">Minhas Carteiras</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <Skeleton className="h-8 w-32 bg-slate-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full bg-slate-700 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 bg-slate-700" />
                    <Skeleton className="h-10 flex-1 bg-slate-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeWallets.length === 0 ? (
          <Card className="max-w-md mx-auto bg-slate-800 border-slate-700 text-center p-8">
            <div className="text-6xl mb-4">👛</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma carteira encontrada</h3>
            <p className="text-slate-400 mb-4">
              Você ainda não possui carteiras cripto. Vá para o dashboard para gerar suas carteiras.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir para Dashboard
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeWallets.map((wallet) => (
              <Card
                key={wallet.id}
                className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${getCryptoColor(wallet.currency)} flex items-center justify-center text-white text-xl font-bold`}>
                        {getCryptoIcon(wallet.currency)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{wallet.name}</CardTitle>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {wallet.currency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Balance */}
                  <div className="text-center py-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-slate-400">Saldo</p>
                    <p className="text-2xl font-bold text-white">
                      {formatBalance(wallet.balance)} {wallet.currency}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-400">Endereço</Label>
                    <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                      <code className="text-xs text-slate-300 flex-1 break-all">
                        {wallet.address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                        className="text-slate-400 hover:text-white hover:bg-slate-700 shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                          <Download className="h-4 w-4 mr-1" />
                          Receber
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Receber {wallet.currency}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex justify-center">
                            <div className="bg-white p-4 rounded-lg">
                              <QRCodeSVG value={wallet.address} size={200} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Endereço da carteira</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={wallet.address}
                                readOnly
                                className="bg-slate-900 border-slate-600 text-white"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                                className="border-slate-600 text-white hover:bg-slate-700"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-white hover:bg-slate-700"
                      onClick={() => toast.info('Funcionalidade de envio em desenvolvimento')}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>QR Code - {wallet.currency}</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                          <div className="bg-white p-4 rounded-lg">
                            <QRCodeSVG value={wallet.address} size={250} />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallets;

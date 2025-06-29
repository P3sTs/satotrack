
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, CheckCircle, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { checkKMSHealth, logKMSOperation, listKMSWallets, type KMSWallet } from '@/utils/security/kmsService';

const KMSDashboard: React.FC = () => {
  const [kmsStatus, setKMSStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [kmsWallets, setKMSWallets] = useState<KMSWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkKMSStatus();
    loadKMSWallets();
  }, []);

  const checkKMSStatus = async () => {
    try {
      const isHealthy = await checkKMSHealth();
      setKMSStatus(isHealthy ? 'healthy' : 'error');
      logKMSOperation('HEALTH_CHECK', { status: isHealthy ? 'healthy' : 'error' });
    } catch (error) {
      setKMSStatus('error');
      console.error('KMS health check failed:', error);
    }
  };

  const loadKMSWallets = async () => {
    setIsLoading(true);
    try {
      const wallets = await listKMSWallets();
      setKMSWallets(wallets);
      logKMSOperation('LIST_WALLETS', { count: wallets.length });
    } catch (error) {
      console.error('Failed to load KMS wallets:', error);
      toast.error('Erro ao carregar carteiras KMS');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshKMSStatus = async () => {
    setKMSStatus('checking');
    await checkKMSStatus();
    await loadKMSWallets();
    toast.success('Status KMS atualizado');
  };

  return (
    <div className="space-y-6">
      {/* KMS Status Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-6 w-6 text-purple-400" />
              <span>Tatum KMS Status</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${
                  kmsStatus === 'healthy' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : kmsStatus === 'error'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}
              >
                {kmsStatus === 'healthy' && <CheckCircle className="h-3 w-3 mr-1" />}
                {kmsStatus === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {kmsStatus === 'checking' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                {kmsStatus === 'healthy' ? 'Ativo' : kmsStatus === 'error' ? 'Erro' : 'Verificando'}
              </Badge>
              <Button
                onClick={refreshKMSStatus}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm">Chaves Seguras na Nuvem</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm">Assinatura Remota</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-400" />
              <span className="text-sm">Backup Automático</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KMS Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-satotrack-neon" />
            Carteiras KMS ({kmsWallets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-satotrack-neon" />
              <span className="ml-2">Carregando carteiras KMS...</span>
            </div>
          ) : kmsWallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma carteira KMS encontrada</p>
              <p className="text-sm">As carteiras serão listadas após a geração</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kmsWallets.map((wallet) => (
                <Card key={wallet.id} className="bg-gradient-to-r from-slate-800 to-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                        {wallet.currency}
                      </Badge>
                      <Shield className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-sm font-mono break-all mb-2">
                      {wallet.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      KMS ID: {wallet.kmsId?.substring(0, 8)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* KMS Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Shield className="h-5 w-5" />
              Segurança Máxima
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ Chaves privadas nunca expostas</p>
            <p>✅ Criptografia AES-256</p>
            <p>✅ Backup automático na nuvem</p>
            <p>✅ Auditoria completa de operações</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Zap className="h-5 w-5" />
              Funcionalidades KMS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>⚡ Assinatura remota de transações</p>
            <p>⚡ Multi-blockchain suportado</p>
            <p>⚡ API REST segura</p>
            <p>⚡ Monitoramento em tempo real</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="font-medium text-yellow-400">Aviso de Segurança KMS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            O Tatum KMS garante que suas chaves privadas permaneçam seguras na nuvem, 
            nunca sendo expostas ou transmitidas. Todas as transações são assinadas 
            remotamente no ambiente seguro do KMS.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KMSDashboard;

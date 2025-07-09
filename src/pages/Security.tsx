import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Clock,
  Key,
  Smartphone,
  Globe,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useBiometric } from '@/contexts/BiometricContext';
import { useSecurityData } from '@/hooks/useSecurityData';

const Security: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBiometricEnabled: biometricEnabled } = useBiometric();
  const { securityLogs, securityMetrics } = useSecurityData();

  const securityScore = Math.min(
    80 + 
    (biometricEnabled ? 15 : 0) + 
    (securityMetrics.successfulLogins / securityMetrics.totalLogins * 5), 
    100
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'login': 'Login',
      'biometric_auth': 'Auth Biométrica',
      'wallet_access': 'Acesso Carteira',
      'password_change': 'Mudança Senha',
      'suspicious_activity': 'Atividade Suspeita'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Centro de Segurança</h1>
                <p className="text-sm text-muted-foreground">
                  Monitoramento completo de segurança e atividades
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Atualização automática ativa</span>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score de Segurança</p>
                  <p className="text-3xl font-bold text-white">{securityScore}%</p>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mt-2">
                    Excelente
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Logins Hoje</p>
                  <p className="text-3xl font-bold text-white">8</p>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400 mt-2">
                    Normal
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Biometria</p>
                  <p className="text-3xl font-bold text-white">
                    {biometricEnabled ? 'Ativa' : 'Inativa'}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${
                      biometricEnabled 
                        ? 'border-emerald-500/30 text-emerald-400' 
                        : 'border-orange-500/30 text-orange-400'
                    }`}
                  >
                    {biometricEnabled ? 'Protegido' : 'Configurar'}
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">KMS Status</p>
                  <p className="text-3xl font-bold text-white">Online</p>
                  <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon mt-2">
                    Seguro
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-satotrack-neon/20 flex items-center justify-center">
                  <Key className="h-6 w-6 text-satotrack-neon" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Security Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-satotrack-neon" />
                    Métricas de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total de Logins</span>
                    <span className="text-white font-medium">{securityMetrics.totalLogins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxa de Sucesso</span>
                    <span className="text-emerald-400 font-medium">
                      {((securityMetrics.successfulLogins / securityMetrics.totalLogins) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Uso da Biometria</span>
                    <span className="text-purple-400 font-medium">{securityMetrics.biometricUse}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Idade da Conta</span>
                    <span className="text-blue-400 font-medium">{securityMetrics.accountAge} dias</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-emerald-400" />
                    Recursos de Proteção
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Autenticação 2FA</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Ativo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Criptografia KMS</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Ativo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Backup Automático</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Ativo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monitoramento IP</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Ativo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  Registro de Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-light/20"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <p className="text-white font-medium">
                            {getTypeLabel(log.type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.device} • {log.ip}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('pt-BR')}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            log.status === 'success' 
                              ? 'border-emerald-500/30 text-emerald-400'
                              : 'border-red-500/30 text-red-400'
                          }`}
                        >
                          {log.status === 'success' ? 'Sucesso' : 'Falha'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
                <CardHeader>
                  <CardTitle className="text-white">Configurações de Acesso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black"
                    onClick={() => navigate('/security-settings')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Configurar Biometria
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-dashboard-light text-white"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500/30 text-blue-400"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Gerenciar Sessões
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
                <CardHeader>
                  <CardTitle className="text-white">Notificações de Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Login de novo dispositivo</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transações suspeitas</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tentativas de login</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Backup de chaves</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Security;
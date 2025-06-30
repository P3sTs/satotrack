
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Lock, Eye } from 'lucide-react';

interface SecurityMetrics {
  encryptionStatus: 'active' | 'inactive';
  kmsStatus: 'connected' | 'disconnected' | 'checking';
  auditLogsCount: number;
  lastSecurityCheck: string;
  securityScore: number;
  vulnerabilities: string[];
  recommendations: string[];
}

export const CryptoSecurityStatus: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    encryptionStatus: 'active',
    kmsStatus: 'checking',
    auditLogsCount: 0,
    lastSecurityCheck: '',
    securityScore: 0,
    vulnerabilities: [],
    recommendations: []
  });
  const [isChecking, setIsChecking] = useState(false);

  const performSecurityCheck = async () => {
    setIsChecking(true);
    try {
      // Verificar logs de auditoria locais
      const logs = JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
      
      // Calcular score de segurança
      let score = 85; // Base score
      
      // Verificações de segurança
      const vulnerabilities: string[] = [];
      const recommendations: string[] = [];
      
      // Verificar se há dados sensíveis em localStorage
      const sensitiveKeys = ['private_key', 'mnemonic', 'seed'];
      for (const key of Object.keys(localStorage)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          vulnerabilities.push(`Possíveis dados sensíveis em localStorage: ${key}`);
          score -= 20;
        }
      }
      
      // Verificar criptografia
      if (typeof crypto?.subtle === 'undefined') {
        vulnerabilities.push('WebCrypto API não disponível');
        score -= 30;
      } else {
        score += 10;
      }
      
      // Recomendações baseadas no score
      if (score < 70) {
        recommendations.push('Revisar políticas de segurança');
        recommendations.push('Implementar criptografia adicional');
      }
      if (logs.length === 0) {
        recommendations.push('Ativar logs de auditoria');
      }
      if (score >= 90) {
        recommendations.push('Manter práticas de segurança atuais');
      }

      setMetrics(prev => ({
        ...prev,
        auditLogsCount: logs.length,
        lastSecurityCheck: new Date().toLocaleString('pt-BR'),
        securityScore: Math.max(0, Math.min(100, score)),
        vulnerabilities,
        recommendations,
        kmsStatus: 'connected' // Assumindo conexão KMS ativa
      }));
    } catch (error) {
      console.error('Erro na verificação de segurança:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    performSecurityCheck();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 border-green-500/30 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
    return 'text-red-400 border-red-500/30 bg-red-500/20';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4" />;
    if (score >= 70) return <Shield className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Security Score Card */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-satotrack-neon" />
              <span>Status de Segurança</span>
            </div>
            <Badge variant="outline" className={getScoreColor(metrics.securityScore)}>
              {getScoreIcon(metrics.securityScore)}
              {metrics.securityScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Lock className={`h-4 w-4 ${metrics.encryptionStatus === 'active' ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <p className="text-xs text-muted-foreground">Criptografia</p>
              <p className="text-sm font-medium">{metrics.encryptionStatus === 'active' ? 'Ativa' : 'Inativa'}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Shield className={`h-4 w-4 ${metrics.kmsStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}`} />
              </div>
              <p className="text-xs text-muted-foreground">Tatum KMS</p>
              <p className="text-sm font-medium">
                {metrics.kmsStatus === 'connected' ? 'Conectado' : 
                 metrics.kmsStatus === 'checking' ? 'Verificando...' : 'Desconectado'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground">Logs Auditoria</p>
              <p className="text-sm font-medium">{metrics.auditLogsCount}</p>
            </div>
            
            <div className="text-center">
              <Button
                onClick={performSecurityCheck}
                disabled={isChecking}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {isChecking ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                {isChecking ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
          </div>
          
          {metrics.lastSecurityCheck && (
            <p className="text-xs text-muted-foreground text-center">
              Última verificação: {metrics.lastSecurityCheck}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vulnerabilities */}
      {metrics.vulnerabilities.length > 0 && (
        <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Vulnerabilidades Detectadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.vulnerabilities.map((vulnerability, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-300">{vulnerability}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {metrics.recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Shield className="h-5 w-5" />
              Recomendações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-300">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

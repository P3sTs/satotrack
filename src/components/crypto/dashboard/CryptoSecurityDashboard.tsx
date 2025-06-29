
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { getSecurityStatus, getTransactionSigningInstructions } from '@/utils/security/cryptoSecurity';

const CryptoSecurityDashboard: React.FC = () => {
  const securityStatus = getSecurityStatus();
  const signingInstructions = getTransactionSigningInstructions();

  return (
    <div className="space-y-6">
      {/* Security Score Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            Status de Segurança
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              Score: {securityStatus.securityScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">Sem Chaves Privadas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">Criptografia Ativa</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">Logs de Auditoria</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">Validação de Endereços</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Security Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-400" />
            Assinatura Segura de Transações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {signingInstructions.message}
          </p>
          
          <div className="grid gap-3">
            {signingInstructions.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-blue-500/5 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                  {index + 1}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>

          {/* Tatum KMS Highlight */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-purple-400 mb-2">🚀 Tatum KMS - Recomendado</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {signingInstructions.tatumKms.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {signingInstructions.tatumKms.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Recomendações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityStatus.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Eye className="h-4 w-4 text-yellow-400 mt-0.5" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-red-400" />
            <span className="font-medium text-red-400">Aviso de Segurança Crítico</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong className="text-red-400">NUNCA</strong> compartilhe suas chaves privadas, seeds ou mnemonics. 
            Este sistema foi projetado para NUNCA armazenar essas informações sensíveis. 
            Para transações, sempre use métodos de assinatura externa seguros.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoSecurityDashboard;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Fingerprint, 
  Shield, 
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import BiometricSetup from '@/components/security/BiometricSetup';

const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Centro de Segurança</h1>
              <p className="text-lg text-muted-foreground">
                Configure a proteção biométrica e gerencie suas opções de segurança
              </p>
            </div>
          </div>
        </div>

        {/* Main Security Configuration */}
        <BiometricSetup />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 hover:border-satotrack-neon/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Fingerprint className="h-12 w-12 text-satotrack-neon mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Biometria</h3>
              <p className="text-sm text-muted-foreground">
                Configure autenticação por impressão digital ou Face ID
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 hover:border-emerald-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">KMS Protection</h3>
              <p className="text-sm text-muted-foreground">
                Suas chaves são protegidas pelo Tatum Key Management System
              </p>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <ExternalLink className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Auditoria</h3>
              <p className="text-sm text-muted-foreground">
                Visualize logs de segurança e atividades da conta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-300">
                  🔐 Segurança Multicamadas do SatoTracker
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-200">
                  <div>
                    <h4 className="font-medium mb-2">🛡️ Proteção Frontend:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Biometria protege acesso local</li>
                      <li>• Nunca armazena chaves privadas</li>
                      <li>• Criptografia de sessão temporária</li>
                      <li>• Verificação de integridade</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🔒 Proteção Backend:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Tatum KMS gerencia chaves</li>
                      <li>• Assinatura remota de transações</li>
                      <li>• Certificação de segurança</li>
                      <li>• Backup automático seguro</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-blue-300 mt-4">
                  💡 Suas chaves privadas nunca saem do ambiente seguro da Tatum. 
                  A biometria protege apenas o acesso às funcionalidades locais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityPage;
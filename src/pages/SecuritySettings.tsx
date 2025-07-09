import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Fingerprint, Key, Lock } from 'lucide-react';
import BiometricSetup from '@/components/security/BiometricSetup';

const SecuritySettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Configurações de Segurança</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie a proteção biométrica e acesso às carteiras
              </p>
            </div>
          </div>
        </div>

        {/* Biometric Configuration */}
        <BiometricSetup />

        {/* Security Features Overview */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Key className="h-5 w-5 text-satotrack-neon" />
              Arquitetura de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frontend Security */}
              <div className="p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-light/20">
                <div className="flex items-center gap-3 mb-3">
                  <Fingerprint className="h-6 w-6 text-blue-400" />
                  <h3 className="font-semibold text-white">Frontend</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Biometria protege sessão local</li>
                  <li>• Nunca armazena chaves privadas</li>
                  <li>• Apenas dados públicos (xpub)</li>
                  <li>• Criptografia local temporária</li>
                </ul>
              </div>

              {/* Backend Security */}
              <div className="p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-light/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-emerald-400" />
                  <h3 className="font-semibold text-white">Backend (Tatum KMS)</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Chaves privadas no KMS</li>
                  <li>• Assinatura remota de transações</li>
                  <li>• Certificação de segurança</li>
                  <li>• Backup e recuperação</li>
                </ul>
              </div>

              {/* Database Security */}
              <div className="p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-light/20">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-6 w-6 text-purple-400" />
                  <h3 className="font-semibold text-white">Database (Supabase)</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Apenas dados públicos</li>
                  <li>• RLS (Row Level Security)</li>
                  <li>• Autenticação JWT</li>
                  <li>• Logs de auditoria</li>
                </ul>
              </div>

              {/* Mobile Security */}
              <div className="p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-light/20">
                <div className="flex items-center gap-3 mb-3">
                  <Fingerprint className="h-6 w-6 text-satotrack-neon" />
                  <h3 className="font-semibold text-white">Mobile (Capacitor)</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Secure Enclave (iOS)</li>
                  <li>• Android Keystore</li>
                  <li>• Biometric authentication</li>
                  <li>• Encrypted preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Flow Diagram */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="text-white">Fluxo de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-4 p-3 bg-dashboard-dark/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                <div>
                  <p className="font-medium text-white">Login Supabase</p>
                  <p>Usuário autentica com email/senha</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-dashboard-dark/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">2</div>
                <div>
                  <p className="font-medium text-white">Configuração Biométrica</p>
                  <p>Gera chave de sessão e protege com biometria</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-dashboard-dark/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">3</div>
                <div>
                  <p className="font-medium text-white">Geração de Carteira</p>
                  <p>Tatum KMS cria e gerencia chaves privadas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-dashboard-dark/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-satotrack-neon/20 flex items-center justify-center text-satotrack-neon font-bold">4</div>
                <div>
                  <p className="font-medium text-white">Acesso Protegido</p>
                  <p>Biometria libera acesso às funcionalidades</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-dashboard-dark/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">5</div>
                <div>
                  <p className="font-medium text-white">Transação Segura</p>
                  <p>Assinatura remota via Tatum KMS</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
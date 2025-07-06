import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Fingerprint, FileCheck, Users, CheckCircle } from 'lucide-react';

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Autenticação via Google',
      description: 'Login seguro com OAuth2 e verificação em duas etapas',
      status: 'Ativo'
    },
    {
      icon: Fingerprint,
      title: 'Biometria local (Android/iOS)',
      description: 'WebAuthn para autenticação biométrica no dispositivo',
      status: 'Disponível'
    },
    {
      icon: Lock,
      title: 'Aprovação de transações com múltiplos fatores',
      description: 'Confirmação por email, SMS e autenticador quando necessário',
      status: 'Obrigatório'
    },
    {
      icon: FileCheck,
      title: 'Histórico auditável de tudo (modo compliance)',
      description: 'Logs completos e imutáveis de todas as operações realizadas',
      status: 'Sempre ativo'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-satotrack-neon/20 rounded-full">
              <Shield className="h-16 w-16 text-satotrack-neon" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Transparência e <span className="satotrack-gradient-text">Segurança</span> em Primeiro Lugar
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            A SatoTrack usa <strong className="text-satotrack-neon">KMS descentralizado</strong> para proteger suas operações e 
            <strong className="text-white"> nunca armazena suas chaves privadas</strong>
          </p>

          <Badge className="bg-satotrack-neon/20 text-satotrack-neon border-satotrack-neon/30 text-base px-4 py-2">
            🛡️ Certificação SatoCore KMS
          </Badge>
        </div>

        {/* Main Security Card */}
        <Card className="bg-gradient-to-br from-dashboard-medium via-dashboard-dark to-dashboard-medium border-satotrack-neon/30 mb-12 overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full" 
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--satotrack-neon)) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}
            ></div>
          </div>

          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Description */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-satotrack-neon/20 rounded-xl">
                    <Lock className="h-8 w-8 text-satotrack-neon" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">SatoCore KMS</h3>
                    <p className="text-satotrack-neon">Key Management System</p>
                  </div>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Nosso sistema proprietário de gerenciamento de chaves garante que 
                    <strong className="text-white"> você tenha controle total</strong> dos seus ativos sem expor 
                    suas chaves privadas.
                  </p>
                  
                  <p>
                    Utilizamos <strong className="text-satotrack-neon">criptografia de nível militar</strong> e 
                    distribuição de chaves em múltiplas camadas para eliminar pontos únicos de falha.
                  </p>
                </div>

                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Zero Trust Architecture</span>
                  </div>
                  <p className="text-sm text-emerald-300">
                    Nem nós nem terceiros têm acesso às suas chaves. Apenas você controla seus ativos.
                  </p>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Central Shield */}
                  <div className="relative z-10 p-8 bg-satotrack-neon/20 rounded-full border-4 border-satotrack-neon/30">
                    <Shield className="h-24 w-24 text-satotrack-neon" />
                  </div>
                  
                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                      <Lock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 p-3 bg-purple-500/20 rounded-full border border-purple-500/30">
                      <Eye className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                      <Fingerprint className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 p-3 bg-orange-500/20 rounded-full border border-orange-500/30">
                      <Users className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-dashboard-medium/50 border-dashboard-light/20 backdrop-blur-sm hover:border-satotrack-neon/30 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-satotrack-neon/10 rounded-xl border border-satotrack-neon/30 group-hover:border-satotrack-neon/50 transition-colors flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-satotrack-neon" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">
                        {feature.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      >
                        ✅ {feature.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="p-6 bg-gradient-to-r from-satotrack-neon/10 via-blue-500/10 to-purple-500/10 border border-satotrack-neon/20 rounded-2xl max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-white mb-2">
              🔒 Auditoria Completa Disponível
            </h4>
            <p className="text-muted-foreground">
              Consulte nossos relatórios de segurança e certificações de terceiros. 
              Transparência total em cada operação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
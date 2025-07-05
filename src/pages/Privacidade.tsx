import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, Database, UserCheck, Lock, Trash2, Mail } from 'lucide-react';
import Footer from '../components/Footer';

const Privacidade: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-dark">
      <header className="bg-dashboard-dark border-b border-satotrack-neon/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-orbitron text-xl font-bold satotrack-gradient-text">
                SatoTrack
              </span>
            </Link>
            <Link to="/sobre">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o painel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              <span className="satotrack-gradient-text">Política de Privacidade</span>
            </h1>
            <p className="text-lg text-satotrack-text max-w-2xl mx-auto">
              Transparência total sobre como protegemos e utilizamos seus dados
            </p>
            <p className="text-sm text-satotrack-secondary mt-2">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introdução */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-satotrack-neon/10 rounded-full border border-satotrack-neon/30">
                    <Shield className="h-7 w-7 text-satotrack-neon" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Nosso Compromisso</h2>
                </div>
                <p className="text-lg text-satotrack-text leading-relaxed mb-4">
                  A SatoTrack está comprometida em proteger sua privacidade e segurança. Esta política descreve como coletamos, usamos e protegemos suas informações quando você utiliza nossa plataforma de monitoramento de Bitcoin e criptomoedas.
                </p>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-medium">
                    🔒 Nunca solicitamos chaves privadas ou senhas de carteiras. Todo monitoramento é feito apenas com endereços públicos da blockchain.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dados Coletados */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-bitcoin/10 rounded-full border border-bitcoin/30">
                    <Database className="h-7 w-7 text-bitcoin" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Dados Coletados</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-bold text-satotrack-neon mb-2">Informações de Conta</h4>
                    <ul className="text-satotrack-text space-y-1">
                      <li>• Endereço de e-mail para autenticação</li>
                      <li>• Preferências de configuração da conta</li>
                      <li>• Histórico de login e atividades de segurança</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-bold text-bitcoin mb-2">Dados de Monitoramento</h4>
                    <ul className="text-satotrack-text space-y-1">
                      <li>• Endereços de carteiras Bitcoin (informação pública da blockchain)</li>
                      <li>• Configurações de alertas e notificações</li>
                      <li>• Histórico de transações monitoradas</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-bold text-purple-500 mb-2">Dados de Uso</h4>
                    <ul className="text-satotrack-text space-y-1">
                      <li>• Padrões de navegação na plataforma</li>
                      <li>• Recursos mais utilizados</li>
                      <li>• Dados de performance para melhorias</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uso dos Dados */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/30">
                    <UserCheck className="h-7 w-7 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Como Usamos Seus Dados</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-bold text-green-500 mb-2">✅ Funcionalidades</h4>
                    <ul className="text-sm text-satotrack-text space-y-1">
                      <li>• Monitoramento de carteiras</li>
                      <li>• Envio de alertas</li>
                      <li>• Análises personalizadas</li>
                      <li>• Sincronização entre dispositivos</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-bold text-blue-500 mb-2">🔧 Melhorias</h4>
                    <ul className="text-sm text-satotrack-text space-y-1">
                      <li>• Otimização da plataforma</li>
                      <li>• Desenvolvimento de novos recursos</li>
                      <li>• Correção de bugs</li>
                      <li>• Análise de performance</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <h4 className="font-bold text-orange-500 mb-2">🛡️ Segurança</h4>
                    <ul className="text-sm text-satotrack-text space-y-1">
                      <li>• Detecção de fraudes</li>
                      <li>• Proteção da conta</li>
                      <li>• Auditoria de segurança</li>
                      <li>• Prevenção de abusos</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-bold text-purple-500 mb-2">📞 Comunicação</h4>
                    <ul className="text-sm text-satotrack-text space-y-1">
                      <li>• Suporte técnico</li>
                      <li>• Atualizações importantes</li>
                      <li>• Notificações de serviço</li>
                      <li>• Comunicações promocionais (opcionais)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compartilhamento */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/10 rounded-full border border-red-500/30">
                    <Lock className="h-7 w-7 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Compartilhamento de Dados</h2>
                </div>
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
                  <h4 className="font-bold text-red-400 mb-3">🚫 NÃO Compartilhamos com Terceiros</h4>
                  <p className="text-satotrack-text">
                    Seus dados pessoais e de monitoramento NUNCA são vendidos, alugados ou compartilhados com terceiros para fins comerciais.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-satotrack-text mb-3">Exceções legais apenas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                      <p className="text-sm font-medium text-yellow-500 mb-2">⚖️ Ordem Judicial</p>
                      <p className="text-xs text-satotrack-text">Quando exigido por autoridades competentes com ordem judicial válida</p>
                    </div>
                    <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                      <p className="text-sm font-medium text-blue-500 mb-2">🛡️ Proteção Legal</p>
                      <p className="text-xs text-satotrack-text">Para proteger nossos direitos, propriedade ou segurança</p>
                    </div>
                    <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                      <p className="text-sm font-medium text-green-500 mb-2">✅ Seu Consentimento</p>
                      <p className="text-xs text-satotrack-text">Com sua autorização explícita e específica</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-500/10 rounded-full border border-green-500/30">
                    <Shield className="h-7 w-7 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Medidas de Segurança</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-satotrack-neon mb-3">🔐 Proteções Técnicas</h4>
                    <ul className="text-satotrack-text space-y-2">
                      <li>• Criptografia SSL/TLS em todas as conexões</li>
                      <li>• Criptografia de dados em repouso</li>
                      <li>• Autenticação de dois fatores (2FA)</li>
                      <li>• Monitoramento 24/7 contra intrusões</li>
                      <li>• Backups seguros e redundantes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-bitcoin mb-3">👥 Proteções Organizacionais</h4>
                    <ul className="text-satotrack-text space-y-2">
                      <li>• Acesso restrito por função</li>
                      <li>• Auditoria de logs de acesso</li>
                      <li>• Treinamento de segurança da equipe</li>
                      <li>• Políticas rígidas de privacidade</li>
                      <li>• Testes de penetração regulares</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remoção de Dados */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/10 rounded-full border border-red-500/30">
                    <Trash2 className="h-7 w-7 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Exclusão de Dados</h2>
                </div>
                <p className="text-lg text-satotrack-text leading-relaxed mb-6">
                  Você tem o direito de solicitar a exclusão de seus dados pessoais a qualquer momento, conforme a Lei Geral de Proteção de Dados (LGPD).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-bold text-blue-500 mb-3">📝 Como Solicitar</h4>
                    <ul className="text-satotrack-text space-y-2">
                      <li>• Envie um e-mail para privacidade@satotrack.com</li>
                      <li>• Use a opção "Excluir Conta" nas configurações</li>
                      <li>• Entre em contato pelo chat de suporte</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-bold text-yellow-500 mb-3">⏱️ Prazos e Processo</h4>
                    <ul className="text-satotrack-text space-y-2">
                      <li>• Confirmação em até 24 horas</li>
                      <li>• Exclusão em até 30 dias</li>
                      <li>• Backup de segurança por 90 dias</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contato */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-satotrack-neon/10 rounded-full border border-satotrack-neon/30">
                    <Mail className="h-7 w-7 text-satotrack-neon" />
                  </div>
                  <h2 className="text-2xl font-orbitron font-bold">Contato e Dúvidas</h2>
                </div>
                <p className="text-lg text-satotrack-text leading-relaxed mb-6">
                  Para questões específicas sobre privacidade, proteção de dados ou para exercer seus direitos, entre em contato conosco:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-bold text-satotrack-neon mb-2">📧 E-mail Oficial</h4>
                    <p className="text-satotrack-text">privacidade@satotrack.com</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-bold text-bitcoin mb-2">⏰ Horário de Atendimento</h4>
                    <p className="text-satotrack-text">Segunda a Sexta, 9h às 18h (horário de Brasília)</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400">
                    💬 Resposta garantida em até 48 horas para questões de privacidade
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Navegação */}
            <div className="text-center pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sobre">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Quem Somos
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacidade;
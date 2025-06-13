
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Target, Eye, Heart, Shield, Zap, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';

const Sobre: React.FC = () => {
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
            <Link to="/dashboard">
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              <span className="satotrack-gradient-text">Quem Somos</span>
            </h1>
            <p className="text-xl text-satotrack-text max-w-3xl mx-auto leading-relaxed">
              SatoTrack: sua visão clara do mercado de criptomoedas 🇧🇷💰
            </p>
            <p className="text-lg text-satotrack-secondary mt-4 font-medium">
              Gerencie. Acompanhe. Cresça.
            </p>
          </div>

          {/* O que é o SatoTrack */}
          <div className="mb-16">
            <Card className="cyberpunk-card max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-satotrack-neon/10 rounded-full border border-satotrack-neon/30">
                    <Zap className="h-7 w-7 text-satotrack-neon" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-orbitron font-bold">O que é o SatoTrack</h2>
                </div>
                <p className="text-lg text-satotrack-text leading-relaxed mb-6">
                  O SatoTrack é uma plataforma brasileira especializada no monitoramento avançado de carteiras Bitcoin e análise do mercado de criptomoedas. Nossa missão é democratizar o acesso à informação financeira blockchain, oferecendo ferramentas profissionais de acompanhamento em tempo real.
                </p>
                <p className="text-lg text-satotrack-text leading-relaxed">
                  Desenvolvido pensando no investidor brasileiro, combinamos tecnologia de ponta com uma interface intuitiva para que você tenha total controle sobre seus investimentos em Bitcoin e outras criptomoedas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Por que nasceu */}
          <div className="mb-16">
            <Card className="cyberpunk-card max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-bitcoin/10 rounded-full border border-bitcoin/30">
                    <TrendingUp className="h-7 w-7 text-bitcoin" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-orbitron font-bold">Por que nasceu</h2>
                </div>
                <p className="text-lg text-satotrack-text leading-relaxed mb-6">
                  O mercado brasileiro de criptomoedas cresceu exponencialmente, mas ainda carecia de ferramentas nacionais especializadas em monitoramento profissional. Identificamos que os investidores precisavam de uma solução que combinasse:
                </p>
                <ul className="space-y-3 text-lg text-satotrack-text">
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-satotrack-neon mt-3 flex-shrink-0"></div>
                    <span>Monitoramento em tempo real de múltiplas carteiras</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-satotrack-neon mt-3 flex-shrink-0"></div>
                    <span>Análises técnicas avançadas e alertas inteligentes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-satotrack-neon mt-3 flex-shrink-0"></div>
                    <span>Interface em português com suporte especializado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-satotrack-neon mt-3 flex-shrink-0"></div>
                    <span>Ferramentas de gestão de risco adaptadas ao mercado brasileiro</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* MVV Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Missão */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="p-3 bg-satotrack-neon/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 border border-satotrack-neon/30">
                  <Target className="h-7 w-7 text-satotrack-neon" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-4">Nossa Missão</h3>
                <p className="text-satotrack-text leading-relaxed">
                  Democratizar o acesso à informação financeira blockchain, oferecendo ferramentas profissionais de monitoramento que capacitam investidores brasileiros a tomar decisões mais inteligentes no mercado de criptomoedas.
                </p>
              </CardContent>
            </Card>

            {/* Visão */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="p-3 bg-bitcoin/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 border border-bitcoin/30">
                  <Eye className="h-7 w-7 text-bitcoin" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-4">Nossa Visão</h3>
                <p className="text-satotrack-text leading-relaxed">
                  Ser a principal plataforma brasileira de monitoramento e análise de criptomoedas, reconhecida pela excelência técnica, inovação contínua e compromisso com a educação financeira digital.
                </p>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card className="cyberpunk-card">
              <CardContent className="p-8">
                <div className="p-3 bg-purple-500/10 rounded-full w-14 h-14 flex items-center justify-center mb-6 border border-purple-500/30">
                  <Heart className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-4">Nossos Valores</h3>
                <ul className="text-satotrack-text space-y-2">
                  <li>• Transparência total</li>
                  <li>• Segurança em primeiro lugar</li>
                  <li>• Inovação responsável</li>
                  <li>• Educação financeira</li>
                  <li>• Compromisso com o Brasil</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Diferenciais */}
          <div className="mb-16">
            <Card className="cyberpunk-card max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/30">
                    <Shield className="h-7 w-7 text-purple-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-orbitron font-bold">Nossos Diferenciais</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-satotrack-neon/20">
                    <h4 className="font-bold text-satotrack-neon mb-2">🔒 Segurança Máxima</h4>
                    <p className="text-sm text-satotrack-text">Nunca solicitamos chaves privadas. Monitoramento apenas com endereços públicos.</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-bitcoin/20">
                    <h4 className="font-bold text-bitcoin mb-2">⚡ Tempo Real</h4>
                    <p className="text-sm text-satotrack-text">Atualizações instantâneas com a mais baixa latência do mercado.</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-purple-500/20">
                    <h4 className="font-bold text-purple-500 mb-2">🇧🇷 Feito no Brasil</h4>
                    <p className="text-sm text-satotrack-text">Suporte em português e horário comercial brasileiro.</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-green-500/20">
                    <h4 className="font-bold text-green-500 mb-2">📊 Analytics Avançado</h4>
                    <p className="text-sm text-satotrack-text">Métricas profissionais e insights baseados em IA.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <Card className="cyberpunk-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-orbitron font-bold mb-4 satotrack-gradient-text">
                  Pronto para revolucionar seus investimentos?
                </h3>
                <p className="text-satotrack-text mb-6">
                  Junte-se a milhares de brasileiros que já confiam no SatoTrack para monitorar seus investimentos em Bitcoin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <Button variant="default" size="lg" className="w-full sm:w-auto">
                      Começar Agora
                    </Button>
                  </Link>
                  <Link to="/privacidade">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Política de Privacidade
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;

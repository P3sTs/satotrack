
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Eye, Shield } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Sobre: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-dark">
      <NavBar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-orbitron mb-6 text-center">
            <span className="satotrack-gradient-text">Sobre o SatoTrack</span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-lg text-satotrack-text mb-4">
              O SatoTrack é uma plataforma especializada no monitoramento de endereços Bitcoin, projetada para oferecer total transparência e segurança na visualização de transações na blockchain.
            </p>
            <p className="text-satotrack-text">
              Nossa missão é democratizar o acesso à informação da blockchain, fornecendo ferramentas intuitivas para acompanhar carteiras Bitcoin sem comprometer a privacidade do usuário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="tech-panel">
              <CardContent className="p-6">
                <div className="p-3 bg-satotrack-neon/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-satotrack-neon/30">
                  <Eye className="h-7 w-7 text-satotrack-neon" />
                </div>
                <h2 className="text-xl font-orbitron mb-3">Monitoramento Transparente</h2>
                <p className="text-satotrack-text mb-4">
                  O monitoramento de endereços Bitcoin permite visualizar todas as transações associadas a um endereço público na blockchain. Isso oferece transparência total sobre movimentações de fundos, sem necessidade de acesso a chaves privadas.
                </p>
                <p className="text-satotrack-text">
                  Você pode acompanhar saldos, histórico de transações e padrões de atividade, tudo enquanto mantém sua privacidade e segurança.
                </p>
              </CardContent>
            </Card>

            <Card className="tech-panel">
              <CardContent className="p-6">
                <div className="p-3 bg-satotrack-neon/10 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-satotrack-neon/30">
                  <Shield className="h-7 w-7 text-satotrack-neon" />
                </div>
                <h2 className="text-xl font-orbitron mb-3">Segurança e Privacidade</h2>
                <p className="text-satotrack-text mb-4">
                  Todo o processo de monitoramento é feito diretamente através da API pública da blockchain, garantindo que nenhuma informação sensível seja compartilhada ou armazenada.
                </p>
                <p className="text-satotrack-text">
                  Não precisamos de acesso às suas chaves privadas ou informações pessoais para fornecer nosso serviço de monitoramento.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="tech-panel p-6 md:p-10 rounded-xl relative overflow-hidden mb-12">
            <div className="grid-pattern absolute inset-0 opacity-25"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-orbitron mb-4 satotrack-gradient-text">
                Comece a monitorar suas carteiras agora
              </h2>
              <p className="text-satotrack-text mb-8 text-lg">
                Tenha acesso a informações detalhadas sobre suas carteiras Bitcoin com apenas alguns cliques.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth">
                  <Button 
                    variant="neon" 
                    size="lg"
                    className="group"
                  >
                    Começar a Monitorar
                    <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/privacidade">
                  <Button 
                    variant="outline" 
                    size="lg"
                  >
                    Política de Privacidade
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

export default Sobre;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermosUso: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-dark">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="mb-6">
            <Link to="/landing">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-orbitron mb-6 text-center">
              <span className="satotrack-gradient-text">Termos de Uso</span>
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto bg-dashboard-medium/50 p-6 md:p-8 rounded-lg border border-satotrack-neon/10">
            <div className="space-y-6 text-satotrack-text">
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">1. Aceitação dos Termos</h2>
                <p className="mb-4">
                  Ao acessar e usar o SatoTrack, você aceita e concorda em estar vinculado aos termos e condições deste acordo. 
                  Se você não concorda com qualquer parte destes termos, não deve usar nossos serviços.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">2. Descrição do Serviço</h2>
                <p className="mb-4">
                  O SatoTrack é uma plataforma de monitoramento de endereços Bitcoin que oferece:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Monitoramento em tempo real de endereços Bitcoin</li>
                  <li>Análises de transações e saldos</li>
                  <li>Relatórios e alertas personalizados</li>
                  <li>API para integração com sistemas externos (plano Premium)</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">3. Conta de Usuário</h2>
                <p className="mb-4">
                  Para usar nossos serviços, você deve:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Manter a segurança de sua conta</li>
                  <li>Ser responsável por todas as atividades em sua conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">4. Uso Aceitável</h2>
                <p className="mb-4">
                  Você concorda em NÃO usar nossos serviços para:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Atividades ilegais ou não autorizadas</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Transmitir vírus ou códigos maliciosos</li>
                  <li>Interferir no funcionamento da plataforma</li>
                  <li>Tentar acessar dados de outros usuários</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">5. Planos e Pagamentos</h2>
                <p className="mb-4">
                  Os planos Premium são cobrados mensalmente. O cancelamento pode ser feito a qualquer momento, 
                  mas não há reembolso parcial do período já pago.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">6. Limitação de Responsabilidade</h2>
                <p className="mb-4">
                  O SatoTrack não se responsabiliza por:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Perdas financeiras decorrentes do uso da plataforma</li>
                  <li>Decisões de investimento baseadas em nossos dados</li>
                  <li>Interrupções temporárias do serviço</li>
                  <li>Dados de terceiros (blockchains, APIs externas)</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">7. Modificações</h2>
                <p className="mb-4">
                  Reservamos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-orbitron mb-4 text-white">8. Contato</h2>
                <p className="mb-4">
                  Para questões relacionadas aos termos de uso, entre em contato através dos nossos canais oficiais.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermosUso;

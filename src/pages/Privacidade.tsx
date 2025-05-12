
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Privacidade: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-dark">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-orbitron mb-6 text-center">
            <span className="satotrack-gradient-text">Política de Privacidade</span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-12 bg-dashboard-medium/50 p-6 md:p-8 rounded-lg border border-satotrack-neon/10">
            <h2 className="text-xl font-orbitron mb-4 text-white">Introdução</h2>
            <p className="text-satotrack-text mb-6">
              A SatoTrack está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações quando você utiliza nossa plataforma de monitoramento de endereços Bitcoin.
            </p>
            
            <h2 className="text-xl font-orbitron mb-4 text-white">Coleta de Dados</h2>
            <p className="text-satotrack-text mb-3">
              Coletamos as seguintes informações:
            </p>
            <ul className="list-disc pl-6 mb-6 text-satotrack-text">
              <li>Endereços de carteiras Bitcoin para monitoramento (informação pública da blockchain)</li>
              <li>Endereço de e-mail para autenticação</li>
              <li>Dados de uso da plataforma para melhorar nossos serviços</li>
            </ul>
            
            <h2 className="text-xl font-orbitron mb-4 text-white">Uso de Dados</h2>
            <p className="text-satotrack-text mb-6">
              Utilizamos seus dados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 mb-6 text-satotrack-text">
              <li>Fornecer serviços de monitoramento de endereços Bitcoin</li>
              <li>Autenticar seu acesso à plataforma</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Enviar notificações relacionadas à sua conta ou atividades em endereços monitorados</li>
            </ul>
            
            <h2 className="text-xl font-orbitron mb-4 text-white">Proteção de Dados</h2>
            <p className="text-satotrack-text mb-6">
              A SatoTrack implementa medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Nunca solicitamos chaves privadas ou informações sensíveis relacionadas às suas carteiras Bitcoin.
            </p>
            
            <h2 className="text-xl font-orbitron mb-4 text-white">Compartilhamento de Dados</h2>
            <p className="text-satotrack-text mb-6">
              Não compartilhamos seus dados com terceiros, exceto quando:
            </p>
            <ul className="list-disc pl-6 mb-6 text-satotrack-text">
              <li>Exigido por lei</li>
              <li>Necessário para proteger nossos direitos</li>
              <li>Com seu consentimento explícito</li>
            </ul>
            
            <h2 className="text-xl font-orbitron mb-4 text-white">Contato</h2>
            <p className="text-satotrack-text mb-6">
              Para questões relacionadas à privacidade, entre em contato através de nossos canais oficiais.
            </p>
            
            <div className="text-center mt-8">
              <Link to="/sobre">
                <Button 
                  variant="outline"
                  className="border border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10 hover:shadow-[0_0_12px_rgba(0,255,194,0.6)] transition-all duration-300 flex items-center gap-2 px-6 py-2 rounded-md"
                >
                  Voltar para Sobre
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacidade;

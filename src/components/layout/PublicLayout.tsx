import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogIn, Info, Shield } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dashboard-dark">
      {/* Public Header */}
      <header className="bg-dashboard-dark/95 backdrop-blur-sm border-b border-satotrack-neon/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
                alt="SatoTrack Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-orbitron text-xl font-bold satotrack-gradient-text">
                SatoTracker
              </span>
            </Link>

            {/* Public Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/home">
                <Button variant="ghost" size="sm" className="text-satotrack-text hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/sobre">
                <Button variant="ghost" size="sm" className="text-satotrack-text hover:text-white">
                  <Info className="h-4 w-4 mr-2" />
                  Sobre
                </Button>
              </Link>
              <Link to="/privacidade">
                <Button variant="ghost" size="sm" className="text-satotrack-text hover:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacidade
                </Button>
              </Link>
            </nav>

            {/* Auth Button */}
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black hover:from-satotrack-neon/90 hover:to-emerald-400/90 font-semibold"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="bg-dashboard-dark border-t border-satotrack-neon/10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">SatoTracker</h3>
              <p className="text-satotrack-text text-sm">
                Plataforma completa para envio, recebimento e gestão de criptoativos com segurança total.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links Úteis</h4>
              <div className="space-y-2">
                <Link to="/sobre" className="block text-satotrack-text hover:text-satotrack-neon text-sm">
                  Sobre nós
                </Link>
                <Link to="/privacidade" className="block text-satotrack-text hover:text-satotrack-neon text-sm">
                  Política de Privacidade
                </Link>
                <Link to="/termos" className="block text-satotrack-text hover:text-satotrack-neon text-sm">
                  Termos de Uso
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <p className="text-satotrack-text text-sm">
                contato@satotracker.com
              </p>
            </div>
          </div>
          <div className="border-t border-satotrack-neon/10 mt-8 pt-8 text-center">
            <p className="text-satotrack-text text-sm">
              © 2025 SatoTracker. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
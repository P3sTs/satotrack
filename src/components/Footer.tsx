
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-satotrack-neon/10 bg-dashboard-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png" 
              alt="SatoTrack Logo" 
              className="h-5 w-5 object-contain satotrack-logo"
            />
            <span className="font-orbitron font-semibold text-lg">
              <span className="satotrack-gradient-text">SatoTrack</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0 text-sm text-satotrack-text">
            <Link to="/" className="hover:text-satotrack-neon transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-satotrack-neon transition-colors">Dashboard</Link>
            <Link to="/auth" className="hover:text-satotrack-neon transition-colors">Login</Link>
            <Link to="/sobre" className="hover:text-satotrack-neon transition-colors">Sobre</Link>
            <Link to="/privacidade" className="hover:text-satotrack-neon transition-colors">Privacidade</Link>
          </div>
          
          <div className="flex space-x-3">
            <a 
              href="https://t.me/No_dts" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5 transition-all" 
              aria-label="Telegram"
            >
              <MessageCircle className="h-4 w-4 text-satotrack-neon" />
            </a>
            <a 
              href="https://instagram.com/dantas_dts" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5 transition-all" 
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 text-satotrack-neon" />
            </a>
            <a 
              href="https://github.com/no_dts" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5 transition-all" 
              aria-label="Github"
            >
              <Github className="h-4 w-4 text-satotrack-neon" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-satotrack-text">
          <p>© {new Date().getFullYear()} SatoTrack. <span>Sistema avançado de monitoramento de transações blockchain.</span></p>
          <p className="mt-1">
            <span className="inline-block h-2 w-2 rounded-full bg-satotrack-neon mr-2 animate-pulse-slow"></span>
            Acompanhando transações em tempo real com alta precisão
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

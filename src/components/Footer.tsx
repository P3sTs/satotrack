
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 md:py-6 border-t border-satotrack-neon/10 bg-dashboard-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/38e6a9b2-5057-4fb3-8835-2e5e079b117f.png" 
              alt="SatoTrack Logo" 
              className="h-5 w-5 object-contain satotrack-logo"
            />
            <span className="font-orbitron font-semibold text-base md:text-lg">
              <span className="satotrack-gradient-text">SatoTrack</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2 mb-4 md:mb-0 text-xs md:text-sm text-satotrack-text">
            <Link to="/" className="hover:text-satotrack-neon transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-satotrack-neon transition-colors">Dashboard</Link>
            <Link to="/auth" className="hover:text-satotrack-neon transition-colors">Login</Link>
            <Link to="/sobre" className="hover:text-satotrack-neon transition-colors">Quem Somos</Link>
            <Link to="/privacidade" className="hover:text-satotrack-neon transition-colors">Política</Link>
          </div>
          
          <div className="flex gap-3">
            <a 
              href="https://t.me/No_dts" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 rounded-full border border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5 transition-all" 
              aria-label="Telegram"
            >
              <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-satotrack-neon" />
            </a>
            <a 
              href="https://instagram.com/dantas_dts" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 rounded-full border border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5 transition-all" 
              aria-label="Instagram"
            >
              <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4 text-satotrack-neon" />
            </a>
            <a 
              href="https://github.com/no_dts" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 rounded-full border border-satotrack-neon/20 hover:border-satotrack-neon/60 hover:bg-satotrack-neon/5 transition-all" 
              aria-label="Github"
            >
              <Github className="h-3.5 w-3.5 md:h-4 md:w-4 text-satotrack-neon" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 md:mt-6 text-center text-xs md:text-xs text-satotrack-text">
          <p>© {new Date().getFullYear()} SatoTrack. <span className="hidden sm:inline">SatoTrack: sua visão clara do mercado de criptomoedas 🇧🇷💰</span></p>
          <p className="mt-1">
            <span className="inline-block h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-satotrack-neon mr-1 md:mr-2 animate-pulse-slow"></span>
            Gerencie. Acompanhe. Cresça.
          </p>
          <p className="mt-2 text-satotrack-neon">Feito com ❤️🇧🇷</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

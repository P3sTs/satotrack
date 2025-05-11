
import React from 'react';
import { Bitcoin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Bitcoin className="h-5 w-5 text-bitcoin" />
            <span className="font-semibold text-lg">SatoTrack</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SatoTrack. Monitoramento moderno e inteligente de carteiras Bitcoin.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

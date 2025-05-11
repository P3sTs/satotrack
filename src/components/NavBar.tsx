
import React from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';

const NavBar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-10 w-full bg-card/80 backdrop-blur-sm border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Bitcoin className="h-6 w-6 text-bitcoin" />
          <span className="font-bold text-xl tracking-tight">Bitcoin Folio</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/nova-carteira" 
            className="px-4 py-2 rounded-lg bg-bitcoin hover:bg-bitcoin-dark text-white transition-colors"
          >
            Nova Carteira
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

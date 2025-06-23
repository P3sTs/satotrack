
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Plus, BarChart3 } from 'lucide-react';

const MobileBottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dashboard-dark border-t border-dashboard-medium/30 md:hidden z-40">
      <div className="flex justify-around items-center h-16 px-2">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            isActive('/dashboard') 
              ? 'text-satotrack-neon' 
              : 'text-satotrack-text hover:text-satotrack-neon'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link
          to="/carteiras"
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            isActive('/carteiras') 
              ? 'text-satotrack-neon' 
              : 'text-satotrack-text hover:text-satotrack-neon'
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs">Carteiras</span>
        </Link>
        
        <Link
          to="/nova-carteira"
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            isActive('/nova-carteira') 
              ? 'text-satotrack-neon' 
              : 'text-satotrack-text hover:text-satotrack-neon'
          }`}
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs">Adicionar</span>
        </Link>
        
        <Link
          to="/mercado"
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            isActive('/mercado') 
              ? 'text-satotrack-neon' 
              : 'text-satotrack-text hover:text-satotrack-neon'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Mercado</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;

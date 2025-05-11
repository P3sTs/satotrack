
import React, { useState, useEffect } from 'react';
import { useCarteiras } from '../contexts/CarteirasContext';
import CarteiraCard from '../components/CarteiraCard';
import SortControls from '../components/SortControls';
import { Bitcoin, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewWalletModal from '../components/NewWalletModal';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { 
    carteiras, 
    ordenarCarteiras, 
    sortOption, 
    sortDirection,
    isLoading,
    carteiraPrincipal
  } = useCarteiras();
  
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const [principalCarteira, setCarteiraPrincipal] = useState<typeof carteiras[0] | null>(null);
  const [outrasCarteiras, setOutrasCarteiras] = useState<typeof carteiras>([]);
  
  // Separar a carteira principal das outras
  useEffect(() => {
    if (carteiraPrincipal && carteiras.length) {
      const principal = carteiras.find(c => c.id === carteiraPrincipal) || null;
      const outras = carteiras.filter(c => c.id !== carteiraPrincipal);
      
      setCarteiraPrincipal(principal);
      setOutrasCarteiras(outras);
    } else {
      setCarteiraPrincipal(null);
      setOutrasCarteiras(carteiras);
    }
  }, [carteiras, carteiraPrincipal]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitore todas as suas carteiras Bitcoin</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsNewWalletModalOpen(true)}
            className="bg-bitcoin hover:bg-bitcoin-dark text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Carteira
          </Button>
          
          <Link to="/carteiras">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Gerenciar</span>
            </Button>
          </Link>
          
          <SortControls 
            sortOption={sortOption}
            sortDirection={sortDirection}
            onSort={ordenarCarteiras}
          />
        </div>
      </div>
      
      {/* Carteira Principal */}
      {principalCarteira && (
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl font-medium mb-3 md:mb-4">Carteira Principal</h2>
          <div className="max-w-full lg:max-w-2xl">
            <CarteiraCard
              carteira={principalCarteira}
              isPrimary={true}
            />
          </div>
        </div>
      )}
      
      {/* Lista de Carteiras */}
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-3 md:mb-4">
          {principalCarteira ? 'Carteiras Monitoradas' : 'Todas as Carteiras'}
        </h2>
      
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bitcoin-card animate-pulse p-4 md:p-6">
                <div className="h-5 md:h-6 bg-muted rounded w-1/3 mb-3 md:mb-4"></div>
                <div className="h-3 md:h-4 bg-muted rounded w-full mb-4 md:mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-6 md:h-8 bg-muted rounded w-1/3"></div>
                  <div className="h-5 md:h-6 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : carteiras.length === 0 ? (
          <div className="text-center p-6 md:p-12 border border-dashed border-border rounded-lg">
            <Bitcoin className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
            <h3 className="text-lg md:text-xl font-medium mb-2">Nenhuma carteira adicionada</h3>
            <p className="text-muted-foreground mb-4 md:mb-6">Adicione uma carteira Bitcoin para começar a monitorá-la</p>
            <Button 
              onClick={() => setIsNewWalletModalOpen(true)}
              className="inline-flex items-center gap-2 bg-bitcoin hover:bg-bitcoin-dark text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar Carteira
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {outrasCarteiras.map(carteira => (
              <CarteiraCard key={carteira.id} carteira={carteira} isPrimary={false} />
            ))}
          </div>
        )}
      </div>
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

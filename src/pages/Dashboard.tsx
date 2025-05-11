
import React, { useEffect } from 'react';
import { useCarteiras } from '../contexts/CarteirasContext';
import CarteiraCard from '../components/CarteiraCard';
import SortControls from '../components/SortControls';
import { Bitcoin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { 
    carteiras, 
    ordenarCarteiras, 
    sortOption, 
    sortDirection,
    isLoading
  } = useCarteiras();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitore todas as suas carteiras Bitcoin</p>
        </div>
        
        <SortControls 
          sortOption={sortOption}
          sortDirection={sortDirection}
          onSort={ordenarCarteiras}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bitcoin-card animate-pulse p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-6"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : carteiras.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-border rounded-lg">
          <Bitcoin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Nenhuma carteira adicionada</h3>
          <p className="text-muted-foreground mb-6">Adicione uma carteira Bitcoin para começar a monitorá-la</p>
          <Link 
            to="/nova-carteira" 
            className="inline-flex items-center px-4 py-2 rounded-lg bg-bitcoin hover:bg-bitcoin-dark text-white transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Carteira
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carteiras.map(carteira => (
            <CarteiraCard key={carteira.id} carteira={carteira} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

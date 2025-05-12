
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarteiras } from '../contexts/carteiras';
import { CarteiraBTC } from '../types/types';
import { ReportGenerator } from '@/components/monetization/ReportGenerator';
import { useAuth } from '@/contexts/auth';
import { Advertisement } from '@/components/monetization/Advertisement';
import { useIsMobile } from '@/hooks/use-mobile';

const CarteiraDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const { carteiras } = useCarteiras();
  const [carteira, setCarteira] = useState<CarteiraBTC | null>(null);
  const { userPlan, user } = useAuth();
  const showAds = userPlan === 'free';
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    
    if (id && carteiras.length > 0) {
      const selectedCarteira = carteiras.find((c) => c.id.toString() === id);
      if (selectedCarteira) {
        setCarteira(selectedCarteira);
      } else {
        // If wallet is not found in user's wallets, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [id, carteiras, navigate, user]);

  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-dashboard-medium rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-dashboard-medium rounded col-span-2"></div>
                <div className="h-4 bg-dashboard-medium rounded col-span-1"></div>
              </div>
              <div className="h-4 bg-dashboard-medium rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{carteira.nome}</h1>
            
            <div className="bg-card p-4 md:p-6 rounded-lg border mb-4 md:mb-6">
              <h2 className="text-lg font-semibold mb-3 md:mb-4">Detalhes da Carteira</h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Endereço</p>
                  <p className="font-mono text-xs md:text-sm break-all">{carteira.endereco}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Saldo</p>
                    <p className="font-bold text-lg md:text-xl">{carteira.saldo} BTC</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Transações</p>
                    <p>{carteira.qtde_transacoes}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Recebido</p>
                    <p>{carteira.total_entradas} BTC</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Enviado</p>
                    <p>{carteira.total_saidas} BTC</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Existing Chart Components */}
            {/* Conteúdo original da página aqui */}
            
            {showAds && (
              <Advertisement position="panel" className="mt-4 md:mt-6" />
            )}
          </div>
        </div>
        
        <div className={`space-y-4 md:space-y-6 ${isMobile ? 'mt-4' : ''}`}>
          <ReportGenerator carteira={carteira} />
          
          {/* Existing sidebar components */}
          {/* Outros componentes originais da sidebar aqui */}
          
          {showAds && (
            <Advertisement position="sidebar" />
          )}
        </div>
      </div>
    </div>
  );
}

export default CarteiraDetalhes;

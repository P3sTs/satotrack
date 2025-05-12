
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarteiras } from '../contexts/hooks/useCarteirasContext';
import { CarteiraBTC } from '../types/types';
import { ReportGenerator } from '@/components/monetization/ReportGenerator';
import { useAuth } from '@/contexts/auth';
import { Advertisement } from '@/components/monetization/Advertisement';

const CarteiraDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const { carteiras } = useCarteiras();
  const [carteira, setCarteira] = useState<CarteiraBTC | null>(null);
  const { userPlan } = useAuth();
  const showAds = userPlan === 'free';
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id && carteiras.length > 0) {
      const selectedCarteira = carteiras.find((c) => c.id.toString() === id);
      if (selectedCarteira) {
        setCarteira(selectedCarteira);
      } else {
        // If wallet is not found in user's wallets, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [id, carteiras, navigate]);

  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Carregando detalhes da carteira...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-6">{carteira.nome}</h1>
            
            <div className="bg-card p-6 rounded-lg border mb-6">
              <h2 className="text-lg font-semibold mb-4">Detalhes da Carteira</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                  <p className="font-mono text-sm break-all">{carteira.endereco}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saldo</p>
                    <p className="font-bold text-xl">{carteira.saldo} BTC</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transações</p>
                    <p>{carteira.qtde_transacoes}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Recebido</p>
                    <p>{carteira.total_entradas} BTC</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Enviado</p>
                    <p>{carteira.total_saidas} BTC</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Existing Chart Components */}
            {/* Conteúdo original da página aqui */}
            
            {showAds && (
              <Advertisement position="panel" className="mt-6" />
            )}
          </div>
        </div>
        
        <div className="space-y-6">
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

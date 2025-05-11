
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCarteiras } from '../contexts/CarteirasContext';
import { formatarBTC, formatarData } from '../utils/formatters';
import TransacoesList from '../components/TransacoesList';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  RefreshCw, 
  Bitcoin, 
  Calendar, 
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const CarteiraDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    carteiras, 
    transacoes, 
    atualizarCarteira, 
    carregarTransacoes, 
    removerCarteira,
    isUpdating 
  } = useCarteiras();
  const [loadingTxs, setLoadingTxs] = useState(false);
  
  const carteira = carteiras.find(c => c.id === id);
  
  useEffect(() => {
    const loadData = async () => {
      if (id && carteira && !transacoes[id]) {
        setLoadingTxs(true);
        await carregarTransacoes(id);
        setLoadingTxs(false);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, carteira]);
  
  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center p-6 md:p-12 border border-dashed border-border rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Carteira não encontrada</h2>
          <p className="text-muted-foreground mb-6">A carteira que você está procurando não existe ou foi removida.</p>
          <Link to="/" className="text-bitcoin hover:underline">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAtualizarCarteira = async () => {
    await atualizarCarteira(carteira.id);
  };
  
  const handleRemoverCarteira = () => {
    removerCarteira(carteira.id);
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 break-all">
              <Bitcoin className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0 text-bitcoin" />
              <span className="truncate">{carteira.nome}</span>
            </h1>
            <p className="text-xs md:text-sm font-mono text-muted-foreground mt-1 break-all">{carteira.endereco}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={!!isUpdating[carteira.id]}
              onClick={handleAtualizarCarteira}
              className="w-full sm:w-auto"
            >
              {isUpdating[carteira.id] ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Atualizar agora
            </Button>
            
            <Button 
              variant="destructive"
              onClick={handleRemoverCarteira}
              className="w-full sm:w-auto"
            >
              Remover carteira
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bitcoin-card p-4 md:p-5">
          <p className="text-xs text-muted-foreground mb-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Última atualização
          </p>
          <p className="text-sm">{formatarData(carteira.ultimo_update)}</p>
        </div>
        
        <div className="bitcoin-card p-4 md:p-5">
          <p className="text-xs text-muted-foreground mb-1 flex items-center">
            <ChevronUp className="h-3 w-3 mr-1 text-green-500" />
            Total recebido
          </p>
          <p className="font-medium text-green-500">{formatarBTC(carteira.total_entradas)}</p>
        </div>
        
        <div className="bitcoin-card p-4 md:p-5">
          <p className="text-xs text-muted-foreground mb-1 flex items-center">
            <ChevronDown className="h-3 w-3 mr-1 text-red-500" />
            Total enviado
          </p>
          <p className="font-medium text-red-500">{formatarBTC(carteira.total_saidas)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bitcoin-card p-4 md:p-5 col-span-1">
          <h3 className="text-lg font-semibold mb-3 md:mb-4">Saldo atual</h3>
          <p className="text-2xl md:text-3xl font-bold bitcoin-gradient-text">{formatarBTC(carteira.saldo)}</p>
        </div>
        
        <div className="bitcoin-card p-4 md:p-5 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Informações</h3>
            <span className="bg-muted px-2 py-1 text-xs rounded-full">
              {carteira.qtde_transacoes} transações
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total de entradas</p>
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                <p className="text-sm md:text-base">{formatarBTC(carteira.total_entradas)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total de saídas</p>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
                <p className="text-sm md:text-base">{formatarBTC(carteira.total_saidas)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold mb-4">Transações Recentes</h2>
        <div className="overflow-x-auto">
          <TransacoesList 
            transacoes={transacoes[carteira.id] || []} 
            isLoading={loadingTxs} 
          />
        </div>
      </div>
    </div>
  );
};

export default CarteiraDetalhes;


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCarteiras } from '../contexts/CarteirasContext';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { formatarDataHora, formatarBTC } from '../utils/formatters';
import TransacoesList from '../components/TransacoesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { loadTransacoes } from '../services/carteiras/transacoesService';
import { TransacaoBTC } from '../types/types';
import WalletEditor from '../components/wallet/WalletEditor';
import DeleteWalletDialog from '../components/wallet/DeleteWalletDialog';
import InteractiveChart from '@/components/charts/InteractiveChart';

const CarteiraDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { carteiras, isLoading, removerCarteira, atualizarNomeCarteira, definirCarteiraPrincipal, carteiraPrincipal } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [transacoes, setTransacoes] = useState<TransacaoBTC[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const carteira = carteiras.find(c => c.id === id);

  useEffect(() => {
    if (id) {
      const carregarTransacoes = async () => {
        const txs = await loadTransacoes(id);
        setTransacoes(txs);
      };
      
      carregarTransacoes();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-satotrack-neon"></div>
        </div>
      </div>
    );
  }

  if (!carteira) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Carteira não encontrada</h2>
          <Button onClick={() => navigate('/carteiras')}>Voltar para Carteiras</Button>
        </div>
      </div>
    );
  }

  const handleDeleteWallet = async () => {
    await removerCarteira(id!);
    navigate('/carteiras');
  };

  const handleUpdateName = async (newName: string) => {
    await atualizarNomeCarteira(id!, newName);
    setIsEditMode(false);
  };

  const handleSetAsPrimary = async () => {
    await definirCarteiraPrincipal(id!);
  };

  const valorEmUSD = carteira.saldo * (bitcoinData?.price_usd || 0);
  const valorEmBRL = carteira.saldo * (bitcoinData?.price_brl || 0);
  const isPrincipal = carteiraPrincipal === carteira.id;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground" 
          onClick={() => navigate('/carteiras')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Voltar para Carteiras</span>
        </Button>
      </div>

      {/* Wallet header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          {isEditMode ? (
            <WalletEditor 
              initialName={carteira.nome} 
              onSave={handleUpdateName} 
              onCancel={() => setIsEditMode(false)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold">
                {carteira.nome}
                {isPrincipal && (
                  <span className="inline-flex ml-2 items-center px-2 py-1 rounded-full text-xs font-medium bg-satotrack-neon/20 text-satotrack-neon">
                    Principal
                  </span>
                )}
              </h1>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsEditMode(true)} 
                className="h-8 w-8 rounded-full hover:bg-background"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground break-all">
            <span>{carteira.endereco}</span>
            <a 
              href={`https://www.blockchain.com/explorer/addresses/btc/${carteira.endereco}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-satotrack-neon/80 hover:text-satotrack-neon"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isPrincipal && (
            <Button 
              variant="outline" 
              onClick={handleSetAsPrimary}
            >
              Definir como Principal
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Apagar
          </Button>
        </div>
      </div>
      
      {/* Wallet balance summary card */}
      <div className="bitcoin-card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-muted-foreground mb-1">Saldo Total</h2>
            <div className="text-3xl md:text-4xl font-semibold font-mono">
              {formatarBTC(carteira.saldo)}
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-muted-foreground text-sm">
              <div>
                <span>≈ USD {valorEmUSD.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span>≈ R$ {valorEmBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 md:text-right">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Transações</div>
              <div className="text-xl md:text-2xl font-mono">{carteira.qtde_transacoes}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Recebido</div>
              <div className="text-xl md:text-2xl font-mono text-green-500">{formatarBTC(carteira.total_entradas)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Enviado</div>
              <div className="text-xl md:text-2xl font-mono text-red-500">{formatarBTC(carteira.total_saidas)}</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mt-4 text-right">
          Atualizado em: {formatarDataHora(carteira.ultimo_update)}
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Análise de Dados</h2>
        <div className="bitcoin-card p-6">
          <InteractiveChart bitcoinData={bitcoinData} walletId={id} />
        </div>
      </div>
      
      {/* Transactions section */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transações</h2>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="received">Recebidas</TabsTrigger>
            <TabsTrigger value="sent">Enviadas</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <TransacoesList transacoes={transacoes} />
        </TabsContent>
        
        <TabsContent value="received" className="mt-0">
          <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'entrada')} />
        </TabsContent>
        
        <TabsContent value="sent" className="mt-0">
          <TransacoesList transacoes={transacoes.filter(tx => tx.tipo === 'saida')} />
        </TabsContent>
      </Tabs>
      
      <DeleteWalletDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onDelete={handleDeleteWallet}
        walletName={carteira.nome}
      />
    </div>
  );
};

export default CarteiraDetalhes;

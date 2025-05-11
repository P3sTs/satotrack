
import React from 'react';
import { TransacaoBTC } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CardViewProps {
  transacoes: TransacaoBTC[];
}

const TransactionCard: React.FC<{ transaction: TransacaoBTC }> = ({ transaction }) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
      duration: 2000,
    });
  };
  
  return (
    <Card className={`overflow-hidden border-l-4 ${
      transaction.tipo === 'entrada' ? 'border-l-green-500' : 'border-l-red-500'
    } hover:shadow-md transition-all duration-200`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex justify-between">
          <span>
            {transaction.tipo === 'entrada' ? (
              <div className="flex items-center gap-1 text-green-500">
                <ArrowDownIcon className="h-4 w-4" />
                <span>Recebido</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-500">
                <ArrowUpIcon className="h-4 w-4" />
                <span>Enviado</span>
              </div>
            )}
          </span>
          <span className={`${
            transaction.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatBitcoinValue(transaction.valor)}
          </span>
        </CardTitle>
        <CardDescription>{formatDate(transaction.data)}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Endereço: </span>
            <span className="font-mono text-xs break-all">{transaction.endereco}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">TxID: </span>
            <span className="font-mono text-xs truncate block">{transaction.hash}</span>
          </div>
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => copyToClipboard(transaction.hash, "ID da transação")}
            >
              <CopyIcon className="h-3.5 w-3.5 mr-1" />
              Copiar TxID
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              asChild
            >
              <a 
                href={`https://mempool.space/tx/${transaction.hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Ver no Explorer
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CardView: React.FC<CardViewProps> = ({ transacoes }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Transações</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transacoes.length === 0 ? (
          <Card className="col-span-full p-8">
            <div className="text-center text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          </Card>
        ) : (
          transacoes.map(transaction => (
            <TransactionCard key={transaction.hash} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
};

export default CardView;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, ArrowRight, RefreshCw, Star, Trash2 } from 'lucide-react';
import { CarteiraBTC } from '../types/types';
import { formatBitcoinValue, formatDate } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import { useCarteiras } from '../contexts/CarteirasContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CarteiraCardProps {
  carteira: CarteiraBTC;
  isPrimary?: boolean;
}

const CarteiraCard: React.FC<CarteiraCardProps> = ({ carteira, isPrimary = false }) => {
  const { atualizarCarteira, isUpdating, removerCarteira, definirCarteiraPrincipal, carteiraPrincipal } = useCarteiras();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAtualizar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await atualizarCarteira(carteira.id);
  };

  const handleDelete = async () => {
    await removerCarteira(carteira.id);
    setIsDeleteDialogOpen(false);
  };

  const togglePrimary = () => {
    if (carteiraPrincipal === carteira.id) {
      definirCarteiraPrincipal(null);
    } else {
      definirCarteiraPrincipal(carteira.id);
    }
  };

  return (
    <>
      <div className={`bitcoin-card transition-all ${isPrimary ? 'ring-2 ring-bitcoin' : ''}`}>
        <div className="p-4 md:p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4 md:h-5 md:w-5 text-bitcoin" />
              <h3 className="font-semibold text-base md:text-lg line-clamp-1">{carteira.nome}</h3>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={togglePrimary}>
                  <Star className="h-4 w-4 mr-2" />
                  {carteiraPrincipal === carteira.id ? 'Remover como Principal' : 'Definir como Principal'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Carteira
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mb-4 md:mb-6">
            <p className="text-xs text-muted-foreground mb-1">Endereço</p>
            <p className="text-xs md:text-sm font-mono truncate">{carteira.endereco}</p>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Saldo</p>
              <p className="text-xl md:text-2xl font-bold bitcoin-gradient-text">{formatBitcoinValue(carteira.saldo)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
              <p className="text-xs md:text-sm">{formatDate(carteira.ultimo_update)}</p>
            </div>
          </div>
        </div>
        
        <div className="p-2 md:p-3 bg-muted/30 border-t border-border/50 flex flex-wrap md:flex-nowrap justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={!!isUpdating[carteira.id]}
            onClick={handleAtualizar}
          >
            {isUpdating[carteira.id] ? (
              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 h-3 w-3" />
            )}
            Atualizar
          </Button>
          
          <Link to={`/carteira/${carteira.id}`} className="w-full md:w-auto">
            <Button variant="ghost" size="sm" className="text-xs w-full">
              Ver detalhes
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] md:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover carteira?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Esta carteira será removida do seu monitoramento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="w-full sm:w-auto bg-destructive text-destructive-foreground">
              Sim, remover carteira
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CarteiraCard;

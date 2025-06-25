
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Carteira {
  id: string;
  nome: string;
}

interface WalletDetailHeaderProps {
  carteira: Carteira;
  isDeleting: boolean;
  onDelete: () => void;
}

export const WalletDetailHeader: React.FC<WalletDetailHeaderProps> = ({
  carteira,
  isDeleting,
  onDelete
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="mr-3"
                asChild
              >
                <Link to="/carteiras">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Voltar para carteiras</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <h1 className="text-2xl font-bold">{carteira.nome}</h1>
      </div>
      
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                className="h-9"
                asChild
              >
                <Link to={`/carteira/${carteira.id}/editar`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar informações da carteira</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive"
                className="h-9"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Removendo..." : "Remover"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remover esta carteira</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

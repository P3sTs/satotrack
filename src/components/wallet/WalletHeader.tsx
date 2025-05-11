
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CarteiraBTC } from '@/types/types';
import WalletEditor from './WalletEditor';

interface WalletHeaderProps {
  carteira: CarteiraBTC;
  isPrincipal: boolean;
  onSetAsPrimary: () => void;
  onUpdateName: (newName: string) => Promise<void>;
  onDelete: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({
  carteira,
  isPrincipal,
  onSetAsPrimary,
  onUpdateName,
  onDelete
}) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
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
              onSave={onUpdateName} 
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
              onClick={onSetAsPrimary}
            >
              Definir como Principal
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Apagar
          </Button>
        </div>
      </div>
    </>
  );
};

export default WalletHeader;

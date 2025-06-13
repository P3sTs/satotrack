import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, Loader2 } from 'lucide-react';
import { useCarteiras } from '../contexts/carteiras';
import { useAuth } from '@/contexts/auth';

interface NewWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import DuplicateWalletChecker from './validation/DuplicateWalletChecker';
import { useActionFeedback } from './feedback/ActionFeedback';

const NewWalletModal: React.FC<NewWalletModalProps> = ({ isOpen, onClose }) => {
  const [endereco, setEndereco] = useState('');
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  
  const { adicionarCarteira } = useCarteiras();
  const { userPlan } = useAuth();
  const { showSuccess, showError } = useActionFeedback();

  const reset = () => {
    setEndereco('');
    setNome('');
    setIsLoading(false);
    setIsDuplicate(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDuplicate) {
      showError('❌ Não é possível cadastrar uma carteira duplicada');
      return;
    }

    if (!endereco.trim() || !nome.trim()) {
      showError('❌ Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    
    try {
      await adicionarCarteira(endereco.trim(), nome.trim());
      showSuccess('✅ Carteira adicionada com sucesso!');
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar carteira:', error);
      showError('❌ Erro ao adicionar carteira. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Nova Carteira Bitcoin
          </DialogTitle>
          <DialogDescription>
            Adicione uma carteira para monitoramento em tempo real
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço da Carteira *</Label>
            <Input
              id="endereco"
              placeholder="Ex: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className={isDuplicate ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            <DuplicateWalletChecker 
              address={endereco}
              onDuplicateFound={setIsDuplicate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Carteira *</Label>
            <Input
              id="nome"
              placeholder="Ex: Carteira Principal"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isDuplicate || !endereco.trim() || !nome.trim()}
              className="bg-bitcoin hover:bg-bitcoin-dark"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Carteira
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWalletModal;

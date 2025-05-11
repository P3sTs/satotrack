
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle } from "lucide-react";
import { useCarteiras } from '../contexts/CarteirasContext';
import { validarEnderecoBitcoin } from '../services/api';
import { toast } from '@/components/ui/sonner';

interface NewWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewWalletModal: React.FC<NewWalletModalProps> = ({ isOpen, onClose }) => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { adicionarCarteira } = useCarteiras();

  const enderecoValido = endereco ? validarEnderecoBitcoin(endereco) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error("Por favor, insira um nome para a carteira");
      return;
    }

    if (!enderecoValido) {
      toast.error("Endereço Bitcoin inválido");
      return;
    }

    setIsSubmitting(true);
    try {
      await adicionarCarteira(nome, endereco);
      setNome('');
      setEndereco('');
      toast.success("Carteira adicionada com sucesso!");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar carteira");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Nova Carteira Bitcoin
          </DialogTitle>
          <DialogDescription>
            Adicione uma carteira Bitcoin para monitorar seu saldo e transações
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Carteira</Label>
            <Input 
              id="nome" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Carteira Principal"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Bitcoin</Label>
            <Input 
              id="endereco" 
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Ex: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              disabled={isSubmitting}
            />
            
            {endereco && (
              <div className="flex items-center text-sm mt-1">
                {enderecoValido ? (
                  <p className="text-green-500 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Endereço válido
                  </p>
                ) : (
                  <p className="text-destructive flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Endereço inválido
                  </p>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-bitcoin hover:bg-bitcoin-dark"
            >
              {isSubmitting ? "Adicionando..." : "Salvar Carteira"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWalletModal;

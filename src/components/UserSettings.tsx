
import React, { useState, useEffect } from 'react';
import { Settings, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCarteiras } from '../contexts/CarteirasContext';
import { toast } from '@/components/ui/sonner';

const UserSettings: React.FC = () => {
  const { carteiras, definirCarteiraPrincipal, carteiraPrincipal } = useCarteiras();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(carteiraPrincipal);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedWallet(carteiraPrincipal);
  }, [carteiraPrincipal]);

  const handleSave = () => {
    try {
      definirCarteiraPrincipal(selectedWallet);
      toast.success("Preferências salvas com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar preferências");
    }
  };

  const handleRemovePrimary = () => {
    try {
      definirCarteiraPrincipal(null);
      setSelectedWallet(null);
      toast.success("Carteira principal removida");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao remover carteira principal");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Preferências</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Preferências do Usuário</SheetTitle>
          <SheetDescription>
            Configure suas preferências para personalizar sua experiência no SatoTrack
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <div className="mb-6">
            <Label className="text-base">Carteira Principal</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Selecione uma carteira para ser destacada no topo do dashboard
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {carteiras.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">
                  Nenhuma carteira adicionada ainda
                </p>
              ) : (
                carteiras.map((carteira) => (
                  <div 
                    key={carteira.id}
                    className={`flex items-center p-3 rounded-md cursor-pointer border transition-colors ${
                      selectedWallet === carteira.id 
                        ? "border-bitcoin bg-bitcoin/5" 
                        : "border-border hover:bg-accent"
                    }`}
                    onClick={() => setSelectedWallet(carteira.id)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{carteira.nome}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {carteira.endereco}
                      </p>
                    </div>
                    {selectedWallet === carteira.id && (
                      <Check className="h-4 w-4 text-bitcoin ml-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <SheetFooter className="flex sm:justify-between">
          <div>
            {selectedWallet && (
              <Button 
                variant="outline" 
                onClick={handleRemovePrimary}
              >
                Remover Carteira Principal
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button onClick={handleSave} className="bg-bitcoin hover:bg-bitcoin-dark">
              Salvar Preferências
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSettings;

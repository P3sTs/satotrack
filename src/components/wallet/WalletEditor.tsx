
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Save, X } from 'lucide-react';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { toast } from '@/components/ui/sonner';

interface WalletEditorProps {
  initialName: string;
  onSave?: (name: string) => void;
  onCancel?: () => void;
}

const WalletEditor: React.FC<WalletEditorProps> = ({ 
  initialName
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const { atualizarNomeCarteira } = useCarteiras();
  const carteira = useCarteiras().carteiras.find(c => c.nome === initialName);
  
  const handleStartEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (!carteira) return;
    
    if (!name.trim()) {
      toast.error('O nome da carteira não pode ficar em branco');
      return;
    }

    try {
      await atualizarNomeCarteira(carteira.id, name.trim());
      setIsEditing(false);
      toast.success('Nome da carteira atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar o nome da carteira');
      console.error(error);
    }
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <Label htmlFor="edit-name" className="sr-only">
            Nome da Carteira
          </Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da carteira"
            className="w-full"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleStartEdit}
      className="h-6 w-6 ml-1"
    >
      <Pencil className="h-3.5 w-3.5" />
    </Button>
  );
};

export default WalletEditor;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface WalletEditorProps {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const WalletEditor: React.FC<WalletEditorProps> = ({ 
  initialName, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState(initialName);
  
  const handleSave = () => {
    onSave(name);
  };
  
  return (
    <div className="flex items-center space-x-2 mb-4">
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
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WalletEditor;

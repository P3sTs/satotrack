
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewGoalModal: React.FC<NewGoalModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    goal_type: 'btc',
    target_date: undefined as Date | undefined
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.title || !formData.target_amount || !formData.target_date) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          title: formData.title,
          target_amount: parseFloat(formData.target_amount),
          current_amount: 0,
          goal_type: formData.goal_type,
          target_date: formData.target_date.toISOString().split('T')[0],
          status: 'active'
        });

      if (error) throw error;

      toast.success('Meta criada com sucesso!');
      onClose();
      setFormData({
        title: '',
        target_amount: '',
        goal_type: 'btc',
        target_date: undefined
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Erro ao criar meta');
    } finally {
      setLoading(false);
    }
  };

  const getAmountLabel = () => {
    switch (formData.goal_type) {
      case 'btc': return 'Bitcoin (BTC)';
      case 'usd': return 'Dólares (USD)';
      case 'brl': return 'Reais (BRL)';
      default: return 'Valor';
    }
  };

  const getAmountPlaceholder = () => {
    switch (formData.goal_type) {
      case 'btc': return '0.00000000';
      case 'usd': return '1000.00';
      case 'brl': return '5000.00';
      default: return '0.00';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🎯 Nova Meta Financeira</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Meta</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Ter 1 Bitcoin até dezembro"
              required
            />
          </div>

          <div>
            <Label htmlFor="goal_type">Tipo de Meta</Label>
            <Select value={formData.goal_type} onValueChange={(value) => setFormData({ ...formData, goal_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                <SelectItem value="brl">Reais (BRL)</SelectItem>
                <SelectItem value="usd">Dólares (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target_amount">Valor Alvo ({getAmountLabel()})</Label>
            <Input
              id="target_amount"
              type="number"
              step={formData.goal_type === 'btc' ? '0.00000001' : '0.01'}
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              placeholder={getAmountPlaceholder()}
              required
            />
          </div>

          <div>
            <Label>Data Limite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.target_date ? (
                    format(formData.target_date, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.target_date}
                  onSelect={(date) => setFormData({ ...formData, target_date: date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Criando...' : 'Criar Meta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGoalModal;

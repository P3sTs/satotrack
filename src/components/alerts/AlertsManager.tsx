import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Trash2, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

// Use the Supabase generated type instead of our local interface
type Alert = Tables<'user_alerts'>;

const AlertsManager: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    alert_type: 'balance' as const,
    condition: 'above' as const,
    threshold: 0,
    currency: 'BTC' as const,
    wallet_id: '',
    title: '',
    notification_methods: ['push']
  });

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      toast.error('Erro ao carregar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const createAlert = async () => {
    if (!newAlert.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .insert([{
          user_id: user?.id,
          ...newAlert,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setAlerts(prev => [data, ...prev]);
      setShowCreateForm(false);
      setNewAlert({
        alert_type: 'balance',
        condition: 'above',
        threshold: 0,
        currency: 'BTC',
        wallet_id: '',
        title: '',
        notification_methods: ['push']
      });
      toast.success('Alerta criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      toast.error('Erro ao criar alerta');
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_active: isActive } : alert
      ));
      
      toast.success(`Alerta ${isActive ? 'ativado' : 'desativado'}`);
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      toast.error('Erro ao atualizar alerta');
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alerta removido');
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
      toast.error('Erro ao remover alerta');
    }
  };

  const getAlertDescription = (alert: Alert) => {
    const thresholdText = alert.currency === 'BTC' 
      ? `${alert.threshold} BTC`
      : alert.currency === 'BRL'
      ? `R$ ${alert.threshold.toLocaleString('pt-BR')}`
      : `$ ${alert.threshold.toLocaleString('en-US')}`;

    const typeText = {
      balance: 'saldo',
      transaction: 'transação',
      price: 'preço do Bitcoin',
      volume: 'volume'
    }[alert.alert_type as 'balance' | 'transaction' | 'price' | 'volume'];

    const conditionText = {
      above: 'acima de',
      below: 'abaixo de',
      equals: 'igual a'
    }[alert.condition as 'above' | 'below' | 'equals'];

    return `Quando ${typeText} estiver ${conditionText} ${thresholdText}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando alertas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-satotrack-neon" />
            Alertas Personalizados ({alerts.length})
          </CardTitle>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-satotrack-neon hover:bg-satotrack-neon/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Alerta
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showCreateForm && (
          <Card className="bg-dashboard-medium border-satotrack-neon/20">
            <CardHeader>
              <CardTitle className="text-lg">Criar Novo Alerta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Alerta</Label>
                  <Input
                    id="title"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Saldo baixo, Grande recebimento..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert_type">Tipo de Alerta</Label>
                  <Select 
                    value={newAlert.alert_type} 
                    onValueChange={(value) => setNewAlert(prev => ({ ...prev, alert_type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balance">Saldo da Carteira</SelectItem>
                      <SelectItem value="transaction">Transação Recebida</SelectItem>
                      <SelectItem value="price">Preço do Bitcoin</SelectItem>
                      <SelectItem value="volume">Volume de Transações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condição</Label>
                  <Select 
                    value={newAlert.condition} 
                    onValueChange={(value) => setNewAlert(prev => ({ ...prev, condition: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Acima de</SelectItem>
                      <SelectItem value="below">Abaixo de</SelectItem>
                      <SelectItem value="equals">Igual a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Valor Limite</Label>
                  <div className="flex gap-2">
                    <Input
                      id="threshold"
                      type="number"
                      step="0.00000001"
                      value={newAlert.threshold}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00000000"
                    />
                    <Select 
                      value={newAlert.currency} 
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, currency: value as any }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="BRL">BRL</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createAlert} className="bg-satotrack-neon hover:bg-satotrack-neon/80">
                  Criar Alerta
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum alerta configurado ainda.</p>
            <p className="text-sm">Crie seu primeiro alerta para ser notificado sobre eventos importantes!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.is_active ? 'border-l-satotrack-neon' : 'border-l-gray-500'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getAlertDescription(alert)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${alert.is_active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                          {alert.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Criado em {new Date(alert.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.is_active}
                        onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsManager;

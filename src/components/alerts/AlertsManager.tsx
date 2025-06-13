import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useActionFeedback } from '@/components/feedback/ActionFeedback';
import { 
  Bell, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Trash2,
  Settings,
  Zap,
  Target,
  Activity
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  alert_type: 'balance' | 'transaction' | 'price' | 'volume';
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  currency: string;
  wallet_id?: string;
  is_active: boolean;
  notification_methods: string[];
  created_at: string;
}

const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useActionFeedback();

  // Novos alertas form
  const [newAlert, setNewAlert] = useState({
    title: '',
    alert_type: 'price' as const,
    condition: 'above' as const,
    threshold: 0,
    currency: 'BTC',
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
      
      // Cast the data to ensure proper typing
      const typedAlerts = (data || []).map(alert => ({
        ...alert,
        alert_type: alert.alert_type as 'balance' | 'transaction' | 'price' | 'volume',
        condition: alert.condition as 'above' | 'below' | 'equals'
      }));
      
      setAlerts(typedAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      showError('Erro ao carregar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const createAlert = async () => {
    if (!newAlert.title || !newAlert.threshold) {
      showError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('user_alerts')
        .insert({
          user_id: user?.id,
          title: newAlert.title,
          alert_type: newAlert.alert_type,
          condition: newAlert.condition,
          threshold: newAlert.threshold,
          currency: newAlert.currency,
          notification_methods: newAlert.notification_methods
        });

      if (error) throw error;

      showSuccess('🚨 Alerta criado com sucesso!');
      setNewAlert({
        title: '',
        alert_type: 'price',
        condition: 'above',
        threshold: 0,
        currency: 'BTC',
        notification_methods: ['push']
      });
      loadAlerts();
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      showError('Erro ao criar alerta');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_active: isActive } : alert
        )
      );

      showSuccess(isActive ? '🔔 Alerta ativado' : '🔕 Alerta pausado');
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      showError('Erro ao atualizar alerta');
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
      showSuccess('🗑️ Alerta removido');
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
      showError('Erro ao remover alerta');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="h-4 w-4" />;
      case 'balance': return <Target className="h-4 w-4" />;
      case 'transaction': return <Activity className="h-4 w-4" />;
      case 'volume': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getConditionText = (condition: string, threshold: number, currency: string) => {
    const symbols = {
      above: '↗️ acima de',
      below: '↘️ abaixo de',
      equals: '🎯 igual a'
    };
    return `${symbols[condition as keyof typeof symbols]} ${threshold} ${currency}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-satotrack-neon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-satotrack-neon to-bitcoin bg-clip-text text-transparent">
            🚨 SatoAlerta
          </h2>
          <p className="text-muted-foreground">
            Monitoramento inteligente 24/7 das suas criptomoedas
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-satotrack-neon text-black hover:bg-satotrack-neon/80">
              <Plus className="h-4 w-4 mr-2" />
              Novo Alerta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Alerta Personalizado</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Alerta</Label>
                <Input
                  id="title"
                  placeholder="Ex: Bitcoin acima de R$350.000"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Alerta</Label>
                  <Select
                    value={newAlert.alert_type}
                    onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, alert_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">💰 Preço</SelectItem>
                      <SelectItem value="balance">🎯 Saldo</SelectItem>
                      <SelectItem value="transaction">📊 Transação</SelectItem>
                      <SelectItem value="volume">⚡ Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condição</Label>
                  <Select
                    value={newAlert.condition}
                    onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">↗️ Acima de</SelectItem>
                      <SelectItem value="below">↘️ Abaixo de</SelectItem>
                      <SelectItem value="equals">🎯 Igual a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="threshold">Valor</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="0"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select
                    value={newAlert.currency}
                    onValueChange={(value) => setNewAlert(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">₿ Bitcoin</SelectItem>
                      <SelectItem value="BRL">💵 Real (BRL)</SelectItem>
                      <SelectItem value="USD">💵 Dólar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={createAlert} 
                disabled={isCreating}
                className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/80"
              >
                {isCreating ? 'Criando...' : '🚨 Criar Alerta'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.length === 0 ? (
          <Card className="col-span-full bg-dashboard-dark border-satotrack-neon/20">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhum alerta configurado ainda.
                <br />
                Crie seu primeiro alerta para monitoramento 24/7!
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`bg-dashboard-dark border-satotrack-neon/20 transition-all duration-300 ${
                alert.is_active ? 'border-satotrack-neon/40' : 'border-gray-600/40'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.alert_type)}
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={alert.is_active ? "default" : "secondary"}
                      className={alert.is_active ? "bg-satotrack-neon text-black" : ""}
                    >
                      {alert.is_active ? 'Ativo' : 'Pausado'}
                    </Badge>
                    
                    <Switch
                      checked={alert.is_active}
                      onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {getConditionText(alert.condition, alert.threshold, alert.currency)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {alert.alert_type.charAt(0).toUpperCase() + alert.alert_type.slice(1)}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas */}
      {alerts.length > 0 && (
        <Card className="bg-dashboard-dark border-satotrack-neon/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Estatísticas dos Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-satotrack-neon">{alerts.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {alerts.filter(a => a.is_active).length}
                </div>
                <div className="text-sm text-muted-foreground">Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {alerts.filter(a => !a.is_active).length}
                </div>
                <div className="text-sm text-muted-foreground">Pausados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bitcoin">
                  {alerts.filter(a => a.alert_type === 'price').length}
                </div>
                <div className="text-sm text-muted-foreground">Preço</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertsManager;

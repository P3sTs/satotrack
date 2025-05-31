
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

const Notificacoes: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-satotrack-text mb-2">
          🔔 Sistema de Notificações
        </h1>
        <p className="text-muted-foreground">
          Configure alertas personalizados para suas carteiras
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notificações por Email
            </CardTitle>
            <CardDescription>
              Receba alertas no seu email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Ativar alertas por email</Label>
              <Switch id="email-alerts" />
            </div>
            <div>
              <Label htmlFor="email">Endereço de email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Telegram Bot
            </CardTitle>
            <CardDescription>
              Conecte com nosso bot do Telegram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="telegram-alerts">Ativar Telegram</Label>
              <Switch id="telegram-alerts" />
            </div>
            <Button variant="outline" className="w-full">
              Conectar Telegram Bot
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Alertas direto no navegador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-alerts">Ativar notificações push</Label>
              <Switch id="push-alerts" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Configurações de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="balance-threshold">Alerta de saldo (BTC)</Label>
              <Input id="balance-threshold" type="number" step="0.001" placeholder="0.1" />
            </div>
            <div>
              <Label htmlFor="price-threshold">Alerta de preço (USD)</Label>
              <Input id="price-threshold" type="number" placeholder="50000" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notificacoes;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const Configuracoes = () => {
  const { user } = useAuth();
  const { carteiras, definirCarteiraPrincipal, carteiraPrincipal } = useCarteiras();
  
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('pt-BR');
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [defaultWallet, setDefaultWallet] = useState(carteiraPrincipal || '');
  
  const handleSaveSettings = () => {
    // Save theme preference
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Save wallet preference
    definirCarteiraPrincipal(defaultWallet || null);
    
    // Notify user
    toast.success('Configurações salvas com sucesso!');
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Você precisa estar logado para acessar as configurações.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Configure a aparência da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select 
                value={theme} 
                onValueChange={setTheme}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select 
                value={language} 
                onValueChange={setLanguage}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Configure suas preferências de uso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-wallet">Carteira Padrão</Label>
              <Select 
                value={defaultWallet} 
                onValueChange={setDefaultWallet}
              >
                <SelectTrigger id="default-wallet">
                  <SelectValue placeholder="Selecione uma carteira padrão" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map(carteira => (
                    <SelectItem key={carteira.id} value={carteira.id}>
                      {carteira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <Label htmlFor="notifications">Ativar notificações</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
              <Label htmlFor="auto-sync">Sincronização automática</Label>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 text-right">
        <Button onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;

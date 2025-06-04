
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import { useI18n } from '@/contexts/i18n/I18nContext';
import { useTheme } from '@/components/theme-provider';
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
  const { language, setLanguage, availableLanguages, t } = useI18n();
  const { theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [defaultWallet, setDefaultWallet] = useState(carteiraPrincipal || '');
  
  const handleSaveSettings = () => {
    // Save wallet preference
    if (defaultWallet) {
      definirCarteiraPrincipal(defaultWallet);
    }
    
    // Notify user
    toast.success(t.settings.saveSuccess || 'Configurações salvas com sucesso!');
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>{t.settings.loginRequired || 'Você precisa estar logado para acessar as configurações.'}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.settings.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.appearance || 'Aparência'}</CardTitle>
            <CardDescription>
              {t.settings.appearanceDescription || 'Configure a aparência da aplicação'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">{t.settings.theme}</Label>
              <Select 
                value={theme} 
                onValueChange={setTheme}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder={t.settings.selectTheme || 'Selecione o tema'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{t.settings.darkTheme || 'Escuro'}</SelectItem>
                  <SelectItem value="light">{t.settings.lightTheme || 'Claro'}</SelectItem>
                  <SelectItem value="system">{t.settings.systemTheme || 'Sistema'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">{t.settings.language}</Label>
              <Select 
                value={language} 
                onValueChange={setLanguage}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder={t.settings.selectLanguage || 'Selecione o idioma'} />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.preferences || 'Preferências'}</CardTitle>
            <CardDescription>
              {t.settings.preferencesDescription || 'Configure suas preferências de uso'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-wallet">{t.settings.defaultWallet || 'Carteira Padrão'}</Label>
              <Select 
                value={defaultWallet} 
                onValueChange={setDefaultWallet}
              >
                <SelectTrigger id="default-wallet">
                  <SelectValue placeholder={t.settings.selectDefaultWallet || 'Selecione uma carteira padrão'} />
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
              <Label htmlFor="notifications">
                {t.settings.enableNotifications || 'Ativar notificações'}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
              <Label htmlFor="auto-sync">
                {t.settings.autoSync || 'Sincronização automática'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 text-right">
        <Button onClick={handleSaveSettings}>
          {t.common.save}
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;

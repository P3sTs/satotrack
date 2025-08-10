
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowRight
} from 'lucide-react';
import AnimatedLayout from '@/components/ui/enhanced/AnimatedLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const Configuracoes = () => {
  const [activeSection, setActiveSection] = useState('perfil');
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    priceAlerts: true
  });

  const satoTrackGradient = [
    "#0A0A0A",
    "#00FFC6",
    "#06B6D4", 
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B"
  ];

  const sections = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
    { id: 'idioma', label: 'Idioma & Região', icon: Globe },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const renderProfileSection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-satotrack-neon">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Gerencie suas informações de perfil e dados pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" placeholder="Seu nome completo" className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" placeholder="+55 (11) 99999-9999" className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon" />
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="w-full md:w-auto bg-satotrack-neon text-black hover:bg-satotrack-neon/90 transition-all duration-200">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderSecuritySection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-satotrack-neon">
            <Shield className="h-5 w-5" />
            Segurança da Conta
          </CardTitle>
          <CardDescription>
            Configure opções de segurança para proteger sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative">
                <Input 
                  id="current-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua senha atual"
                  className="pr-10 transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-satotrack-neon transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Digite a nova senha"
                  className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirme a nova senha"
                  className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Autenticação de Dois Fatores</h4>
            <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="space-y-1">
                <p className="font-medium">2FA via Aplicativo</p>
                <p className="text-sm text-muted-foreground">Use um aplicativo autenticador</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="space-y-1">
                <p className="font-medium">2FA via SMS</p>
                <p className="text-sm text-muted-foreground">Receba códigos por SMS</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderNotificationsSection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-satotrack-neon">
            <Bell className="h-5 w-5" />
            Preferências de Notificação
          </CardTitle>
          <CardDescription>
            Configure como e quando deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: 'Notificações por Email', desc: 'Receba alertas e atualizações por email', icon: Mail },
            { key: 'push', label: 'Notificações Push', desc: 'Receba notificações no navegador', icon: Smartphone },
            { key: 'sms', label: 'Notificações SMS', desc: 'Receba alertas importantes por SMS', icon: Bell },
            { key: 'priceAlerts', label: 'Alertas de Preço', desc: 'Notificações sobre mudanças de preço', icon: ArrowRight }
          ].map(({ key, label, desc, icon: Icon }) => (
            <motion.div
              key={key}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50 hover:border-satotrack-neon/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-satotrack-neon" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
              <Switch 
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [key]: checked }))
                }
              />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAppearanceSection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-satotrack-neon">
            <Palette className="h-5 w-5" />
            Aparência e Tema
          </CardTitle>
          <CardDescription>
            Personalize a aparência da interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Tema</h4>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  darkMode ? 'border-satotrack-neon bg-card' : 'border-border hover:border-satotrack-neon/50'
                }`}
                onClick={() => setDarkMode(true)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-4 w-4" />
                  <span className="font-medium">Modo Escuro</span>
                </div>
                <div className="w-full h-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded"></div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  !darkMode ? 'border-satotrack-neon bg-card' : 'border-border hover:border-satotrack-neon/50'
                }`}
                onClick={() => setDarkMode(false)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-4 w-4" />
                  <span className="font-medium">Modo Claro</span>
                </div>
                <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded"></div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderLanguageSection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-satotrack-neon">
            <Globe className="h-5 w-5" />
            Idioma e Região
          </CardTitle>
          <CardDescription>
            Configure suas preferências de idioma e localização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select defaultValue="pt">
                <SelectTrigger className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português (Brasil)</SelectItem>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select defaultValue="america/sao_paulo">
                <SelectTrigger className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon">
                  <SelectValue placeholder="Selecione o fuso horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america/sao_paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="america/new_york">New York (GMT-5)</SelectItem>
                  <SelectItem value="europe/london">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Moeda Padrão</Label>
            <Select defaultValue="brl">
              <SelectTrigger className="transition-all duration-200 hover:border-satotrack-neon/50 focus:border-satotrack-neon">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brl">Real Brasileiro (BRL)</SelectItem>
                <SelectItem value="usd">Dólar Americano (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'perfil': return renderProfileSection();
      case 'seguranca': return renderSecuritySection();
      case 'notificacoes': return renderNotificationsSection();
      case 'aparencia': return renderAppearanceSection();
      case 'idioma': return renderLanguageSection();
      default: return renderProfileSection();
    }
  };

  return (
    <AnimatedLayout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedGradientBackground
          Breathing={true}
          gradientColors={satoTrackGradient}
          gradientStops={[20, 35, 50, 65, 75, 85, 100]}
          startingGap={150}
          breathingRange={5}
          animationSpeed={0.01}
          topOffset={0}
        />

        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-8 w-8 text-satotrack-neon" />
              <h1 className="text-4xl font-bold text-foreground">Configurações</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Gerencie suas preferências e configurações da conta
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar de navegação */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="card-premium sticky top-8">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {sections.map(({ id, label, icon: Icon }) => (
                      <motion.button
                        key={id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveSection(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeSection === id
                            ? 'bg-satotrack-neon/20 text-satotrack-neon border border-satotrack-neon/50'
                            : 'hover:bg-card/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{label}</span>
                      </motion.button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Conteúdo principal */}
            <motion.div
              className="lg:col-span-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Configuracoes;

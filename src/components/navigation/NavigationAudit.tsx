
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Wallet, 
  Plus, 
  TrendingUp, 
  Settings, 
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface RouteConfig {
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  requiresAuth?: boolean;
  status: 'working' | 'broken' | 'missing';
}

const NavigationAudit: React.FC = () => {
  const location = useLocation();

  const routes: RouteConfig[] = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: Home,
      description: 'Painel principal com resumo',
      requiresAuth: true,
      status: 'working'
    },
    {
      path: '/carteiras',
      name: 'Carteiras',
      icon: Wallet,
      description: 'Gerenciar carteiras',
      requiresAuth: true,
      status: 'working'
    },
    {
      path: '/nova-carteira',
      name: 'Nova Carteira',
      icon: Plus,
      description: 'Adicionar nova carteira',
      requiresAuth: true,
      status: 'missing' // Esta rota não existe no App.tsx
    },
    {
      path: '/mercado',
      name: 'Mercado',
      icon: TrendingUp,
      description: 'Cotações e gráficos',
      requiresAuth: true,
      status: 'working'
    },
    {
      path: '/configuracoes',
      name: 'Configurações',
      icon: Settings,
      description: 'Ajustes da conta',
      requiresAuth: true,
      status: 'working'
    },
    {
      path: '/auth',
      name: 'Autenticação',
      icon: User,
      description: 'Login/Registro',
      requiresAuth: false,
      status: 'working'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'broken':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'missing':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-green-500';
      case 'broken':
        return 'bg-red-500';
      case 'missing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>🔍 Auditoria de Navegação (Dev Only)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Rota atual: <code>{location.pathname}</code>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {routes.map((route) => {
            const IconComponent = route.icon;
            return (
              <div 
                key={route.path}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(route.status)}
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {route.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${getStatusColor(route.status)} text-white border-none`}
                  >
                    {route.status}
                  </Badge>
                  {route.status === 'working' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={route.path}>
                        Testar
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationAudit;

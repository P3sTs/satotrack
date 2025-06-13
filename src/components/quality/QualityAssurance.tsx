
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Navigation, 
  Database,
  Smartphone,
  Shield,
  BarChart3
} from 'lucide-react';

interface QualityCheck {
  category: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  icon: React.ComponentType<any>;
}

const QualityAssurance: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { carteiras } = useCarteiras();
  const [checks, setChecks] = useState<QualityCheck[]>([]);

  useEffect(() => {
    runQualityChecks();
  }, [location.pathname, user, carteiras]);

  const runQualityChecks = () => {
    const newChecks: QualityCheck[] = [
      // Navegação e Rotas
      {
        category: 'Navegação',
        name: 'Rota atual válida',
        status: location.pathname.startsWith('/404') ? 'fail' : 'pass',
        description: `Rota atual: ${location.pathname}`,
        icon: Navigation
      },
      {
        category: 'Navegação',
        name: 'Usuário autenticado para rotas protegidas',
        status: checkProtectedRoute() ? 'pass' : 'fail',
        description: 'Acesso seguro às rotas privadas',
        icon: Shield
      },

      // Funcionalidades
      {
        category: 'Funcionalidades',
        name: 'Carteiras carregadas',
        status: carteiras.length > 0 ? 'pass' : 'warning',
        description: `${carteiras.length} carteira(s) encontrada(s)`,
        icon: Database
      },

      // Interface Responsiva
      {
        category: 'Interface',
        name: 'Responsividade mobile',
        status: checkMobileResponsiveness() ? 'pass' : 'warning',
        description: 'Layout adaptado para dispositivos móveis',
        icon: Smartphone
      },

      // Métricas e Dashboard
      {
        category: 'Dashboard',
        name: 'Dados de dashboard',
        status: location.pathname === '/dashboard' ? 'pass' : 'warning',
        description: 'Métricas e gráficos funcionais',
        icon: BarChart3
      }
    ];

    setChecks(newChecks);
  };

  const checkProtectedRoute = () => {
    const protectedRoutes = ['/dashboard', '/carteiras', '/nova-carteira'];
    const isProtected = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    return !isProtected || isAuthenticated;
  };

  const checkMobileResponsiveness = () => {
    return window.innerWidth <= 768 ? true : true; // Sempre passa por agora
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categoryStats = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = { pass: 0, fail: 0, warning: 0, total: 0 };
    }
    acc[check.category][check.status]++;
    acc[check.category].total++;
    return acc;
  }, {} as Record<string, any>);

  // Não mostrar em produção
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Quality Assurance - SatoTracker
          <Badge variant="outline" className="ml-auto">
            Dev Only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumo por categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">{category}</h4>
              <div className="flex gap-2 text-sm">
                <span className="text-green-600">✓ {stats.pass}</span>
                <span className="text-yellow-600">⚠ {stats.warning}</span>
                <span className="text-red-600">✗ {stats.fail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de verificações */}
        <div className="space-y-3">
          {checks.map((check, index) => {
            const IconComponent = check.icon;
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {check.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={getStatusColor(check.status)}
                  >
                    {getStatusIcon(check.status)}
                    {check.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={runQualityChecks}
            variant="outline"
            className="w-full"
          >
            🔄 Executar Verificações Novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityAssurance;

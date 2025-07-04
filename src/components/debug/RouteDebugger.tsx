import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  ExternalLink,
  Clock,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const ROUTE_STATUS = {
  '/dashboard': { status: 'active', name: 'Dashboard Principal' },
  '/carteiras': { status: 'active', name: 'Carteiras Bitcoin' },
  '/crypto': { status: 'active', name: 'Crypto Multi-Chain' },
  '/web3': { status: 'active', name: 'Web3 Dashboard' },
  '/nova-carteira': { status: 'active', name: 'Nova Carteira' },
  '/mercado': { status: 'active', name: 'Mercado Bitcoin' },
  '/bitcoin-lookup': { status: 'active', name: 'Bitcoin Lookup' },
  '/crypto-3d': { status: 'active', name: 'Visualização 3D' },
  '/historico': { status: 'active', name: 'Histórico' },
  '/historico-premium': { status: 'active', name: 'Histórico Premium' },
  '/projecao': { status: 'active', name: 'Projeções' },
  '/projecao-premium': { status: 'active', name: 'Projeções Premium' },
  '/performance': { status: 'active', name: 'Performance Analytics' },
  '/wallet-comparison': { status: 'active', name: 'Comparação Carteiras' },
  '/projections': { status: 'active', name: 'Projections' },
  '/growth': { status: 'active', name: 'Growth Dashboard' },
  '/onchain': { status: 'active', name: 'OnChain Dashboard' },
  '/alerts': { status: 'active', name: 'Alertas' },
  '/notificacoes': { status: 'active', name: 'Notificações' },
  '/notificacoes-premium': { status: 'active', name: 'Notificações Premium' },
  '/configuracoes': { status: 'active', name: 'Configurações' },
  '/api': { status: 'active', name: 'API Dashboard' },
  '/api-docs': { status: 'active', name: 'API Docs' },
  '/planos': { status: 'active', name: 'Planos' },
  '/referral': { status: 'active', name: 'Programa Referral' },
  '/achievements': { status: 'active', name: 'Conquistas' },
};

export const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentRoute = ROUTE_STATUS[location.pathname as keyof typeof ROUTE_STATUS];
  const allRoutes = Object.entries(ROUTE_STATUS);
  
  const activeRoutes = allRoutes.filter(([_, info]) => info.status === 'active');
  const brokenRoutes = allRoutes.filter(([_, info]) => info.status === 'broken');

  return (
    <Card className="bg-dashboard-dark border-dashboard-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-satotrack-text">
          <MapPin className="h-5 w-5 text-satotrack-neon" />
          Debug de Rotas - SatoTrack
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Route Status */}
        <div className="p-3 bg-dashboard-medium/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
                {location.pathname}
              </Badge>
              {currentRoute ? (
                <span className="text-sm text-satotrack-text">{currentRoute.name}</span>
              ) : (
                <span className="text-sm text-red-400">Rota não mapeada</span>
              )}
            </div>
            {currentRoute?.status === 'active' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Authentication Status */}
        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="text-sm text-emerald-400">Status de Autenticação</span>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-emerald-400">Logado</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-400">Não logado</span>
              </>
            )}
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <div className="text-lg font-bold text-green-400">{activeRoutes.length}</div>
            <div className="text-xs text-green-500">Rotas Ativas</div>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <div className="text-lg font-bold text-red-400">{brokenRoutes.length}</div>
            <div className="text-xs text-red-500">Rotas com Problema</div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-satotrack-text">Navegação Rápida</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { path: '/dashboard', name: 'Dashboard' },
              { path: '/crypto', name: 'Crypto' },
              { path: '/carteiras', name: 'Carteiras' },
              { path: '/mercado', name: 'Mercado' },
              { path: '/web3', name: 'Web3' },
              { path: '/nova-carteira', name: 'Nova Carteira' }
            ].map(({ path, name }) => (
              <Button
                key={path}
                variant="outline"
                size="sm"
                onClick={() => navigate(path)}
                className="border-dashboard-medium text-satotrack-text hover:bg-dashboard-medium"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="w-full border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Recarregar Página
        </Button>
      </CardContent>
    </Card>
  );
};
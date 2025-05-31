
import React from 'react';
import { useAuth } from '@/contexts/auth';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Key, Activity, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ApiDashboard: React.FC = () => {
  const { userPlan, apiToken, generateApiToken, apiRequestsRemaining } = useAuth();
  const isPremium = userPlan === 'premium';

  const handleGenerateToken = async () => {
    if (generateApiToken) {
      await generateApiToken();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Token copiado para a área de transferência.",
    });
  };

  if (!isPremium) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumFeatureGate 
          messageTitle="API SatoTrack Premium"
          messageText="Acesse nossa API REST completa para integrar dados de Bitcoin em seus sistemas e aplicações."
          blockType="replace"
        >
          <div className="h-96" />
        </PremiumFeatureGate>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-satotrack-text mb-2">
          🔌 API SatoTrack
        </h1>
        <p className="text-muted-foreground">
          Integre dados de Bitcoin em tempo real em suas aplicações
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Token Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Token de API
            </CardTitle>
            <CardDescription>
              Gere e gerencie seu token de acesso à API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiToken ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input 
                    value={apiToken} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(apiToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Token Ativo
                </Badge>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Nenhum token gerado ainda
                </p>
                <Button onClick={handleGenerateToken}>
                  Gerar Token de API
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Uso da API
            </CardTitle>
            <CardDescription>
              Estatísticas de uso mensal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Requisições restantes</span>
                  <span className="font-medium">{apiRequestsRemaining}</span>
                </div>
                <div className="w-full bg-dashboard-medium rounded-full h-2 mt-1">
                  <div 
                    className="bg-satotrack-neon h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(apiRequestsRemaining / 10000) * 100}%` }}
                  />
                </div>
              </div>
              <Badge variant="outline">
                Limite: 10.000 req/mês
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Endpoints Disponíveis
            </CardTitle>
            <CardDescription>
              Principais endpoints da API SatoTrack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-dashboard-medium rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-sm">/api/v1/wallet/{'{address}'}</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Obtém informações detalhadas de uma carteira Bitcoin
                </p>
              </div>
              
              <div className="bg-dashboard-medium rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-sm">/api/v1/transactions/{'{address}'}</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lista transações de uma carteira específica
                </p>
              </div>
              
              <div className="bg-dashboard-medium rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-sm">/api/v1/market/price</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Preço atual do Bitcoin em tempo real
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-dashboard-medium">
                <p className="text-sm text-muted-foreground">
                  <strong>Base URL:</strong> https://api.satotrack.com<br/>
                  <strong>Autenticação:</strong> Bearer Token no header Authorization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDashboard;

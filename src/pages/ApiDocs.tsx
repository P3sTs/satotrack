
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockOpen, Lock, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { PlanComparisonTable } from '@/components/monetization/PlanDisplay';
import { Advertisement } from '@/components/monetization/Advertisement';
import { toast } from '@/components/ui/sonner';

const ApiDocs: React.FC = () => {
  const { userPlan, apiToken, generateApiToken, apiRequestsRemaining } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const isPremium = userPlan === 'premium';
  
  const handleGenerateToken = async () => {
    if (!generateApiToken) return;
    
    setIsGenerating(true);
    try {
      await generateApiToken();
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyToken = () => {
    if (!apiToken) return;
    
    navigator.clipboard.writeText(apiToken);
    toast("Token copiado para a área de transferência");
  };
  
  const curlExample = `
curl -X GET "https://api.satotrack.com/v1/wallet/balance" \\
  -H "Authorization: Bearer ${apiToken || 'SEU_API_TOKEN'}" \\
  -H "Content-Type: application/json"
`;

  const pythonExample = `
import requests

url = "https://api.satotrack.com/v1/wallet/balance"
headers = {
    "Authorization": "Bearer ${apiToken || 'SEU_API_TOKEN'}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)
`;

  const javascriptExample = `
const fetchData = async () => {
  const response = await fetch("https://api.satotrack.com/v1/wallet/balance", {
    method: "GET",
    headers: {
      "Authorization": "Bearer ${apiToken || 'SEU_API_TOKEN'}",
      "Content-Type": "application/json"
    }
  });
  
  const data = await response.json();
  console.log(data);
};

fetchData();
`;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">API para Desenvolvedores</h1>
          <p className="text-sm text-muted-foreground">Integre os dados de Bitcoin em suas aplicações</p>
        </div>
      </div>
      
      {!isPremium ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Acesso à API Premium
                </CardTitle>
                <CardDescription>
                  Integre dados de Bitcoin diretamente em suas aplicações com nossa API REST
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Recurso Premium</AlertTitle>
                  <AlertDescription>
                    O acesso à API está disponível apenas para usuários do plano Premium.
                  </AlertDescription>
                </Alert>
                
                <div className="rounded-md bg-muted p-4 mb-6">
                  <h3 className="font-medium mb-2">Recursos disponíveis na API:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Consulta de saldo de carteiras Bitcoin em tempo real</li>
                    <li>Histórico de transações detalhado</li>
                    <li>Informações de mercado e preços atualizados</li>
                    <li>Análise de atividade da carteira</li>
                    <li>Dados de mempool e taxas de transação</li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white"
                  onClick={handleGenerateToken}
                >
                  <LockOpen className="h-4 w-4 mr-2" />
                  Fazer upgrade para Premium
                </Button>
              </CardContent>
            </Card>
            
            <Advertisement position="panel" />
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Compare os planos</CardTitle>
                <CardDescription>
                  Veja os benefícios do plano Premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlanComparisonTable />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seu Token de API</CardTitle>
              <CardDescription>
                Utilize este token para autenticar suas requisições à API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Input
                  value={apiToken || 'Gere um token para começar'}
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" onClick={handleCopyToken} disabled={!apiToken}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Requisições restantes: {apiRequestsRemaining}/1000</p>
                  <p className="text-xs text-muted-foreground">Renovadas mensalmente</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateToken}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {apiToken ? 'Regenerar Token' : 'Gerar Token'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentação da API</CardTitle>
              <CardDescription>
                Exemplos de como utilizar nossa API em diferentes linguagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="curl">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {curlExample}
                  </div>
                </TabsContent>
                <TabsContent value="python">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {pythonExample}
                  </div>
                </TabsContent>
                <TabsContent value="javascript">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {javascriptExample}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleCopyToken} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Token
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Endpoints Disponíveis</CardTitle>
              <CardDescription>
                Lista completa de endpoints e parâmetros disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">GET /v1/wallet/balance</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Retorna o saldo atual de uma carteira Bitcoin
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p><strong>Parâmetros:</strong></p>
                  <ul className="pl-4 list-disc">
                    <li>address (string): Endereço Bitcoin</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">GET /v1/wallet/transactions</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Retorna o histórico de transações de uma carteira
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p><strong>Parâmetros:</strong></p>
                  <ul className="pl-4 list-disc">
                    <li>address (string): Endereço Bitcoin</li>
                    <li>limit (integer, opcional): Limite de resultados</li>
                    <li>offset (integer, opcional): Offset para paginação</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">GET /v1/market/price</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Retorna o preço atual do Bitcoin em diferentes moedas
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p><strong>Parâmetros:</strong></p>
                  <ul className="pl-4 list-disc">
                    <li>currency (string, opcional): Código da moeda (default: USD)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApiDocs;

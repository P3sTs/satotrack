
import React, { useState } from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { useAuth } from '@/contexts/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PremiumFeatureGate from "@/components/monetization/PremiumFeatureGate";
import { CarteiraBTC } from '@/types/types';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';

const WalletComparison: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const [carteira1Id, setCarteira1Id] = useState<string>('');
  const [carteira2Id, setCarteira2Id] = useState<string>('');
  
  const carteira1 = carteiras.find(c => c.id === carteira1Id);
  const carteira2 = carteiras.find(c => c.id === carteira2Id);
  
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <PremiumFeatureGate
      messageTitle="Comparação de Carteiras"
      messageText="Compare o desempenho de múltiplas carteiras lado a lado para identificar padrões e otimizar suas estratégias."
      blockType="replace"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-satotrack-neon" />
            Comparação de Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Carteira 1</label>
              <Select value={carteira1Id} onValueChange={setCarteira1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Carteira 2</label>
              <Select value={carteira2Id} onValueChange={setCarteira2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {carteira1 && carteira2 ? (
            <>
              <Tabs defaultValue="metrics">
                <TabsList className="w-full">
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                  <TabsTrigger value="chart">Gráfico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics">
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Métricas</h3>
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium">{carteira1.nome}</h3>
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium">{carteira2.nome}</h3>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-sm font-medium">Saldo Atual</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira1.saldo.toFixed(8)} BTC</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira2.saldo.toFixed(8)} BTC</p>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-sm font-medium">Total Recebido</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira1.total_entradas.toFixed(8)} BTC</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira2.total_entradas.toFixed(8)} BTC</p>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-sm font-medium">Total Enviado</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira1.total_saidas.toFixed(8)} BTC</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira2.total_saidas.toFixed(8)} BTC</p>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-sm font-medium">Transações</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira1.qtde_transacoes}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{carteira2.qtde_transacoes}</p>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-sm font-medium">Criação</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{formatDate(carteira1.ultimo_update)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{formatDate(carteira2.ultimo_update)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chart">
                  <div className="h-64 mt-4 flex items-center justify-center bg-dashboard-medium/30 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Gráfico comparativo em desenvolvimento
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="h-64 mt-4 flex items-center justify-center bg-dashboard-medium/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Selecione duas carteiras para comparar
                </p>
                <p className="text-xs text-muted-foreground">
                  Você poderá ver métricas lado a lado e análises comparativas
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumFeatureGate>
  );
};

export default WalletComparison;

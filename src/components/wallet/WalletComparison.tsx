
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarteiras } from '@/contexts/carteiras';
import { ArrowRight, BarChart2 } from 'lucide-react';
import PremiumFeatureGate from '../monetization/PremiumFeatureGate';

const WalletComparison: React.FC = () => {
  const { carteiras } = useCarteiras();
  const [firstWallet, setFirstWallet] = useState<string>('');
  const [secondWallet, setSecondWallet] = useState<string>('');
  
  const wallet1 = carteiras.find(w => w.id === firstWallet);
  const wallet2 = carteiras.find(w => w.id === secondWallet);
  
  return (
    <PremiumFeatureGate
      messageTitle="Comparador de Carteiras Premium"
      messageText="Compare o desempenho de diferentes carteiras lado a lado para análises avançadas."
      blockType="replace"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-satotrack-neon" />
            Comparador de Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
            <div className="md:col-span-3">
              <label className="text-sm text-muted-foreground mb-1 block">Carteira 1</label>
              <Select value={firstWallet} onValueChange={setFirstWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map((carteira) => (
                    <SelectItem key={carteira.id} value={carteira.id}>
                      {carteira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-1 flex items-end justify-center">
              <ArrowRight className="h-5 w-5 mb-2" />
            </div>
            
            <div className="md:col-span-3">
              <label className="text-sm text-muted-foreground mb-1 block">Carteira 2</label>
              <Select value={secondWallet} onValueChange={setSecondWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.filter(c => c.id !== firstWallet).map((carteira) => (
                    <SelectItem key={carteira.id} value={carteira.id}>
                      {carteira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {wallet1 && wallet2 ? (
            <div className="border border-dashboard-medium rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 p-3 bg-dashboard-medium/30">
                <div className="font-medium">Métrica</div>
                <div className="font-medium">{wallet1.nome}</div>
                <div className="font-medium">{wallet2.nome}</div>
              </div>
              
              <div className="grid grid-cols-3 p-3 border-t border-dashboard-medium">
                <div>Saldo atual</div>
                <div>฿ {wallet1.balance.toLocaleString()}</div>
                <div>฿ {wallet2.balance.toLocaleString()}</div>
              </div>
              
              <div className="grid grid-cols-3 p-3 border-t border-dashboard-medium">
                <div>Total recebido</div>
                <div>฿ {wallet1.total_received.toLocaleString()}</div>
                <div>฿ {wallet2.total_received.toLocaleString()}</div>
              </div>
              
              <div className="grid grid-cols-3 p-3 border-t border-dashboard-medium">
                <div>Total enviado</div>
                <div>฿ {wallet1.total_sent.toLocaleString()}</div>
                <div>฿ {wallet2.total_sent.toLocaleString()}</div>
              </div>
              
              <div className="grid grid-cols-3 p-3 border-t border-dashboard-medium">
                <div>Transações</div>
                <div>{wallet1.transaction_count}</div>
                <div>{wallet2.transaction_count}</div>
              </div>
              
              <div className="grid grid-cols-3 p-3 border-t border-dashboard-medium">
                <div>Criada em</div>
                <div>{new Date(wallet1.created_at).toLocaleDateString()}</div>
                <div>{new Date(wallet2.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              Selecione duas carteiras para comparar
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumFeatureGate>
  );
};

export default WalletComparison;

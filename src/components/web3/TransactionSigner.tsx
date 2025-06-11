
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/contexts/web3/Web3Context';
import { useAuth } from '@/contexts/auth';
import { PenTool, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionData {
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
}

const TransactionSigner: React.FC = () => {
  const { isConnected, address } = useWeb3();
  const { userPlan } = useAuth();
  const [transaction, setTransaction] = useState<TransactionData>({
    to: '',
    value: '0',
    gasLimit: '21000',
    gasPrice: '20'
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleInputChange = (field: keyof TransactionData, value: string) => {
    setTransaction(prev => ({ ...prev, [field]: value }));
  };

  const simulateTransaction = async () => {
    if (!isConnected) {
      toast.error('Conecte sua carteira primeiro');
      return;
    }

    setIsSimulating(true);
    
    try {
      // Simulate the transaction (read-only mode for free users)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const result = {
        status: 'success',
        estimatedGas: parseInt(transaction.gasLimit),
        estimatedCost: (parseInt(transaction.gasLimit) * parseInt(transaction.gasPrice)) / 1e9,
        willSucceed: true
      };

      setSimulationResult(result);
      toast.success('Simulação concluída com sucesso!');
    } catch (error) {
      toast.error('Erro na simulação da transação');
    } finally {
      setIsSimulating(false);
    }
  };

  const signTransaction = async () => {
    if (userPlan === 'free') {
      toast.error('Assinatura de transações é um recurso Premium');
      return;
    }

    try {
      // In a real implementation, this would use wagmi hooks to sign
      toast.success('Transação assinada! (Funcionalidade simulada)');
    } catch (error) {
      toast.error('Erro ao assinar transação');
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Conecte sua carteira para usar o assinador de transações
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-dashboard-dark to-dashboard-medium border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-satotrack-neon" />
          Assinador de Transações
          {userPlan === 'free' && (
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Modo Simulação
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="to">Para (Endereço)</Label>
            <Input
              id="to"
              placeholder="0x..."
              value={transaction.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Valor (ETH)</Label>
            <Input
              id="value"
              type="number"
              step="0.000001"
              placeholder="0.001"
              value={transaction.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gasLimit">Gas Limit</Label>
            <Input
              id="gasLimit"
              type="number"
              placeholder="21000"
              value={transaction.gasLimit}
              onChange={(e) => handleInputChange('gasLimit', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gasPrice">Gas Price (Gwei)</Label>
            <Input
              id="gasPrice"
              type="number"
              placeholder="20"
              value={transaction.gasPrice}
              onChange={(e) => handleInputChange('gasPrice', e.target.value)}
            />
          </div>
        </div>

        {simulationResult && (
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="font-medium text-green-400">Simulação Concluída</span>
            </div>
            <div className="text-sm space-y-1">
              <p>Gas Estimado: {simulationResult.estimatedGas.toLocaleString()}</p>
              <p>Custo Estimado: {simulationResult.estimatedCost.toFixed(6)} ETH</p>
              <p>Status: {simulationResult.willSucceed ? 'Sucesso' : 'Falha'}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={simulateTransaction}
            disabled={isSimulating || !transaction.to}
            className="flex-1"
            variant="outline"
          >
            {isSimulating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Simular
              </>
            )}
          </Button>
          
          <Button 
            onClick={signTransaction}
            disabled={!simulationResult || userPlan === 'free'}
            className="flex-1"
          >
            <PenTool className="h-4 w-4 mr-2" />
            {userPlan === 'free' ? 'Premium Necessário' : 'Assinar'}
          </Button>
        </div>

        {userPlan === 'free' && (
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-xs text-yellow-600">
              💎 <strong>Upgrade para Premium</strong> para assinar transações reais e acessar recursos avançados de Web3.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSigner;

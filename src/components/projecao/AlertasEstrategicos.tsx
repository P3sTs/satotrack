
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, TrendingUp, TrendingDown, AlertTriangle, BarChart, Percent } from 'lucide-react';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { calcularAlertas } from '@/utils/projecaoCalculations';

interface AlertasEstrategicosProps {
  walletId: string;
}

const AlertasEstrategicos: React.FC<AlertasEstrategicosProps> = ({ walletId }) => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const carteira = carteiras.find(c => c.id === walletId);
  
  if (!carteira || !bitcoinData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-satotrack-neon" />
            Alertas Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Carregando alertas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate alerts based on wallet data and bitcoin price
  const alertas = calcularAlertas(carteira, bitcoinData);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-satotrack-neon" />
          Alertas Estratégicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertas.map((alerta, index) => (
            <div 
              key={index} 
              className={`flex items-start p-3 rounded-lg ${
                alerta.tipo === 'perigo' 
                  ? 'bg-red-500/10 border border-red-500/30' 
                  : alerta.tipo === 'atencao' 
                  ? 'bg-yellow-500/10 border border-yellow-500/30' 
                  : 'bg-green-500/10 border border-green-500/30'
              }`}
            >
              <div className="mr-3 mt-1">
                {alerta.tipo === 'perigo' && (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                {alerta.tipo === 'atencao' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                {alerta.tipo === 'oportunidade' && (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div>
                <p className="text-sm">{alerta.mensagem}</p>
                <div className="flex items-center mt-1.5 gap-3">
                  {alerta.porcentagem && (
                    <span className="text-xs flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5" />
                      {alerta.porcentagem}%
                    </span>
                  )}
                  {alerta.periodo && (
                    <span className="text-xs flex items-center gap-1">
                      <BarChart className="h-3.5 w-3.5" />
                      {alerta.periodo} dias
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {alertas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">
                Nenhum alerta estratégico disponível para esta carteira no momento
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Alertas são gerados com base em seu padrão de transações e tendências de mercado
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertasEstrategicos;

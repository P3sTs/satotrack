
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketInfo: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Informações Adicionais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Sobre o Bitcoin</h3>
            <p className="text-sm text-muted-foreground">
              Bitcoin é a primeira criptomoeda descentralizada do mundo, criada em 2009 por 
              uma pessoa (ou grupo) usando o pseudônimo Satoshi Nakamoto. Opera em uma 
              tecnologia peer-to-peer sem necessidade de intermediários ou autoridade central.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Aviso de Risco</h3>
            <p className="text-sm text-muted-foreground">
              O mercado de criptomoedas é altamente volátil e imprevisível. As informações 
              apresentadas não constituem aconselhamento financeiro. Invista de forma 
              responsável e apenas valores que esteja disposto a perder.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketInfo;

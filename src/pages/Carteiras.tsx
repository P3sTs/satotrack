
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Eye, Send, Download } from 'lucide-react';

const Carteiras: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Carteiras</h1>
          <p className="text-muted-foreground">Gerencie suas carteiras de criptomoedas</p>
        </div>
        <Button className="bg-satotrack-neon text-black">
          <Plus className="h-4 w-4 mr-2" />
          Nova Carteira
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="h-5 w-5 text-satotrack-neon" />
              Carteira Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-satotrack-neon">0.00 ETH</p>
              <p className="text-muted-foreground">≈ $0.00 USD</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-3 w-3 mr-2" />
                Ver
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Send className="h-3 w-3 mr-2" />
                Enviar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-3 w-3 mr-2" />
                Receber
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Carteiras;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  QrCode, 
  Download,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

const QRCodeGenerator: React.FC = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);

  const handleGenerateQR = async () => {
    if (!address) {
      toast.error('Digite um endereço válido');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setQrGenerated(true);
    toast.success('✅ QR Code gerado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <QrCode className="h-5 w-5 text-indigo-400" />
            Gerador de QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qr-address">Endereço</Label>
              <Input
                id="qr-address"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-amount">Valor (Opcional)</Label>
              <Input
                id="qr-amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={!address}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Gerar QR Code
          </Button>

          {qrGenerated && (
            <div className="text-center py-8 border-2 border-dashed border-indigo-500/30 rounded-lg">
              <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-black" />
              </div>
              <p className="text-indigo-400 mb-4">QR Code para: {address.substring(0, 10)}...</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
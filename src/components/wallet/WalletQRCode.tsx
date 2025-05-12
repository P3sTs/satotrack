
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Bitcoin } from 'lucide-react';

interface WalletQRCodeProps {
  address: string;
}

const WalletQRCode: React.FC<WalletQRCodeProps> = ({ address }) => {
  const bitcoinURI = `bitcoin:${address}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    // Using the toast function from wherever it's imported in your project
    // toast.success('Endereço copiado para a área de transferência');
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-white rounded-lg">
        <QRCodeSVG 
          value={bitcoinURI}
          size={200}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="L"
          includeMargin={false}
        />
      </div>
      <Button 
        onClick={copyToClipboard} 
        variant="outline" 
        className="mt-4 text-xs"
        size="sm"
      >
        <Bitcoin className="h-3 w-3 mr-2" />
        Copiar Endereço
      </Button>
    </div>
  );
};

export default WalletQRCode;

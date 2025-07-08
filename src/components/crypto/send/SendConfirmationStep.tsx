import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield } from 'lucide-react';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';

interface FeeOption {
  type: 'slow' | 'standard' | 'fast';
  label: string;
  fee: string;
  time: string;
  satPerByte?: number;
}

interface SendConfirmationStepProps {
  wallet: MultiChainWallet;
  formData: {
    recipient: string;
    amount: string;
    memo: string;
    useCustomFee: boolean;
    customFee: string;
  };
  selectedFee?: FeeOption;
  calculateTotal: () => string;
}

export const SendConfirmationStep: React.FC<SendConfirmationStepProps> = ({
  wallet,
  formData,
  selectedFee,
  calculateTotal
}) => {
  const formatCurrency = (value: string) => {
    return `${value} ${wallet.currency}`;
  };

  return (
    <div className="space-y-6">
      <Alert className="border-orange-500/30 bg-orange-500/10">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-orange-600">
          <strong>Confirmar Transação</strong><br />
          Revise todos os detalhes antes de enviar. Esta ação não pode ser desfeita.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-satotrack-neon mb-2">
              {formatCurrency(formData.amount)}
            </div>
            <p className="text-muted-foreground">será enviado para</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">De:</span>
              <span className="font-mono text-sm">
                {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Para:</span>
              <span className="font-mono text-sm">
                {formData.recipient.slice(0, 8)}...{formData.recipient.slice(-8)}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Valor:</span>
              <span className="font-bold">{formatCurrency(formData.amount)}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Taxa:</span>
              <span>{formatCurrency(formData.useCustomFee ? formData.customFee : selectedFee?.fee || '0')}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Velocidade:</span>
              <span>{selectedFee?.label} ({selectedFee?.time})</span>
            </div>
            
            {formData.memo && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Memo:</span>
                <span className="text-sm">{formData.memo}</span>
              </div>
            )}

            <Separator />
            
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total:</span>
              <span className="text-satotrack-neon">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-satotrack-neon/10 border border-satotrack-neon/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-satotrack-neon" />
          <span className="text-sm font-medium text-satotrack-neon">Assinatura Segura</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Esta transação será assinada com segurança usando SatoTracker KMS.
        </p>
      </div>
    </div>
  );
};
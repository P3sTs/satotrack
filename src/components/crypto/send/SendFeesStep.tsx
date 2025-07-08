import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Calculator, Zap } from 'lucide-react';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';

interface FeeOption {
  type: 'slow' | 'standard' | 'fast';
  label: string;
  fee: string;
  time: string;
  satPerByte?: number;
}

interface SendFeesStepProps {
  wallet: MultiChainWallet;
  formData: {
    amount: string;
    selectedFeeType: 'slow' | 'standard' | 'fast';
    useCustomFee: boolean;
    customFee: string;
  };
  updateFormData: (updates: any) => void;
  currentFeeOptions: FeeOption[];
  selectedFee?: FeeOption;
  calculateTotal: () => string;
}

export const SendFeesStep: React.FC<SendFeesStepProps> = ({
  wallet,
  formData,
  updateFormData,
  currentFeeOptions,
  selectedFee,
  calculateTotal
}) => {
  const formatCurrency = (value: string) => {
    return `${value} ${wallet.currency}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Selecione a Taxa de Rede</h3>
        
        <div className="grid gap-3">
          {currentFeeOptions.map((fee) => (
            <Card 
              key={fee.type}
              className={`cursor-pointer border-2 transition-colors ${
                formData.selectedFeeType === fee.type 
                  ? 'border-satotrack-neon bg-satotrack-neon/5' 
                  : 'border-transparent hover:border-muted'
              }`}
              onClick={() => updateFormData({ selectedFeeType: fee.type })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      {fee.type === 'slow' && <Clock className="h-4 w-4" />}
                      {fee.type === 'standard' && <Calculator className="h-4 w-4" />}
                      {fee.type === 'fast' && <Zap className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{fee.label}</p>
                      <p className="text-sm text-muted-foreground">{fee.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">{formatCurrency(fee.fee)}</p>
                    {fee.satPerByte && (
                      <p className="text-xs text-muted-foreground">{fee.satPerByte} sat/byte</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Fee Option */}
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.useCustomFee}
              onChange={(e) => updateFormData({ useCustomFee: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Usar taxa personalizada</span>
          </label>
          
          {formData.useCustomFee && (
            <div className="mt-2">
              <Input
                type="number"
                step="any"
                placeholder="Taxa customizada..."
                value={formData.customFee}
                onChange={(e) => updateFormData({ customFee: e.target.value })}
                className="font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {/* Fee Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Resumo da Taxa</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Valor a enviar:</span>
              <span className="font-mono">{formatCurrency(formData.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de rede:</span>
              <span className="font-mono">
                {formatCurrency(formData.useCustomFee ? formData.customFee : selectedFee?.fee || '0')}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="font-mono">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
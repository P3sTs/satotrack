
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

const BTCConverter: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();
  const [btcAmount, setBtcAmount] = useState<string>('1');
  const [brlValue, setBrlValue] = useState<number>(0);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [inputMode, setInputMode] = useState<'btc' | 'brl' | 'usd'>('btc');

  useEffect(() => {
    if (!bitcoinData) return;

    const amount = parseFloat(btcAmount) || 0;
    
    if (inputMode === 'btc') {
      setBrlValue(amount * bitcoinData.price_brl);
      setUsdValue(amount * bitcoinData.price_usd);
    }
  }, [btcAmount, bitcoinData, inputMode]);

  const handleBrlChange = (value: string) => {
    if (!bitcoinData) return;
    const amount = parseFloat(value) || 0;
    setBtcAmount((amount / bitcoinData.price_brl).toFixed(8));
    setUsdValue(amount * (bitcoinData.price_usd / bitcoinData.price_brl));
    setBrlValue(amount);
  };

  const handleUsdChange = (value: string) => {
    if (!bitcoinData) return;
    const amount = parseFloat(value) || 0;
    setBtcAmount((amount / bitcoinData.price_usd).toFixed(8));
    setBrlValue(amount * (bitcoinData.price_brl / bitcoinData.price_usd));
    setUsdValue(amount);
  };

  const toggleInputMode = () => {
    setInputMode(prev => {
      if (prev === 'btc') return 'brl';
      if (prev === 'brl') return 'usd';
      return 'btc';
    });
  };

  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-bitcoin" />
          Conversor Instantâneo
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleInputMode}
            className="ml-auto"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="btc-input" className="text-bitcoin font-medium">
              Bitcoin (BTC)
            </Label>
            <Input
              id="btc-input"
              type="number"
              value={btcAmount}
              onChange={(e) => {
                setBtcAmount(e.target.value);
                setInputMode('btc');
              }}
              placeholder="0.00000000"
              className="font-mono text-lg"
              step="0.00000001"
            />
          </div>

          <div className="flex items-center justify-center">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brl-input" className="text-green-500 font-medium">
                Real (BRL)
              </Label>
              <Input
                id="brl-input"
                type="number"
                value={brlValue.toFixed(2)}
                onChange={(e) => {
                  handleBrlChange(e.target.value);
                  setInputMode('brl');
                }}
                placeholder="0.00"
                className="font-mono"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="usd-input" className="text-blue-500 font-medium">
                Dólar (USD)
              </Label>
              <Input
                id="usd-input"
                type="number"
                value={usdValue.toFixed(2)}
                onChange={(e) => {
                  handleUsdChange(e.target.value);
                  setInputMode('usd');
                }}
                placeholder="0.00"
                className="font-mono"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {bitcoinData && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Taxa de câmbio atual:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>1 BTC = R$ {bitcoinData.price_brl.toLocaleString('pt-BR')}</div>
              <div>1 BTC = $ {bitcoinData.price_usd.toLocaleString('en-US')}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BTCConverter;

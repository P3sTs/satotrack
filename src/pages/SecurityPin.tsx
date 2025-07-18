import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

const SecurityPin: React.FC = () => {
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSetPin = async () => {
    if (!pin || pin.length !== 6) {
      toast.error('PIN deve ter 6 dígitos');
      return;
    }

    if (pin !== confirmPin) {
      toast.error('PINs não coincidem');
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.functions.invoke('user-set-pin', {
        body: { pin }
      });

      if (error) throw error;
      
      setHasPin(true);
      setPin('');
      setConfirmPin('');
      toast.success('PIN configurado com sucesso!');
    } catch (error) {
      console.error('Erro ao configurar PIN:', error);
      toast.error('Erro ao configurar PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPin = async () => {
    if (!pin || pin.length !== 6) {
      toast.error('Digite o PIN de 6 dígitos');
      return;
    }

    try {
      setIsVerifying(true);
      
      const { data, error } = await supabase.functions.invoke('user-verify-pin', {
        body: { pin }
      });

      if (error) throw error;
      
      if (data.valid) {
        toast.success('PIN verificado com sucesso!');
      } else {
        toast.error('PIN incorreto');
      }
      
      setPin('');
    } catch (error) {
      console.error('Erro ao verificar PIN:', error);
      toast.error('Erro ao verificar PIN');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="p-6">
        <div className="text-center space-y-4 mb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Configurar PIN</h1>
            <p className="text-muted-foreground">
              {hasPin 
                ? 'Verifique seu PIN de segurança'
                : 'Crie um PIN de 6 dígitos para proteger sua conta'
              }
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {!hasPin ? (
            <>
              {/* Configurar PIN */}
              <div className="space-y-3">
                <label className="text-sm font-medium">PIN (6 dígitos)</label>
                <div className="relative">
                  <Input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="text-center text-2xl tracking-widest"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Confirmar PIN</label>
                <Input
                  type={showPin ? 'text' : 'password'}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button 
                onClick={handleSetPin}
                disabled={isLoading || pin.length !== 6 || confirmPin.length !== 6}
                className="w-full"
              >
                {isLoading ? 'Configurando...' : 'Configurar PIN'}
              </Button>
            </>
          ) : (
            <>
              {/* Verificar PIN */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Digite seu PIN</label>
                <div className="relative">
                  <Input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    className="text-center text-2xl tracking-widest"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleVerifyPin}
                disabled={isVerifying || pin.length !== 6}
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                {isVerifying ? 'Verificando...' : 'Verificar PIN'}
              </Button>

              <Button 
                variant="outline"
                onClick={() => setHasPin(false)}
                className="w-full"
              >
                Alterar PIN
              </Button>
            </>
          )}

          {/* Dicas de Segurança */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Dicas de Segurança
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use um PIN único e memorável</li>
              <li>• Não compartilhe seu PIN com ninguém</li>
              <li>• Evite sequências óbvias (123456, 000000)</li>
              <li>• Altere seu PIN regularmente</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecurityPin;
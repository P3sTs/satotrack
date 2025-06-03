
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share, Copy, Gift, RefreshCw } from 'lucide-react';

interface ReferralCodeCardProps {
  referralCode: string;
  totalReferrals: number;
  referralsNeeded: number;
  isLoading: boolean;
  onGenerateCode: () => Promise<void>;
  onCopyCode: () => Promise<void>;
  onShareLink: () => Promise<void>;
}

const ReferralCodeCard: React.FC<ReferralCodeCardProps> = ({
  referralCode,
  totalReferrals,
  referralsNeeded,
  isLoading,
  onGenerateCode,
  onCopyCode,
  onShareLink
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  
  const handleCopyCode = async () => {
    await onCopyCode();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const progress = ((totalReferrals % 20) / 20) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5" />
          Seu Código de Indicação
        </CardTitle>
        <CardDescription>
          Compartilhe este código com seus amigos para ganhar recompensas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {referralCode ? (
          <>
            <div className="flex gap-2">
              <Input 
                value={referralCode} 
                readOnly 
                className="font-mono text-center text-lg font-bold"
              />
              <Button 
                variant="outline" 
                onClick={handleCopyCode}
                className={copiedCode ? 'bg-green-100 border-green-300' : ''}
                disabled={isLoading}
              >
                <Copy className="h-4 w-4" />
                {copiedCode ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={onShareLink} 
                className="flex-1"
                disabled={isLoading}
              >
                <Share className="h-4 w-4 mr-2" />
                Compartilhar Link
              </Button>
              
              <Button 
                variant="outline"
                onClick={onGenerateCode} 
                disabled={isLoading}
                title="Gerar novo código"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <Button 
            onClick={onGenerateCode} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Gift className="h-4 w-4 mr-2" />
                Gerar Código de Indicação
              </>
            )}
          </Button>
        )}
        
        <div className="bg-dashboard-medium/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Como funciona:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Compartilhe seu código único com amigos</li>
            <li>• Eles se cadastram usando seu código</li>
            <li>• A cada 20 indicações válidas você ganha 1 mês Premium</li>
            <li>• Seus amigos também ganham benefícios especiais</li>
          </ul>
        </div>

        {/* Barra de Progresso */}
        {totalReferrals > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso: {totalReferrals % 20}/20</span>
              <span>{referralsNeeded} restantes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-bitcoin h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {referralCode && (
          <div className="text-center p-3 bg-bitcoin/10 rounded-lg border border-bitcoin/20">
            <p className="text-sm font-medium text-bitcoin">
              🎯 Link de Cadastro com seu Código:
            </p>
            <p className="text-xs text-muted-foreground mt-1 break-all">
              {window.location.origin}/auth?ref={referralCode}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralCodeCard;

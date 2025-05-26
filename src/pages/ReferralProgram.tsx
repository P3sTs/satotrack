
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { Gift, Users, Share, Copy, Trophy, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReferralProgram: React.FC = () => {
  const { user } = useAuth();
  const [referralCode] = useState(`SATO${user?.id?.slice(0, 8).toUpperCase() || 'DEMO'}`);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Mock data - em produção viria do backend
  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 240.00,
    pendingEarnings: 60.00,
    conversionRate: 66.7
  };

  const recentReferrals = [
    { name: 'João S.', date: '2024-01-15', plan: 'Pro', earnings: 20.00, status: 'active' },
    { name: 'Maria L.', date: '2024-01-12', plan: 'Premium', earnings: 100.00, status: 'active' },
    { name: 'Pedro M.', date: '2024-01-10', plan: 'Pro', earnings: 20.00, status: 'pending' }
  ];

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      toast({
        title: "Código copiado!",
        description: "Seu código de referência foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const shareReferralLink = async () => {
    const shareUrl = `https://satotrack.com/ref/${referralCode}`;
    const shareText = `🚀 Monitore suas carteiras Bitcoin com o SatoTrack! Use meu código ${referralCode} e ganhe 1 mês grátis: ${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SatoTrack - Bitcoin Tracker',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Link copiado!",
        description: "Link de referência copiado para compartilhar.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold mb-4">
            Programa de <span className="text-bitcoin">Referência</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Indique amigos para o SatoTrack e ganhe até R$ 100 por cada assinatura Premium. 
            Seus amigos também ganham 1 mês grátis!
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-bitcoin mx-auto mb-2" />
              <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total de Indicações</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{referralStats.activeReferrals}</div>
              <div className="text-sm text-muted-foreground">Assinantes Ativos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">R$ {referralStats.totalEarnings.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Ganho</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{referralStats.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seu Código de Referência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Seu Código de Referência
              </CardTitle>
              <CardDescription>
                Compartilhe este código com seus amigos para ganhar recompensas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={referralCode} 
                  readOnly 
                  className="font-mono text-center text-lg"
                />
                <Button 
                  variant="outline" 
                  onClick={copyReferralCode}
                  className={copiedCode ? 'bg-green-100' : ''}
                >
                  <Copy className="h-4 w-4" />
                  {copiedCode ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
              
              <Button onClick={shareReferralLink} className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Compartilhar Link
              </Button>
              
              <div className="bg-dashboard-medium/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Como funciona:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Seu amigo se cadastra com seu código</li>
                  <li>• Ele ganha 1 mês grátis em qualquer plano</li>
                  <li>• Você recebe uma comissão quando ele assina</li>
                  <li>• Ganhos: R$ 20 (Pro) ou R$ 100 (Premium)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Comissões */}
          <Card>
            <CardHeader>
              <CardTitle>Estrutura de Comissões</CardTitle>
              <CardDescription>
                Ganhe diferentes valores baseado no plano escolhido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
                  <div>
                    <div className="font-medium">Plano Pro</div>
                    <div className="text-sm text-muted-foreground">R$ 19,90/mês</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    R$ 20,00
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
                  <div>
                    <div className="font-medium">Plano Premium</div>
                    <div className="text-sm text-muted-foreground">R$ 99,90/mês</div>
                  </div>
                  <Badge className="bg-bitcoin text-white">
                    R$ 100,00
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-bitcoin/10 rounded-lg border border-bitcoin/20">
                <h4 className="font-medium mb-2 text-bitcoin">💰 Saldo Disponível</h4>
                <div className="text-2xl font-bold">R$ {referralStats.pendingEarnings.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Próximo pagamento em 5 dias</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicações Recentes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Indicações Recentes</CardTitle>
            <CardDescription>
              Acompanhe o status das suas indicações mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReferrals.map((referral, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{referral.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Plano {referral.plan} • {referral.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R$ {referral.earnings.toFixed(2)}</div>
                    <Badge 
                      variant={referral.status === 'active' ? 'default' : 'secondary'}
                      className={referral.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {referral.status === 'active' ? 'Ativo' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralProgram;

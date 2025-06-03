
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { useReferral } from '@/contexts/referral/ReferralContext';
import { Gift, Users, Share, Copy, Trophy, Coins, Star, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReferralProgram: React.FC = () => {
  const { user, userPlan } = useAuth();
  const { 
    referralCode, 
    totalReferrals, 
    referralsNeeded, 
    referralHistory, 
    isLoading,
    generateReferralCode,
    shareReferralLink,
    copyReferralCode
  } = useReferral();
  
  const [copiedCode, setCopiedCode] = useState(false);
  
  const handleCopyCode = async () => {
    await copyReferralCode();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isPremium = userPlan === 'premium';
  const progress = ((totalReferrals % 20) / 20) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold mb-4">
            Programa de <span className="text-bitcoin">Indicações</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Indique amigos para o SatoTrack e ganhe 1 mês Premium a cada 20 indicações válidas. 
            Seus amigos também ganham benefícios ao se cadastrar!
          </p>
        </div>

        {/* Status Premium */}
        {isPremium && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-bitcoin/10 to-bitcoin/20 border-bitcoin/30">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-bitcoin mx-auto mb-2" />
                <h3 className="text-xl font-bold text-bitcoin">🌟 Usuário Premium Ativo</h3>
                <p className="text-muted-foreground">Você tem acesso completo a todas as funcionalidades!</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-bitcoin mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total de Indicações</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.floor(totalReferrals / 20)}</div>
              <div className="text-sm text-muted-foreground">Prêmios Ganhos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{referralsNeeded}</div>
              <div className="text-sm text-muted-foreground">Faltam para Próximo</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Coins className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Progresso Atual</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seu Código de Referência */}
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
                      className="font-mono text-center text-lg"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleCopyCode}
                      className={copiedCode ? 'bg-green-100' : ''}
                      disabled={isLoading}
                    >
                      <Copy className="h-4 w-4" />
                      {copiedCode ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={shareReferralLink} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar Link
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={generateReferralCode} 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {isLoading ? 'Gerando...' : 'Gerar Código de Indicação'}
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
            </CardContent>
          </Card>

          {/* Sistema de Recompensas */}
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Recompensas</CardTitle>
              <CardDescription>
                Veja o que você ganha a cada marco de indicações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
                  <div>
                    <div className="font-medium">20 Indicações</div>
                    <div className="text-sm text-muted-foreground">Primeiro marco</div>
                  </div>
                  <Badge className="bg-bitcoin text-white">
                    1 Mês Premium
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
                  <div>
                    <div className="font-medium">40 Indicações</div>
                    <div className="text-sm text-muted-foreground">Segundo marco</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    +1 Mês Premium
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-dashboard-medium/30 rounded">
                  <div>
                    <div className="font-medium">60+ Indicações</div>
                    <div className="text-sm text-muted-foreground">Cada 20 indicações</div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    +1 Mês Premium
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-bitcoin/10 rounded-lg border border-bitcoin/20">
                <h4 className="font-medium mb-2 text-bitcoin">🎯 Próxima Meta</h4>
                <div className="text-lg font-bold">
                  {referralsNeeded === 20 ? '20 indicações' : `${referralsNeeded} indicações restantes`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Para ganhar 1 mês Premium gratuito
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Indicações */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Histórico de Indicações</CardTitle>
            <CardDescription>
              Acompanhe suas indicações mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referralHistory.length > 0 ? (
              <div className="space-y-4">
                {referralHistory.map((referral, index) => (
                  <div key={referral.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{referral.referred_user_email}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Badge 
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      className={referral.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {referral.status === 'completed' ? 'Válida' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Você ainda não fez nenhuma indicação. Comece compartilhando seu código!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralProgram;

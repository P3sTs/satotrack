
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings,
  Users,
  Image,
  Activity,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalNFTs: number;
  totalCollections: number;
  pendingVerifications: number;
  totalVolume: string;
  dailyMints: number;
}

interface PendingVerification {
  id: string;
  collectionName: string;
  creator: string;
  network: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const adminStats: AdminStats = {
    totalUsers: 1247,
    totalNFTs: 8956,
    totalCollections: 156,
    pendingVerifications: 7,
    totalVolume: '2,345.8',
    dailyMints: 89
  };

  const pendingVerifications: PendingVerification[] = [
    {
      id: '1',
      collectionName: 'Digital Art Masters',
      creator: '0x742d35Cc6632C0532925a3b8DA4C0b07f3b5c7E2',
      network: 'ethereum',
      submittedAt: '2024-01-20',
      status: 'pending'
    },
    {
      id: '2',
      collectionName: 'Crypto Legends V2',
      creator: '0x8ba1f109551bD432803012645Hac136c8d2BD1c7',
      network: 'polygon',
      submittedAt: '2024-01-19',
      status: 'pending'
    }
  ];

  const handleVerifyCollection = async (id: string, approved: boolean) => {
    setIsLoading(true);
    try {
      console.log(`${approved ? '✅ Aprovando' : '❌ Rejeitando'} coleção:`, id);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Coleção ${approved ? 'aprovada' : 'rejeitada'} com sucesso!`);
      
    } catch (error) {
      console.error('Error verifying collection:', error);
      toast.error('Erro ao processar verificação');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'overview', name: 'Visão Geral', icon: TrendingUp },
    { id: 'verifications', name: 'Verificações', icon: Shield },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'activity', name: 'Atividade', icon: Activity },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Warning */}
      <Card className="bg-red-900/20 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-300">🔒 Painel Administrativo</p>
              <p className="text-sm text-red-200 mt-1">
                Acesso restrito. Todas as ações são registradas e auditadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={isActive ? "bg-satotrack-neon text-black" : ""}
            >
              <Icon className="h-4 w-4 mr-2" />
              {section.name}
            </Button>
          );
        })}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-blue-400">{adminStats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">Usuários</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Image className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-purple-400">{adminStats.totalNFTs}</p>
                <p className="text-xs text-muted-foreground">NFTs</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-green-400">{adminStats.totalCollections}</p>
                <p className="text-xs text-muted-foreground">Coleções</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-orange-400">{adminStats.pendingVerifications}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-satotrack-neon/10 to-green-500/10 border-satotrack-neon/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-satotrack-neon mx-auto mb-2" />
                <p className="text-xl font-bold text-satotrack-neon">{adminStats.totalVolume}</p>
                <p className="text-xs text-muted-foreground">Volume ETH</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border-cyan-500/20">
              <CardContent className="p-4 text-center">
                <Activity className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-cyan-400">{adminStats.dailyMints}</p>
                <p className="text-xs text-muted-foreground">Mints Hoje</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Verifications Section */}
      {activeSection === 'verifications' && (
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-satotrack-neon" />
                Verificações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingVerifications.map((verification) => (
                <div key={verification.id} className="p-4 bg-dashboard-medium/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{verification.collectionName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submetido em {verification.submittedAt}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                      {verification.network}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">Criador:</p>
                    <p className="font-mono text-xs text-white">{verification.creator}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerifyCollection(verification.id, true)}
                      disabled={isLoading}
                      size="sm"
                      className="bg-green-500 text-white"
                    >
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleVerifyCollection(verification.id, false)}
                      disabled={isLoading}
                      size="sm"
                      variant="destructive"
                    >
                      <XCircle className="h-3 w-3 mr-2" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="h-3 w-3 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
              
              {pendingVerifications.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhuma verificação pendente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-satotrack-neon" />
                Gestão de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <Input placeholder="Buscar usuário..." className="flex-1" />
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Lista de usuários</p>
                <p className="text-sm text-muted-foreground">Feature em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Section */}
      {activeSection === 'activity' && (
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-satotrack-neon" />
                Log de Atividades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Logs de atividade do sistema</p>
                <p className="text-sm text-muted-foreground">Feature em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-satotrack-neon" />
                Configurações da Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Configurações administrativas</p>
                <p className="text-sm text-muted-foreground">Feature em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

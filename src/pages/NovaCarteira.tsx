
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, ArrowLeft } from 'lucide-react';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const NovaCarteira: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    rede: 'bitcoin'
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate wallet creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Carteira adicionada com sucesso!');
      navigate('/carteiras');
    } catch (error) {
      toast.error('Erro ao adicionar carteira');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedGradientBackground 
        startingGap={120}
        Breathing={true}
        gradientColors={["#0A0A0A", "#00ff88", "#0080ff", "#8000ff", "#ff0080"]}
        gradientStops={[20, 40, 60, 80, 100]}
      />
      
      <div className="relative z-10 min-h-screen bg-background/80">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="text-satotrack-neon hover:bg-satotrack-neon/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-satotrack-neon">Nova Carteira</h1>
                <p className="text-muted-foreground">Adicione uma nova carteira ao seu portfólio</p>
              </div>
            </div>

            {/* Form */}
            <Card className="max-w-2xl mx-auto bg-dashboard-medium/50 border-satotrack-neon/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                  <Wallet className="h-5 w-5" />
                  Informações da Carteira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Carteira</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Carteira Principal"
                      required
                      className="bg-dashboard-dark border-dashboard-light/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rede">Rede</Label>
                    <Select
                      value={formData.rede}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, rede: value }))}
                    >
                      <SelectTrigger className="bg-dashboard-dark border-dashboard-light/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="polygon">Polygon (MATIC)</SelectItem>
                        <SelectItem value="litecoin">Litecoin (LTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço da Carteira</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Cole o endereço da carteira aqui"
                      required
                      className="bg-dashboard-dark border-dashboard-light/30 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite ou cole o endereço público da sua carteira
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Carteira
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NovaCarteira;

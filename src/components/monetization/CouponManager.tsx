
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Copy, Tag, Calendar, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'SATOX20',
      type: 'percentage',
      value: 20,
      maxUses: 1000,
      currentUses: 347,
      expiresAt: '2024-03-31',
      isActive: true,
      description: 'Desconto para influencers crypto'
    },
    {
      id: '2',
      code: 'WELCOME50',
      type: 'fixed',
      value: 50,
      maxUses: 500,
      currentUses: 123,
      expiresAt: '2024-12-31',
      isActive: true,
      description: 'Cupom de boas-vindas'
    },
    {
      id: '3',
      code: 'BLACKFRIDAY',
      type: 'percentage',
      value: 50,
      maxUses: 2000,
      currentUses: 1890,
      expiresAt: '2024-01-31',
      isActive: false,
      description: 'Promoção Black Friday 2023'
    }
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    maxUses: 100,
    expiresAt: '',
    description: ''
  });

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SATO';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code: result });
  };

  const copyCouponCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Código copiado!",
        description: `Cupom ${code} copiado para a área de transferência.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código.",
        variant: "destructive"
      });
    }
  };

  const createCoupon = () => {
    if (!newCoupon.code || !newCoupon.value || !newCoupon.expiresAt) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const coupon: Coupon = {
      id: Date.now().toString(),
      ...newCoupon,
      currentUses: 0,
      isActive: true
    };

    setCoupons([coupon, ...coupons]);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      maxUses: 100,
      expiresAt: '',
      description: ''
    });

    toast({
      title: "Cupom criado!",
      description: `Cupom ${coupon.code} criado com sucesso.`,
    });
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
    toast({
      title: "Cupom excluído",
      description: "Cupom removido com sucesso.",
    });
  };

  const formatValue = (coupon: Coupon) => {
    return coupon.type === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value}`;
  };

  const getUsagePercentage = (coupon: Coupon) => {
    return (coupon.currentUses / coupon.maxUses) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciador de Cupons</h2>
          <p className="text-muted-foreground">Crie e gerencie cupons de desconto para campanhas</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Cupons Ativos</TabsTrigger>
          <TabsTrigger value="expired">Expirados/Inativos</TabsTrigger>
          <TabsTrigger value="create">Criar Novo</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {coupons.filter(c => c.isActive).map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-bitcoin text-white font-mono text-lg px-3 py-1">
                          {coupon.code}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyCouponCode(coupon.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span>Desconto: {formatValue(coupon)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{coupon.currentUses}/{coupon.maxUses} usos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Expira: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-bitcoin h-2 rounded-full transition-all"
                          style={{ width: `${getUsagePercentage(coupon)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleCouponStatus(coupon.id)}
                      >
                        {coupon.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteCoupon(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <div className="grid gap-4">
            {coupons.filter(c => !c.isActive).map((coupon) => (
              <Card key={coupon.id} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
                          {coupon.code}
                        </Badge>
                        <Badge variant="outline">Inativo</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Desconto: {formatValue(coupon)}</span>
                        <span>{coupon.currentUses}/{coupon.maxUses} usos</span>
                        <span>Expirou: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteCoupon(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Cupom</CardTitle>
              <CardDescription>Configure um novo cupom de desconto para suas campanhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código do Cupom</label>
                  <div className="flex gap-2">
                    <Input
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="Ex: SATO20"
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={generateCouponCode}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Desconto</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Valor {newCoupon.type === 'percentage' ? '(%)' : '(R$)'}
                  </label>
                  <Input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                    placeholder={newCoupon.type === 'percentage' ? '20' : '50'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Máximo de Usos</label>
                  <Input
                    type="number"
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Expiração</label>
                  <Input
                    type="date"
                    value={newCoupon.expiresAt}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    placeholder="Descrição da campanha"
                  />
                </div>
              </div>

              <Button onClick={createCoupon} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Cupom
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CouponManager;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

const Historico = () => {
  const { user } = useAuth();
  const { carteiras } = useCarteiras();
  
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock transactions data
  const mockTransactions = [
    {
      id: '1',
      date: '2025-05-10T14:32:00Z',
      value: 0.05,
      valueUsd: 3245.67,
      type: 'entrada',
      hash: '3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0',
      status: 'confirmada'
    },
    {
      id: '2',
      date: '2025-05-08T09:15:00Z',
      value: 0.02,
      valueUsd: 1298.45,
      type: 'saida',
      hash: '9d8c7b6a5z4y3x2w1v0u9t8s7r6q5p4o3n2m1l0k9j8i7h6g5f4e3d2c1b0a',
      status: 'confirmada'
    },
    {
      id: '3',
      date: '2025-05-05T18:47:00Z',
      value: 0.01,
      valueUsd: 649.12,
      type: 'entrada',
      hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d',
      status: 'confirmada'
    },
    {
      id: '4',
      date: '2025-05-01T11:22:00Z',
      value: 0.03,
      valueUsd: 1947.36,
      type: 'saida',
      hash: '0z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w',
      status: 'confirmada'
    }
  ];
  
  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.value.toString().includes(searchQuery);
    
    return matchesType && matchesSearch;
  });
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Você precisa estar logado para visualizar o histórico.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Histórico de Transações</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as transações por carteira, período ou tipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Carteira</Label>
              <Select 
                value={selectedWallet || ''}
                onValueChange={setSelectedWallet}
              >
                <SelectTrigger id="wallet">
                  <SelectValue placeholder="Todas as carteiras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as carteiras</SelectItem>
                  {carteiras.map(carteira => (
                    <SelectItem key={carteira.id} value={carteira.id}>
                      {carteira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select 
                value={periodFilter}
                onValueChange={setPeriodFilter}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="saida">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="flex gap-2">
                <Input 
                  id="search"
                  placeholder="Hash ou valor"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            Mostrando {filteredTransactions.length} transações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dashboard-medium/30">
                  <th className="text-left py-2 px-4">Data</th>
                  <th className="text-left py-2 px-4">Tipo</th>
                  <th className="text-left py-2 px-4">Valor (BTC)</th>
                  <th className="text-left py-2 px-4">Valor (USD)</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-dashboard-medium/20 hover:bg-dashboard-medium/10">
                    <td className="py-3 px-4">
                      {new Date(tx.date).toLocaleDateString()} {' '}
                      {new Date(tx.date).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      {tx.type === 'entrada' ? (
                        <span className="flex items-center text-green-500">
                          <ArrowDown className="mr-1 h-4 w-4" />
                          Entrada
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <ArrowUp className="mr-1 h-4 w-4" />
                          Saída
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {tx.value.toFixed(8)}
                    </td>
                    <td className="py-3 px-4">
                      ${tx.valueUsd.toLocaleString('en-US')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="truncate max-w-32">{tx.hash}</span>
                        <a 
                          href={`https://www.blockchain.com/explorer/transactions/btc/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Nenhuma transação encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Historico;

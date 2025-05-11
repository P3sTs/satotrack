
import React, { useState } from 'react';
import { TransacaoBTC } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ListViewProps {
  transacoes: TransacaoBTC[];
}

type SortField = 'data' | 'valor';
type SortDirection = 'asc' | 'desc';

const ListView: React.FC<ListViewProps> = ({ transacoes }) => {
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter transactions by search term
  const filteredTransactions = transacoes.filter(tx => 
    tx.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.txid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'data') {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortDirection === 'asc' ? a.valor - b.valor : b.valor - a.valor;
    }
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              placeholder="Buscar por endereço ou ID da transação..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('data')}
                  >
                    <div className="flex items-center gap-1">
                      Data 
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('valor')}
                  >
                    <div className="flex items-center gap-1">
                      Valor (BTC) 
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Endereço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((tx) => (
                    <TableRow key={tx.txid}>
                      <TableCell className="font-medium">
                        {formatDate(tx.data)}
                      </TableCell>
                      <TableCell>
                        {tx.tipo === 'entrada' ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <ArrowDownIcon className="h-4 w-4" />
                            <span>Recebido</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-500">
                            <ArrowUpIcon className="h-4 w-4" />
                            <span>Enviado</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className={tx.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}>
                        {formatBitcoinValue(tx.valor)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell truncate max-w-[200px]" title={tx.endereco}>
                        {tx.endereco}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListView;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar } from 'lucide-react';

const Historico: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-satotrack-text mb-2">
          📊 Histórico Completo
        </h1>
        <p className="text-muted-foreground">
          Acesse o histórico completo de todas as suas transações e relatórios
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros e Exportação
            </CardTitle>
            <CardDescription>
              Configure o período e formato dos dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar Período
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <p className="font-medium">Transação Premium - Dados Completos</p>
                <p className="text-sm text-muted-foreground">
                  Acesso completo ao histórico com análises detalhadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Historico;

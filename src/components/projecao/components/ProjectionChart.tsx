
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ProjectionDataPoint } from '../types/projectionTypes';

interface ProjectionChartProps {
  data: ProjectionDataPoint[];
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-dashboard-light">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-satotrack-neon" />
          Projeção de Crescimento Patrimonial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'value' ? 'Valor Projetado' : name
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="conservative"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                name="Conservador"
              />
              <Area
                type="monotone"
                dataKey="moderate"
                stackId="2"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                name="Moderado"
              />
              <Area
                type="monotone"
                dataKey="aggressive"
                stackId="3"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.1}
                name="Agressivo"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00d4ff"
                strokeWidth={3}
                dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }}
                name="Cenário Selecionado"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionChart;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { FileText, Download, Calendar, TrendingUp, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MonthlyReport {
  month: string;
  totalValue: number;
  transactions: number;
  topWallet: string;
  performance: number;
}

const mockReports: MonthlyReport[] = [
  {
    month: 'Novembro 2024',
    totalValue: 0.15432,
    transactions: 23,
    topWallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    performance: 12.5
  },
  {
    month: 'Outubro 2024',
    totalValue: 0.14821,
    transactions: 18,
    topWallet: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    performance: -3.2
  },
  {
    month: 'Setembro 2024',
    totalValue: 0.16234,
    transactions: 31,
    topWallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    performance: 8.7
  }
];

export const ReportGenerator: React.FC = () => {
  const { userPlan, upgradeUserPlan } = useAuth();
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleUpgrade = async () => {
    try {
      await upgradeUserPlan();
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o upgrade. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const generateReport = async (month: string) => {
    if (userPlan !== 'premium') {
      toast({
        title: "Recurso Premium",
        description: "Relatórios mensais são exclusivos para usuários Premium.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingReport(true);
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Relatório gerado",
        description: `Relatório de ${month} foi gerado com sucesso!`,
      });
      
      // Aqui você implementaria o download real do relatório
      console.log(`Generating report for ${month}`);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (userPlan !== 'premium') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-bitcoin" />
            Relatórios Mensais Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Relatórios Detalhados</h3>
            <p className="text-muted-foreground mb-4">
              Acesse relatórios mensais detalhados com análises de performance, 
              distribuição de carteiras e insights de mercado.
            </p>
            <Button 
              onClick={handleUpgrade}
              className="bg-bitcoin hover:bg-bitcoin/90 text-white"
            >
              Upgrade para Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatórios Mensais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {mockReports.map((report, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{report.month}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Valor Total:</span>
                      <div className="font-mono">{report.totalValue} BTC</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transações:</span>
                      <div>{report.transactions}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className={`h-4 w-4 ${report.performance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={report.performance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {report.performance >= 0 ? '+' : ''}{report.performance}%
                    </span>
                    <span className="text-muted-foreground">vs mês anterior</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport(report.month)}
                  disabled={generatingReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {generatingReport ? 'Gerando...' : 'Download'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Relatórios são gerados automaticamente todo mês para usuários Premium
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;

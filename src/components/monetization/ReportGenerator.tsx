
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Download, Lock, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { CarteiraBTC } from '@/types/types';

interface ReportGeneratorProps {
  carteira: CarteiraBTC;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ carteira }) => {
  const { userPlan, upgradeUserPlan } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const isPremium = userPlan === 'premium';
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      toast.success("Relatório gerado com sucesso!");
    }, 2000);
  };
  
  const handleDownloadReport = () => {
    // In a real app, this would download the actual PDF
    toast.success("Download do relatório iniciado.");
    
    // Create a fake PDF download for demo purposes
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/pdf;charset=utf-8,');
    element.setAttribute('download', `relatorio-${carteira.nome.replace(/\s+/g, '_')}.pdf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Relatório Profissional
        </CardTitle>
        <CardDescription>
          {isPremium 
            ? "Gere relatórios detalhados da sua carteira" 
            : "Recurso disponível para usuários Premium ou compra avulsa"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Gráficos de entrada/saída de BTC</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Histórico dos últimos 30 dias</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Insights sobre transações</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Análise de desempenho</span>
          </div>
        </div>
        
        {reportGenerated && (
          <div className="mt-4 p-3 bg-muted rounded-md flex justify-between items-center">
            <div>
              <p className="font-medium">Relatório pronto!</p>
              <p className="text-xs text-muted-foreground">
                {carteira.nome} - {new Date().toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isPremium ? (
          <Button 
            onClick={handleGenerateReport} 
            className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="animate-pulse rounded-full h-3 w-3 mr-2 bg-current"></span>
                Gerando relatório...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                {reportGenerated ? 'Gerar novo relatório' : 'Gerar relatório'}
              </>
            )}
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Gerar relatório
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Relatório Profissional</AlertDialogTitle>
                <AlertDialogDescription>
                  Escolha como deseja obter seu relatório profissional:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <h4 className="font-medium">Compra avulsa</h4>
                    <p className="text-sm text-muted-foreground">Relatório único para esta carteira</p>
                  </div>
                  <Button>R$ 9,90</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Plano Premium</h4>
                    <p className="text-sm text-muted-foreground">Relatórios ilimitados + todos os recursos</p>
                  </div>
                  <Button onClick={upgradeUserPlan} className="bg-bitcoin hover:bg-bitcoin/90 text-white">
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Continuar com compra avulsa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

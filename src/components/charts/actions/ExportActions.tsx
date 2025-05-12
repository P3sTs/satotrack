
import React from 'react';
import { Download, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Export CSV Button
export const ExportCSVButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Exportar CSV</span>
    </Button>
  );
};

// Screenshot Button
export const ScreenshotButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <Camera className="h-4 w-4" />
      <span className="hidden sm:inline">Screenshot</span>
    </Button>
  );
};

// Export Actions Hook
export const useExportActions = (
  chartRef: React.RefObject<HTMLDivElement>,
  chartMode: 'price' | 'balance',
  timeRange: string,
  wallet?: any,
  isPremium: boolean = false
) => {
  const { toast } = useToast();

  const handleExportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Date,Price\n';
      
      // Add data rows based on chart mode
      // Here you would add your actual data
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `bitcoin_${chartMode}_${timeRange}.csv`);
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Os dados foram exportados com sucesso.",
      });
    } catch (e) {
      console.error('Error exporting data:', e);
      toast({
        title: "Erro ao exportar dados",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleScreenshot = async () => {
    if (!chartRef.current) {
      toast({
        title: "Erro ao gerar screenshot",
        description: "Elemento do gráfico não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Show loading toast
      toast({
        title: "Gerando screenshot...",
        description: "Por favor, aguarde.",
      });
      
      // Generate the canvas
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Falha ao gerar a imagem");
        }
        
        // Save the file
        saveAs(
          blob, 
          `bitcoin_chart_${new Date().toISOString().slice(0, 10)}.png`
        );
        
        toast({
          title: "Screenshot gerado",
          description: "A imagem foi salva com sucesso.",
        });
      }, "image/png");
    } catch (e) {
      console.error('Error taking screenshot:', e);
      toast({
        title: "Erro ao gerar screenshot",
        description: "Não foi possível gerar a imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { handleExportCSV, handleScreenshot };
};

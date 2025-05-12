
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Camera } from 'lucide-react';
import { CarteiraBTC } from '@/types/types';
import { toast } from "@/components/ui/sonner";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { TimeRange } from '../selectors/TimeRangeSelector';
import { ChartMode } from '../selectors/ChartModeSelector';

interface ExportActionsProps {
  exportCSV: () => void;
  captureScreenshot: () => Promise<void>;
}

export const ExportCSVButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center gap-1"
      onClick={onClick}
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Exportar CSV</span>
    </Button>
  );
};

export const ScreenshotButton: React.FC<{ onClick: () => Promise<void> }> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="h-9 w-9"
      title="Capturar screenshot"
    >
      <Camera className="h-4 w-4" />
    </Button>
  );
};

export const useExportActions = (
  chartRef: React.RefObject<HTMLDivElement>,
  chartMode: ChartMode,
  timeRange: TimeRange,
  currentWallet?: CarteiraBTC,
  isPremium?: boolean
) => {
  const handleExportCSV = () => {
    // For period greater than 30D, show premium modal for non-premium users
    if (!isPremium && (timeRange === '6M' || timeRange === '1Y')) {
      return false;
    }
    
    // Generate CSV for the current chart data
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (chartMode === 'price') {
      // Headers for price data
      csvContent += "Data,Preço (USD)\n";
      // Add dummy data or actual data from the chart
      csvContent += "2023-01-01,45000\n";
      csvContent += "2023-01-02,46000\n";
      // ... more data points
    } else {
      // Headers for balance data
      csvContent += "Data,Saldo (BTC)\n";
      // Add dummy data or actual data from the chart
      csvContent += "2023-01-01,0.5\n";
      csvContent += "2023-01-02,0.52\n";
      // ... more data points
    }
    
    // Create the download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${chartMode === 'price' ? 'bitcoin_price' : currentWallet?.nome || 'wallet'}_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dados exportados com sucesso");
    
    return true;
  };
  
  const handleScreenshot = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const image = canvas.toDataURL("image/png");
        saveAs(
          image, 
          `satotrack_${chartMode === 'price' ? 'bitcoin' : currentWallet?.nome || 'wallet'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`
        );
        toast.success("Screenshot salva com sucesso");
      } catch (error) {
        console.error("Erro ao capturar screenshot:", error);
        toast.error("Erro ao salvar screenshot");
      }
    }
  };

  return { 
    handleExportCSV, 
    handleScreenshot 
  };
};

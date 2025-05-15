
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { CarteiraBTC } from '@/types/types';

export interface ExportActionsProps {
  chartMode: string;
  timeRange: string;
  walletName?: string;
  isPremium: boolean;
}

export const ExportCSVButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      title="Exportar dados CSV"
    >
      <FileText className="h-4 w-4" />
    </Button>
  );
};

export const ScreenshotButton: React.FC<{ 
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}> = ({ onClick, disabled, title }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      title={title || "Capturar imagem"}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};

export const useExportActions = (
  chartRef: React.RefObject<HTMLDivElement>,
  chartMode: string,
  timeRange: string,
  currentWallet?: CarteiraBTC,
  isPremium: boolean = false
) => {
  const handleExportCSV = () => {
    // Check if premium feature is available
    if (!isPremium) {
      console.warn("Feature limited to premium users");
      return;
    }

    // Generate CSV data
    const headers = "date,value\n";
    const csvData = headers + "2023-01-01,100\n2023-01-02,110\n";
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `satotrack-${chartMode}-${timeRange.toLowerCase()}.csv`);
  };

  const handleScreenshot = async () => {
    // Check if premium feature is available
    if (!isPremium) {
      console.warn("Feature limited to premium users");
      return;
    }

    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => {
        if (blob) {
          const walletName = currentWallet?.nome || "bitcoin";
          const timestamp = new Date().toISOString().split("T")[0];
          saveAs(blob, `satotrack-${walletName}-${timestamp}.png`);
        }
      });
    } catch (error) {
      console.error("Error taking screenshot:", error);
    }
  };

  return {
    handleExportCSV,
    handleScreenshot
  };
};

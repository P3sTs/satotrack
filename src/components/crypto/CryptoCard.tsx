
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlockcypherData, CryptoCurrency } from '@/hooks/useBlockcypherData';
import { RefreshCw, ExternalLink, Camera, Clock, Box, ArrowDown, ArrowUp, Network, Activity } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatTimeAgo } from '@/utils/formatters';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

interface CryptoCardProps {
  data: BlockcypherData | null;
  currency: CryptoCurrency;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  error: Error | null;
}

const currencyIcons: Record<CryptoCurrency, string> = {
  btc: "/lovable-uploads/2546f1a5-747c-4fcb-a3e6-78c47d00982a.png",
  ltc: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
  dash: "https://cryptologos.cc/logos/dash-dash-logo.png",
  doge: "https://cryptologos.cc/logos/dogecoin-doge-logo.png"
};

const currencyNames: Record<CryptoCurrency, string> = {
  btc: "Bitcoin",
  ltc: "Litecoin",
  dash: "Dash",
  doge: "Dogecoin"
};

const currencyColors: Record<CryptoCurrency, string> = {
  btc: "bg-bitcoin text-white",
  ltc: "bg-blue-500 text-white",
  dash: "bg-blue-700 text-white",
  doge: "bg-yellow-500 text-white"
};

const CryptoCard: React.FC<CryptoCardProps> = ({
  data,
  currency,
  isLoading,
  isRefreshing,
  lastUpdated,
  onRefresh,
  error
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#1E1E2E",
        logging: false
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${currencyNames[currency]}-data-${new Date().toISOString().split('T')[0]}.png`);
        }
      });
    } catch (err) {
      console.error("Error capturing screenshot:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const renderFeeInfo = (label: string, value: number | undefined) => {
    if (value === undefined) return null;
    
    return (
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground">{label}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Taxa em satoshis por kilobyte</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="font-mono">{value.toLocaleString()} sat/kb</span>
      </div>
    );
  };

  const statusColor = error ? "bg-red-500" : "bg-green-500";
  const formattedTime = data?.time ? new Date(data.time).toLocaleString() : "N/A";
  
  const truncateHash = (hash: string | undefined) => {
    if (!hash) return "N/A";
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  return (
    <Card ref={cardRef} className="overflow-hidden h-full transition-all hover:shadow-lg">
      <CardHeader className={`${currencyColors[currency]} py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={currencyIcons[currency]} 
              alt={`${currencyNames[currency]} logo`} 
              className="h-8 w-8 mr-2 rounded-full bg-white p-1"
            />
            <div>
              <CardTitle>{currencyNames[currency]}</CardTitle>
              <CardDescription className="text-white/90">
                {data?.name || `${currency.toUpperCase()} Network`}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {isLoading && !data ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">
            <p>Failed to load data</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Altura do bloco</span>
                </div>
                <p className="font-semibold text-lg">{data?.height?.toLocaleString() || "N/A"}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tempo</span>
                </div>
                <p className="font-mono">{formattedTime}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Hash atual</span>
              </div>
              <p className="font-mono text-sm break-all">{data?.hash || "N/A"}</p>
              {data?.latest_url && (
                <a 
                  href={data.latest_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 text-blue-500 hover:underline"
                >
                  Ver bloco atual
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Hash anterior</span>
              </div>
              <p className="font-mono text-sm break-all">{data?.previous_hash || "N/A"}</p>
              {data?.previous_url && (
                <a 
                  href={data.previous_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 text-blue-500 hover:underline"
                >
                  Ver bloco anterior
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Peers</span>
                </div>
                <p className="font-semibold">{data?.peer_count?.toLocaleString() || "N/A"}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Não confirmadas</span>
                </div>
                <p className="font-semibold">{data?.unconfirmed_count?.toLocaleString() || "N/A"}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <h4 className="mb-2 font-medium">Taxas de transação</h4>
              <div className="space-y-1">
                {renderFeeInfo("Taxa Alta", data?.high_fee_per_kb)}
                {renderFeeInfo("Taxa Média", data?.medium_fee_per_kb)}
                {renderFeeInfo("Taxa Baixa", data?.low_fee_per_kb)}
              </div>
            </div>
            
            {data?.last_fork_height && (
              <div className="pt-2 border-t border-border">
                <h4 className="mb-2 font-medium">Último Fork</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Altura</span>
                    <span className="font-mono">{data.last_fork_height.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Hash</span>
                    <p className="font-mono text-xs break-all">{truncateHash(data.last_fork_hash)}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border mt-4">
        <div className="text-xs text-muted-foreground">
          {lastUpdated ? (
            <>Atualizado {formatTimeAgo(lastUpdated)}</>
          ) : (
            <>Sem dados</>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleScreenshot}
          disabled={isCapturing || !data}
        >
          <Camera className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Screenshot</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CryptoCard;

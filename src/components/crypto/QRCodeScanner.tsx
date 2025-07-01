
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Usar câmera traseira se disponível
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        startScanning();
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      setHasPermission(false);
      toast.error('Não foi possível acessar a câmera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simular detecção de QR Code (em produção, usar uma lib como jsQR)
      // Por ora, vamos permitir input manual via prompt
      const qrData = detectQRCode(imageData);
      if (qrData) {
        onScan(qrData);
        stopCamera();
        return;
      }

      if (isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    requestAnimationFrame(scanFrame);
  };

  // Função simulada de detecção de QR Code
  const detectQRCode = (imageData: ImageData): string | null => {
    // Em um cenário real, você usaria uma biblioteca como jsQR aqui
    // Por enquanto, retornamos null para permitir o fluxo continuar
    return null;
  };

  const handleManualInput = () => {
    const address = prompt('Cole o endereço da carteira:');
    if (address && address.trim()) {
      onScan(address.trim());
      stopCamera();
    }
  };

  if (hasPermission === false) {
    return (
      <div className="text-center p-6 space-y-4">
        <CameraOff className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-satotrack-text">Câmera não acessível</p>
        <Button
          onClick={handleManualInput}
          className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
        >
          Inserir endereço manualmente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-sm mx-auto">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scanner overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-satotrack-neon rounded-lg relative">
            {/* Corner indicators */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-satotrack-neon"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-satotrack-neon"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-satotrack-neon"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-satotrack-neon"></div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-satotrack-text">
          Posicione o QR code dentro do quadro
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={stopCamera}
            className="border-dashboard-medium text-satotrack-text"
          >
            <CameraOff className="h-4 w-4 mr-2" />
            Parar
          </Button>
          
          <Button
            onClick={handleManualInput}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            Inserir Manualmente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;

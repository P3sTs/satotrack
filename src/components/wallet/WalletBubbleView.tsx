
import React, { useState, useEffect, useRef } from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { formatBitcoinValue } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Bubble {
  id: string;
  name: string;
  value: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  velocityX: number;
  velocityY: number;
}

const WalletBubbleView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Criar bolhas para cada carteira
    const newBubbles: Bubble[] = carteiras.map((wallet) => {
      // Definir o tamanho da bolha com base no saldo
      const saldoNormalizado = Math.max(20, Math.min(100, wallet.saldo * 100));
      const radius = Math.sqrt(saldoNormalizado) * 4;
      
      // Cores baseadas no saldo
      let color;
      if (wallet.saldo > 1) {
        color = 'rgba(0, 255, 198, 0.8)'; // Verde neon
      } else if (wallet.saldo > 0.1) {
        color = 'rgba(0, 215, 255, 0.8)'; // Azul neon
      } else {
        color = 'rgba(247, 147, 26, 0.8)'; // Laranja bitcoin
      }
      
      return {
        id: wallet.id,
        name: wallet.nome,
        value: wallet.saldo,
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * 400,
        radius,
        color,
        velocityX: (Math.random() - 0.5) * 1,
        velocityY: (Math.random() - 0.5) * 1
      };
    });
    
    setBubbles(newBubbles);
  }, [carteiras]);

  useEffect(() => {
    if (!canvasRef.current || bubbles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ajustar o tamanho do canvas
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Função para desenhar as bolhas
    const drawBubbles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar conexões entre bolhas (linhas finas)
      ctx.beginPath();
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const b1 = bubbles[i];
          const b2 = bubbles[j];
          
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Só conectar bolhas que estão relativamente próximas
          if (distance < 200) {
            const alpha = 1 - distance / 200; // Quanto mais longe, mais transparente
            ctx.strokeStyle = `rgba(0, 255, 198, ${alpha * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
          }
        }
      }
      ctx.stroke();
      
      // Desenhar as bolhas
      bubbles.forEach((bubble) => {
        // Desenhar sombras (efeito de brilho)
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, bubble.radius * 1.5
        );
        gradient.addColorStop(0, `${bubble.color.replace('0.8', '0.3')}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(bubble.x, bubble.y, bubble.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar bolha principal
        ctx.beginPath();
        ctx.fillStyle = bubble.id === selectedBubble ? 
          `rgba(255, 215, 0, 0.8)` : bubble.color;
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Adicionar borda se selecionado
        if (bubble.id === selectedBubble) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Adicionar texto
        ctx.fillStyle = 'white';
        ctx.font = `${Math.max(12, bubble.radius / 3)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.name, bubble.x, bubble.y - 5);
        
        // Adicionar valor
        ctx.font = `${Math.max(10, bubble.radius / 4)}px Arial`;
        ctx.fillText(formatBitcoinValue(bubble.value), bubble.x, bubble.y + 10);
      });
    };
    
    // Função para atualizar a posição das bolhas
    const updatePositions = () => {
      setBubbles(prev => prev.map(bubble => {
        let { x, y, velocityX, velocityY, radius } = bubble;
        
        // Mover a bolha de acordo com a velocidade
        x += velocityX;
        y += velocityY;
        
        // Verificar colisão com as bordas
        if (x - radius < 0) {
          x = radius;
          velocityX = Math.abs(velocityX);
        } else if (x + radius > canvas.width) {
          x = canvas.width - radius;
          velocityX = -Math.abs(velocityX);
        }
        
        if (y - radius < 0) {
          y = radius;
          velocityY = Math.abs(velocityY);
        } else if (y + radius > canvas.height) {
          y = canvas.height - radius;
          velocityY = -Math.abs(velocityY);
        }
        
        // Adicionar um pouco de aleatoriedade ao movimento
        velocityX += (Math.random() - 0.5) * 0.1;
        velocityY += (Math.random() - 0.5) * 0.1;
        
        // Limitar a velocidade
        velocityX = Math.max(-1.5, Math.min(1.5, velocityX));
        velocityY = Math.max(-1.5, Math.min(1.5, velocityY));
        
        return { ...bubble, x, y, velocityX, velocityY };
      }));
    };
    
    // Loop de animação
    let animationId: number;
    const animate = () => {
      drawBubbles();
      updatePositions();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Lidar com cliques no canvas
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Verificar se clicou em alguma bolha
      let clickedBubble: string | null = null;
      for (const bubble of bubbles) {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= bubble.radius) {
          clickedBubble = bubble.id;
          break;
        }
      }
      
      setSelectedBubble(clickedBubble);
      
      // Se clicou em uma bolha, redirecionar para a página da carteira
      if (clickedBubble) {
        // Aqui podemos abrir um modal ou redirecionar
        setTimeout(() => {
          window.location.href = `/carteira/${clickedBubble}`;
        }, 300);
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
    // Limpeza
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [bubbles, selectedBubble]);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  if (carteiras.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>Nenhuma carteira encontrada. Adicione uma carteira para visualizar.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative bg-gradient-to-br from-dashboard-dark to-dashboard-medium rounded-lg border border-dashboard-light overflow-hidden ${
        isFullscreen ? 'fixed top-0 left-0 right-0 bottom-0 z-50' : 'h-[500px]'
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-10 bg-dashboard-dark/70"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
      
      <div className="absolute top-2 left-2 z-10 bg-dashboard-dark/70 px-3 py-1 rounded text-sm">
        Visualização 3D - Clique em uma bolha para ver detalhes
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
      />
      
      {selectedBubble && (
        <div className="absolute bottom-4 left-4 right-4 bg-dashboard-medium border border-dashboard-light rounded-lg p-4 z-10">
          <h4 className="font-medium">
            {carteiras.find(w => w.id === selectedBubble)?.nome}
          </h4>
          <p className="text-sm text-muted-foreground">
            Saldo: {formatBitcoinValue(carteiras.find(w => w.id === selectedBubble)?.saldo || 0)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletBubbleView;

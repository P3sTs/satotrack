import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FluidBackgroundProps {
  className?: string;
  intensity?: number;
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({ 
  className = '', 
  intensity = 0.5 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time * 0.001) * 200,
        canvas.height / 2 + Math.cos(time * 0.0015) * 200,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );

      gradient.addColorStop(0, `rgba(6, 182, 212, ${0.1 * intensity})`);
      gradient.addColorStop(0.3, `rgba(59, 130, 246, ${0.05 * intensity})`);
      gradient.addColorStop(0.6, `rgba(147, 51, 234, ${0.03 * intensity})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Additional floating orbs
      for (let i = 0; i < 3; i++) {
        const x = canvas.width / 2 + Math.sin(time * 0.002 + i) * 300;
        const y = canvas.height / 2 + Math.cos(time * 0.003 + i) * 200;
        const radius = 100 + Math.sin(time * 0.005 + i) * 30;

        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        orbGradient.addColorStop(0, `rgba(0, 255, 198, ${0.08 * intensity})`);
        orbGradient.addColorStop(1, 'rgba(0, 255, 198, 0)');

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 16;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default FluidBackground;
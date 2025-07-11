import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer, AlertTriangle } from 'lucide-react';
import { useGuestAccess } from '@/hooks/useGuestAccess';

export const GuestTimer: React.FC = () => {
  const { isGuestMode, formatRemainingTime, getRemainingTime } = useGuestAccess();
  const [timeLeft, setTimeLeft] = useState('');
  const [isLowTime, setIsLowTime] = useState(false);

  useEffect(() => {
    if (!isGuestMode) return;

    const updateTimer = () => {
      const remaining = getRemainingTime();
      setTimeLeft(formatRemainingTime());
      setIsLowTime(remaining < 10 * 60 * 1000); // Menos de 10 minutos
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isGuestMode, formatRemainingTime, getRemainingTime]);

  if (!isGuestMode) return null;

  return (
    <Badge
      variant="outline"
      className={`${
        isLowTime 
          ? 'border-red-500/30 text-red-400 bg-red-500/10' 
          : 'border-orange-500/30 text-orange-400 bg-orange-500/10'
      } animate-pulse`}
    >
      {isLowTime ? (
        <AlertTriangle className="h-3 w-3 mr-1" />
      ) : (
        <Timer className="h-3 w-3 mr-1" />
      )}
      Visitante: {timeLeft}
    </Badge>
  );
};
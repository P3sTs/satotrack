
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface InteractiveFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionType: 'modal' | 'route';
  actionTarget?: string;
  onCardClick?: () => void;
  premium?: boolean;
  color?: 'blue' | 'purple' | 'emerald' | 'orange' | 'yellow' | 'neon';
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
    border: 'border-blue-500/30 hover:border-blue-500/50',
    text: 'text-blue-400',
    icon: 'text-blue-400'
  },
  purple: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
    border: 'border-purple-500/30 hover:border-purple-500/50',
    text: 'text-purple-400',
    icon: 'text-purple-400'
  },
  emerald: {
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    border: 'border-emerald-500/30 hover:border-emerald-500/50',
    text: 'text-emerald-400',
    icon: 'text-emerald-400'
  },
  orange: {
    bg: 'bg-orange-500/10 hover:bg-orange-500/20',
    border: 'border-orange-500/30 hover:border-orange-500/50',
    text: 'text-orange-400',
    icon: 'text-orange-400'
  },
  yellow: {
    bg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
    border: 'border-yellow-500/30 hover:border-yellow-500/50',
    text: 'text-yellow-400',
    icon: 'text-yellow-400'
  },
  neon: {
    bg: 'bg-satotrack-neon/10 hover:bg-satotrack-neon/20',
    border: 'border-satotrack-neon/30 hover:border-satotrack-neon/50',
    text: 'text-satotrack-neon',
    icon: 'text-satotrack-neon'
  }
};

export const InteractiveFeatureCard: React.FC<InteractiveFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  actionType,
  actionTarget,
  onCardClick,
  premium = false,
  color = 'blue'
}) => {
  const navigate = useNavigate();
  const colorScheme = colorVariants[color];

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    } else if (actionType === 'route' && actionTarget) {
      navigate(actionTarget);
    }
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden",
        "bg-card/50 backdrop-blur-sm border-border/50",
        colorScheme.bg,
        colorScheme.border
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} - ${description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {premium && (
        <div className="absolute top-2 right-2">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-1 rounded-full font-semibold">
            PREMIUM
          </span>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className={cn(
              "p-3 rounded-xl transition-colors duration-300",
              colorScheme.bg.replace('hover:', '')
            )}>
              <Icon className={cn("h-6 w-6", colorScheme.icon)} />
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {actionType === 'modal' ? (
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className={cn("font-semibold text-lg", colorScheme.text)}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-between opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-transparent",
              colorScheme.text
            )}
          >
            <span>Saiba Mais</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

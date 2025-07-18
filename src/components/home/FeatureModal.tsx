
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LucideIcon, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  detailedContent: string;
  actionButton?: {
    text: string;
    route: string;
  };
  color?: 'blue' | 'purple' | 'emerald' | 'orange' | 'yellow' | 'neon';
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    button: 'bg-purple-500 hover:bg-purple-600'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    button: 'bg-emerald-500 hover:bg-emerald-600'
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    button: 'bg-orange-500 hover:bg-orange-600'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    button: 'bg-yellow-500 hover:bg-yellow-600'
  },
  neon: {
    bg: 'bg-satotrack-neon/10',
    text: 'text-satotrack-neon',
    button: 'bg-satotrack-neon text-black hover:bg-satotrack-neon/90'
  }
};

export const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  detailedContent,
  actionButton,
  color = 'blue'
}) => {
  const navigate = useNavigate();
  const colorScheme = colorVariants[color];

  const handleActionClick = () => {
    if (actionButton?.route) {
      navigate(actionButton.route);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", colorScheme.bg)}>
              <Icon className={cn("h-6 w-6", colorScheme.text)} />
            </div>
            <div>
              <DialogTitle className={cn("text-xl", colorScheme.text)}>
                {title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">
              {detailedContent}
            </p>
          </div>

          {actionButton && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                onClick={handleActionClick}
                className={cn("flex-1 gap-2", colorScheme.button)}
              >
                {actionButton.text}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

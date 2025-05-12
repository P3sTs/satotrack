
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { UpgradeButton } from '@/components/monetization/PlanDisplay';

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  title,
  description,
  icon,
  benefits
}) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div className="relative group bg-dashboard-medium/20 border border-border hover:border-satotrack-neon/20 rounded-lg overflow-hidden p-4">
        <div className="absolute inset-0 bg-dashboard-dark/70 backdrop-blur-[2px] flex items-center justify-center z-10">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-satotrack-neon text-satotrack-neon"
            onClick={() => setShowModal(true)}
          >
            <Lock className="h-4 w-4" />
            Desbloquear
          </Button>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        </div>
      </div>
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <h4 className="text-sm font-medium mb-2">Benefícios do Premium</h4>
            <ul className="text-sm space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 bg-satotrack-neon/20 text-satotrack-neon h-4 w-4 rounded-full flex items-center justify-center">
                    <span className="text-[10px]">✓</span>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-end">
            <UpgradeButton />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumFeatureCard;

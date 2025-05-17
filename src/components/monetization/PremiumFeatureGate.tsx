
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Star, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradeButton?: boolean;
  buttonText?: string;
  className?: string;
  messageTitle?: string;
  messageText?: string;
  blockType?: 'overlay' | 'replace';
}

/**
 * Component that conditionally renders content based on the user's premium status.
 * If the user is premium, the children are rendered.
 * Otherwise, a fallback or upgrade message is shown.
 */
const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  children,
  fallback,
  showUpgradeButton = true,
  buttonText = "Desbloquear com Premium",
  className = "",
  messageTitle = "Recurso Premium",
  messageText = "Este recurso está disponível apenas para usuários Premium.",
  blockType = 'overlay'
}) => {
  const { userPlan, isAuthenticated } = useAuth();
  const isPremium = userPlan === 'premium';
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    // Redireciona para login primeiro se não estiver autenticado
    if (!isAuthenticated) {
      navigate('/auth', { state: { redirectTo: '/planos' } });
    } else {
      navigate('/planos');
    }
  };

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (blockType === 'replace') {
    return (
      <div className={`bg-dashboard-medium border border-dashboard-medium/50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center mb-2 text-satotrack-neon">
          <Lock className="h-5 w-5 mr-2" />
          <h3 className="font-medium">{messageTitle}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{messageText}</p>
        
        {showUpgradeButton && (
          <Button 
            variant="bitcoin"
            className="bg-bitcoin hover:bg-bitcoin/90 text-white w-full sm:w-auto"
            onClick={handleUpgradeClick}
          >
            <Star className="h-4 w-4 mr-1" />
            {buttonText}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="opacity-30">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-dashboard-dark/70 to-dashboard-dark/90">
        <div className="text-center p-4 max-w-md">
          <div className="p-3 bg-satotrack-neon/10 rounded-full inline-flex mb-3">
            <Lock className="h-6 w-6 text-satotrack-neon" />
          </div>
          <h3 className="font-medium mb-1">{messageTitle}</h3>
          <p className="text-sm text-muted-foreground mb-4">{messageText}</p>
          
          {showUpgradeButton && (
            <Button 
              variant="bitcoin"
              className="bg-bitcoin hover:bg-bitcoin/90 text-white"
              onClick={handleUpgradeClick}
            >
              <Star className="h-4 w-4 mr-1" />
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureGate;

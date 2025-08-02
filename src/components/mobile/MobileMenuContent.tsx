
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface MobileMenuContentProps {
  setIsMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  getUserInitials: () => string;
  navigationItems: any[];
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  setIsMenuOpen,
  handleLogout,
  getUserInitials,
  navigationItems
}) => {
  const { user, userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  return (
    <div className="flex flex-col h-full bg-dashboard-dark">
      {/* User Info */}
      <div className="p-6 border-b border-dashboard-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-satotrack-neon text-black font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {isPremium ? (
                <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gray-500/30 text-gray-400">
                  Free
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const canAccess = !item.premium || isPremium;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                canAccess
                  ? 'text-satotrack-text hover:bg-dashboard-medium/50 hover:text-white'
                  : 'text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              {item.premium && !isPremium && (
                <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs">
                  Pro
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-dashboard-medium space-y-2">
        <Link to="/configuracoes" onClick={() => setIsMenuOpen(false)}>
          <Button variant="ghost" className="w-full justify-start text-satotrack-text hover:text-white">
            <User className="h-4 w-4 mr-2" />
            Minha Conta
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default MobileMenuContent;

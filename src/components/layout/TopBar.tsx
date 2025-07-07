
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  ScreenShare, 
  RefreshCw, 
  Clock, 
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import UserMenu from '../navigation/UserMenu';
import { useAuth } from '@/contexts/auth';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

const timeRanges = [
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '1A', value: '1y' }
];

const TopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const handleNewWallet = () => {
    navigate('/nova-carteira');
  };
  
  const handleScreenshot = () => {
    // Funcionalidade de screenshot iria aqui
    window.dispatchEvent(new CustomEvent('app:screenshot'));
    console.log('Screenshot feature clicked');
  };
  
  const handleRefresh = () => {
    // Funcionalidade de atualização iria aqui
    console.log('Refresh data clicked');
    window.location.reload();
  };
  
  const handleTimeRangeChange = (range: string) => {
    // Funcionalidade de período iria aqui
    console.log('Selected time range:', range);
    window.dispatchEvent(new CustomEvent('app:timerange-change', { detail: range }));
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 1).toUpperCase();
  };
  
  return (
    <div className="border-b border-dashboard-medium/30 py-2 px-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hidden flex-wrap gap-2">
          <Button onClick={handleNewWallet} size="sm" variant="outline" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Carteira
          </Button>
          
          <Button onClick={handleScreenshot} size="sm" variant="outline" aria-label="Capturar tela">
            <ScreenShare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Screenshot</span>
          </Button>
          
          <Button onClick={handleRefresh} size="sm" variant="outline" aria-label="Atualizar dados">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Período</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timeRanges.map((range) => (
                <DropdownMenuItem 
                  key={range.value}
                  onClick={() => handleTimeRangeChange(range.value)}
                >
                  {range.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserMenu 
            user={user} 
            getUserInitials={getUserInitials} 
            handleLogout={handleLogout}
            navigate={navigate} 
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;

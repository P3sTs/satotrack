
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
    // Screenshot functionality would go here
    console.log('Screenshot feature clicked');
  };
  
  const handleRefresh = () => {
    // Refresh data functionality would go here
    console.log('Refresh data clicked');
    window.location.reload();
  };
  
  const handleTimeRangeChange = (range: string) => {
    // Time range functionality would go here
    console.log('Selected time range:', range);
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
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button onClick={handleNewWallet} size="sm" variant="outline" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Carteira
          </Button>
          
          <Button onClick={handleScreenshot} size="sm" variant="outline">
            <ScreenShare className="h-4 w-4 mr-2" />
            Screenshot
          </Button>
          
          <Button onClick={handleRefresh} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Período
                <ChevronDown className="h-4 w-4 ml-2" />
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
        
        <UserMenu 
          user={user} 
          getUserInitials={getUserInitials} 
          handleLogout={handleLogout}
          navigate={navigate} 
        />
      </div>
    </div>
  );
};

export default TopBar;

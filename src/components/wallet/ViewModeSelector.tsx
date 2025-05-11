
import React from 'react';
import { ChartBar, List, LayoutGrid, Smartphone } from 'lucide-react';
import { useViewMode, ViewMode } from '@/contexts/ViewModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ViewModeButtonProps {
  mode: ViewMode;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  active: boolean;
  isMobile: boolean;
}

const ViewModeButton: React.FC<ViewModeButtonProps> = ({
  mode,
  label,
  icon: Icon,
  onClick,
  active,
  isMobile
}) => {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size={isMobile ? "sm" : "default"}
      className={cn(
        "flex items-center gap-2 transition-all",
        active ? "bg-satotrack-neon text-dashboard-dark hover:bg-satotrack-neon/90" : ""
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {!isMobile && <span>{label}</span>}
    </Button>
  );
};

const ViewModeSelectorDesktop: React.FC = () => {
  const { viewMode, setViewMode } = useViewMode();
  const isMobile = useIsMobile();

  const viewModes = [
    { mode: 'chart' as ViewMode, label: 'Gráficos', icon: ChartBar },
    { mode: 'list' as ViewMode, label: 'Lista', icon: List },
    { mode: 'card' as ViewMode, label: 'Cards', icon: LayoutGrid },
    { mode: 'compact' as ViewMode, label: 'Compacto', icon: Smartphone },
  ];

  return (
    <div className="flex items-center gap-2">
      {viewModes.map((item) => (
        <ViewModeButton
          key={item.mode}
          mode={item.mode}
          label={item.label}
          icon={item.icon}
          onClick={() => setViewMode(item.mode)}
          active={viewMode === item.mode}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

const ViewModeSelectorMobile: React.FC = () => {
  const { viewMode, setViewMode } = useViewMode();

  const viewModes = [
    { mode: 'chart' as ViewMode, label: 'Gráficos', icon: ChartBar },
    { mode: 'list' as ViewMode, label: 'Lista', icon: List },
    { mode: 'card' as ViewMode, label: 'Cards', icon: LayoutGrid },
    { mode: 'compact' as ViewMode, label: 'Compacto', icon: Smartphone },
  ];

  // Find the current active mode
  const activeMode = viewModes.find(item => item.mode === viewMode) || viewModes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          size="sm"
        >
          <activeMode.icon className="h-4 w-4" />
          <span>Visualização</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          {viewModes.map((item) => (
            <DropdownMenuItem 
              key={item.mode}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                viewMode === item.mode ? "bg-satotrack-neon/20 text-satotrack-neon" : ""
              )}
              onClick={() => setViewMode(item.mode)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ViewModeSelector: React.FC = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <ViewModeSelectorMobile />;
  }
  
  return <ViewModeSelectorDesktop />;
};

export default ViewModeSelector;

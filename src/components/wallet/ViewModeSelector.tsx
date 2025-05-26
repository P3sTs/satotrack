
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Grid, List, BarChart3, ChevronDown } from 'lucide-react';
import { useViewMode } from '../../contexts/ViewModeContext';

export type ViewMode = 'cards' | 'list' | 'chart' | 'compact';

const ViewModeSelector: React.FC = () => {
  const { viewMode, setViewMode } = useViewMode();

  const viewModes = [
    { value: 'cards' as ViewMode, label: 'Cards', icon: Grid },
    { value: 'list' as ViewMode, label: 'Lista', icon: List },
    { value: 'compact' as ViewMode, label: 'Compacto', icon: BarChart3 },
    { value: 'chart' as ViewMode, label: 'Gráfico', icon: BarChart3 }
  ];

  const currentMode = viewModes.find(mode => mode.value === viewMode) || viewModes[0];
  const CurrentIcon = currentMode.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CurrentIcon className="h-4 w-4" />
          {currentMode.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <DropdownMenuItem
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={viewMode === mode.value ? 'bg-accent' : ''}
            >
              <Icon className="mr-2 h-4 w-4" />
              {mode.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeSelector;

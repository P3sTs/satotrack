
import React from 'react';
import { Button } from '@/components/ui/button';
import { SortOption, SortDirection } from '../types/types';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SortControlsProps {
  sortOption: SortOption;
  sortDirection: SortDirection;
  onSort: (option: SortOption, direction: SortDirection) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ 
  sortOption, 
  sortDirection,
  onSort
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <p className="text-sm text-muted-foreground">Ordenar por:</p>
      <div className="flex space-x-1">
        <Button
          variant={sortOption === 'saldo' ? 'secondary' : 'outline'}
          size="sm"
          className="text-xs h-8"
          onClick={() => onSort('saldo', sortOption === 'saldo' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc')}
        >
          Saldo
          {sortOption === 'saldo' && (
            sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        
        <Button
          variant={sortOption === 'ultimo_update' ? 'secondary' : 'outline'}
          size="sm"
          className="text-xs h-8"
          onClick={() => onSort('ultimo_update', sortOption === 'ultimo_update' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc')}
        >
          Atualização
          {sortOption === 'ultimo_update' && (
            sortDirection === 'asc' ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SortControls;

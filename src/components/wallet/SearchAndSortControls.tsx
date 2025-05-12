
import React from 'react';
import { SortOption, SortDirection } from '@/types/types';
import SearchWallets from './SearchWallets';
import SortControls from '../SortControls';

interface SearchAndSortControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  sortDirection: SortDirection;
  onSort: (option: SortOption, direction: SortDirection) => void;
  filteredCount: number;
}

const SearchAndSortControls: React.FC<SearchAndSortControlsProps> = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  sortDirection,
  onSort,
  filteredCount
}) => {
  return (
    <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
      <SearchWallets 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <p className="text-sm text-muted-foreground order-2 md:order-1">
          {filteredCount} {filteredCount === 1 ? 'carteira encontrada' : 'carteiras encontradas'}
        </p>
        <div className="order-1 md:order-2">
          <SortControls 
            sortOption={sortOption}
            sortDirection={sortDirection}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndSortControls;

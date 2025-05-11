
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchWalletsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchWallets: React.FC<SearchWalletsProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Pesquisar carteiras por nome ou endereço"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 w-full"
      />
    </div>
  );
};

export default SearchWallets;

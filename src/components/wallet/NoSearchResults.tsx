
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoSearchResultsProps {
  onClearSearch: () => void;
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({ onClearSearch }) => {
  return (
    <div className="text-center p-6 md:p-12 border border-dashed border-border rounded-lg">
      <h3 className="text-lg md:text-xl font-medium mb-2">Nenhuma carteira encontrada</h3>
      <p className="text-muted-foreground mb-4 md:mb-6">Nenhuma carteira corresponde à sua pesquisa</p>
      <Button 
        variant="outline"
        onClick={onClearSearch}
      >
        Limpar pesquisa
      </Button>
    </div>
  );
};

export default NoSearchResults;

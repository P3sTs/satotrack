
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RotateCcw, Zap, X } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (address: string) => void;
  onReorganize: () => void;
  isLoading: boolean;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  onReorganize,
  isLoading
}) => {
  const [searchAddress, setSearchAddress] = useState('');

  const handleSearch = () => {
    if (searchAddress.trim()) {
      onSearch(searchAddress.trim());
      setSearchAddress('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 space-y-4">
      {/* Search Bar */}
      <div className="bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/50">
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Digite o endereço da carteira..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-black/50 border-cyan-500/50 text-white font-mono text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSearch}
            disabled={!searchAddress.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          <Button
            onClick={onReorganize}
            variant="outline"
            size="sm"
            className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reorganizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/50 text-yellow-300"
            disabled={isLoading}
          >
            <Zap className="h-4 w-4 mr-1" />
            Expandir
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 mt-3 text-cyan-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
            Carregando dados da blockchain...
          </div>
        )}
      </div>

      {/* Instruções */}
      <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-gray-500/30 text-xs text-gray-300 max-w-xs">
        <h4 className="text-cyan-400 font-semibold mb-2">🎮 Controles:</h4>
        <ul className="space-y-1">
          <li>🖱️ <strong>Arrastar:</strong> Mover bolhas</li>
          <li>🔄 <strong>Mouse:</strong> Rotacionar câmera</li>
          <li>⚡ <strong>Scroll:</strong> Zoom in/out</li>
          <li>🔒 <strong>Duplo clique:</strong> Travar posição</li>
          <li>👆 <strong>Clique:</strong> Ver detalhes</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchInterface;

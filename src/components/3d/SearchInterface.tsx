
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RotateCcw, Zap, AlertCircle } from 'lucide-react';

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
  const [validationError, setValidationError] = useState('');

  const validateBitcoinAddress = (address: string): boolean => {
    // Validação básica para endereços Bitcoin
    const trimmedAddress = address.trim();
    
    // Verificar se está vazio
    if (!trimmedAddress) {
      setValidationError('Digite um endereço Bitcoin');
      return false;
    }
    
    // Verificar comprimento
    if (trimmedAddress.length < 26 || trimmedAddress.length > 35) {
      setValidationError('Endereço deve ter entre 26 e 35 caracteres');
      return false;
    }
    
    // Verificar se começa com caracteres válidos do Bitcoin
    const validPrefixes = ['1', '3', 'bc1'];
    const hasValidPrefix = validPrefixes.some(prefix => trimmedAddress.startsWith(prefix));
    
    if (!hasValidPrefix) {
      setValidationError('Endereço deve começar com 1, 3 ou bc1');
      return false;
    }
    
    // Verificar caracteres válidos
    const validChars = /^[A-Za-z0-9]+$/;
    if (!validChars.test(trimmedAddress)) {
      setValidationError('Endereço contém caracteres inválidos');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleSearch = () => {
    const trimmedAddress = searchAddress.trim();
    
    if (validateBitcoinAddress(trimmedAddress)) {
      onSearch(trimmedAddress);
      setSearchAddress('');
      setValidationError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchAddress(value);
    
    // Limpar erro quando o usuário começar a digitar
    if (validationError && value.trim()) {
      setValidationError('');
    }
  };

  const populateExampleAddress = () => {
    const exampleAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Endereço do bloco Genesis
    setSearchAddress(exampleAddress);
    setValidationError('');
  };

  return (
    <div className="absolute top-4 right-4 z-50 space-y-4">
      {/* Search Bar */}
      <div className="bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/50 min-w-[300px]">
        <div className="space-y-3">
          {/* Input com validação */}
          <div className="space-y-2">
            <Input
              placeholder="Digite o endereço Bitcoin..."
              value={searchAddress}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`bg-black/50 border-cyan-500/50 text-white font-mono text-sm ${
                validationError ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
            
            {/* Erro de validação */}
            {validationError && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle className="h-3 w-3" />
                {validationError}
              </div>
            )}
            
            {/* Botão de exemplo */}
            <button
              onClick={populateExampleAddress}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline"
              disabled={isLoading}
            >
              Usar endereço de exemplo (Genesis Block)
            </button>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={!searchAddress.trim() || isLoading || !!validationError}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {/* Controles secundários */}
          <div className="flex gap-2">
            <Button
              onClick={onReorganize}
              variant="outline"
              size="sm"
              className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300 flex-1"
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reorganizar
            </Button>
          </div>
        </div>
      </div>

      {/* Instruções detalhadas */}
      <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-gray-500/30 text-xs text-gray-300 max-w-xs">
        <h4 className="text-cyan-400 font-semibold mb-2">🎮 Controles:</h4>
        <ul className="space-y-1">
          <li>🖱️ <strong>Arrastar:</strong> Mover esferas</li>
          <li>🔄 <strong>Mouse:</strong> Rotacionar câmera</li>
          <li>⚡ <strong>Scroll:</strong> Zoom in/out</li>
          <li>🔒 <strong>Duplo clique:</strong> Travar posição</li>
          <li>👆 <strong>Clique:</strong> Ver detalhes</li>
        </ul>
        
        <div className="mt-3 pt-2 border-t border-gray-600">
          <h5 className="text-yellow-400 font-semibold mb-1">💡 Dicas:</h5>
          <ul className="space-y-1">
            <li>• Use endereços Bitcoin válidos</li>
            <li>• Teste com o endereço de exemplo</li>
            <li>• Aguarde o carregamento completo</li>
          </ul>
        </div>
      </div>

      {/* Status da conexão */}
      {isLoading && (
        <div className="bg-blue-600/20 backdrop-blur-sm p-3 rounded-lg border border-blue-500/50 text-blue-300 text-xs max-w-xs">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-400 border-t-transparent"></div>
            <span>Conectando à blockchain...</span>
          </div>
          <div className="mt-1 text-blue-400/70">
            Carregando dados em tempo real
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;

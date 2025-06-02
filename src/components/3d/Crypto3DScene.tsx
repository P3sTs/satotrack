
import React, { useCallback, useMemo } from 'react';
import { Vector3 } from 'three';
import SearchInterface from './SearchInterface';
import WalletDetailPopup from './WalletDetailPopup';
import SceneStatus from './components/SceneStatus';
import LoadingOverlay from './components/LoadingOverlay';
import UsageInstructions from './components/UsageInstructions';
import Scene3DRenderer from './components/Scene3DRenderer';
import { useWalletData } from './hooks/useWalletData';
import { useWalletNodes } from './hooks/useWalletNodes';

const Crypto3DScene: React.FC = () => {
  console.log('🎬 [Crypto3DScene] Renderizando componente principal');
  
  const { isLoading, validateAndFetchWallet } = useWalletData();
  const {
    walletNodes,
    selectedWallet,
    setSelectedWallet,
    addWalletNode,
    removeNode,
    toggleLockNode,
    reorganizeNodes,
    expandWalletConnections,
    updateNodePosition
  } = useWalletNodes();

  const handleAddWallet = useCallback(async (address: string, position?: Vector3) => {
    console.log('🔍 [Crypto3DScene] handleAddWallet chamado com:', address);
    
    try {
      const walletData = await validateAndFetchWallet(address);
      console.log('📊 [Crypto3DScene] Dados da carteira recebidos:', walletData);
      
      if (walletData) {
        addWalletNode(walletData, address, position);
        console.log('✅ [Crypto3DScene] Nó da carteira adicionado com sucesso');
      }
    } catch (error) {
      console.error('❌ [Crypto3DScene] Erro em handleAddWallet:', error);
    }
  }, [validateAndFetchWallet, addWalletNode]);

  const handleAddConnection = useCallback((address: string) => {
    console.log('🔗 [Crypto3DScene] Adicionando conexão:', address);
    
    if (selectedWallet) {
      const newPosition = new Vector3(
        selectedWallet.position.x + (Math.random() - 0.5) * 10,
        selectedWallet.position.y + (Math.random() - 0.5) * 10,
        selectedWallet.position.z + (Math.random() - 0.5) * 10
      );
      handleAddWallet(address, newPosition);
    }
  }, [selectedWallet, handleAddWallet]);

  const handleExpandConnections = useCallback(() => {
    console.log('🌐 [Crypto3DScene] Expandindo conexões');
    
    if (selectedWallet) {
      expandWalletConnections(selectedWallet);
    }
  }, [selectedWallet, expandWalletConnections]);

  // Memoizar componentes para evitar re-renderizações desnecessárias
  const memoizedSearchInterface = useMemo(() => (
    <SearchInterface 
      onSearch={handleAddWallet}
      onReorganize={reorganizeNodes}
      isLoading={isLoading}
    />
  ), [handleAddWallet, reorganizeNodes, isLoading]);

  const memoizedSceneStatus = useMemo(() => (
    <SceneStatus walletNodes={walletNodes} />
  ), [walletNodes]);

  const memoizedScene3DRenderer = useMemo(() => (
    <Scene3DRenderer
      walletNodes={walletNodes}
      onWalletClick={setSelectedWallet}
      onNodePositionChange={updateNodePosition}
      onToggleLock={toggleLockNode}
      onRemoveNode={removeNode}
    />
  ), [walletNodes, setSelectedWallet, updateNodePosition, toggleLockNode, removeNode]);

  const memoizedUsageInstructions = useMemo(() => (
    <UsageInstructions show={walletNodes.length === 0 && !isLoading} />
  ), [walletNodes.length, isLoading]);

  const memoizedLoadingOverlay = useMemo(() => (
    <LoadingOverlay isLoading={isLoading} />
  ), [isLoading]);

  console.log('📈 [Crypto3DScene] Estado atual:', {
    walletsCount: walletNodes.length,
    isLoading,
    hasSelectedWallet: !!selectedWallet
  });

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-gray-900 to-black">
      {memoizedSearchInterface}
      {memoizedSceneStatus}
      {memoizedScene3DRenderer}

      {selectedWallet && (
        <WalletDetailPopup
          wallet={selectedWallet}
          onClose={() => setSelectedWallet(null)}
          onAddConnection={handleAddConnection}
          onExpandConnections={handleExpandConnections}
        />
      )}

      {memoizedUsageInstructions}
      {memoizedLoadingOverlay}
    </div>
  );
};

export default Crypto3DScene;

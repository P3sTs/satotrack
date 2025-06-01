
import React from 'react';
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

  const handleAddWallet = async (address: string, position?: Vector3) => {
    try {
      const walletData = await validateAndFetchWallet(address);
      addWalletNode(walletData, address, position);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddConnection = (address: string) => {
    if (selectedWallet) {
      const newPosition = new Vector3(
        selectedWallet.position.x + (Math.random() - 0.5) * 10,
        selectedWallet.position.y + (Math.random() - 0.5) * 10,
        selectedWallet.position.z + (Math.random() - 0.5) * 10
      );
      handleAddWallet(address, newPosition);
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* Interface de busca flutuante */}
      <SearchInterface 
        onSearch={handleAddWallet}
        onReorganize={reorganizeNodes}
        isLoading={isLoading}
      />

      {/* Informações de status */}
      <SceneStatus walletNodes={walletNodes} />

      {/* Canvas 3D */}
      <Scene3DRenderer
        walletNodes={walletNodes}
        onWalletClick={setSelectedWallet}
        onNodePositionChange={updateNodePosition}
        onToggleLock={toggleLockNode}
        onRemoveNode={removeNode}
      />

      {/* Popup de detalhes */}
      {selectedWallet && (
        <WalletDetailPopup
          wallet={selectedWallet}
          onClose={() => setSelectedWallet(null)}
          onAddConnection={handleAddConnection}
          onExpandConnections={() => expandWalletConnections(selectedWallet)}
        />
      )}

      {/* Instruções de uso - apenas quando não há carteiras */}
      <UsageInstructions show={walletNodes.length === 0 && !isLoading} />

      {/* Indicador de carregamento */}
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
};

export default Crypto3DScene;

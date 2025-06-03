
import { useState, useCallback, useRef } from 'react';
import { Vector3 } from 'three';
import { toast } from '@/hooks/use-toast';
import { WalletNode } from '../types/WalletNode';

export const useWalletNodes = () => {
  const [walletNodes, setWalletNodes] = useState<WalletNode[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletNode | null>(null);
  const processingRef = useRef(false);

  const addWalletNode = useCallback((walletData: any, address: string, position?: Vector3) => {
    console.log('🔗 [useWalletNodes] Adicionando nó da carteira:', { address, walletData });
    
    if (processingRef.current) {
      console.warn('⚠️ [useWalletNodes] Já processando, ignorando nova adição');
      return;
    }

    if (!address || typeof address !== 'string') {
      console.error('❌ [useWalletNodes] Endereço inválido:', address);
      return;
    }

    processingRef.current = true;

    try {
      // Criar posição válida
      const safePosition = position || new Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );

      // Validar e sanitizar os dados da carteira
      const sanitizedWalletData = {
        balance: typeof walletData?.balance === 'number' && !isNaN(walletData.balance) ? walletData.balance : 0,
        total_received: typeof walletData?.total_received === 'number' && !isNaN(walletData.total_received) ? walletData.total_received : 0,
        total_sent: typeof walletData?.total_sent === 'number' && !isNaN(walletData.total_sent) ? walletData.total_sent : 0,
        transaction_count: typeof walletData?.transaction_count === 'number' && !isNaN(walletData.transaction_count) ? walletData.transaction_count : 0,
        transactions: Array.isArray(walletData?.transactions) ? walletData.transactions : []
      };

      const newNode: WalletNode = {
        id: `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        address: address.trim(),
        position: safePosition,
        balance: sanitizedWalletData.balance,
        totalReceived: sanitizedWalletData.total_received,
        totalSent: sanitizedWalletData.total_sent,
        transactionCount: sanitizedWalletData.transaction_count,
        isLocked: false,
        connections: [],
        type: 'main',
        transactions: sanitizedWalletData.transactions
      };

      console.log('📝 [useWalletNodes] Nó criado:', newNode);

      setWalletNodes(prev => {
        // Verificar duplicatas
        const existingIndex = prev.findIndex(node => node.address === address.trim());
        if (existingIndex !== -1) {
          console.log('🔄 [useWalletNodes] Atualizando nó existente');
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newNode, id: updated[existingIndex].id };
          return updated;
        }
        
        console.log('✨ [useWalletNodes] Adicionando novo nó');
        return [...prev, newNode];
      });

    } catch (error) {
      console.error('💥 [useWalletNodes] Erro ao adicionar nó:', error);
    } finally {
      processingRef.current = false;
    }
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    console.log('🗑️ [useWalletNodes] Removendo nó:', nodeId);
    setWalletNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedWallet(prev => prev?.id === nodeId ? null : prev);
  }, []);

  const toggleLockNode = useCallback((nodeId: string) => {
    console.log('🔒 [useWalletNodes] Alternando trava do nó:', nodeId);
    setWalletNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, isLocked: !node.isLocked } : node
      )
    );
  }, []);

  const reorganizeNodes = useCallback(() => {
    console.log('🔄 [useWalletNodes] Reorganizando nós');
    setWalletNodes(prev => 
      prev.map((node, index) => ({
        ...node,
        position: new Vector3(
          Math.cos(index * (Math.PI * 2) / prev.length) * 10,
          Math.sin(index * Math.PI / 4) * 5,
          Math.sin(index * (Math.PI * 2) / prev.length) * 10
        ),
        isLocked: false
      }))
    );
  }, []);

  const expandWalletConnections = useCallback((wallet: WalletNode) => {
    console.log('🌐 [useWalletNodes] Expandindo conexões para:', wallet.address);
    
    toast({
      title: "🔗 Funcionalidade em desenvolvimento",
      description: "A expansão de conexões será implementada em breve",
    });
  }, []);

  const updateNodePosition = useCallback((nodeId: string, newPosition: Vector3) => {
    if (!newPosition || typeof newPosition.x !== 'number' || isNaN(newPosition.x)) {
      console.warn('⚠️ [useWalletNodes] Posição inválida para o nó:', nodeId);
      return;
    }
    
    setWalletNodes(prev =>
      prev.map(n =>
        n.id === nodeId ? { ...n, position: newPosition.clone() } : n
      )
    );
  }, []);

  return {
    walletNodes,
    selectedWallet,
    setSelectedWallet,
    addWalletNode,
    removeNode,
    toggleLockNode,
    reorganizeNodes,
    expandWalletConnections,
    updateNodePosition
  };
};

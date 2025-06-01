
import { useState, useCallback } from 'react';
import { Vector3 } from 'three';
import { toast } from '@/hooks/use-toast';

export interface WalletNode {
  id: string;
  address: string;
  position: Vector3;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  isLocked: boolean;
  connections: string[];
  type: 'main' | 'transaction' | 'connected';
  transactions?: Array<{
    hash: string;
    amount: number;
    transaction_type: string;
    transaction_date: string;
  }>;
}

export const useWalletNodes = () => {
  const [walletNodes, setWalletNodes] = useState<WalletNode[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletNode | null>(null);

  const addWalletNode = useCallback((walletData: any, address: string, position?: Vector3) => {
    console.log('Adding wallet node:', { walletData, address });
    
    const newNode: WalletNode = {
      id: `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      address,
      position: position || new Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ),
      balance: walletData.balance || 0,
      totalReceived: walletData.total_received || 0,
      totalSent: walletData.total_sent || 0,
      transactionCount: walletData.transaction_count || 0,
      isLocked: false,
      connections: [],
      type: 'main',
      transactions: walletData.transactions || []
    };

    setWalletNodes(prev => {
      // Verificar se já existe um nó com este endereço
      const exists = prev.find(node => node.address === address);
      if (exists) {
        console.log('Wallet already exists, updating instead');
        return prev.map(node => 
          node.address === address ? { ...node, ...newNode, id: node.id } : node
        );
      }
      console.log('Adding new wallet node');
      return [...prev, newNode];
    });
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setWalletNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedWallet(prev => prev?.id === nodeId ? null : prev);
  }, []);

  const toggleLockNode = useCallback((nodeId: string) => {
    setWalletNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, isLocked: !node.isLocked } : node
      )
    );
  }, []);

  const reorganizeNodes = useCallback(() => {
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
    if (!wallet.transactions || wallet.transactions.length === 0) {
      toast({
        title: "📭 Sem transações",
        description: "Esta carteira não possui transações para expandir",
        variant: "destructive"
      });
      return;
    }

    const significantTransactions = wallet.transactions
      .filter(tx => tx.amount > 0.001)
      .slice(0, 5);

    if (significantTransactions.length === 0) {
      toast({
        title: "📊 Transações muito pequenas",
        description: "Não há transações significativas para visualizar",
        variant: "destructive"
      });
      return;
    }

    const newNodes = significantTransactions.map((tx, index) => {
      const angle = (index * (Math.PI * 2)) / significantTransactions.length;
      const radius = 8;
      
      return {
        id: `tx-${tx.hash}-${Date.now()}-${index}`,
        address: tx.hash,
        position: new Vector3(
          wallet.position.x + Math.cos(angle) * radius,
          wallet.position.y + Math.sin(angle) * radius,
          wallet.position.z + (Math.random() - 0.5) * 4
        ),
        balance: tx.amount,
        totalReceived: tx.amount,
        totalSent: 0,
        transactionCount: 1,
        isLocked: false,
        connections: [wallet.id],
        type: 'transaction' as const,
        transactions: [tx]
      };
    });

    setWalletNodes(prev => [...prev, ...newNodes]);

    toast({
      title: "🔗 Conexões expandidas",
      description: `Adicionadas ${significantTransactions.length} transações relacionadas`,
    });
  }, []);

  const updateNodePosition = useCallback((nodeId: string, newPosition: Vector3) => {
    setWalletNodes(prev =>
      prev.map(n =>
        n.id === nodeId ? { ...n, position: newPosition } : n
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

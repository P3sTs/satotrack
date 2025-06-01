
import { useState } from 'react';
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

  const addWalletNode = (walletData: any, address: string, position?: Vector3) => {
    const newNode: WalletNode = {
      id: `wallet-${Date.now()}`,
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

    setWalletNodes(prev => [...prev, newNode]);
  };

  const removeNode = (nodeId: string) => {
    setWalletNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedWallet?.id === nodeId) {
      setSelectedWallet(null);
    }
  };

  const toggleLockNode = (nodeId: string) => {
    setWalletNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, isLocked: !node.isLocked } : node
      )
    );
  };

  const reorganizeNodes = () => {
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
  };

  const expandWalletConnections = (wallet: WalletNode) => {
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

    significantTransactions.forEach((tx, index) => {
      const angle = (index * (Math.PI * 2)) / significantTransactions.length;
      const radius = 8;
      
      const transactionNode: WalletNode = {
        id: `tx-${tx.hash}-${Date.now()}`,
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
        type: 'transaction',
        transactions: [tx]
      };

      setWalletNodes(prev => [...prev, transactionNode]);
    });

    toast({
      title: "🔗 Conexões expandidas",
      description: `Adicionadas ${significantTransactions.length} transações relacionadas`,
    });
  };

  const updateNodePosition = (nodeId: string, newPosition: Vector3) => {
    setWalletNodes(prev =>
      prev.map(n =>
        n.id === nodeId ? { ...n, position: newPosition } : n
      )
    );
  };

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

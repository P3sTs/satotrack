
import * as THREE from 'three';

export interface WalletNode {
  id: string;
  address: string;
  position: THREE.Vector3;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  isLocked: boolean;
  connections: string[];
  type: 'main' | 'transaction' | 'connected';
}

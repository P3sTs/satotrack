
import React from 'react';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import CarteiraCard from '../CarteiraCard';

interface PrimaryWalletProps {
  wallet: CarteiraBTC | null;
}

const PrimaryWallet: React.FC<PrimaryWalletProps> = ({ wallet }) => {
  if (!wallet) return null;
  
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-xl font-medium mb-3 md:mb-4 text-satotrack-text">Carteira Principal</h2>
      <div className="max-w-full lg:max-w-2xl">
        <CarteiraCard
          carteira={wallet}
          isPrimary={true}
        />
      </div>
    </div>
  );
};

export default PrimaryWallet;

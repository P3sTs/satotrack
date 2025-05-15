
import React from 'react';
import CryptoDashboard from '@/components/crypto/CryptoDashboard';

const Crypto = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <CryptoDashboard refreshInterval={60000} />
    </div>
  );
};

export default Crypto;

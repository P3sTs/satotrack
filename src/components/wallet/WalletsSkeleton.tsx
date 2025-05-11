
import React from 'react';

const WalletsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse p-6 border rounded-lg">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-full mb-6"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-6 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletsSkeleton;

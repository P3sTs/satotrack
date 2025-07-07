import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';

export const WalletDebugInfo: React.FC = () => {
  const { user } = useAuth();
  const { 
    wallets, 
    isLoading, 
    generationStatus, 
    generationErrors,
    hasGeneratedWallets,
    hasPendingWallets
  } = useCryptoWallets();

  return (
    <Card className="mt-4 border-yellow-500/50 bg-yellow-500/10">
      <CardHeader>
        <CardTitle className="text-yellow-600 text-sm">🐛 Debug Info - Carteiras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>User ID:</strong> {user?.id || 'Not logged in'}
          </div>
          <div>
            <strong>Loading:</strong> <Badge variant={isLoading ? 'destructive' : 'secondary'}>{isLoading ? 'Yes' : 'No'}</Badge>
          </div>
          <div>
            <strong>Status:</strong> <Badge variant="outline">{generationStatus}</Badge>
          </div>
          <div>
            <strong>Wallets Count:</strong> {wallets.length}
          </div>
          <div>
            <strong>Has Generated:</strong> <Badge variant={hasGeneratedWallets ? 'default' : 'secondary'}>{hasGeneratedWallets ? 'Yes' : 'No'}</Badge>
          </div>
          <div>
            <strong>Has Pending:</strong> <Badge variant={hasPendingWallets ? 'destructive' : 'secondary'}>{hasPendingWallets ? 'Yes' : 'No'}</Badge>
          </div>
        </div>
        
        {generationErrors.length > 0 && (
          <div className="mt-2">
            <strong>Errors:</strong>
            <ul className="list-disc pl-4">
              {generationErrors.map((error, index) => (
                <li key={index} className="text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {wallets.length > 0 && (
          <div className="mt-2">
            <strong>Wallets:</strong>
            <div className="space-y-1">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="text-xs p-2 bg-muted rounded">
                  <strong>{wallet.currency}:</strong> {wallet.address} 
                  <br />
                  <span className="text-muted-foreground">Balance: {wallet.balance}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
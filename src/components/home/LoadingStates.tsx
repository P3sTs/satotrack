
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState = ({ isLoading }: LoadingStateProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-satotrack-neon"></div>
    </div>
  );
};

export const ErrorState = () => {
  return (
    <Card className="cyberpunk-card">
      <CardContent className="py-8">
        <p className="text-center text-satotrack-text">Não foi possível carregar os dados do Bitcoin</p>
      </CardContent>
    </Card>
  );
};

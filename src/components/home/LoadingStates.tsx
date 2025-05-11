
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState = ({ isLoading }: LoadingStateProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-satotrack-neon"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-satotrack-neon animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const ErrorState = () => {
  return (
    <Card className="border-satotrack-alert/30 bg-dashboard-dark shadow-lg">
      <CardContent className="py-8 px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 rounded-full bg-satotrack-alert/10 border border-satotrack-alert/20">
            <AlertCircle className="h-8 w-8 text-satotrack-alert" />
          </div>
          <div className="text-center">
            <p className="font-medium text-lg">Não foi possível carregar os dados do Bitcoin</p>
            <p className="text-satotrack-text text-sm mt-1">
              Verifique sua conexão e tente novamente em alguns momentos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

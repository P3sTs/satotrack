
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionsLoadingProps {
  showHeader: boolean;
  className?: string;
}

export const TransactionsLoading: React.FC<TransactionsLoadingProps> = ({
  showHeader,
  className = ""
}) => {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4">
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

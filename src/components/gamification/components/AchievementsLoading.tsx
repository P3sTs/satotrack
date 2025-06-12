
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AchievementsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="bg-muted/20">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-12 w-12 bg-muted rounded-full mx-auto"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementsLoading;

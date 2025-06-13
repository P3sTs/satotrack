
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import RealtimeDashboard from '@/components/dynamic/RealtimeDashboard';

const RealtimeTab: React.FC = () => {
  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-satotrack-neon" />
          Dados em Tempo Real
        </CardTitle>
        <CardDescription>Atualizações automáticas a cada 30 segundos</CardDescription>
      </CardHeader>
      <CardContent>
        <RealtimeDashboard bitcoinRefreshInterval={30000} />
      </CardContent>
    </Card>
  );
};

export default RealtimeTab;

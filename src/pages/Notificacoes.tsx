
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import { useAuth } from '@/contexts/auth';

const Notificacoes = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Você precisa estar logado para acessar suas notificações.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notificações</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="history" className="space-y-6">
          <NotificationHistory />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notificacoes;

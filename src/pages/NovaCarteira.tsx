
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarteiras } from '../contexts/carteiras';
import { ArrowLeft, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewWalletModal from '../components/NewWalletModal';
import { useErrorHandler } from '../hooks/useErrorHandler';
import DebugLogger from '../components/debug/DebugLogger';

const NovaCarteira: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const { carteiras } = useCarteiras();
  const { executeWithErrorHandling } = useErrorHandler();

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/carteiras');
  };

  const handleSuccess = async () => {
    await executeWithErrorHandling(
      async () => {
        setIsModalOpen(false);
        navigate('/carteiras');
      },
      undefined,
      '✅ Carteira adicionada com sucesso!'
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <DebugLogger 
        data={{ route: '/nova-carteira', walletsCount: carteiras.length }}
        label="Nova Carteira Page"
      />
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-3"
          asChild
        >
          <Link to="/carteiras">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Carteiras
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-bitcoin/10 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8 text-bitcoin" />
          </div>
          <CardTitle className="text-2xl">
            <Plus className="inline h-6 w-6 mr-2" />
            Adicionar Nova Carteira
          </CardTitle>
          <CardDescription>
            Monitore suas criptomoedas em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-bitcoin hover:bg-bitcoin-dark text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Começar Agora
            </Button>
          </div>
        </CardContent>
      </Card>

      <NewWalletModal 
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default NovaCarteira;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const CryptoSecurityNotice: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Dicas de Segurança
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-green-500">Proteção de Dados</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Suas chaves privadas são criptografadas</li>
              <li>• Apenas você tem acesso às suas carteiras</li>
              <li>• Sistema de backup automático seguro</li>
              <li>• Monitoramento 24/7 de segurança</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-500">Boas Práticas</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verifique sempre os endereços antes de enviar</li>
              <li>• Teste com pequenos valores primeiro</li>
              <li>• Mantenha seu login seguro</li>
              <li>• Use conexões HTTPS sempre</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

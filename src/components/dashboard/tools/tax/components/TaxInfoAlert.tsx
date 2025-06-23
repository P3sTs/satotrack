
import React from 'react';
import { AlertCircle } from 'lucide-react';

const TaxInfoAlert: React.FC = () => {
  return (
    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div>
          <h5 className="font-medium text-yellow-400">Informação Importante</h5>
          <p className="text-sm text-muted-foreground mt-1">
            Vendas mensais até R$ 35.000 são isentas de imposto sobre ganho de capital.
            Acima desse valor, a alíquota é de 15%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxInfoAlert;

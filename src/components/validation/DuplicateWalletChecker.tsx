
import React from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { useActionFeedback } from '../feedback/ActionFeedback';

interface DuplicateWalletCheckerProps {
  address: string;
  onDuplicateFound: (isDuplicate: boolean) => void;
}

const DuplicateWalletChecker: React.FC<DuplicateWalletCheckerProps> = ({
  address,
  onDuplicateFound
}) => {
  const { carteiras } = useCarteiras();
  const { showWarning } = useActionFeedback();

  React.useEffect(() => {
    if (!address) {
      onDuplicateFound(false);
      return;
    }

    const isDuplicate = carteiras.some(carteira => 
      carteira.endereco.toLowerCase() === address.toLowerCase()
    );

    if (isDuplicate) {
      showWarning('⚠️ Esta carteira já foi cadastrada anteriormente!');
    }

    onDuplicateFound(isDuplicate);
  }, [address, carteiras, onDuplicateFound, showWarning]);

  return null;
};

export default DuplicateWalletChecker;


import React from 'react';

const ReferralHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-orbitron font-bold mb-4">
        Programa de <span className="text-bitcoin">Indicações</span>
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Indique amigos para o SatoTrack e ganhe 1 mês Premium a cada 20 indicações válidas. 
        Seus amigos também ganham benefícios ao se cadastrar!
      </p>
    </div>
  );
};

export default ReferralHeader;

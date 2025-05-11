
export function formatarBTC(valor: number): string {
  return `${valor.toFixed(8)} BTC`;
}

export function formatarData(dataIso: string): string {
  const data = new Date(dataIso);
  const agora = new Date();
  const diff = agora.getTime() - data.getTime();
  
  // Se for hoje, mostrar apenas a hora
  if (data.toDateString() === agora.toDateString()) {
    return `Hoje, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Se for ontem
  const ontem = new Date();
  ontem.setDate(agora.getDate() - 1);
  if (data.toDateString() === ontem.toDateString()) {
    return `Ontem, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Se for há menos de 7 dias, mostrar o dia da semana
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return data.toLocaleDateString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  }
  
  // Caso contrário, mostrar a data completa
  return data.toLocaleDateString('pt-BR', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatarHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
}

// Adding the missing formatCurrency function
export function formatCurrency(value: number, currency: string = 'USD', digits: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

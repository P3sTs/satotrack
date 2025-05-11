
import { CarteiraBTC, TransacaoBTC } from '../types/types';

// Função para gerar um número aleatório dentro de um intervalo
function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Função para gerar um timestamp aleatório nos últimos 30 dias
function randomTimestamp(): string {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime = randomNumber(thirtyDaysAgo.getTime(), now.getTime());
  return new Date(randomTime).toISOString();
}

// Dados mockados para simular a resposta da API
export async function mockFetchCarteiraDados(endereco: string): Promise<Partial<CarteiraBTC>> {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simula uma falha aleatória na API
  if (Math.random() < 0.05) { // 5% de chance de falha
    throw new Error('Erro ao conectar com a API da blockchain');
  }
  
  // Valores aleatórios para simular dados da carteira
  const saldo = parseFloat((Math.random() * 20).toFixed(4));
  const total_entradas = parseFloat((saldo + Math.random() * 10).toFixed(4));
  const total_saidas = parseFloat((total_entradas - saldo).toFixed(4));
  const qtde_transacoes = Math.floor(Math.random() * 100) + 1;
  
  return {
    saldo,
    total_entradas,
    total_saidas,
    qtde_transacoes
  };
}

// Função para gerar transações aleatórias
export async function mockFetchTransacoes(endereco: string): Promise<TransacaoBTC[]> {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const numTransacoes = Math.floor(Math.random() * 20) + 5; // Entre 5 e 24 transações
  const transacoes: TransacaoBTC[] = [];
  
  for (let i = 0; i < numTransacoes; i++) {
    const tipo = Math.random() > 0.5 ? 'entrada' : 'saida';
    const valor = parseFloat((Math.random() * 2).toFixed(6));
    
    transacoes.push({
      hash: Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      valor,
      tipo,
      data: randomTimestamp()
    });
  }
  
  // Ordenar por data (mais recente primeiro)
  return transacoes.sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
}

export function mockAtualizarDadosCron(): void {
  console.log('Simulando atualização periódica das carteiras...');
  // Em uma implementação real, isso seria feito do lado do servidor
}

export function validarEnderecoBitcoin(endereco: string): boolean {
  // Implementação simplificada para validar endereço Bitcoin
  // Em produção, deve-se usar uma biblioteca especializada
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(endereco);
}

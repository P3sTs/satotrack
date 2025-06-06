
import { BlockchainInfoResponse, BlockCypherResponse, BlockstreamResponse } from './types.ts';

export async function fetchBlockchainInfo(address: string): Promise<BlockchainInfoResponse | null> {
  try {
    console.log(`Fetching data from blockchain.info for address: ${address}`);
    const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=50`);
    if (!response.ok) {
      throw new Error(`blockchain.info API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`blockchain.info response:`, data);
    return data;
  } catch (error) {
    console.error('blockchain.info API error:', error);
    return null;
  }
}

export async function fetchBlockCypher(address: string): Promise<BlockCypherResponse | null> {
  try {
    console.log(`Fetching data from BlockCypher for address: ${address}`);
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?limit=50&includeScript=true`);
    if (!response.ok) {
      throw new Error(`BlockCypher API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`BlockCypher response:`, data);
    return data;
  } catch (error) {
    console.error('BlockCypher API error:', error);
    return null;
  }
}

export async function fetchBlockstream(address: string): Promise<BlockstreamResponse | null> {
  try {
    console.log(`Fetching data from Blockstream for address: ${address}`);
    const [addressResponse, txsResponse] = await Promise.all([
      fetch(`https://blockstream.info/api/address/${address}`),
      fetch(`https://blockstream.info/api/address/${address}/txs`)
    ]);
    
    if (!addressResponse.ok || !txsResponse.ok) {
      throw new Error(`Blockstream API error`);
    }
    
    const addressData = await addressResponse.json();
    const txsData = await txsResponse.json();
    
    console.log(`Blockstream address data:`, addressData);
    console.log(`Blockstream transactions:`, txsData);
    
    return { addressData, txsData };
  } catch (error) {
    console.error('Blockstream API error:', error);
    return null;
  }
}

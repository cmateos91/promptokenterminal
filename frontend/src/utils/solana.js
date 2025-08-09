import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { USE_DEVNET } from './config';

// Usar RPCs públicos gratuitos que funcionan desde navegador
const MAINNET_ENDPOINTS = [
  'https://solana-mainnet.rpc.extrnode.com',
  'https://rpc.hellomoon.io',
  'https://mainnet.helius-rpc.com/?api-key=public',
  'https://api.mainnet-beta.solana.com'
];

// Fallback a devnet si mainnet falla completamente
const DEVNET_ENDPOINTS = [
  clusterApiUrl('devnet'),
  'https://api.devnet.solana.com'
];

let isUsingDevnet = USE_DEVNET;

// Función para crear conexión con configuración optimizada para navegador
function createConnection() {
  const endpoints = isUsingDevnet ? DEVNET_ENDPOINTS : MAINNET_ENDPOINTS;
  return new Connection(endpoints[0], {
    commitment: 'finalized',
    confirmTransactionInitialTimeout: 60000,
    disableRetryOnRateLimit: true,
    fetch: fetch
  });
}

export const connection = createConnection();
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// Función helper para reintentar consultas con endpoints públicos
export async function retryWithFallback(operation) {
  // Primero intentar con mainnet
  const endpointsToTry = isUsingDevnet ? DEVNET_ENDPOINTS : MAINNET_ENDPOINTS;
  // const networkName = isUsingDevnet ? 'DEVNET' : 'MAINNET';
  
  for (let i = 0; i < endpointsToTry.length; i++) {
    const endpoint = endpointsToTry[i];
    try {
      // console.log(`🔄 Trying ${networkName} RPC ${i + 1}/${endpointsToTry.length}: ${endpoint}`);
      const conn = new Connection(endpoint, {
        commitment: 'finalized',
        confirmTransactionInitialTimeout: 30000,
        disableRetryOnRateLimit: true,
        fetch: fetch
      });
      
      const result = await operation(conn);
      // console.log(`✅ ${networkName} RPC ${endpoint} succeeded`);
      return result;
      
    } catch (error) {
      // console.warn(`❌ ${networkName} RPC ${endpoint} failed:`, error.message);
      
      // Esperar antes del siguiente intento
      if (i < endpointsToTry.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // Si estamos en mainnet y todos fallan, cambiar a devnet
  if (!isUsingDevnet) {
    // console.log('⚠️ MAINNET failed completely, switching to DEVNET for testing...');
    isUsingDevnet = true;
    return await retryWithFallback(operation);
  }
  
  // Si devnet también falla, lanzar error
  throw new Error('All RPC endpoints (mainnet and devnet) failed');
}

// Función para obtener información de la red actual
export function getNetworkInfo() {
  return {
    network: isUsingDevnet ? 'devnet' : 'mainnet-beta',
    isTestnet: isUsingDevnet,
    endpoints: isUsingDevnet ? DEVNET_ENDPOINTS : MAINNET_ENDPOINTS
  };
}

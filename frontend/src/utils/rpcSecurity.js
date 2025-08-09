/**
 * RPC Security and Rate Limiting Configuration
 */

// Lista de RPCs públicos seguros (sin API keys)
const SECURE_PUBLIC_RPCS = {
  mainnet: [
    'https://api.mainnet-beta.solana.com',
    'https://solana-mainnet.rpc.extrnode.com',
    'https://rpc.hellomoon.io',
    'https://mainnet.helius-rpc.com/?api-key=public'
  ],
  devnet: [
    'https://api.devnet.solana.com',
    'https://rpc.ankr.com/solana_devnet',
    'https://solana-devnet.g.alchemy.com/v2/demo'
  ]
};

// Rate limiting por dominio
const DOMAIN_RATE_LIMITS = {
  localhost: 1000, // Sin límite en desarrollo
  'vercel.app': 100,  // 100 requests por minuto
  'github.io': 50,   // 50 requests por minuto
  default: 20        // 20 requests por minuto para otros dominios
};

// Detectar si la request viene de un dominio autorizado
export function isAuthorizedDomain(origin) {
  const authorizedDomains = [
    'localhost',
    'vercel.app',
    'github.io',
    // Añadir tu dominio personalizado aquí
  ];
  
  return authorizedDomains.some(domain => 
    origin?.includes(domain)
  );
}

// Rate limiting simple
const requestCounts = new Map();

export function checkRateLimit(identifier, limit = 100) {
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  
  if (!requestCounts.has(identifier)) {
    requestCounts.set(identifier, []);
  }
  
  const requests = requestCounts.get(identifier);
  
  // Limpiar requests antiguas
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  requestCounts.set(identifier, validRequests);
  
  return true;
}

export { SECURE_PUBLIC_RPCS, DOMAIN_RATE_LIMITS };

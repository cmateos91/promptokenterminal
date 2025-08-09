import { PublicKey } from '@solana/web3.js';
import { retryWithFallback } from './solana';

// Cache para evitar múltiples consultas del mismo token
const tokenMetadataCache = new Map();

/**
 * Obtiene los metadatos de un token SPL usando el Metaplex Token Metadata Program
 * @param {PublicKey} mintAddress - La dirección del mint del token
 * @returns {Promise<{name: string, symbol: string, decimals: number}>}
 */
export async function getTokenMetadata(mintAddress) {
  const mintString = mintAddress.toBase58();
  
  // Verificar caché
  if (tokenMetadataCache.has(mintString)) {
    return tokenMetadataCache.get(mintString);
  }

  try {
    // Intentar obtener información del mint (básica)
    const mintInfo = await retryWithFallback(async (conn) => {
      return await conn.getParsedAccountInfo(mintAddress);
    });

    let tokenData = {
      name: 'Unknown Token',
      symbol: 'UNK',
      decimals: 9,
      address: mintString
    };

    if (mintInfo && mintInfo.value && mintInfo.value.data && mintInfo.value.data.parsed) {
      tokenData.decimals = mintInfo.value.data.parsed.info.decimals;
    }

    // Tokens conocidos hardcodeados para casos comunes
    const knownTokens = {
      '5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF': {
        name: 'promptest',
        symbol: 'PTEST',
        decimals: 3
      },
      'So11111111111111111111111111111111111111112': {
        name: 'Wrapped SOL',
        symbol: 'wSOL',
        decimals: 9
      },
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6
      },
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6
      }
    };

    if (knownTokens[mintString]) {
      tokenData = { ...tokenData, ...knownTokens[mintString], address: mintString };
    } else {
      // Buscar metadatos usando el Token Metadata Program solo si no es conocido
      try {
        const metadataPDA = await getMetadataPDA(mintAddress);
        const metadataAccount = await retryWithFallback(async (conn) => {
          return await conn.getAccountInfo(metadataPDA);
        });

        if (metadataAccount && metadataAccount.data) {
          const metadata = parseTokenMetadata(metadataAccount.data);
          if (metadata) {
            tokenData.name = metadata.name || tokenData.name;
            tokenData.symbol = metadata.symbol || tokenData.symbol;
          }
        }
      } catch (metadataError) {
        console.warn('Could not fetch token metadata:', metadataError.message);
      }
    }

    // Guardar en caché
    tokenMetadataCache.set(mintString, tokenData);
    return tokenData;

  } catch (error) {
    console.error('Error fetching token metadata:', error);
    
    // Fallback básico
    const fallbackData = {
      name: `Token ${mintString.slice(0, 8)}...`,
      symbol: 'UNK',
      decimals: 9,
      address: mintString
    };
    
    tokenMetadataCache.set(mintString, fallbackData);
    return fallbackData;
  }
}

/**
 * Calcula la dirección PDA para los metadatos del token
 */
async function getMetadataPDA(mintAddress) {
  const TOKEN_METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
  const [publicKey] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM.toBuffer(),
      mintAddress.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM
  );
  return publicKey;
}

/**
 * Parser básico para los datos de metadatos del token
 */
function parseTokenMetadata(data) {
  try {
    // Los metadatos están en formato Borsh, aquí hacemos un parser básico
    // En una implementación completa usarías @metaplex-foundation/mpl-token-metadata
    
    const dataBuffer = Buffer.from(data);
    let offset = 1; // Skip account discriminator
    
    // Key (1 byte)
    offset += 1;
    
    // Update authority (32 bytes)
    offset += 32;
    
    // Mint (32 bytes)
    offset += 32;
    
    // Name length (4 bytes)
    if (offset + 4 > dataBuffer.length) return null;
    const nameLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    
    // Name
    if (offset + nameLength > dataBuffer.length) return null;
    const name = dataBuffer.subarray(offset, offset + nameLength).toString('utf8').replace(/\0/g, '');
    offset += nameLength;
    
    // Symbol length (4 bytes)
    if (offset + 4 > dataBuffer.length) return null;
    const symbolLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    
    // Symbol
    if (offset + symbolLength > dataBuffer.length) return null;
    const symbol = dataBuffer.subarray(offset, offset + symbolLength).toString('utf8').replace(/\0/g, '');
    
    return { name, symbol };
  } catch (error) {
    console.warn('Error parsing token metadata:', error);
    return null;
  }
}

/**
 * Formatea la información del token para mostrar
 */
export function formatTokenDisplay(tokenData, amount = null) {
  const { name, symbol, address } = tokenData;
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
  
  if (amount !== null) {
    return `${amount.toLocaleString()} ${symbol} (${name})`;
  }
  
  return `${symbol} - ${name} (${shortAddress})`;
}

/**
 * Obtiene información de múltiples tokens
 */
export async function getMultipleTokenMetadata(mintAddresses) {
  const promises = mintAddresses.map(mint => 
    getTokenMetadata(typeof mint === 'string' ? new PublicKey(mint) : mint)
  );
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple token metadata:', error);
    return mintAddresses.map(mint => ({
      name: 'Unknown Token',
      symbol: 'UNK',
      decimals: 9,
      address: typeof mint === 'string' ? mint : mint.toBase58()
    }));
  }
}

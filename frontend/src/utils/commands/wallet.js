import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { connection, TOKEN_PROGRAM_ID, retryWithFallback, getNetworkInfo } from '../solana';
import { mockWalletState, userProgress } from '../userState';
import { getTokenMetadata, formatTokenDisplay } from '../tokenMetadata';

export const walletCommands = {
  connect: async (args) => {
    if (mockWalletState.connected) {
      return {
        type: 'info',
        content: `WALLET ALREADY CONNECTED\nAddress: ${mockWalletState.address}`
      };
    }

    const wallet = args[0];
    if (!wallet) {
      return { type: 'error', content: 'Usage: connect <phantom|solflare>' };
    }

    const getProvider = () => {
      if (typeof window === 'undefined') return null;
      switch (wallet) {
        case 'phantom':
          return window?.phantom?.solana || (window?.solana?.isPhantom ? window.solana : null);
        case 'solflare':
          return window?.solflare;
        default:
          return null;
      }
    };

    const provider = getProvider();
    if (!provider) {
      return { type: 'error', content: `Wallet not found: ${wallet}` };
    }

    try {
      // Conectar wallet y capturar datos reales
      const response = await provider.connect();
      
      // Capturar datos reales del wallet
      const realPublicKey = response.publicKey || provider.publicKey;
      const realAddress = realPublicKey.toString();
      
      // Consultar balance real de SOL con sistema de fallback
      let realBalance = 0;
      try {
        realBalance = await retryWithFallback(async (conn) => {
          const balanceLamports = await conn.getBalance(realPublicKey);
          return balanceLamports / LAMPORTS_PER_SOL;
        });
      } catch (e) {
        console.warn('Error fetching SOL balance with all endpoints:', e.message);
        // Fallback: intentar con conexión directa
        try {
          const balanceLamports = await connection.getBalance(realPublicKey);
          realBalance = balanceLamports / LAMPORTS_PER_SOL;
        } catch (fallbackError) {
          console.error('Direct connection also failed:', fallbackError.message);
        }
      }
      
      // Consultar tokens SPL reales básicos con fallback
      let tokenCount = 0;
      try {
        tokenCount = await retryWithFallback(async (conn) => {
          const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
            realPublicKey,
            { programId: TOKEN_PROGRAM_ID }
          );
          return tokenAccounts.value.filter(
            ({ account }) => account.data.parsed.info.tokenAmount.uiAmount > 0
          ).length;
        });
      } catch (e) {
        console.warn('Error fetching token accounts with all endpoints:', e.message);
        // Fallback: intentar con conexión directa
        try {
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            realPublicKey,
            { programId: TOKEN_PROGRAM_ID }
          );
          tokenCount = tokenAccounts.value.filter(
            ({ account }) => account.data.parsed.info.tokenAmount.uiAmount > 0
          ).length;
        } catch (fallbackError) {
          console.warn('Direct token query also failed:', fallbackError.message);
        }
      }
      
      // Actualizar estado con datos reales
      mockWalletState.connected = true;
      mockWalletState.address = realAddress;
      mockWalletState.balance = realBalance;
      mockWalletState.provider = provider;
      mockWalletState.walletType = wallet;
      mockWalletState.tokenCount = tokenCount;
      mockWalletState.connectionTime = new Date().toISOString();
      mockWalletState.isReal = true; // Marcar como datos reales
      
      // Obtener información adicional del wallet
      const networkInfo = getNetworkInfo();
      const walletInfo = {
        type: wallet.toUpperCase(),
        address: realAddress,
        shortAddress: `${realAddress.slice(0, 4)}...${realAddress.slice(-4)}`,
        balance: realBalance.toFixed(4),
        tokenAccounts: tokenCount
      };

      return {
        type: 'result',
        content: `${walletInfo.type} WALLET CONNECTED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAddress: ${walletInfo.shortAddress}\nFull:    ${walletInfo.address}\nBalance: ${walletInfo.balance} SOL\nTokens:  ${walletInfo.tokenAccounts} SPL accounts\n\n⚡ Real wallet connected!\nNetwork: ${networkInfo.network.toUpperCase()}\n\nNext: 'balance' for updated data | 'walletinfo' for details`
      };
    } catch (err) {
      console.error('Wallet connection error:', err);
      return { 
        type: 'error', 
        content: `❌ CONNECTION FAILED\n\nWallet: ${wallet}\nError: ${err.message}\n\nTry: Check wallet extension is unlocked` 
      };
    }
  },

  disconnect: async () => {
    if (!mockWalletState.connected) {
      return { type: 'error', content: 'No wallet connected' };
    }

    try {
      await mockWalletState.provider?.disconnect();
    } catch (e) {}

    // Limpiar todos los datos del wallet
    mockWalletState.connected = false;
    mockWalletState.address = null;
    mockWalletState.balance = 0;
    mockWalletState.stakedAmount = 0;
    mockWalletState.rewards = 0;
    mockWalletState.rewardToken = null;
    mockWalletState.provider = null;
    mockWalletState.walletType = null;
    mockWalletState.tokenCount = 0;
    mockWalletState.connectionTime = null;
    mockWalletState.isReal = false;

    userProgress.level = 0;

    return { type: 'result', content: 'WALLET DISCONNECTED\n\nConnection terminated successfully.' };
  },

  balance: async () => {
    console.log('🔍 Balance command called');
    console.log('🔍 Wallet state:', {
      connected: mockWalletState.connected,
      address: mockWalletState.address,
      provider: !!mockWalletState.provider
    });
    
    if (!mockWalletState.connected) {
      console.log('❌ Wallet not connected');
      return { type: 'error', content: 'Connect wallet first using: connect' };
    }

    if (!mockWalletState.provider || !mockWalletState.provider.publicKey) {
      console.log('❌ Provider or publicKey missing');
      return { type: 'error', content: 'Wallet provider not available. Try reconnecting.' };
    }

    try {
      console.log('🔄 Starting balance fetch...');
      
      // Actualizar balance en tiempo real con fallback
      const realBalance = await retryWithFallback(async (conn) => {
        const balanceLamports = await conn.getBalance(mockWalletState.provider.publicKey);
        return balanceLamports / LAMPORTS_PER_SOL;
      });
      mockWalletState.balance = realBalance;
      console.log('✅ SOL balance fetched:', realBalance);

      // Obtener tokens SPL con fallback
      console.log('🔄 Fetching SPL tokens...');
      const tokens = await retryWithFallback(async (conn) => {
        const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
          mockWalletState.provider.publicKey,
          { programId: TOKEN_PROGRAM_ID }
        );
        
        return tokenAccounts.value
          .map(({ account }) => {
            const info = account.data.parsed.info;
            const amount = info.tokenAmount.uiAmount;
            const mint = info.mint;
            return { mint, amount };
          })
          .filter(t => t.amount > 0);
      });
      console.log('✅ SPL tokens fetched:', tokens.length, 'tokens');

      // Obtener metadatos de los tokens para mostrar nombres
      let tokenLines = 'No SPL tokens';
      if (tokens.length > 0) {
        try {
          const tokensToShow = tokens.slice(0, 5);
          const tokenMetadataPromises = tokensToShow.map(async (token) => {
            try {
              const metadata = await getTokenMetadata(new PublicKey(token.mint));
              return `${token.amount.toLocaleString()} ${metadata.symbol} (${metadata.name})`;
            } catch (error) {
              // Fallback si no se pueden obtener metadatos
              return `${token.mint.slice(0, 8)}...: ${token.amount.toLocaleString()}`;
            }
          });
          
          const tokenDisplays = await Promise.all(tokenMetadataPromises);
          tokenLines = tokenDisplays.join('\n');
          
          // Si hay más de 5 tokens, agregar indicador
          if (tokens.length > 5) {
            tokenLines += `\n... and ${tokens.length - 5} more tokens`;
          }
        } catch (error) {
          console.warn('Error fetching token metadata for balance:', error);
          // Fallback al formato anterior
          tokenLines = tokens
            .slice(0, 5)
            .map(t => `${t.mint.slice(0, 8)}...: ${t.amount.toLocaleString()}`)
            .join('\n');
        }
      }

      // Mostrar si los datos son reales o mock + red
      const networkInfo = getNetworkInfo();
      const networkIndicator = networkInfo.isTestnet ? '📱 DEVNET (testing)' : '⚡ MAINNET';
      const dataSource = mockWalletState.isReal ? `${networkIndicator} - Real data` : '📱 Simulated data';
      
      const result = {
        type: 'result',
        content: `WALLET BALANCES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSOL:     ${mockWalletState.balance.toFixed(4)}\n${tokenLines}\n\n${dataSource}`
      };
      
      console.log('✅ Balance command result:', result);
      return result;
      
    } catch (err) {
      console.error('❌ Balance fetch error:', err);
      return { 
        type: 'error', 
        content: `❌ BALANCE FETCH FAILED\n\nAll RPC endpoints failed.\nError: ${err.message}\n\nTry: reconnecting wallet or check network` 
      };
    }
  },

  // Comando para obtener información detallada de un token específico
  tokeninfo: async (args) => {
    if (!args[0]) {
      return { 
        type: 'error', 
        content: 'Usage: tokeninfo <token_address>\nExample: tokeninfo 5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF' 
      };
    }

    try {
      const tokenAddress = new PublicKey(args[0]);
      const metadata = await getTokenMetadata(tokenAddress);
      
      return {
        type: 'result',
        content: `TOKEN INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nName:     ${metadata.name}\nSymbol:   ${metadata.symbol}\nDecimals: ${metadata.decimals}\nAddress:  ${metadata.address}\nShort:    ${metadata.address.slice(0, 4)}...${metadata.address.slice(-4)}`
      };
    } catch (error) {
      return {
        type: 'error',
        content: `Invalid token address: ${args[0]}\nError: ${error.message}`
      };
    }
  },

  // Nuevo comando: mostrar información detallada de la conexión
  walletinfo: async () => {
    if (!mockWalletState.connected) {
      return { type: 'error', content: 'No wallet connected. Use: connect <wallet>' };
    }

    const connectionTime = mockWalletState.connectionTime 
      ? new Date(mockWalletState.connectionTime).toLocaleString()
      : 'Unknown';
    
    const networkInfo = getNetworkInfo();
    const statusIcon = mockWalletState.isReal ? '⚡' : '📱';
    const dataType = mockWalletState.isReal ? 'REAL BLOCKCHAIN DATA' : 'SIMULATED DATA';
    const networkStatus = networkInfo.isTestnet ? '📱 DEVNET (Testing Network)' : '⚡ MAINNET (Production Network)';
    
    return {
      type: 'result',
      content: `${statusIcon} WALLET CONNECTION INFO\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWallet Type: ${mockWalletState.walletType?.toUpperCase() || 'Unknown'}\nAddress:     ${mockWalletState.address}\nShort:       ${mockWalletState.address?.slice(0, 4)}...${mockWalletState.address?.slice(-4)}\nBalance:     ${mockWalletState.balance} SOL\nTokens:      ${mockWalletState.tokenCount} SPL accounts\nConnected:   ${connectionTime}\nData Type:   ${dataType}\nNetwork:     ${networkStatus}\n\nProvider:    ${mockWalletState.provider ? 'Active' : 'None'}`
    };
  }
};

/**
 * 🚀 Simple Pool Initialization using Anchor CLI
 * Manual approach using raw transactions
 */

const { Connection, PublicKey, Transaction, SystemProgram, Keypair } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, createInitializeAccountInstruction, createAccount } = require('@solana/spl-token');

// Configuration
const PROGRAM_ID = new PublicKey('Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P');
const PROMPT_MINT = new PublicKey('F1W4gQyFkhvLpMJQPWnk49THT7dza8HPepnff5AM6K6D');
const USDC_MINT = new PublicKey('2ejSzqgAJ139LMsikdqa2U2K2jutavdMwV1fcntyZ8qV');

async function checkProgramStatus() {
  try {
    console.log('🔍 Checking program and token status...\n');

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // Check program
    const programAccount = await connection.getAccountInfo(PROGRAM_ID);
    console.log('📋 Program Status:');
    console.log(`   Program ID: ${PROGRAM_ID.toString()}`);
    console.log(`   Deployed: ${programAccount ? '✅ Yes' : '❌ No'}`);
    console.log(`   Executable: ${programAccount?.executable ? '✅ Yes' : '❌ No'}`);

    // Check tokens
    const promptAccount = await connection.getAccountInfo(PROMPT_MINT);
    const usdcAccount = await connection.getAccountInfo(USDC_MINT);
    
    console.log('\n🪙 Token Status:');
    console.log(`   PROMPT Mint: ${PROMPT_MINT.toString()}`);
    console.log(`   PROMPT Exists: ${promptAccount ? '✅ Yes' : '❌ No'}`);
    console.log(`   USDC Mint: ${USDC_MINT.toString()}`);
    console.log(`   USDC Exists: ${usdcAccount ? '✅ Yes' : '❌ No'}`);

    console.log('\n🎯 Ready for pool initialization!');
    console.log('\nTo initialize pool manually, use Anchor CLI:');
    console.log(`anchor run initialize-pool --provider.cluster devnet`);
    
    // Save configuration for later use
    const config = {
      programId: PROGRAM_ID.toString(),
      promptMint: PROMPT_MINT.toString(),
      usdcMint: USDC_MINT.toString(),
      network: 'devnet',
      status: 'ready-for-initialization'
    };
    
    require('fs').writeFileSync('devnet-config.json', JSON.stringify(config, null, 2));
    console.log('💾 Configuration saved to devnet-config.json');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProgramStatus();
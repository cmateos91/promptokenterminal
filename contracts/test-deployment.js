const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');

async function testDeployment() {
    // Conectar a devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Program ID desplegado
    const programId = new PublicKey('Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P');
    
    console.log('🚀 Testing Staking Contract Deployment');
    console.log('Program ID:', programId.toString());
    
    // Verificar que el programa existe
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
        console.log('✅ Program deployed successfully!');
        console.log('- Executable:', programInfo.executable);
        console.log('- Data length:', programInfo.data.length);
        console.log('- Owner:', programInfo.owner.toString());
        console.log('- Balance:', programInfo.lamports / 1e9, 'SOL');
    } else {
        console.log('❌ Program not found');
        return;
    }
    
    // Información del programa
    console.log('\n📋 Contract Information:');
    console.log('- Network: Devnet');
    console.log('- Contract Type: Solana Program (Anchor)');
    console.log('- Features:');
    console.log('  • Flexible staking with any SPL token rewards');
    console.log('  • Timelock security for unstaking');
    console.log('  • Pool-based reward distribution');
    console.log('  • Emergency pause functionality');
    
    console.log('\n🎯 Available Instructions:');
    console.log('- initialize_pool: Create new staking pool');
    console.log('- stake_tokens: Stake tokens in pool');  
    console.log('- add_stake: Add more tokens to existing stake');
    console.log('- unstake_tokens: Withdraw staked tokens');
    console.log('- claim_rewards: Claim rewards in desired token');
    console.log('- fund_reward_pool: Add rewards to pool');
    
    console.log('\n✨ Deployment Complete!');
    console.log('You can now interact with the contract using the Program ID above.');
}

testDeployment().catch(console.error);
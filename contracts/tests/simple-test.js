const anchor = require('@coral-xyz/anchor');

describe('staking-simple', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  it('Can compile and load program', async () => {
    const program = anchor.workspace.Staking;
    console.log("Program ID:", program.programId.toString());
    
    // Basic test to verify program loads correctly
    const programAccount = await provider.connection.getAccountInfo(program.programId);
    console.log("Program account exists:", !!programAccount);
  });
});
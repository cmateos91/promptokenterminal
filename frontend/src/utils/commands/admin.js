/**
 * 🔐 Admin Commands for Contract Management
 * Only for testing and setup purposes
 */

import { mockWalletState } from "../userState";
import { devLogger } from "../logger";
import { realStakingService } from "../../services/stakingContractReal";

// Validation for development commands - only allow on localhost:3000
const isDevelopmentEnvironment = () => {
  return (
    window.location.hostname === "localhost" && window.location.port === "3000"
  );
};

const requireDevelopmentEnvironment = (commandName) => {
  if (!isDevelopmentEnvironment()) {
    return {
      type: "error",
      content: `🚫 DEVELOPMENT COMMAND RESTRICTED\n\nThe "${commandName}" command is only available in development environment.\n\nRequired: http://localhost\nCurrent: ${window.location.href}\n\n🔒 This command is restricted for security reasons.`,
    };
  }
  return null;
};

export const adminCommands = {
  "setup-pool": async (args) => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("setup-pool");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const startTime = performance.now();

    try {
      devLogger.command("admin:setup-pool", { args }, null);

      if (!mockWalletState.connected) {
        return {
          type: "error",
          content:
            "🔒 Connect wallet first. Admin operations require wallet connection.",
        };
      }

      // Example usage: setup-pool <stake-token-mint> <base-token-mint> <reward-rate> <min-duration>
      if (args.length < 4) {
        return {
          type: "error",
          content: `📋 USAGE: setup-pool <stake-mint> <base-mint> <reward-rate> <min-duration>

💡 Example: 
setup-pool DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263 EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 100 3600

📝 Parameters:
- stake-mint: Token to be staked (e.g., SOL, USDC)
- base-mint: Base token for rewards (e.g., USDC) 
- reward-rate: Rewards per second per token (scaled by 1e6)
- min-duration: Minimum stake time in seconds

⚠️  Only use on devnet for testing!`,
        };
      }

      const [stakeMintStr, baseMintStr, rewardRateStr, minDurationStr] = args;

      // This would be a real admin function in production
      const result = {
        signature: "mock_admin_setup_" + Date.now(),
        stakeMint: stakeMintStr,
        baseMint: baseMintStr,
        rewardRate: rewardRateStr,
        minDuration: minDurationStr,
        poolAddress: "Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P", // Mock pool address
      };

      const duration = performance.now() - startTime;
      devLogger.performance("admin:setup-pool", duration);

      return {
        type: "result",
        content: `✅ POOL SETUP INITIATED (MOCK)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🏊 Pool Address:     ${
          result.poolAddress
        }\n💎 Stake Token:      ${stakeMintStr}\n💰 Base Token:       ${baseMintStr}\n📈 Reward Rate:      ${rewardRateStr} per sec\n⏰ Min Duration:     ${minDurationStr}s\n🔗 Signature:        ${
          result.signature
        }\n⏱️  Processing:       ${duration.toFixed(
          0
        )}ms\n\n⚠️  This is a development/testing feature only.`,
      };
    } catch (error) {
      devLogger.error("admin:setup-pool", error);
      throw error;
    }
  },

  "contract-info": async () => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("contract-info");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const startTime = performance.now();

    try {
      devLogger.command("admin:contract-info", "Getting contract info", null);

      const health = await realStakingService.getContractHealth();
      const duration = performance.now() - startTime;

      return {
        type: "result",
        content: `🏗️ CONTRACT INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🆔 Program ID:       ${
          health.programId
        }\n✅ Deployed:         ${
          health.programDeployed ? "Yes" : "No"
        }\n🏃 Executable:       ${
          health.executable ? "Yes" : "No"
        }\n📊 Data Length:      ${
          health.dataLength
        } bytes\n👤 Owner:            ${
          health.owner || "Unknown"
        }\n🌐 RPC Endpoint:     ${
          health.connection.endpoint
        }\n🔗 Commitment:       ${
          health.connection.commitment
        }\n⏱️  Response:         ${duration.toFixed(
          0
        )}ms\n\n🔧 Available Instructions:\n• initialize_pool\n• stake_tokens\n• unstake_tokens  \n• claim_rewards\n• fund_reward_pool`,
      };
    } catch (error) {
      devLogger.error("admin:contract-info", error);
      return {
        type: "error",
        content: `❌ Failed to get contract info: ${error.message}`,
      };
    }
  },

  "test-connection": async () => {
    // Check development environment first
    const devEnvCheck = requireDevelopmentEnvironment("test-connection");
    if (devEnvCheck) {
      return devEnvCheck;
    }

    const startTime = performance.now();

    try {
      devLogger.command("admin:test-connection", "Testing connection", null);

      const health = await realStakingService.getContractHealth();
      const pools = await realStakingService.getStakingPools();
      const duration = performance.now() - startTime;

      return {
        type: "result",
        content: `🔗 CONNECTION TEST RESULTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🌐 RPC Connection:   ✅ Active\n🏗️ Contract:         ${
          health.programDeployed ? "✅ Found" : "❌ Not Found"
        }\n🏊 Pools Found:       ${
          pools.length
        }\n⏱️  Total Latency:    ${duration.toFixed(0)}ms\n\n${
          pools.length > 0
            ? pools
                .map(
                  (pool, i) =>
                    `[${i + 1}] ${pool.address.toString().slice(0, 8)}...`
                )
                .join("\n")
            : "📝 No pools found - ready for setup!"
        }`,
      };
    } catch (error) {
      devLogger.error("admin:test-connection", error);
      return {
        type: "error",
        content: `❌ Connection test failed: ${error.message}`,
      };
    }
  },
};

export default adminCommands;

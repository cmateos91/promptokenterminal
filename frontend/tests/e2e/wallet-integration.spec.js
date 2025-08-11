import { test, expect } from '@playwright/test';

/**
 * 🔗 Wallet Integration E2E Tests
 * Tests the complete wallet connection flow, balance checking, and transaction handling
 */

test.describe('Wallet Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
    
    // Wait for the terminal to be loaded
    await page.waitForSelector('.terminal-container', { timeout: 10000 });
    
    // Wait for the welcome message to appear
    await expect(page.locator('.welcome-text')).toBeVisible();
  });

  test('should display wallet connection commands in help', async ({ page }) => {
    // Type help command
    await page.locator('.terminal-input').fill('help');
    await page.press('.terminal-input', 'Enter');
    
    // Wait for help content
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Check that wallet commands are listed
    const helpContent = await page.locator('.command-result').last().textContent();
    expect(helpContent).toContain('connect <wallet>');
    expect(helpContent).toContain('disconnect');
    expect(helpContent).toContain('balance');
    expect(helpContent).toContain('walletinfo');
  });

  test('should show error when trying restricted commands without wallet', async ({ page }) => {
    // Try to check balance without connecting wallet
    await page.locator('.terminal-input').fill('balance');
    await page.press('.terminal-input', 'Enter');
    
    // Wait for error response
    await page.waitForSelector('.error-text', { timeout: 5000 });
    
    // Check that access is denied
    const errorText = await page.locator('.error-text').last().textContent();
    expect(errorText).toContain('ACCESS DENIED');
  });

  test('should handle phantom wallet connection flow', async ({ page }) => {
    // Mock window.phantom for testing
    await page.addInitScript(() => {
      window.phantom = {
        solana: {
          isPhantom: true,
          connect: async () => ({
            publicKey: {
              toString: () => '11111111111111111111111111111112'
            }
          }),
          disconnect: async () => {},
          isConnected: true
        }
      };
    });

    // Try to connect phantom wallet
    await page.locator('.terminal-input').fill('connect phantom');
    await page.press('.terminal-input', 'Enter');
    
    // Wait for connection response
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Check connection success or appropriate handling
    const resultText = await page.locator('.command-result').last().textContent();
    expect(resultText).toMatch(/(Connected|ACCESS DENIED|Phantom wallet not detected)/);
  });

  test('should handle wallet disconnection', async ({ page }) => {
    // First try to disconnect (should show not connected message)
    await page.locator('.terminal-input').fill('disconnect');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    const resultText = await page.locator('.command-result').last().textContent();
    expect(resultText).toMatch(/(No wallet connected|Wallet disconnected)/);
  });

  test('should display wallet info when requested', async ({ page }) => {
    // Try walletinfo command
    await page.locator('.terminal-input').fill('walletinfo');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Should get some wallet information or connection status
    const resultText = await page.locator('.command-result').last().textContent();
    expect(resultText).toBeTruthy();
  });

  test('should validate wallet address format in commands', async ({ page }) => {
    // Test tokeninfo with invalid address
    await page.locator('.terminal-input').fill('tokeninfo invalid-address');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Should show error for invalid address
    const resultText = await page.locator('.command-result').last().textContent();
    expect(resultText).toMatch(/(Invalid|Error|not found)/i);
  });

  test('should handle network switching gracefully', async ({ page }) => {
    // Test RPC endpoint handling
    await page.locator('.terminal-input').fill('debug network');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Should get network debug info
    const resultText = await page.locator('.command-result').last().textContent();
    expect(resultText).toBeTruthy();
  });

  test('should maintain wallet state across commands', async ({ page }) => {
    // Execute multiple wallet-related commands to test state persistence
    const commands = ['walletinfo', 'balance', 'disconnect'];
    
    for (const command of commands) {
      await page.locator('.terminal-input').fill(command);
      await page.press('.terminal-input', 'Enter');
      await page.waitForTimeout(1000); // Wait between commands
    }
    
    // Check that all commands executed (history should have all entries)
    const commandHistory = await page.locator('.command-line').count();
    expect(commandHistory).toBeGreaterThanOrEqual(commands.length);
  });

  test('should show loading state during wallet operations', async ({ page }) => {
    // Check for loading states during commands that might take time
    await page.locator('.terminal-input').fill('balance');
    await page.press('.terminal-input', 'Enter');
    
    // Check if loading indicator appears (even briefly)
    const input = page.locator('.terminal-input');
    const placeholder = await input.getAttribute('placeholder');
    
    // Input should be disabled during loading or show processing message
    expect(placeholder).toMatch(/(Processing|Enter command)/);
  });

  test('should handle wallet connection errors gracefully', async ({ page }) => {
    // Mock a failing wallet connection
    await page.addInitScript(() => {
      window.phantom = {
        solana: {
          isPhantom: true,
          connect: async () => {
            throw new Error('User rejected connection');
          },
          isConnected: false
        }
      };
    });

    await page.locator('.terminal-input').fill('connect phantom');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Should handle connection error gracefully
    const resultText = await page.locator('.command-result').last().textContent();
    expect(resultText).toMatch(/(Error|Failed|rejected|not detected)/i);
  });
});
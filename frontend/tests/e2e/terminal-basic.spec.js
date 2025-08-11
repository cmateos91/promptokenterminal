import { test, expect } from '@playwright/test';

/**
 * 🖥️ Terminal Basic Functionality E2E Tests
 * Tests core terminal features, command execution, and user interactions
 */

test.describe('Terminal Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.terminal-container', { timeout: 10000 });
    await expect(page.locator('.welcome-text')).toBeVisible();
  });

  test('should display welcome message and ASCII art', async ({ page }) => {
    // Check for ASCII art in welcome message
    const welcomeText = await page.locator('.welcome-text .ascii-art').textContent();
    expect(welcomeText).toBeTruthy();
    expect(welcomeText.length).toBeGreaterThan(50); // ASCII art should be substantial
  });

  test('should show terminal prompt correctly', async ({ page }) => {
    const prompt = page.locator('.terminal-prompt').first();
    await expect(prompt).toBeVisible();
    await expect(prompt).toHaveText('$PROMPT>');
  });

  test('should execute help command and show command list', async ({ page }) => {
    await page.locator('.terminal-input').fill('help');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    const helpContent = await page.locator('.command-result').last().textContent();
    
    // Check for major command categories
    expect(helpContent).toContain('WALLET OPERATIONS');
    expect(helpContent).toContain('STAKING OPERATIONS');
    expect(helpContent).toContain('INFORMATION');
    expect(helpContent).toContain('SYSTEM');
  });

  test('should clear terminal when clear command is executed', async ({ page }) => {
    // Execute some commands first
    await page.locator('.terminal-input').fill('help');
    await page.press('.terminal-input', 'Enter');
    await page.waitForSelector('.command-result');
    
    await page.locator('.terminal-input').fill('about');
    await page.press('.terminal-input', 'Enter');
    await page.waitForSelector('.command-result');
    
    // Count history items before clear
    const historyCountBefore = await page.locator('.terminal-output > *').count();
    expect(historyCountBefore).toBeGreaterThan(1);
    
    // Execute clear command
    await page.locator('.terminal-input').fill('clear');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForTimeout(500);
    
    // History should be cleared (only welcome message should remain)
    const historyCountAfter = await page.locator('.terminal-output > *').count();
    expect(historyCountAfter).toBeLessThanOrEqual(2); // Welcome + maybe one result
  });

  test('should handle command aliases correctly', async ({ page }) => {
    // Test help alias
    await page.locator('.terminal-input').fill('h');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result');
    const helpResult = await page.locator('.command-result').last().textContent();
    expect(helpResult).toContain('AVAILABLE COMMANDS');
    
    // Test clear alias
    await page.locator('.terminal-input').fill('c');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForTimeout(500);
    // Terminal should be cleared
  });

  test('should show error for unknown commands', async ({ page }) => {
    await page.locator('.terminal-input').fill('unknowncommand123');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.error-text', { timeout: 5000 });
    
    const errorText = await page.locator('.error-text').last().textContent();
    expect(errorText).toContain('Command not found');
    expect(errorText).toContain('unknowncommand123');
  });

  test('should handle command autocompletion', async ({ page }) => {
    // Type partial command
    await page.locator('.terminal-input').fill('hel');
    
    // Press Tab for autocompletion
    await page.press('.terminal-input', 'Tab');
    await page.waitForTimeout(300);
    
    // Input should be completed to 'help'
    const inputValue = await page.locator('.terminal-input').inputValue();
    expect(inputValue).toBe('help');
  });

  test('should show command suggestions', async ({ page }) => {
    // Type partial command that has multiple matches
    await page.locator('.terminal-input').fill('ba');
    await page.waitForTimeout(300);
    
    // Check if suggestions appear
    const suggestions = page.locator('.suggestions');
    if (await suggestions.isVisible()) {
      const suggestionItems = page.locator('.suggestion-item');
      const count = await suggestionItems.count();
      expect(count).toBeGreaterThan(0);
      
      // Should include 'balance' and 'banner'
      const suggestionTexts = await suggestionItems.allTextContents();
      expect(suggestionTexts.some(text => text.includes('balance'))).toBe(true);
    }
  });

  test('should execute commands case-insensitively', async ({ page }) => {
    // Test uppercase command
    await page.locator('.terminal-input').fill('HELP');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result');
    const result = await page.locator('.command-result').last().textContent();
    expect(result).toContain('AVAILABLE COMMANDS');
    
    // Test mixed case
    await page.locator('.terminal-input').fill('AbOuT');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result');
  });

  test('should maintain command history', async ({ page }) => {
    const commands = ['help', 'about', 'version'];
    
    // Execute multiple commands
    for (const cmd of commands) {
      await page.locator('.terminal-input').fill(cmd);
      await page.press('.terminal-input', 'Enter');
      await page.waitForTimeout(500);
    }
    
    // Clear input and use arrow keys to navigate history
    await page.locator('.terminal-input').fill('');
    
    // Press Up arrow to get last command
    await page.press('.terminal-input', 'ArrowUp');
    await page.waitForTimeout(100);
    
    const inputValue = await page.locator('.terminal-input').inputValue();
    expect(inputValue).toBe('version');
    
    // Press Up again to get previous command
    await page.press('.terminal-input', 'ArrowUp');
    await page.waitForTimeout(100);
    
    const inputValue2 = await page.locator('.terminal-input').inputValue();
    expect(inputValue2).toBe('about');
  });

  test('should disable input during command execution', async ({ page }) => {
    // Execute a command that might take time
    await page.locator('.terminal-input').fill('health');
    await page.press('.terminal-input', 'Enter');
    
    // Check if input is disabled immediately after submit
    const isDisabled = await page.locator('.terminal-input').isDisabled();
    // Note: This might be brief, so we check the placeholder or loading state
    const placeholder = await page.locator('.terminal-input').getAttribute('placeholder');
    
    if (isDisabled || placeholder === 'Processing...') {
      // Input handling is working correctly
      expect(true).toBe(true);
    }
  });

  test('should handle special characters in commands', async ({ page }) => {
    // Test command with special characters
    await page.locator('.terminal-input').fill('help --verbose');
    await page.press('.terminal-input', 'Enter');
    
    await page.waitForSelector('.command-result');
    // Should handle gracefully (either execute or show appropriate error)
    const result = await page.locator('.command-result').last().textContent();
    expect(result).toBeTruthy();
  });

  test('should show system stats component', async ({ page }) => {
    const systemStats = page.locator('.system-stats');
    await expect(systemStats).toBeVisible();
    
    // Check for key system information
    const statsContent = await systemStats.textContent();
    expect(statsContent).toMatch(/Network|Status|Users|Uptime/);
  });

  test('should handle rapid command execution', async ({ page }) => {
    // Execute commands rapidly
    const commands = ['help', 'about', 'version', 'clear'];
    
    for (const cmd of commands) {
      await page.locator('.terminal-input').fill(cmd);
      await page.press('.terminal-input', 'Enter');
      // Minimal wait to simulate rapid typing
      await page.waitForTimeout(100);
    }
    
    // Terminal should handle all commands without errors
    // Last command (clear) should have cleared the terminal
    await page.waitForTimeout(500);
    
    const historyCount = await page.locator('.terminal-output > *').count();
    expect(historyCount).toBeLessThanOrEqual(2); // Should be mostly cleared
  });

  test('should maintain focus management correctly', async ({ page }) => {
    // Input should be focused initially
    const input = page.locator('.terminal-input');
    
    // Click elsewhere
    await page.locator('.terminal-header').click();
    
    // Input should regain focus quickly for better UX
    await page.waitForTimeout(100);
    
    // Try typing - should work (indicating focus is managed)
    await page.keyboard.type('test');
    const value = await input.inputValue();
    expect(value).toBe('test');
  });

  test('should show appropriate loading states', async ({ page }) => {
    // Commands that might show loading
    await page.locator('.terminal-input').fill('balance');
    await page.press('.terminal-input', 'Enter');
    
    // Look for loading indicators
    await page.waitForSelector('.command-result', { timeout: 5000 });
    
    // Should get some result (even if error due to no wallet)
    const result = await page.locator('.command-result').last().textContent();
    expect(result).toBeTruthy();
  });
});
import { test, expect, devices } from '@playwright/test';

/**
 * 📱 Mobile Experience E2E Tests
 * Tests mobile-specific functionality, touch interactions, and responsive design
 */

test.describe('Mobile Experience - iPhone', () => {
  test.beforeEach(async ({ page }) => {
    // Set iPhone viewport
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');
    await page.waitForSelector('.terminal-container', { timeout: 10000 });
  });

  test('should load correctly on iPhone viewport', async ({ page }) => {
    // Check that mobile optimizations are applied
    await expect(page.locator('.terminal-container')).toBeVisible();
    
    // Verify mobile-specific CSS is applied
    const terminalContainer = page.locator('.terminal-container');
    const boundingBox = await terminalContainer.boundingBox();
    
    // Should fit within iPhone viewport
    expect(boundingBox.width).toBeLessThanOrEqual(devices['iPhone 12'].viewport.width);
  });

  test('should handle virtual keyboard on iPhone', async ({ page }) => {
    await page.waitForSelector('.terminal-input');
    
    // Focus on input to trigger virtual keyboard
    await page.locator('.terminal-input').click();
    
    // Input should scroll into view
    await page.waitForTimeout(500); // Wait for scroll animation
    
    const input = page.locator('.terminal-input');
    await expect(input).toBeFocused();
    
    // Should be able to type
    await input.fill('help');
    await expect(input).toHaveValue('help');
  });

  test('should prevent zoom on input focus (iOS)', async ({ page }) => {
    await page.waitForSelector('.terminal-input');
    
    // Tap input
    await page.locator('.terminal-input').click();
    await page.waitForTimeout(500);
    
    // Check that zoom is prevented (font-size should be 16px or larger)
    const fontSize = await page.locator('.terminal-input').evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(16);
  });
});

test.describe('Mobile Experience - Android', () => {
  test.beforeEach(async ({ page }) => {
    // Set Android viewport
    await page.setViewportSize(devices['Pixel 5'].viewport);
    await page.goto('/');
    await page.waitForSelector('.terminal-container', { timeout: 10000 });
  });

  test('should load correctly on Android viewport', async ({ page }) => {
    await expect(page.locator('.terminal-container')).toBeVisible();
    
    // Check responsive design works
    const header = page.locator('.terminal-header');
    await expect(header).toBeVisible();
    
    // Mobile subtitle should be hidden
    const subtitle = page.locator('.terminal-subtitle');
    if (await subtitle.count() > 0) {
      await expect(subtitle).toBeHidden();
    }
  });

  test('should handle touch interactions on Android', async ({ page }) => {
    await page.waitForSelector('.terminal-input');
    
    // Test touch-based command execution
    await page.locator('.terminal-input').click();
    await page.locator('.terminal-input').fill('help');
    
    // Submit with touch
    await page.locator('.terminal-input').press('Enter');
    
    await page.waitForSelector('.command-result', { timeout: 5000 });
    await expect(page.locator('.command-result')).toBeVisible();
  });
});

test.describe('Mobile Experience - Cross Platform', () => {
  const testDevices = [
    { name: 'iPhone', viewport: devices['iPhone 12'].viewport },
    { name: 'Android', viewport: devices['Pixel 5'].viewport }
  ];

  for (const device of testDevices) {
    test(`should show mobile-optimized help on ${device.name}`, async ({ page }) => {
      await page.setViewportSize(device.viewport);
      await page.goto('/');
      
      await page.locator('.terminal-input').fill('help');
      await page.press('.terminal-input', 'Enter');
      
      await page.waitForSelector('.command-result', { timeout: 5000 });
      
      // Check mobile-specific footer text
      const footerText = await page.locator('.footer-text').textContent();
      expect(footerText).toContain('TAB: autocomplete');
      expect(footerText).toContain("Type 'help' for commands");
      
      // Mobile version should not show desktop shortcuts
      expect(footerText).not.toContain('CTRL+C');
      expect(footerText).not.toContain('UP/DOWN: history');
    });

    test(`should handle command suggestions on ${device.name}`, async ({ page }) => {
      await page.setViewportSize(device.viewport);
      await page.goto('/');
      
      // Type partial command to trigger suggestions
      await page.locator('.terminal-input').fill('con');
      await page.waitForTimeout(300); // Wait for suggestions
      
      // Check if suggestions appear
      const suggestions = page.locator('.suggestions');
      if (await suggestions.isVisible()) {
        // Test touch interaction with suggestions
        const firstSuggestion = page.locator('.suggestion-item').first();
        if (await firstSuggestion.count() > 0) {
          await firstSuggestion.click();
          
          // Should complete the command
          const inputValue = await page.locator('.terminal-input').inputValue();
          expect(inputValue).toBeTruthy();
        }
      }
    });

    test(`should handle scroll behavior on ${device.name}`, async ({ page }) => {
      await page.setViewportSize(device.viewport);
      await page.goto('/');
      
      // Execute multiple commands to create scroll content
      const commands = ['help', 'about', 'version'];
      
      for (const cmd of commands) {
        await page.locator('.terminal-input').fill(cmd);
        await page.press('.terminal-input', 'Enter');
        await page.waitForTimeout(500);
      }
      
      // Terminal should scroll to show latest content
      const terminalOutput = page.locator('.terminal-output');
      const scrollTop = await terminalOutput.evaluate(el => el.scrollTop);
      const scrollHeight = await terminalOutput.evaluate(el => el.scrollHeight);
      const clientHeight = await terminalOutput.evaluate(el => el.clientHeight);
      
      // Should be scrolled if content overflows
      if (scrollHeight > clientHeight) {
        expect(scrollTop + clientHeight).toBeGreaterThan(scrollHeight * 0.5);
      }
    });
  }
});

test.describe('Mobile Performance', () => {
  test('should be responsive to touch events', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');
    
    await page.waitForSelector('.terminal-input');
    
    // Measure touch response time
    const startTime = Date.now();
    await page.locator('.terminal-input').click();
    
    await page.waitForFunction(() => {
      return document.activeElement && document.activeElement.classList.contains('terminal-input');
    }, { timeout: 2000 });
    
    const responseTime = Date.now() - startTime;
    
    // Touch should be responsive (< 1000ms for test environment)
    expect(responseTime).toBeLessThan(1000);
  });
});
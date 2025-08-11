import { test, expect, devices } from '@playwright/test';

/**
 * 📱 Mobile Experience E2E Tests
 * Tests mobile-specific functionality, touch interactions, and responsive design
 */

// Configure mobile tests
const iPhone = devices['iPhone 12'];
const androidPhone = devices['Pixel 5'];

test.describe('Mobile Experience', () => {
  
  test.describe('iPhone Tests', () => {
    test.use({ ...iPhone });
    
    test('should load correctly on iPhone viewport', async ({ page }) => {
      await page.goto('/');
      
      // Check that mobile optimizations are applied
      await expect(page.locator('.terminal-container')).toBeVisible();
      
      // Verify mobile-specific CSS is applied
      const terminalContainer = page.locator('.terminal-container');
      const boundingBox = await terminalContainer.boundingBox();
      
      // Should fit within iPhone viewport
      expect(boundingBox.width).toBeLessThanOrEqual(iPhone.viewport.width);
    });

    test('should handle virtual keyboard on iPhone', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-input');
      
      // Focus on input to trigger virtual keyboard
      await page.locator('.terminal-input').tap();
      
      // Input should scroll into view
      await page.waitForTimeout(500); // Wait for scroll animation
      
      const input = page.locator('.terminal-input');
      await expect(input).toBeFocused();
      
      // Should be able to type
      await page.locator('.terminal-input').fill('help');
      await expect(page.locator('.terminal-input')).toHaveValue('help');
    });

    test('should prevent zoom on input focus (iOS)', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-input');
      
      // Get initial viewport scale
      const initialScale = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return viewport ? viewport.content : null;
      });
      
      // Tap input
      await page.locator('.terminal-input').tap();
      await page.waitForTimeout(500);
      
      // Check that zoom is prevented (font-size should be 16px or larger)
      const fontSize = await page.locator('.terminal-input').evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });
      
      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(16);
    });
  });

  test.describe('Android Tests', () => {
    test.use({ ...androidPhone });
    
    test('should load correctly on Android viewport', async ({ page }) => {
      await page.goto('/');
      
      await expect(page.locator('.terminal-container')).toBeVisible();
      
      // Check responsive design works
      const header = page.locator('.terminal-header');
      await expect(header).toBeVisible();
      
      // Mobile subtitle should be hidden
      await expect(page.locator('.terminal-subtitle')).toBeHidden();
    });

    test('should handle touch interactions on Android', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-input');
      
      // Test touch-based command execution
      await page.locator('.terminal-input').tap();
      await page.locator('.terminal-input').fill('help');
      
      // Submit with touch
      await page.locator('.terminal-input').press('Enter');
      
      await page.waitForSelector('.command-result');
      await expect(page.locator('.command-result')).toBeVisible();
    });
  });

  test.describe('Cross-Mobile Features', () => {
    [
      { name: 'iPhone', device: iPhone },
      { name: 'Android', device: androidPhone }
    ].forEach(({ name, device }) => {
      
      test(`should show mobile-optimized help on ${name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto('/');
        
        await page.locator('.terminal-input').fill('help');
        await page.press('.terminal-input', 'Enter');
        
        await page.waitForSelector('.command-result');
        
        // Check mobile-specific footer text
        const footerText = await page.locator('.footer-text').textContent();
        expect(footerText).toContain('TAB: autocomplete');
        expect(footerText).toContain("Type 'help' for commands");
        
        // Mobile version should not show desktop shortcuts
        expect(footerText).not.toContain('CTRL+C');
        expect(footerText).not.toContain('UP/DOWN: history');
      });

      test(`should handle command suggestions on ${name}`, async ({ page }) => {
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
          await firstSuggestion.tap();
          
          // Should complete the command
          const inputValue = await page.locator('.terminal-input').inputValue();
          expect(inputValue).toBeTruthy();
        }
      });

      test(`should handle scroll behavior on ${name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto('/');
        
        // Execute multiple commands to create scroll content
        const commands = ['help', 'about', 'version', 'clear', 'help'];
        
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
        
        // Should be scrolled near bottom
        expect(scrollTop + clientHeight).toBeGreaterThan(scrollHeight * 0.8);
      });

      test(`should prevent pull-to-refresh on ${name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto('/');
        
        await page.waitForSelector('.terminal-output');
        
        // Try to pull down on terminal area
        const terminalOutput = page.locator('.terminal-output');
        
        // Get initial scroll position
        const initialScrollY = await page.evaluate(() => window.scrollY);
        
        // Simulate pull gesture
        await terminalOutput.hover();
        await page.mouse.down();
        await page.mouse.move(0, 100);
        await page.mouse.up();
        
        await page.waitForTimeout(300);
        
        // Page should not have been refreshed or scrolled beyond limits
        const finalScrollY = await page.evaluate(() => window.scrollY);
        expect(Math.abs(finalScrollY - initialScrollY)).toBeLessThan(50);
      });

      test(`should maintain terminal state during orientation change on ${name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto('/');
        
        // Execute a command
        await page.locator('.terminal-input').fill('about');
        await page.press('.terminal-input', 'Enter');
        await page.waitForSelector('.command-result');
        
        // Simulate orientation change
        const landscapeViewport = {
          width: device.viewport.height,
          height: device.viewport.width
        };
        
        await page.setViewportSize(landscapeViewport);
        await page.waitForTimeout(500);
        
        // Terminal content should still be visible
        await expect(page.locator('.terminal-container')).toBeVisible();
        await expect(page.locator('.command-result')).toBeVisible();
        
        // Should be able to execute new commands
        await page.locator('.terminal-input').fill('clear');
        await page.press('.terminal-input', 'Enter');
      });

      test(`should handle safe area insets on ${name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        await page.goto('/');
        
        // Check for safe area CSS custom properties
        const hasSafeAreaSupport = await page.evaluate(() => {
          const testEl = document.createElement('div');
          testEl.style.paddingTop = 'env(safe-area-inset-top)';
          document.body.appendChild(testEl);
          
          const computedStyle = window.getComputedStyle(testEl);
          const hasSupport = computedStyle.paddingTop !== '0px' || 
                           CSS.supports('padding-top', 'env(safe-area-inset-top)');
          
          document.body.removeChild(testEl);
          return hasSupport;
        });
        
        // Terminal should adapt to safe areas if supported
        if (hasSafeAreaSupport) {
          const terminalContainer = page.locator('.terminal-container');
          const padding = await terminalContainer.evaluate(el => {
            const style = window.getComputedStyle(el);
            return {
              top: style.paddingTop,
              bottom: style.paddingBottom,
              left: style.paddingLeft,
              right: style.paddingRight
            };
          });
          
          // Should have some padding for safe areas
          expect(parseInt(padding.top) + parseInt(padding.bottom)).toBeGreaterThan(0);
        }
      });
    });
  });

  test.describe('Mobile Performance', () => {
    test('should load quickly on mobile network', async ({ page }) => {
      // Simulate slow 3G network
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
        return route.continue();
      });
      
      const startTime = Date.now();
      await page.goto('/');
      
      await page.waitForSelector('.terminal-container');
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time even on slow network
      expect(loadTime).toBeLessThan(10000); // 10 seconds max
    });

    test('should be responsive to touch events', async ({ page }) => {
      await page.setViewportSize(iPhone.viewport);
      await page.goto('/');
      
      await page.waitForSelector('.terminal-input');
      
      // Measure touch response time
      const startTime = Date.now();
      await page.locator('.terminal-input').tap();
      
      await page.waitForFunction(() => {
        return document.activeElement.classList.contains('terminal-input');
      });
      
      const responseTime = Date.now() - startTime;
      
      // Touch should be responsive (< 100ms)
      expect(responseTime).toBeLessThan(100);
    });
  });
});
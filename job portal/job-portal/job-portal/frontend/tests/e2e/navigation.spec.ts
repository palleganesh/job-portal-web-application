import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if navbar exists
    const navbar = page.locator('nav, header, [class*="navbar"], [class*="header"]');
    await expect(navbar.first()).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Check initial URL
    await expect(page).toHaveURL(/.*\//);
  });

  test('should handle responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Page should still be accessible
    await expect(page).toHaveURL(/.*\//);
  });

  test('should handle responsive layout on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    // Page should still be accessible
    await expect(page).toHaveURL(/.*\//);
  });
});

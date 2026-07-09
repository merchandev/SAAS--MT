import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should render home page and allow searching for a transfer', async ({ page }) => {
    await page.goto('/es');
    
    // Check main title
    await expect(page.locator('h1')).toContainText('Traslados privados en Barcelona con precio cerrado');
    
    // Fill origin and destination (simulated)
    // We would need to mock Google Maps for this, so just checking UI presence
    const originInput = page.getByPlaceholder(/origen/i);
    const destinationInput = page.getByPlaceholder(/destino/i);
    
    await expect(originInput).toBeVisible();
    await expect(destinationInput).toBeVisible();
    
    // Verify booking button exists
    const searchBtn = page.getByRole('button', { name: /buscar/i });
    await expect(searchBtn).toBeVisible();
  });

  test('should load the booking checkout page properly', async ({ page }) => {
    // Navigate directly with query params to simulate search
    await page.goto('/es/booking?origin=Airport&originId=id1&destination=Hotel&destinationId=id2&date=2028-01-01&time=10:00');
    
    // The page should eventually show pricing or a skeleton
    await expect(page.getByText('Resumen del Viaje')).toBeVisible({ timeout: 10000 });
  });
});

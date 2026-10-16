import { test, expect } from '@playwright/test';
import { orderRequestCopy } from '../src/orderRequest.js';

test.beforeEach(async ({ page }) => {
  page.on('dialog', () => { throw new Error('Unexpected payment dialog'); });
  page.on('pageerror', error => { throw error; });
});

for (const lang of ['TR', 'EN', 'ZH', 'ES']) {
  test(`${lang}: no card fields or false success; cancelled external handoff preserves cart`, async ({ page, context }) => {
    await context.route('https://wa.me/**', route => route.abort());
    await page.goto(`/tests/fixtures/cart.html?lang=${lang}`);
    const copy = orderRequestCopy[lang];
    await expect(page.locator('input, form')).toHaveCount(0);
    await expect(page.getByText(copy.notice)).toBeVisible();
    await page.getByRole('button', { name: copy.prepare }).click();
    await expect(page.getByLabel(copy.draft)).toHaveValue(/product-0/);
    const href = await page.getByRole('link', { name: copy.open }).getAttribute('href');
    expect(new URL(href).searchParams.get('text')).toContain(copy.intro);
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: copy.open }).click();
    const popup = await popupPromise;
    await popup.close();
    await page.waitForTimeout(2200); // Regression: former fake payment completed at 2 seconds.
    await expect(page.locator('.cart-item-card')).toHaveCount(2);
    await expect(page.getByLabel(copy.draft)).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
    expect(page.url()).toContain('/tests/fixtures/cart.html');
    await page.getByRole('button', { name: copy.back }).click();
    await expect(page.getByRole('button', { name: copy.prepare })).toBeVisible();
  });
}

test('removing products updates request and subtotal; empty cart cannot submit', async ({ page }) => {
  await page.goto('/tests/fixtures/cart.html');
  await page.getByRole('button', { name: orderRequestCopy.EN.prepare }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
  await expect(page.getByLabel(orderRequestCopy.EN.draft)).not.toHaveValue(/product-0/);
  await expect(page.locator('.total-amount')).toHaveText('1200 TL');
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByText('Empty bag')).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await page.goto('/tests/fixtures/cart.html?mode=empty');
  await expect(page.getByText('Empty bag')).toBeVisible();
});

test('invalid prices cannot prepare a request and expose contact fallback', async ({ page }) => {
  await page.goto('/tests/fixtures/cart.html?mode=invalid');
  await expect(page.getByRole('alert')).toHaveText(orderRequestCopy.EN.invalid);
  await expect(page.getByRole('button', { name: orderRequestCopy.EN.prepare })).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:kibelejewellery@gmail.com');
});

test('long requests provide complete selectable fallback text', async ({ page }) => {
  await page.goto('/tests/fixtures/cart.html?mode=long');
  await page.getByRole('button', { name: orderRequestCopy.EN.prepare }).click();
  await expect(page.getByLabel(orderRequestCopy.EN.draft)).toHaveValue(/product-199/);
  await expect(page.getByRole('status')).toHaveText(orderRequestCopy.EN.long);
  await expect(page.getByRole('link', { name: 'WhatsApp', exact: true })).toHaveAttribute('href', 'https://wa.me/905050349650');
});

test('mobile request controls fit viewport and text stays read-only', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/tests/fixtures/cart.html?lang=TR');
  await page.getByRole('button', { name: orderRequestCopy.TR.prepare }).click();
  await expect(page.getByLabel(orderRequestCopy.TR.draft)).toHaveAttribute('readonly', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('link', { name: orderRequestCopy.TR.open })).toBeVisible();
});

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('club-board tbody tr')).toHaveCount(6);
});

test('loads self-hosted assets under a project path without runtime errors', async ({ page }) => {
  const errors = [];
  const failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  await page.reload();
  await expect(page).toHaveTitle(/Moltivate/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('muscles are');
  await page.locator('#club').scrollIntoViewIfNeeded();
  await expect(page.locator('club-board tbody tr')).toHaveCount(6);
  await expect.poll(() => page.locator('img').evaluateAll(images =>
    images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('app availability stays honest and dialogs close with Escape', async ({ page }) => {
  await page.getByRole('button', { name: 'App Store, coming soon. View app availability' }).click();
  const dialog = page.locator('#app-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Coming soon');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  if (await page.getByRole('button', { name: 'Open navigation' }).isVisible()) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.locator('#main-nav').getByRole('link', { name: 'The club' }).click();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  }
});

test('phone demo completes join, workout, receipt, and replay', async ({ page }) => {
  const phone = page.locator('moltivate-demo');
  // Reduced motion stops the tour; interaction remains available.
  await expect(phone.getByRole('button', { name: 'Play automatic demo' })).toBeVisible();
  await phone.getByRole('button', { name: 'Count me in' }).click();
  await expect(phone.getByRole('dialog')).toContainText('No real wallet');
  await phone.getByRole('button', { name: 'Join the demo challenge' }).click();
  await phone.getByRole('button', { name: 'You’re in. Let’s move.' }).click();
  await phone.getByRole('button', { name: 'Start demo set' }).click();
  await phone.getByRole('button', { name: 'See the sample result' }).click();
  await phone.getByRole('button', { name: 'Try claiming your reward' }).click();
  await expect(phone.getByRole('dialog')).toContainText('No wallet was connected and no transaction was sent.');
  await page.keyboard.press('Escape');
  await expect(phone.getByRole('dialog')).not.toBeVisible();
  await phone.getByRole('button', { name: 'Restart app demo' }).click();
  await expect(phone.getByRole('button', { name: 'Count me in' })).toBeVisible();
});

test('leaderboard filters, sorting, periods, and details stay consistent', async ({ page }) => {
  const board = page.locator('club-board');
  const search = board.getByRole('searchbox', { name: 'Search teams' });
  await search.fill('early');
  await expect(board.locator('tbody tr')).toHaveCount(1);
  const amount = board.locator('rolling-amount');
  const weekly = await amount.getAttribute('data-value');
  await board.locator('select[name="period"]').selectOption('month');
  const monthly = await amount.getAttribute('data-value');
  expect(monthly).not.toBe(weekly);
  await board.getByRole('button', { name: 'View The Early Birds demo details' }).click();
  await expect(board.getByRole('dialog')).toContainText(monthly);
  await page.keyboard.press('Escape');
  await search.fill('this crew does not exist');
  await expect(board.getByText('No crew found. Yet.')).toBeVisible();
  await board.getByRole('button', { name: 'Show all crews' }).click();
  await board.locator('select[name="sort"]').selectOption('rewards');
  const rewards = await board.locator('rolling-amount').evaluateAll(nodes =>
    nodes.map(node => Number(node.getAttribute('value'))));
  expect(rewards).toEqual([...rewards].sort((a, b) => b - a));
  await board.getByRole('button', { name: 'Sample crew', exact: true }).click();
  await expect(board.locator('tbody tr')).toHaveCount(1);
});

test.describe('repeating SOL feed', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('rolls, settles exactly, repeats, and holds steady in a details dialog', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Animation lifecycle needs one browser; layouts are tested above.');
    const board = page.locator('club-board');
    await board.scrollIntoViewIfNeeded();
    const amount = board.locator('rolling-amount').first();
    await expect(amount).toHaveAttribute('data-rolling', 'true');
    const firstValue = await amount.getAttribute('data-value');
    await expect(amount).toHaveAttribute('data-rolling', 'false');
    expect(await amount.locator('.amount').textContent()).toBe(firstValue);
    await expect.poll(() => amount.getAttribute('data-value')).not.toBe(firstValue);
    await board.getByRole('button', { name: 'View The Early Birds demo details' }).click();
    const pausedValue = await amount.getAttribute('data-value');
    await expect(amount).toHaveAttribute('data-rolling', 'false');
    // Details remain a stable snapshot across a complete refresh interval.
    await page.waitForTimeout(4_700);
    await expect(amount).toHaveAttribute('data-value', pausedValue);
    expect(await amount.locator('.amount').textContent()).toBe(pausedValue);
    await page.keyboard.press('Escape');
    await expect.poll(() => amount.getAttribute('data-value')).not.toBe(pausedValue);
  });
});

import { test, expect } from '@playwright/test';

test('the headline leads into a centered phone on every viewport', async ({ page }) => {
  await page.goto('./');
  const headline = await page.locator('#hero-title').boundingBox();
  const device = await page.locator('moltivate-demo .phone').boundingBox();
  const viewport = page.viewportSize();
  expect(device.y).toBeGreaterThan(headline.y + headline.height);
  expect(Math.abs(device.x + device.width / 2 - (viewport.width - 15) / 2)).toBeLessThan(15);
  expect(await page.locator('body').getAttribute('data-effects')).toBe('off');
  expect(await page.locator('body').getAttribute('data-story-layout')).toBe('static');
  expect(await page.locator('moltivate-demo .phone').evaluate(node => getComputedStyle(node).transform)).toBe('none');
  await page.getByRole('button', {name:'App Store, coming soon. View app availability'}).click();
  await expect(page.locator('#app-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('moltivate-demo').getByRole('tab',{name:'Your workout',exact:true}).click();
  await expect(page.locator('[data-chapter-title]')).toHaveText('Make it count.');
});

test.describe('scroll-led product story', () => {
  test.use({ reducedMotion:'no-preference' });

  test('scroll changes chapters, manual use pauses the story, and follow resumes', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Small screens use the direct interactive tour.');
    await page.goto('./');
    const story = page.locator('#demo');
    const phone = page.locator('moltivate-demo');
    await expect(page.locator('body')).toHaveAttribute('data-story-layout','scroll');
    const bounds = await story.boundingBox();
    const stageHeight = await page.locator('.product-stage').evaluate(node=>node.offsetHeight);
    const available = bounds.height - stageHeight - 55;
    expect(available).toBeGreaterThanOrEqual(page.viewportSize().height * 2.8);
    const scrollTo = async progress => {
      await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}), bounds.y + available * progress);
    };
    await scrollTo(.1);
    await expect(phone.getByRole('tab',{name:'Your crew',exact:true})).toHaveAttribute('aria-selected','true');
    await page.mouse.wheel(0, 450);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(bounds.y + available * .1 + 400);
    await expect(phone.getByRole('tab',{name:'Your crew',exact:true})).toHaveAttribute('aria-selected','true');
    await scrollTo(.45);
    await expect(phone.getByRole('tab',{name:'Your workout',exact:true})).toHaveAttribute('aria-selected','true');
    await expect(page.locator('[data-chapter-title]')).toHaveText('Make it count.');
    await page.mouse.wheel(0, 600);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(bounds.y + available * .45 + 550);
    await expect(phone.getByRole('tab',{name:'Your workout',exact:true})).toHaveAttribute('aria-selected','true');
    await scrollTo(.8);
    await expect(phone.getByRole('tab',{name:'Your progress',exact:true})).toHaveAttribute('aria-selected','true');
    await phone.getByRole('tab',{name:'Your crew',exact:true}).click();
    await phone.getByRole('button',{name:'Count me in',exact:true}).click();
    await scrollTo(.95);
    await expect(phone.getByRole('dialog')).toBeVisible();
    await expect(phone.getByRole('dialog')).toContainText('Small stake.');
    await page.keyboard.press('Escape');
    await expect(phone.getByRole('tab',{name:'Your crew',exact:true})).toHaveAttribute('aria-selected','true');
    await phone.getByRole('button',{name:'Follow scroll tour',exact:true}).click();
    await expect(phone.getByRole('tab',{name:'Your progress',exact:true})).toHaveAttribute('aria-selected','true');
  });

  test('motion starts automatically without page animation switches', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('body')).toHaveAttribute('data-effects','on');
    await expect(page.getByRole('button',{name:/Turn off visual effects|Pause sponsor logos|Pause updates|Pause scroll tour|Pause automatic demo/})).toHaveCount(0);
    const phone=page.locator('moltivate-demo');
    await phone.getByRole('tab',{name:'Your workout',exact:true}).click();
    await expect(phone.getByRole('button',{name:'Start demo set',exact:true})).toBeVisible();
    expect(await page.locator('.metal-type').evaluate(node=>getComputedStyle(node).animationPlayState)).toBe('running');
  });
});

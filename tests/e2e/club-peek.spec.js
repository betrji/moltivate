import { test, expect } from '@playwright/test';

test('the top preview opens standings, handles keyboard focus, and leads to the club', async ({page})=>{
  await page.goto('./');
  const peek=page.locator('club-peek');
  const trigger=peek.getByRole('button',{name:'Open leaderboard',exact:true});
  await expect(trigger).toBeInViewport();
  await expect(trigger).toContainText('The Early Birds');
  if(page.viewportSize().width<=800){
    const tab=await trigger.boundingBox();
    const eyebrow=await page.locator('.hero .eyebrow').boundingBox();
    expect(tab.y+tab.height).toBeLessThan(eyebrow.y);
  }
  const photo=page.locator('[data-image-slot="1"] img');
  await expect(photo).toHaveAttribute('src','./assets/photos/teletubbies-gym-crew.jpg');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog=peek.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('listitem')).toHaveCount(6);
  await expect(dialog).toContainText('Simulated feed');
  const values=await dialog.locator('rolling-amount').evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute('value'))));
  expect(values).toEqual([...values].sort((a,b)=>b-a));
  expect(values.some(value=>value<0)).toBe(true);
  await expect(peek.getByRole('button',{name:'Close leaderboard'})).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(peek.getByRole('link',{name:'Explore the club'})).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(peek.getByRole('button',{name:'Close leaderboard'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await peek.getByRole('link',{name:'Explore the club'}).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#club$/);
  await expect(page.locator('club-board')).toBeInViewport();
  await expect(trigger).not.toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test.describe('shared demo feed',()=>{
  test.use({reducedMotion:'no-preference'});
  test('the leaderboard folds away with the phone entrance and returns on scroll-up',async({page})=>{
    await page.goto('./');
    const peek=page.locator('club-peek');
    const motion=peek.locator('.peek-motion');
    const trigger=peek.getByRole('button',{name:'Open leaderboard',exact:true});
    const bounds=await page.locator('#demo').boundingBox();
    const height=page.viewportSize().height;
    await expect(trigger).toBeInViewport();
    await expect(motion).toHaveCSS('opacity','1');
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),bounds.y-height*.43);
    await expect.poll(()=>motion.evaluate(node=>Number(getComputedStyle(node).opacity))).toBeLessThan(.85);
    expect(await motion.evaluate(node=>Number(getComputedStyle(node).opacity))).toBeGreaterThan(.1);
    expect(await motion.evaluate(node=>getComputedStyle(node).transform)).toContain('matrix3d');
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),bounds.y);
    await expect(trigger).not.toBeVisible();
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await expect(trigger).toBeInViewport();
    await expect(motion).toHaveCSS('opacity','1');
    await trigger.click();
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),bounds.y);
    await expect(peek.getByRole('dialog')).toBeVisible();
    await expect(peek.getByRole('button',{name:'Close leaderboard'})).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });

  test('the peek spins and settles on the same value as the main board',async({page},testInfo)=>{
    test.skip(testInfo.project.name!=='desktop','The shared animation is checked once; drawer layouts run on all viewports.');
    await page.goto('./');
    const peek=page.locator('club-peek');
    const visibleAmount=peek.locator('.peek [data-amount="early"] rolling-amount');
    const boardAmount=page.locator('club-board [data-reward="early"] rolling-amount');
    const initial=await visibleAmount.getAttribute('data-value');
    await expect(visibleAmount).toHaveAttribute('data-rolling','true');
    await expect(visibleAmount).toHaveAttribute('data-rolling','false');
    const current=await visibleAmount.getAttribute('data-value');
    expect(current).not.toBe(initial);
    expect(await boardAmount.getAttribute('data-value')).toBe(current);
    expect(await visibleAmount.locator('.amount').textContent()).toBe(current);
    await peek.getByRole('button',{name:'Open leaderboard',exact:true}).click();
    await expect(peek.locator('.drawer [data-amount="early"] rolling-amount')).toHaveAttribute('data-value',current);
    await expect.poll(()=>visibleAmount.getAttribute('data-value')).not.toBe(current);
  });
});

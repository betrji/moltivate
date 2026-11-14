import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const challenge = '11111111-1111-4111-8111-111111111111';
const member = '22222222-2222-4222-8222-222222222222';
const user = '33333333-3333-4333-8333-333333333333';
function board(reps = 10) {
  return { challenge_id: challenge, target_reps: 30, teams: [
    { team_id: 'a', name: '<Crew A>', completers: 0, members: [{ user_id: user, accepted_reps: reps, completed: false }] },
    { team_id: 'b', name: 'Crew B', completers: 0, members: [] },
  ] };
}
async function connect(page) {
  await page.goto('./commitment.html');
  await page.getByText('Development connection', { exact: true }).click();
  await page.locator('[name=mode]').selectOption('api');
  await page.locator('[name=base]').fill('/api');
  await page.locator('[name=challenge]').fill(challenge);
  await page.locator('[name=member]').fill(member);
  await page.getByRole('button', { name: 'Apply connection' }).click();
}
async function mock(page, handler) {
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/sessions')) return handler(route);
    if (path.endsWith('/scoreboard')) return route.fulfill({ json: board() });
    return route.fulfill({ json: { id: challenge, title: 'API draft', exercise: 'squats', target_reps: 30, status: 'draft' } });
  });
}
function accepted() {
  return { id: 'session-id', team_member_id: member, source: 'browser', reps: 10, trust_level: 'low', liveness_result: 'not_run', status: 'accepted', created_at: '2026-11-14T12:00:00Z' };
}

test('fixture view shows two crews, caps progress and preserves separate landing entry', async ({ page }, info) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('./commitment.html');
  await expect(page.locator('.team')).toHaveCount(2);
  await expect(page.locator('.member')).toHaveCount(4);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
    await expect(page.locator('#session-status')).toContainText('Accepted by fixture simulation');
  }
  await expect(page.locator('progress').first()).toHaveAttribute('value', '30');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await mkdir('apps/web/commitment-evidence', { recursive: true });
  await page.screenshot({ path: `apps/web/commitment-evidence/${info.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
  await page.getByRole('link', { name: 'Mission & download' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('muscles are');
});

test('API sends exact contract, retains retry key across reload and creates a fresh key next time', async ({ page }) => {
  const requests = []; let fail = true;
  await mock(page, async route => {
    requests.push({ key: route.request().headers()['idempotency-key'], body: route.request().postDataJSON() });
    if (fail) { fail = false; return route.abort(); }
    return route.fulfill({ status: 201, json: accepted() });
  });
  await connect(page);
  await expect(page.locator('#teams')).toContainText('<Crew A>');
  await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
  await expect(page.locator('#session-status')).toContainText('Outcome may be unknown');
  await expect(page.locator('[name=mode]')).toBeDisabled();
  await page.reload();
  await page.getByRole('button', { name: 'Retry same submission' }).click();
  await expect(page.locator('#session-status')).toContainText('Accepted by API');
  await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
  await expect.poll(() => requests.length).toBe(3);
  expect(requests[0].body).toEqual({ source: 'browser', reps: 10, liveness_result: 'not_run' });
  expect(requests[0].key).toBeTruthy();
  expect(requests[1]).toEqual(requests[0]);
  expect(requests[2].key).not.toBe(requests[0].key);
});

test('API acceptance refreshes server progress and prevents concurrent submissions', async ({ page }) => {
  let posts = 0; let finish;
  const gate = new Promise(resolve => { finish = resolve; });
  await mock(page, async route => { posts++; await gate; return route.fulfill({ status: 201, json: accepted() }); });
  await page.route('**/scoreboard', route => route.fulfill({ json: board(posts ? 20 : 10) }));
  await connect(page);
  await expect(page.locator('progress').first()).toHaveAttribute('value', '10');
  await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
  await expect(page.locator('#session-status')).toContainText('Submitting');
  await expect(page.locator('#submit')).toBeDisabled();
  await expect(page.locator('#retry')).toBeDisabled();
  finish();
  await expect(page.locator('progress').first()).toHaveAttribute('value', '20');
  expect(posts).toBe(1);
});

test('409 conflict keeps the original attempt and never adds fixture progress', async ({ page }) => {
  const keys = [];
  await mock(page, route => {
    keys.push(route.request().headers()['idempotency-key']);
    return route.fulfill({ status: 409, json: { detail: 'conflict' } });
  });
  await connect(page);
  await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
  await expect(page.locator('#session-status')).toContainText('Idempotency conflict');
  await page.getByRole('button', { name: 'Retry same submission' }).click();
  await expect.poll(() => keys.length).toBe(2);
  expect(keys[1]).toBe(keys[0]);
  await expect(page.locator('progress').first()).toHaveAttribute('value', '10');
});

test('fixture submission works from keyboard', async ({ page }) => {
  await page.goto('./commitment.html');
  const submit = page.getByRole('button', { name: 'Submit 10 simulated reps' });
  await expect(submit).toBeEnabled();
  await submit.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#session-status')).toContainText('Accepted by fixture simulation');
});

test('accepted session survives scoreboard refresh failure without another POST', async ({ page }) => {
  let posts = 0;
  await mock(page, route => { posts++; return route.fulfill({ status: 201, json: accepted() }); });
  await connect(page);
  await expect(page.locator('#board-status')).toContainText('API scoreboard refreshed');
  await page.route('**/scoreboard', route => route.fulfill({ status: 503, json: { detail: 'unavailable' } }));
  await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
  await expect(page.locator('#session-status')).toContainText('Accepted by API');
  await expect(page.locator('#board-status')).toContainText('stale');
  await expect(page.locator('#retry')).toBeHidden();
  await expect(page.locator('#submit')).toBeDisabled();
  await page.unroute('**/scoreboard');
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(page.locator('#board-status')).toContainText('API scoreboard refreshed');
  expect(posts).toBe(1);
});

test('loading, API errors, rejection and invalid responses remain explicit', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await mock(page, route => route.fulfill({ status: 201, json: { ...accepted(), status: 'rejected' } }));
  await page.route('**/scoreboard', async route => { await gate; return route.fulfill({ status: 404, json: {} }); });
  await connect(page);
  await expect(page.locator('#board-status')).toContainText('Loading');
  await expect(page.locator('#submit')).toBeDisabled();
  release();
  await expect(page.locator('#board-status')).toContainText('API 404');
  await expect(page.locator('.team')).toHaveCount(0);
  await page.unroute('**/scoreboard');
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('button', { name: 'Submit 10 simulated reps' }).click();
  await expect(page.locator('#session-status')).toContainText('Rejected by API');
  await page.route('**/scoreboard', route => route.fulfill({ json: { ...board(), target_reps: 0 } }));
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(page.locator('#board-status')).toContainText('Unexpected scoreboard response');
});

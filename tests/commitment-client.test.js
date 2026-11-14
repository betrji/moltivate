import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiClient, fixtureClient, sampleSubmission, validateBoard } from '../apps/web/commitment-client.js';

globalThis.location = new URL('http://127.0.0.1:5173/commitment.html');

test('fixture retries do not double count and distinct sessions cap at target', async () => {
  const client = fixtureClient();
  const attempt = { key: 'attempt-1', payload: sampleSubmission };
  const first = await client.submit('Alex', attempt);
  assert.deepEqual(await client.submit('Alex', attempt), first);
  assert.equal((await client.scoreboard()).teams[0].members[0].accepted_reps, 20);
  await client.submit('Alex', { ...attempt, key: 'attempt-2' });
  await client.submit('Alex', { ...attempt, key: 'attempt-3' });
  const board = await client.scoreboard();
  assert.equal(board.teams.length, 2);
  assert.equal(board.teams[0].members[0].accepted_reps, 30);
  assert.equal(board.teams[0].completers, 2);
});

test('API uses PR #7 routes, request fields and original retry identity', async () => {
  const calls = [];
  const client = apiClient('/api/', async (url, options) => {
    calls.push({ url, options });
    return Response.json(url.endsWith('/scoreboard') ? { challenge_id: 'draft', target_reps: 30, teams: [] } : {});
  });
  await client.challenge('draft');
  await client.scoreboard('draft');
  const attempt = { key: 'same-key', payload: sampleSubmission };
  await client.submit('member', attempt);
  await client.submit('member', attempt);
  assert.equal(calls[0].url, 'http://127.0.0.1:5173/api/challenges/draft');
  assert.equal(calls[1].url, 'http://127.0.0.1:5173/api/challenges/draft/scoreboard');
  assert.equal(calls[2].url, 'http://127.0.0.1:5173/api/team-members/member/sessions');
  for (const call of calls.slice(2)) {
    assert.equal(call.options.headers['Idempotency-Key'], 'same-key');
    assert.equal(call.options.credentials, 'omit');
    assert.deepEqual(JSON.parse(call.options.body), { source: 'browser', reps: 10, liveness_result: 'not_run' });
  }
});

test('network, conflict, validation and non-JSON failures remain actionable', async () => {
  for (const [fetcher, message] of [
    [async () => { throw new Error('offline'); }, /unreachable/],
    [async () => new Response('', { status: 409 }), /Idempotency conflict/],
    [async () => new Response('', { status: 422 }), /API 422/],
    [async () => new Response('not json'), /invalid JSON/],
  ]) await assert.rejects(apiClient('/api', fetcher).submit('member', { key: 'key', payload: sampleSubmission }), message);
  for (const base of ['file:///tmp', 'https://user:secret@example.com', '/api?token=x']) {
    assert.throws(() => apiClient(base), /without credentials/);
  }
});

test('rejects malformed or wrong-challenge scoreboard without inventing progress', async () => {
  const board = await fixtureClient().scoreboard();
  assert.equal(validateBoard(board, 'fixture'), board);
  assert.throws(() => validateBoard(board, 'other'), /Unexpected/);
  for (const value of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => validateBoard({ ...board, target_reps: value }, 'fixture'), /Unexpected/);
  }
  board.teams[0].members[0].accepted_reps = 31;
  assert.throws(() => validateBoard(board, 'fixture'), /Unexpected/);
});

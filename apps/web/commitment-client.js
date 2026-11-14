// Matched against PR #7, 363512be88c43c137feb64a876d2f2ad49571d38.
export const sampleSubmission = Object.freeze({ source: 'browser', reps: 10, liveness_result: 'not_run' });
export function validateBoard(board, challenge) {
  if (board?.challenge_id !== challenge || !Number.isSafeInteger(board.target_reps) || board.target_reps <= 0 ||
      !Array.isArray(board.teams) || !board.teams.every(t => typeof t.team_id === 'string' && typeof t.name === 'string' &&
        Number.isSafeInteger(t.completers) && Array.isArray(t.members) && t.members.every(m =>
          typeof m.user_id === 'string' && Number.isSafeInteger(m.accepted_reps) && m.accepted_reps >= 0 &&
          m.accepted_reps <= board.target_reps && typeof m.completed === 'boolean'))) {
    throw new Error('Unexpected scoreboard response. Check API contract compatibility.');
  }
  return board;
}
export function apiClient(base, fetcher = fetch) {
  const url = new URL(base, location.href);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Use an HTTP(S) API base without credentials, query or fragment.');
  }
  const prefix = url.href.replace(/\/$/, '');
  async function request(path, options = {}) {
    let response;
    try {
      response = await fetcher(prefix + path, { ...options, credentials: 'omit', signal: AbortSignal.timeout(12000) });
    } catch { throw new Error('API unreachable or timed out. Check the development URL and browser access/CORS.'); }
    if (!response.ok) throw new Error(`API ${response.status}. ${response.status === 409 ? 'Idempotency conflict: keep this attempt for investigation.' : 'Check the development IDs and retry.'}`);
    try { return await response.json(); } catch { throw new Error('API returned invalid JSON.'); }
  }
  return {
    challenge: id => request(`/challenges/${encodeURIComponent(id)}`),
    scoreboard: async id => validateBoard(await request(`/challenges/${encodeURIComponent(id)}/scoreboard`), id),
    submit: (member, attempt) => request(`/team-members/${encodeURIComponent(member)}/sessions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.key },
      body: JSON.stringify(attempt.payload),
    }),
  };
}
export function fixtureClient() {
  const board = { challenge_id: 'fixture', target_reps: 30, teams: [
    { team_id: 'birds', name: 'Early Birds', completers: 1, members: [
      { user_id: 'Alex', accepted_reps: 10, completed: false }, { user_id: 'Sam', accepted_reps: 30, completed: true }] },
    { team_id: 'owls', name: 'Night Owls', completers: 0, members: [
      { user_id: 'Jo', accepted_reps: 20, completed: false }, { user_id: 'Riley', accepted_reps: 10, completed: false }] },
  ] };
  const attempts = new Map();
  return {
    challenge: async () => ({ id: 'fixture', title: 'The show-up club', exercise: 'squats', target_reps: 30, status: 'draft' }),
    scoreboard: async () => structuredClone(board),
    submit: async (member, attempt) => {
      if (attempts.has(attempt.key)) return attempts.get(attempt.key);
      const alex = board.teams[0].members[0];
      alex.accepted_reps = Math.min(30, alex.accepted_reps + attempt.payload.reps);
      alex.completed = alex.accepted_reps === 30;
      board.teams[0].completers = board.teams[0].members.filter(m => m.completed).length;
      const result = { id: attempt.key, team_member_id: member, ...attempt.payload, trust_level: 'low', status: 'accepted', created_at: new Date().toISOString() };
      attempts.set(attempt.key, result);
      return result;
    },
  };
}

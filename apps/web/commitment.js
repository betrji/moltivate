import { apiClient, fixtureClient, sampleSubmission } from './commitment-client.js';

const $ = id => document.getElementById(id);
let config = { mode: 'fixture', base: '/api', challenge: 'fixture', member: 'Alex' };
let client = fixtureClient();
let pending = null;
let ready = false;
let busy = false;
const storageKey = 'moltivate-commitment-pending-v1';
// Persist only an unresolved API attempt. Never persist credentials or fixture progress.
try {
  const saved = JSON.parse(sessionStorage.getItem(storageKey));
  if (saved?.config?.mode === 'api' && typeof saved.key === 'string' &&
      JSON.stringify(saved.payload) === JSON.stringify(sampleSubmission)) {
    config = saved.config;
    client = apiClient(config.base);
    pending = saved;
    for (const name of ['mode', 'base', 'challenge', 'member']) $('connection').elements[name].value = config[name];
  }
} catch { $('connection-status').textContent = 'Previous attempt could not be restored. Check development records before another submission.'; }

function controls() {
  $('submit').disabled = busy || !ready || Boolean(pending);
  $('retry').hidden = !pending;
  $('retry').disabled = busy || !ready;
  $('refresh').disabled = busy;
  for (const input of $('connection').elements) input.disabled = busy || Boolean(pending);
}
function modeLabel() {
  $('mode-label').textContent = config.mode === 'fixture' ? 'Fixture mode · simulated data' : 'Development API · simulated session input';
  $('submission-target').textContent = config.mode === 'fixture' ? 'Sample member: Alex · Early Birds' : `Submission team-member ID: ${config.member}. Progress is listed by user ID; roster mapping is unavailable.`;
}
function render(board) {
  const cards = board.teams.map(team => {
    const card = document.createElement('article'); card.className = 'team';
    const top = document.createElement('div'); top.className = 'section-top';
    const title = document.createElement('h3'); title.textContent = team.name;
    const total = document.createElement('p'); total.textContent = `${team.completers}/${team.members.length} complete`;
    top.append(title, total); card.append(top);
    for (const member of team.members) {
      const row = document.createElement('div'); row.className = 'member';
      const line = document.createElement('div'); line.className = 'member-line';
      const name = document.createElement('span'); name.className = 'member-name';
      name.textContent = config.mode === 'fixture' ? member.user_id : `User ${member.user_id}`;
      const score = document.createElement('strong'); score.textContent = `${member.accepted_reps}/${board.target_reps}`;
      const progress = document.createElement('progress'); progress.max = board.target_reps; progress.value = member.accepted_reps;
      progress.setAttribute('aria-label', `${name.textContent}: ${member.accepted_reps} of ${board.target_reps} accepted demo reps`);
      line.append(name, score); row.append(line, progress); card.append(row);
    }
    return card;
  });
  $('teams').replaceChildren(...cards);
}
async function load() {
  busy = true; ready = false; controls(); modeLabel();
  $('teams').setAttribute('aria-busy', 'true');
  $('board-status').textContent = 'Loading challenge and scoreboard…';
  try {
    const [challenge, board] = await Promise.all([client.challenge(config.challenge), client.scoreboard(config.challenge)]);
    if (challenge.id !== config.challenge || typeof challenge.title !== 'string' || typeof challenge.exercise !== 'string' || challenge.target_reps !== board.target_reps) throw new Error('Challenge response does not match scoreboard.');
    $('challenge-title').textContent = challenge.title;
    $('challenge-description').textContent = `${board.target_reps} ${challenge.exercise} per member · ${challenge.status} · off-chain only`;
    render(board); ready = true;
    $('board-status').textContent = `${config.mode === 'fixture' ? 'Simulated fixture' : 'API'} scoreboard refreshed. Accepted reps are capped at the commitment target; acceptance is not workout verification.${board.teams.length ? '' : ' No teams yet.'}`;
  } catch (error) {
    $('board-status').textContent = `Scoreboard unavailable. ${error.message} Refresh to retry. Displayed progress, if any, is stale.`;
  } finally { busy = false; $('teams').setAttribute('aria-busy', 'false'); controls(); }
}
async function submit() {
  if (busy || !ready) return;
  if (!pending) {
    pending = { config: { ...config }, key: crypto.randomUUID(), payload: { ...sampleSubmission } };
    if (config.mode === 'api') {
      try { sessionStorage.setItem(storageKey, JSON.stringify(pending)); }
      catch { pending = null; $('session-status').textContent = 'Cannot save retry identity in this browser. Enable session storage before submitting to the API.'; return; }
    }
  }
  busy = true; controls(); $('session-status').textContent = 'Submitting simulated session…';
  try {
    const result = await client.submit(config.member, pending);
    if (!['accepted', 'rejected'].includes(result.status) || result.team_member_id !== config.member ||
        result.source !== 'browser' || result.reps !== 10 || !['low', 'unverified'].includes(result.trust_level) || result.liveness_result !== 'not_run') {
      throw new Error('Unexpected session response. Keep this attempt for reconciliation.');
    }
    pending = null;
    try { sessionStorage.removeItem(storageKey); } catch { /* Current tab still retains the resolved state. */ }
    $('session-status').textContent = `${result.status === 'accepted' ? 'Accepted' : 'Rejected'} ${config.mode === 'fixture' ? 'by fixture simulation' : 'by API'} · ${result.reps} simulated reps · server-contract trust: ${result.trust_level} · liveness: ${result.liveness_result}. This is not a verified workout.`;
    await load(); // A failed refresh must never cause the accepted session to be resubmitted.
  } catch (error) {
    $('session-status').textContent = `${error.message} Outcome may be unknown. Retry uses the same key and payload; connection changes are locked until resolved.`;
  } finally { busy = false; controls(); }
}
$('refresh').addEventListener('click', load);
$('submit').addEventListener('click', submit);
$('retry').addEventListener('click', submit);
$('connection').addEventListener('submit', event => {
  event.preventDefault();
  if (busy || pending) return;
  const data = Object.fromEntries(new FormData(event.currentTarget));
  try {
    if (data.mode === 'api' && ![data.challenge, data.member].every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) throw new Error('Supply existing challenge and team-member UUIDs.');
    const next = data.mode === 'api' ? apiClient(data.base) : fixtureClient();
    config = data.mode === 'api' ? data : { ...data, challenge: 'fixture', member: 'Alex' };
    client = next; $('teams').replaceChildren(); $('challenge-title').textContent = 'Loading challenge…'; $('challenge-description').textContent = '';
    $('connection-status').textContent = 'Connection applied.'; $('session-status').textContent = 'Ready to submit a simulated fixture session.';
    load();
  } catch (error) { $('connection-status').textContent = error.message; }
});
$('session-status').textContent = pending ? 'Unresolved API attempt restored. Retry reuses its original key and payload.' : 'Ready to submit a simulated fixture session.';
load();

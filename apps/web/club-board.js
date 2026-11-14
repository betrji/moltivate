import './rolling-amount.js';
import { clubTheme } from './club-theme.js';

const icon = (name, size = 18) => {
  const paths = {
    trophy: '<path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-6-3h4"/>',
    search: '<circle cx="10.7" cy="10.7" r="6.2"/><path d="m15.5 15.5 4.2 4.2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    bolt: '<path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z"/>',
    flag: '<path d="M5 21V4m0 0c5-5 9 5 14 0v10c-5 5-9-5-14 0"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

const clubs = [
  { id: 'early', name: 'The Early Birds', initials: 'EB', motto: 'Before the excuses wake up.', color: '#e9ce77', ink: '#3b4226', members: ['Alex', 'Sam'], reps: [10, 10], monthReps: [10, 10], week: 0.100, month: 0.350, movement: 2, trend: [18, 17, 20, 14, 15, 9, 11, 3] },
  { id: 'sets', name: 'Sets on the Beach', initials: 'SB', motto: 'Good reps. Better company.', color: '#ef9d74', ink: '#603a29', members: ['Jules', 'Kai'], reps: [10, 10], monthReps: [10, 9], week: 0.075, month: 0.225, movement: 1, trend: [18, 20, 16, 16, 9, 12, 5, 6] },
  { id: 'legends', name: 'Leg Day Legends', initials: 'LL', motto: 'We never skip showing up.', color: '#c0cbb7', ink: '#344d35', members: ['Nico', 'Rae'], reps: [10, 9], monthReps: [10, 10], week: 0.050, month: 0.400, movement: 3, trend: [20, 13, 15, 12, 14, 6, 9, 4] },
  { id: 'snooze', name: 'No Snooze Crew', initials: 'NS', motto: 'One less snooze. One more set.', color: '#b8c9d6', ink: '#304b5d', members: ['Drew', 'Lee'], reps: [10, 7], monthReps: [10, 9], week: -0.025, month: 0.100, movement: -1, trend: [5, 4, 9, 7, 13, 12, 17, 19] },
  { id: 'slow', name: 'Slow & Steady', initials: 'SS', motto: 'A little better is still better.', color: '#d2c0d2', ink: '#593b58', members: ['Quinn', 'Ari'], reps: [8, 7], monthReps: [10, 6], week: 0.025, month: 0.175, movement: 1, trend: [20, 18, 20, 15, 13, 14, 9, 6] },
  { id: 'after', name: 'The After Hours', initials: 'AH', motto: 'We make time for ourselves.', color: '#c5c898', ink: '#4a4c2d', members: ['Eli', 'Max'], reps: [6, 7], monthReps: [10, 8], week: -0.050, month: -0.025, movement: -2, trend: [4, 6, 5, 10, 7, 14, 15, 20] },
];

const styles = `
:host{display:block;--panel:#132e23;--line:rgba(230,240,222,.12);--muted:#a7b9a9;--up:#9bdca8;--down:#ffa58a;color:#f3f5e8;font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.45;text-align:left}*{box-sizing:border-box}button,input,select{font:inherit}button,select{cursor:pointer}button{color:inherit}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #f3d778;outline-offset:4px}button{border:0}svg{flex-shrink:0}.board{overflow:hidden;background:var(--panel);border:1px solid #2c4838;border-radius:22px;box-shadow:0 20px 50px #183c2510}.top{display:flex;align-items:center;justify-content:space-between;padding:23px 26px;gap:20px;border-bottom:1px solid var(--line)}.identity{display:flex;align-items:center;gap:11px}.identity>svg{color:#ecd17f}.identity strong{font-size:16px;font-weight:600;letter-spacing:-.25px}.demo{border:1px solid #455747;border-radius:5px;padding:3px 6px;color:#c1ccbd;font-size:10px;line-height:1;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}.search{display:flex;align-items:center;gap:9px;color:#98af9f;background:#1b3529;border:1px solid #36503e;border-radius:8px;padding:9px 12px;width:242px}.search input{min-width:0;width:100%;color:#f4f4e6;background:none;border:0;font-size:12px;outline-offset:5px}.search input::placeholder{color:#acb9a9}.layout{display:grid;grid-template-columns:minmax(0,1fr) 254px}.rankings{min-width:0}.controls{padding:17px 23px 16px;display:flex;gap:14px;align-items:center;justify-content:space-between}.tabs{display:flex;gap:4px}.tab{white-space:nowrap;background:transparent;color:#aebead;padding:7px 11px;border-radius:6px;font-size:11px;font-weight:600}.tab[aria-pressed=true]{background:#335040;color:#dcf0cf}.selections{display:flex;gap:7px}.select-wrap{position:relative}.select-wrap:after{content:'⌄';position:absolute;right:9px;top:5px;color:#c8d4c3;pointer-events:none}.select-wrap select{background:#132e23;border:1px solid #3d5342;border-radius:6px;padding:6px 25px 6px 9px;color:#d3dfcf;font-size:11px;appearance:none}.select-wrap option{background:#132e23}.screen-reader{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}table{border-collapse:collapse;width:100%;table-layout:fixed}thead{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}th{font-weight:400;color:#91a793;font-size:10px;padding:12px 12px;text-align:left;text-transform:uppercase;letter-spacing:.06em}th:first-child{width:49px;padding-left:25px}th:nth-child(2){width:39%}th:nth-child(3){width:22%}th:last-child{text-align:right;padding-right:25px}td{padding:17px 12px;border-bottom:1px solid var(--line);height:82px}td:first-child{padding-left:25px;color:#90a78e;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;vertical-align:middle}td:last-child{padding-right:25px;text-align:right}tr:last-child td{border-bottom:0}tr.club-row{transition:background .18s}tr.club-row:hover{background:#1b382a}.name-button{display:flex;align-items:center;gap:11px;background:none;padding:0;max-width:100%;text-align:left}.avatar{width:36px;height:36px;flex:0 0 36px;display:flex;align-items:center;justify-content:center;background:var(--avatar-bg);color:var(--avatar-ink);border-radius:50%;font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:12px;letter-spacing:-1px;transform:rotate(-5deg);border:3px solid rgba(255,255,255,.14);box-shadow:0 0 0 1px #ffffff13}.team-text{min-width:0}.team-name{display:block;font-size:12px;font-weight:600;color:#eff4e6;letter-spacing:-.05px;white-space:normal}.team-members{display:flex;align-items:center;gap:6px;margin-top:5px;color:#93aa94;font-size:10px}.member-stack{display:flex;padding-left:1px}.mini-avatar{display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;font-size:7px;line-height:14px;background:#78957a;color:#132e23;border:1px solid var(--panel);width:16px;height:16px;border-radius:50%;margin-left:-2px}.mini-avatar:nth-child(2){background:#d9b48f}.moving{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:9px}.up{color:var(--up)}.down{color:var(--down)}.progress-top{display:flex;justify-content:space-between;align-items:center;gap:4px;color:#dce7d5;font-size:11px;white-space:nowrap}.progress-top > span:last-child{font-size:9px;color:#91a993}.track{height:3px;max-width:105px;margin-top:8px;border-radius:5px;background:#38513f;overflow:hidden}.fill{height:100%;background:#c7d785;border-radius:5px}.money{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap;font-size:13px;font-weight:500;letter-spacing:-.3px}.submoney{display:flex;gap:8px;align-items:center;justify-content:flex-end;font-size:9px;color:#91a693;margin-top:4px}.sparkline{width:48px;height:17px;opacity:.8}.board-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid var(--line);padding:15px 24px;color:#94aa96;font-size:10px}.reset{background:transparent;color:#cfdfc5;text-decoration:underline;text-underline-offset:3px;font-size:10px;white-space:nowrap}.empty{text-align:center;padding:55px 20px;min-height:250px}.empty strong{display:block;margin-bottom:7px;font-family:'Fraunces',Georgia,serif;font-size:23px;font-weight:500}.empty p{color:#a7bba8;font-size:12px}.empty button{background:#c7db9a;color:#183623;border-radius:7px;padding:9px 14px;font-size:12px;margin-top:8px}.feed{padding:23px 20px;border-left:1px solid var(--line);background:#173225;display:flex;flex-direction:column}.feed-title{display:flex;align-items:center;justify-content:space-between;gap:9px}.feed h3{font-size:12px;font-weight:600;margin:0}.status{display:flex;align-items:center;gap:5px;font-size:9px;color:#a2b59d}.dot{width:5px;height:5px;background:#b0d282;border-radius:100%;box-shadow:0 0 0 3px #b0d28213}.activity{list-style:none;margin:26px 0 18px;padding:0;display:flex;flex-direction:column;gap:24px}.activity li{display:flex;align-items:flex-start;gap:10px}.activity-icon{width:27px;height:27px;flex:0 0 27px;background:#324c35;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#dce2b8}.activity-icon.orange{background:#523d2b;color:#efb17e}.activity-icon.gold{background:#4b482d;color:#e2d07c}.activity p{font-size:11px;color:#a7bea5;line-height:1.55;margin:0}.activity p strong{color:#e5eddb;font-weight:500}.activity time{display:block;font-size:9px;color:#78947b;margin-top:5px}.feed-quote{margin-top:auto;padding:17px 0 2px;border-top:1px solid var(--line)}.feed-quote p{font-family:'Fraunces',Georgia,serif;font-size:20px;font-style:italic;color:#eddb9d;line-height:1.3;letter-spacing:-.5px;margin:0 0 15px}.start-crew{display:flex;align-items:center;justify-content:space-between;gap:7px;width:100%;padding:10px 12px;border:1px solid #597046;background:#33482c;border-radius:7px;font-size:10px;font-weight:600;color:#edf1d9}.footnote{font-size:10px;text-align:center;color:#7e8e79;margin:12px 0 0;line-height:1.5}.leader{color:#e4cd8b!important}.dialog{max-width:430px;width:calc(100% - 30px);border:1px solid #3d5945;border-radius:20px;padding:26px;background:#183526;color:#f3f5e9;font-family:inherit;box-shadow:0 25px 80px #0006}.dialog::backdrop{background:#0c211aca;backdrop-filter:blur(5px)}.dialog-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.dialog .avatar{width:52px;height:52px;flex-basis:52px;font-size:19px;margin-bottom:18px}.close{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#294735;color:#d9e6d2}.dialog h3{font-family:'Fraunces',Georgia,serif;font-size:30px;font-weight:500;letter-spacing:-1px;margin:0}.motto{color:#b0c3a8;font-size:13px;margin:8px 0 18px}.dialog-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:26px;font-size:10px;color:#bbcfb2}.dialog-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1px solid #3c5540;border-bottom:1px solid #3c5540;padding:18px 0;margin-bottom:22px}.stat-label{font-size:10px;color:#9eb497}.stat-value{font-size:23px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;margin-top:5px;letter-spacing:-1px}.members-title{font-size:11px;font-weight:600;margin:0 0 16px}.member{display:flex;align-items:center;gap:10px;margin:16px 0;font-size:12px}.member>.mini-avatar{width:30px;height:30px;font-size:11px;flex:0 0 30px}.member-name{flex:1}.member-count{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;color:#c6dbb7}.member .track{max-width:none;width:100%;height:4px;margin-top:5px}.detail-note{font-size:10px;line-height:1.6;color:#99b194;padding-top:15px;border-top:1px solid #3c5540;margin-top:22px}.dialog .start-crew{margin-top:20px;padding:12px 14px;font-size:12px}.rank-count[aria-live]{min-height:15px}.table-caption{margin:0;padding:0 24px 13px;color:#9fb69d;font-size:10px;line-height:1.5}.completion-short{display:none}
@media(max-width:1000px){.layout{grid-template-columns:minmax(0,1fr) 220px}.feed{padding:22px 17px}.controls{padding:15px}.select-wrap select{padding-left:7px;font-size:10px}.tab{padding:7px 9px;font-size:10px}th:first-child{width:37px;padding-left:16px}td:first-child{padding-left:16px}th:last-child,td:last-child{padding-right:16px}.team-name{font-size:11px}.avatar{width:31px;height:31px;flex-basis:31px;font-size:11px}.name-button{gap:9px}.money{font-size:12px}.top{padding:20px}.progress-top > span:last-child{display:none}}
@media(max-width:760px){.layout{display:block}.feed{display:none}.top{padding:18px 18px 16px;align-items:flex-start;flex-direction:column;gap:14px}.identity{width:100%}.identity strong{font-size:15px}.identity .demo{margin-left:auto}.search{width:100%;padding:9px 11px}.search input{font-size:12px}.controls{padding:14px 13px;gap:8px;flex-wrap:wrap}.tabs{gap:2px}.tab{font-size:10px;padding:7px 9px}.selections{gap:5px;margin-left:auto}.select-wrap select{font-size:10px;padding:6px 23px 6px 7px}.board{border-radius:17px}th{font-size:8px;padding:11px 6px;letter-spacing:.03em}th:first-child{width:29px;padding-left:13px}th:nth-child(2){width:40%}th:nth-child(3){width:20%}th:last-child{padding-right:13px}td{padding:16px 6px;height:76px}td:first-child{padding-left:13px;font-size:10px}td:last-child{padding-right:13px}.avatar{width:27px;height:27px;flex-basis:27px;font-size:9px;border-width:2px}.name-button{gap:7px}.team-name{font-size:11px;line-height:1.35}.team-members{font-size:8px;gap:4px}.mini-avatar{width:13px;height:13px;font-size:6px}.moving{font-size:8px}.progress-top{font-size:11px}.track{max-width:60px}.money{font-size:11px;letter-spacing:-.5px}.submoney{font-size:7px;gap:4px}.sparkline{display:none}.board-bottom{padding:13px 14px;font-size:9px}.footnote{font-size:9px;padding:0 10px}.dialog{padding:22px}.dialog h3{font-size:27px}.empty{min-height:220px;padding-top:40px}.table-caption{padding:0 14px 12px;font-size:10px}.completion-full{display:none}.completion-short{display:inline}}
@media(max-width:400px){.controls{justify-content:space-between}.selections{width:100%;margin-left:0;justify-content:space-between}.select-wrap{flex:1}.select-wrap select{width:100%}.team-name{font-size:11px}.team-members{gap:3px}.member-stack{display:none}.money{font-size:11px}.progress-top{font-size:11px}.avatar{width:24px;height:24px;flex-basis:24px;font-size:8px}.name-button{gap:5px}th:nth-child(2){width:43%}th:nth-child(3){width:18%}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`;

class ClubBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.filters = { query: '', crew: 'all', period: 'week', sort: 'progress' };
    this.feedTick = 0;
    this.externalVisible = false;
    this.inView = false;
    // Integer thousandths of SOL are display fixtures, never wallet balances.
    this.displayUnits = Object.fromEntries(['week', 'month'].map(period => [period,
      Object.fromEntries(clubs.map(club => [club.id, Math.round(club[period] * 1000)]))
    ]));
    this.onVisibility = () => this.syncUpdates();
  }

  connectedCallback() {
    if (this.initialized) { this.observeVisibility(); return; }
    this.initialized = true;
    this.shadowRoot.innerHTML = `<style>${styles}${clubTheme}</style>
      <section class="board" aria-label="Illustrative club leaderboard">
        <div class="top">
          <div class="identity">${icon('trophy', 20)}<strong>Leaderboard</strong><span class="demo"><i class="dot"></i>Simulated feed</span></div>
          <label class="search">${icon('search', 16)}<span class="screen-reader">Search teams</span><input type="search" placeholder="Find your kind of people…" autocomplete="off" maxlength="70"></label>
        </div>
        <div class="layout">
          <div class="rankings">
            <div class="controls">
              <div class="tabs" aria-label="Filter crews"><button class="tab" data-filter="all" aria-pressed="true">All crews</button><button class="tab" data-filter="mine" aria-pressed="false">Sample crew</button></div>
              <div class="selections">
                <label class="select-wrap"><span class="screen-reader">Sort leaderboard</span><select name="sort"><option value="progress">Progress</option><option value="rewards">Net rewards</option></select></label>
                <label class="select-wrap"><span class="screen-reader">Leaderboard period</span><select name="period"><option value="week">This week</option><option value="month">This month</option></select></label>
              </div>
            </div>
            <div class="update-meta"><p class="table-caption">Latest challenge progress · <span class="feed-label">demo SOL refreshes every 4.5s</span></p></div>
            <div class="results"></div>
            <div class="board-bottom"><span class="rank-count" role="status" aria-live="polite"></span><button class="reset">Reset filters ↗</button></div>
          </div>
          <aside class="feed" aria-label="Illustrative club activity">
            <div class="feed-title"><h3>Around the club</h3><span class="status"><i class="dot"></i>Demo</span></div>
            <ul class="activity">
              <li><span class="activity-icon">${icon('check', 14)}</span><div><p><strong>Alex</strong> kept a promise.<br>10 reps. All counted.</p><time>Sample workout</time></div></li>
              <li><span class="activity-icon orange">${icon('people', 14)}</span><div><p><strong>Sets on the Beach</strong><br>showed up together.</p><time>2 of 2 goals completed</time></div></li>
              <li><span class="activity-icon gold">${icon('bolt', 14)}</span><div><p><strong>Leg Day Legends</strong><br>moved up 3 spots.</p><time>Illustrative weekly movement</time></div></li>
            </ul>
            <div class="feed-quote"><p>Good company.<br>Better habits.</p><button class="start-crew" data-get-app>Start your own crew ${icon('arrow', 15)}</button></div>
          </aside>
        </div>
      </section>
      <p class="footnote">Simulated leaderboard · SOL values cycle through sample data. No live wallet data or money movements.</p>
      <dialog class="dialog" aria-labelledby="club-title"></dialog>`;
    this.shadowRoot.querySelector('input').addEventListener('input', (event) => {
      this.filters.query = event.target.value;
      this.updateRows();
    });
    this.shadowRoot.querySelectorAll('select').forEach((select) => select.addEventListener('change', (event) => {
      this.filters[event.target.name] = event.target.value;
      this.updateRows();
    }));
    this.shadowRoot.addEventListener('click', (event) => {
      const filter = event.target.closest('[data-filter]');
      const team = event.target.closest('[data-team]');
      if (filter) { this.filters.crew = filter.dataset.filter; this.updateRows(); }
      if (team) this.showTeam(team.dataset.team);
      if (event.target.closest('.reset, [data-reset]')) this.reset();
      if (event.target.closest('[data-close]')) this.shadowRoot.querySelector('dialog').close();
      if (event.target.closest('[data-get-app]')) {
        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog.open) dialog.close();
        this.dispatchEvent(new CustomEvent('moltivate:get-app', { bubbles: true, composed: true }));
      }
    });
    const dialog = this.shadowRoot.querySelector('dialog');
    dialog.addEventListener('close', () => this.syncUpdates());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
      }
    });
    this.updateRows();
    this.observeVisibility();
  }

  disconnectedCallback() {
    clearInterval(this.updateTimer);
    this.updateTimer = null;
    this.visibilityObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  observeVisibility() {
    document.addEventListener('visibilitychange', this.onVisibility);
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = new IntersectionObserver(entries => {
      this.inView = entries[0].isIntersecting;
      this.syncUpdates();
    }, { threshold: 0 });
    this.visibilityObserver.observe(this);
  }

  syncUpdates() {
    clearInterval(this.updateTimer);
    this.updateTimer = null;
    if (!this.isConnected || (!this.inView && !this.externalVisible) || document.hidden || this.shadowRoot.querySelector('dialog').open) {
      this.shadowRoot.querySelectorAll('rolling-amount').forEach(amount => amount.settle?.());
      return;
    }
    this.updateTimer = setInterval(() => this.advanceFeed(), 4500);
  }

  setExternalVisible(visible) {
    if (this.externalVisible === visible) return;
    this.externalVisible = visible;
    this.syncUpdates();
  }

  weeklySnapshot() {
    return clubs.map(club => ({...club, value:this.displayUnits.week[club.id] / 1000}))
      .sort((a,b) => b.value - a.value);
  }

  advanceFeed() {
    // Bounded, repeatable sample changes. Each reel settles on this model's exact value.
    const offsets = [0, 3, 7, 4, 9, 5, 1, -3, -7, -2, 2];
    this.feedTick += 1;
    for (const period of ['week', 'month']) {
      clubs.forEach((club, index) => {
        const offset = offsets[(this.feedTick + index * 2) % offsets.length];
        this.displayUnits[period][club.id] = Math.round(club[period] * 1000) + offset * (period === 'month' ? 2 : 1);
      });
    }
    // Patch figures in place so search focus, row buttons, and scroll position remain stable.
    this.shadowRoot.querySelectorAll('[data-reward]').forEach(node => {
      const club = clubs.find(item => item.id === node.dataset.reward);
      const value = this.reward(club);
      node.classList.toggle('down', value < 0);
      node.classList.toggle('up', value >= 0);
      node.querySelector('rolling-amount').setAttribute('value', value.toFixed(3));
    });
    // The small bounded changes preserve this fixture's order; always derive rank from current data.
    const sorted = this.sortedClubs();
    const tbody = this.shadowRoot.querySelector('tbody');
    const visibleRows = sorted.map((club, index) => {
      const row = this.shadowRoot.querySelector(`[data-row="${club.id}"]`);
      if (row) {
        row.querySelector('td').textContent = String(index + 1).padStart(2, '0');
        row.querySelector('td').classList.toggle('leader', index === 0);
      }
      return row;
    }).filter(Boolean);
    visibleRows.forEach((row, index) => {
      if (tbody.children[index] !== row) tbody.insertBefore(row, tbody.children[index] || null);
    });
    this.dispatchEvent(new CustomEvent('moltivate:club-feed', {detail:this.weeklySnapshot()}));
  }

  progress(club) {
    const reps = this.filters.period === 'month' ? club.monthReps : club.reps;
    return { reps, completed: reps.filter(count => count >= 10).length, percent: Math.round(reps.reduce((sum, count) => sum + Math.min(count, 10), 0) / 20 * 100) };
  }

  reward(club) { return this.displayUnits[this.filters.period][club.id] / 1000; }

  amount(value) { return `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(3)}`; }

  sortedClubs() {
    return [...clubs].sort((a, b) => this.filters.sort === 'rewards'
      ? this.reward(b) - this.reward(a) || this.progress(b).percent - this.progress(a).percent
      : this.progress(b).percent - this.progress(a).percent || this.reward(b) - this.reward(a));
  }

  avatar(club) { return `<span class="avatar" style="--avatar-bg:${club.color};--avatar-ink:${club.ink}">${club.initials}</span>`; }

  updateRows() {
    const sorted = this.sortedClubs();
    const filtered = sorted.filter(club => (this.filters.crew === 'all' || club.id === 'early') && club.name.toLowerCase().includes(this.filters.query.trim().toLowerCase()));
    this.shadowRoot.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === this.filters.crew)));
    this.shadowRoot.querySelector('.rank-count').textContent = `${filtered.length} of ${clubs.length} demo crews · ${this.filters.period === 'week' ? 'weekly' : 'monthly'} view`;
    const result = this.shadowRoot.querySelector('.results');
    if (!filtered.length) {
      result.innerHTML = `<div class="empty"><strong>No crew found. Yet.</strong><p>Try another name or explore all six demo crews.</p><button data-reset>Show all crews</button></div>`;
      this.syncUpdates();
      return;
    }
    result.innerHTML = `<table><caption class="screen-reader">Demo crews ranked by ${this.filters.sort === 'progress' ? 'workout progress' : 'net rewards'} for ${this.filters.period === 'week' ? 'this week' : 'this month'}. Completion shows the latest challenge; rewards are totals for the selected period.</caption><thead><tr><th scope="col">#</th><th scope="col">Crew</th><th scope="col"><span class="completion-full">Completion</span><span class="completion-short" aria-label="Completion">Done</span></th><th scope="col">Net rewards</th></tr></thead><tbody>${filtered.map(club => {
      const { completed, percent } = this.progress(club);
      const reward = this.reward(club);
      const rank = sorted.findIndex(item => item.id === club.id) + 1;
      const points = club.trend.map((point, index) => `${index * 6.7},${point}`).join(' ');
      return `<tr class="club-row" data-row="${club.id}"><td class="${rank === 1 ? 'leader' : ''}">${String(rank).padStart(2, '0')}</td><td><button class="name-button" data-team="${club.id}" aria-label="View ${club.name} demo details">${this.avatar(club)}<span class="team-text"><span class="team-name">${club.name}</span><span class="team-members"><span class="member-stack" aria-hidden="true">${club.members.map(member => `<span class="mini-avatar">${member[0]}</span>`).join('')}</span>2 members <span class="moving ${club.movement > 0 ? 'up' : 'down'}" aria-label="${club.movement > 0 ? 'Up' : 'Down'} ${Math.abs(club.movement)} places">${club.movement > 0 ? '↗' : '↘'} ${Math.abs(club.movement)}</span></span></span></button></td><td><div class="progress-top"><span>${completed}<span class="completion-total"> / 2</span></span><span>${percent}%</span></div><div class="track" role="meter" aria-label="${club.name} latest challenge progress" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><div class="fill" style="width:${percent}%"></div></div></td><td><span class="money ${reward < 0 ? 'down' : 'up'}" data-reward="${club.id}"><rolling-amount value="${reward.toFixed(3)}"></rolling-amount></span><span class="submoney"><svg class="sparkline ${reward < 0 ? 'down' : 'up'}" viewBox="0 0 48 24" fill="none" aria-hidden="true"><polyline points="${points}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>demo SOL</span></td></tr>`;
    }).join('')}</tbody></table>`;
    this.syncUpdates();
  }

  reset() {
    this.filters = { query: '', crew: 'all', period: 'week', sort: 'progress' };
    this.shadowRoot.querySelector('input').value = '';
    this.shadowRoot.querySelector('[name=period]').value = 'week';
    this.shadowRoot.querySelector('[name=sort]').value = 'progress';
    this.updateRows();
  }

  showTeam(id) {
    const club = clubs.find(item => item.id === id);
    if (!club) return;
    const { reps, completed } = this.progress(club);
    const amount = this.reward(club);
    const dialog = this.shadowRoot.querySelector('dialog');
    dialog.innerHTML = `<div class="dialog-head">${this.avatar(club)}<button class="close" data-close aria-label="Close crew details">${icon('close', 18)}</button></div><h3 id="club-title">${club.name}</h3><p class="motto">${club.motto}</p><div class="dialog-meta"><span class="demo">Sample crew</span><span>2 members · 2v2 challenges</span></div><div class="dialog-stats"><div><div class="stat-label">Latest challenge goals</div><div class="stat-value">${completed} / 2</div></div><div><div class="stat-label">${this.filters.period === 'week' ? 'Weekly' : 'Monthly'} net · demo SOL</div><div class="stat-value ${amount < 0 ? 'down' : 'up'}">${this.amount(amount)}</div></div></div><h4 class="members-title">Every teammate's effort counts.</h4>${club.members.map((member, index) => `<div class="member"><span class="mini-avatar">${member[0]}</span><div class="member-name">${member}<div class="track"><div class="fill" style="width:${reps[index] * 10}%"></div></div></div><span class="member-count">${reps[index]} / 10 reps ${reps[index] >= 10 ? '✓' : ''}</span></div>`).join('')}<p class="detail-note">This is illustrative activity, not a real team or account. Completion reflects the latest sample challenge. Net rewards summarize the selected sample period and are not that challenge's payout.</p><button class="start-crew" data-get-app>Make showing up your thing ${icon('arrow', 17)}</button>`;
    dialog.showModal();
    this.syncUpdates();
  }
}

if (!customElements.get('club-board')) customElements.define('club-board', ClubBoard);

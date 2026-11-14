import './rolling-amount.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const trophy = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-6-3h4"/></svg>';

const styles = `
:host{position:fixed;right:0;top:172px;width:184px;z-index:40;font:13px/1.45 'DM Sans',Arial,sans-serif;color:#f3f3f1;--up:#83e5a7;--down:#ff858a}
*{box-sizing:border-box}[hidden]{display:none!important}button,a{font:inherit}button{cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid #efce78;outline-offset:4px}svg{width:18px;height:18px;flex-shrink:0}
.peek-motion{transform-origin:right center;transform:perspective(850px) translate3d(var(--peek-x,0px),var(--peek-y,0px),0) rotateY(var(--peek-fold,0deg)) rotateZ(var(--peek-turn,0deg)) scale(var(--peek-scale,1));opacity:var(--peek-opacity,1);transition:transform .18s cubic-bezier(.2,.65,.3,1),opacity .18s linear;will-change:transform,opacity}
.peek{display:block;width:100%;padding:17px 25px 15px 17px;text-align:left;color:inherit;border:1px solid #333639;border-right:0;border-radius:15px 0 0 15px;background:#111214;box-shadow:-8px 12px 24px #162d2014;transform:translateX(9px);transition:transform .25s,box-shadow .25s}
.peek:hover,.peek:focus-visible{transform:translateX(0);box-shadow:-10px 14px 28px #162d2026}.peek:active{transform:translateX(3px)}
.peek-heading{display:flex;gap:8px;align-items:center}.peek-heading>svg{color:#e6c57b;width:15px;height:15px}.peek-overline{font-size:8px;letter-spacing:1.3px;color:#b7b8bc}.compact-demo{display:none}.peek-title{display:block;font-size:16px;font-weight:600;letter-spacing:-.4px;margin:8px 0 3px}.peek-live{display:block;color:#92959a;font-size:8px}
.peek-rows{display:block;margin:12px 0 11px;border-top:1px solid #2c2e32;padding-top:2px}.peek-row{display:block;padding-top:10px}.peek-name{display:block;color:#c8c9cd;font-size:9px;margin-bottom:3px}.peek-value{font:600 17px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace}.up{color:var(--up)}.down{color:var(--down)}
.peek-cta{display:flex;justify-content:space-between;align-items:center;gap:6px;padding-top:10px;border-top:1px solid #2c2e32;color:#f0f0e9;font-size:9px;font-weight:500}.compact-open{display:none}.peek-cta svg{width:15px;height:15px}.peek-cta svg{transition:transform .2s}.peek:hover .peek-cta svg{transform:translateX(3px)}
.drawer{position:fixed;inset:0 0 0 auto;width:416px;max-width:calc(100vw - 12px);height:100dvh;max-height:100dvh;margin:0;padding:28px 24px 22px;border:0;border-left:1px solid #34363b;border-radius:18px 0 0 18px;background:#0d0e10;color:#f2f2ef;overflow:auto;box-shadow:-25px 0 70px #0003}
.drawer[open]{display:flex;flex-direction:column;animation:drawer-enter .4s cubic-bezier(.2,.8,.2,1)}.drawer::backdrop{background:#14251d35;backdrop-filter:blur(3px)}
.drawer-top{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:25px}.drawer-brand{display:flex;align-items:center;gap:9px;font-size:10px;letter-spacing:1.6px;color:#c4c6c4}.drawer-brand>svg{color:#e1bf71}.close{width:34px;height:34px;display:grid;place-items:center;border:1px solid #36383d;border-radius:50%;background:transparent;color:#b9bdc4}.close:hover{background:#25272b;color:#fff}
h2{font:600 29px/1.15 'DM Sans',Arial,sans-serif;letter-spacing:-1px;margin:0 0 9px}.intro{font-size:12px;line-height:1.65;color:#a9adb5;margin:0 0 23px;max-width:290px}.drawer-meta{display:flex;justify-content:space-between;align-items:center;gap:9px;font-size:10px;border-top:1px solid #292c30;border-bottom:1px solid #292c30;padding:13px 0;color:#c8cacf}.sample{display:flex;align-items:center;gap:6px;font-size:9px;color:#9a9ea7;white-space:nowrap}.sample i{width:5px;height:5px;display:block;border-radius:50%;background:#e17b56}.column-labels{display:flex;justify-content:space-between;color:#6f7580;font:8px ui-monospace,monospace;letter-spacing:1px;padding:17px 0 2px}
ol{list-style:none;padding:0;margin:0 0 22px}.team{display:grid;grid-template-columns:18px 34px minmax(0,1fr) auto;align-items:center;gap:10px;padding:18px 0;border-bottom:1px solid #24262b}.rank{font:11px ui-monospace,monospace;color:#707781}.avatar{height:34px;width:34px;display:grid;place-items:center;border:2px solid #ffffff26;border-radius:50%;font:600 11px 'Fraunces',Georgia,serif;background:var(--avatar-bg);color:var(--avatar-ink)}.team-name{display:block;font-size:12px;font-weight:500;line-height:1.35}.members{display:block;font-size:9px;color:#797f8a;margin-top:4px}.amount{font:600 16px ui-monospace,SFMono-Regular,Consolas,monospace;text-align:right;white-space:nowrap}.trend{display:block;margin:5px 0 0 auto;width:42px;height:12px;opacity:.75}
.drawer-bottom{margin-top:auto;padding-top:10px}.full-board{display:flex;justify-content:space-between;align-items:center;min-height:47px;padding:12px 15px;border:1px solid #555b51;border-radius:7px;background:#eef1e4;color:#183b2b;font-size:12px;font-weight:600;text-decoration:none;transition:background .2s}.full-board:hover{background:#fff}.note{font-size:9px;line-height:1.65;color:#797f8b;margin:14px 0 0}.drawer-signoff{font:25px 'La Belle Aurore',cursive;color:#d99c77;margin:21px 0 12px;transform:rotate(-3deg)}
@keyframes drawer-enter{from{transform:translateX(100%)}to{transform:translateX(0)}}
@media(max-width:1200px){
  :host{top:100px;width:232px}.peek{display:flex;align-items:center;gap:12px;padding:10px 23px 10px 14px;min-height:58px;border-radius:12px 0 0 12px;transform:translateX(8px)}.peek-heading{flex-direction:column;gap:4px}.peek-overline{font-size:6px;letter-spacing:1px}.peek-title,.peek-live{display:none}.peek-rows{flex:1;min-width:0;margin:0;padding:0;border:0}.peek-row{padding:0}.peek-row:nth-child(n+2){display:none}.peek-name{font-size:9px;margin-bottom:4px}.peek-value{font-size:15px}.peek-cta{border:0;padding:0}.cta-text{display:none}.peek-cta svg{width:17px;height:17px}
}
@media(max-width:800px){:host{top:103px}}
@media(max-width:1200px){.compact-demo{display:block;font-size:7px;letter-spacing:.3px;color:#9a9ea7}.compact-open{display:block;font-size:8px}.peek-cta{flex-direction:column;gap:3px}}
@media(max-width:500px){:host{top:92px;width:224px}.drawer{padding:22px 18px 18px}.team{gap:8px;grid-template-columns:16px 31px minmax(0,1fr) auto}.avatar{width:31px;height:31px}.team-name{font-size:11px}.amount{font-size:15px}h2{font-size:27px}}
@media(max-width:350px){.drawer{padding-left:14px;padding-right:14px}.team{gap:7px;grid-template-columns:15px 27px minmax(0,1fr) auto}.avatar{width:27px;height:27px;font-size:9px}.amount{font-size:13px}.team-name{font-size:10px}.members{font-size:8px}}
@media(prefers-reduced-motion:reduce){.peek-motion{transform:none;transition:none}.peek,.peek-cta svg,.full-board{transition:none}.drawer[open]{animation:none}}
`;

class ClubPeek extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this.storyProgress = 0;
    this.effects = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.onFeed = event => this.updateFigures(event.detail);
    this.onHidden = () => {
      if (document.hidden) this.shadowRoot.querySelectorAll('rolling-amount').forEach(amount=>amount.settle());
    };
  }

  connectedCallback() {
    this.board = document.querySelector('club-board');
    if (!this.board) return;
    const snapshot = this.board.weeklySnapshot();
    this.shadowRoot.innerHTML = `<style>${styles}</style>
      <div class="peek-motion">
      <button class="peek" aria-label="Open leaderboard" aria-haspopup="dialog" aria-controls="club-drawer" aria-expanded="false">
        <span class="peek-heading">${trophy}<span class="peek-overline">THE CLUB</span><span class="compact-demo">DEMO SOL</span></span>
        <span class="peek-title">Leaderboard</span><span class="peek-live">Simulated feed · demo SOL</span>
        <span class="peek-rows">${snapshot.slice(0,2).map(club=>`<span class="peek-row"><span class="peek-name">${club.name}</span><span class="peek-value up" data-amount="${club.id}"><rolling-amount value="${club.value.toFixed(3)}"></rolling-amount></span></span>`).join('')}</span>
        <span class="peek-cta"><span class="cta-text">Open leaderboard</span><span class="compact-open">Open</span>${arrow}</span>
      </button>
      </div>
      <dialog class="drawer" id="club-drawer" aria-labelledby="drawer-title" aria-describedby="drawer-intro">
        <div class="drawer-top"><span class="drawer-brand">${trophy}THE CLUB</span><button class="close" aria-label="Close leaderboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
        <h2 id="drawer-title">Stronger together.</h2><p class="intro" id="drawer-intro">The crews showing up. The commitments adding up.</p>
        <div class="drawer-meta"><span>Weekly net rewards</span><span class="sample"><i></i>Simulated feed</span></div>
        <div class="column-labels"><span>TEAM STANDINGS</span><span>DEMO SOL</span></div>
        <ol aria-label="Teams ranked by weekly net rewards">${snapshot.map((club,index)=>`<li class="team" data-team="${club.id}"><span class="rank">${String(index+1).padStart(2,'0')}</span><span class="avatar" style="--avatar-bg:${club.color};--avatar-ink:${club.ink}" aria-hidden="true">${club.initials}</span><span><span class="team-name">${club.name}</span><span class="members">${club.members.length} members · ${club.movement>0?'↑':'↓'} ${Math.abs(club.movement)} places</span></span><span class="amount ${club.value<0?'down':'up'}" data-amount="${club.id}"><rolling-amount value="${club.value.toFixed(3)}"></rolling-amount><svg class="trend" viewBox="0 0 48 24" fill="none" aria-hidden="true"><polyline points="${club.trend.map((p,i)=>`${i*6.7},${p}`).join(' ')}" stroke="currentColor" stroke-width="1.7"/></svg></span></li>`).join('')}</ol>
        <div class="drawer-bottom"><p class="drawer-signoff">a little skin in the game.</p><a class="full-board" href="#club">Explore the club ${arrow}</a><p class="note">Sample teams and rolling demo SOL, refreshed every 4.5 seconds. No live balances or real money movements.</p></div>
      </dialog>`;
    this.trigger = this.shadowRoot.querySelector('.peek');
    this.motion = this.shadowRoot.querySelector('.peek-motion');
    this.dialog = this.shadowRoot.querySelector('dialog');
    this.trigger.addEventListener('click',()=>this.open());
    this.shadowRoot.querySelector('.close').addEventListener('click',()=>this.dialog.close());
    this.shadowRoot.querySelector('.full-board').addEventListener('click',()=>{
      this.dialog.close();
      const heading = document.querySelector('#club-title');
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
    });
    this.trigger.addEventListener('focus',()=>this.updateVisibility());
    this.trigger.addEventListener('blur',()=>this.updateVisibility());
    this.dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab') return;
      const first=this.shadowRoot.querySelector('.close');
      const last=this.shadowRoot.querySelector('.full-board');
      if(event.shiftKey && this.shadowRoot.activeElement===first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey && this.shadowRoot.activeElement===last){
        event.preventDefault();
        first.focus();
      }
    });
    this.dialog.addEventListener('close',()=>{
      document.body.style.overflow = this.previousOverflow ?? '';
      this.trigger.setAttribute('aria-expanded','false');
      this.updateVisibility();
    });
    this.dialog.addEventListener('click',event=>{
      if (event.target !== this.dialog) return;
      const rect = this.dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right) this.dialog.close();
    });
    this.board.addEventListener('moltivate:club-feed',this.onFeed);
    document.addEventListener('visibilitychange',this.onHidden);
    this.updateVisibility();
  }

  disconnectedCallback() {
    this.board?.removeEventListener('moltivate:club-feed',this.onFeed);
    this.board?.setExternalVisible(false);
    document.removeEventListener('visibilitychange',this.onHidden);
    if (this.dialog?.open) {
      this.dialog.close();
      document.body.style.overflow = this.previousOverflow ?? '';
    }
  }

  open() {
    this.previousOverflow = document.body.style.overflow;
    this.dialog.showModal();
    document.body.style.overflow = 'hidden';
    this.trigger.setAttribute('aria-expanded','true');
    this.updateVisibility();
    this.shadowRoot.querySelector('.close').focus();
  }

  updateVisibility() {
    if (!this.motion) return;
    const keyboardFocus = this.shadowRoot.activeElement === this.trigger && this.trigger.matches(':focus-visible');
    const progress = this.dialog.open || keyboardFocus ? 0 : this.storyProgress;
    const eased = progress * progress * (3 - 2 * progress);
    const visible = progress < 1;
    this.motion.hidden = !visible;
    const values = {
      x: `${(innerWidth <= 1200 ? 250 : 205) * eased}px`,
      y: `${-28 * eased}px`,
      fold: `${-62 * eased}deg`,
      turn: `${-3 * eased}deg`,
      scale: 1 - .16 * eased,
      opacity: this.effects ? 1 - Math.max(0, (eased - .22) / .78) : 1,
    };
    for (const [key, value] of Object.entries(values)) this.motion.style.setProperty(`--peek-${key}`, String(value));
    this.board.setExternalVisible(visible || this.dialog.open);
    if (!visible && !this.dialog.open) this.shadowRoot.querySelectorAll('rolling-amount').forEach(amount=>amount.settle());
  }

  setStoryProgress(progress, effects) {
    this.storyProgress = progress;
    this.effects = effects;
    this.updateVisibility();
  }

  updateFigures(snapshot) {
    for (const club of snapshot) {
      this.shadowRoot.querySelectorAll(`[data-amount="${club.id}"]`).forEach(node=>{
        node.classList.toggle('down',club.value<0);
        node.classList.toggle('up',club.value>=0);
        node.querySelector('rolling-amount').setAttribute('value',club.value.toFixed(3));
      });
    }
    const list = this.shadowRoot.querySelector('ol');
    snapshot.forEach((club,index)=>{
      const row = list.querySelector(`[data-team="${club.id}"]`);
      row.querySelector('.rank').textContent=String(index+1).padStart(2,'0');
      if(list.children[index]!==row) list.insertBefore(row,list.children[index]||null);
    });
  }
}

if(!customElements.get('club-peek')) customElements.define('club-peek',ClubPeek);

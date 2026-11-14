/* A browser-only product tour. All activity and SOL amounts are illustrative. */
const icon = (name, size = 20) => {
  const paths = {
    bolt: '<path d="m13 2-8 12h6l-1 8 9-12h-6l1-8Z"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-14a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5"/>',
    activity: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    trophy: '<path d="M8 3h8v5a4 4 0 0 1-8 0V3Zm4 9v7m-4 2h8M8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    pause: '<path d="M8 5v14m8-14v14"/>',
    replay: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    sparkle: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bolt}</svg>`;
};

const css = `
:host{display:block;width:310px;max-width:100%;color:#183e2d;font-family:'DM Sans',Arial,sans-serif;font-size:12px;line-height:1.35;text-align:left;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}button{font:inherit;cursor:pointer}button:focus-visible{outline:3px solid #e66b3d;outline-offset:4px}button:disabled{cursor:default}button svg{flex-shrink:0}button{touch-action:manipulation}
.phone{position:relative;width:100%;height:620px;border-radius:49px;padding:7px;background:linear-gradient(105deg,#b5b7ad 0%,#252b25 6%,#9c9e95 7%,#292d29 10%,#101612 85%,#9ca196 94%,#272d26 96%);box-shadow:0 30px 44px -22px #173e2c4d,0 8px 12px -6px #173e2c30,inset 0 0 0 1px #898f84;isolation:isolate}
.phone:before,.phone:after{content:'';position:absolute;left:-2px;width:3px;height:39px;background:#5b6359;border-radius:2px;top:129px;z-index:-1}.phone:after{top:180px;height:57px}
.screen{position:relative;height:100%;border-radius:42px;background:#f9f8f1;border:3px solid #111812;overflow:hidden;display:flex;flex-direction:column}
.status{flex-shrink:0;height:44px;display:flex;align-items:center;justify-content:space-between;padding:2px 22px 0;font-size:10px;font-weight:700;color:#19271e;position:relative}.island{position:absolute;left:50%;transform:translateX(-50%);width:91px;height:25px;top:9px;border-radius:20px;background:#0d120f}.island:after{content:'';position:absolute;right:9px;top:8px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#304a6d,#141d2b 60%)}
.status-icons{display:flex;gap:4px;align-items:center}.signal{display:flex;align-items:flex-end;gap:1px;height:9px}.signal i{background:#19271e;width:2px;border-radius:1px}.signal i:nth-child(1){height:3px}.signal i:nth-child(2){height:5px}.signal i:nth-child(3){height:7px}.signal i:nth-child(4){height:9px}.battery{height:8px;width:16px;background:#19271e;border:1px solid #19271e;border-radius:2px;box-shadow:inset -3px 0 #f9f8f1;position:relative}.battery:after{content:'';position:absolute;right:-3px;width:2px;height:4px;top:1px;background:#19271e;border-radius:0 1px 1px 0}
.app-top{display:flex;align-items:center;justify-content:space-between;padding:2px 18px 7px}.wordmark{font-family:'Fraunces',Georgia,serif;font-size:22px;line-height:1;font-weight:650;letter-spacing:-1.2px;display:flex;gap:6px;align-items:center}.wordmark svg{width:27px;height:27px}.you{width:28px;height:28px;display:grid;place-items:center;background:#ecb79c;color:#5c3327;border-radius:50%;font-size:10px;font-weight:800;border:2px solid #fff}
.view{flex:1;min-height:0;padding:0 17px;position:relative;animation:arrive .35s ease both}.eyebrow{font-size:9px;letter-spacing:1.6px;text-transform:uppercase;font-weight:800;margin:5px 0 7px;color:#6c7569}.view h3{font:550 28px/1.04 'Fraunces',Georgia,serif;letter-spacing:-1.1px;margin:0 0 15px}.view h3 em{font-weight:450}.card{border-radius:17px;padding:16px;background:#e9eddf}.challenge{background:#193e2e;color:#fff;margin-bottom:12px;position:relative;overflow:hidden}.challenge:after{content:'';width:108px;height:108px;border:1px solid #ffffff12;position:absolute;right:-30px;top:-24px;border-radius:50%;box-shadow:0 0 0 15px #ffffff04,0 0 0 30px #ffffff04;pointer-events:none}.row{display:flex;align-items:center;justify-content:space-between;gap:8px}.tiny{font-size:10px;line-height:1.4}.muted{color:#748072}.white-muted{color:#bdcebe}.pill{border-radius:30px;background:#ffffff18;padding:4px 7px;font-size:8px;letter-spacing:.5px;font-weight:800;text-transform:uppercase;white-space:nowrap}.pill.green{background:#e2ecd6;color:#2c623f}.challenge h4{margin:10px 0 4px;font:500 22px/1.12 'Fraunces',Georgia,serif;letter-spacing:-.5px}.challenge p{margin:0;font-size:10px;line-height:1.5;color:#ced8cd}.challenge .row:last-child{margin-top:15px;padding-top:11px;border-top:1px solid #ffffff20}.challenge strong{font-size:15px;font-weight:650;font-variant-numeric:tabular-nums}.team-row{display:flex;align-items:center;justify-content:space-between;margin:0 0 12px}.team-group{display:flex;align-items:center;gap:5px}.avatars{display:flex;padding-right:4px}.avatar{height:28px;width:28px;border-radius:50%;display:grid;place-items:center;font-size:9px;font-weight:800;border:2px solid #f9f8f1;margin-right:-5px}.avatar.yellow{background:#f0d578;color:#5e521d}.avatar.orange{background:#eab89c;color:#63392c}.avatar.green{background:#c8d6b7;color:#3d593b}.avatar.lilac{background:#dcd7e5;color:#625875}.vs{color:#9c9f92;font-size:9px;font-style:italic}.team-name{font-size:9px;font-weight:700;max-width:54px;line-height:1.3}.metrics{display:flex;gap:8px;margin:0 0 12px}.metric{padding:11px;background:#eeefe5;border-radius:12px;flex:1}.metric .label{font-size:8px;color:#6f786c;display:block;margin-bottom:4px}.metric b{font-size:13px;font-weight:700;letter-spacing:-.3px}.metric b small{font-size:8px;font-weight:600;color:#7c8477}.main-action{width:100%;min-height:39px;padding:10px 12px;border:0;border-radius:11px;background:#e77046;color:#1c291f;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:9px;transition:background .2s,transform .2s}.main-action:hover{background:#f18459;transform:translateY(-1px)}.main-action.done{background:#dce8cb;color:#365a32}.main-action:disabled{transform:none;opacity:.85}.text-action{display:block;background:none;border:none;padding:8px;margin:0 auto;color:#65715f;font-size:9px;text-decoration:underline;text-underline-offset:3px}.footnote{text-align:center;font-size:8px;color:#859080;margin:7px 0;line-height:1.4}
.bottom-nav{flex-shrink:0;display:flex;justify-content:space-around;align-items:center;border-top:1px solid #e6e9de;margin-top:11px;padding:10px 11px 14px;background:#fafaf5}.bottom-nav button{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:0;color:#9ca394;padding:0 8px;font-size:7px;font-weight:700}.bottom-nav button.active{color:#183e2d}.homebar{position:absolute;bottom:5px;left:50%;transform:translateX(-50%);width:90px;height:4px;background:#273c2c;border-radius:5px}
.workout-label{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}.workout-label b{font-size:11px}.demo-tag{font-size:8px;padding:3px 6px;background:#eee4cc;border-radius:5px;color:#796841;font-weight:700;letter-spacing:.5px}.workout-stage{position:relative;height:199px;background:#e5eadb;border-radius:17px;display:grid;place-items:center;overflow:hidden}.workout-stage:before{content:'';position:absolute;width:136px;height:136px;background:#d7dfc9;border-radius:50%;top:25px;left:calc(50% - 68px)}.pose{position:relative;height:173px;width:150px;overflow:visible}.pose .body{transform-origin:80px 115px;transition:transform .3s}.workout-stage.counting .pose .body{animation:demoRep 1.2s ease-in-out infinite}.workout-stage .corner{position:absolute;width:18px;height:18px;border-color:#7f9770;border-style:solid}.corner.tl{top:15px;left:15px;border-width:1.5px 0 0 1.5px;border-radius:4px 0 0}.corner.tr{top:15px;right:15px;border-width:1.5px 1.5px 0 0;border-radius:0 4px 0 0}.corner.bl{bottom:15px;left:15px;border-width:0 0 1.5px 1.5px;border-radius:0 0 0 4px}.corner.br{bottom:15px;right:15px;border-width:0 1.5px 1.5px 0;border-radius:0 0 4px 0}.rep-chip{position:absolute;right:12px;top:12px;background:#f9f8f1e8;border-radius:9px;padding:8px 9px;text-align:center;box-shadow:0 2px 5px #183e2d0a}.rep-chip strong{font-size:25px;line-height:1;display:block;font-weight:600;font-variant-numeric:tabular-nums}.rep-chip span{font-size:7px;letter-spacing:1px;font-weight:700}.camera-note{position:absolute;bottom:12px;font-size:7px;color:#62715a;letter-spacing:.3px;background:#e5eadbd9;padding:4px 7px;border-radius:9px}.progress-track{height:5px;background:#e5e9db;border-radius:8px;overflow:hidden;margin:14px 0 7px}.progress-fill{height:100%;background:#537b44;border-radius:8px;width:0;transition:width .35s}.workout-progress{font-size:9px;display:flex;justify-content:space-between;color:#6d7968;margin-bottom:13px}.complete-note{font-size:10px;display:flex;align-items:center;justify-content:center;gap:5px;color:#3f6f36;margin:7px 0 0;min-height:15px}
.reward{background:#efd68a;border-radius:17px;padding:16px;text-align:center;margin-bottom:12px;position:relative;overflow:hidden}.reward .trophy{margin:0 auto 7px;width:39px;height:39px;border-radius:50%;background:#f7e7b8;display:grid;place-items:center;color:#8a6e23}.reward .reward-label{font-size:9px;color:#7f713b}.reward strong{font:550 34px/1.3 'Fraunces',Georgia,serif;letter-spacing:-1px;display:block}.reward .unit{font:600 10px 'DM Sans',Arial,sans-serif;letter-spacing:0}.reward small{font-size:8px;color:#746c3c}.result-score{display:flex;align-items:center;justify-content:space-between;background:#ecf0e4;border-radius:11px;padding:11px 12px;font-size:10px;font-weight:700;margin-bottom:12px}.result-score strong{font-variant-numeric:tabular-nums;font-size:17px}.breakdown{margin:0 0 11px;font-size:9px}.breakdown .row{margin:8px 0}.breakdown .positive{color:#38723f;font-weight:700}.result-note{font-size:8px;color:#72806c;line-height:1.45;margin:7px 0 11px}.overlay{position:absolute;inset:0;z-index:5;display:flex;align-items:flex-end;background:#10271970;border-radius:37px}.sheet{background:#f9f8f1;border-radius:22px 22px 0 0;padding:21px 19px 28px;box-shadow:0 -8px 30px #183e2d25}.sheet h4{font:550 23px 'Fraunces',Georgia,serif;margin:2px 0 13px;letter-spacing:-.5px}.sheet p,.sheet li{font-size:10px;line-height:1.65;color:#57654f}.sheet ul{padding-left:16px;margin-bottom:16px}.sheet .close{position:absolute;right:17px;top:17px;background:none;border:0;padding:3px;color:#183e2d}.sheet{position:relative}.sheet .topline{font-size:8px;letter-spacing:1px;font-weight:700;color:#7e896f;text-transform:uppercase}.sheet p{margin:10px 0}.success{width:54px;height:54px;background:#e6efda;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;color:#3c773c}.receipt{font-size:10px;text-align:center;color:#64745a;line-height:1.6;margin:7px 0 17px}.sheet.center{text-align:center}
.selectors{display:flex;gap:4px;justify-content:center;margin:20px -12px 0}.selectors button{font-size:10px;padding:8px 9px;border-radius:25px;border:1px solid transparent;background:transparent;color:#7b8275;white-space:nowrap;transition:background .2s,color .2s}.selectors button[aria-selected=true]{background:#193e2e;color:#fff}.selectors button:hover{background:#e3e8d8;color:#193e2e}.selectors button[aria-selected=true]:hover{background:#2b543c;color:#fff}.tour-bottom{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:10px;min-height:23px}.tour-control{border:0;background:transparent;color:#737d6b;font-size:8px;display:flex;align-items:center;gap:4px;padding:3px}.tour-control:hover{color:#183e2d}.demo-caption{font-size:8px;color:#7d8577;text-align:center;margin:8px 0 0;letter-spacing:.3px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@keyframes arrive{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes demoRep{0%,100%{transform:translateY(0)}50%{transform:translateY(9px)}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
@media(max-width:360px){:host{width:290px}.phone{height:600px}.view{padding:0 15px}.view h3{font-size:26px;margin-bottom:12px}.challenge{padding:14px}.selectors{margin-inline:-3px}.selectors button{font-size:9px;padding:8px 7px}}
`;

const productCss = `
.tab-number{display:none}
:host([scroll-story]) .phone{height:650px;transform:perspective(1100px) rotateX(var(--phone-pitch,0deg)) rotateY(var(--phone-yaw,0deg)) rotateZ(var(--phone-roll,0deg));transform-origin:50% 45%;transition:transform .28s cubic-bezier(.2,.7,.2,1);box-shadow:0 34px 45px -25px #173e2c48,4px 2px 0 -1px #69715f,inset 0 0 0 1px #969d8b}
:host([scroll-story]) .screen:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:6;background:linear-gradient(115deg,transparent 32%,#ffffff20 45%,#ffffff04 47%,transparent 58%);background-size:180% 100%;background-position:var(--glass-position,50%) 0;border-radius:39px}
:host([scroll-story]) .selectors{margin:0 -53px 24px;gap:0;border-bottom:1px solid #cbd3c1;justify-content:space-between}
:host([scroll-story]) .selectors button{position:relative;border:0;border-radius:0;padding:12px 14px 15px;font-size:11px;color:#737f6c;background:transparent;transition:color .2s}
:host([scroll-story]) .selectors button:after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--green,#173e2c);transform:scaleX(0);transform-origin:left;transition:transform .25s}
:host([scroll-story]) .selectors button[aria-selected=true]{color:#193e2e;background:transparent;font-weight:650}
:host([scroll-story]) .selectors button[aria-selected=true]:after{transform:scaleX(1)}
:host([scroll-story]) .selectors button:hover{color:#b34d2d;background:transparent}
:host([scroll-story]) .tab-number{display:inline-block;font:8px ui-monospace,monospace;margin-right:7px;opacity:.65}
:host([scroll-story]) .tour-bottom{margin-top:18px;gap:15px}
:host([scroll-story]) .tour-control{font-size:9px;min-height:28px}
:host([scroll-story]) .demo-caption{font-size:9px;margin-top:6px}
:host([scroll-story]) .view{animation:screen-enter .32s ease-out both}
:host([scroll-story]) .reward .trophy{animation:trophy-enter .6s cubic-bezier(.2,.8,.2,1.3) both}
.main-action:active{transform:translateY(1px)}
@keyframes screen-enter{from{opacity:.35;translate:0 8px}to{opacity:1;translate:0 0}}
@keyframes trophy-enter{from{scale:.7;rotate:-20deg}to{scale:1;rotate:0deg}}
:host([effects-off]) .phone{transform:none;transition:none}
:host([effects-off]) *,:host([effects-off]) *:after{animation:none!important;transition:none!important}
@media(min-width:901px) and (max-height:880px){:host([scroll-story]) .phone{height:590px}:host([scroll-story]) .selectors{margin-bottom:20px}}
@media(max-width:650px){:host([scroll-story]) .phone{height:620px}:host([scroll-story]) .selectors{margin:0 0 22px}:host([scroll-story]) .selectors button{font-size:10px;padding:12px 9px}:host([scroll-story]) .tab-number{font-size:7px;margin-right:5px}}
@media(max-width:360px){:host([scroll-story]) .phone{height:600px}:host([scroll-story]) .selectors button{font-size:9px;padding:12px 7px}}
@media(prefers-reduced-motion:reduce){:host([scroll-story]) .phone{transform:none;transition:none}*{animation:none!important;transition:none!important}}
`;

class MoltivateDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.stage = 0;
    this.playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.joined = false;
    this.reps = 0;
    this.counting = false;
    this.claimed = false;
    this.overlay = null;
    this.autoTimer = null;
    this.repTimer = null;
    this.boundClick = this.onClick.bind(this);
    this.boundKey = this.onKey.bind(this);
    this.storyLayout = false;
    this.visible = false;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.boundMotion = () => {
      if (this.motionQuery.matches) { this.pauseTour(); this.render(); }
    };
    this.boundVisibility = () => this.scheduleTour();
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.boundClick);
    this.shadowRoot.addEventListener('keydown', this.boundKey);
    this.render();
    this.motionQuery.addEventListener('change', this.boundMotion);
    document.addEventListener('visibilitychange', this.boundVisibility);
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.scheduleTour();
    }, {threshold:.1});
    this.visibilityObserver.observe(this);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.boundClick);
    this.shadowRoot.removeEventListener('keydown', this.boundKey);
    this.clearTimers();
    this.visibilityObserver?.disconnect();
    this.motionQuery.removeEventListener('change', this.boundMotion);
    document.removeEventListener('visibilitychange', this.boundVisibility);
  }

  setStoryLayout(active) {
    if (this.storyLayout === active) return;
    this.storyLayout = active;
    this.render();
    this.scheduleTour();
  }

  setStoryStage(stage) {
    if (!this.storyLayout || !this.playing || this.overlay || this.counting) return;
    if (stage !== this.stage) this.changeStage(stage);
  }

  focusDemo() {
    this.pauseTour();
    this.render(`tab-${this.stage}`);
  }

  clearTimers() {
    clearTimeout(this.autoTimer);
    clearInterval(this.repTimer);
    this.autoTimer = this.repTimer = null;
    this.counting = false;
  }

  scheduleTour() {
    clearTimeout(this.autoTimer);
    if (!this.playing || !this.isConnected || !this.visible || document.hidden || this.storyLayout) return;
    this.autoTimer = setTimeout(() => {
      this.changeStage((this.stage + 1) % 3);
      this.scheduleTour();
    }, 7000);
  }

  changeStage(stage, focus = false) {
    clearInterval(this.repTimer);
    this.repTimer = null;
    this.counting = false;
    this.overlay = null;
    this.stage = stage;
    this.render(focus ? `tab-${stage}` : null);
  }

  pauseTour() {
    this.playing = false;
    clearTimeout(this.autoTimer);
    this.autoTimer = null;
  }

  onKey(event) {
    const target = event.target.closest('button');
    if (event.key === 'Tab' && this.overlay) {
      const controls = [...this.shadowRoot.querySelectorAll('.overlay button:not([disabled])')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && this.shadowRoot.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && this.shadowRoot.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.key === 'Escape' && this.overlay) {
      this.overlay = null;
      this.render(this.claimed ? 'claim' : 'rules');
    }
    if (event.ctrlKey || event.metaKey || event.altKey || !target?.hasAttribute('data-stage') || target.getAttribute('role') !== 'tab') return;
    let next;
    if (event.key === 'ArrowRight') next = (this.stage + 1) % 3;
    if (event.key === 'ArrowLeft') next = (this.stage + 2) % 3;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 2;
    if (next === undefined) return;
    event.preventDefault();
    this.pauseTour();
    this.changeStage(next, true);
  }

  onClick(event) {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (button.hasAttribute('data-stage')) {
      this.pauseTour();
      this.changeStage(Number(button.dataset.stage), button.getAttribute('role') === 'tab');
      return;
    }
    if (action === 'toggle') {
      this.playing = !this.playing;
      this.overlay = null;
      this.render('toggle');
      this.scheduleTour();
      return;
    }
    this.pauseTour();
    if (action === 'replay') {
      this.clearTimers();
      this.joined = this.claimed = false;
      this.reps = 0;
      this.stage = 0;
      this.overlay = null;
      this.playing = !this.storyLayout && !this.motionQuery.matches;
      this.render('replay');
      this.scheduleTour();
    } else if (action === 'rules') {
      this.overlay = 'rules';
      this.render('close');
    } else if (action === 'close') {
      const wasClaim = this.overlay === 'receipt';
      this.overlay = null;
      this.render(wasClaim ? 'claim' : 'rules');
    } else if (action === 'join') {
      if (!this.joined) {
        this.overlay = 'join';
        this.render('confirm-join');
      } else {
        this.changeStage(1);
        this.shadowRoot.querySelector('[data-action="set"]')?.focus({ preventScroll: true });
      }
    } else if (action === 'confirm-join') {
      this.joined = true;
      this.overlay = null;
      this.render('join');
    } else if (action === 'set') {
      if (this.reps === 10) {
        this.changeStage(2);
        this.shadowRoot.querySelector('[data-action="claim"]')?.focus({ preventScroll: true });
      } else {
        this.startSet();
      }
    } else if (action === 'claim') {
      this.claimed = true;
      this.overlay = 'receipt';
      this.render('close');
    }
  }

  startSet() {
    if (this.counting) return;
    clearInterval(this.repTimer);
    this.reps = 0;
    this.counting = true;
    this.render();
    this.repTimer = setInterval(() => {
      this.reps += 1;
      const root = this.shadowRoot;
      root.querySelector('[data-reps]').textContent = String(this.reps).padStart(2, '0');
      root.querySelector('[data-progress]').textContent = `${this.reps} of 10 reps`;
      root.querySelector('.progress-fill').style.width = `${this.reps * 10}%`;
      if (this.reps >= 10) {
        clearInterval(this.repTimer);
        this.repTimer = null;
        this.counting = false;
        this.render('set');
      }
    }, 460);
  }

  crewView() {
    return `<p class="eyebrow">A little stronger, together</p>
      <h3>Your people.<br>Your <em>next chapter.</em></h3>
      <div class="card challenge">
        <div class="row"><span class="tiny white-muted">YOUR NEXT CHALLENGE</span><span class="pill">2 vs 2</span></div>
        <h4>The morning crew</h4><p>10 squats. One small promise.</p>
        <div class="row"><span class="tiny white-muted">Total demo pool</span><strong>0.20 <span class="tiny white-muted">SOL</span></strong></div>
      </div>
      <div class="team-row">
        <div class="team-group"><div class="avatars"><span class="avatar yellow">YOU</span><span class="avatar green">AJ</span></div><span class="team-name">Early birds</span></div>
        <span class="vs">vs.</span>
        <div class="team-group"><span class="team-name">Night owls</span><div class="avatars"><span class="avatar orange">MK</span><span class="avatar lilac">JS</span></div></div>
      </div>
      <div class="metrics"><div class="metric"><span class="label">YOUR COMMITMENT</span><b>0.05 <small>demo SOL</small></b></div><div class="metric"><span class="label">THE GOAL</span><b>10 <small>squats each</small></b></div></div>
      <button class="main-action ${this.joined ? 'done' : ''}" data-action="join">${this.joined ? 'You’re in. Let’s move.' : 'Count me in'} ${icon(this.joined ? 'check' : 'arrow', 15)}</button>
      <button class="text-action" data-action="rules">The rules, before you commit</button>`;
  }

  workoutView() {
    return `<p class="eyebrow">A promise to yourself</p><h3>Make your<br><em>next rep count.</em></h3>
      <div class="workout-label"><b>Your set · 10 squats</b><span class="demo-tag">SIMULATION</span></div>
      <div class="workout-stage ${this.counting ? 'counting' : ''}">
        <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
        <svg class="pose" viewBox="0 0 160 185" aria-hidden="true">
          <ellipse cx="78" cy="174" rx="48" ry="6" fill="#bdccb0" opacity=".6"/>
          <g class="body"><path d="m64 113-13 29 4 25M93 112l17 29-7 27" fill="none" stroke="#254b36" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M54 169H40m65 0h15" stroke="#173b2a" stroke-width="9" stroke-linecap="round"/>
          <path d="M65 59c-6 16-7 36-3 56 9 5 22 5 33-1 2-20 0-39-6-55Z" fill="#e77046"/>
          <path d="M65 66 46 90l-20-5m64-19 19 24 21-5" fill="none" stroke="#d9aa84" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M66 62 52 80m37-18 13 18" stroke="#e77046" stroke-width="16" stroke-linecap="round"/>
          <path d="M76 49v12" stroke="#d9aa84" stroke-width="11" stroke-linecap="round"/>
          <ellipse cx="77" cy="35" rx="13" ry="16" fill="#d9aa84"/><path d="M65 36c-7-18 5-28 18-22 8 3 10 11 6 20-6-1-5-11-8-12-2 7-11 7-16 7Z" fill="#25432e"/>
          <g fill="#eff5e7" stroke="#6b9259" stroke-width="1.5"><circle cx="62" cy="67" r="3"/><circle cx="92" cy="67" r="3"/><circle cx="62" cy="112" r="3"/><circle cx="95" cy="112" r="3"/><circle cx="51" cy="143" r="3"/><circle cx="109" cy="143" r="3"/></g>
          </g>
        </svg>
        <div class="rep-chip"><strong data-reps>${String(this.reps).padStart(2, '0')}</strong><span>REPS</span></div>
        <span class="camera-note">Demo animation · no camera access</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${this.reps * 10}%"></div></div>
      <div class="workout-progress"><span data-progress>${this.reps} of 10 reps</span><span>${this.reps === 10 ? 'Target reached' : 'One set. You’ve got this.'}</span></div>
      <button class="main-action ${this.reps === 10 ? 'done' : ''}" data-action="set" ${this.counting ? 'disabled' : ''}>${this.counting ? 'Counting demo reps…' : this.reps === 10 ? 'See the sample result' : 'Start demo set'} ${icon(this.reps === 10 ? 'check' : 'play', 14)}</button>
      <div class="complete-note" aria-live="polite">${this.reps === 10 ? `${icon('check', 13)} Ten reps. One promise kept.` : ''}</div>`;
  }

  progressView() {
    return `<p class="eyebrow">Showing up looks good on you</p><h3>You kept<br><em>your promise.</em></h3>
      <div class="reward"><div class="trophy">${icon('trophy', 24)}</div><span class="reward-label">YOUR SAMPLE PAYOUT</span><strong>0.075 <span class="unit">demo SOL</span></strong><small>0.05 returned + 0.025 team bonus</small></div>
      <div class="result-score"><span>Early birds</span><strong>2 <span class="muted">–</span> 1</strong><span class="muted">Night owls</span></div>
      <div class="breakdown"><div class="row"><span class="muted">Your original commitment</span><b>0.050</b></div><div class="row"><span class="muted">Your share of the bonus</span><b class="positive">+0.025</b></div></div>
      <p class="result-note">Three people met their goal. The remaining stake is shared by the winning completers.</p>
      <button class="main-action ${this.claimed ? 'done' : ''}" data-action="claim">${this.claimed ? 'View demo receipt' : 'Try claiming your reward'} ${icon(this.claimed ? 'check' : 'arrow', 15)}</button>
      <p class="footnote">Illustrative outcome. No funds are moved.</p>`;
  }

  overlayView() {
    if (!this.overlay) return '';
    if (this.overlay === 'receipt') return `<div class="overlay"><section class="sheet center" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><button class="close" data-action="close" aria-label="Close demo receipt">${icon('close', 18)}</button><div class="success">${icon('check', 29)}</div><span class="topline">Demo receipt</span><h4 id="sheet-title">A win for showing up.</h4><p class="receipt"><b>0.075 demo SOL</b><br>0.05 principal + 0.025 bonus</p><p>This is an interactive preview. No wallet was connected and no transaction was sent.</p><button class="main-action" data-action="close">Got it ${icon('check', 15)}</button></section></div>`;
    return `<div class="overlay"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><button class="close" data-action="close" aria-label="Close challenge rules">${icon('close', 18)}</button><span class="topline">Example challenge · demo only</span><h4 id="sheet-title">Small stake.<br>Clear rules.</h4><ul><li>Two teams of two. 10 squats per person.</li><li>Each person commits 0.05 demo SOL.</li><li>Finish within the challenge window to recover your stake.</li><li>The winning completers share non-completers’ stakes. Extra reps don’t add points.</li><li>Ties, incomplete teams and settlement timeouts refund the original stakes.</li></ul><p>No real wallet, recording or payment is used in this preview.</p><button class="main-action" data-action="${this.overlay === 'join' ? 'confirm-join' : 'close'}">${this.overlay === 'join' ? 'Join the demo challenge' : 'Sounds good'} ${icon('arrow', 15)}</button></section></div>`;
  }

  render(focusAction = null) {
    const views = [this.crewView(), this.workoutView(), this.progressView()];
    const selectors = `<div class="selectors" role="tablist" aria-label="Explore the app demo">${['Your crew', 'Your workout', 'Your progress'].map((label, i) => `<button id="tab-${i}" data-action="tab-${i}" data-stage="${i}" role="tab" aria-controls="demo-view" aria-selected="${this.stage === i}" tabindex="${this.stage === i ? '0' : '-1'}"><span class="tab-number" aria-hidden="true">0${i + 1}</span>${label}</button>`).join('')}</div>`;
    const controlLabel = this.storyLayout ? 'Follow scroll tour' : 'Play automatic demo';
    const controlText = this.storyLayout ? 'Follow scroll' : 'Play tour';
    this.shadowRoot.innerHTML = `<style>${css}${productCss}</style>
      ${this.hasAttribute('scroll-story') ? selectors : ''}
      <div class="phone"><div class="screen">
        <div class="status" aria-hidden="true"><span>9:41</span><span class="island"></span><span class="status-icons"><span class="signal"><i></i><i></i><i></i><i></i></span><svg width="12" height="10" viewBox="0 0 16 12" fill="none"><path d="M1 3a11 11 0 0 1 14 0M4 6a6 6 0 0 1 8 0m-5 3a2 2 0 0 1 2 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><i class="battery"></i></span></div>
        <div class="app-top"><div class="wordmark"><svg width="27" height="27" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect width="48" height="48" rx="12" fill="#173e2c"/><g transform="translate(6 7) scale(.85)"><path d="M8 26V15a4 4 0 0 1 8 0v8l8-11a4.5 4.5 0 0 1 8 3v11" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="31" cy="5" r="3" fill="#e66b3d"/></g></svg>moltivate</div><span class="you" aria-label="Demo profile">YOU</span></div>
        <div class="view" id="demo-view" role="tabpanel" aria-labelledby="tab-${this.stage}">${views[this.stage]}</div>
        <nav class="bottom-nav" aria-label="Demo screens">${['Crew', 'Workout', 'Progress'].map((label, i) => `<button class="${this.stage === i ? 'active' : ''}" data-stage="${i}" aria-label="Show ${label.toLowerCase()} demo" ${this.stage === i ? 'aria-current="page"' : ''}>${icon(['people', 'activity', 'trophy'][i], 17)}${label}</button>`).join('')}</nav>
        <span class="homebar" aria-hidden="true"></span>${this.overlayView()}
      </div></div>
      ${this.hasAttribute('scroll-story') ? '' : selectors}
      <div class="tour-bottom">${this.playing ? '' : `<button class="tour-control" data-action="toggle" aria-label="${controlLabel}">${icon('play', 12)}${controlText}</button>`}<button class="tour-control" data-action="replay" aria-label="Restart app demo">${icon('replay', 11)}Replay</button></div>
      <p class="demo-caption">Interactive preview · sample data</p>`;
    if (this.overlay) {
      for (const el of this.shadowRoot.querySelectorAll('.view,.bottom-nav,.selectors,.tour-bottom')) el.inert = true;
    }
    if (focusAction) this.shadowRoot.querySelector(`[data-action="${focusAction}"]`)?.focus({ preventScroll: true });
    this.dispatchEvent(new CustomEvent('moltivate:demo-state', {bubbles:true,detail:{stage:this.stage,playing:this.playing}}));
  }
}

if (!customElements.get('moltivate-demo')) customElements.define('moltivate-demo', MoltivateDemo);

// Scroll never captures wheel/touch input. The phone stays fully usable by hand.
const story = document.querySelector('.product-story');
const stage = story.querySelector('.product-stage');
const phone = story.querySelector('moltivate-demo');
const clubPeek = document.querySelector('club-peek');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const tallDesktop = matchMedia('(min-width: 901px) and (min-height: 800px)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const chapters = [
  {title:'Find your people.',text:'The hardest rep is getting out the door. Make a plan with the people who get you there.',label:'THE GROUP CHAT MADE IT',value:'The morning crew',detail:'Two teams. Ten squats each.',signoff:'see you at six.'},
  {title:'Make it count.',text:'A small commitment. A clear goal. Take your next set from “I should” to “I did.”',label:'A PROMISE TO YOURSELF',value:'10 squats.',detail:'One target. Your contribution.',signoff:'you showed up.'},
  {title:'Keep your word.',text:'Your effort adds up with your crew’s. See the sample result, then try the whole flow yourself.',label:'EXAMPLE CHALLENGE RESULT',value:'A promise kept.',detail:'0.075 demo SOL · sample payout',signoff:'stronger, together.'},
];
let effects = !reduced.matches;
let frame = 0;
let activeChapter = -1;
let lastFollowing = phone.playing;
let pointerX = 0;
let pointerY = 0;
let handlingPhone = false;
const revealAnimations = new Set();
const clamp = (value, low=0, high=1) => Math.min(high, Math.max(low, value));
// Each chapter gets about a viewport of travel; the workout gets the longest hold.
const chapterEdges = [0, .30, .72, 1];

function paintChapter(index) {
  if (index === activeChapter) return;
  activeChapter = index;
  const chapter = chapters[index];
  story.dataset.chapter = String(index);
  story.querySelector('[data-chapter-number]').textContent = String(index + 1).padStart(2, '0');
  for (const key of ['title','text','label','value','detail','signoff']) {
    story.querySelector(`[data-chapter-${key}]`).textContent = chapter[key];
  }
  story.querySelectorAll('.story-ticks span').forEach((tick, i) => {
    tick.classList.toggle('active', i === index);
    tick.classList.toggle('complete', i < index);
  });
}

function resetTilt() {
  for (const property of ['pitch','yaw','roll']) phone.style.setProperty(`--phone-${property}`,'0deg');
  phone.style.setProperty('--glass-position','50%');
}

function update() {
  frame = 0;
  if (document.hidden) return;
  const rect = story.getBoundingClientRect();
  const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
  const distance = Math.max(1, story.offsetHeight - stage.offsetHeight - parseFloat(getComputedStyle(story).paddingBottom));
  const progress = clamp((stickyTop - rect.top) / distance);
  stage.style.setProperty('--story-progress', String(progress));
  // The standings make room for the phone as it enters, then unwind on scroll-up.
  const handoffStart = innerHeight * .75;
  const handoffEnd = Math.max(stickyTop + 60, innerHeight * .12);
  clubPeek?.setStoryProgress(clamp((handoffStart - rect.top) / (handoffStart - handoffEnd)), effects);
  if (effects && tallDesktop.matches) {
    // Hysteresis keeps trackpad jitter around a chapter boundary from flickering.
    let next = progress < chapterEdges[1] ? 0 : progress < chapterEdges[2] ? 1 : 2;
    if (activeChapter > 0 && progress > chapterEdges[activeChapter] - .018 && progress < chapterEdges[activeChapter]) next = activeChapter;
    phone.setStoryStage?.(next);
  }
  const chapter = Math.max(0, activeChapter);
  stage.style.setProperty('--chapter-progress', String(clamp((progress - chapterEdges[chapter]) / (chapterEdges[chapter + 1] - chapterEdges[chapter]))));
  if (!effects || !tallDesktop.matches || handlingPhone || rect.bottom < 0 || rect.top > innerHeight) {
    resetTilt();
    return;
  }
  const entrance = clamp((innerHeight * .8 - rect.top) / (innerHeight * .65));
  const yaw = (1 - entrance) * -15 + Math.sin(progress * Math.PI * 2) * 4 + pointerX * 3;
  const pitch = (1 - entrance) * 7 - pointerY * 2;
  phone.style.setProperty('--phone-yaw', `${yaw.toFixed(2)}deg`);
  phone.style.setProperty('--phone-pitch', `${pitch.toFixed(2)}deg`);
  phone.style.setProperty('--phone-roll', `${((1 - entrance) * -3).toFixed(2)}deg`);
  phone.style.setProperty('--glass-position', `${50 + yaw * 2}%`);
}

function scheduleUpdate() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(update);
}

function applyPreferences() {
  const allowed = effects && !reduced.matches;
  effects = allowed;
  document.body.dataset.effects = allowed ? 'on' : 'off';
  document.body.dataset.storyLayout = tallDesktop.matches && allowed ? 'scroll' : 'static';
  phone.toggleAttribute('effects-off', !allowed);
  phone.setStoryLayout?.(tallDesktop.matches && allowed);
  if (!allowed) {
    resetTilt();
    for (const animation of revealAnimations) animation.finish();
  }
  scheduleUpdate();
}

phone.addEventListener('moltivate:demo-state', event => {
  paintChapter(event.detail.stage);
  if (event.detail.playing !== lastFollowing) {
    lastFollowing = event.detail.playing;
    scheduleUpdate();
  }
});
reduced.addEventListener('change', () => { effects = !reduced.matches; applyPreferences(); });
tallDesktop.addEventListener('change', applyPreferences);
window.addEventListener('scroll', scheduleUpdate, {passive:true});
window.addEventListener('resize', scheduleUpdate, {passive:true});
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('page-hidden', document.hidden);
  if (document.hidden && frame) {cancelAnimationFrame(frame); frame = 0;}
  else scheduleUpdate();
});
stage.addEventListener('pointermove', event => {
  if (!effects || !finePointer.matches) return;
  const rect = stage.getBoundingClientRect();
  pointerX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
  pointerY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
  scheduleUpdate();
}, {passive:true});
stage.addEventListener('pointerleave', () => {pointerX=pointerY=0; scheduleUpdate();});
phone.addEventListener('pointerenter', () => {handlingPhone=true; scheduleUpdate();});
phone.addEventListener('pointerleave', () => {handlingPhone=false; scheduleUpdate();});
phone.addEventListener('focusin', () => {handlingPhone=true; scheduleUpdate();});
phone.addEventListener('focusout', event => {
  if (!phone.contains(event.relatedTarget)) {handlingPhone=false; scheduleUpdate();}
});

// Reveal supporting objects once; all copy and navigation are immediately readable.
const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    revealObserver.unobserve(entry.target);
    if (!effects) continue;
    const animation = entry.target.animate([
      {translate:'0 22px',opacity:.68}, {translate:'0 0',opacity:1},
    ], {duration:550,easing:'cubic-bezier(.2,.7,.2,1)'});
    revealAnimations.add(animation);
    animation.finished.finally(() => revealAnimations.delete(animation));
  }
}, {threshold:.12});
document.querySelectorAll('.chat-window,.crew-polaroid,.memory-polaroid,.name-tag').forEach(node=>revealObserver.observe(node));
paintChapter(phone.stage || 0);
applyPreferences();

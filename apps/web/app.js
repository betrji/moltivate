import './phone-demo.js';
import './club-board.js';
import './club-peek.js';
import './motion.js';

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const dialog = document.querySelector('#app-dialog');
const demo = document.querySelector('#demo');

function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
function openAppDialog() {
  closeMenu();
  if (!dialog.open) dialog.showModal();
}
document.querySelectorAll('[data-get-app]').forEach(button => button.addEventListener('click', openAppDialog));
document.addEventListener('moltivate:get-app', openAppDialog);
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
document.querySelector('#dialog-demo').addEventListener('click', () => {
  dialog.close();
  demo.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
  const phone = document.querySelector('moltivate-demo');
  phone?.focusDemo?.();
});

// Page motion is decorative; no network data, wallet requests, or tracking is used.
document.addEventListener('visibilitychange', () => {
  document.querySelector('.ethos-track').style.animationPlayState = document.hidden ? 'paused' : 'running';
});

// Duplicate decorative sponsor marks for a seamless loop; only the first group is focusable.
const sponsorTrack = document.querySelector('.sponsor-track');
const sponsorCopy = sponsorTrack.querySelector('.sponsor-group').cloneNode(true);
sponsorCopy.setAttribute('aria-hidden', 'true');
sponsorCopy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
sponsorTrack.append(sponsorCopy);
document.addEventListener('visibilitychange', () => {
  sponsorTrack.style.animationPlayState = document.hidden ? 'paused' : '';
});

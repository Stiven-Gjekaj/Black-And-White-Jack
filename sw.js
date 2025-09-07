const CACHE='bj-v2';
const ASSETS=[
  '/',
  'index.html',
  'styles.css',
  'js/main.js',
  'js/ui/Renderer.js',
  'js/ui/Controls.js',
  'js/ui/Animations.js',
  'js/ui/Settings.js',
  'js/game/BlackjackEngine.js',
  'js/game/Deck.js',
  'js/game/Chips.js',
  'js/game/AudioManager.js',
  'js/utils/helpers.js',
  'assets/cards/back.svg',
  'assets/icons/chip.svg',
  'assets/icons/sound.svg',
  'assets/icons/settings.svg',
  'assets/sfx/click.mp3',
  'assets/sfx/deal.mp3',
  'assets/sfx/win.mp3',
  'assets/sfx/lose.mp3'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k))))
  );
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

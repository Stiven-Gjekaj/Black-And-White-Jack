const CACHE='bj-v1';
const ASSETS=[
  '/',
  'index.html',
  'styles.css',
  'js/main.js',
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
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

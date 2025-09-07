import BlackjackEngine from './game/BlackjackEngine.js';
import AudioManager from './game/AudioManager.js';
import Animations from './ui/Animations.js';
import Renderer from './ui/Renderer.js';
import Controls from './ui/Controls.js';
import SettingsUI from './ui/Settings.js';

const engine=new BlackjackEngine();
const audio=new AudioManager();
const animations=new Animations();
const renderer=new Renderer(engine, animations, audio);
new Controls(engine, renderer, audio);
new SettingsUI(engine, renderer, animations, audio);
renderer.render();

// simple mobile detection for layout adjustments
function applyMobile(){
  const isMobile=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.innerWidth<=600;
  document.body.classList.toggle('mobile',isMobile);
}
applyMobile();
window.addEventListener('resize',applyMobile);

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js');
  });
}

import {loadFromStorage, saveToStorage} from '../utils/helpers.js';

export default class AudioManager {
  constructor(){
    this.enabled = loadFromStorage('soundEnabled', true);
    this.sounds={
      click: new Audio('assets/sfx/click.mp3'),
      deal: new Audio('assets/sfx/deal.mp3'),
      win: new Audio('assets/sfx/win.mp3'),
      lose: new Audio('assets/sfx/lose.mp3')
    };
    for(const a of Object.values(this.sounds)){
      a.preload='auto';
    }
  }

  toggle(){
    this.enabled=!this.enabled;
    saveToStorage('soundEnabled', this.enabled);
  }

  play(name){
    if(!this.enabled) return;
    const a=this.sounds[name];
    if(a){
      a.currentTime=0;
      a.play();
    }
  }
}

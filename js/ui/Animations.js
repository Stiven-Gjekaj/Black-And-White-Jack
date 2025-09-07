import {wait} from '../utils/helpers.js';

export default class Animations {
  constructor(settings={}){
    this.speed=settings.animationSpeed||'normal';
  }

  async dealCard(img){
    img.classList.add('deal');
    await wait(this.speed==='slow'?600:this.speed==='fast'?200:350);
    img.classList.remove('deal');
  }

  async flipCard(img){
    img.classList.add('flip');
    await wait(this.speed==='slow'?600:this.speed==='fast'?200:350);
    img.classList.remove('flip');
  }
}

import {RNG, loadFromStorage, saveToStorage} from '../utils/helpers.js';

const DEFAULT_SETTINGS = {
  decks: 6,
  penetration: 0.75
};

/** Represents a multi-deck shoe */
export default class Deck {
  constructor(settings={}){
    this.settings = {...DEFAULT_SETTINGS, ...loadFromStorage('tableSettings',{}), ...settings};
    this.shoe = [];
    this.discards = [];
    this.reset();
  }

  reset(){
    const {decks} = this.settings;
    const ranks=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const suits=['S','H','D','C'];
    this.shoe=[];
    for(let d=0; d<decks; d++){
      for(const s of suits){
        for(const r of ranks){
          this.shoe.push({rank:r,suit:s});
        }
      }
    }
    RNG.shuffle(this.shoe);
    this.cutIndex = Math.floor(this.shoe.length * this.settings.penetration);
  }

  /** Draw next card, reshuffling if cut card reached */
  draw(){
    if(this.shoe.length===0 || this.shoe.length<=this.shoe.length - this.cutIndex){
      this.reset();
    }
    return this.shoe.pop();
  }

  cardsRemaining(){
    return this.shoe.length;
  }
}

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
    this.totalCards = 0;
    this.reshuffleAt = 0; // reshuffle when remaining <= this value
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
    this.totalCards = this.shoe.length;
    // compute remaining threshold at which to reshuffle
    const penetration = this.settings.penetration;
    const remainingThreshold = Math.ceil(this.totalCards * (1 - penetration));
    this.reshuffleAt = Math.max(0, remainingThreshold);
  }

  /** Draw next card, reshuffling when remaining at/below threshold */
  draw(){
    if(this.shoe.length===0 || this.shoe.length<=this.reshuffleAt){
      this.reset();
    }
    return this.shoe.pop();
  }

  cardsRemaining(){
    return this.shoe.length;
  }
}

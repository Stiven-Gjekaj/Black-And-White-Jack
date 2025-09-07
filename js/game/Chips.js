import {loadFromStorage, saveToStorage, clamp} from '../utils/helpers.js';

const DENOMS=[1,5,25,100,500]; // dollars
const DEFAULT_BANKROLL=1000; // dollars

export default class Chips {
  constructor(){
    this.bankrollCents = loadFromStorage('bankroll', DEFAULT_BANKROLL*100);
    this.betCents = 0;
  }

  addBet(amount){
    const cents = amount*100;
    if(this.bankrollCents >= cents){
      this.bankrollCents -= cents;
      this.betCents += cents;
      saveToStorage('bankroll', this.bankrollCents);
      return true;
    }
    return false;
  }

  clearBet(){
    this.bankrollCents += this.betCents;
    this.betCents = 0;
    saveToStorage('bankroll', this.bankrollCents);
  }

  payout(mult){
    const win = Math.round(this.betCents * mult);
    this.bankrollCents += this.betCents + win;
    this.betCents = 0;
    saveToStorage('bankroll', this.bankrollCents);
    return win;
  }

  lose(){
    this.betCents = 0;
    saveToStorage('bankroll', this.bankrollCents);
  }

  get bankroll(){
    return this.bankrollCents;
  }

  get bet(){
    return this.betCents;
  }

  denominations(){
    return DENOMS;
  }
}

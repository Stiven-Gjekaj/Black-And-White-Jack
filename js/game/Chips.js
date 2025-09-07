import {loadFromStorage, saveToStorage, clamp} from '../utils/helpers.js';

const DENOMS=[1,5,25,100,500]; // dollars
const DEFAULT_BANKROLL=1000; // dollars

export default class Chips {
  constructor(){
    this.bankrollCents = loadFromStorage('bankroll', DEFAULT_BANKROLL*100);
    this.betCents = 0;
    this.lastBetCents = loadFromStorage('lastBet', 0);
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

  /**
   * Credit a win for a specific bet amount in cents.
   * mult is the profit multiplier (1 for even money, 1.5 for 3:2 blackjack, etc.)
   */
  win(betCents, mult=1){
    const profit = Math.round(betCents * mult);
    this.bankrollCents += betCents + profit;
    saveToStorage('bankroll', this.bankrollCents);
    return profit;
  }

  /** Return the bet amount for a push */
  push(betCents){
    this.bankrollCents += betCents;
    saveToStorage('bankroll', this.bankrollCents);
  }

  /** Record a loss for bookkeeping (bankroll unchanged). */
  lose(_betCents){
    // bankroll unchanged
    saveToStorage('bankroll', this.bankrollCents);
  }

  /** Store the last placed bet amount for quick rebet */
  recordLastBet(){
    this.lastBetCents = this.betCents;
    saveToStorage('lastBet', this.lastBetCents);
  }

  /** Attempt to rebet the previous round's stake. */
  rebet(){
    if(this.lastBetCents>0 && this.bankrollCents >= this.lastBetCents){
      this.bankrollCents -= this.lastBetCents;
      this.betCents += this.lastBetCents;
      saveToStorage('bankroll', this.bankrollCents);
      return true;
    }
    return false;
  }

  /** Reset bankroll to default or a specific amount (in dollars). */
  resetBankroll(amountDollars=DEFAULT_BANKROLL){
    this.bankrollCents = Math.round(amountDollars*100);
    this.betCents = 0;
    saveToStorage('bankroll', this.bankrollCents);
  }

  /** Add funds to bankroll without affecting current bet. amountDollars may be fractional. */
  addFunds(amountDollars){
    const cents = Math.round((Number(amountDollars)||0) * 100);
    if(cents <= 0) return false;
    this.bankrollCents += cents;
    saveToStorage('bankroll', this.bankrollCents);
    return true;
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

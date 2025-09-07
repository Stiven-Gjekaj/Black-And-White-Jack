import Deck from './Deck.js';
import Chips from './Chips.js';
import {loadFromStorage, saveToStorage} from '../utils/helpers.js';

export const States = {
  IDLE:'IDLE',
  BETTING:'BETTING',
  DEALING:'DEALING',
  PLAYER:'PLAYER',
  DEALER:'DEALER',
  SETTLE:'SETTLE'
};

const DEFAULT_SETTINGS={
  dealerHitsSoft17:false,
  blackjackPays:"3:2",
  allowSurrender:true
};

export default class BlackjackEngine{
  constructor(settings={}){
    this.settings={...DEFAULT_SETTINGS,...loadFromStorage('tableSettings',{}),...settings};
    this.deck=new Deck(this.settings);
    this.chips=new Chips();
    this.state=States.BETTING;
    this.hands=[]; // player hands
    this.dealer=[];
  }

  /** Start a round once bet is placed */
  startRound(){
    if(this.chips.bet<=0) return false;
    this.state=States.DEALING;
    this.hands=[{cards:[this.deck.draw(), this.deck.draw()], bet:this.chips.bet, doubled:false, surrendered:false}];
    this.dealer=[this.deck.draw(), this.deck.draw()];
    // natural blackjack check
    if(this.isBlackjack(this.hands[0].cards) || this.isBlackjack(this.dealer)){
      this.state=States.SETTLE;
      return this.settle();
    }
    this.state=States.PLAYER;
    return true;
  }

  currentHand(index=0){
    return this.hands[index];
  }

  hit(index=0){
    if(this.state!==States.PLAYER) return;
    const hand=this.hands[index];
    hand.cards.push(this.deck.draw());
    if(this.handValue(hand.cards).total>21){
      hand.bust=true;
      this.nextHand();
    }
  }

  stand(index=0){
    if(this.state!==States.PLAYER) return;
    this.currentHand(index).stand=true;
    this.nextHand();
  }

  double(index=0){
    if(this.state!==States.PLAYER) return false;
    const hand=this.hands[index];
    if(this.chips.bankroll < hand.bet) return false;
    this.chips.addBet(hand.bet/100); // deduct same amount
    hand.bet*=2;
    hand.doubled=true;
    this.hit(index);
    this.stand(index);
    return true;
  }

  split(index=0){
    const hand=this.hands[index];
    if(hand.cards.length!==2) return false;
    if(hand.cards[0].rank!==hand.cards[1].rank) return false;
    if(this.hands.length>=4) return false; // max 3 splits -> 4 hands
    if(this.chips.bankroll < hand.bet) return false;
    // create two hands
    const card2=hand.cards.pop();
    const newHand={cards:[card2], bet:hand.bet, doubled:false, surrendered:false};
    hand.cards=[hand.cards[0]];
    hand.cards.push(this.deck.draw());
    newHand.cards.push(this.deck.draw());
    this.hands.splice(index+1,0,newHand);
    this.chips.addBet(hand.bet/100);
    return true;
  }

  surrender(index=0){
    if(!this.settings.allowSurrender||this.state!==States.PLAYER) return false;
    const hand=this.hands[index];
    hand.surrendered=true;
    hand.stand=true;
    this.chips.bankrollCents += hand.bet/2;
    hand.bet = hand.bet/2;
    this.nextHand();
    return true;
  }

  nextHand(){
    if(this.hands.every(h=>h.bust||h.stand||h.surrendered)){
      this.state=States.DEALER;
      this.dealerPlay();
    }
  }

  dealerPlay(){
    while(this.handValue(this.dealer).total < 17 || (this.handValue(this.dealer).total===17 && this.handValue(this.dealer).soft && this.settings.dealerHitsSoft17)){
      this.dealer.push(this.deck.draw());
    }
    this.state=States.SETTLE;
    return this.settle();
  }

  settle(){
    const dealerVal=this.handValue(this.dealer);
    const results=[];
    for(const hand of this.hands){
      const playerVal=this.handValue(hand.cards);
      let outcome=0; // -1 lose, 0 push, 1 win
      if(hand.surrendered){
        outcome=-0.5;
      } else if(hand.bust){
        outcome=-1;
      } else if(dealerVal.total>21 || playerVal.total>dealerVal.total){
        outcome=1;
      } else if(playerVal.total<dealerVal.total){
        outcome=-1;
      } else {
        outcome=0;
      }
      results.push(outcome);
      if(outcome>0){
        const mult = this.isBlackjack(hand.cards) ? (this.settings.blackjackPays==='3:2'?1.5:1.2) : 1;
        this.chips.payout(mult);
      } else if(outcome===0){
        this.chips.bankrollCents += hand.bet; // return bet
        this.chips.betCents = 0;
      } else if(outcome<0){
        this.chips.lose();
      }
    }
    this.state=States.BETTING;
    this.hands=[];
    this.dealer=[];
    return results;
  }

  handValue(cards){
    let total=0; let aces=0;
    for(const c of cards){
      if(c.rank==='A'){aces++; total+=11;} else if(['K','Q','J','10'].includes(c.rank)){total+=10;} else {total+=Number(c.rank);} }
    while(total>21 && aces>0){ total-=10; aces--; }
    return {total, soft:aces>0};
  }

  isBlackjack(cards){
    return cards.length===2 && this.handValue(cards).total===21;
  }
}

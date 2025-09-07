import {formatCurrency} from '../utils/helpers.js';

export default class Renderer {
  constructor(engine, animations, audio){
    this.engine=engine;
    this.animations=animations;
    this.audio=audio;
    this.root=document.getElementById('game');
    this.playerArea=document.getElementById('player-area');
    this.dealerArea=document.getElementById('dealer-area');
    this.bankrollEl=document.getElementById('bankroll');
    this.betEl=document.getElementById('bet');
    this.toastEl=document.getElementById('toast');
  }

  updateHUD(){
    this.bankrollEl.textContent=`Bankroll: ${formatCurrency(this.engine.chips.bankroll)}`;
    this.betEl.textContent=`Bet: ${formatCurrency(this.engine.chips.bet)}`;
  }

  render(){
    this.updateHUD();
    this.playerArea.innerHTML='';
    this.dealerArea.innerHTML='';
    this.engine.hands.forEach((h,idx)=>{
      const handDiv=document.createElement('div');
      handDiv.className='hand';
      handDiv.dataset.index = String(idx);
      for(const c of h.cards){
        const img=document.createElement('img');
        img.src=`assets/cards/${c.rank}${c.suit}.svg`;
        img.className='card';
        img.alt=`${c.rank} of ${c.suit}`;
        handDiv.appendChild(img);
      }
      this.playerArea.appendChild(handDiv);
    });
    const dealerDiv=document.createElement('div');
    dealerDiv.className='hand';
    this.engine.dealer.forEach((c,i)=>{
      const img=document.createElement('img');
      img.src= i===1 && this.engine.state==="PLAYER" ? 'assets/cards/back.svg' : `assets/cards/${c.rank}${c.suit}.svg`;
      img.className='card';
      img.alt= i===1 && this.engine.state==="PLAYER" ? 'Face down' : `${c.rank} of ${c.suit}`;
      dealerDiv.appendChild(img);
    });
    this.dealerArea.appendChild(dealerDiv);
  }

  showToast(msg){
    this.toastEl.textContent=msg;
    this.toastEl.classList.add('show');
    setTimeout(()=>this.toastEl.classList.remove('show'),1500);
  }

  revealDealerHole(card){
    // flip the dealer's second card if present, optionally swapping from back to actual card
    const dealerHand = this.dealerArea.querySelector('.hand');
    if(!dealerHand) return;
    const imgs = dealerHand.querySelectorAll('img.card');
    if(imgs.length<2) return;
    const hole = imgs[1];
    const isBack = /back\.svg$/.test(hole.src);
    const finalSrc = card ? `assets/cards/${card.rank}${card.suit}.svg` : hole.src;
    // if not back, briefly show back then flip to create an effect
    if(!isBack && card){
      hole.src = 'assets/cards/back.svg';
    }
    // swap to real face mid-flip
    setTimeout(()=>{ hole.src = finalSrc; hole.alt = `${card?.rank||''} of ${card?.suit||''}`.trim(); }, 140);
    this.animations.flipCard(hole);
    this.audio.play('deal');
  }

  showResults(summary){
    // add badges to each player hand
    const handsEls = this.playerArea.querySelectorAll('.hand');
    handsEls.forEach((el,idx)=>{
      const outcome = summary.outcomes[idx];
      const badge = document.createElement('div');
      badge.className='badge';
      if(outcome>0){ badge.classList.add('win'); badge.textContent='Win'; }
      else if(outcome===0){ badge.classList.add('push'); badge.textContent='Push'; }
      else if(outcome===-0.5){ badge.classList.add('surrender'); badge.textContent='Surrender'; }
      else { badge.classList.add('loss'); badge.textContent='Loss'; }
      el.appendChild(badge);
      setTimeout(()=> badge.remove(), 1600);
    });
  }
}

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
    for(const h of this.engine.hands){
      const handDiv=document.createElement('div');
      handDiv.className='hand';
      for(const c of h.cards){
        const img=document.createElement('img');
        img.src=`assets/cards/${c.rank}${c.suit}.svg`;
        img.className='card';
        handDiv.appendChild(img);
      }
      this.playerArea.appendChild(handDiv);
    }
    const dealerDiv=document.createElement('div');
    dealerDiv.className='hand';
    this.engine.dealer.forEach((c,i)=>{
      const img=document.createElement('img');
      img.src= i===1 && this.engine.state==="PLAYER" ? 'assets/cards/back.svg' : `assets/cards/${c.rank}${c.suit}.svg`;
      img.className='card';
      dealerDiv.appendChild(img);
    });
    this.dealerArea.appendChild(dealerDiv);
  }

  showToast(msg){
    this.toastEl.textContent=msg;
    this.toastEl.classList.add('show');
    setTimeout(()=>this.toastEl.classList.remove('show'),1500);
  }
}

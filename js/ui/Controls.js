export default class Controls {
  constructor(engine, renderer, audio){
    this.engine=engine;
    this.renderer=renderer;
    this.audio=audio;
    this.controls=document.getElementById('controls');
    this.chipRack=document.getElementById('chip-rack');
    this.init();
  }

  init(){
    // create chip buttons
    this.engine.chips.denominations().forEach(v=>{
      const b=document.createElement('button');
      b.textContent=`$${v}`;
      b.className='chip-btn';
      b.title=`Add $${v}`;
      b.addEventListener('click',()=>{
        if(this.engine.state!=="BETTING") return;
        if(this.engine.chips.addBet(v)){
          this.renderer.updateHUD();
          this.audio.play('click');
          this.updateButtons();
        } else {
          this.renderer.showToast('Insufficient funds');
        }
      });
      this.chipRack.appendChild(b);
    });
    // bet utility buttons
    const clearBtn=this.makeBtn('Clear Bet',()=>{ if(this.engine.state!=="BETTING") return; this.engine.chips.clearBet(); this.renderer.updateHUD(); this.updateButtons(); });
    const rebetBtn=this.makeBtn('Rebet',()=>{ if(this.engine.state!=="BETTING") return; if(!this.engine.chips.rebet()){ this.renderer.showToast('Not enough bankroll'); } this.renderer.updateHUD(); this.updateButtons(); });
    clearBtn.classList.add('secondary');
    rebetBtn.classList.add('secondary');
    this.chipRack.appendChild(clearBtn);
    this.chipRack.appendChild(rebetBtn);
    // action buttons
    this.dealBtn=this.makeBtn('Deal (D)',()=>{
      const res=this.engine.startRound();
      if(res===true){
        this.audio.play('deal');
        this.renderAndSync();
      } else if(res && res.outcomes){
        // natural result (blackjack or dealer blackjack)
        this.renderAndSync();
        this.showRoundSummary(res);
      }
    });
    this.hitBtn=this.makeBtn('Hit (H)',()=>{
      this.engine.hit();
      this.audio.play('deal');
      // if bust, show toast immediately
      const hand=this.engine.hands[0];
      if(hand && hand.bust){ this.renderer.showToast('Bust!'); }
      this.renderAndCheckRoundEnd();
    });
    this.standBtn=this.makeBtn('Stand (S)',()=>{ this.engine.stand(); this.renderAndCheckRoundEnd(); });
    this.doubleBtn=this.makeBtn('Double (B)',()=>{ if(this.engine.double()){ this.audio.play('deal'); } else { this.renderer.showToast('Cannot double'); } this.renderAndCheckRoundEnd(); });
    this.splitBtn=this.makeBtn('Split (X)',()=>{ if(this.engine.split()){ this.audio.play('deal'); } else { this.renderer.showToast('Cannot split'); } this.renderAndSync(); });
    this.surrenderBtn=this.makeBtn('Surrender (U)',()=>{ if(this.engine.surrender()){ this.renderer.showToast('Surrendered'); } this.renderAndCheckRoundEnd(); });
    this.controls.append(this.dealBtn,this.hitBtn,this.standBtn,this.doubleBtn,this.splitBtn,this.surrenderBtn);
    document.addEventListener('keydown',e=>{
      switch(e.key.toLowerCase()){
        case 'h': this.hitBtn.click(); break;
        case 's': this.standBtn.click(); break;
        case 'd': this.dealBtn.click(); break;
        case 'b': this.doubleBtn.click(); break;
        case 'x': this.splitBtn.click(); break;
        case 'u': this.surrenderBtn.click(); break;
        case 'm': this.audio.toggle(); this.renderer.showToast(this.audio.enabled? 'Sound on' : 'Sound off'); break;
      }
    });
    this.updateButtons();
  }

  makeBtn(label,fn){
    const b=document.createElement('button');
    b.textContent=label;
    b.addEventListener('click',fn);
    return b;
  }

  renderAndSync(){
    this.renderer.render();
    this.renderer.updateHUD();
    this.updateButtons();
  }

  renderAndCheckRoundEnd(){
    // if the engine moved to dealer/settle and completed, a summary will be present
    if(this.engine.lastResults && this.engine.state==='BETTING'){
      const res=this.engine.lastResults;
      this.renderAndSync();
      this.showRoundSummary(res);
      this.engine.lastResults=null;
    } else {
      this.renderAndSync();
    }
  }

  showRoundSummary(summary){
    const wins = summary.outcomes.filter(o=>o>0).length;
    const pushes = summary.outcomes.filter(o=>o===0).length;
    const losses = summary.outcomes.filter(o=>o<0).length;
    const parts=[];
    if(wins) parts.push(`${wins} win${wins>1?'s':''}`);
    if(pushes) parts.push(`${pushes} push${pushes>1?'es':''}`);
    if(losses) parts.push(`${losses} loss${losses>1?'es':''}`);
    const msg = parts.length? parts.join(', ') : 'Round complete';
    // small reveal effect on dealer hole card
    this.renderer.revealDealerHole(summary.dealer.cards[1]);
    this.renderer.showResults(summary);
    this.renderer.showToast(msg);
    if(wins>0 && losses===0) this.audio.play('win');
    if(losses>0 && wins===0) this.audio.play('lose');
  }

  updateButtons(){
    const state=this.engine.state;
    const bet=this.engine.chips.bet;
    const canDeal = state==='BETTING' && bet>0;
    const inPlayer = state==='PLAYER';
    const hand=this.engine.hands[0];
    const canDouble = inPlayer && hand && hand.cards.length===2 && !hand.doubled && !hand.surrendered && (this.engine.chips.bankroll >= hand.bet);
    const canSplit = inPlayer && hand && hand.cards.length===2 && hand.cards[0].rank===hand.cards[1].rank && this.engine.hands.length<4 && (this.engine.chips.bankroll >= hand.bet);
    const canSurrender = inPlayer && hand && hand.cards.length===2 && this.engine.settings.allowSurrender;

    this.dealBtn.disabled = !canDeal;
    this.hitBtn.disabled = !inPlayer;
    this.standBtn.disabled = !inPlayer;
    this.doubleBtn.disabled = !canDouble;
    this.splitBtn.disabled = !canSplit;
    this.surrenderBtn.disabled = !canSurrender;
  }
}

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
      b.textContent=v;
      b.className='chip-btn';
      b.addEventListener('click',()=>{this.engine.chips.addBet(v);this.renderer.updateHUD();});
      this.chipRack.appendChild(b);
    });
    // action buttons
    this.dealBtn=this.makeBtn('Deal',()=>{if(this.engine.startRound()){this.audio.play('deal');this.renderer.render();}});
    this.hitBtn=this.makeBtn('Hit',()=>{this.engine.hit();this.audio.play('deal');this.renderer.render();});
    this.standBtn=this.makeBtn('Stand',()=>{this.engine.stand();this.renderer.render();});
    this.doubleBtn=this.makeBtn('Double',()=>{if(this.engine.double()){this.audio.play('deal');this.renderer.render();}});
    this.splitBtn=this.makeBtn('Split',()=>{if(this.engine.split()){this.audio.play('deal');this.renderer.render();}});
    this.surrenderBtn=this.makeBtn('Surrender',()=>{if(this.engine.surrender()){this.renderer.render();}});
    this.controls.append(this.dealBtn,this.hitBtn,this.standBtn,this.doubleBtn,this.splitBtn,this.surrenderBtn);
    document.addEventListener('keydown',e=>{
      switch(e.key.toLowerCase()){
        case 'h': this.hitBtn.click(); break;
        case 's': this.standBtn.click(); break;
        case 'd': this.dealBtn.click(); break;
        case 'b': this.doubleBtn.click(); break;
        case 'x': this.splitBtn.click(); break;
        case 'u': this.surrenderBtn.click(); break;
        case 'm': this.audio.toggle(); break;
      }
    });
  }

  makeBtn(label,fn){
    const b=document.createElement('button');
    b.textContent=label;
    b.addEventListener('click',fn);
    return b;
  }
}

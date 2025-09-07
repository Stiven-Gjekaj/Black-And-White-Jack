import {loadFromStorage, saveToStorage} from '../utils/helpers.js';

export default class SettingsUI{
  constructor(engine, renderer, animations, audio){
    this.engine=engine;
    this.renderer=renderer;
    this.animations=animations;
    this.audio=audio;
    this.settings = {...loadFromStorage('tableSettings', {}), ...engine.settings};
    this.mount();
  }

  mount(){
    const hud=document.getElementById('hud');
    const wrap=document.createElement('div');
    wrap.style.marginLeft='8px';
    // sound toggle
    const soundBtn=document.createElement('button');
    soundBtn.title='Toggle sound (M)';
    soundBtn.textContent=this.audio.enabled?'🔊':'🔈';
    soundBtn.style.padding='6px 10px';
    soundBtn.style.borderRadius='8px';
    soundBtn.addEventListener('click',()=>{
      this.audio.toggle();
      soundBtn.textContent=this.audio.enabled?'🔊':'🔈';
      this.renderer.showToast(this.audio.enabled? 'Sound on' : 'Sound off');
    });
    wrap.appendChild(soundBtn);

    // settings button
    const btn=document.createElement('button');
    btn.title='Settings';
    btn.textContent='⚙️';
    btn.style.padding='6px 10px';
    btn.style.marginLeft='6px';
    btn.style.borderRadius='8px';
    btn.addEventListener('click',()=>this.togglePanel());
    wrap.appendChild(btn);

    // add funds button
    const addBtn=document.createElement('button');
    addBtn.title='Add funds to bankroll';
    addBtn.textContent='Add Funds';
    addBtn.style.padding='6px 10px';
    addBtn.style.marginLeft='6px';
    addBtn.style.borderRadius='8px';
    addBtn.addEventListener('click',()=>{
      const input = prompt('Add funds (in dollars):', '100');
      if(input===null) return; // cancelled
      const amount = parseFloat(String(input).trim());
      if(!isFinite(amount) || amount<=0){
        this.renderer.showToast('Enter a valid amount');
        return;
      }
      if(this.engine.chips.addFunds(amount)){
        this.renderer.updateHUD();
        this.renderer.showToast(`Added $${amount.toFixed(2)}`);
      } else {
        this.renderer.showToast('Unable to add funds');
      }
    });
    wrap.appendChild(addBtn);
    hud.appendChild(wrap);

    // panel
    this.panel=document.createElement('div');
    this.panel.style.position='fixed';
    this.panel.style.top='64px';
    this.panel.style.right='16px';
    this.panel.style.width='280px';
    this.panel.style.padding='12px';
    this.panel.style.borderRadius='12px';
    this.panel.style.background='rgba(0,0,0,0.8)';
    this.panel.style.border='1px solid rgba(255,255,255,0.15)';
    this.panel.style.boxShadow='0 8px 30px rgba(0,0,0,0.35)';
    this.panel.style.backdropFilter='blur(6px)';
    this.panel.style.color='white';
    this.panel.style.display='none';
    this.panel.setAttribute('role','dialog');
    this.panel.setAttribute('aria-label','Table settings');

    this.panel.innerHTML=`
      <div style="font-weight:700;margin-bottom:8px">Settings</div>
      <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <span>Dealer hits soft 17</span>
        <input type="checkbox" id="s17">
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <span>Blackjack pays</span>
        <select id="bjp">
          <option value="3:2">3:2</option>
          <option value="6:5">6:5</option>
        </select>
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <span>Decks</span>
        <input id="decks" type="number" min="1" max="8" step="1" style="width:64px">
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <span>Animation speed</span>
        <select id="anim">
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </label>
      <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end">
        <button id="resetBR" style="background:#7a1d1d;color:#fff;border-radius:8px;padding:6px 10px">Reset Bankroll</button>
        <button id="save" style="background:#1f644a;color:#fff;border-radius:8px;padding:6px 10px">Save</button>
      </div>
    `;
    document.body.appendChild(this.panel);

    // set initial values
    this.panel.querySelector('#s17').checked=!!this.engine.settings.dealerHitsSoft17;
    this.panel.querySelector('#bjp').value=this.engine.settings.blackjackPays;
    this.panel.querySelector('#decks').value=this.engine.settings.decks || 6;
    this.panel.querySelector('#anim').value=this.animations.speed || 'normal';

    this.panel.querySelector('#save').addEventListener('click',()=>this.save());
    this.panel.querySelector('#resetBR').addEventListener('click',()=>{
      this.engine.chips.resetBankroll();
      this.renderer.updateHUD();
      this.renderer.showToast('Bankroll reset');
    });
  }

  togglePanel(){
    this.panel.style.display = this.panel.style.display==='none' ? 'block' : 'none';
  }

  save(){
    const s17=this.panel.querySelector('#s17').checked;
    const bjp=this.panel.querySelector('#bjp').value;
    const decks=parseInt(this.panel.querySelector('#decks').value||'6',10);
    const anim=this.panel.querySelector('#anim').value;
    const tableSettings={...this.engine.settings, dealerHitsSoft17:s17, blackjackPays:bjp, decks};
    saveToStorage('tableSettings', tableSettings);
    this.engine.settings = tableSettings;
    // reset deck to apply settings
    this.engine.deck = new (this.engine.deck.constructor)(this.engine.settings);
    // update animations
    this.animations.speed = anim;
    this.renderer.showToast('Settings saved');
    this.togglePanel();
  }
}

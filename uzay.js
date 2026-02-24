(function(){
"use strict";

const KELIMELER = [
  {k:'BALIK', e:'🐟'}, {k:'GÜNEŞ', e:'☀️'}, {k:'ARABA', e:'🚗'},
  {k:'ELMA', e:'🍎'}, {k:'KÖPEK', e:'🐶'}, {k:'UÇAK', e:'✈️'},
  {k:'ZÜRAFA', e:'🦒'}, {k:'ÇİLEK', e:'🍓'}, {k:'GEMİ', e:'🚢'}
];

let soruIdx=0, puan=0, dogruSayaci=0, audioCtx=null, kilit = false;
const alan=document.getElementById('uzayAlan'), puanEl=document.getElementById('uzayScore');

function initAudio() { 
    if(!audioCtx) audioCtx = new(window.AudioContext||window.webkitAudioContext)(); 
    if(audioCtx.state === 'suspended') audioCtx.resume();
}

function render(){
  if(!alan) return;
  const s = KELIMELER[soruIdx % KELIMELER.length];
  const secenekSayisi = soruIdx >= 3 ? 3 : 2;
  
  let secenekler = [s.k];
  while(secenekler.length < secenekSayisi){
      let y = KELIMELER[Math.floor(Math.random()*KELIMELER.length)].k;
      if(!secenekler.includes(y)) secenekler.push(y);
  }
  secenekler = shuffle(secenekler);

  alan.innerHTML = `
    <div style="text-align:center; color:#fff; padding:10px; user-select:none;">
        <div style="font-size:4rem; margin-bottom:5px;">${s.e}</div>
        <div style="display:inline-block; padding:4px 12px; background:rgba(255,215,0,0.1); border-radius:20px; border:1px solid rgba(255,215,0,0.3); font-size:0.9rem; color:#ffd700; font-weight:bold;">
            ${3 - dogruSayaci} MANEVRA KALDI
        </div>
    </div>
    <div style="height:240px; position:relative; overflow:hidden; background:rgba(255,255,255,0.03); border-radius:20px; margin:10px 0;">
        <div id="uzayGemi" class="gemi-baz">🚀</div>
        <div id="ates" class="ates-baz">🔥</div>
    </div>
    <div id="butonlar" style="display:flex; justify-content:center; gap:12px; padding:0 10px;">
        ${secenekler.map(metin => `
            <button class="uzay-btn" onclick="uzayKontrol('${metin}', this)" 
                style="flex:1; padding:18px 5px; font-size:1rem; font-weight:bold; cursor:pointer; border-radius:18px; border:2px solid #fff; background:transparent; color:#fff;">
                ${metin}
            </button>
        `).join('')}
    </div>
  `;
  kilit = false;
}

window.uzayKontrol = (secilen, btn) => {
    if(kilit) return;
    initAudio();
    const s = KELIMELER[soruIdx % KELIMELER.length];
    const gemi = document.getElementById('uzayGemi');
    const ates = document.getElementById('ates');

    if(secilen === s.k){
        kilit = true;
        dogruSayaci++;
        puan += 20;
        if(puanEl) puanEl.textContent = puan;
        btn.style.background = "#4CAF50";

        if(dogruSayaci >= 3){
            ates.style.display = "block";
            gemi.classList.add('firlat-anim'); // CSS Sınıfı ile tetikleme
            playLaunchSound();
            dogruSayaci = 0; 
            setTimeout(() => { soruIdx++; render(); }, 2000);
        } else {
            gemi.classList.add('sicra-anim'); // CSS Sınıfı ile tetikleme
            playTone(600, 0.1);
            setTimeout(() => { soruIdx++; render(); }, 650);
        }
    } else {
        btn.style.background = "#f44336";
        gemi.classList.add('shake-anim');
        playTone(200, 0.2);
        setTimeout(() => { 
            gemi.classList.remove('shake-anim'); 
            btn.style.background = "transparent"; 
        }, 400);
    }
};

function playTone(f, d) { if(!audioCtx) return; const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.frequency.setValueAtTime(f, audioCtx.currentTime); g.gain.setValueAtTime(0.1, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + d); o.start(); o.stop(audioCtx.currentTime + d); }
function playLaunchSound(){ if(!audioCtx) return; const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.frequency.setValueAtTime(100, audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 1.8); g.gain.setValueAtTime(0.2, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.8); o.start(); o.stop(audioCtx.currentTime + 1.8); }
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
window.uzayBas = () => { soruIdx=0; dogruSayaci=0; puan=0; render(); };
window.uzayBas();

// GARANTİ ANİMASYON CSS'LERİ
const st=document.createElement('style');
st.innerHTML=`
  .gemi-baz { font-size: 4.5rem; position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); z-index: 100; }
  .ates-baz { display: none; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 3rem; animation: atesYan 0.1s infinite; }
  
  .firlat-anim { animation: firlat 2s forwards ease-in !important; }
  .sicra-anim { animation: sicra 0.6s ease-out !important; }
  .shake-anim { animation: shake 0.4s !important; }

  @keyframes firlat {
    0% { bottom: 15px; transform: translateX(-50%) scale(1); }
    100% { bottom: 600px; transform: translateX(-50%) scale(2); opacity: 0; }
  }
  @keyframes sicra {
    0%, 100% { bottom: 15px; }
    50% { bottom: 60px; }
  }
  @keyframes shake {
    0%, 100% { left: 50%; }
    25% { left: 48%; }
    75% { left: 52%; }
  }
  @keyframes atesYan {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.3); }
  }
`;
document.head.appendChild(st);
})();

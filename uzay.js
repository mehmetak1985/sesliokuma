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
        <div style="font-size:clamp(3.5rem, 10vw, 4.5rem); margin-bottom:5px; animation:pop 0.5s;">${s.e}</div>
        <div style="display:inline-block; padding:4px 12px; background:rgba(255,215,0,0.1); border-radius:20px; border:1px solid rgba(255,215,0,0.3); font-size:0.9rem; color:#ffd700; font-weight:bold; letter-spacing:1px;">
            ${3 - dogruSayaci} MANEVRA KALDI
        </div>
    </div>
    <div style="height:240px; position:relative; overflow:hidden; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.05) 100%); border-radius:20px; margin:10px 0;">
        <div id="uzayGemi" style="font-size:4.5rem; position:absolute; bottom:15px; left:50%; transform:translateX(-50%); z-index:100; transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); filter:drop-shadow(0 0 10px rgba(255,255,255,0.5));">🚀</div>
        <div id="ates" style="display:none; position:absolute; bottom:0; left:50%; transform:translateX(-50%); font-size:3rem; animation:atesYan 0.1s infinite;">🔥</div>
    </div>
    <div id="butonlar" style="display:flex; justify-content:center; gap:12px; padding:0 10px;">
        ${secenekler.map(metin => `
            <button class="uzay-btn" onclick="uzayKontrol('${metin}', this)" 
                style="flex:1; padding:18px 5px; font-size:1rem; font-weight:bold; cursor:pointer; border-radius:18px; border:2px solid rgba(255,255,255,0.6); background:rgba(255,255,255,0.05); color:#fff; transition:0.2s; touch-action:manipulation;">
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
        btn.style.background = "rgba(76, 175, 80, 0.8)";
        btn.style.borderColor = "#4CAF50";

        if(dogruSayaci >= 3){
            ates.style.display = "block";
            // Engine Room: Animasyon tetikleme garantisi
            requestAnimationFrame(() => {
                setTimeout(() => {
                    gemi.style.transition = "all 1.8s ease-in";
                    gemi.style.bottom = "600px";
                    gemi.style.transform = "translateX(-50%) scale(1.8)";
                    playLaunchSound();
                }, 100);
            });

            dogruSayaci = 0; 
            setTimeout(() => { soruIdx++; render(); }, 2000);
        } else {
            gemi.style.bottom = "80px";
            playTone(600, 0.1);
            setTimeout(() => { soruIdx++; render(); }, 700);
        }
    } else {
        btn.style.background = "rgba(244, 67, 54, 0.6)";
        btn.style.borderColor = "#f44336";
        gemi.style.animation = "shake 0.4s";
        playTone(200, 0.2);
        setTimeout(() => { 
            gemi.style.animation = ""; 
            btn.style.background = "rgba(255,255,255,0.05)"; 
            btn.style.borderColor = "rgba(255,255,255,0.6)";
        }, 400);
    }
};

function playTone(f, d) {
    if(!audioCtx) return;
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.setValueAtTime(f, audioCtx.currentTime);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + d);
    o.start(); o.stop(audioCtx.currentTime + d);
}

function playLaunchSound(){
    if(!audioCtx) return;
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.setValueAtTime(100, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 1.8);
    g.gain.setValueAtTime(0.2, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.8);
    o.start(); o.stop(audioCtx.currentTime + 1.8);
}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
window.uzayBas = () => { soruIdx=0; dogruSayaci=0; puan=0; render(); };
window.uzayBas();

const st=document.createElement('style');
st.innerHTML=`
  @keyframes shake{0%,100%{left:50%} 25%{left:48%} 75%{left:52%}}
  @keyframes atesYan{0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.2)}}
  @keyframes pop{0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1}}
  .uzay-btn:active{transform:scale(0.95);}
`;
document.head.appendChild(st);
})();

(function(){
"use strict";

const KELIMELER = [
  {k:'BALIK', e:'🐟'}, {k:'GÜNEŞ', e:'☀️'}, {k:'ARABA', e:'🚗'},
  {k:'ELMA', e:'🍎'}, {k:'KÖPEK', e:'🐶'}, {k:'UÇAK', e:'✈️'},
  {k:'ZÜRAFA', e:'🦒'}, {k:'ÇİLEK', e:'🍓'}, {k:'GEMİ', e:'🚢'}
];

let soruIdx=0, puan=0, dogruSayaci=0, audioCtx=null, kilit = false;
const alan=document.getElementById('uzayAlan'), puanEl=document.getElementById('uzayScore');

// ANALİZ 1: Ses Bağlamı Yönetimi (Sürekli Resume İhtiyacı)
function initAudio() { 
    if(!audioCtx) audioCtx = new(window.AudioContext||window.webkitAudioContext)(); 
    if(audioCtx.state === 'suspended') audioCtx.resume();
}

function render(){
  if(!alan) return;
  // ANALİZ 2: Dizi Sınırı Kontrolü (Güvenli Erişim)
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
        <div style="font-size:clamp(3.5rem, 10vw, 5rem); animation:pop 0.5s;">${s.e}</div>
        <div style="font-size:1.1rem; color:#00f2ff; font-weight:bold; text-shadow:0 0 5px #00f2ff;">
            ${3 - dogruSayaci} BAŞARILI MANEVRA KALDI
        </div>
    </div>
    <div style="height:240px; position:relative; overflow:hidden; background:radial-gradient(circle at bottom, #1b2735 0%, transparent 70%); border-radius:20px; margin:15px 0;">
        <div id="uzayGemi" style="font-size:4.5rem; position:absolute; bottom:10px; left:50%; transform:translateX(-50%); z-index:10; filter:drop-shadow(0 0 15px #fff); transition: bottom 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">🚀</div>
        <div id="ates" style="display:none; position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); font-size:3rem; animation:atesYan 0.15s infinite;">🔥</div>
    </div>
    <div id="butonlar" style="display:flex; justify-content:center; gap:12px; padding:0 10px;">
        ${secenekler.map(metin => `
            <button class="uzay-btn" onclick="uzayKontrol('${metin}', this)" 
                style="flex:1; padding:18px 5px; font-size:1.1rem; font-weight:bold; cursor:pointer; border-radius:18px; border:2px solid #fff; background:rgba(255,255,255,0.05); color:#fff; transition:0.3s; touch-action:manipulation;">
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
        puan += 25;
        if(puanEl) puanEl.textContent = puan;
        
        btn.style.background = "#00c853";
        btn.style.borderColor = "#00c853";
        btn.style.boxShadow = "0 0 20px #00c853";

        if(dogruSayaci >= 3){
            ates.style.display = "block";
            gemi.style.transition = "bottom 2s ease-in, transform 2s ease-in";
            gemi.style.bottom = "600px";
            gemi.style.transform = "translateX(-50%) scale(0.5)";
            playLaunchSound();
            dogruSayaci = 0;
            setTimeout(() => { soruIdx++; render(); }, 2100);
        } else {
            gemi.style.bottom = "80px";
            playTone(600, 0.15);
            setTimeout(() => { soruIdx++; render(); }, 800);
        }
    } else {
        // ANALİZ 3: Yanlış Cevapta Görsel Geri Bildirim
        playTone(150, 0.3);
        btn.style.background = "#ff1744";
        btn.style.borderColor = "#ff1744";
        btn.style.animation = "shakeBtn 0.4s";
        gemi.style.animation = "shake 0.4s";
        setTimeout(() => {
            btn.style.animation = "";
            gemi.style.animation = "";
            btn.style.background = "rgba(255,255,255,0.05)";
            btn.style.borderColor = "#fff";
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
    o.type = 'sawtooth'; // Daha motor benzeri bir ses
    o.frequency.setValueAtTime(80, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 1.8);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
    o.start(); o.stop(audioCtx.currentTime + 1.8);
}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
window.uzayBas = () => { soruIdx=0; dogruSayaci=0; puan=0; if(puanEl) puanEl.textContent=0; render(); };
window.uzayBas();

const st=document.createElement('style');
st.innerHTML=`
  @keyframes shake{0%,100%{left:50%} 25%{left:47%} 75%{left:53%}}
  @keyframes shakeBtn{0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)}}
  @keyframes pop{0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1}}
  @keyframes atesYan{0%,100%{transform:translateX(-50%) scale(1); opacity:0.8} 50%{transform:translateX(-50%) scale(1.3); opacity:1}}
  .uzay-btn:active{transform:scale(0.95); transition: 0.1s;}
`;
document.head.appendChild(st);
})();

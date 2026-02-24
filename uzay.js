(function(){
"use strict";

const SORULAR=[
  {soru:'BALIK',dogru:'BALIK',yanlis:'BALKI',emoji:'🐟'},
  {soru:'GÜNEŞ',dogru:'GÜNEŞ',yanlis:'GÜNŞE',emoji:'☀️'},
  {soru:'ARABA',dogru:'ARABA',yanlis:'ARBAA',emoji:'🚗'},
  {soru:'ELMA',dogru:'ELMA',yanlis:'EMLA',emoji:'🍎'},
  {soru:'KÖPEK',dogru:'KÖPEK',yanlis:'KÖPKE',emoji:'🐶'},
  {soru:'UÇAK',dogru:'UÇAK',yanlis:'UÇKA',emoji:'✈️'},
  {soru:'ZÜRAFA',dogru:'ZÜRAFA',yanlis:'ZÜRFA',emoji:'🦒'},
  {soru:'ÇİLEK',dogru:'ÇİLEK',yanlis:'ÇİELK',emoji:'🍓'}
];

let soruIdx=0, puan=0, durduruldu=false, cevapBekleniyor=false, audioCtx=null;
const alan=document.getElementById('uzayAlan'), puanEl=document.getElementById('uzayScore');

// Cerrah Dokunuşu: Global AudioContext yönetimi
function initAudio() { 
  if(!audioCtx) audioCtx = new(window.AudioContext||window.webkitAudioContext)(); 
  if(audioCtx.state === 'suspended') audioCtx.resume();
}

function render(){
  if(!alan||durduruldu)return;
  const s=SORULAR[soruIdx % SORULAR.length];
  const solMu=Math.random()>0.5;

  alan.innerHTML=`
    <div class="uzay-soru-kart" style="text-align:center; padding:15px; background:rgba(255,255,255,0.05); border-radius:20px; border:1px solid rgba(255,255,255,0.1);">
        <div style="font-size:clamp(3rem, 10vw, 4.5rem); margin-bottom:5px; animation:pop 0.5s;">${s.emoji}</div>
        <div style="font-size:1.2rem; font-weight:bold; color:#00f2ff; text-transform:uppercase;">Bu Hangisi?</div>
    </div>
    <div style="height:200px; position:relative; overflow:hidden; margin:15px 0; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div id="uzayGemi" style="font-size:3.5rem; position:absolute; bottom:10px; left:50%; transform:translateX(-50%); transition:all 0.7s cubic-bezier(0.47, 0, 0.74, 0.71); z-index:10; filter:drop-shadow(0 0 10px #fff);">🚀</div>
    </div>
    <div id="uzayYollar" style="display:flex; justify-content:center; gap:15px; padding:0 10px;">
        <button class="uzay-yol" id="yolSol" style="flex:1; padding:18px 10px; font-size:1rem; font-weight:bold; cursor:pointer; border-radius:15px; border:2px solid #fff; background:transparent; color:#fff; transition:0.2s;">${solMu?s.dogru:s.yanlis}</button>
        <button class="uzay-yol" id="yolSag" style="flex:1; padding:18px 10px; font-size:1rem; font-weight:bold; cursor:pointer; border-radius:15px; border:2px solid #fff; background:transparent; color:#fff; transition:0.2s;">${solMu?s.yanlis:s.dogru}</button>
    </div>
  `;

  cevapBekleniyor=true;
  document.getElementById('yolSol').onclick=()=> { initAudio(); cevapla(solMu?'SOL':'SAG', document.getElementById('yolSol').textContent); };
  document.getElementById('yolSag').onclick=()=> { initAudio(); cevapla(solMu?'SAG':'SOL', document.getElementById('yolSag').textContent); };
}

function cevapla(yon, metin){
  if(!cevapBekleniyor||durduruldu)return;
  const s=SORULAR[soruIdx % SORULAR.length];
  const dogru=metin===s.dogru;
  const gemi=document.getElementById('uzayGemi');

  if(dogru){
    cevapBekleniyor=false; // Hacker önlemi: Çift tıklamayı engelle
    puan+=20; if(puanEl)puanEl.textContent=puan;
    
    // Roket fırlatma animasyonu
    gemi.style.bottom="300px";
    gemi.style.left=yon==='SOL'?"10%":"90%";
    gemi.style.opacity="0";
    gemi.style.transform="translateX(-50%) scale(0.5)";
    
    playSpaceSound(800, 0.5);
    
    setTimeout(()=>{
      soruIdx++;
      render();
    }, 800);
  } else {
    // Yanlış cevap efekti
    gemi.style.animation="shake 0.4s ease-in-out";
    playSpaceSound(150, 0.2);
    setTimeout(()=>gemi.style.animation="", 400);
  }
}

function playSpaceSound(f,d){
  if(!audioCtx) return;
  try {
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(f, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(f*2, audioCtx.currentTime+d);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+d);
    o.start(); o.stop(audioCtx.currentTime+d);
  } catch(e) { console.error("Ses hatası:", e); }
}

window.uzayBas=()=>{ soruIdx=0; puan=0; if(puanEl)puanEl.textContent=0; render(); };
window.uzayBas();

const st=document.createElement('style');
st.innerHTML=`
  @keyframes shake{0%,100%{left:50%} 20%{left:45%} 40%{left:55%} 60%{left:47%} 80%{left:53%}}
  @keyframes pop{0%{transform:scale(0.8); opacity:0} 100%{transform:scale(1); opacity:1}}
  .uzay-yol:active{background:#fff !important; color:#000 !important; transform:translateY(2px);}
  .uzay-yol:hover{border-color:#00f2ff; box-shadow: 0 0 10px #00f2ff;}
`;
document.head.appendChild(st);
})();

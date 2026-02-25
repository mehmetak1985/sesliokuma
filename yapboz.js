(function(){
"use strict";

// 1. KELİME LİSTESİ (3-7 HARF KADEMELİ)
const SEViYELER=[
  [{kelime:'MUZ',emoji:'🍌'},{kelime:'KAZ',emoji:'🦢'},{kelime:'ARI',emoji:'🐝'},{kelime:'TOP',emoji:'⚽'},{kelime:'ÇAY',emoji:'☕'}],
  [{kelime:'ELMA',emoji:'🍎'},{kelime:'KEDİ',emoji:'🐱'},{kelime:'KUZU',emoji:'🐑'},{kelime:'GEMİ',emoji:'🚢'},{kelime:'KAPI',emoji:'🚪'}],
  [{kelime:'ÇİLEK',emoji:'🍓'},{kelime:'KÖPEK',emoji:'🐶'},{kelime:'RADYO',emoji:'📻'},{kelime:'ŞEKER',emoji:'🍬'},{kelime:'KAŞIK',emoji:'🥄'}],
  [{kelime:'KARPUZ',emoji:'🍉'},{kelime:'GÖZLÜK',emoji:'👓'},{kelime:'TAVŞAN',emoji:'🐰'},{kelime:'PEYNİR',emoji:'🧀'},{kelime:'CETVEL',emoji:'📏'}],
  [{kelime:'ZÜRAFA',emoji:'🦒'},{kelime:'TELEFON',emoji:'📱'},{kelime:'PENCERE',emoji:'🪟'},{kelime:'ŞEMSİYE',emoji:'☂️'},{kelime:'ELDİVEN',emoji:'🧤'}]
];

let seviye=0, kelimeIdx=0, puan=0, durduruldu=false, yanlisSayaci=0, audioCtx=null;
let mevcutData=null, doluKutular=[];

const alan=document.getElementById('yapbozAlan'), puanEl=document.getElementById('yapbozScore');
const seviyeEl=document.getElementById('yapbozSeviyeText'), kelimeEl=document.getElementById('yapbozKelimeText');

// WEB SES SİSTEMİ KİLİDİNİ AÇMA
function initAudio() { 
    if(!audioCtx) audioCtx = new(window.AudioContext||window.webkitAudioContext)(); 
    if(audioCtx.state==='suspended') audioCtx.resume(); 
}

function render(){
  if(!alan||durduruldu) return;
  mevcutData=SEViYELER[seviye][kelimeIdx];
  const kelime=mevcutData.kelime;
  doluKutular=new Array(kelime.length).fill(null);
  yanlisSayaci=0;

  if(seviyeEl) seviyeEl.textContent=`Seviye ${seviye+1}/5`;
  if(kelimeEl) kelimeEl.textContent=`Kelime ${kelimeIdx+1}/5`;

  alan.innerHTML=`
    <div style="font-size:clamp(3.5rem, 12vw, 5rem); margin-bottom:15px; text-align:center; animation:pop 0.5s;">${mevcutData.emoji}</div>
    <div id="yapbozKutular" style="display:flex; justify-content:center; gap:6px; margin-bottom:25px;"></div>
    <div id="yapbozButonlar" style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;"></div>
  `;

  const kDiv=document.getElementById('yapbozKutular');
  kelime.split('').forEach((_,i)=>{
    const d=document.createElement('div');
    d.className='harf-kutu';
    d.style="width:clamp(32px, 8vw, 45px); height:55px; border:2px solid #ccc; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:bold; border-radius:10px; background:#fff; transition:all 0.3s;";
    d.id=`k_${i}`; d.textContent='?';
    kDiv.appendChild(d);
  });

  const bDiv=document.getElementById('yapbozButonlar');
  shuffle(kelime.split('')).forEach(h=>{
    const b=document.createElement('button');
    b.className='harf-btn';
    b.style="padding:12px 18px; font-size:1.5rem; cursor:pointer; background:#fff; border:2px solid #333; border-radius:12px; box-shadow:0 5px 0 #333; user-select:none; touch-action:manipulation; transition:0.1s;";
    b.textContent=h; 
    b.onclick=()=>{ initAudio(); kontrol(h,b); };
    bDiv.appendChild(b);
  });
}

function kontrol(h,btn){
  const kelime=mevcutData.kelime, hIdx=doluKutular.findIndex(v=>v===null);
  if(h===kelime[hIdx]){
    playTone(600, 0.1);
    doluKutular[hIdx]=h;
    const k=document.getElementById(`k_${hIdx}`);
    k.textContent=h; k.style.background="#dcedc8"; k.style.borderColor="#7cb342"; k.style.transform="scale(1.1)";
    btn.style.visibility="hidden"; yanlisSayaci=0;
    if(doluKutular.every(v=>v!==null)) tamam();
  } else {
    playTone(200, 0.2);
    yanlisSayaci++;
    btn.style.animation="shake 0.4s"; btn.style.background="#ffcdd2";
    setTimeout(()=>{btn.style.animation=""; btn.style.background="#fff";}, 400);
    if(yanlisSayaci>=2) ipucu(kelime[hIdx]);
  }
}

function ipucu(dogru){
  document.querySelectorAll('#yapbozButonlar button').forEach(b=>{
    if(b.textContent===dogru && b.style.visibility!=="hidden"){
      b.style.background="#a5d6a7"; 
      b.style.transform="scale(1.1)";
      setTimeout(()=>{b.style.background="#fff"; b.style.transform="scale(1)";}, 1000);
    }
  });
}

function tamam(){
  if(durduruldu) return;
  puan+=50; if(puanEl) puanEl.textContent=puan;
  playWin();
  setTimeout(()=>{
    if(durduruldu) return;
    kelimeIdx++; 
    if(kelimeIdx>=5){ seviye++; kelimeIdx=0; }
    if(seviye>=5){
      if(alan) alan.innerHTML='<div style="text-align:center;padding:20px;font-size:1.5rem;color:#fff;font-weight:900;">🏆 TEBRİKLER!<br>Tüm yapbozları bitirdin!</div>';
      setTimeout(()=>{ if(!durduruldu) window.yapbozBas(); }, 2000);
    } else { render(); }
  }, 1200);
}

// WEB SES SENTEZLEYİCİ
function playTone(f,d){
  if(!audioCtx) return;
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); o.frequency.value=f;
  g.gain.setValueAtTime(0.1,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+d);
  o.start(); o.stop(audioCtx.currentTime+d);
}

function playWin(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>playTone(f,0.3),i*150)); }

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

window.yapbozBas=()=>{ seviye=0; kelimeIdx=0; puan=0; durduruldu=false; if(alan)alan.innerHTML=''; render(); };
window.yapbozDurdur=()=>{ durduruldu=true; if(alan)alan.innerHTML=''; };

// CSS ANİMASYONLARI
const s=document.createElement('style');
s.innerHTML=`
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
  @keyframes pop{0%{transform:scale(0.5)}100%{transform:scale(1)}}
  .harf-btn:active{transform:translateY(4px) !important; box-shadow:none !important;}
`;
document.head.appendChild(s);
})();

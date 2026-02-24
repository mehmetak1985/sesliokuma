// ═══════════════════════════════════════════════════════════════
//  GİZLİ HAZİNE - HARF SIRALAMA (V3 PRO MÜHENDİS SÜRÜMÜ)
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

const KELIMELER=[
  {kelime:'ELMA', emoji:'🍎'}, {kelime:'İNEK', emoji:'🐄'},
  {kelime:'KALE', emoji:'🏰'}, {kelime:'NANE', emoji:'🌿'},
  {kelime:'OKUL', emoji:'🏫'}, {kelime:'KEDİ', emoji:'🐈'},
  {kelime:'NAR',  emoji:'🍎'}, {kelime:'LALE', emoji:'🌷'},
  {kelime:'ATA',  emoji:'🐎'}, {kelime:'ET',   emoji:'🥩'}
];

let puan=0, durduruldu=false, aktifSandik=null, girilenHarfler = "";
// Tek bir audio context kullanarak bellek sızıntısını önlüyoruz
let sharedAudioCtx = null;

const alan    = document.getElementById('hazineAlan');
const sonucEl = document.getElementById('hazineSonuc');
const puanEl  = document.getElementById('hazineScore');

if (!document.getElementById('hazineStyles')) {
    const style = document.createElement('style');
    style.id = 'hazineStyles';
    style.innerHTML = `
      .oyun-alani { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%; }
      .harf-havuzu { display: flex; justify-content: center; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
      .harf-tasi { 
        width: 55px; height: 55px; background: #fff; border: 3px solid #ffd600; 
        border-radius: 12px; display: flex; align-items: center; justify-content: center;
        font-size: 1.6rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffd600;
        transition: transform 0.1s, opacity 0.2s; color: #333; user-select: none;
      }
      .harf-tasi:active { transform: translateY(4px); box-shadow: none; }
      .harf-tasi.dogru-basildi { opacity: 0; pointer-events: none; transform: scale(0.5); }
      .bosluk-konteynir { display: flex; gap: 8px; margin-bottom: 10px; }
      .harf-bosluk { 
        width: 45px; height: 50px; border-bottom: 4px solid #fff; 
        display: flex; align-items: center; justify-content: center;
        font-size: 1.8rem; font-weight: bold; color: #ffd600; text-shadow: 2px 2px #000;
      }
      .sandik.pasif { opacity: 0.3; pointer-events: none; filter: grayscale(1); }
      .hazine-emoji-focus { font-size: 5rem; margin-bottom: 15px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function render(){
  if(!alan) return;
  alan.innerHTML='';
  KELIMELER.forEach((item,i)=>{
    const div=document.createElement('div');
    div.className='sandik'; div.id='sandik_'+i;
    div.innerHTML='<div class="sandik-icon">🔒</div><div class="sandik-kelime">???</div>';
    div.onclick=()=>sandikSec(i);
    alan.appendChild(div);
  });
}

function sandikSec(index){
  if(durduruldu) return;
  const el=document.getElementById('sandik_'+index);
  if(!el||el.classList.contains('sandik--acik')) return;
  
  document.querySelectorAll('.sandik').forEach(s => s.classList.add('pasif'));
  el.classList.remove('pasif');
  el.style.outline='4px solid #ffd600';
  
  aktifSandik = index;
  girilenHarfler = "";
  harfOyununuBaslat(index);
}

function harfOyununuBaslat(index) {
  const hedef = KELIMELER[index].kelime;
  const emoji = KELIMELER[index].emoji;
  
  if(!sonucEl) return;
  sonucEl.innerHTML = '';

  const emojiDiv = document.createElement('div');
  emojiDiv.className = 'hazine-emoji-focus';
  emojiDiv.textContent = emoji;
  
  const boslukKonteynir = document.createElement('div');
  boslukKonteynir.className = 'bosluk-konteynir';
  for(let i=0; i<hedef.length; i++) {
    const b = document.createElement('div');
    b.className = 'harf-bosluk';
    b.id = 'slot_' + i;
    b.textContent = '_';
    boslukKonteynir.appendChild(b);
  }

  const harfHavuzu = document.createElement('div');
  harfHavuzu.className = 'harf-havuzu';
  
  // Mühendislik Çözümü: Harfleri nesne olarak sakla (Aynı harf bug'ı çözümü)
  const harfObjeleri = hedef.split('').map((h, idx) => ({ h, originalIdx: idx }));
  const karisikHarfler = harfObjeleri.sort(() => Math.random() - 0.5);
  
  karisikHarfler.forEach((obj) => {
    const hTas = document.createElement('div');
    hTas.className = 'harf-tasi';
    hTas.textContent = obj.h;
    hTas.onclick = () => harfSec(obj.h, hTas, hedef, index);
    harfHavuzu.appendChild(hTas);
  });

  sonucEl.appendChild(emojiDiv);
  sonucEl.appendChild(boslukKonteynir);
  sonucEl.appendChild(harfHavuzu);
}

function harfSec(harf, element, hedef, index) {
  if(durduruldu) return;
  const siradakiIndex = girilenHarfler.length;
  
  if (harf === hedef[siradakiIndex]) {
    document.getElementById('slot_' + siradakiIndex).textContent = harf;
    girilenHarfler += harf;
    element.classList.add('dogru-basildi'); // Sadece visibility değil, etkileşimi de keser
    audioFeedback(true);
    
    if (girilenHarfler === hedef) {
      setTimeout(() => sandikAc(index), 400);
    }
  } else {
    const sandikEl = document.getElementById('sandik_'+index);
    sandikEl.classList.add('sandik--sallaniyor');
    audioFeedback(false);
    setTimeout(() => sandikEl.classList.remove('sandik--sallaniyor'), 500);
  }
}

function sandikAc(index){
  if(durduruldu) return;
  const el=document.getElementById('sandik_'+index);
  if(!el) return;
  
  el.classList.add('sandik--acik');
  el.classList.remove('pasif');
  el.style.outline='';
  
  const item=KELIMELER[index];
  el.innerHTML=`<div class="sandik-icon">${item.emoji}</div><div class="hazine-altin">🪙🪙🪙</div><div class="sandik-kelime">${item.kelime}</div>`;
  
  puan+=20;
  if(puanEl) puanEl.textContent=puan;
  if(window.koyunSkoru) window.koyunSkoru(20);
  
  document.querySelectorAll('.sandik').forEach(s => {
    if(!s.classList.contains('sandik--acik')) s.classList.remove('pasif');
  });

  sonucEl.innerHTML = '<h2 style="color:#ffd600; text-shadow:2px 2px #000; animation: popIn 0.4s;">HARİKA! 💰</h2>';
  
  if(alan.querySelectorAll('.sandik--acik').length === KELIMELER.length){
    setTimeout(hazineOdasiFirlat, 800);
  }
}

function hazineOdasiFirlat() {
    const finalDiv = document.createElement('div');
    finalDiv.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle,#1a2a6c,#b21f1f,#fdbb2d);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;color:white;text-align:center;font-family:sans-serif;`;
    finalDiv.innerHTML = `
        <h1 style="font-size:3rem; margin-bottom:10px;">🏆 TEBRİKLER!</h1>
        <div style="font-size:120px; margin:20px;">🥇</div>
        <h2 style="font-size:2rem; margin-bottom:30px;">Toplam Puan: ${puan}</h2>
        <button onclick="location.reload()" style="padding:20px 40px; font-size:1.8rem; border-radius:50px; border:none; background:#27ae60; color:white; cursor:pointer; box-shadow: 0 10px 0 #1e8449;">YENİDEN BAŞLA</button>
    `;
    document.body.appendChild(finalDiv);
    finalKutlamaEfekti();
}

function finalKutlamaEfekti() {
    for(let i=0;i<60;i++) {
        const k=document.createElement('div');
        k.style.cssText=`position:fixed;width:12px;height:12px;background:hsl(${Math.random()*360},100%,50%);left:${Math.random()*100}vw;top:-20px;z-index:10001;pointer-events:none;`;
        document.body.appendChild(k);
        k.animate([{top:'-20px', transform:'rotate(0deg)'},{top:'110vh', transform:`rotate(${Math.random()*720}deg)`}],{duration:2000+Math.random()*3000}).onfinish=()=>k.remove();
    }
}

function audioFeedback(dogru){
  try {
    // Singleton AudioContext yapısı: Belleği korur, kilitlenmeyi önler.
    if (!sharedAudioCtx) {
        sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();

    const o = sharedAudioCtx.createOscillator();
    const g = sharedAudioCtx.createGain();
    o.connect(g); g.connect(sharedAudioCtx.destination);
    
    o.frequency.setValueAtTime(dogru ? 523.25 : 220, sharedAudioCtx.currentTime);
    g.gain.setValueAtTime(0.1, sharedAudioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, sharedAudioCtx.currentTime + 0.3);
    
    o.start(); o.stop(sharedAudioCtx.currentTime + 0.3);
  } catch(e) {}
}

window.hazineBas=()=>{ 
  durduruldu=false; 
  puan=0; 
  render(); 
  if(sonucEl) sonucEl.textContent="Bir sandık seç ve harfleri doğru sırayla diz!"; 
};

window.hazineDurdur=()=>{ 
  durduruldu=true; 
  // Açık olan harf havuzunu pasifize et
  document.querySelectorAll('.harf-tasi').forEach(t => t.style.pointerEvents = 'none');
};

})();

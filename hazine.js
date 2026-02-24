// ═══════════════════════════════════════════════════════════════
//  GİZLİ HAZİNE - STRES TESTİ ONAYLI NİHAİ SÜRÜM
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

const KELIMELER=[
  {kelime:'EL',emoji:'🖐'},{kelime:'AL',emoji:'🍎'},{kelime:'KAL',emoji:'🏠'},
  {kelime:'İNEK',emoji:'🐄'},{kelime:'KALE',emoji:'🏰'},{kelime:'EKİN',emoji:'🌾'},
  {kelime:'LALE',emoji:'🌷'},{kelime:'ALİ',emoji:'👦'},{kelime:'OKUL',emoji:'🏫'},
  {kelime:'YOLU',emoji:'🛤'},{kelime:'MUTLU',emoji:'😊'},{kelime:'ÜTÜYÜ',emoji:'👕'}
];

let puan=0, durduruldu=false, aktifSandik=null;

const alan    = document.getElementById('hazineAlan');
const sonucEl = document.getElementById('hazineSonuc');
const puanEl  = document.getElementById('hazineScore');

if (!document.getElementById('hazineStyles')) {
    const style = document.createElement('style');
    style.id = 'hazineStyles';
    style.innerHTML = `
      .secenek-konteynir { display: flex; justify-content: center; gap: 10px; margin-top: 15px; min-height: 60px; align-items: center; }
      .kelime-buton { 
        padding: 12px 24px; background: #fff; border: 2px solid #ffd600; border-radius: 15px;
        cursor: pointer; font-weight: bold; font-size: 1.3rem; transition: 0.2s;
        box-shadow: 0 4px 0 #ffd600; color: #333;
      }
      .kelime-buton:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; transform: none; }
      .kelime-buton:hover:not(:disabled) { background: #fffdf0; transform: translateY(-2px); }
      .kelime-buton:active:not(:disabled) { transform: translateY(2px); box-shadow: none; }
      .sandik.disabled { pointer-events: none; opacity: 0.7; }
    `;
    document.head.appendChild(style);
}

function render(){
  if(!alan) return;
  alan.innerHTML='';
  KELIMELER.forEach((item,i)=>{
    const div=document.createElement('div');
    div.className='sandik'; div.id='sandik_'+i;
    div.innerHTML='<div class="sandik-icon">🔒</div><div class="sandik-kelime">'+item.kelime+'</div>';
    div.onclick=()=>sandikSec(i);
    alan.appendChild(div);
  });
}

function sandikSec(index){
  if(durduruldu) return;
  const el=document.getElementById('sandik_'+index);
  if(!el||el.classList.contains('sandik--acik')) return;
  
  const tumSandiklar = document.querySelectorAll('.sandik');
  tumSandiklar.forEach(s => s.classList.add('disabled'));
  el.classList.remove('disabled');
  
  aktifSandik=index;
  el.style.outline='4px solid #ffd600';
  el.style.zIndex = "10";
  secenekleriGoster(index);
}

function secenekleriGoster(index){
  if(!sonucEl) return;
  sonucEl.innerHTML = '';
  const hedefKelime = KELIMELER[index].kelime;
  
  const digerleri = KELIMELER.filter(k => k.kelime !== hedefKelime)
                             .sort(() => 0.5 - Math.random())
                             .slice(0, 2)
                             .map(k => k.kelime);
  
  const secenekler = [hedefKelime, ...digerleri].sort(() => 0.5 - Math.random());
  
  const metin = document.createElement('span');
  metin.textContent = "Hangi anahtar bu sandığı açar? ";
  metin.style.display = "block";
  
  const konteynir = document.createElement('div');
  konteynir.className = 'secenek-konteynir';
  
  secenekler.forEach(kelime => {
    const btn = document.createElement('button');
    btn.className = 'kelime-buton';
    btn.textContent = kelime;
    btn.onclick = (e) => {
      e.stopPropagation();
      if(durduruldu) return; // Durdurulduysa işlem yapma
      if(kelime === hedefKelime) {
        sandikAc(index);
      } else {
        hataYap(index);
      }
    };
    konteynir.appendChild(btn);
  });
  
  sonucEl.appendChild(metin);
  sonucEl.appendChild(konteynir);
}

function hataYap(index) {
  const el = document.getElementById('sandik_'+index);
  if(el) {
    el.classList.add('sandik--sallaniyor');
    audioFeedback(false);
    setTimeout(() => el.classList.remove('sandik--sallaniyor'), 800);
  }
}

function sandikAc(index){
  if(durduruldu) return;
  const el=document.getElementById('sandik_'+index);
  if(!el) return;
  
  el.classList.add('sandik--acik');
  el.classList.remove('disabled');
  el.style.outline='';
  el.style.zIndex = "1";
  
  const tumSandiklar = document.querySelectorAll('.sandik');
  tumSandiklar.forEach(s => {
      if(!s.classList.contains('sandik--acik')) s.classList.remove('disabled');
  });

  const item=KELIMELER[index];
  el.innerHTML='<div class="sandik-icon">'+item.emoji+'</div><div class="hazine-altin">🪙🪙🪙</div><div class="sandik-kelime">'+item.kelime+'</div>';
  
  puan+=20;
  if(puanEl) puanEl.textContent=puan;
  if(window.koyunSkoru) window.koyunSkoru(20);
  if(sonucEl) sonucEl.textContent = 'Harika! '+ item.kelime +' anahtarı hazineyi açtı! 🎉';
  
  audioFeedback(true);
  aktifSandik=null;

  if(alan.querySelectorAll('.sandik--acik').length === KELIMELER.length){
    setTimeout(hazineOdasiFirlat, 1200);
  }
}

function hazineOdasiFirlat() {
    const eskiFinal = document.getElementById('finalSahne');
    if(eskiFinal) eskiFinal.remove();

    const finalDiv = document.createElement('div');
    finalDiv.id = 'finalSahne';
    finalDiv.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle,#1a2a6c,#b21f1f,#fdbb2d);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;color:white;text-align:center;font-family:sans-serif;`;
    finalDiv.innerHTML = `
        <h1 style="font-size:3.5rem;text-shadow:4px 4px #000;margin:0;">TEBRİKLER!</h1>
        <div id="bigMedal" style="font-size:150px;margin:20px; display:inline-block;">🥇</div>
        <h2 style="font-size:2.5rem;margin:10px;">Toplam Puan: ${puan}</h2>
        <button id="restartBtn" style="padding:20px 50px;font-size:1.8rem;border-radius:50px;border:none;background:#27ae60;color:white;cursor:pointer;box-shadow:0 10px 20px rgba(0,0,0,0.4);">YENİDEN BAŞLA</button>
    `;
    document.body.appendChild(finalDiv);
    document.getElementById('restartBtn').onclick = () => location.reload();
    
    document.getElementById('bigMedal').animate([
        { transform:'scale(0.5) rotateY(0deg)',opacity:0 },
        { transform:'scale(1.2) rotateY(540deg)',opacity:1 },
        { transform:'scale(1) rotateY(1080deg)',opacity:1 }
    ], { duration:2500, easing:'ease-out', fill:'forwards' });
    
    finalKutlamaEfekti();
}

function finalKutlamaEfekti() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99, 1046.50].forEach((f,i)=>{
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(f,ctx.currentTime+(i*0.15));
        g.gain.setValueAtTime(0.1,ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+2);
        o.start(ctx.currentTime+(i*0.15)); o.stop(ctx.currentTime+2);
    });
    for(let i=0;i<60;i++) {
        const k=document.createElement('div');
        k.style.cssText=`position:fixed;width:12px;height:12px;background:hsl(${Math.random()*360},100%,50%);left:${Math.random()*100}vw;top:-20px;z-index:10001;pointer-events:none;`;
        document.body.appendChild(k);
        k.animate([{top:'-20px'},{top:'110vh',transform:`rotate(${Math.random()*1000}deg)`}],{duration:2000+Math.random()*2500}).onfinish=()=>k.remove();
    }
}

function audioFeedback(dogru){
  try{
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx=new AudioContext();
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(dogru?440:220,ctx.currentTime);
    g.gain.setValueAtTime(0.1,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
    o.start(); o.stop(ctx.currentTime+0.4);
    // Context temizliği (Mühendislik dokunuşu)
    setTimeout(() => ctx.close(), 500);
  } catch(e){}
}

window.hazineBas=()=>{ durduruldu=false; puan=0; render(); if(sonucEl) sonucEl.textContent = "Bir sandık seç ve hazineyi bul!"; };
window.hazineDurdur=()=>{ 
    durduruldu=true; 
    // Butonları da kilitle
    document.querySelectorAll('.kelime-buton').forEach(b => b.disabled = true);
};

})();

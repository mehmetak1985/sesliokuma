// ═══════════════════════════════════════════════════════════════
//  GİZLİ HAZİNE - STABİLİTE TESTİ YAPILMIŞ SÜRÜM
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

const KELIMELER=[
  {kelime:'EL',emoji:'🖐'},{kelime:'AL',emoji:'🍎'},{kelime:'KAL',emoji:'🏠'},
  {kelime:'İNEK',emoji:'🐄'},{kelime:'KALE',emoji:'🏰'},{kelime:'EKİN',emoji:'🌾'},
  {kelime:'LALE',emoji:'🌷'},{kelime:'ALİ',emoji:'👦'},{kelime:'OKUL',emoji:'🏫'},
  {kelime:'YOLU',emoji:'🛤'},{kelime:'MUTLU',emoji:'😊'},{kelime:'ÜTÜYÜ',emoji:'👕'}
];

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
let puan=0,durduruldu=false,aktifSandik=null,recognition=null;

const alan    = document.getElementById('hazineAlan');
const sonucEl = document.getElementById('hazineSonuc');
const puanEl  = document.getElementById('hazineScore');

function normalizeText(metin){
  if(!metin)return '';
  return metin.replace(/I/g,'ı').replace(/İ/g,'i').toLocaleLowerCase('tr-TR').replace(/[^\p{L}]/gu,'');
}

function kelimeEslesir(konusulan,hedef){
  const k=normalizeText(konusulan), h=normalizeText(hedef);
  if(k===h) return true;
  const m=k.length, n=h.length;
  if(Math.abs(m-n)>2) return false;
  const dp=[];
  for(let i=0;i<=m;i++)dp[i]=[i];
  for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=k[i-1]===h[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n]<=Math.floor(Math.max(m,n)*0.4);
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
  if(aktifSandik!==null) {
    const eskiEl=document.getElementById('sandik_'+aktifSandik);
    if(eskiEl) eskiEl.style.outline='';
  }
  aktifSandik=index;
  el.style.outline='3px solid #ffd600';
  if(sonucEl) sonucEl.textContent='🎤 "'+KELIMELER[index].kelime+'" de!';
  dinlemeBasla(KELIMELER[index].kelime,index);
}

function dinlemeBasla(hedef,sandikIndex){
  if(!SpeechRecognition) {
      if(sonucEl) sonucEl.textContent = "Tarayıcı ses tanımayı desteklemiyor.";
      return;
  }
  
  if(recognition){
    try{ recognition.onresult=null; recognition.onend=null; recognition.abort(); } catch(e){}
  }

  recognition=new SpeechRecognition();
  recognition.lang='tr-TR';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onresult=(event)=>{
    let eslesti=false;
    const transcript = event.results[0][0].transcript;
    if(kelimeEslesir(transcript,hedef)) eslesti=true;
    
    if(eslesti) sandikAc(sandikIndex);
    else {
      const el=document.getElementById('sandik_'+sandikIndex);
      if(el) el.classList.add('sandik--sallaniyor');
      audioFeedback(false);
      if(sonucEl) sonucEl.textContent = '😕 "' + transcript + '" anlaşıldı. Tekrar dene!';
      setTimeout(()=>{
        if(el) el.classList.remove('sandik--sallaniyor');
        try{ if(!durduruldu && aktifSandik === sandikIndex) recognition.start(); } catch(e){}
      },1000);
    }
  };

  recognition.onerror = (e) => {
      console.warn("Recognition Hatası:", e.error);
      if(e.error === 'no-speech' && !durduruldu) {
          setTimeout(() => { try{ recognition.start(); }catch(err){} }, 500);
      }
  };

  try { recognition.start(); } catch(e) {}
}

function sandikAc(index){
  if(durduruldu) return;
  const el=document.getElementById('sandik_'+index);
  if(!el) return;
  el.classList.add('sandik--acik');
  const item=KELIMELER[index];
  el.innerHTML='<div class="sandik-icon">'+item.emoji+'</div><div class="hazine-altin">🪙🪙🪙</div><div class="sandik-kelime">'+item.kelime+'</div>';
  puan+=20;
  if(puanEl) puanEl.textContent=puan;
  if(window.koyunSkoru) window.koyunSkoru(20);
  audioFeedback(true);
  aktifSandik=null;

  if(alan.querySelectorAll('.sandik--acik').length===KELIMELER.length){
    setTimeout(hazineOdasiFirlat, 1500);
  }
}

function hazineOdasiFirlat() {
    const finalDiv = document.createElement('div');
    finalDiv.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle,#1a2a6c,#b21f1f,#fdbb2d);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;color:white;text-align:center;font-family:sans-serif;`;
    finalDiv.innerHTML = `
        <h1 style="font-size:3.5rem;text-shadow:4px 4px #000;margin:0;">TEBRİKLER!</h1>
        <div id="bigMedal" style="font-size:150px;margin:20px;">🥇</div>
        <h2 style="font-size:2.5rem;margin:10px;">Puan: ${puan}</h2>
        <button id="restartBtn" style="padding:20px 50px;font-size:1.8rem;border-radius:50px;border:none;background:#27ae60;color:white;cursor:pointer;box-shadow:0 10px 20px rgba(0,0,0,0.4);">YENİDEN BAŞLA</button>
    `;
    document.body.appendChild(finalDiv);
    
    document.getElementById('restartBtn').onclick = () => location.reload();

    document.getElementById('bigMedal').animate([
        { transform:'scale(0.5) rotateY(0deg)',opacity:0 },
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

    for(let i=0;i<70;i++) {
        const k=document.createElement('div');
        k.style.cssText=`position:fixed;width:12px;height:12px;background:hsl(${Math.random()*360},100%,50%);left:${Math.random()*100}vw;top:-20px;z-index:10001;`;
        document.body.appendChild(k);
        k.animate([{top:'-20px'},{top:'110vh',transform:`rotate(${Math.random()*1000}deg)`}],{duration:2000+Math.random()*3000}).onfinish=()=>k.remove();
    }
}

function audioFeedback(dogru){
  try{
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx=new AudioContext();
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(dogru?440:300,ctx.currentTime);
    g.gain.setValueAtTime(0.2,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);
    o.start(); o.stop(ctx.currentTime+0.5);
  } catch(e){}
}

window.hazineBas=()=>{ durduruldu=false; puan=0; render(); };
window.hazineDurdur=()=>{ durduruldu=true; if(recognition) { recognition.onresult=null; recognition.abort(); } };

})();

// ═══════════════════════════════════════════════════════════════
//  GİZLİ HAZİNE
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

// MEB sırasına göre kelimeler (hece → kelime)
const KELIMELER=[
  {kelime:'EL',emoji:'🖐'},
  {kelime:'AL',emoji:'🍎'},
  {kelime:'KAL',emoji:'🏠'},
  {kelime:'İNEK',emoji:'🐄'},
  {kelime:'KALE',emoji:'🏰'},
  {kelime:'EKİN',emoji:'🌾'},
  {kelime:'LALE',emoji:'🌷'},
  {kelime:'ALİ',emoji:'👦'},
  {kelime:'OKUL',emoji:'🏫'},
  {kelime:'YOLU',emoji:'🛤'},
  {kelime:'MUTLU',emoji:'😊'},
  {kelime:'ÜTÜYÜ',emoji:'👕'},
];

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;

let puan=0,durduruldu=false,aktifSandik=null,recognition=null,dinliyoruz=false;

const alan    = document.getElementById('hazineAlan');
const sonucEl = document.getElementById('hazineSonuc');
const puanEl  = document.getElementById('hazineScore');

function normalizeText(metin){
  if(!metin)return'';
  return metin.replace(/I/g,'ı').replace(/İ/g,'i').toLocaleLowerCase('tr-TR').replace(/[^\p{L}]/gu,'');
}

function kelimeEslesir(konusulan,hedef){
  const k=normalizeText(konusulan);
  const h=normalizeText(hedef);
  if(k===h)return true;
  // Levenshtein
  const m=k.length,n=h.length;
  if(Math.abs(m-n)>2)return false;
  const dp=[];
  for(let i=0;i<=m;i++)dp[i]=[i];
  for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=k[i-1]===h[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n]<=Math.floor(Math.max(m,n)*0.4);
}

function render(){
  if(!alan)return;
  alan.innerHTML='';
  KELIMELER.forEach((item,i)=>{
    const div=document.createElement('div');
    div.className='sandik';
    div.id='sandik_'+i;
    div.dataset.index=i;
    div.innerHTML='<div class="sandik-icon">🔒</div><div class="sandik-kelime">'+item.kelime+'</div>';
    div.addEventListener('click',()=>sandikSec(i));
    alan.appendChild(div);
  });
}

function sandikSec(index){
  if(durduruldu)return;
  const el=document.getElementById('sandik_'+index);
  if(!el||el.classList.contains('sandik--acik'))return;
  // Önceki seçimi temizle
  if(aktifSandik!==null){
    const eskiEl=document.getElementById('sandik_'+aktifSandik);
    if(eskiEl)eskiEl.style.outline='';
  }
  aktifSandik=index;
  el.style.outline='3px solid #ffd600';
  const kelime=KELIMELER[index].kelime;
  if(sonucEl)sonucEl.textContent='🎤 "'+kelime+'" kelimesini söyle!';
  dinlemeBasla(kelime,index);
}

function dinlemeBasla(hedef,sandikIndex){
  if(!SpeechRecognition){
    // Ses tanıma yoksa tıklamayla aç
    if(sonucEl)sonucEl.textContent='🎤 Ses tanıma desteklenmiyor. Sandığa tekrar dokun.';
    const el=document.getElementById('sandik_'+sandikIndex);
    if(el){
      el.removeEventListener('click',el._acHandler);
      el._acHandler=()=>sandikAc(sandikIndex);
      el.addEventListener('click',el._acHandler,{once:true});
    }
    return;
  }
  if(recognition){try{recognition.abort();}catch(e){}}
  recognition=new SpeechRecognition();
  recognition.lang='tr-TR';recognition.continuous=false;recognition.interimResults=false;recognition.maxAlternatives=5;
  recognition.onresult=(event)=>{
    if(durduruldu)return;
    let eslesti=false;
    for(let i=0;i<event.results[0].length;i++){
      const transcript=event.results[0][i].transcript;
      if(kelimeEslesir(transcript,hedef)){eslesti=true;break;}
    }
    if(eslesti)sandikAc(sandikIndex);
    else{
      const el=document.getElementById('sandik_'+sandikIndex);
      if(el)el.classList.add('sandik--sallaniyor');
      if(sonucEl)sonucEl.textContent='😕 Tekrar dene! "'+hedef+'"';
      audioFeedback(false);
      setTimeout(()=>{if(el)el.classList.remove('sandik--sallaniyor');dinlemeBasla(hedef,sandikIndex);},800);
    }
  };
  recognition.onerror=()=>{dinliyoruz=false;};
  recognition.onend=()=>{dinliyoruz=false;};
  recognition.start();dinliyoruz=true;
}

function sandikAc(index){
  if(durduruldu)return;
  const el=document.getElementById('sandik_'+index);
  if(!el)return;
  el.style.outline='';
  el.classList.remove('sandik--sallaniyor');
  el.classList.add('sandik--acik');
  const item=KELIMELER[index];
  el.innerHTML='<div class="sandik-icon">'+item.emoji+'</div><div class="hazine-altin">🪙🪙🪙</div><div class="sandik-kelime">'+item.kelime+'</div>';
  puan+=20;
  if(puanEl)puanEl.textContent=puan;
  if(window.koyunSkoru)window.koyunSkoru(20);
  if(sonucEl)sonucEl.textContent='🎉 Harika! Sandık açıldı! +20';
  audioFeedback(true);
  aktifSandik=null;
  // Hepsi açıldı mı?
  const aciklar=alan.querySelectorAll('.sandik--acik').length;
  if(aciklar===KELIMELER.length){
    setTimeout(()=>{if(sonucEl)sonucEl.textContent='🏆 Tüm sandıkları açtın!';},500);
  }
}

function audioFeedback(dogru){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    if(dogru){osc.frequency.setValueAtTime(440,ctx.currentTime);osc.frequency.setValueAtTime(554,ctx.currentTime+0.1);osc.frequency.setValueAtTime(659,ctx.currentTime+0.2);osc.frequency.setValueAtTime(880,ctx.currentTime+0.3);}
    else{osc.frequency.setValueAtTime(300,ctx.currentTime);osc.frequency.setValueAtTime(220,ctx.currentTime+0.2);}
    gain.gain.setValueAtTime(0.3,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.5);
  }catch(e){}
}

window.hazineBas=function(){
  durduruldu=false;
  puan=0;aktifSandik=null;
  if(puanEl)puanEl.textContent=0;
  if(sonucEl)sonucEl.textContent='Açmak istediğin sandığa dokun!';
  render();
};

window.hazineDurdur=function(){
  durduruldu=true;
  dinliyoruz=false;
  if(recognition){try{recognition.abort();}catch(e){}}
  recognition=null;
};

})();

// ═══════════════════════════════════════════════════════════════
//  HAFIZA KARTLARI
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

// MEB sırasına göre hece-resim çiftleri
const CIFTLER=[
  // Seviye 1
  [{tip:'hece',icerik:'EL'},{tip:'emoji',icerik:'🖐'}],
  [{tip:'hece',icerik:'AL'},{tip:'emoji',icerik:'🍎'}],
  [{tip:'hece',icerik:'AK'},{tip:'emoji',icerik:'🦆'}],
  [{tip:'hece',icerik:'KAL'},{tip:'emoji',icerik:'🏠'}],
  // Seviye 2
  [{tip:'hece',icerik:'İNEK'},{tip:'emoji',icerik:'🐄'}],
  [{tip:'hece',icerik:'KALE'},{tip:'emoji',icerik:'🏰'}],
  [{tip:'hece',icerik:'LALE'},{tip:'emoji',icerik:'🌷'}],
  [{tip:'hece',icerik:'EKİN'},{tip:'emoji',icerik:'🌾'}],
  // Seviye 3
  [{tip:'hece',icerik:'OKUL'},{tip:'emoji',icerik:'🏫'}],
  [{tip:'hece',icerik:'YOLU'},{tip:'emoji',icerik:'🛤'}],
  [{tip:'hece',icerik:'MUTLU'},{tip:'emoji',icerik:'😊'}],
  [{tip:'hece',icerik:'ÜTÜYÜ'},{tip:'emoji',icerik:'👕'}],
];

// Seviye başına kaç çift
const SEVIYE_CIFT=[4,6,8,12];

let seviye=0,puan=0,durduruldu=false;
let acikKartlar=[],eslesilenler=0,toplamCift=0,kartVerisi=[];
let kilitli=false;

const alan    = document.getElementById('hafizaAlan');
const puanEl  = document.getElementById('hafizaScore');
const seviyeEl= document.getElementById('hafizaSeviyeText');

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function yeniSeviye(){
  if(durduruldu)return;
  const ciftSayisi=SEVIYE_CIFT[Math.min(seviye,SEVIYE_CIFT.length-1)];
  toplamCift=ciftSayisi;
  eslesilenler=0;
  acikKartlar=[];
  kilitli=false;
  if(seviyeEl)seviyeEl.textContent='Seviye '+(seviye+1);

  // Kullanılacak çiftleri seç
  const secilmis=shuffle(CIFTLER).slice(0,ciftSayisi);
  // Her çiftten iki kart oluştur
  kartVerisi=[];
  secilmis.forEach((cift,i)=>{
    kartVerisi.push({id:'c'+i+'_0',grupId:i,icerik:cift[0].icerik,tip:cift[0].tip,eslesti:false});
    kartVerisi.push({id:'c'+i+'_1',grupId:i,icerik:cift[1].icerik,tip:cift[1].tip,eslesti:false});
  });
  kartVerisi=shuffle(kartVerisi);
  render();
}

function render(){
  if(!alan)return;
  // Izgara sütun sayısı
  const cols=toplamCift<=4?4:toplamCift<=6?4:4;
  alan.style.gridTemplateColumns='repeat('+cols+',1fr)';
  alan.innerHTML='';
  kartVerisi.forEach(kart=>{
    const div=document.createElement('div');
    div.className='hafiza-kart';
    div.id='kart_'+kart.id;
    div.innerHTML='<div class="hafiza-kart-on">❓</div><div class="hafiza-kart-arka'+(kart.tip==='emoji'?' emoji-arka':'')+'">'+kart.icerik+'</div>';
    div.addEventListener('click',()=>kartaTıkla(kart.id));
    alan.appendChild(div);
  });
}

function kartaTıkla(kartId){
  if(kilitli||durduruldu)return;
  const kart=kartVerisi.find(k=>k.id===kartId);
  if(!kart||kart.eslesti)return;
  const el=document.getElementById('kart_'+kartId);
  if(!el||el.classList.contains('cevrili'))return;
  el.classList.add('cevrili');
  acikKartlar.push(kartId);
  audioFlip();
  if(acikKartlar.length===2)kontrolEt();
}

function kontrolEt(){
  kilitli=true;
  const [id1,id2]=acikKartlar;
  const k1=kartVerisi.find(k=>k.id===id1);
  const k2=kartVerisi.find(k=>k.id===id2);
  if(k1.grupId===k2.grupId){
    // Eşleşti
    k1.eslesti=true;k2.eslesti=true;
    const el1=document.getElementById('kart_'+id1);
    const el2=document.getElementById('kart_'+id2);
    if(el1)el1.classList.add('hafiza-kart--eslesti');
    if(el2)el2.classList.add('hafiza-kart--eslesti');
    eslesilenler++;
    puan+=20;
    if(puanEl)puanEl.textContent=puan;
    if(window.koyunSkoru)window.koyunSkoru(20);
    audioFeedback(true);
    acikKartlar=[];
    kilitli=false;
    if(eslesilenler===toplamCift){
      setTimeout(()=>{
        if(durduruldu)return;
        seviye++;
        if(seviye<SEVIYE_CIFT.length)yeniSeviye();
        else{seviye=0;yeniSeviye();}
      },800);
    }
  } else {
    // Eşleşmedi
    puan=Math.max(0,puan-3);
    if(puanEl)puanEl.textContent=puan;
    audioFeedback(false);
    const el1=document.getElementById('kart_'+id1);
    const el2=document.getElementById('kart_'+id2);
    if(el1)el1.classList.add('hafiza-kart--yanlis');
    if(el2)el2.classList.add('hafiza-kart--yanlis');
    setTimeout(()=>{
      if(el1){el1.classList.remove('cevrili','hafiza-kart--yanlis');}
      if(el2){el2.classList.remove('cevrili','hafiza-kart--yanlis');}
      acikKartlar=[];kilitli=false;
    },900);
  }
}

function audioFlip(){
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.setValueAtTime(300,ctx.currentTime);gain.gain.setValueAtTime(0.1,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.1);}catch(e){}
}
function audioFeedback(dogru){
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);if(dogru){osc.frequency.setValueAtTime(523,ctx.currentTime);osc.frequency.setValueAtTime(659,ctx.currentTime+0.1);osc.frequency.setValueAtTime(784,ctx.currentTime+0.2);osc.frequency.setValueAtTime(1047,ctx.currentTime+0.3);}else{osc.frequency.setValueAtTime(250,ctx.currentTime);osc.frequency.setValueAtTime(200,ctx.currentTime+0.15);}gain.gain.setValueAtTime(0.25,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.45);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.45);}catch(e){}
}

window.hafizaBas=function(){
  durduruldu=false;
  puan=0;seviye=0;
  if(puanEl)puanEl.textContent=0;
  yeniSeviye();
};

window.hafizaDurdur=function(){
  durduruldu=true;
  acikKartlar=[];kilitli=false;
};

})();

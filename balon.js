// ═══════════════════════════════════════════════════════════════
//  BALON PATLATMA
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

const HECE_GRUPLARI=[
  ["E","L","A","K","İ","N"],          // Seviye 1
  ["EL","AL","AK","LA","KA","İL"],     // Seviye 2
  ["ELİ","ALA","KAL","İNE","NEK","EKİ"], // Seviye 3
  ["KALE","EKİN","LALE","İNEK","ALİ","MİNE"], // Seviye 4
  ["OKUL","METE","YOLU","ÜTÜYÜ","TÜYLÜ","MUTLU"] // Seviye 5
];

const RENKLER=["#ef476f","#f4a261","#ffd166","#06d6a0","#118ab2","#8e24aa","#e91e63","#00acc1"];

let seviye=0,puan=0,aktifBalonlar=[],animFrame=null,durduruldu=false;
let hedefHece=null,bekleyenTimer=null;

const alan     = document.getElementById('balonAlan');
const sonucEl  = document.getElementById('balonSonuc');
const puanEl   = document.getElementById('balonScore');
const seviyeEl = document.getElementById('balonSeviyeText');
const hedefEl  = document.getElementById('balonHedefText');

function oyunuBitir(){}

function yeniTur(){
  if(durduruldu)return;
  aktifBalonlar.forEach(b=>{if(b.el&&b.el.parentNode)b.el.parentNode.removeChild(b.el);});
  aktifBalonlar=[];
  const grup=HECE_GRUPLARI[seviye];
  hedefHece=grup[Math.floor(Math.random()*grup.length)];
  if(hedefEl)hedefEl.textContent='🎯 "'+hedefHece+'" heceyi bul!';
  // Yanlış seçenekler
  let yanlislar=grup.filter(h=>h!==hedefHece);
  yanlislar=shuffle(yanlislar).slice(0,3);
  const tumHeceler=shuffle([hedefHece,...yanlislar]);
  if(sonucEl)sonucEl.textContent='';
  tumHeceler.forEach((hece,i)=>{
    setTimeout(()=>{
      if(durduruldu)return;
      balonOlustur(hece);
    },i*350);
  });
}

function balonOlustur(hece){
  if(!alan)return;
  const boyut=Math.floor(Math.random()*40)+70; // 70-110px
  const renk=RENKLER[Math.floor(Math.random()*RENKLER.length)];
  const x=Math.floor(Math.random()*(alan.clientWidth-boyut-10))+5;
  const div=document.createElement('div');
  div.className='balon';
  div.style.cssText='width:'+boyut+'px;height:'+boyut+'px;left:'+x+'px;bottom:-'+boyut+'px;background:'+renk+';font-size:'+Math.floor(boyut/3.5)+'px;';
  div.textContent=hece;
  alan.appendChild(div);
  const sure=Math.floor(Math.random()*4000)+5000; // 5-9sn
  const balon={el:div,hece,x,y:-boyut,vitez:(alan.clientHeight+boyut)/sure*16,aktif:true};
  aktifBalonlar.push(balon);
  div.addEventListener('click',()=>balonaTıkla(balon));
  div.addEventListener('touchstart',e=>{e.preventDefault();balonaTıkla(balon);},{passive:false});
  animasyonBaşlat();
}

let animCalisiyor=false;
function animasyonBaşlat(){
  if(animCalisiyor)return;
  animCalisiyor=true;
  function adim(){
    if(durduruldu){animCalisiyor=false;return;}
    let hepsiGitti=true;
    aktifBalonlar.forEach(b=>{
      if(!b.aktif||!b.el)return;
      hepsiGitti=false;
      b.y+=b.vitez;
      b.el.style.bottom=(b.y)+'px';
      if(b.y>alan.clientHeight){
        b.aktif=false;
        b.el.remove();
      }
    });
    aktifBalonlar=aktifBalonlar.filter(b=>b.aktif);
    if(aktifBalonlar.length===0){animCalisiyor=false;if(!durduruldu)setTimeout(yeniTur,500);return;}
    requestAnimationFrame(adim);
  }
  requestAnimationFrame(adim);
}

function balonaTıkla(balon){
  if(!balon.aktif||durduruldu)return;
  balon.aktif=false;
  if(balon.hece===hedefHece){
    // Doğru
    balon.el.classList.add('balon--patladi');
    puan+=10;
    if(puanEl)puanEl.textContent=puan;
    if(window.koyunSkoru)window.koyunSkoru(10);
    if(sonucEl)sonucEl.textContent='🎉 Harika! +10';
    audioFeedback(true);
    // Seviye ilerlemesi
    if(puan>=(seviye+1)*30&&seviye<HECE_GRUPLARI.length-1){
      seviye++;
      if(seviyeEl)seviyeEl.textContent='Seviye '+(seviye+1);
    }
    setTimeout(()=>{if(balon.el)balon.el.remove();if(!durduruldu)yeniTur();},400);
  } else {
    // Yanlış
    balon.aktif=true; // tekrar aktif et
    balon.el.classList.add('balon--yanlis');
    puan=Math.max(0,puan-2);
    if(puanEl)puanEl.textContent=puan;
    if(sonucEl)sonucEl.textContent='😕 Yanlış! -2';
    audioFeedback(false);
    setTimeout(()=>{balon.el.classList.remove('balon--yanlis');},400);
  }
}

function audioFeedback(dogru){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    if(dogru){osc.frequency.setValueAtTime(523,ctx.currentTime);osc.frequency.setValueAtTime(659,ctx.currentTime+0.1);osc.frequency.setValueAtTime(784,ctx.currentTime+0.2);}
    else{osc.frequency.setValueAtTime(200,ctx.currentTime);osc.frequency.setValueAtTime(150,ctx.currentTime+0.15);}
    gain.gain.setValueAtTime(0.3,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.4);
  }catch(e){}
}

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

window.balonBas=function(){
  durduruldu=false;
  puan=0;seviye=0;aktifBalonlar=[];
  if(puanEl)puanEl.textContent=0;
  if(seviyeEl)seviyeEl.textContent='Seviye 1';
  if(alan)alan.innerHTML='';
  if(sonucEl)sonucEl.textContent='';
  yeniTur();
};

window.balonDurdur=function(){
  durduruldu=true;
  aktifBalonlar.forEach(b=>{if(b.el&&b.el.parentNode)b.el.parentNode.removeChild(b.el);});
  aktifBalonlar=[];
  if(alan)alan.innerHTML='';
};

})();

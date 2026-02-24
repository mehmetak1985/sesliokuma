// ═══════════════════════════════════════════════════════════════
//  KELIME YAPBOZU — 5 Seviye × 5 Kelime
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

// 5 seviye × 5 kelime (MEB sırasına göre)
// Seviye 1: E, L, A harfleri — 3 harfli kelimeler
// Seviye 2: + K, İ, N — 4 harfli kelimeler
// Seviye 3: + O, M, U — 4-5 harfli kelimeler
// Seviye 4: + T, Ü, Y — 5 harfli kelimeler
// Seviye 5: Tüm harfler — 5-6 harfli kelimeler
const SEViYELER=[
  [
    {kelime:'ELA',emoji:'👧',harfler:['E','L','A']},
    {kelime:'ALE',emoji:'🔥',harfler:['A','L','E']},
    {kelime:'LAL',emoji:'🌸',harfler:['L','A','L']},
    {kelime:'ELE',emoji:'🫳',harfler:['E','L','E']},
    {kelime:'ALA',emoji:'🎨',harfler:['A','L','A']},
  ],
  [
    {kelime:'KALE',emoji:'🏰',harfler:['K','A','L','E']},
    {kelime:'EKİN',emoji:'🌾',harfler:['E','K','İ','N']},
    {kelime:'LALE',emoji:'🌷',harfler:['L','A','L','E']},
    {kelime:'KLAN',emoji:'👨‍👩‍👦',harfler:['K','L','A','N']},
    {kelime:'İNEK',emoji:'🐄',harfler:['İ','N','E','K']},
  ],
  [
    {kelime:'OKUL',emoji:'🏫',harfler:['O','K','U','L']},
    {kelime:'MOMO',emoji:'🐛',harfler:['M','O','M','O']},
    {kelime:'MELA',emoji:'💧',harfler:['M','E','L','A']},
    {kelime:'OLTA',emoji:'🎣',harfler:['O','L','T','A']},
    {kelime:'UMUT',emoji:'⭐',harfler:['U','M','U','T']},
  ],
  [
    {kelime:'MUTLU',emoji:'😊',harfler:['M','U','T','L','U']},
    {kelime:'TÜYLÜ',emoji:'🦜',harfler:['T','Ü','Y','L','Ü']},
    {kelime:'YUMAK',emoji:'🧶',harfler:['Y','U','M','A','K']},
    {kelime:'TULUM',emoji:'👶',harfler:['T','U','L','U','M']},
    {kelime:'ÜTÜYÜ',emoji:'👕',harfler:['Ü','T','Ü','Y','Ü']},
  ],
  [
    {kelime:'BALKON',emoji:'🏠',harfler:['B','A','L','K','O','N']},
    {kelime:'ÇILEK',emoji:'🍓',harfler:['Ç','İ','L','E','K']},
    {kelime:'GÖZLÜK',emoji:'👓',harfler:['G','Ö','Z','L','Ü','K']},
    {kelime:'ŞEKER',emoji:'🍬',harfler:['Ş','E','K','E','R']},
    {kelime:'HAVUZ',emoji:'🏊',harfler:['H','A','V','U','Z']},
  ]
];

let seviye=0,kelimeIdx=0,puan=0,durduruldu=false;
let mevcutKelime=null,doluKutular=[],yanlisSayaci={};

const alan     = document.getElementById('yapbozAlan');
const sonucEl  = document.getElementById('yapbozSonuc');
const puanEl   = document.getElementById('yapbozScore');
const seviyeEl = document.getElementById('yapbozSeviyeText');
const kelimeEl = document.getElementById('yapbozKelimeText');

function render(){
  if(!alan||durduruldu)return;
  mevcutKelime=SEViYELER[seviye][kelimeIdx];
  doluKutular=new Array(mevcutKelime.kelime.length).fill(null);
  yanlisSayaci={};

  if(seviyeEl)seviyeEl.textContent='Seviye '+(seviye+1)+' / 5';
  if(kelimeEl)kelimeEl.textContent='Kelime '+(kelimeIdx+1)+' / 5';
  if(sonucEl)sonucEl.textContent='';

  // Karıştırılmış harfler (yanlış + doğru)
  const ekstraHarfler=getEkstraHarfler(seviye);
  const tumHarfler=shuffle([...mevcutKelime.harfler,...ekstraHarfler]);

  alan.innerHTML=`
    <div class="yapboz-emoji-alan">${mevcutKelime.emoji}</div>
    <div class="harf-kutu-satir" id="yapbozKutular"></div>
    <div class="harf-buton-satir" id="yapbozButonlar"></div>
  `;

  // Boş kutular
  const kutularDiv=document.getElementById('yapbozKutular');
  for(let i=0;i<mevcutKelime.kelime.length;i++){
    const div=document.createElement('div');
    div.className='harf-kutu harf-kutu--bos';
    div.id='yapboz_kutu_'+i;
    div.textContent='_';
    kutularDiv.appendChild(div);
  }

  // Harf butonları
  const butonlarDiv=document.getElementById('yapbozButonlar');
  tumHarfler.forEach((harf,i)=>{
    const btn=document.createElement('button');
    btn.className='harf-btn';
    btn.id='yapboz_btn_'+i;
    btn.textContent=harf;
    btn.dataset.harf=harf;
    btn.dataset.btnIdx=i;
    btn.addEventListener('click',()=>harfSec(harf,i));
    butonlarDiv.appendChild(btn);
  });
}

function getEkstraHarfler(svl){
  const havuz=['A','E','L','K','İ','N','O','M','U','T','Ü','Y','R','S','Ç','G','Ş','B','D'];
  const adet=svl<=1?2:svl<=2?3:4;
  return shuffle(havuz).slice(0,adet);
}

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function harfSec(harf,btnIdx){
  if(durduruldu)return;
  // Sonraki boş kutuyu bul
  const hedefIdx=doluKutular.findIndex(v=>v===null);
  if(hedefIdx===-1)return;
  const dogruHarf=mevcutKelime.kelime[hedefIdx];
  const btn=document.getElementById('yapboz_btn_'+btnIdx);

  if(harf===dogruHarf){
    // Doğru
    doluKutular[hedefIdx]=harf;
    const kutu=document.getElementById('yapboz_kutu_'+hedefIdx);
    if(kutu){kutu.textContent=harf;kutu.className='harf-kutu harf-kutu--dogru';}
    if(btn){btn.disabled=true;btn.style.opacity='0.35';}
    audioFeedback(true);
    // Tamamlandı mı?
    if(doluKutular.every(v=>v!==null)){
      kelimeTamamlandi();
    }
  } else {
    // Yanlış
    yanlisSayaci[hedefIdx]=(yanlisSayaci[hedefIdx]||0)+1;
    if(btn){
      btn.classList.add('harf-btn--yanlis');
      setTimeout(()=>btn.classList.remove('harf-btn--yanlis'),400);
    }
    audioFeedback(false);
    puan=Math.max(0,puan-1);
    if(puanEl)puanEl.textContent=puan;
    // 2. yanlışta ipucu göster
    if(yanlisSayaci[hedefIdx]>=2){
      ipucuGoster(hedefIdx,dogruHarf);
    }
  }
}

function ipucuGoster(kutuIdx,dogruHarf){
  // Doğru harfli butonu yeşil yak
  const butonlar=document.querySelectorAll('#yapbozButonlar .harf-btn:not([disabled])');
  butonlar.forEach(btn=>{
    if(btn.dataset.harf===dogruHarf&&!btn.disabled){
      btn.classList.add('harf-btn--ipucu');
      setTimeout(()=>btn.classList.remove('harf-btn--ipucu'),2000);
    }
  });
}

function kelimeTamamlandi(){
  puan+=30;
  if(puanEl)puanEl.textContent=puan;
  if(window.koyunSkoru)window.koyunSkoru(30);
  if(sonucEl)sonucEl.textContent='🎉 Harika! +30';
  audioTamamlandi();
  setTimeout(()=>{
    if(durduruldu)return;
    kelimeIdx++;
    if(kelimeIdx>=SEViYELER[seviye].length){
      kelimeIdx=0;
      seviye=(seviye+1)%SEViYELER.length;
      if(sonucEl)sonucEl.textContent='🏆 Seviye Tamamlandı!';
      setTimeout(()=>{if(!durduruldu)render();},1000);
    } else {
      render();
    }
  },800);
}

function audioFeedback(dogru){
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);if(dogru){osc.frequency.setValueAtTime(440,ctx.currentTime);osc.frequency.setValueAtTime(554,ctx.currentTime+0.08);}else{osc.frequency.setValueAtTime(220,ctx.currentTime);osc.frequency.setValueAtTime(180,ctx.currentTime+0.12);}gain.gain.setValueAtTime(0.2,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.25);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.25);}catch(e){}
}
function audioTamamlandi(){
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const freqler=[523,659,784,1047,1319];freqler.forEach((f,i)=>{const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=f;gain.gain.setValueAtTime(0.2,ctx.currentTime+i*0.1);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.1+0.3);osc.start(ctx.currentTime+i*0.1);osc.stop(ctx.currentTime+i*0.1+0.3);});}catch(e){}
}

window.yapbozBas=function(){
  durduruldu=false;
  puan=0;seviye=0;kelimeIdx=0;
  if(puanEl)puanEl.textContent=0;
  render();
};

window.yapbozDurdur=function(){
  durduruldu=true;
};

})();

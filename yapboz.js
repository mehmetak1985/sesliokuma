(function(){
"use strict";

const SEViYELER=[
  [{kelime:'MUZ',emoji:'🍌'},{kelime:'KAZ',emoji:'🦢'},{kelime:'ARI',emoji:'🐝'},{kelime:'TOP',emoji:'⚽'},{kelime:'ÇAY',emoji:'☕'}],
  [{kelime:'ELMA',emoji:'🍎'},{kelime:'KEDİ',emoji:'🐱'},{kelime:'KUZU',emoji:'🐑'},{kelime:'GEMİ',emoji:'🚢'},{kelime:'KAPI',emoji:'🚪'}],
  [{kelime:'ÇİLEK',emoji:'🍓'},{kelime:'KÖPEK',emoji:'🐶'},{kelime:'RADYO',emoji:'📻'},{kelime:'ŞEKER',emoji:'🍬'},{kelime:'KAŞIK',emoji:'🥄'}],
  [{kelime:'KARPUZ',emoji:'🍉'},{kelime:'GÖZLÜK',emoji:'👓'},{kelime:'TAVŞAN',emoji:'🐰'},{kelime:'PEYNİR',emoji:'🧀'},{kelime:'CETVEL',emoji:'📏'}],
  [{kelime:'ZÜRAFA',emoji:'🦒'},{kelime:'TELEFON',emoji:'📱'},{kelime:'PENCERE',emoji:'🪟'},{kelime:'ŞEMSİYE',emoji:'☂️'},{kelime:'ELDİVEN',emoji:'🧤'}]
];

let seviye=0,kelimeIdx=0,puan=0,durduruldu=false,yanlisSayaci=0,audioCtx=null;
let mevcutData=null,doluKutular=[];

const alan=document.getElementById('yapbozAlan'), puanEl=document.getElementById('yapbozScore');
const seviyeEl=document.getElementById('yapbozSeviyeText'), kelimeEl=document.getElementById('yapbozKelimeText');

function initAudio() { if(!audioCtx) audioCtx = new(window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume(); }

function render(){
  if(!alan||durduruldu)return;
  mevcutData=SEViYELER[seviye][kelimeIdx];
  const kelime=mevcutData.kelime;
  doluKutular=new Array(kelime.length).fill(null);
  yanlisSayaci=0;

  if(seviyeEl)seviyeEl.textContent=`Seviye ${seviye+1}/5`;
  if(kelimeEl)kelimeEl.textContent=`Kelime ${kelimeIdx+1}/5`;

  alan.innerHTML=`
    <div style="font-size:clamp(3rem, 10vw, 4.5rem);margin-bottom:15px;text-align:center;animation:pop 0.5s;">${mevcutData.emoji}</div>
    <div id="yapbozKutular" style="display:flex;justify-content:center;gap:5px;margin-bottom:25px;flex-wrap:nowrap;"></div>
    <div id="yapbozButonlar" style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;"></div>
  `;

  const kDiv=document.getElementById('yapbozKutular');
  kelime.split('').forEach((_,i)=>{
    const d=document.createElement('div');
    d.style="width:clamp(30px, 8vw, 45px);height:55px;border:2px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:clamp(1rem, 5vw, 1.4rem);font-weight:bold;border-radius:8px;background:#fff;";
    d.id=`k_${i}`; d.textContent='?';
    kDiv.appendChild(d);
  });

  const bDiv=document.getElementById('yapbozButonlar');
  shuffle(kelime.split('')).forEach(h=>{
    const b=document.createElement('button');
    b.className='harf-btn';
    b.style="padding:10px 15px;font-size:1.4rem;cursor:pointer;background:#fff;border:2px solid #333;border-radius:12px;box-shadow:0 4px 0 #333;user-select:none;touch-action:manipulation;";
    b.textContent=h; b.onclick=()=>{ initAudio(); kontrol(h,b); };
    bDiv.appendChild(b);
  });
}

function kontrol(h,btn){
  const kelime=mevcutData.kelime, hIdx=doluKutular.findIndex(v=>v===null);
  if(h===kelime[hIdx]){
    playTone(600, 0.1);
    doluKutular[hIdx]=h;
    const k=document.getElementById(`k_${hIdx}`);
    k.textContent=h; k.style.background="#dcedc8"; k.style.borderColor="#7cb342";
    btn.style.visibility="hidden"; yanlisSayaci=0;
    if(doluKutular.every(v=>v!==null)) tamam();
  } else {
    playTone(200, 0.2);
    yanlisSayaci++;
    btn.style.animation="shake 0.4s"; btn.style.background="#ffcdd2";
    setTimeout(()=>{btn.style.animation=""; btn.style.background="#fff";},400);
    if(yanlisSayaci>=

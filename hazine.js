// ═══════════════════════════════════════════════════════════════
//  GİZLİ HAZİNE - MÜKEMMELLEŞTİRİLMİŞ PRO SÜRÜM (V5)
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

const SEVIYELER = [
  { v: [{k:'ARI', e:'🐝'}, {k:'KUŞ', e:'🐦'}, {k:'SÜT', e:'🥛'}, {k:'TOP', e:'⚽'}] },
  { v: [{k:'KEDİ', e:'🐈'}, {k:'KUZU', e:'🐑'}, {k:'ELMA', e:'🍎'}, {k:'KAPI', e:'🚪'}] },
  { v: [{k:'TAVUK', e:'🐔'}, {k:'PASTA', e:'🎂'}, {k:'ÜZÜM', e:'🍇'}, {k:'KİRAZ', e:'🍒'}] },
  { v: [{k:'BALİNA', e:'🐋'}, {k:'TAVŞAN', e:'🐰'}, {k:'PEYNİR', e:'🧀'}, {k:'ORMAN', e:'🌲🌳🌲'}] },
  { v: [{k:'ZÜRAFA', e:'🦒'}, {k:'KARINCA', e:'🐜'}, {k:'PENGUEN', e:'🐧'}, {k:'PATATES', e:'🥔'}] }
];

let aktifSeviyeIdx = 0, puan = 0, durduruldu = false, girilenHarfler = "", sharedAudioCtx = null, isProcessing = false;

const alan = document.getElementById('hazineAlan'), sonucEl = document.getElementById('hazineSonuc'), puanEl = document.getElementById('hazineScore');

// CSS: Mobil odaklı ve GPU dostu animasyonlar
if (!document.getElementById('hazineStyles')) {
    const style = document.createElement('style');
    style.id = 'hazineStyles';
    style.innerHTML = `
      #hazineAlan { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 10px; max-width: 380px; margin: auto; }
      .sandik { 
        aspect-ratio: 1/1; background: #5d4037; border: 3px solid #3e2723; border-radius: 12px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 5px 0 #2b1d1a; position: relative; transition: transform 0.2s;
      }
      .sandik-kapak { position: absolute; top:0; width:100%; height:50%; background:#795548; border-bottom:2px solid #3e2723; display:flex; align-items:center; justify-content:center; font-size:1.2rem; transition: 0.4s; z-index:3; }
      .sandik--acik .sandik-kapak { transform: translateY(-100%); opacity: 0; }
      .sandik.pasif { opacity: 0.3; pointer-events: none; }
      .oyun-paneli { background: rgba(0,0,0,0.85); border-radius: 15px; padding: 12px; color: white; margin-top:10px; }
      .harf-havuzu { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
      .harf-tasi { 
        width: 42px; height: 42px; background: #fff; color: #333; border-radius: 8px;
        display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold;
        box-shadow: 0 3px 0 #ffd600; cursor: pointer; user-select: none;
      }
      .harf-tasi.dogru { visibility: hidden; pointer-events: none; }
      .bosluklar { display: flex; justify-content: center; gap: 4px; margin: 8px 0; }
      .slot { width: 30px; height: 35px; border-bottom: 3px solid #ffd600; font-size: 1.3rem; font-weight: bold; text-align: center; }
      .lvl-tag { background: #ffd600; color: #000; padding: 3px 12px; border-radius: 15px; font-weight: bold; display: inline-block; margin-bottom: 5px; }
    `;
    document.head.appendChild(style);
}

function render(){
  if(!alan || durduruldu) return;
  isProcessing = false;
  alan.innerHTML = '';
  const data = SEVIYELER[aktifSeviyeIdx].v;
  if(sonucEl) sonucEl.innerHTML = `<span class="lvl-tag">SEVİYE ${aktifSeviyeIdx + 1}</span><br>Bir sandık seç!`;

  data.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'sandik'; div.id = 'sandik_' + i;
    div.innerHTML = `<div class="sandik-kapak">🔒</div><div style="font-size:2.5rem">📦</div>`;
    div.onclick = () => sandikSec(i);
    alan.appendChild(div);
  });
}

function sandikSec(idx){
  if(durduruldu || isProcessing) return;
  const el = document.getElementById('sandik_'+idx);
  if(el.classList.contains('sandik--acik')) return;

  document.querySelectorAll('.sandik').forEach(s => s.classList.add('pasif'));
  el.classList.remove('pasif');
  
  const hedef = SEVIYELER[aktifSeviyeIdx].v[idx].k, emoji = SEVIYELER[aktifSeviyeIdx].v[idx].e;
  girilenHarfler = "";
  
  sonucEl.innerHTML = `
    <div class="oyun-paneli">
      <div style="font-size:2.5rem">${emoji}</div>
      <div class="bosluklar" id="slotlar"></div>
      <div class="harf-havuzu" id="havuz"></div>
    </div>`;
  
  for(let i=0; i<hedef.length; i++){
    const s = document.createElement('div'); s.className='slot'; s.id='s_'+i; s.textContent='_';
    document.getElementById('slotlar').appendChild(s);
  }

  hedef.split('').map((h, i) => ({h, i})).sort(() => Math.random()-0.5).forEach(obj => {
    const bt = document.createElement('div'); bt.className = 'harf-tasi'; bt.textContent = obj.h;
    bt.onclick = () => {
      if(obj.h === hedef[girilenHarfler.length]) {
        document.getElementById('s_'+girilenHarfler.length).textContent = obj.h;
        girilenHarfler += obj.h;
        bt.classList.add('dogru');
        audioFeedback(true);
        if(girilenHarfler === hedef) { isProcessing = true; setTimeout(() => sandikAc(idx), 400); }
      } else {
        el.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'}], 80);
        audioFeedback(false);
      }
    };
    document.getElementById('havuz').appendChild(bt);
  });
}

function sandikAc(idx){
  const el = document.getElementById('sandik_'+idx);
  if(!el) return;
  el.classList.add('sandik--acik');
  el.classList.remove('pasif');
  const item = SEVIYELER[aktifSeviyeIdx].v[idx];
  el.innerHTML = `<div class="sandik-kapak">🔓</div><div style="font-size:2.5rem;z-index:1">${item.e}</div><div style="color:white;font-weight:bold;z-index:2">${item.k}</div>`;
  
  puan += 20;
  if(puanEl) puanEl.textContent = puan;
  if(window.koyunSkoru) window.koyunSkoru(20);
  
  document.querySelectorAll('.sandik').forEach(s => { if(!s.classList.contains('sandik--acik')) s.classList.remove('pasif'); });

  const aciklar = alan.querySelectorAll('.sandik--acik').length;
  if(aciklar === 4) {
    if(aktifSeviyeIdx < SEVIYELER.length - 1) {
      sonucEl.innerHTML = `<button id="nextLvlBtn" style="padding:12px 25px; background:#27ae60; color:white; border:none; border-radius:12px; font-size:1.1rem; font-weight:bold; cursor:pointer; margin-top:10px;">SEVİYE ${aktifSeviyeIdx+2} BAŞLASIN ➔</button>`;
      document.getElementById('nextLvlBtn').onclick = () => { aktifSeviyeIdx++; render(); };
    } else {
      setTimeout(finalEkran, 600);
    }
  } else {
    sonucEl.innerHTML = `<span class="lvl-tag">SEVİYE ${aktifSeviyeIdx + 1}</span><br><b style="color:#ffd600">Mükemmel!</b> Diğer sandığa geç.`;
    isProcessing = false;
  }
}

function finalEkran() {
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle,#1a2a6c,#b21f1f,#fdbb2d);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;color:white;text-align:center;`;
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:15px 30px; border-radius:30px; border:none; background:#27ae60; color:white; font-size:1.3rem; cursor:pointer; box-shadow:0 5px 0 #1e8449';
    btn.textContent = 'TEKRAR OYNA';
    btn.onclick = () => { document.body.removeChild(f); window.hazineBas(); };
    f.innerHTML = `<h1 style="font-size:2.5rem">🏆 ŞAMPİYON!</h1><div style="font-size:80px">👑</div><h2>Hazineyi Tamamladın!</h2><h3>Puan: ${puan}</h3>`;
    f.appendChild(btn);
    document.body.appendChild(f);
}

function audioFeedback(d){
  try {
    if (!sharedAudioCtx) sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
    const o = sharedAudioCtx.createOscillator(), g = sharedAudioCtx.createGain();
    o.connect(g); g.connect(sharedAudioCtx.destination);
    o.frequency.setValueAtTime(d ? 523 : 220, sharedAudioCtx.currentTime);
    g.gain.setValueAtTime(0.1, sharedAudioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, sharedAudioCtx.currentTime + 0.2);
    o.start(); o.stop(sharedAudioCtx.currentTime + 0.2);
  } catch(e) {}
}

window.hazineBas=()=>{ aktifSeviyeIdx=0; puan=0; durduruldu=false; isProcessing=false; render(); };
window.hazineDurdur=()=>{ durduruldu=true; };

})();

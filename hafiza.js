// ═══════════════════════════════════════════════════════════════
//   HAFIZA KARTLARI - MÜKEMMELLEŞTİRİLMİŞ SÜRÜM
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

// MEB müfredatına uygun, somut ve görsel eşleşmeli çiftler
const CIFTLER = [
  [{tip:'hece',icerik:'EL'},{tip:'emoji',icerik:'🖐'}],
  [{tip:'hece',icerik:'ELMA'},{tip:'emoji',icerik:'🍎'}], 
  [{tip:'hece',icerik:'KAZ'},{tip:'emoji',icerik:'🦆'}],  
  [{tip:'hece',icerik:'KEDİ'},{tip:'emoji',icerik:'🐈'}],
  [{tip:'hece',icerik:'İNEK'},{tip:'emoji',icerik:'🐄'}],
  [{tip:'hece',icerik:'KALE'},{tip:'emoji',icerik:'🏰'}],
  [{tip:'hece',icerik:'LALE'},{tip:'emoji',icerik:'🌷'}],
  [{tip:'hece',icerik:'KAPI'},{tip:'emoji',icerik:'🚪'}], 
  [{tip:'hece',icerik:'OKUL'},{tip:'emoji',icerik:'🏫'}],
  [{tip:'hece',icerik:'ORMAN'},{tip:'emoji',icerik:'🌲🌲'}], 
  [{tip:'hece',icerik:'MUTLU'},{tip:'emoji',icerik:'😊'}],
  [{tip:'hece',icerik:'KUZU'},{tip:'emoji',icerik:'🐑'}]
];

const SEVIYE_CIFT = [4, 6, 8, 12];
let seviye = 0, durduruldu = false, kilitli = false;
let acikKartlar = [], eslesilenler = 0, toplamCift = 0, kartVerisi = [];
let audioCtx = null;

const alan = document.getElementById('hafizaAlan');
const seviyeEl = document.getElementById('hafizaSeviyeText');

function shuffle(arr) { 
  return arr.map(a => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map(a => a.value);
}

function yeniSeviye() {
  if (durduruldu) return;
  const ciftSayisi = SEVIYE_CIFT[Math.min(seviye, SEVIYE_CIFT.length - 1)];
  toplamCift = ciftSayisi;
  eslesilenler = 0; acikKartlar = []; kilitli = false;
  
  if (seviyeEl) seviyeEl.textContent = `Seviye ${seviye + 1}`;

  // Mevcut çiftlerden seçim yap ve kartları oluştur
  const secilenler = shuffle(CIFTLER).slice(0, ciftSayisi);
  kartVerisi = [];
  secilenler.forEach((cift, i) => {
    kartVerisi.push({id:`c${i}_0`, grupId:i, icerik:cift[0].icerik, tip:cift[0].tip, eslesti:false});
    kartVerisi.push({id:`c${i}_1`, grupId:i, icerik:cift[1].icerik, tip:cift[1].tip, eslesti:false});
  });
  kartVerisi = shuffle(kartVerisi);
  render();
}

function render() {
  if (!alan) return;
  // Dinamik ızgara yapısı: Küçük seviyelerde 4, büyüklerde 6 sütun
  const cols = toplamCift >= 12 ? 6 : 4;
  alan.style.display = 'grid';
  alan.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  alan.innerHTML = '';

  kartVerisi.forEach(kart => {
    const div = document.createElement('div');
    div.className = 'hafiza-kart';
    div.id = `kart_${kart.id}`;
    div.innerHTML = `
      <div class="hafiza-kart-on">❓</div>
      <div class="hafiza-kart-arka ${kart.tip === 'emoji' ? 'emoji-arka' : ''}">${kart.icerik}</div>
    `;
    div.onclick = () => kartaTikla(kart.id);
    alan.appendChild(div);
  });
}

function kartaTikla(kartId) {
  if (kilitli || durduruldu) return;
  const kart = kartVerisi.find(k => k.id === kartId);
  const el = document.getElementById(`kart_${kartId}`);

  if (!kart || kart.eslesti || el.classList.contains('cevrili') || acikKartlar.includes(kartId)) return;

  el.classList.add('cevrili');
  acikKartlar.push(kartId);
  playTone(300, 0.1); // Çevirme sesi

  if (acikKartlar.length === 2) {
    kilitli = true;
    setTimeout(kontrolEt, 600); // Kullanıcıya kartı görmesi için süre tanı
  }
}

function kontrolEt() {
  const [id1, id2] = acikKartlar;
  const k1 = kartVerisi.find(k => k.id === id1);
  const k2 = kartVerisi.find(k => k.id === id2);
  const el1 = document.getElementById(`kart_${id1}`);
  const el2 = document.getElementById(`kart_${id2}`);

  if (k1.grupId === k2.grupId) {
    k1.eslesti = k2.eslesti = true;
    el1.classList.add('hafiza-kart--eslesti');
    el2.classList.add('hafiza-kart--eslesti');
    eslesilenler++;
    if(window.koyunSkoru) window.koyunSkoru(5);
    playTone(523, 0.3);
    acikKartlar = [];
    kilitli = false;
    if (eslesilenler === toplamCift) nextStep();
  } else {
    el1.classList.add('hafiza-kart--yanlis');
    el2.classList.add('hafiza-kart--yanlis');
    playTone(200, 0.2);
    acikKartlar = [];
    setTimeout(() => {
      el1.classList.remove('cevrili', 'hafiza-kart--yanlis');
      el2.classList.remove('cevrili', 'hafiza-kart--yanlis');
      kilitli = false;
    }, 800);
  }
}

function nextStep() {
  setTimeout(() => {
    if(window.koyunSkoru) window.koyunSkoru(10);
    seviye++;
    if (seviye >= SEVIYE_CIFT.length) seviye = 0;
    yeniSeviye();
  }, 1000);
}

function playTone(freq, dur) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g); g.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}

window.hafizaBas = () => { durduruldu = false; seviye = 0; if(window.profilAktiviteKaydet) window.profilAktiviteKaydet('oyun'); yeniSeviye(); };
window.hafizaDurdur = () => { durduruldu = true; kilitli = false; };

})();

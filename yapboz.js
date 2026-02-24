// ═══════════════════════════════════════════════════════════════
//  KELIME YAPBOZU — Cerrah Hassasiyetiyle Güncellendi
//  5 Seviye × 5 Kelime (MEB ELAKİN UYUMLU)
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

const SEViYELER=[
  [ // Seviye 1: E, L, A (3 Harfli)
    {kelime:'ELA', emoji:'👧'}, {kelime:'LAL', emoji:'🌸'}, 
    {kelime:'ELA', emoji:'👁️'}, {kelime:'ALA', emoji:'🎨'}, {kelime:'ALE', emoji:'🔥'}
  ],
  [ // Seviye 2: + K, İ, N (4 Harfli)
    {kelime:'KALE', emoji:'🏰'}, {kelime:'EKİN', emoji:'🌾'}, 
    {kelime:'LALE', emoji:'🌷'}, {kelime:'İKNA', emoji:'🤝'}, {kelime:'İNEK', emoji:'🐄'}
  ],
  [ // Seviye 3: + O, M, U (4-5 Harfli)
    {kelime:'OKUL', emoji:'🏫'}, {kelime:'KOKU', emoji:'👃'}, 
    {kelime:'ELMA', emoji:'🍎'}, {kelime:'OLTA', emoji:'🎣'}, {kelime:'UMUT', emoji:'⭐'}
  ],
  [ // Seviye 4: + T, Ü, Y (5 Harfli)
    {kelime:'MUTLU', emoji:'😊'}, {kelime:'TÜYLÜ', emoji:'🦜'}, 
    {kelime:'YUMAK', emoji:'🧶'}, {kelime:'TULUM', emoji:'👶'}, {kelime:'ÜTÜYÜ', emoji:'👕'}
  ],
  [ // Seviye 5: Karma (5-6 Harfli)
    {kelime:'ÇİLEK', emoji:'🍓'}, {kelime:'BALIK', emoji:'🐟'}, 
    {kelime:'GÜNEŞ', emoji:'☀️'}, {kelime:'ŞEKER', emoji:'🍬'}, {kelime:'KEDİLER', emoji:'🐱'}
  ]
];

let seviye=0, kelimeIdx=0, puan=0, durduruldu=false;
let mevcutKelimeData=null, yanlisSayaci=0;

const alan = document.getElementById('yapbozAlan');
const puanEl = document.getElementById('yapbozScore');
const seviyeEl = document.getElementById('yapbozSeviyeText');
const kelimeEl = document.getElementById('yapbozKelimeText');

function render(){
  if(!alan || durduruldu) return;
  mevcutKelimeData = SEViYELER[seviye][kelimeIdx];
  const kelime = mevcutKelimeData.kelime;
  yanlisSayaci = 0;

  if(seviyeEl) seviyeEl.textContent = `Seviye ${seviye + 1} / 5`;
  if(kelimeEl) kelimeEl.textContent = `Kelime ${kelimeIdx + 1} / 5`;

  // Harfleri karıştır
  const karisikHarfler = shuffle(kelime.split(''));

  alan.innerHTML = `
    <div class="yapboz-emoji-alan" style="font-size:4rem; margin-bottom:20px; text-align:center;">${mevcutKelimeData.emoji}</div>
    <div class="harf-kutu-satir" id="yapbozKutular" style="display:flex; justify-content:center; gap:10px; margin-bottom:30px;"></div>
    <div class="harf-buton-satir" id="yapbozButonlar" style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;"></div>
  `;

  // Boş kutular (Hedef)
  const kutularDiv = document.getElementById('yapbozKutular');
  for(let i=0; i<kelime.length; i++){
    const div = document.createElement('div');
    div.className = 'harf-kutu';
    div.style = "width:50px; height:60px; border:3px dashed #ccc; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:bold; border-radius:8px; background:#f9f9f9;";
    div.id = `hedef_${i}`;
    div.textContent = '?';
    kutularDiv.appendChild(div);
  }

  // Harf butonları
  const butonlarDiv = document.getElementById('yapbozButonlar');
  karisikHarfler.forEach((harf, i) => {
    const btn = document.createElement('button');
    btn.className = 'harf-btn';
    btn.style = "padding:15px 20px; font-size:1.5rem; cursor:pointer; background:#fff; border:2px solid #333; border-radius:10px; box-shadow:0 4px 0 #333; transition:0.2s;";
    btn.textContent = harf;
    btn.onclick = () => harfKontrol(harf, btn);
    butonlarDiv.appendChild(btn);
  });
}

function harfKontrol(secilenHarf, btn) {
  const kelime = mevcutKelimeData.kelime;
  const siradakiIndex = Array.from(document.querySelectorAll('.harf-kutu')).findIndex(k => k.textContent === '?');
  const dogruHarf = kelime[siradakiIndex];

  if (secilenHarf === dogruHarf) {
    // DOĞRU
    const kutu = document.getElementById(`hedef_${siradakiIndex}`);
    kutu.textContent = secilenHarf;
    kutu.style.border = "3px solid #4CAF50";
    kutu.style.background = "#e8f5e9";
    btn.style.visibility = "hidden";
    playTone(440, 0.1); // İnce ses
    yanlisSayaci = 0;

    // Kelime Bitti mi?
    if (Array.from(document.querySelectorAll('.harf-kutu')).every(k => k.textContent !== '?')) {
      tamamla();
    }
  } else {
    // YANLIŞ
    yanlisSayaci++;
    btn.style.animation = "shake 0.4s";
    btn.style.background = "#ffcdd2";
    playTone(150, 0.2); // Kalın ses
    
    setTimeout(() => { 
        btn.style.animation = ""; 
        btn.style.background = "#fff";
    }, 400);

    // 2. Yanlışta ipucu (Doğru harf yeşil yanar)
    if (yanlisSayaci >= 2) {
      const butunButonlar = document.querySelectorAll('.harf-btn');
      butunButonlar.forEach(b => {
        if (b.textContent === dogruHarf && b.style.visibility !== "hidden") {
          b.style.background = "#81C784";
          setTimeout(() => b.style.background = "#fff", 1000);
        }
      });
    }
  }
}

function tamamla() {
  puan += 50;
  if(puanEl) puanEl.textContent = puan;
  playWinMusic();
  
  // Konfeti efekti (Eğer kütüphane yoksa basit bir alert veya animasyon)
  const emojiAlan = document.querySelector('.yapboz-emoji-alan');
  emojiAlan.style.transform = "scale(1.5)";
  emojiAlan.style.transition = "0.5s";

  setTimeout(() => {
    kelimeIdx++;
    if (kelimeIdx >= SEViYELER[seviye].length) {
      seviye++;
      kelimeIdx = 0;
    }
    if (seviye >= SEViYELER.length) {
      alert("Tebrikler! Tüm Eğitim Tamamlandı!");
      window.yapbozBas();
    } else {
      render();
    }
  }, 1500);
}

// YARDIMCI FONKSİYONLAR
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playTone(freq, duration) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.1, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.start(); osc.stop(ctx.currentTime + duration);
}

function playWinMusic() {
  [523, 659, 784, 1046].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3), i * 150);
  });
}

// Shake animasyonu için CSS ekle
const style = document.createElement('style');
style.innerHTML = `
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); border-color: red; }
    50% { transform: translateX(5px); border-color: red; }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
`;
document.head.appendChild(style);

window.yapbozBas = function() {
  durduruldu = false; seviye = 0; kelimeIdx = 0; puan = 0;
  if(puanEl) puanEl.textContent = 0;
  render();
};

window.yapbozBas();

})();

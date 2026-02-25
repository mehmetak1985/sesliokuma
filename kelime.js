"use strict";

// ═══════════════════════════════════════════════════════════════
// KELİME OYUNU — kelime.js
// Sürükle-bırak (touch + mouse), 5 seviye, her seviye 5 kelime
// ═══════════════════════════════════════════════════════════════

const KELIME_SEVIYELERI = [
  // Seviye 1 — 3 harf
  [
    { kelime: 'kap', emoji: '🏺' },
    { kelime: 'top', emoji: '⚽' },
    { kelime: 'bal', emoji: '🍯' },
    { kelime: 'göz', emoji: '👁️' },
    { kelime: 'kol', emoji: '💪' },
  ],
  // Seviye 2 — 4 harf
  [
    { kelime: 'kedi', emoji: '🐱' },
    { kelime: 'kova', emoji: '🪣' },
    { kelime: 'elma', emoji: '🍎' },
    { kelime: 'balık', emoji: '🐟' },
    { kelime: 'arı', emoji: '🐝' },
  ],
  // Seviye 3 — 5 harf
  [
    { kelime: 'okul', emoji: '🏫' },
    { kelime: 'çiçek', emoji: '🌸' },
    { kelime: 'kitap', emoji: '📚' },
    { kelime: 'bebek', emoji: '👶' },
    { kelime: 'ekmek', emoji: '🍞' },
  ],
  // Seviye 4 — 6 harf
  [
    { kelime: 'tavşan', emoji: '🐰' },
    { kelime: 'portakal', emoji: '🍊' },
    { kelime: 'köpek', emoji: '🐶' },
    { kelime: 'bisiklet', emoji: '🚲' },
    { kelime: 'çanta', emoji: '🎒' },
  ],
  // Seviye 5 — 7 harf
  [
    { kelime: 'uçurtma', emoji: '🪁' },
    { kelime: 'yapboz', emoji: '🧩' },
    { kelime: 'dondurma', emoji: '🍦' },
    { kelime: 'kelebek', emoji: '🦋' },
    { kelime: 'kalemlik', emoji: '✏️' },
  ],
];

// ── State ──────────────────────────────────────────────────────
let ko = {
  seviye: 0,
  kelimeIdx: 0,
  skor: 0,
  aktif: false,
  yerlestirilen: [],   // her slot için yerleştirilen harf
  harfler: [],         // karıştırılmış harf listesi
  dragSrc: null,       // sürüklenen harf elementi
};

// ── Ekran ──────────────────────────────────────────────────────
let koEkran = null;

function koEkranOlustur() {
  if (koEkran) return;

  koEkran = document.createElement('div');
  koEkran.id = 'kelimeOyunuEkran';
  koEkran.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:500',
    'overflow-y:auto',
    'flex-direction:column',
    'align-items:center',
    'padding:20px 0 40px',
  ].join(';');

  koEkran.innerHTML = `
    <div class="koyun-screen" style="gap:16px;max-width:500px;">

      <div style="width:100%;display:flex;align-items:center;justify-content:space-between;">
        <button id="koGeriBtn" class="btn-back">← Menü</button>
        <div class="koyun-score-badge">⭐ <span id="koSkor">0</span></div>
      </div>

      <div style="width:100%;text-align:center;">
        <h2 class="koyun-title" style="margin-bottom:4px;">Minik 📖 Okur</h2>
        <div class="subtitle" id="koSeviyeText">Seviye 1 — Kelime 1 / 5</div>
      </div>

      <!-- İlerleme barı -->
      <div style="width:100%;background:rgba(255,255,255,0.25);border-radius:8px;height:8px;overflow:hidden;">
        <div id="koProgressBar" style="height:100%;background:#f9a825;border-radius:8px;width:0%;transition:width 0.4s;"></div>
      </div>

      <!-- Emoji görseli -->
      <div class="koyun-card" id="koKart" style="min-height:160px;gap:10px;">
        <div id="koEmoji" style="font-size:5rem;line-height:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.15));"></div>
        <!-- Harf slotları (boşluklar) -->
        <div id="koSlotlar" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;"></div>
      </div>

      <!-- Geri bildirim -->
      <div id="koSonuc" class="koyun-result" style="min-height:36px;"></div>

      <!-- Harf butonları (sürüklenecek) -->
      <div id="koHarfler" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:380px;"></div>

      <!-- Geç butonu -->
      <button class="btn btn-skip" id="koBtnGec" style="padding:12px 28px;align-self:center;">Geç ⏭</button>

    </div>
  `;

  document.body.appendChild(koEkran);
  document.getElementById('koGeriBtn').onclick = kelimeOyunuDurdur;
  document.getElementById('koBtnGec').onclick = koGec;
}

// ── Aç / Kapat ─────────────────────────────────────────────────
window.kelimeOyunuBas = function () {
  koEkranOlustur();
  ko.seviye = 0;
  ko.kelimeIdx = 0;
  ko.skor = 0;
  ko.aktif = true;
  var ks = document.getElementById('koyunScreen');
if(ks) ks.style.display = 'none';
  koEkran.style.display = 'flex';
  koKelimeGoster();
};

window.kelimeOyunuDurdur = function () {
  if (koEkran) koEkran.style.display = 'none';
  ko.aktif = false;
  // Skoru ana oyuna aktar
  if (typeof window.koyunSkoru === 'function') window.koyunSkoru(0);
  // Menüye dön
  var kd = document.getElementById('kelimeDunyaScreen');
  if (kd) {
    kd.style.display = '';
    kd.classList.remove('fade-in');
    void kd.offsetWidth;
    kd.classList.add('fade-in');
  }
};

// ── Kelime Göster ──────────────────────────────────────────────
function koKelimeGoster() {
  const seviyeData = KELIME_SEVIYELERI[ko.seviye];
  const veri = seviyeData[ko.kelimeIdx];
  const kelime = veri.kelime;
  const toplam = seviyeData.length;
  const seviyeSayisi = KELIME_SEVIYELERI.length;

  // Başlık
  document.getElementById('koSeviyeText').textContent =
    'Seviye ' + (ko.seviye + 1) + ' — Kelime ' + (ko.kelimeIdx + 1) + ' / ' + toplam;

  // İlerleme
  const toplamKelime = seviyeSayisi * toplam;
  const gecilen = ko.seviye * toplam + ko.kelimeIdx;
  document.getElementById('koProgressBar').style.width =
    Math.round((gecilen / toplamKelime) * 100) + '%';

  document.getElementById('koSkor').textContent = ko.skor;
  document.getElementById('koSonuc').textContent = '';
  document.getElementById('koSonuc').className = 'koyun-result';

  // Emoji
  document.getElementById('koEmoji').textContent = veri.emoji;

  // Slotlar
  ko.yerlestirilen = new Array(kelime.length).fill(null);
  const slotDiv = document.getElementById('koSlotlar');
  slotDiv.innerHTML = '';
  for (let i = 0; i < kelime.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'harf-kutu harf-kutu--bos';
    slot.dataset.slotIndex = i;
    slot.textContent = '';
    koSlotOlayEkle(slot);
    slotDiv.appendChild(slot);
  }

  // Harfleri karıştır
  ko.harfler = kelime.split('');
  koKaristir(ko.harfler);

  const harfDiv = document.getElementById('koHarfler');
  harfDiv.innerHTML = '';
  ko.harfler.forEach((harf, i) => {
    const btn = document.createElement('div');
    btn.className = 'harf-btn';
    btn.textContent = harf;
    btn.dataset.harfIndex = i;
    btn.draggable = true;
    btn.style.cursor = 'grab';
    koDragOlayEkle(btn);
    koTouchOlayEkle(btn);
    harfDiv.appendChild(btn);
  });
}

// ── Karıştır ───────────────────────────────────────────────────
function koKaristir(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Drag & Drop (Mouse) ────────────────────────────────────────
function koDragOlayEkle(btn) {
  btn.addEventListener('dragstart', e => {
    ko.dragSrc = btn;
    btn.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', btn.dataset.harfIndex);
  });
  btn.addEventListener('dragend', () => {
    btn.style.opacity = '';
    ko.dragSrc = null;
  });
}

function koSlotOlayEkle(slot) {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    slot.style.borderColor = '#43a047';
    slot.style.background = 'rgba(67,160,71,0.15)';
  });
  slot.addEventListener('dragleave', () => {
    if (!slot.classList.contains('harf-kutu--dogru')) {
      slot.style.borderColor = '';
      slot.style.background = '';
    }
  });
  slot.addEventListener('drop', e => {
    e.preventDefault();
    slot.style.borderColor = '';
    slot.style.background = '';
    if (!ko.dragSrc) return;
    const slotIdx = parseInt(slot.dataset.slotIndex);
    if (ko.yerlestirilen[slotIdx] !== null) return; // dolu slot
    koYerlestir(ko.dragSrc, slot, slotIdx);
  });
}

// ── Touch Sürükle-Bırak ────────────────────────────────────────
let touchKlonu = null;
let touchAktifBtn = null;

function koTouchOlayEkle(btn) {
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    touchAktifBtn = btn;
    btn.style.opacity = '0.4';

    // Görsel klon oluştur
    touchKlonu = btn.cloneNode(true);
    touchKlonu.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:9999',
      'opacity:0.85',
      'transform:scale(1.15)',
      'width:' + btn.offsetWidth + 'px',
      'height:' + btn.offsetHeight + 'px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-family:Baloo 2,cursive',
      'font-size:1.8rem',
      'font-weight:800',
      'background:linear-gradient(135deg,#fff9c4,#fff176)',
      'border-radius:18px',
      'box-shadow:0 8px 24px rgba(0,0,0,0.25)',
    ].join(';');
    document.body.appendChild(touchKlonu);
    koTouchHareketEt(e.touches[0]);
  }, { passive: false });

  btn.addEventListener('touchmove', e => {
    e.preventDefault();
    koTouchHareketEt(e.touches[0]);
  }, { passive: false });

  btn.addEventListener('touchend', e => {
    e.preventDefault();
    btn.style.opacity = '';

    if (touchKlonu) { touchKlonu.remove(); touchKlonu = null; }

    const touch = e.changedTouches[0];
    const hedef = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!hedef) { touchAktifBtn = null; return; }

    // Slot mu?
    const slot = hedef.closest('[data-slot-index]');
    if (slot && touchAktifBtn) {
      const slotIdx = parseInt(slot.dataset.slotIndex);
      if (ko.yerlestirilen[slotIdx] === null) {
        koYerlestir(touchAktifBtn, slot, slotIdx);
      }
    }
    touchAktifBtn = null;
  }, { passive: false });
}

function koTouchHareketEt(touch) {
  if (!touchKlonu) return;
  touchKlonu.style.left = (touch.clientX - touchKlonu.offsetWidth / 2) + 'px';
  touchKlonu.style.top = (touch.clientY - touchKlonu.offsetHeight / 2) + 'px';
}

// ── Yerleştir ──────────────────────────────────────────────────
function koYerlestir(harfBtn, slot, slotIdx) {
  const harf = harfBtn.textContent;
  const kelime = KELIME_SEVIYELERI[ko.seviye][ko.kelimeIdx].kelime;
  const dogru = kelime[slotIdx] === harf;

  // Slota yaz
  slot.textContent = harf;
  slot.style.borderStyle = 'solid';
  ko.yerlestirilen[slotIdx] = harf;

  if (dogru) {
    slot.classList.remove('harf-kutu--bos');
    slot.classList.add('harf-kutu--dogru');
    harfBtn.style.visibility = 'hidden';
    harfBtn.draggable = false;
  } else {
    // Yanlış — geri al
    ko.yerlestirilen[slotIdx] = null;
    slot.textContent = '';
    slot.style.borderStyle = '';
    slot.classList.add('harf-kutu--bos');
    harfBtn.classList.add('harf-btn--yanlis');
    setTimeout(() => harfBtn.classList.remove('harf-btn--yanlis'), 400);
    const sonuc = document.getElementById('koSonuc');
    sonuc.textContent = 'Tekrar dene!';
    sonuc.className = 'koyun-result yanlis';
    setTimeout(() => { sonuc.textContent = ''; sonuc.className = 'koyun-result'; }, 800);
    return;
  }

  // Hepsi tamam mı?
  if (ko.yerlestirilen.every((h, i) => h === kelime[i])) {
    koDogruKelime();
  }
}

// ── Doğru Kelime ───────────────────────────────────────────────
function koDogruKelime() {
  ko.skor += (ko.seviye + 1) * 2;
  document.getElementById('koSkor').textContent = ko.skor;

  const sonuc = document.getElementById('koSonuc');
  sonuc.textContent = 'Harika! ⭐';
  sonuc.className = 'koyun-result dogru';

  const kart = document.getElementById('koKart');
  kart.classList.add('correct-flash');
  setTimeout(() => kart.classList.remove('correct-flash'), 600);

  setTimeout(() => {
    sonuc.textContent = '';
    sonuc.className = 'koyun-result';
    koSonraki();
  }, 1000);
}

// ── Sonraki ────────────────────────────────────────────────────
function koSonraki() {
  ko.kelimeIdx++;
  const seviyeData = KELIME_SEVIYELERI[ko.seviye];

  if (ko.kelimeIdx >= seviyeData.length) {
    // Seviye bitti
    ko.kelimeIdx = 0;
    ko.seviye++;

    if (ko.seviye >= KELIME_SEVIYELERI.length) {
      // Oyun bitti
      koOyunBitti();
      return;
    }

    // Seviye geçiş mesajı
    const sonuc = document.getElementById('koSonuc');
    sonuc.textContent = 'Seviye ' + ko.seviye + ' tamamlandı! Devam ediyoruz...';
    sonuc.className = 'koyun-result dogru';
    setTimeout(() => {
      sonuc.textContent = '';
      sonuc.className = 'koyun-result';
      koKelimeGoster();
    }, 1500);
    return;
  }

  koKelimeGoster();
}

// ── Geç ───────────────────────────────────────────────────────
function koGec() {
  const sonuc = document.getElementById('koSonuc');
  sonuc.textContent = 'Geçildi...';
  sonuc.className = 'koyun-result';
  setTimeout(() => { sonuc.textContent = ''; sonuc.className = 'koyun-result'; koSonraki(); }, 600);
}

// ── Oyun Bitti ─────────────────────────────────────────────────
function koOyunBitti() {
  const kart = document.getElementById('koKart');
  kart.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 0;">
      <div style="font-size:3rem;">🏆</div>
      <div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:1.5rem;color:#7c3aed;">Tüm Seviyeler Tamam!</div>
      <div style="font-family:'Nunito',sans-serif;font-size:1.3rem;color:#f59e0b;font-weight:900;">⭐ ${ko.skor} puan!</div>
    </div>
  `;
  document.getElementById('koHarfler').innerHTML = '';
  document.getElementById('koSlotlar').innerHTML = '';

  // Skoru ana oyuna aktar
  if (typeof window.koyunSkoru === 'function') window.koyunSkoru(ko.skor);

  const gec = document.getElementById('koBtnGec');
  gec.textContent = '← Menüye Dön';
  gec.onclick = kelimeOyunuDurdur;
}

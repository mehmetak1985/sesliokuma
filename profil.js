"use strict";

// ═══════════════════════════════════════════════════════════════
//  PROFİL MODÜLÜ  (profil.js)
//  Bağımlılık: app.js'teki LS_KEY='minikOkur_v2' localStorage
//  Hiçbir mevcut dosyaya dokunmaz.
//  Dışa açılan API:
//    window.profilAc()         → profil ekranını aç
//    window.profilGuncelle()   → yıldız/rozet güncel verileri yenile
// ═══════════════════════════════════════════════════════════════

const PR_LS_KEY = 'minikOkur_v2';

// ─── Seviyeler ────────────────────────────────────────────────
const PR_SEVIYELER = [
  { min: 0,    max: 50,   unvan: 'Yıldız Okur',  emoji: '🌱', renk: '#81C784' },
  { min: 51,   max: 150,  unvan: 'Minik Okur',   emoji: '📖', renk: '#64B5F6' },
  { min: 151,  max: 300,  unvan: 'Süper Okur',   emoji: '⭐', renk: '#FFB300' },
  { min: 301,  max: 500,  unvan: 'Günün Okuru',  emoji: '🏆', renk: '#FF7043' },
  { min: 501,  max: 99999,unvan: 'Efsane Okur',  emoji: '👑', renk: '#AB47BC' },
];

// ─── Rozetler (app.js ile aynı + aktivite bazlı yeniler) ──────
const PR_ROZETLER = [
  // Puan bazlı (app.js ile uyumlu id'ler)
  { id: 'caliskan',      emoji: '⭐', baslik: 'Çalışkan',        aciklama: '50 yıldıza ulaştın!',   esik: 50,   tip: 'puan' },
  { id: 'harfUstasi',    emoji: '🔤', baslik: 'Harf Ustası',     aciklama: '150 yıldıza ulaştın!',  esik: 150,  tip: 'puan' },
  { id: 'kelimeUstasi',  emoji: '📖', baslik: 'Kelime Ustası',   aciklama: '300 yıldıza ulaştın!',  esik: 300,  tip: 'puan' },
  { id: 'yildizOkur',    emoji: '🌟', baslik: 'Yıldız Okur',    aciklama: '500 yıldıza ulaştın!',  esik: 500,  tip: 'puan' },
  { id: 'minikSampiyon', emoji: '🏅', baslik: 'Minik Şampiyon', aciklama: '750 yıldıza ulaştın!',  esik: 750,  tip: 'puan' },
  { id: 'superOkur',     emoji: '🏆', baslik: 'Süper Okur',     aciklama: '1000 yıldıza ulaştın!', esik: 1000, tip: 'puan' },
  { id: 'efsane',        emoji: '👑', baslik: 'Efsane',          aciklama: '1500 yıldıza ulaştın!', esik: 1500, tip: 'puan' },
  // Aktivite bazlı
  { id: 'ilkHikaye',     emoji: '📗', baslik: 'İlk Hikaye',      aciklama: 'İlk hikayeni bitirdin!', tip: 'aktivite' },
  { id: 'besHikaye',     emoji: '📚', baslik: 'Kitap Kurdu',     aciklama: '5 hikaye bitirdin!',     tip: 'aktivite' },
  { id: 'ilkSureli',     emoji: '⏱️', baslik: 'Hızlı Okur',     aciklama: 'İlk süreli okumayı tamamladın!', tip: 'aktivite' },
  { id: 'ilkOyun',       emoji: '🎮', baslik: 'Oyun Başladı',    aciklama: 'İlk oyunu oynadın!',    tip: 'aktivite' },
];

// ─── Veri oku ─────────────────────────────────────────────────
function pr_veriOku() {
  try {
    const d = JSON.parse(localStorage.getItem(PR_LS_KEY) || 'null');
    return {
      totalScore:        (d && d.totalScore)        || 0,
      kazanilanRozetler: (d && Array.isArray(d.kazanilanRozetler)) ? d.kazanilanRozetler : [],
      profilRozetler:    (d && Array.isArray(d.profilRozetler))    ? d.profilRozetler    : [],
      hikayeSayisi:      (d && d.hikayeSayisi)       || 0,
      sureliSayisi:      (d && d.sureliSayisi)       || 0,
      oyunSayisi:        (d && d.oyunSayisi)         || 0,
    };
  } catch(e) { return { totalScore:0, kazanilanRozetler:[], profilRozetler:[], hikayeSayisi:0, sureliSayisi:0, oyunSayisi:0 }; }
}

function pr_veriYaz(guncelleme) {
  try {
    const mevcut = JSON.parse(localStorage.getItem(PR_LS_KEY) || '{}');
    const yeni = Object.assign({}, mevcut, guncelleme);
    localStorage.setItem(PR_LS_KEY, JSON.stringify(yeni));
  } catch(e) {}
}

// ─── Seviye hesapla ───────────────────────────────────────────
function pr_seviyeHesapla(yildiz) {
  for (let i = PR_SEVIYELER.length - 1; i >= 0; i--) {
    if (yildiz >= PR_SEVIYELER[i].min) return { ...PR_SEVIYELER[i], index: i };
  }
  return { ...PR_SEVIYELER[0], index: 0 };
}

function pr_sonrakiSeviye(yildiz) {
  for (let i = 0; i < PR_SEVIYELER.length; i++) {
    if (yildiz <= PR_SEVIYELER[i].max) return PR_SEVIYELER[i];
  }
  return PR_SEVIYELER[PR_SEVIYELER.length - 1];
}

// ─── Kazanılan tüm rozetler (puan + aktivite) ─────────────────
function pr_tumKazanilanlar(veri) {
  const liste = [...veri.kazanilanRozetler, ...veri.profilRozetler];
  return [...new Set(liste)];
}

// ─── Kutlama animasyonu ───────────────────────────────────────
function pr_kutlamaGoster(emoji, baslik, aciklama) {
  // Mevcut kutlama varsa kaldır
  const eski = document.getElementById('prKutlama');
  if (eski) eski.remove();

  const el = document.createElement('div');
  el.id = 'prKutlama';
  el.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9999',
    'display:flex', 'flex-direction:column',
    'align-items:center', 'justify-content:center',
    'background:rgba(0,0,0,0.55)',
    'animation:prFadeIn 0.3s ease'
  ].join(';');

  el.innerHTML = `
    <div style="background:white;border-radius:28px;padding:36px 32px;text-align:center;
                box-shadow:0 12px 48px rgba(0,0,0,0.25);max-width:300px;width:85%;
                animation:prPop 0.4s cubic-bezier(.34,1.56,.64,1);">
      <div style="font-size:4rem;line-height:1;margin-bottom:12px;" id="prKutlamaEmoji">${emoji}</div>
      <div style="font-family:'Fredoka One','Baloo 2',cursive;font-size:1.5rem;color:#FF8C00;margin-bottom:6px;">${baslik}</div>
      <div style="font-size:0.95rem;color:#555;margin-bottom:20px;">${aciklama}</div>
      <button onclick="document.getElementById('prKutlama').remove()"
              style="background:linear-gradient(135deg,#FF8C00,#ffaa44);color:white;border:none;
                     border-radius:99px;padding:10px 32px;font-size:1rem;font-family:'Nunito',sans-serif;
                     font-weight:800;cursor:pointer;">Harika! 🎉</button>
    </div>
  `;

  // Konfeti
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div');
    const renkler = ['#FF8C00','#FFD700','#FF5C8A','#64B5F6','#81C784','#AB47BC'];
    c.style.cssText = [
      'position:absolute',
      `left:${Math.random()*100}%`,
      `top:${-10 + Math.random()*30}%`,
      `width:${6+Math.random()*8}px`,
      `height:${6+Math.random()*8}px`,
      `background:${renkler[Math.floor(Math.random()*renkler.length)]}`,
      `border-radius:${Math.random()>0.5?'50%':'3px'}`,
      `animation:prKonfeti ${1.5+Math.random()*2}s ease-in ${Math.random()*0.5}s forwards`,
      'opacity:0'
    ].join(';');
    el.appendChild(c);
  }

  document.body.appendChild(el);

  // Ses
  pr_sesCal();

  // 4 saniye sonra otomatik kapat
  setTimeout(() => { if (document.getElementById('prKutlama')) el.remove(); }, 4000);
}

function pr_sesCal() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notalar = [523, 659, 784, 1047];
    notalar.forEach((frekans, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frekans;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
  } catch(e) {}
}

// CSS animasyonları ekle
(function() {
  if (document.getElementById('prAnimStyle')) return;
  const s = document.createElement('style');
  s.id = 'prAnimStyle';
  s.textContent = `
    @keyframes prFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes prPop { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes prKonfeti {
      0%   { opacity:1; transform: translateY(0) rotate(0deg); }
      100% { opacity:0; transform: translateY(80vh) rotate(720deg); }
    }
    @keyframes prBarDolum { from{width:0%} to{width:var(--pr-bar-w)} }
    .pr-rozet-kart { transition: transform 0.15s; cursor:default; }
    .pr-rozet-kart.kazanildi:active { transform: scale(0.95); }
  `;
  document.head.appendChild(s);
})();

// ─── Rozet kontrolü (aktivite bazlı) ──────────────────────────
function pr_rozetKontrol() {
  const veri = pr_veriOku();
  const kazanilan = pr_tumKazanilanlar(veri);
  const yeniKazanilanlar = [];

  PR_ROZETLER.forEach(r => {
    if (kazanilan.includes(r.id)) return;
    let kazan = false;

    if (r.tip === 'aktivite') {
      if (r.id === 'ilkHikaye'  && veri.hikayeSayisi >= 1)  kazan = true;
      if (r.id === 'besHikaye'  && veri.hikayeSayisi >= 5)  kazan = true;
      if (r.id === 'ilkSureli'  && veri.sureliSayisi >= 1)  kazan = true;
      if (r.id === 'ilkOyun'    && veri.oyunSayisi   >= 1)  kazan = true;
    }

    if (kazan) {
      yeniKazanilanlar.push(r.id);
    }
  });

  if (yeniKazanilanlar.length > 0) {
    const yeniListe = [...veri.profilRozetler, ...yeniKazanilanlar];
    pr_veriYaz({ profilRozetler: [...new Set(yeniListe)] });

    // Kutlamayı sırayla göster
    yeniKazanilanlar.forEach((id, i) => {
      const rozet = PR_ROZETLER.find(r => r.id === id);
      if (rozet) {
        setTimeout(() => pr_kutlamaGoster(rozet.emoji, rozet.baslik + ' Rozeti!', rozet.aciklama), i * 1200);
      }
    });
  }
}

// ─── Seviye atlama kontrolü ───────────────────────────────────
let pr_oncekiSeviyeIndex = -1;

function pr_seviyeKontrol(yildiz) {
  const seviye = pr_seviyeHesapla(yildiz);
  if (pr_oncekiSeviyeIndex === -1) {
    pr_oncekiSeviyeIndex = seviye.index;
    return;
  }
  if (seviye.index > pr_oncekiSeviyeIndex) {
    pr_oncekiSeviyeIndex = seviye.index;
    setTimeout(() => pr_kutlamaGoster(seviye.emoji, seviye.unvan + ' oldun!', 'Tebrikler! Yeni seviyeye ulaştın! 🎉'), 600);
  }
}

// ─── Profil Ekranı ────────────────────────────────────────────
let prEkran = null;

function pr_ekranOlustur() {
  if (prEkran) return;

  prEkran = document.createElement('div');
  prEkran.id = 'profilEkrani';
  prEkran.style.cssText = [
    'display:none', 'position:fixed', 'inset:0', 'z-index:600',
    'overflow-y:auto', 'flex-direction:column', 'align-items:center',
    'padding:20px 0 40px',
    'background:linear-gradient(180deg,#87CEEB 0%,#a8e6a3 100%)'
  ].join(';');

  prEkran.innerHTML = `
    <div style="width:min(94vw,480px);display:flex;flex-direction:column;align-items:center;gap:16px;padding:0 0 20px;">

      <!-- Geri butonu -->
      <button id="prGeriBtn" style="align-self:flex-start;background:rgba(255,255,255,0.85);
        border:none;border-radius:99px;padding:8px 18px;font-family:'Nunito',sans-serif;
        font-weight:800;font-size:0.9rem;cursor:pointer;color:#333;">← Menü</button>

      <!-- Profil kartı -->
      <div style="width:100%;background:rgba(255,255,255,0.95);border-radius:24px;
                  padding:24px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.12);box-sizing:border-box;">

        <!-- Seviye emoji + unvan -->
        <div style="text-align:center;margin-bottom:16px;">
          <div id="prSeviyeEmoji" style="font-size:3.5rem;line-height:1;margin-bottom:6px;">🌱</div>
          <div id="prUnvan" style="font-family:'Fredoka One','Baloo 2',cursive;font-size:1.6rem;color:#FF8C00;"></div>
        </div>

        <!-- Yıldız sayısı -->
        <div style="text-align:center;margin-bottom:14px;">
          <span style="font-family:'Fredoka One','Baloo 2',cursive;font-size:2rem;color:#FFB300;">⭐</span>
          <span id="prYildizSayi" style="font-family:'Fredoka One','Baloo 2',cursive;font-size:2rem;color:#FFB300;"></span>
          <span style="font-size:0.9rem;color:#888;font-family:'Nunito',sans-serif;margin-left:4px;">yıldız</span>
        </div>

        <!-- Progress bar -->
        <div style="margin-bottom:6px;">
          <div style="background:#f0f0f0;border-radius:99px;height:16px;overflow:hidden;position:relative;">
            <div id="prBar" style="height:100%;border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);width:0%;"></div>
          </div>
          <div id="prBarText" style="text-align:right;font-size:0.75rem;color:#888;font-family:'Nunito',sans-serif;margin-top:3px;"></div>
        </div>
      </div>

      <!-- İstatistikler -->
      <div style="width:100%;background:rgba(255,255,255,0.95);border-radius:24px;
                  padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.12);box-sizing:border-box;">
        <div style="font-family:'Fredoka One','Baloo 2',cursive;font-size:1.1rem;color:#555;margin-bottom:14px;">📊 İstatistikler</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;" id="prIstatGrid"></div>
      </div>

      <!-- Rozetler -->
      <div style="width:100%;background:rgba(255,255,255,0.95);border-radius:24px;
                  padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.12);box-sizing:border-box;">
        <div style="font-family:'Fredoka One','Baloo 2',cursive;font-size:1.1rem;color:#555;margin-bottom:14px;">🏅 Rozetlerim</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;" id="prRozetGrid"></div>
      </div>

    </div>
  `;

  document.body.appendChild(prEkran);

  document.getElementById('prGeriBtn').addEventListener('click', () => {
    prEkran.style.display = 'none';
    const menu = document.getElementById('menuScreen');
    if (menu) {
      menu.style.display = '';
      menu.classList.remove('fade-in');
      void menu.offsetWidth;
      menu.classList.add('fade-in');
    }
  });
}

function pr_ekranDoldur() {
  const veri = pr_veriOku();
  const yildiz = veri.totalScore;
  const seviye = pr_seviyeHesapla(yildiz);
  const sonraki = pr_sonrakiSeviye(yildiz);
  const kazanilan = pr_tumKazanilanlar(veri);

  // Seviye bilgisi
  document.getElementById('prSeviyeEmoji').textContent = seviye.emoji;
  document.getElementById('prUnvan').textContent = seviye.unvan;
  document.getElementById('prYildizSayi').textContent = yildiz;

  // Progress bar
  const bar = document.getElementById('prBar');
  const barText = document.getElementById('prBarText');
  const aralik = sonraki.max - seviye.min;
  const ilerleme = yildiz - seviye.min;
  const yuzde = seviye.index === PR_SEVIYELER.length - 1 ? 100 : Math.min(100, Math.round((ilerleme / aralik) * 100));
  bar.style.background = seviye.renk;
  setTimeout(() => { bar.style.width = yuzde + '%'; }, 100);

  if (seviye.index === PR_SEVIYELER.length - 1) {
    barText.textContent = 'Maksimum seviye! 👑';
  } else {
    barText.textContent = `${yildiz} / ${sonraki.max + 1} → ${PR_SEVIYELER[seviye.index + 1].unvan}`;
  }

  // İstatistikler
  const grid = document.getElementById('prIstatGrid');
  const istatlar = [
    { emoji: '📖', sayi: veri.hikayeSayisi, etiket: 'Hikaye' },
    { emoji: '⏱️', sayi: veri.sureliSayisi, etiket: 'Süreli' },
    { emoji: '🎮', sayi: veri.oyunSayisi,   etiket: 'Oyun' },
  ];
  grid.innerHTML = istatlar.map(s => `
    <div style="background:#f8f8f8;border-radius:14px;padding:12px 8px;text-align:center;">
      <div style="font-size:1.6rem;">${s.emoji}</div>
      <div style="font-family:'Fredoka One','Baloo 2',cursive;font-size:1.4rem;color:#FF8C00;">${s.sayi}</div>
      <div style="font-size:0.72rem;color:#888;font-family:'Nunito',sans-serif;">${s.etiket}</div>
    </div>
  `).join('');

  // Rozetler
  const rozetGrid = document.getElementById('prRozetGrid');
  rozetGrid.innerHTML = PR_ROZETLER.map(r => {
    const aktif = kazanilan.includes(r.id);
    return `
      <div class="pr-rozet-kart ${aktif ? 'kazanildi' : ''}"
           title="${aktif ? r.aciklama : '???'}"
           style="background:${aktif ? '#FFF9C4' : '#f0f0f0'};border-radius:14px;
                  padding:10px 6px;text-align:center;border:2px solid ${aktif ? '#FFD700' : '#ddd'};">
        <div style="font-size:1.8rem;${aktif ? '' : 'filter:grayscale(1) opacity(0.3);'}">${r.emoji}</div>
        <div style="font-size:0.68rem;font-family:'Nunito',sans-serif;font-weight:700;
                    color:${aktif ? '#555' : '#aaa'};margin-top:4px;line-height:1.2;">
          ${aktif ? r.baslik : '???'}
        </div>
      </div>
    `;
  }).join('');
}

// ─── Global API ───────────────────────────────────────────────

// Profil ekranını aç
window.profilAc = function() {
  pr_ekranOlustur();
  pr_ekranDoldur();
  prEkran.style.display = 'flex';
  const menu = document.getElementById('menuScreen');
  if (menu) menu.style.display = 'none';
};

// Profil verilerini güncelle (diğer modüller çağırır)
window.profilGuncelle = function() {
  if (prEkran && prEkran.style.display !== 'none') pr_ekranDoldur();
};

// Aktivite kaydet + rozet/seviye kontrol et
window.profilAktiviteKaydet = function(tip) {
  // tip: 'hikaye' | 'sureli' | 'oyun'
  const veri = pr_veriOku();
  const yildizOncesi = veri.totalScore;

  const guncelleme = {};
  if (tip === 'hikaye') guncelleme.hikayeSayisi = (veri.hikayeSayisi || 0) + 1;
  if (tip === 'sureli')  guncelleme.sureliSayisi = (veri.sureliSayisi || 0) + 1;
  if (tip === 'oyun')    guncelleme.oyunSayisi   = (veri.oyunSayisi   || 0) + 1;

  pr_veriYaz(guncelleme);
  pr_rozetKontrol();

  // Seviye atlama kontrolü
  const yeniVeri = pr_veriOku();
  pr_seviyeKontrol(yeniVeri.totalScore);
};

// app.js'teki kontrolRozetler fonksiyonu çağrıldığında seviye de kontrol edilsin
// app.js'e dokunmadan: koyunSkoru'nun üzerine sarıyoruz
(function() {
  const orijinal = window.koyunSkoru;
  window.koyunSkoru = function(puan) {
    if (typeof orijinal === 'function') orijinal(puan);
    const veri = pr_veriOku();
    pr_seviyeKontrol(veri.totalScore);
  };
})();

// Sayfa yüklenince seviye indexini başlat
document.addEventListener('DOMContentLoaded', function() {
  const veri = pr_veriOku();
  const seviye = pr_seviyeHesapla(veri.totalScore);
  pr_oncekiSeviyeIndex = seviye.index;

  // Menüye profil butonu ekle (hamburger menüsüne)
  const hmenuItems = document.querySelector('.hmenu-items');
  if (hmenuItems) {
    const profilBtn = document.createElement('button');
    profilBtn.className = 'hmenu-item';
    profilBtn.innerHTML = '<span class="hmenu-icon">🌟</span><span class="hmenu-label">Profilim</span>';
    profilBtn.addEventListener('click', () => {
      // Hamburger menüsünü kapat
      const overlay = document.getElementById('hmenuOverlay');
      if (overlay) overlay.classList.remove('open');
      window.profilAc();
    });
    // En üste ekle
    hmenuItems.insertBefore(profilBtn, hmenuItems.firstChild);
  }
});

(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════
     UZAY YOLU — Minik Okur  v2
     MEB 1. Sınıf uyumlu kelime tanıma oyunu
     5 Gezegen × 5 Kelime = 25 Soru
  ═══════════════════════════════════════════════════════════════ */

  // ── CSS ─────────────────────────────────────────────────────────
  (function injectCSS() {
    if (document.getElementById('uzay-style')) return;
    const s = document.createElement('style');
    s.id = 'uzay-style';
    s.textContent = `
/* ── Tema Arka Plan Overlay ── */
.uy-tema-bg {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
  transition: background 0.8s ease, opacity 0.8s ease;
  opacity: 0;
}
.uy-tema-bg.aktif { opacity: 1; }

/* ── Gezegen Dekoratif (oyun içi sağ üst) ── */
.uy-gezegen-deko {
  position: absolute; top: -10px; right: -10px;
  opacity: 0.18; pointer-events: none;
  transform: rotate(15deg);
  z-index: 0;
}

/* ── Menü ── */
.uy-menu {
  display: flex; flex-direction: column; align-items: center;
  gap: 18px; width: 100%; padding: 8px 0;
}
.uy-menu-baslik {
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: clamp(1.7rem, 6vw, 2.6rem); color: #fff;
  text-shadow: 0 3px 0 #f9a825, 0 6px 0 rgba(0,0,0,0.15);
  text-align: center; letter-spacing: 1px;
}
.uy-menu-alt {
  font-family: 'Nunito', sans-serif; font-weight: 700;
  font-size: 0.95rem; color: #1a2744;
  background: rgba(255,255,255,0.82); display: inline-block;
  padding: 4px 18px; border-radius: 50px; margin-top: -6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.uy-gezegen-liste {
  display: flex; flex-direction: column; gap: 12px; width: 100%;
}
.uy-gezegen-kart {
  width: 100%; background: rgba(255,255,255,0.92);
  border: 3px solid var(--gold); border-radius: var(--radius-lg);
  padding: 14px 20px; display: flex; align-items: center; gap: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-card), 0 0 0 4px rgba(255,214,0,0.1);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  position: relative; overflow: hidden;
}
.uy-gezegen-kart:hover:not(.uy-kilitli) {
  transform: translateY(-3px) scale(1.01);
  box-shadow: var(--shadow-card), 0 0 0 6px rgba(255,214,0,0.25);
}
.uy-gezegen-kart.uy-kilitli { opacity: 0.45; cursor: not-allowed; filter: grayscale(0.5); }
.uy-gezegen-kart.uy-tamamlandi {
  border-color: var(--green);
  background: linear-gradient(135deg, #f1fdf2, #e8f5e9);
}
.uy-gezegen-svg { flex-shrink: 0; }
.uy-gezegen-bilgi { flex: 1; }
.uy-gezegen-adi {
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1.15rem; color: var(--text-dark);
}
.uy-gezegen-aciklama {
  font-family: 'Nunito', sans-serif; font-weight: 700;
  font-size: 0.78rem; color: var(--text-mid); margin-top: 2px;
}
.uy-gezegen-yildiz { font-size: 1.1rem; letter-spacing: 2px; }
.uy-kilit-ikon { font-size: 1.4rem; opacity: 0.6; }
.uy-toplam-bar {
  width: 100%; background: rgba(255,255,255,0.82);
  border: 2px solid var(--gold); border-radius: 50px;
  padding: 8px 22px; display: flex; align-items: center;
  justify-content: center; gap: 8px;
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1rem; color: var(--orange); box-shadow: var(--shadow-gold);
}

/* ── Oyun ── */
.uy-oyun {
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; width: 100%; position: relative;
}
.uy-oyun-header {
  width: 100%; display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}
.uy-oyun-geri {
  background: rgba(255,255,255,0.75); border: 2px solid rgba(255,255,255,0.9);
  border-radius: 50px; color: var(--text-dark);
  font-family: 'Nunito', sans-serif; font-weight: 800;
  font-size: 0.85rem; padding: 7px 18px; cursor: pointer;
  transition: all 0.2s ease; backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.uy-oyun-geri:hover { background: rgba(255,255,255,0.95); transform: translateX(-3px); }
.uy-oyun-baslik {
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1.1rem; color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.25);
  display: flex; align-items: center; gap: 6px;
}
.uy-progress-wrap {
  width: 100%; background: rgba(255,255,255,0.3);
  border-radius: 50px; height: 8px; overflow: hidden;
}
.uy-progress-bar {
  height: 100%; border-radius: 50px;
  background: linear-gradient(90deg, var(--gold), var(--orange));
  transition: width 0.5s ease;
}

/* ── Manevra Bilgi Şeridi ── */
.uy-manevra-serit {
  width: 100%;
  background: rgba(255,255,255,0.15);
  border-radius: 50px;
  padding: 6px 18px;
  text-align: center;
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1rem; color: #fff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
}
.uy-manevra-serit.son { color: var(--gold); text-shadow: 0 0 12px rgba(255,214,0,0.6); }

/* ── Roket Alanı ── */
.uy-roket-alan {
  width: 100%; height: 72px; position: relative;
  display: flex; align-items: center; justify-content: center;
}
.uy-roket {
  font-size: 2.8rem; position: absolute;
  left: 8%; bottom: 4px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
  transition: left 0.7s cubic-bezier(0.34,1.56,0.64,1);
  animation: uyRoketFloat 2s ease-in-out infinite;
}
@keyframes uyRoketFloat {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
.uy-roket.uy-zipladi { animation: uyRoketZipla 0.6s ease forwards; }
@keyframes uyRoketZipla {
  0%   { transform: translateY(0) scale(1); }
  30%  { transform: translateY(-24px) scale(1.2); }
  60%  { transform: translateY(-10px) scale(1.05); }
  100% { transform: translateY(0) scale(1); }
}
.uy-roket.uy-sallandi { animation: uyRoketSalla 0.4s ease; }
@keyframes uyRoketSalla {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-10px) rotate(-5deg); }
  40%     { transform: translateX(10px) rotate(5deg); }
  60%     { transform: translateX(-6px) rotate(-3deg); }
  80%     { transform: translateX(6px) rotate(3deg); }
}
.uy-roket.uy-ucuyor {
  animation: uyRoketUc 1.4s ease-in forwards !important;
  transition: none !important;
}
@keyframes uyRoketUc {
  0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
  30%  { transform: translateY(-20px) scale(1.1) rotate(-5deg); opacity: 1; }
  100% { transform: translateY(-280px) scale(0.4) rotate(-15deg); opacity: 0; }
}
.uy-yol-track {
  position: absolute; bottom: 10px; left: 4%; right: 4%;
  height: 4px; background: rgba(255,255,255,0.25); border-radius: 4px;
}
.uy-yol-nokta {
  position: absolute; top: -6px; width: 16px; height: 16px;
  border-radius: 50%; background: rgba(255,255,255,0.4);
  border: 2px solid rgba(255,255,255,0.7);
  transform: translateX(-50%); transition: all 0.3s ease;
}
.uy-yol-nokta.gecildi {
  background: var(--gold); border-color: var(--orange);
  box-shadow: 0 0 10px rgba(255,214,0,0.7);
}
/* Hedef gezegen ikonu yolun sonunda */
.uy-yol-hedef {
  position: absolute; right: 0%; bottom: -6px;
  font-size: 1.5rem; transform: translateX(50%);
}

/* ── Soru Kartı ── */
.uy-soru-kart {
  width: 100%; background: rgba(255,255,255,0.95);
  border: 3px solid var(--gold); border-radius: var(--radius-lg);
  padding: 28px 24px 24px;
  display: flex; flex-direction: column; align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-card), 0 0 0 6px rgba(255,214,0,0.12);
  position: relative;
}
.uy-soru-kart::before {
  content: '🚀'; position: absolute; top: -16px; left: 50%;
  transform: translateX(-50%); font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.uy-emoji-alan {
  font-size: clamp(4.5rem, 16vw, 7rem); line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
  animation: uyEmojiFloat 3s ease-in-out infinite;
}
@keyframes uyEmojiFloat {
  0%,100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-10px) rotate(2deg); }
}

/* ── Seçenek Butonları ── */
.uy-secenekler {
  display: flex; gap: 10px; width: 100%; justify-content: center;
}
.uy-sec-btn {
  flex: 1; min-height: 64px; max-width: 190px;
  background: rgba(255,255,255,0.92);
  border: 3px solid rgba(255,255,255,0.7);
  border-radius: var(--radius-md);
  font-family: 'Baloo 2', cursive; font-weight: 800;
  font-size: clamp(1rem, 3.5vw, 1.3rem);
  color: var(--text-dark); cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
  position: relative; overflow: hidden;
}
.uy-sec-btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 60%);
  border-radius: inherit; pointer-events: none;
}
.uy-sec-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.04);
  box-shadow: var(--shadow-card), 0 0 18px rgba(255,214,0,0.35);
  border-color: var(--gold);
}
.uy-sec-btn:active:not(:disabled) { transform: scale(0.96); }
.uy-sec-btn.dogru {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9) !important;
  border-color: var(--green) !important; color: #2e7d32 !important;
  animation: uyDogru 0.4s ease;
}
@keyframes uyDogru {
  0%  { transform: scale(1); }
  40% { transform: scale(1.1) rotate(-1deg); }
  70% { transform: scale(0.97) rotate(1deg); }
  100%{ transform: scale(1) rotate(0deg); }
}
.uy-sec-btn.yanlis {
  background: linear-gradient(135deg, #ffebee, #ffcdd2) !important;
  border-color: var(--red) !important; color: var(--red) !important;
  animation: uyYanlis 0.35s ease;
}
@keyframes uyYanlis {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-8px); }
  40%     { transform: translateX(8px); }
  60%     { transform: translateX(-5px); }
  80%     { transform: translateX(5px); }
}
.uy-sec-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

/* ── Geri Bildirim Mesajı ── */
.uy-mesaj {
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1.1rem; text-align: center;
  padding: 8px 24px; border-radius: 50px; min-height: 38px;
  transition: all 0.3s ease;
}
.uy-mesaj.dogru-mesaj {
  background: linear-gradient(135deg, var(--green), #2e7d32);
  color: #fff; box-shadow: 0 4px 16px rgba(67,160,71,0.4);
  animation: uyMesajGel 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.uy-mesaj.yanlis-mesaj {
  background: linear-gradient(135deg, var(--red), #c62828);
  color: #fff; box-shadow: 0 4px 16px rgba(229,57,53,0.4);
  animation: uyMesajGel 0.35s ease;
}
@keyframes uyMesajGel {
  0%  { transform: scale(0.6) translateY(10px); opacity: 0; }
  100%{ transform: scale(1) translateY(0); opacity: 1; }
}

/* ── Yıldız Partikül ── */
.uy-yildiz-partikul {
  position: fixed; font-size: 1.6rem; pointer-events: none;
  z-index: 9999; animation: uyYildizUc 0.9s ease-out forwards;
}
@keyframes uyYildizUc {
  0%   { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-90px) scale(1.3) rotate(30deg); opacity: 0; }
}

/* ── Bitiş Modal ── */
.uy-bitis-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(10,40,80,0.75); backdrop-filter: blur(6px);
  z-index: 500; align-items: center; justify-content: center; padding: 20px;
}
.uy-bitis-overlay.acik { display: flex; animation: uyModalGel 0.35s ease; }
@keyframes uyModalGel {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
.uy-bitis-kart {
  background: linear-gradient(160deg, #fffde7, #fff9e6, #fff);
  border: 3px solid var(--gold); border-radius: 28px;
  padding: 32px 36px; width: min(92vw, 420px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.35), var(--shadow-gold);
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; text-align: center; position: relative; overflow: hidden;
}
.uy-bitis-kart::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px;
  background: linear-gradient(90deg, var(--gold), var(--orange), var(--red),
              var(--green), var(--blue), var(--purple), var(--gold));
}
.uy-bitis-emoji { font-size: 3.2rem; }
.uy-bitis-baslik {
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1.6rem; color: var(--orange);
}
.uy-bitis-alt {
  font-family: 'Nunito', sans-serif; font-weight: 700;
  font-size: 0.92rem; color: var(--text-mid); margin-top: -8px;
}
.uy-bitis-yildizlar { font-size: 2rem; letter-spacing: 4px; min-height: 44px; }
.uy-bitis-stat {
  font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 1rem; color: var(--text-dark);
  background: rgba(255,255,255,0.75); border: 2px solid rgba(0,0,0,0.07);
  border-radius: var(--radius-md); padding: 10px 24px;
}
.uy-bitis-butonlar { display: flex; gap: 12px; width: 100%; }
.uy-bitis-btn {
  flex: 1; font-family: 'Nunito', sans-serif; font-weight: 900;
  font-size: 0.95rem; padding: 13px 10px;
  border: none; border-radius: 50px; cursor: pointer;
  transition: all 0.2s ease; position: relative; overflow: hidden;
}
.uy-bitis-btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 60%);
  border-radius: inherit; pointer-events: none;
}
.uy-bitis-btn:active { transform: scale(0.96); }
.uy-bitis-btn.birincil {
  background: linear-gradient(135deg, var(--green), #2e7d32); color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.25);
  box-shadow: 0 5px 18px rgba(46,125,50,0.4); border-bottom: 3px solid #1b5e20;
}
.uy-bitis-btn.birincil:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,125,50,0.5); }
.uy-bitis-btn.ikincil {
  background: rgba(255,255,255,0.7); color: var(--text-mid);
  border: 2px solid rgba(0,0,0,0.1);
}
.uy-bitis-btn.ikincil:hover { background: rgba(255,255,255,0.95); }

/* ── Gezegen parlaması ── */
.gezegen-parlama { animation: gezegenParla 2s ease-in-out infinite; }
@keyframes gezegenParla {
  0%,100% { filter: drop-shadow(0 0 4px rgba(255,214,0,0.3)); }
  50%      { filter: drop-shadow(0 0 12px rgba(255,214,0,0.7)); }
}
    `;
    document.head.appendChild(s);
  })();

  // ── Kelime Veritabanı ────────────────────────────────────────────
  const GEZEGENLER = [
    {
      id: 'mars', adi: 'MARS', seviye: 1,
      renk: '#c62828', renk2: '#ff7043',
      aciklama: 'Hayvanlar — Kolay',
      temaBg: 'radial-gradient(ellipse at 60% 30%, rgba(198,40,40,0.55) 0%, rgba(80,10,10,0.75) 100%)',
      kelimeler: [
        { k: 'KÖPEK', e: '🐕',  secenekler: ['KÖPEK', 'KEDİ',  'AT']    },
        { k: 'KEDİ',  e: '🐱',  secenekler: ['KEDİ',  'KÖPEK', 'BALIK'] },
        { k: 'KUŞ',   e: '🐦',  secenekler: ['KUŞ',   'KEDİ',  'AT']    },
        { k: 'ELMA',  e: '🍎',  secenekler: ['ELMA',  'ARMUT', 'ERIK']  },
        { k: 'BABA',  e: '👨',  secenekler: ['BABA',  'TOP',   'DEDE']  },
      ]
    },
    {
      id: 'venus', adi: 'VENÜS', seviye: 2,
      renk: '#e65100', renk2: '#ffee58',
      aciklama: 'Meyveler & Okul — Kolay',
      temaBg: 'radial-gradient(ellipse at 60% 30%, rgba(230,81,0,0.55) 0%, rgba(100,50,0,0.75) 100%)',
      kelimeler: [
        { k: 'MUZ',    e: '🍌', secenekler: ['MUZ',   'KİRAZ', 'İNCİR'] },
        { k: 'ÜZÜM',   e: '🍇', secenekler: ['ÜZÜM',  'MUZ',   'ARMUT'] },
        { k: 'KİTAP',  e: '📚', secenekler: ['KİTAP', 'ÇANTA', 'MASA']  },
        { k: 'KALEM',  e: '✏️', secenekler: ['KALEM', 'CETVEL','SILGI'] },
        { k: 'ARABA',  e: '🚗', secenekler: ['ARABA', 'UÇAK',  'GEMİ'] },
      ]
    },
    {
      id: 'jupiler', adi: 'JÜPİTER', seviye: 3,
      renk: '#1565c0', renk2: '#64b5f6',
      aciklama: 'Hayvanlar & Yerler — Orta',
      temaBg: 'radial-gradient(ellipse at 60% 30%, rgba(21,101,192,0.55) 0%, rgba(5,30,80,0.80) 100%)',
      kelimeler: [
        { k: 'BALIK',  e: '🐟', secenekler: ['BALIK', 'TAVUK', 'AT']    },
        { k: 'TAVUK',  e: '🐔', secenekler: ['TAVUK', 'KOYUN', 'İNEK']  },
        { k: 'KOYUN',  e: '🐑', secenekler: ['KOYUN', 'TAVUK', 'KÖPEK'] },
        { k: 'EV',     e: '🏠', secenekler: ['EV',    'OKUL',  'PARK']  },
        { k: 'OKUL',   e: '🏫', secenekler: ['OKUL',  'EV',    'BAHÇE'] },
      ]
    },
    {
      id: 'neptun', adi: 'NEPTÜN', seviye: 4,
      renk: '#00695c', renk2: '#4db6ac',
      aciklama: 'Renkler & Kavramlar — Zor',
      temaBg: 'radial-gradient(ellipse at 60% 30%, rgba(0,105,92,0.55) 0%, rgba(0,40,35,0.80) 100%)',
      kelimeler: [
        { k: 'KIRMIZI', e: '🔴', secenekler: ['KIRMIZI','MAVİ',   'SARI']   },
        { k: 'MAVİ',    e: '🔵', secenekler: ['MAVİ',  'KIRMIZI','YEŞİL']  },
        { k: 'GÜNEŞ',   e: '☀️', secenekler: ['GÜNEŞ', 'AY',     'YILDIZ'] },
        { k: 'AY',      e: '🌙', secenekler: ['AY',    'GÜNEŞ',  'YILDIZ'] },
        { k: 'ÇANTA',   e: '🎒', secenekler: ['ÇANTA', 'TORBA',  'SEPET']  },
      ]
    },
    {
      id: 'saturn', adi: 'SATÜRN', seviye: 5,
      renk: '#6a1b9a', renk2: '#ce93d8',
      aciklama: 'Bonus Seviye — En Zor',
      temaBg: 'radial-gradient(ellipse at 60% 30%, rgba(106,27,154,0.55) 0%, rgba(30,5,50,0.85) 100%)',
      kelimeler: [
        { k: 'PENCERE',   e: '🪟', secenekler: ['PENCERE',  'KAPI',    'DUVAR']   },
        { k: 'UÇAK',      e: '✈️', secenekler: ['UÇAK',     'GEMİ',    'TREN']    },
        { k: 'YILDIZ',    e: '⭐', secenekler: ['YILDIZ',   'GÜNEŞ',   'AY']      },
        { k: 'ÇIÇEK',     e: '🌸', secenekler: ['ÇIÇEK',   'AĞAÇ',    'OT']      },
        { k: 'KELEBEK',   e: '🦋', secenekler: ['KELEBEK', 'UĞUR BÖCEĞİ', 'SİNEK']   },
      ]
    }
  ];

  // ── State ────────────────────────────────────────────────────────
  let state = {
    aktifGezegen: null,
    soruIdx: 0,
    yanlisSayisi: 0,
    yanlisYapildi: false,
    kilit: false,
    ilerleme: {},
    acik: {}
  };

  function ilerlemeyiYukle() {
    try {
      const k = localStorage.getItem('uzayYolu_v3');
      if (k) {
        const v = JSON.parse(k);
        state.ilerleme = v.ilerleme || {};
        state.acik     = v.acik     || {};
      }
    } catch(e) {}
    if (!state.acik['mars']) state.acik['mars'] = true;
  }

  function ilerlemeKaydet() {
    try {
      localStorage.setItem('uzayYolu_v3', JSON.stringify({
        ilerleme: state.ilerleme,
        acik:     state.acik
      }));
    } catch(e) {}
  }

  // ── SVG Gezegenler ───────────────────────────────────────────────
  function marsSVG(w) {
    return `<svg width="${w}" height="${w}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mg${w}" cx="38%" cy="32%">
          <stop offset="0%" stop-color="#ff7043"/>
          <stop offset="100%" stop-color="#b71c1c"/>
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="26" fill="url(#mg${w})"/>
      <ellipse cx="22" cy="24" rx="5" ry="3" fill="rgba(0,0,0,0.15)" transform="rotate(-15,22,24)"/>
      <ellipse cx="38" cy="36" rx="4" ry="2.5" fill="rgba(0,0,0,0.12)" transform="rotate(10,38,36)"/>
      <circle cx="20" cy="36" r="3" fill="rgba(0,0,0,0.1)"/>
      <circle cx="36" cy="20" r="2" fill="rgba(0,0,0,0.1)"/>
      <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,200,180,0.3)" stroke-width="1.5"/>
    </svg>`;
  }

  function venusSVG(w) {
    return `<svg width="${w}" height="${w}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vg${w}" cx="38%" cy="32%">
          <stop offset="0%" stop-color="#ffee58"/>
          <stop offset="100%" stop-color="#f57f17"/>
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="26" fill="url(#vg${w})"/>
      <ellipse cx="16" cy="26" rx="11" ry="4" fill="rgba(255,255,255,0.28)" transform="rotate(-15,16,26)"/>
      <ellipse cx="38" cy="34" rx="9" ry="3.5" fill="rgba(255,255,255,0.22)" transform="rotate(-10,38,34)"/>
      <ellipse cx="26" cy="40" rx="8" ry="2.5" fill="rgba(255,255,255,0.18)" transform="rotate(-5,26,40)"/>
      <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,200,0.3)" stroke-width="1.5"/>
    </svg>`;
  }

  function jupiterSVG(w) {
    return `<svg width="${w}" height="${w}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jg${w}" cx="38%" cy="32%">
          <stop offset="0%" stop-color="#64b5f6"/>
          <stop offset="100%" stop-color="#0d47a1"/>
        </radialGradient>
        <clipPath id="jc${w}"><circle cx="30" cy="30" r="26"/></clipPath>
      </defs>
      <circle cx="30" cy="30" r="26" fill="url(#jg${w})"/>
      <g clip-path="url(#jc${w})">
        <ellipse cx="30" cy="20" rx="28" ry="3.5" fill="rgba(255,255,255,0.18)"/>
        <ellipse cx="30" cy="27" rx="28" ry="2.5" fill="rgba(100,150,255,0.2)"/>
        <ellipse cx="30" cy="33" rx="28" ry="3" fill="rgba(255,255,255,0.15)"/>
        <ellipse cx="30" cy="40" rx="28" ry="2.5" fill="rgba(100,150,255,0.18)"/>
        <ellipse cx="38" cy="27" rx="6" ry="5" fill="rgba(255,255,255,0.25)"/>
      </g>
      <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(180,220,255,0.3)" stroke-width="1.5"/>
    </svg>`;
  }

  function neptunSVG(w) {
    return `<svg width="${w}" height="${w}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ng${w}" cx="38%" cy="32%">
          <stop offset="0%" stop-color="#4db6ac"/>
          <stop offset="100%" stop-color="#004d40"/>
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="26" fill="url(#ng${w})"/>
      <ellipse cx="24" cy="21" rx="9" ry="6" fill="rgba(255,255,255,0.12)" transform="rotate(-20,24,21)"/>
      <ellipse cx="37" cy="35" rx="7" ry="4.5" fill="rgba(255,255,255,0.1)" transform="rotate(15,37,35)"/>
      <circle cx="20" cy="38" r="4" fill="rgba(0,0,0,0.1)"/>
      <circle cx="38" cy="22" r="3" fill="rgba(255,255,255,0.15)"/>
      <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(180,255,240,0.3)" stroke-width="1.5"/>
    </svg>`;
  }

  function saturnSVG(w) {
    const hw = Math.round(w * 1.35);
    return `<svg width="${hw}" height="${w}" viewBox="0 0 81 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sg${w}" cx="38%" cy="32%">
          <stop offset="0%" stop-color="#e1bee7"/>
          <stop offset="100%" stop-color="#4a148c"/>
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="30" rx="40" ry="8" fill="rgba(206,147,216,0.2)" stroke="rgba(206,147,216,0.45)" stroke-width="2"/>
      <circle cx="40" cy="30" r="22" fill="url(#sg${w})"/>
      <ellipse cx="40" cy="25" rx="14" ry="3" fill="rgba(255,255,255,0.12)"/>
      <ellipse cx="40" cy="30" rx="38" ry="7" fill="none" stroke="rgba(206,147,216,0.55)" stroke-width="2.5"/>
      <ellipse cx="40" cy="30" rx="33" ry="5.5" fill="none" stroke="rgba(180,100,220,0.35)" stroke-width="1.5"/>
      <circle cx="40" cy="30" r="22" fill="none" stroke="rgba(255,220,255,0.2)" stroke-width="1.5"/>
    </svg>`;
  }

  function gezegenSVG(id, w) {
    switch(id) {
      case 'mars':    return marsSVG(w);
      case 'venus':   return venusSVG(w);
      case 'jupiler': return jupiterSVG(w);
      case 'neptun':  return neptunSVG(w);
      case 'saturn':  return saturnSVG(w);
      default:        return marsSVG(w);
    }
  }

  // ── Tema Arka Plan ───────────────────────────────────────────────
  let temaBg = null;
  function temayiUygula(g) {
    if (!temaBg) {
      temaBg = document.createElement('div');
      temaBg.className = 'uy-tema-bg';
      document.body.appendChild(temaBg);
    }
    temaBg.style.background = g ? g.temaBg : 'transparent';
    temaBg.classList.toggle('aktif', !!g);
  }

  // ── Ses ──────────────────────────────────────────────────────────
  function sesCal(tip) {
    if (window.sesleri && window.sesleri[tip]) {
      try { window.sesleri[tip].currentTime = 0; window.sesleri[tip].play(); } catch(e) {}
      return;
    }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      if (tip === 'dogru') {
        o.frequency.setValueAtTime(523, ctx.currentTime);
        o.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        o.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        g.gain.setValueAtTime(0.28, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.5);
      } else if (tip === 'yanlis') {
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(220, ctx.currentTime);
        o.frequency.setValueAtTime(170, ctx.currentTime + 0.18);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.38);
      } else if (tip === 'bitis') {
        [523,659,784,1047].forEach((f,i) => {
          const ob = ctx.createOscillator(); const gb = ctx.createGain();
          ob.connect(gb); gb.connect(ctx.destination);
          ob.frequency.value = f;
          gb.gain.setValueAtTime(0.22, ctx.currentTime + i*0.13);
          gb.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.13 + 0.35);
          ob.start(ctx.currentTime + i*0.13); ob.stop(ctx.currentTime + i*0.13 + 0.35);
        });
      } else if (tip === 'gecis') {
        o.frequency.setValueAtTime(350, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.25);
        g.gain.setValueAtTime(0.18, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.25);
      }
    } catch(e) {}
  }

  // ── Puan ─────────────────────────────────────────────────────────
  function puanEkle(miktar) {
    if (typeof window.koyunSkoru === 'function') window.koyunSkoru(miktar);
  }

  // ── Yıldız Partikül ──────────────────────────────────────────────
  function yildizPatlat(x, y, sayi) {
    const emojiler = ['⭐','🌟','✨','💫'];
    for (let i = 0; i < sayi; i++) {
      const el = document.createElement('div');
      el.className = 'uy-yildiz-partikul';
      el.textContent = emojiler[i % emojiler.length];
      el.style.left = (x + (Math.random()-0.5)*70) + 'px';
      el.style.top  = (y + (Math.random()-0.5)*40) + 'px';
      el.style.animationDelay = (i * 0.09) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }
  }

  // ── Ana Alan ─────────────────────────────────────────────────────
  const alan = document.getElementById('uzayAlan');
  if (!alan) return;

  // ── MENÜ ─────────────────────────────────────────────────────────
  function menuRender() {
    temayiUygula(null);
    ilerlemeyiYukle();
    const toplamYildiz = Object.values(state.ilerleme).reduce((a,b) => a+b, 0);
    const maxYildiz = GEZEGENLER.length * 5;

    const kartlarHTML = GEZEGENLER.map(g => {
      const tamamlandi = (state.ilerleme[g.id] || 0) >= 5;
      const acik = !!state.acik[g.id];
      const yildizSayisi = state.ilerleme[g.id] || 0;
      let yildizHTML = '';
      for (let i = 0; i < 5; i++) yildizHTML += i < yildizSayisi ? '⭐' : '☆';
      const svgW = g.id === 'saturn' ? 54 : 44;
      return `
        <div class="uy-gezegen-kart ${acik?'':'uy-kilitli'} ${tamamlandi?'uy-tamamlandi':''}"
             data-gid="${g.id}" role="button" tabindex="${acik?0:-1}"
             aria-label="${g.adi} ${acik?'açık':'kilitli'}">
          <div class="uy-gezegen-svg gezegen-parlama">${gezegenSVG(g.id, svgW)}</div>
          <div class="uy-gezegen-bilgi">
            <div class="uy-gezegen-adi">Seviye ${g.seviye} — ${g.adi}</div>
            <div class="uy-gezegen-aciklama">${g.aciklama}</div>
            <div class="uy-gezegen-yildiz">${yildizHTML}</div>
          </div>
          ${acik
            ? `<div style="font-size:1.4rem">${tamamlandi?'✅':'▶️'}</div>`
            : `<div class="uy-kilit-ikon">🔒</div>`}
        </div>`;
    }).join('');

    alan.innerHTML = `
      <div class="uy-menu">
        <div class="uy-menu-baslik">🚀 Uzay Yolu</div>
        <div class="uy-menu-alt">Doğru kelimeyi seçerek gezegenlere ulaş!</div>
        <div class="uy-gezegen-liste">${kartlarHTML}</div>
        <div class="uy-toplam-bar">⭐ Toplam Yıldız: <strong>${toplamYildiz} / ${maxYildiz}</strong></div>
      </div>`;

    alan.querySelectorAll('.uy-gezegen-kart:not(.uy-kilitli)').forEach(kart => {
      kart.addEventListener('click', () => {
        sesCal('gecis');
        oyunBaslat(kart.dataset.gid);
      });
    });
  }

  // ── OYUN BAŞLAT ──────────────────────────────────────────────────
  function oyunBaslat(gezegenId) {
    const g = GEZEGENLER.find(x => x.id === gezegenId);
    if (!g) return;
    state.aktifGezegen = g;
    state.soruIdx      = 0;
    state.yanlisSayisi = 0;
    state.yanlisYapildi = false;
    state.kilit        = false;
    temayiUygula(g);
    oyunRender();
    soruyuGoster();
  }

  // ── OYUN RENDER ──────────────────────────────────────────────────
  function oyunRender() {
    const g = state.aktifGezegen;
    const svgW = g.id === 'saturn' ? 42 : 34;
    alan.innerHTML = `
      <div class="uy-oyun">
        <div class="uy-oyun-header">
          <button class="uy-oyun-geri" id="uyGeriBtn">← Geri</button>
          <div class="uy-oyun-baslik">
            ${gezegenSVG(g.id, svgW)}
            ${g.adi}
          </div>
          <div style="font-family:'Nunito',sans-serif;font-weight:800;font-size:0.9rem;color:#fff;
               background:rgba(255,255,255,0.2);padding:5px 12px;border-radius:50px;">
            <span id="uySoruNo">1</span>/5
          </div>
        </div>

        <div class="uy-progress-wrap">
          <div class="uy-progress-bar" id="uyProgressBar" style="width:0%"></div>
        </div>

        <div class="uy-manevra-serit" id="uyManevraSerit">
          ${g.adi}'a 5 manevra kaldı! 🚀
        </div>

        <div class="uy-roket-alan" id="uyRoketAlan">
          <div class="uy-yol-track" id="uyYolTrack">
            <div class="uy-yol-hedef" id="uyYolHedef">${gezegenSVG(g.id, 28)}</div>
          </div>
          <div class="uy-roket" id="uyRoket">🚀</div>
        </div>

        <div class="uy-soru-kart" id="uySoruKart">
          <div class="uy-emoji-alan" id="uyEmoji">❓</div>
          <div class="uy-secenekler" id="uySecenekler"></div>
        </div>

        <div class="uy-mesaj" id="uyMesaj"></div>
      </div>`;

    document.getElementById('uyGeriBtn').addEventListener('click', () => {
      sesCal('gecis');
      temayiUygula(null);
      menuRender();
    });

    // Yol noktaları
    const track = document.getElementById('uyYolTrack');
    for (let i = 0; i < 5; i++) {
      const n = document.createElement('div');
      n.className = 'uy-yol-nokta';
      n.id = 'uyNokta_' + i;
      n.style.left = (12 + i * 16) + '%';
      track.appendChild(n);
    }
  }

  // ── MANEVRA METNİ ────────────────────────────────────────────────
  function manevraGuncelle(kalanSoru) {
    const el = document.getElementById('uyManevraSerit');
    if (!el) return;
    const g = state.aktifGezegen;
    if (kalanSoru === 1) {
      el.textContent = `${g.adi}'a son manevra! 🔥`;
      el.className = 'uy-manevra-serit son';
    } else {
      el.textContent = `${g.adi}'a ${kalanSoru} manevra kaldı! 🚀`;
      el.className = 'uy-manevra-serit';
    }
  }

  // ── SORU GÖSTER ──────────────────────────────────────────────────
  function soruyuGoster() {
    const g = state.aktifGezegen;
    const s = g.kelimeler[state.soruIdx];
    state.kilit = false;
    state.yanlisYapildi = false;

    document.getElementById('uySoruNo').textContent = state.soruIdx + 1;
    document.getElementById('uyProgressBar').style.width = (state.soruIdx / 5 * 100) + '%';
    document.getElementById('uyEmoji').textContent = s.e;
    document.getElementById('uyMesaj').textContent = '';
    document.getElementById('uyMesaj').className = 'uy-mesaj';

    manevraGuncelle(5 - state.soruIdx);

    // Roket pozisyon
    const roket = document.getElementById('uyRoket');
    roket.className = 'uy-roket';
    roket.style.left = (6 + state.soruIdx * 15) + '%';

    // Seçenekler
    const karisik = shuffle([...s.secenekler]);
    const konteyner = document.getElementById('uySecenekler');
    konteyner.innerHTML = '';
    karisik.forEach(secenek => {
      const btn = document.createElement('button');
      btn.className = 'uy-sec-btn';
      btn.textContent = secenek;
      btn.setAttribute('aria-label', secenek);
      btn.addEventListener('click', () => cevapKontrol(secenek, btn));
      konteyner.appendChild(btn);
    });
  }

  // ── CEVAP KONTROL ────────────────────────────────────────────────
  function cevapKontrol(secilen, btn) {
    if (state.kilit) return;
    const g = state.aktifGezegen;
    const s = g.kelimeler[state.soruIdx];
    const mesaj = document.getElementById('uyMesaj');

    if (secilen === s.k) {
      // ✅ DOĞRU
      state.kilit = true;
      btn.classList.add('dogru');

      const dogruMesajlar = ['🌟 Harika!', '✨ Çok güzel!', '🎉 Süper!', '⭐ Aferin!', '🚀 Mükemmel!'];
      mesaj.textContent = dogruMesajlar[Math.floor(Math.random() * dogruMesajlar.length)];
      mesaj.className = 'uy-mesaj dogru-mesaj';

      sesCal('dogru');
      puanEkle(5);

      const roket = document.getElementById('uyRoket');
      roket.className = 'uy-roket uy-zipladi';
      setTimeout(() => { roket.className = 'uy-roket'; }, 650);

      const rect = btn.getBoundingClientRect();
      yildizPatlat(rect.left + rect.width/2, rect.top, 4);

      const nokta = document.getElementById('uyNokta_' + state.soruIdx);
      if (nokta) nokta.classList.add('gecildi');

      document.querySelectorAll('.uy-sec-btn').forEach(b => b.disabled = true);

      setTimeout(() => {
        state.soruIdx++;
        if (state.soruIdx >= 5) {
          roketUcur();
        } else {
          soruyuGoster();
        }
      }, 1200);

    } else {
      // ❌ YANLIŞ
      if (state.yanlisYapildi) return;
      state.yanlisYapildi = true;
      btn.classList.add('yanlis');
      btn.disabled = true;
      state.yanlisSayisi++;

      mesaj.textContent = '❌ Tekrar dene!';
      mesaj.className = 'uy-mesaj yanlis-mesaj';
      sesCal('yanlis');

      const roket = document.getElementById('uyRoket');
      roket.className = 'uy-roket uy-sallandi';
      setTimeout(() => { roket.className = 'uy-roket'; }, 450);

      setTimeout(() => {
        mesaj.textContent = '';
        mesaj.className = 'uy-mesaj';
        state.yanlisYapildi = false;
      }, 1000);
    }
  }

  // ── ROKET UÇUŞ ANİMASYONU ────────────────────────────────────────
  function roketUcur() {
    const roket = document.getElementById('uyRoket');
    if (roket) {
      roket.style.left = '85%';
      roket.style.transition = 'left 0.5s ease';
      setTimeout(() => {
        roket.className = 'uy-roket uy-ucuyor';
      }, 550);
    }
    sesCal('bitis');
    setTimeout(() => gezegenBit(), 1600);
  }

  // ── GEZEGEN BİTİŞ ────────────────────────────────────────────────
  function gezegenBit() {
    const g = state.aktifGezegen;
    const dogruSayisi = 5 - state.yanlisSayisi;
    const yildiz = Math.max(1, dogruSayisi);

    const onceki = state.ilerleme[g.id] || 0;
    state.ilerleme[g.id] = Math.max(onceki, yildiz);

    const sirIdx = GEZEGENLER.findIndex(x => x.id === g.id);
    if (sirIdx < GEZEGENLER.length - 1) {
      state.acik[GEZEGENLER[sirIdx+1].id] = true;
    }
    ilerlemeKaydet();
    puanEkle(10);

    let yildizHTML = '';
    for (let i = 0; i < 5; i++) {
      yildizHTML += `<span style="opacity:0;display:inline-block;
        transition:opacity 0.3s ease ${i*0.2}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i*0.2}s;
        transform:scale(0.3)">
        ${i < yildiz ? '⭐' : '☆'}</span>`;
    }

    const sonraki = sirIdx < GEZEGENLER.length - 1 ? GEZEGENLER[sirIdx+1] : null;
    const svgW = g.id === 'saturn' ? 54 : 44;

    const overlay = document.createElement('div');
    overlay.className = 'uy-bitis-overlay acik';
    overlay.id = 'uyBitisOverlay';
    overlay.innerHTML = `
      <div class="uy-bitis-kart">
        <div class="uy-bitis-emoji">${gezegenSVG(g.id, svgW)}</div>
        <div class="uy-bitis-baslik">🎉 Harika!</div>
        <div class="uy-bitis-alt">${g.adi}'ı tamamladın!</div>
        <div class="uy-bitis-yildizlar" id="uyBitisYildiz">${yildizHTML}</div>
        <div class="uy-bitis-stat">✅ Doğru: ${dogruSayisi}/5 &nbsp;&nbsp; ⭐ Yıldız: ${yildiz}</div>
        <div class="uy-bitis-butonlar">
          ${sonraki
            ? `<button class="uy-bitis-btn birincil" id="uyBtnSonraki">▶ ${sonraki.adi}'a Git</button>`
            : `<button class="uy-bitis-btn birincil" id="uyBtnSonraki">🏆 Tebrikler!</button>`}
          <button class="uy-bitis-btn ikincil" id="uyBtnMenu">🏠 Menüye Dön</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    // Yıldız animasyonu
    setTimeout(() => {
      overlay.querySelectorAll('#uyBitisYildiz span').forEach(sp => {
        sp.style.opacity = '1';
        sp.style.transform = 'scale(1)';
      });
    }, 150);

    overlay.querySelector('#uyBtnMenu').addEventListener('click', () => {
      overlay.remove();
      temayiUygula(null);
      menuRender();
    });

    overlay.querySelector('#uyBtnSonraki').addEventListener('click', () => {
      overlay.remove();
      if (sonraki) {
        sesCal('gecis');
        oyunBaslat(sonraki.id);
      } else {
        temayiUygula(null);
        menuRender();
      }
    });
  }

  // ── Yardımcı ─────────────────────────────────────────────────────
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ── Global API ───────────────────────────────────────────────────
  window.uzayBas = function () {
    ilerlemeyiYukle();
    if (window.profilAktiviteKaydet) window.profilAktiviteKaydet('oyun');
    menuRender();
  };

  window.uzayDurdur = function () {
    state.kilit = true;
    temayiUygula(null);
  };

})();

"use strict";

// ═══════════════════════════════════════════════════════════════
// HİKAYE SEÇİM EKRANI — hikaye-secim.js
// hikaye.js'e bağımlı: HIKAYE_DATA, hkAcHikaye()
// ═══════════════════════════════════════════════════════════════

var hkSecimEl = null;
var hkSecimSayfa = 0;
var HK_SAYFA_BOYUT = 4;

var HIKAYE_GORSELLER = [
  'mina','baran','henna','mustafa','asya','yusuf','zeynep','maysa',
  'mehmet','yagmur','cicek','emir','beyaz','kaan','elvan','berk',
  'defne','aras','ilayda','onur','henna_asya'
];

function hkSecimOlustur() {
  if (hkSecimEl) return;

  hkSecimEl = document.createElement('div');
  hkSecimEl.id = 'hikayeSecimEkran';
  hkSecimEl.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:500',
    'overflow-y:auto',
    'flex-direction:column',
    'align-items:center',
    'padding:16px 12px 40px'
  ].join(';');

  var wrap = document.createElement('div');
  wrap.className = 'koyun-screen';
  wrap.style.gap = '14px';
  wrap.style.width = '100%';
  wrap.style.maxWidth = '480px';

  // Menü butonu
  var geri = document.createElement('button');
  geri.className = 'btn-back';
  geri.style.alignSelf = 'flex-start';
  geri.textContent = '\u2190 Men\u00FC';
  geri.addEventListener('click', function () {
    hkSecimEl.style.display = 'none';
    if (typeof menuGoster === 'function') menuGoster();
    else {
      var ms = document.getElementById('menuScreen');
      if (ms) ms.style.display = 'flex';
    }
  });
  wrap.appendChild(geri);

  // Başlık
  var hdr = document.createElement('div');
  hdr.className = 'koyun-header';

  var hdrL = document.createElement('div');
  var ttl = document.createElement('h2');
  ttl.className = 'koyun-title';
  ttl.textContent = 'Minik \uD83D\uDCD6 Okur';
  var sub = document.createElement('p');
  sub.className = 'subtitle';
  sub.textContent = 'Hikaye se\u00E7';
  hdrL.appendChild(ttl);
  hdrL.appendChild(sub);

  var bdg = document.createElement('div');
  bdg.className = 'koyun-score-badge';
  bdg.textContent = '\uD83D\uDCDA ' + HIKAYE_DATA.length + ' hikaye';

  hdr.appendChild(hdrL);
  hdr.appendChild(bdg);
  wrap.appendChild(hdr);

  // Grid container
  var gridWrap = document.createElement('div');
  gridWrap.id = 'hkSecimGrid';
  gridWrap.style.cssText = [
    'display:grid',
    'grid-template-columns:1fr 1fr',
    'gap:12px',
    'width:100%'
  ].join(';');
  wrap.appendChild(gridWrap);

  // Sayfalama butonları
  var navRow = document.createElement('div');
  navRow.style.cssText = [
    'display:flex',
    'justify-content:center',
    'align-items:center',
    'gap:16px',
    'margin-top:4px'
  ].join(';');

  var btnGeri = document.createElement('button');
  btnGeri.id = 'hkSecimGeri';
  btnGeri.textContent = '\u25C0';
  btnGeri.style.cssText = [
    'font-size:1.6rem',
    'background:rgba(255,255,255,0.25)',
    'border:none',
    'border-radius:50%',
    'width:48px',
    'height:48px',
    'cursor:pointer',
    'color:white',
    'display:flex',
    'align-items:center',
    'justify-content:center'
  ].join(';');

  var sayfaNo = document.createElement('div');
  sayfaNo.id = 'hkSecimSayfaNo';
  sayfaNo.style.cssText = 'color:rgba(255,255,255,0.9);font-family:Nunito,sans-serif;font-weight:800;font-size:1rem;min-width:60px;text-align:center;';

  var btnIleri = document.createElement('button');
  btnIleri.id = 'hkSecimIleri';
  btnIleri.textContent = '\u25B6';
  btnIleri.style.cssText = btnGeri.style.cssText;

  btnGeri.addEventListener('click', function () {
    if (hkSecimSayfa > 0) { hkSecimSayfa--; hkSecimGuncelle(); }
  });
  btnIleri.addEventListener('click', function () {
    var toplamSayfa = Math.ceil(HIKAYE_DATA.length / HK_SAYFA_BOYUT);
    if (hkSecimSayfa < toplamSayfa - 1) { hkSecimSayfa++; hkSecimGuncelle(); }
  });

  navRow.appendChild(btnGeri);
  navRow.appendChild(sayfaNo);
  navRow.appendChild(btnIleri);
  wrap.appendChild(navRow);

  hkSecimEl.appendChild(wrap);
  document.body.appendChild(hkSecimEl);
}

function hkSecimGuncelle() {
  var grid = document.getElementById('hkSecimGrid');
  var sayfaNo = document.getElementById('hkSecimSayfaNo');
  var btnGeri = document.getElementById('hkSecimGeri');
  var btnIleri = document.getElementById('hkSecimIleri');
  if (!grid) return;

  var toplamSayfa = Math.ceil(HIKAYE_DATA.length / HK_SAYFA_BOYUT);
  var baslangic = hkSecimSayfa * HK_SAYFA_BOYUT;
  var bitis = Math.min(baslangic + HK_SAYFA_BOYUT, HIKAYE_DATA.length);

  sayfaNo.textContent = (hkSecimSayfa + 1) + ' / ' + toplamSayfa;
  btnGeri.style.opacity = hkSecimSayfa === 0 ? '0.3' : '1';
  btnIleri.style.opacity = hkSecimSayfa >= toplamSayfa - 1 ? '0.3' : '1';

  grid.innerHTML = '';

  for (var i = baslangic; i < bitis; i++) {
    (function(idx) {
      var h = HIKAYE_DATA[idx];
      var gorselAd = HIKAYE_GORSELLER[idx] || 'mina';

      var kart = document.createElement('div');
      kart.style.cssText = [
        'background:#fff',
        'border-radius:16px',
        'overflow:hidden',
        'cursor:pointer',
        'box-shadow:0 4px 14px rgba(0,0,0,0.15)',
        'border:2.5px solid #f9a825',
        'transition:transform 0.15s, box-shadow 0.15s',
        'font-family:Nunito,sans-serif',
        'user-select:none',
        'display:flex',
        'flex-direction:column'
      ].join(';');

      // Fotoğraf
      var img = document.createElement('img');
      img.src = 'hikaye-gorseller/' + gorselAd + '.webp';
      img.alt = h.baslik;
      img.style.cssText = [
        'width:100%',
        'height:130px',
        'object-fit:cover',
        'object-position:center center',
        'display:block'
      ].join(';');

      // İsim
      var isim = document.createElement('div');
      isim.style.cssText = [
        'padding:8px 8px 10px',
        'font-size:0.72rem',
        'font-weight:800',
        'color:#1a2744',
        'line-height:1.3',
        'text-align:center',
        'flex:1',
        'display:flex',
        'align-items:center',
        'justify-content:center'
      ].join(';');
      isim.textContent = h.baslik;

      kart.appendChild(img);
      kart.appendChild(isim);

      kart.addEventListener('mouseenter', function () {
        kart.style.transform = 'scale(1.04)';
        kart.style.boxShadow = '0 6px 20px rgba(249,168,37,0.45)';
      });
      kart.addEventListener('mouseleave', function () {
        kart.style.transform = '';
        kart.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
      });
      kart.addEventListener('click', function () {
        hkSecimEl.style.display = 'none';
        hkAcHikaye(idx);
      });

      grid.appendChild(kart);
    })(i);
  }
}

function hkSecimAc() {
  hkSecimOlustur();
  hkSecimSayfa = 0;
  hkSecimGuncelle();

  var ms = document.getElementById('menuScreen');
  if (ms) ms.style.display = 'none';

  hkSecimEl.style.display = 'flex';
}

"use strict";

// ═══════════════════════════════════════════════════════════════
// HİKAYE SEÇİM EKRANI — hikaye-secim.js
// hikaye.js'e bağımlı: HIKAYE_DATA, hkAcHikaye()
// ═══════════════════════════════════════════════════════════════

var hkSecimEl = null;

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
    'padding:20px 0 40px'
  ].join(';');

  // Ana kart
  var wrap = document.createElement('div');
  wrap.className = 'koyun-screen';
  wrap.style.gap = '18px';

  // ← Menü butonu
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

  // Yatay kaydırmalı şerit
  var serit = document.createElement('div');
  serit.style.cssText = [
    'display:flex',
    'flex-direction:row',
    'gap:12px',
    'overflow-x:auto',
    'padding:10px 4px 18px',
    'width:100%',
    '-webkit-overflow-scrolling:touch',
    'scrollbar-width:thin'
  ].join(';');

  HIKAYE_DATA.forEach(function (h, i) {
    var kart = document.createElement('div');
    kart.style.cssText = [
      'flex:0 0 auto',
      'width:120px',
      'background:#fff',
      'border-radius:16px',
      'padding:14px 8px 12px',
      'text-align:center',
      'cursor:pointer',
      'box-shadow:0 3px 10px rgba(0,0,0,0.13)',
      'border:2.5px solid #f9a825',
      'transition:transform 0.15s, box-shadow 0.15s',
      'font-family:Nunito,sans-serif',
      'user-select:none'
    ].join(';');

    var num = document.createElement('div');
    num.style.cssText = 'font-size:1.7rem;font-weight:900;color:#f9a825;margin-bottom:6px;line-height:1;';
    num.textContent = i + 1;

    var bas = document.createElement('div');
    bas.style.cssText = 'font-size:0.68rem;font-weight:700;color:#1a2744;line-height:1.35;';
    bas.textContent = h.baslik;

    kart.appendChild(num);
    kart.appendChild(bas);

    kart.addEventListener('mouseenter', function () {
      kart.style.transform = 'scale(1.07)';
      kart.style.boxShadow = '0 6px 20px rgba(249,168,37,0.4)';
    });
    kart.addEventListener('mouseleave', function () {
      kart.style.transform = '';
      kart.style.boxShadow = '0 3px 10px rgba(0,0,0,0.13)';
    });
    kart.addEventListener('click', function () {
      hkSecimEl.style.display = 'none';
      hkAcHikaye(i);
    });

    serit.appendChild(kart);
  });

  wrap.appendChild(serit);

  // İpucu
  var tip = document.createElement('p');
  tip.style.cssText = 'color:rgba(255,255,255,0.55);font-size:0.8rem;font-family:Nunito,sans-serif;margin-top:-4px;';
  tip.textContent = '\uD83D\uDC46 Bir hikayeye dokun';
  wrap.appendChild(tip);

  hkSecimEl.appendChild(wrap);
  document.body.appendChild(hkSecimEl);
}

function hkSecimAc() {
  hkSecimOlustur();

  var ms = document.getElementById('menuScreen');
  if (ms) ms.style.display = 'none';

  hkSecimEl.style.display = 'flex';
}

"use strict";

// ══════════════════════════════════════════════════════════════════════════════
//  SÜRELİ OKUMA MODÜLÜ  (sureli-okuma.js)
//  Bağımlılık: app.js'teki ekranGoster(), tumEkranlariGizle(), menuSkorGuncelle()
// ══════════════════════════════════════════════════════════════════════════════

// ─── Metinler ─────────────────────────────────────────────────────────────────
const SO_METINLER = [
  {
    id: 1,
    baslik: "Ay'a Yolculuk",
    kelimeSayisi: 45,
    yildiz: 1,
    metin: "Mustafa gece gökyüzüne baktı. Yıldızlar parlıyordu. Ay çok büyük görünüyordu. \"Aya gitsem nasıl olurdu?\" diye düşündü. Uzay gemisine bindi. Roket ateşlendi. Yukarı fırladı. Ay'a indi. Her adımda zıplayarak yürüdü. Çünkü ay'da yerçekimi azdı. Dünya'ya baktı. Mavi ve yuvarlaktı. Çok güzeldi. Eve döndü. Rüyasında tekrar gitti."
  },
  {
    id: 2,
    baslik: "Dinozorlar Nereye Gitti?",
    kelimeSayisi: 49,
    yildiz: 2,
    metin: "Henna müzede büyük bir iskelet gördü. \"Bu ne?\" diye sordu. Öğretmeni anlattı. Milyonlarca yıl önce dinozorlar yaşıyordu. Devasa hayvanlardı. Kimisi ot yerdi, kimisi et. Sonra büyük bir taş gökten düştü. Toz her yeri kapladı. Güneş görünmez oldu. Bitkiler soldu. Dinozorlar yavaş yavaş yok oldu. Henna üzüldü. \"Keşke olsaydılar\" dedi."
  },
  {
    id: 3,
    baslik: "Denizaltında Bir Gün",
    kelimeSayisi: 54,
    yildiz: 3,
    metin: "Yavuz deniz kenarında oturuyordu. Elinde sihirli bir maske vardı. Taktı ve suya daldı. Rengarenk balıklar etrafında yüzdü. Bir ahtapot ona el salladı. Mercanlar pembe ve sarıydı. Uzakta büyük bir balina geçti. Sesi tüm denize yayıldı. Küçük balıklar okulda sıra sıra yüzüyordu. Öğretmenleri büyük bir levrekti. Yavuz güldü. Maskesi çıkınca her şey bitti. Ama unutamadı."
  },
  {
    id: 4,
    baslik: "Bulutların Üstünde",
    kelimeSayisi: 57,
    yildiz: 4,
    metin: "Erba pencereden bulutlara bakıyordu. \"Acaba yumuşak mıdır?\" diye düşündü. O gün uçağa bindi. Bulutların arasından geçtiler. Beyaz ve pamuk gibiydi. Pilot seslendi. \"Fırtına geliyor\" dedi. Bulutlar karardu. Şimşekler çaktı. Uçak sallandı. Erba korkmadı. Merak etti. Şimşek aslında bulutlar arasındaki elektrikti. Yağmur damlaları camdan aşağı kaydı. Az sonra güneş çıktı. Gökkuşağı belirdi. Erba hayatının en güzel manzarasını gördü."
  },
  {
    id: 5,
    baslik: "Tohumun Yolculuğu",
    kelimeSayisi: 63,
    yildiz: 5,
    metin: "Meryem bahçeye küçük bir tohum gömdü. Her gün suladı. Günler geçti. Bir sabah yeşil bir filiz çıktı. Meryem sevindi. Öğretmeni anlattı. Tohum toprağın içinde suyu emer. Güneşe doğru uzanır. Kökler derinleşir. Yapraklar açılır. Sonra çiçek olur. Meyve verir. İçinde yeni tohumlar oluşur. Böylece döngü devam eder. Meryem baktı. Bitkisi artık çiçek açmıştı. Sarı yapraklarıydı. Rüzgarda sallanıyordu. \"Sen de bir mucizesin\" dedi bitkisine. Güldü."
  },
  {
    id: 6,
    baslik: "Işığın Hızı",
    kelimeSayisi: 72,
    yildiz: 6,
    metin: "Osman teleskopla yıldızlara bakıyordu. Dedesi yanına oturdu. \"O yıldız ne kadar uzakta?\" diye sordu Osman. Dedesi düşündü. \"O kadar uzak ki ışığı buraya gelmesi yıllar alır\" dedi. Osman şaşırdı. \"Yani şu an gördüğümüz ışık çok eskiden yola çıktı mı?\" diye sordu. Dedesi güldü. \"Evet, belki o yıldız artık yok bile.\" Osman bunu düşündü. Gökyüzü ona farklı göründü. Her yıldız aslında geçmişten gelen bir mesajdı. O gece çok geç uyudu. Zihninde sorular bitmiyordu."
  }
];

// ─── State ────────────────────────────────────────────────────────────────────
let so_secilenMetin = null;
let so_sure = 60;
let so_kalanSure = 60;
let so_timer = null;
let so_basladi = false;
let so_bitti = false;
let so_geriSayimTimer = null;

// ─── DOM Yardımcıları ─────────────────────────────────────────────────────────
function so_el(id) { return document.getElementById(id); }

function so_ekranGoster(ekranId) {
  ['soSecimEkrani','soGeriSayimEkrani','soOkumaEkrani','soSonucEkrani'].forEach(id => {
    const el = so_el(id);
    if (el) el.style.display = 'none';
  });
  const hedef = so_el(ekranId);
  if (hedef) hedef.style.display = 'flex';
}

// ─── 1. Metin Seçim Ekranı ────────────────────────────────────────────────────
function so_secimEkraniOlustur() {
  const alan = so_el('soMetinKartlari');
  if (!alan) return;
  alan.innerHTML = '';
  SO_METINLER.forEach(metin => {
    const kart = document.createElement('div');
    kart.className = 'so-metin-kart';
    kart.innerHTML = `
      <div class="so-kart-baslik">${metin.baslik}</div>
      <div class="so-kart-kelime">${metin.kelimeSayisi} kelime</div>
      <div class="so-kart-yildizlar">${'★'.repeat(metin.yildiz)}<span style="opacity:0.25">${'★'.repeat(6 - metin.yildiz)}</span></div>
    `;
    kart.addEventListener('click', () => so_metinSec(metin));
    alan.appendChild(kart);
  });
}

function so_metinSec(metin) {
  so_secilenMetin = metin;
  so_okumaEkraniAc();
}

// ─── 2. Geri Sayım Ekranı ─────────────────────────────────────────────────────
function so_geriSayimBaslat() {
  so_ekranGoster('soGeriSayimEkrani');
  const el = so_el('soGeriSayimRakam');
  let sayac = 3;

  function goster(deger) {
    if (!el) return;
    el.textContent = deger;
    el.classList.remove('so-geri-animate');
    void el.offsetWidth;
    el.classList.add('so-geri-animate');
  }

  goster(sayac);

  so_geriSayimTimer = setInterval(() => {
    sayac--;
    if (sayac > 0) {
      goster(sayac);
    } else {
      clearInterval(so_geriSayimTimer);
      so_geriSayimTimer = null;
      setTimeout(() => {
        so_ekranGoster('soOkumaEkrani');
        so_baslatTimer();
      }, 300);
    }
  }, 1000);
}

// ─── 3. Okuma Ekranı ──────────────────────────────────────────────────────────
function so_okumaEkraniAc() {
  so_ekranGoster('soOkumaEkrani');
  so_basladi = false;
  so_bitti = false;
  so_kalanSure = 60;

  // Timer bar ve sayaç sıfırla
  const bar = so_el('soTimerBar');
  const sayac = so_el('soTimerSayac');
  if (bar) { bar.style.transition = 'none'; bar.style.width = '100%'; }
  if (sayac) sayac.textContent = '1:00';

  // Metni kelime kelime oluştur
  const metinAlan = so_el('soMetinAlan');
  if (metinAlan && so_secilenMetin) {
    const kelimeler = so_secilenMetin.metin.split(/\s+/);
    const fontBoyutu = so_fontHesapla(kelimeler.length);
    metinAlan.style.fontSize = fontBoyutu;
    metinAlan.innerHTML = '';

    kelimeler.forEach((kelime, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'so-kelime-wrap';

      const kelimeEl = document.createElement('span');
      kelimeEl.className = 'so-kelime';
      kelimeEl.textContent = kelime;

      const numEl = document.createElement('span');
      numEl.className = 'so-kelime-num';
    numEl.style.fontSize = '0.72rem';
    numEl.style.color = 'rgba(0,0,0,0.45)';
      numEl.textContent = i + 1;

      wrap.appendChild(kelimeEl);
      wrap.appendChild(numEl);
      metinAlan.appendChild(wrap);

      if (i < kelimeler.length - 1) {
        metinAlan.appendChild(document.createTextNode(' '));
      }
    });
  }

  // Başla butonu
  const btnBasla = so_el('soBtnBasla');
  if (btnBasla) {
    btnBasla.style.display = 'block';
    btnBasla.onclick = () => {
      btnBasla.style.display = 'none';
      so_geriSayimBaslat();
    };
  }

  // Render sonrası taşma kontrolü — hâlâ sığmıyorsa küçült
  requestAnimationFrame(() => {
    if (!metinAlan) return;
    let px = parseFloat(metinAlan.style.fontSize) || 16;
    let deneme = 0;
    while (metinAlan.scrollHeight > metinAlan.clientHeight + 4 && px > 11 && deneme < 20) {
      px -= 0.5;
      metinAlan.style.fontSize = px.toFixed(1) + 'px';
      deneme++;
    }
  });
}

function so_fontHesapla(kelimeSayisi) {
  // Ekran yüksekliğine göre dinamik font — metin kutuya sığsın
  // Üst bar ~50px, başla butonu ~60px, padding ~20px → kalan alan
  const ekranY = window.innerHeight;
  const kalanAlan = ekranY - 130; // üst bar + buton + boşluklar
  const satirSayisi = kelimeSayisi <= 50 ? 6 : kelimeSayisi <= 60 ? 7 : kelimeSayisi <= 70 ? 8 : kelimeSayisi <= 80 ? 9 : kelimeSayisi <= 90 ? 10 : 11;
  // line-height 1.9 ile bir satırın yüksekliği = fontSize * 1.9
  // kalanAlan / (satirSayisi * 1.9) = max fontSize (px)
  const maxPx = kalanAlan / (satirSayisi * 1.9);
  // Sınırlar: min 13px, max 22px
  const px = Math.min(22, Math.max(13, maxPx));
  return px.toFixed(1) + 'px';
}

function so_baslatTimer() {
  so_basladi = true;

  const bar = so_el('soTimerBar');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = '100%';
    bar.style.display = 'block';
    // Bir frame bekle, sonra transition başlat
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 60s linear';
        bar.style.width = '0%';
      });
    });
  }

  so_timer = setInterval(() => {
    so_kalanSure--;
    const sayac = so_el('soTimerSayac');
    if (sayac) {
      const dk = Math.floor(so_kalanSure / 60);
      const sn = so_kalanSure % 60;
      sayac.textContent = dk + ':' + String(sn).padStart(2, '0');
    }
    if (so_kalanSure <= 0) {
      so_timerBit();
    }
  }, 1000);
}

function so_timerBit() {
  clearInterval(so_timer);
  so_timer = null;
  so_bitti = true;
  if (typeof window.koyunSkoru === 'function') window.koyunSkoru(10);
  if (window.profilAktiviteKaydet) window.profilAktiviteKaydet('sureli');
  setTimeout(() => so_sonucEkraniAc(), 600);
}

// ─── 4. Sonuç Ekranı ─────────────────────────────────────────────────────────
function so_sonucEkraniAc() {
  so_ekranGoster('soSonucEkrani');
  const kelimeSayisi = so_secilenMetin ? so_secilenMetin.kelimeSayisi : 50;

  // Sayı seçici oluştur
  const secici = so_el('soKelimeSecici');
  if (secici) {
    secici.innerHTML = '';
    // Önce "Seç" placeholder
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Kaçıncı kelimeye kadar okudun?';
    placeholder.disabled = true;
    placeholder.selected = true;
    secici.appendChild(placeholder);

    for (let i = 1; i <= kelimeSayisi; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + '. kelime';
      secici.appendChild(opt);
    }

    secici.onchange = () => {
      const sonucMetin = so_el('soSonucMetin');
      if (sonucMetin && secici.value) {
        sonucMetin.textContent = '60 saniyede ' + secici.value + '. kelimeye kadar okudun!';
        sonucMetin.style.opacity = '1';
      }
    };
  }

  // Sonuç metnini başta gizle
  const sonucMetin = so_el('soSonucMetin');
  if (sonucMetin) { sonucMetin.textContent = ''; sonucMetin.style.opacity = '0'; }
}

// ─── Temizlik ─────────────────────────────────────────────────────────────────
function so_temizle() {
  if (so_timer) { clearInterval(so_timer); so_timer = null; }
  if (so_geriSayimTimer) { clearInterval(so_geriSayimTimer); so_geriSayimTimer = null; }
  so_basladi = false;
  so_bitti = false;
  so_kalanSure = 60;
}

// ─── Dışa açılan fonksiyon ────────────────────────────────────────────────────
window.surelioOkumaBas = function() {
  so_temizle();
  so_secimEkraniOlustur();
  so_ekranGoster('soSecimEkrani');
};

window.surelioOkumaDurdur = function() {
  so_temizle();
};

// ─── Event Listener'lar (DOM hazır olunca) ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Geri butonları
  const btnSecimGeri = so_el('soBtnSecimGeri');
  if (btnSecimGeri) {
    btnSecimGeri.addEventListener('click', () => {
      so_temizle();
      // Okuma köşesi alt menüsüne dön
      if (window.ekranGoster && window.okumaKoseScreen) {
        window.ekranGoster(window.okumaKoseScreen);
      } else {
        const el = document.getElementById('okumaKoseScreen');
        if (el && window.ekranGoster) window.ekranGoster(el);
      }
    });
  }

  const btnOkumaGeri = so_el('soBtnOkumaGeri');
  if (btnOkumaGeri) {
    btnOkumaGeri.addEventListener('click', () => {
      so_temizle();
      so_secimEkraniOlustur();
      so_ekranGoster('soSecimEkrani');
    });
  }

  // Sonuç ekranı butonları
  const btnTekrar = so_el('soBtnTekrar');
  if (btnTekrar) {
    btnTekrar.addEventListener('click', () => {
      so_temizle();
      so_metinSec(so_secilenMetin);
    });
  }

  const btnSecimedon = so_el('soBtnSecimedön');
  if (btnSecimedon) {
    btnSecimedon.addEventListener('click', () => {
      so_temizle();
      so_secimEkraniOlustur();
      so_ekranGoster('soSecimEkrani');
    });
  }
});

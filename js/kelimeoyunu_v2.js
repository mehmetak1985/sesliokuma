// KELİME OYUNU v2 — HARF SEÇME SİSTEMİ (Modüler, Bağımsız)
// Mevcut state ve puan sistemi korundu.
// Mikrofon sistemi bu modülde YOK.
// ═══════════════════════════════════════════════════════════════
(function kelimeOyunuV2() {

  // ── DOM referansları ──────────────────────────────────────────
  const harfKutuSatir  = document.getElementById('harfKutuSatir');
  const harfButonSatir = document.getElementById('harfButonSatir');

  // ── Türkçe harf havuzu (yanlış seçenekler için) ──────────────
  const HARF_HAVUZU = 'abcçdefgğhıijklmnoöprsştuüvyz'.split('');

  // ── Aktif kelime bilgisi ──────────────────────────────────────
  let aktifKelime    = '';
  let eksikHarfIndex = 0;   // hangi index'teki harf boş (daima son harf)
  let cevapKilitli   = false; // animasyon sırasında tıklamayı engelle

  // ── Yanlış harf seçenekleri üret ─────────────────────────────
  function yanlisSenekler(dogruHarf, adet) {
    const harf = dogruHarf.toLocaleLowerCase('tr-TR');
    const havuz = HARF_HAVUZU.filter(h => h !== harf);
    // Karıştır
    for (let i = havuz.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [havuz[i], havuz[j]] = [havuz[j], havuz[i]];
    }
    return havuz.slice(0, adet);
  }

  // ── Harf kutularını çiz ───────────────────────────────────────
  function harfKutulariniCiz(kelime, eksikIdx) {
    harfKutuSatir.innerHTML = '';
    for (let i = 0; i < kelime.length; i++) {
      const kutu = document.createElement('div');
      kutu.className = 'harf-kutu';
      if (i === eksikIdx) {
        kutu.classList.add('harf-kutu--bos');
        kutu.textContent = '_';
        kutu.id = 'harfKutuBos';
      } else {
        kutu.textContent = kelime[i].toLocaleUpperCase('tr-TR');
      }
      harfKutuSatir.appendChild(kutu);
    }
  }

  // ── 3 harf butonunu çiz ───────────────────────────────────────
  function harfButonlariniCiz(dogruHarf) {
    harfButonSatir.innerHTML = '';

    const yanlislar = yanlisSenekler(dogruHarf, 2);
    const secenekler = [dogruHarf.toLocaleLowerCase('tr-TR'), ...yanlislar];

    // Karıştır
    for (let i = secenekler.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [secenekler[i], secenekler[j]] = [secenekler[j], secenekler[i]];
    }

    secenekler.forEach(harf => {
      const btn = document.createElement('button');
      btn.className   = 'harf-btn';
      btn.textContent = harf.toLocaleUpperCase('tr-TR');
      btn.addEventListener('click', () => harfSecildi(harf, dogruHarf, btn));
      harfButonSatir.appendChild(btn);
    });
  }

  // ── Harf seçildi işleyicisi ───────────────────────────────────
  function harfSecildi(secilen, dogru, btnEl) {
    if (cevapKilitli) return;

    const secilenN = secilen.toLocaleLowerCase('tr-TR');
    const dogruN   = dogru.toLocaleLowerCase('tr-TR');

    if (secilenN === dogruN) {
      // ✅ Doğru
      cevapKilitli = true;

      // Boş kutuyu doldur
      const bosKutu = document.getElementById('harfKutuBos');
      if (bosKutu) {
        bosKutu.textContent = dogru.toLocaleUpperCase('tr-TR');
        bosKutu.classList.remove('harf-kutu--bos');
        bosKutu.classList.add('harf-kutu--dogru');
      }

      // Puan: mevcut sistemi kullan
      koyunSkor  += 2;
      totalScore += 2;
      koyunScoreEl.textContent = koyunSkor;
      koyunResult.textContent  = '✅ Harika! +2 ⭐';
      koyunResult.className    = 'koyun-result dogru';
      koyunCard.className      = 'koyun-card correct-flash';

      sesCal('dogru');
      kontrolRozetlerYildiz();

      setTimeout(() => {
        koyunCard.className = 'koyun-card';
        cevapKilitli = false;
        koyunSonraki();
      }, 1200);

    } else {
      // ❌ Yanlış — kırmızı animasyon, sonra eski haline dön
      if (cevapKilitli) return;
      cevapKilitli = true;

      btnEl.classList.add('harf-btn--yanlis');
      koyunResult.textContent = '❌ Tekrar dene!';
      koyunResult.className   = 'koyun-result yanlis';
      koyunCard.className     = 'koyun-card wrong-flash';
      koyunYanlis++;

      sesCal('yanlis');

      setTimeout(() => {
        btnEl.classList.remove('harf-btn--yanlis');
        koyunCard.className  = 'koyun-card';
        koyunResult.textContent = '';
        koyunResult.className   = 'koyun-result';
        cevapKilitli = false;
      }, 700);
    }
  }

  // ── Dışarıya açılan ana fonksiyon ────────────────────────────
  // koyunGoster() tarafından çağrılır
  window.koyunV2HarfGoster = function(kelime) {
    aktifKelime    = kelime;
    eksikHarfIndex = kelime.length - 1;   // daima son harf boş
    cevapKilitli   = false;

    harfKutulariniCiz(kelime, eksikHarfIndex);
    harfButonlariniCiz(kelime[eksikHarfIndex]);
  };

})(); // kelimeOyunuV2

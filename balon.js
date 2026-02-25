// BALON OYUNU - ULTRA MOBILE OPTIMIZED

(function () {

  const kelimeler = [
    "EL","AT","SU","TOP","KEDI","EV","OKUL",
    "BAL","ARABA","KUS","CICEK","ANNE"
  ];

  let aktifKelime = "";
  let oyunAlani = null;
  let hedefYazi = null;
  let dogruSayisi = 0;
  let seviye = 1;
  let oyunAktif = false;

  let animasyonId = null;
  let balonListesi = [];

  /* ================= INIT ================= */

  function balonBas() {

    oyunAlani = document.getElementById("balonAlani");
    hedefYazi = document.getElementById("balonHedef");

    if (!oyunAlani || !hedefYazi) return;

    temizle();

    oyunAlani.style.position = "relative";
    oyunAlani.style.overflow = "hidden";

    dogruSayisi = 0;
    seviye = 1;
    oyunAktif = true;

    yeniTur();
  }

  function temizle() {

    oyunAktif = false;

    if (animasyonId) {
      cancelAnimationFrame(animasyonId);
      animasyonId = null;
    }

    balonListesi = [];

    if (oyunAlani) oyunAlani.innerHTML = "";
  }

  /* ================= GAME LOOP ================= */

  function yeniTur() {

    if (!oyunAktif) return;

    balonListesi = [];
    oyunAlani.innerHTML = "";

    aktifKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
    hedefYazi.textContent = "ŞUNU PATLAT: " + aktifKelime;

    balonUret();
    animasyonBaslat();
  }

  function balonUret() {

    const adet = Math.min(3 + (seviye - 1), 6);

    for (let i = 0; i < adet; i++) {

      const balon = document.createElement("div");
      balon.className = "balon";
      balon.textContent = rastgeleKelime();

      stilUygula(balon);
      oyunAlani.appendChild(balon);

      rastgeleKonum(balon);

      balonListesi.push({
        el: balon,
        x: parseFloat(balon.style.left),
        y: parseFloat(balon.style.top),
        yon: Math.random() > 0.5 ? 1 : -1
      });

      balon.onclick = function () {

        if (!oyunAktif) return;

        if (balon.textContent === aktifKelime) {

          oyunAktif = false;

          patlatEfekt(balon);
          genelPuanArttir();

          dogruSayisi++;
          if (dogruSayisi % 5 === 0) seviye++;

          setTimeout(() => {
            oyunAktif = true;
            yeniTur();
          }, 500);

        } else {
          balon.style.transform = "scale(0.85)";
          setTimeout(() => balon.style.transform = "scale(1)", 150);
        }
      };
    }

    const sec = oyunAlani.children[
      Math.floor(Math.random() * oyunAlani.children.length)
    ];
    if (sec) sec.textContent = aktifKelime;
  }

  /* ================= ANIMATION ================= */

  function animasyonBaslat() {

    function frame() {

      if (!oyunAktif || document.hidden) return;

      const hiz = 0.7 + (seviye * 0.15);

      for (let i = 0; i < balonListesi.length; i++) {

        const b = balonListesi[i];

        b.y -= hiz;
        b.x += 0.5 * b.yon;

        if (b.x < 10 || b.x > oyunAlani.clientWidth - 80)
          b.yon *= -1;

        if (b.y < -80) {
          b.el.remove();
          balonListesi.splice(i, 1);
          i--;
          continue;
        }

        b.el.style.top = b.y + "px";
        b.el.style.left = b.x + "px";
      }

      animasyonId = requestAnimationFrame(frame);
    }

    animasyonId = requestAnimationFrame(frame);
  }

  /* ================= POSITION ================= */

  function rastgeleKonum(balon) {

    const width = oyunAlani.clientWidth || 300;
    const height = oyunAlani.clientHeight || 400;

    balon.style.left = Math.random() * (width - 80) + "px";
    balon.style.top = Math.random() * (height - 120) + "px";
  }

  /* ================= STYLE ================= */

  function stilUygula(balon) {
    balon.style.position = "absolute";
    balon.style.width = "70px";
    balon.style.height = "70px";
    balon.style.borderRadius = "50%";
    balon.style.display = "flex";
    balon.style.alignItems = "center";
    balon.style.justifyContent = "center";
    balon.style.fontWeight = "bold";
    balon.style.cursor = "pointer";
    balon.style.userSelect = "none";
    balon.style.backgroundColor = rastgeleRenk();
  }

  function rastgeleKelime() {
    return kelimeler[Math.floor(Math.random() * kelimeler.length)];
  }

  function rastgeleRenk() {
    const renkler = ["#ff7675","#74b9ff","#55efc4","#ffeaa7","#a29bfe"];
    return renkler[Math.floor(Math.random() * renkler.length)];
  }

  /* ================= EFFECT ================= */

  function patlatEfekt(balon) {
    balon.style.transition = "all 0.25s";
    balon.style.transform = "scale(1.4)";
    balon.style.opacity = "0";
    setTimeout(() => balon.remove(), 250);
  }

  /* ================= SCORE ================= */

  function genelPuanArttir() {
    if (typeof window.genelPuan === "number") {
      window.genelPuan += 10;
    }
  }

  /* ================= VISIBILITY AUTO PAUSE ================= */

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (animasyonId) cancelAnimationFrame(animasyonId);
    } else if (oyunAktif) {
      animasyonBaslat();
    }
  });

  /* ================= EXPORT ================= */

  window.balonBas = balonBas;
  window.balonDurdur = temizle;

})();

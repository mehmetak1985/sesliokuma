// BALON OYUNU - balonAlan UYUMLU STABLE

(function () {

  const kelimeler = [
    "EL","AT","SU","TOP","KEDI","EV","OKUL",
    "BAL","ARABA","KUS","CICEK","ANNE"
  ];

  let aktifKelime = "";
  let alan = null;
  let hedefEl = null;
  let dogruSayisi = 0;
  let seviye = 1;
  let oyunAktif = false;
  let animasyonId = null;
  let balonListesi = [];

  document.addEventListener("DOMContentLoaded", function () {
    balonBas();
  });

  function balonBas() {

    alan = document.getElementById("balonAlan");
    hedefEl = document.getElementById("balonHedefText");

    if (!alan || !hedefEl) {
      console.log("balonAlan bulunamadı");
      return;
    }

    temizle();

    alan.style.position = "relative";
    alan.style.overflow = "hidden";

    if (alan.clientHeight < 200) {
      alan.style.height = "400px";
    }

    dogruSayisi = 0;
    seviye = 1;
    oyunAktif = true;

    yeniTur();
  }

  function temizle() {
    oyunAktif = false;
    if (animasyonId) cancelAnimationFrame(animasyonId);
    balonListesi = [];
    if (alan) alan.innerHTML = "";
  }

  function yeniTur() {

    if (!oyunAktif) return;

    balonListesi = [];
    alan.innerHTML = "";

    aktifKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
    hedefEl.textContent = '🎯 "' + aktifKelime + '" kelimeyi bul!';

    balonUret();
    animasyonBaslat();
  }

  function balonUret() {

    const adet = Math.min(3 + (seviye - 1), 6);

    const width = alan.clientWidth || 300;
    const height = alan.clientHeight || 400;

    for (let i = 0; i < adet; i++) {

      const balon = document.createElement("div");
      balon.className = "balon";
      balon.textContent = rastgeleKelime();

      stilUygula(balon);
      alan.appendChild(balon);

      const x = Math.random() * (width - 80);
      const y = Math.random() * (height - 120);

      balon.style.left = x + "px";
      balon.style.top = y + "px";

      balonListesi.push({
        el: balon,
        x: x,
        y: y,
        yon: Math.random() > 0.5 ? 1 : -1
      });

      balon.onclick = function () {

        if (!oyunAktif) return;

        if (balon.textContent === aktifKelime) {

          oyunAktif = false;

          patlatEfekt(balon);

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

    const sec = alan.children[
      Math.floor(Math.random() * alan.children.length)
    ];
    if (sec) sec.textContent = aktifKelime;
  }

  function animasyonBaslat() {

    function frame() {

      if (!oyunAktif) return;

      const hiz = 0.7 + (seviye * 0.15);

      for (let i = 0; i < balonListesi.length; i++) {

        const b = balonListesi[i];

        b.y -= hiz;
        b.x += 0.5 * b.yon;

        if (b.x < 10 || b.x > alan.clientWidth - 80)
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
    const renkler = ["#ef476f","#f4a261","#ffd166","#06d6a0","#118ab2"];
    return renkler[Math.floor(Math.random() * renkler.length)];
  }

  function patlatEfekt(balon) {
    balon.style.transition = "all 0.25s";
    balon.style.transform = "scale(1.4)";
    balon.style.opacity = "0";
    setTimeout(() => balon.remove(), 250);
  }

})();

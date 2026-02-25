(function () {

  const kelimeler = [
    "EL","AT","SU","TOP","KEDI","EV","OKUL",
    "BAL","ARABA","KUS","CICEK","ANNE"
  ];

  let aktifKelime = "";
  let alan = null;
  let hedefEl = null;
  let seviye = 1;
  let oyunAktif = false;
  let animasyonId = null;
  let balonListesi = [];

  document.addEventListener("DOMContentLoaded", balonBas);

  function balonBas() {

    alan = document.getElementById("balonAlan");
    hedefEl = document.getElementById("balonHedefText");

    if (!alan || !hedefEl) return;

    alan.style.position = "relative";
    alan.style.overflow = "hidden";

    if (alan.clientHeight < 200) {
      alan.style.height = "400px";
    }

    oyunAktif = true;
    yeniTur();
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
    const width = alan.clientWidth;
    const height = alan.clientHeight;

    for (let i = 0; i < adet; i++) {

      const balon = document.createElement("div");
      balon.textContent = rastgeleKelime();
      stilUygula(balon);
      alan.appendChild(balon);

      const x = Math.random() * (width - 80);
      const y = height + Math.random() * 150; // ALTTA DOĞAR

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
          balon.remove();
          setTimeout(() => {
            oyunAktif = true;
            yeniTur();
          }, 400);
        }
      };
    }

    const sec = alan.children[Math.floor(Math.random() * alan.children.length)];
    if (sec) sec.textContent = aktifKelime;
  }

  function animasyonBaslat() {

    function frame() {

      if (!oyunAktif) return;

      const hiz = 1.2;

      for (let i = 0;

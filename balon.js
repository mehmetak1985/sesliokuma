(function () {

  const kelimeler = [
    "EL","AT","SU","TOP","KEDI","EV","OKUL",
    "BAL","ARABA","KUS","CICEK","ANNE"
  ];

  let aktifKelime = "";
  let alan = null;
  let hedefEl = null;
  let oyunAktif = false;
  let animasyonId = null;
  let balonListesi = [];
  let lastTime = 0;
  let yanlisSayisi = 0;

  document.addEventListener("DOMContentLoaded", balonBas);

  function balonBas() {

    alan = document.getElementById("balonAlan");
    hedefEl = document.getElementById("balonHedefText");

    if (!alan || !hedefEl) return;

    alan.style.position = "relative";
    alan.style.overflow = "hidden";

    hedefEl.style.fontSize = "28px";
    hedefEl.style.fontWeight = "bold";

    oyunAktif = true;
    yeniTur();
  }

  function yeniTur() {

    cancelAnimationFrame(animasyonId);

    balonListesi.forEach(b => b.el.remove());
    balonListesi = [];
    yanlisSayisi = 0;

    aktifKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
    hedefEl.textContent = '🎯 "' + aktifKelime + '" kelimeyi bul!';

    balonUret();
    animasyonBaslat();
  }

  function balonUret() {

    const adet = 4;
    const width = alan.clientWidth;
    const height = alan.clientHeight;
    const minMesafe = 90;
    let kullanilanX = [];

    for (let i = 0; i < adet; i++) {

      const balon = document.createElement("div");
      balon.textContent = rastgeleKelime();
      stilUygula(balon);
      alan.appendChild(balon);

      let x, guvenli = false, deneme = 0;

      while (!guvenli && deneme < 20) {
        x = Math.random() * (width - 90);
        guvenli = kullanilanX.every(px => Math.abs(px - x) > minMesafe);
        deneme++;
      }

      kullanilanX.push(x);

      const y = height;

      balon.style.left = x + "px";
      balon.style.top = y + "px";

      balonListesi.push({
        el: balon,
        y: y,
        hiz: 50 + Math.random() * 20,
        dogru: false,
        scale: 1
      });

      balon.onclick = function () {
        if (!oyunAktif) return;

        if (balon.textContent === aktifKelime) {

          if (window.koyunSkoru) window.koyunSkoru(10);

          oyunAktif = false;
          cancelAnimationFrame(animasyonId);

          const obje = balonListesi.find(b => b.el === balon);
          if (obje) obje.scale = 1.3;

          setTimeout(() => {
            yeniTur();
          }, 400);

        } else {

          yanlisSayisi++;
          if (window.koyunSkoru) window.koyunSkoru(-2);

          balon.style.opacity = "0.5";
          balon.style.pointerEvents = "none";

          if (yanlisSayisi >= 2) {
            dogruyuVurgula();
          }
        }
      };
    }

    const sec = balonListesi[Math.floor(Math.random() * balonListesi.length)];
    if (sec) {
      sec.el.textContent = aktifKelime;
      sec.dogru = true;
    }
  }

  function dogruyuVurgula() {
    const dogruBalon = balonListesi.find(b => b.dogru);
    if (!dogruBalon) return;

    dogruBalon.scale = 1.2;
    dogruBalon.el.style.boxShadow = "0 0 20px 8px #fff";
  }

  function animasyonBaslat() {

    lastTime = performance.now();

    function frame(time) {

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      for (let i = balonListesi.length - 1; i >= 0; i--) {

        const b = balonListesi[i];
        b.y -= b.hiz * delta;

        b.el.style.transform =
          `translateY(${b.y - alan.clientHeight}px) scale(${b.scale})`;

        if (b.y < -100) {
          b.el.remove();
          balonListesi.splice(i, 1);
        }
      }

      if (balonListesi.length === 0) {
        yeniTur();
        return;
      }

      animasyonId = requestAnimationFrame(frame);
    }

    animasyonId = requestAnimationFrame(frame);
  }

  function rastgeleKelime() {
    return kelimeler[Math.floor(Math.random() * kelimeler.length)];
  }

  function stilUygula(el) {
    el.style.position = "absolute";
    el.style.width = "90px";
    el.style.height = "90px";
    el.style.borderRadius = "50%";
    el.style.background = renkUret();
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.color = "#fff";
    el.style.fontWeight = "bold";
    el.style.fontSize = "20px";
    el.style.cursor = "pointer";
    el.style.userSelect = "none";
    el.style.willChange = "transform";
  }

  function renkUret() {
    const renkler = ["#ef476f","#f4a261","#ffd166","#06d6a0","#118ab2","#8e24aa","#e91e63","#00acc1"];
    return renkler[Math.floor(Math.random() * renkler.length)];
  }

})();

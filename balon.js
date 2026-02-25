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
  let lastTime = 0;

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

    cancelAnimationFrame(animasyonId);
    balonListesi.forEach(b => b.el.remove());
    balonListesi = [];

    aktifKelime = kelimeler[Math.floor(Math.random() * kelimeler.length)];
    hedefEl.textContent = '🎯 "' + aktifKelime + '" kelimeyi bul!';

    balonUret();
    animasyonBaslat();
  }

  function balonUret() {

    const adet = Math.max(4, Math.min(3 + (seviye - 1), 6));
    const width = alan.clientWidth;
    const height = alan.clientHeight;
    const minMesafe = 90;

    let kullanilanX = [];

    for (let i = 0; i < adet; i++) {

      const balon = document.createElement("div");
      balon.textContent = rastgeleKelime();
      stilUygula(balon);
      alan.appendChild(balon);

      let x;
      let guvenli = false;
      let deneme = 0;

      while (!guvenli && deneme < 20) {
        x = Math.random() * (width - 80);
        guvenli = kullanilanX.every(px => Math.abs(px - x) > minMesafe);
        deneme++;
      }

      kullanilanX.push(x);

      const y = height; // HER ZAMAN ALTTA DOĞAR

      balon.style.left = x + "px";
      balon.style.top = y + "px";

      balonListesi.push({
        el: balon,
        x: x,
        y: y,
        hiz: 40 + Math.random() * 30
      });

      balon.onclick = function () {
        if (!oyunAktif) return;

        if (balon.textContent === aktifKelime) {
          oyunAktif = false;
          cancelAnimationFrame(animasyonId);

          balon.remove();

          setTimeout(() => {
            oyunAktif = true;
            yeniTur();
          }, 400);
        }
      };
    }

    // En az 1 doğru garanti
    const sec = balonListesi[Math.floor(Math.random() * balonListesi.length)];
    if (sec) sec.el.textContent = aktifKelime;
  }

  function animasyonBaslat() {

    lastTime = performance.now();

    function frame(time) {

      if (!oyunAktif) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      for (let i = balonListesi.length - 1; i >= 0; i--) {

        const b = balonListesi[i];
        b.y -= b.hiz * delta;
        b.el.style.transform = `translateY(${b.y - alan.clientHeight}px)`;

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
    el.style.width = "80px";
    el.style.height = "80px";
    el.style.borderRadius = "50%";
    el.style.background = renkUret();
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.color = "#fff";
    el.style.fontWeight = "bold";
    el.style.cursor = "pointer";
    el.style.userSelect = "none";
    el.style.willChange = "transform";
  }

  function renkUret() {
    const renkler = ["#ef476f","#f4a261","#ffd166","#06d6a0","#118ab2","#8e24aa","#e91e63","#00acc1"];
    return renkler[Math.floor(Math.random() * renkler.length)];
  }

})();

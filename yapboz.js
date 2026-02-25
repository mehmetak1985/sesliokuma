"use strict";

(function () {
    const kelimeler = [
        { kelime: "EL", emoji: "🖐️", seviye: 1 },
        { kelime: "AL", emoji: "🍎", seviye: 1 },
        { kelime: "LALE", emoji: "🌷", seviye: 2 },
        { kelime: "KALE", emoji: "🏰", seviye: 2 },
        { kelime: "ELMA", emoji: "🍎", seviye: 3 },
        { kelime: "ANNE", emoji: "👩", seviye: 3 },
        { kelime: "OKUL", emoji: "🏫", seviye: 4 },
        { kelime: "KİTAP", emoji: "📚", seviye: 4 },
        { kelime: "ÇİÇEK", emoji: "🌸", seviye: 5 },
        { kelime: "TAVŞAN", emoji: "🐰", seviye: 5 }
    ];

    let seviye = 0;
    let kelimeIdx = 0;
    let seciliHarfler = [];
    let durduruldu = false;

    // DOM Elemanları
    const alan = document.getElementById('yapbozAlan');
    const ekran = document.getElementById('yapbozScreen');

    // Menüdeki butonu HTML'i değiştirmeden bağlar
    function butonlariBagla() {
        const menuButonlari = document.querySelectorAll('.koyun-menu-item');
        menuButonlari.forEach(btn => {
            if (btn.innerText.includes("Kelime Yapbozu")) {
                btn.onclick = () => window.yapbozBas();
            }
        });

        const geriBtn = document.getElementById('btnYapbozBack');
        if (geriBtn) geriBtn.onclick = () => window.yapbozDurdur();
    }

    function render() {
        if (durduruldu || !alan) return;
        const veri = kelimeler.filter(k => k.seviye === seviye + 1)[kelimeIdx] || kelimeler[0];
        const kelime = veri.kelime;

        alan.innerHTML = `
            <div class="yapboz-emoji">${veri.emoji}</div>
            <div class="yapboz-hedef">
                ${kelime.split('').map((h, i) => `
                    <div class="yapboz-slot ${seciliHarfler[i] ? 'dolu' : ''}">${seciliHarfler[i] || ''}</div>
                `).join('')}
            </div>
            <div class="yapboz-harfler">
                ${karistir(kelime.split('')).map(h => `
                    <button class="yapboz-harf-btn" onclick="window.yapbozHarfSec('${h}')">${h}</button>
                `).join('')}
            </div>
        `;

        const sevText = document.getElementById('yapbozSeviyeText');
        const kelText = document.getElementById('yapbozKelimeText');
        if (sevText) sevText.innerText = `Seviye ${seviye + 1} / 5`;
        if (kelText) kelText.innerText = `Kelime ${kelimeIdx + 1} / 2`;
    }

    window.yapbozHarfSec = (harf) => {
        const veri = kelimeler.filter(k => k.seviye === seviye + 1)[kelimeIdx];
        const hedef = veri.kelime;
        
        if (hedef[seciliHarfler.length] === harf) {
            seciliHarfler.push(harf);
            render();
            if (seciliHarfler.length === hedef.length) {
                if (typeof window.koyunSkoru === 'function') window.koyunSkoru(10); //
                setTimeout(sonraki, 500);
            }
        } else {
            alan.classList.add('salla');
            setTimeout(() => alan.classList.remove('salla'), 500);
        }
    };

    function sonraki() {
        seciliHarfler = [];
        kelimeIdx++;
        if (kelimeIdx >= 2) {
            kelimeIdx = 0;
            seviye++;
        }
        if (seviye >= 5) {
            alert("Tebrikler! Tüm yapbozları tamamladın.");
            window.yapbozDurdur();
        } else {
            render();
        }
    }

    function karistir(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    window.yapbozBas = () => {
        // app.js navigasyon uyumu
        if (typeof window.hideAllScreens === 'function') window.hideAllScreens();
        
        if (ekran) {
            ekran.style.display = 'block';
            ekran.classList.add('fade-in');
        }
        seviye = 0;
        kelimeIdx = 0;
        seciliHarfler = [];
        durduruldu = false;
        render();
    };

    window.yapbozDurdur = () => {
        durduruldu = true;
        if (ekran) ekran.style.display = 'none';
        const menu = document.getElementById('oyunKosesiScreen'); //
        if (menu) menu.style.display = 'block';
    };

    // Dinamik yükleme koruması
    if (document.readyState === 'complete') {
        butonlariBagla();
    } else {
        window.addEventListener('load', butonlariBagla);
    }
    setTimeout(butonlariBagla, 1000); // Yedek tetikleyici
})();

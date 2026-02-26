"use strict";

(function () {
    const kelimeler = [
        { kelime: "EL", emoji: "🖐️", seviye: 1 }, { kelime: "AT", emoji: "🐎", seviye: 1 },
        { kelime: "LALE", emoji: "🌷", seviye: 2 }, { kelime: "KALE", emoji: "🏰", seviye: 2 },
        { kelime: "ELMA", emoji: "🍎", seviye: 3 }, { kelime: "ANNE", emoji: "👩", seviye: 3 },
        { kelime: "OKUL", emoji: "🏫", seviye: 4 }, { kelime: "KİTAP", emoji: "📚", seviye: 4 },
        { kelime: "ÇİÇEK", emoji: "🌸", seviye: 5 }, { kelime: "TAVŞAN", emoji: "🐰", seviye: 5 }
    ];

    let seviye = 0, kelimeIdx = 0, seciliHarfler = [], durduruldu = false;
    const alan = document.getElementById('yapbozAlan');
    const ekran = document.getElementById('yapbozScreen');

    const stilEkle = () => {
        if (document.getElementById('yapbozStandartStil')) return;
        const style = document.createElement('style');
        style.id = 'yapbozStandartStil';
        style.innerHTML = `
            #yapbozAlan { 
                display: flex; flex-direction: column; align-items: center; 
                width: 100%; max-width: 500px; margin: 0 auto; gap: 20px; padding: 20px;
                min-height: 400px; justify-content: center;
            }
            .yapboz-emoji { font-size: 6rem; margin-bottom: 15px; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.1)); transition: all 0.3s ease; }
            .yapboz-hedef { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; min-height: 80px; width: 100%; }
            .yapboz-slot { 
                width: 65px; height: 65px; border: 3px dashed #cbd5e1; border-radius: 16px;
                display: flex; align-items: center; justify-content: center;
                font-size: 2.2rem; font-weight: 800; color: #1e293b; background: rgba(255,255,255,0.7);
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s;
            }
            .yapboz-slot.dolu { border-style: solid; border-color: #22c55e; background: #f0fdf4; transform: scale(1.05); }
            .yapboz-harfler { 
                display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; 
                margin-top: 40px; padding: 20px; background: rgba(255,255,255,0.3); border-radius: 24px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.05); backdrop-filter: blur(4px);
            }
            .yapboz-harf-btn { 
                min-width: 60px; min-height: 60px; border: none; border-radius: 18px;
                background: linear-gradient(135deg, #ffffff, #f8fafc);
                box-shadow: 0 5px 0 #94a3b8; font-size: 2rem; font-weight: 800; color: #334155;
                cursor: pointer; transition: all 0.1s; display: flex; align-items: center; justify-content: center;
            }
            .yapboz-harf-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #94a3b8; }
            .yapboz-harf-btn:hover { background: #fff; }
            .salla { animation: salla 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            @keyframes salla { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        `;
        document.head.appendChild(style);
    };

    function butonlariBagla() {
        const items = document.querySelectorAll('.koyun-menu-item');
        if (items.length === 0) return; // Henüz render edilmemişse çık
        items.forEach(btn => {
            if (btn.innerText.includes("Kelime Yapbozu")) {
                btn.onclick = (e) => { e.preventDefault(); window.yapbozBas(); };
            }
        });
        const geriBtn = document.getElementById('btnYapbozBack');
        if (geriBtn) geriBtn.onclick = () => window.yapbozDurdur();
    }

    function render() {
        if (durduruldu || !alan) return;
        const currentSeviye = kelimeler.filter(k => k.seviye === seviye + 1);
        const veri = currentSeviye[kelimeIdx] || currentSeviye[0] || kelimeler[0];
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
                    <button class="yapboz-harf-btn">${h}</button>
                `).join('')}
            </div>
        `;

        alan.querySelectorAll('.yapboz-harf-btn').forEach(btn => {
            btn.onclick = () => window.yapbozHarfSec(btn.innerText);
        });

        const sevText = document.getElementById('yapbozSeviyeText');
        const kelText = document.getElementById('yapbozKelimeText');
        if (sevText) sevText.innerText = `Seviye ${seviye + 1} / 5`;
        if (kelText) kelText.innerText = `Kelime ${kelimeIdx + 1} / 2`;
    }

    window.yapbozHarfSec = (harf) => {
        const currentSeviye = kelimeler.filter(k => k.seviye === seviye + 1);
        const veri = currentSeviye[kelimeIdx] || currentSeviye[0];
        const hedef = veri.kelime;
        
        if (hedef[seciliHarfler.length] === harf) {
            seciliHarfler.push(harf);
            render();
            if (seciliHarfler.length === hedef.length) {
                if (typeof window.koyunSkoru === 'function') window.koyunSkoru(10);
                setTimeout(sonraki, 700);
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
            alan.innerHTML = `<div class="yapboz-emoji">🏆</div><h2 style="color:#1e293b; font-family:'Baloo 2'">Harikasın!</h2>`;
            setTimeout(window.yapbozDurdur, 2000);
        } else {
            render();
        }
    }

    function karistir(a) { return [...a].sort(() => Math.random() - 0.5); }

    window.yapbozBas = () => {
        stilEkle();
        if (typeof window.hideAllScreens === 'function') window.hideAllScreens();
        if (ekran) {
            ekran.style.display = 'block';
            ekran.scrollTop = 0;
        }
        seviye = 0; kelimeIdx = 0; seciliHarfler = []; durduruldu = false;
        render();
    };

    window.yapbozDurdur = () => {
        durduruldu = true;
        if (ekran) ekran.style.display = 'none';
        const menu = document.getElementById('oyunKosesiScreen');
        if (menu) menu.style.display = 'block';
    };

    // Güvenli Bağlantı Başlatıcı
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', butonlariBagla);
    } else {
        butonlariBagla();
    }
    // Mobil tarayıcılar ve dinamik render için yedek
    setTimeout(butonlariBagla, 1500);
})();

(function(){
"use strict";

// 1. Yazılım Mühendisi Dokunuşu: State (Durum) Yönetimi
let state = { soruIdx: 0, dogruSayaci: 0, kilit: false };
const KELIMELER = [{k:'BALIK', e:'🐟'}, {k:'GÜNEŞ', e:'☀️'}, {k:'ARABA', e:'🚗'}, {k:'ELMA', e:'🍎'}, {k:'KÖPEK', e:'🐶'}, {k:'UÇAK', e:'✈️'}];

// 2. DOM Elementlerini bir kez yakala (Ölümsüz nesneler)
const alan = document.getElementById('uzayAlan');
if(!alan) return;

// Sahnemizi tek seferlik kuruyoruz (Burası bir daha asla silinmeyecek)
alan.innerHTML = `
    <div id="oyunKapsayici" style="text-align:center; color:#fff;">
        <div id="soruEmoji" style="font-size:4rem; height:80px; transition: transform 0.3s;"></div>
        <div id="sayacYazisi" style="color:#ffd700; font-weight:bold; margin:10px 0;">3 MANEVRA KALDI</div>
        <div id="pencere" style="height:250px; position:relative; overflow:hidden; background:rgba(0,0,0,0.2); border-radius:20px;">
            <div id="mekik" style="font-size:4.5rem; position:absolute; bottom:20px; left:50%; transform:translateX(-50%); z-index:999; transition: none;">🚀</div>
            <div id="flame" style="display:none; position:absolute; bottom:5px; left:50%; transform:translateX(-50%); font-size:2.5rem; animation: flicker 0.1s infinite;">🔥</div>
        </div>
        <div id="butonGrubu" style="display:flex; gap:10px; margin-top:15px; padding:0 10px;"></div>
    </div>
`;

const mekik = document.getElementById('mekik');
const flame = document.getElementById('flame');
const soruEmoji = document.getElementById('soruEmoji');
const sayacYazisi = document.getElementById('sayacYazisi');
const butonGrubu = document.getElementById('butonGrubu');

function yeniSoru() {
    state.kilit = false;
    const s = KELIMELER[state.soruIdx % KELIMELER.length];
    
    // Mekiği sessizce başlangıca çek (Kullanıcı görmeden)
    mekik.style.transition = "none"; 
    mekik.style.bottom = "20px";
    mekik.style.transform = "translateX(-50%) scale(1)";
    flame.style.display = "none";

    soruEmoji.textContent = s.e;
    sayacYazisi.textContent = `${3 - state.dogruSayaci} MANEVRA KALDI`;

    // Seçenekleri hazırla
    const adet = state.soruIdx >= 3 ? 3 : 2;
    let secenekler = [s.k];
    while(secenekler.length < adet) {
        let r = KELIMELER[Math.floor(Math.random()*KELIMELER.length)].k;
        if(!secenekler.includes(r)) secenekler.push(r);
    }
    
    butonGrubu.innerHTML = shuffle(secenekler).map(m => 
        `<button class="uzay-btn" style="flex:1; padding:15px; border-radius:15px; border:2px solid #fff; background:none; color:#fff; cursor:pointer; font-weight:bold;">${m}</button>`
    ).join('');

    // Event Listener'ları bağla
    butonGrubu.querySelectorAll('.uzay-btn').forEach(b => {
        b.onclick = () => kontrol(b.textContent, b);
    });
}

function kontrol(secilen, btn) {
    if(state.kilit) return;
    const dogrumu = secilen === KELIMELER[state.soruIdx % KELIMELER.length].k;

    if(dogrumu) {
        state.kilit = true;
        state.dogruSayaci++;
        btn.style.background = "#2ecc71";
        if (typeof window.koyunSkoru === 'function') window.koyunSkoru(10);

        if(state.dogruSayaci >= 3) {
            // FIRLATMA OPERASYONU
            flame.style.display = "block";
            // Tarayıcıyı zorla (Reflow)
            void mekik.offsetWidth; 
            mekik.style.transition = "bottom 2s ease-in, transform 2s ease-in";
            mekik.style.bottom = "600px";
            mekik.style.transform = "translateX(-50%) scale(1.8)";
            
            state.dogruSayaci = 0;
            setTimeout(() => { state.soruIdx++; yeniSoru(); }, 2200);
        } else {
            // Küçük Sıçrama
            mekik.style.transition = "bottom 0.4s ease-out";
            mekik.style.bottom = "80px";
            setTimeout(() => { 
                mekik.style.bottom = "20px"; 
                state.soruIdx++; 
                yeniSoru(); 
            }, 600);
        }
    } else {
        btn.style.background = "#e74c3c";
        mekik.style.animation = "shake 0.4s";
        setTimeout(() => { mekik.style.animation = ""; btn.style.background = "none"; }, 400);
    }
}

function shuffle(a){return a.sort(()=>Math.random()-0.5);}

// Global API
window.uzayBas = function() {
  state.soruIdx = 0;
  state.dogruSayaci = 0;
  state.kilit = false;
  yeniSoru();
};

window.uzayDurdur = function() {
  state.kilit = true;
};

const style = document.createElement('style');
style.innerHTML = `
    @keyframes flicker { 0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.2); } }
    @keyframes shake { 0%, 100% { transform: translateX(-50%); } 25% { transform: translateX(-60%); } 75% { transform: translateX(-40%); } }
`;
document.head.appendChild(style);

})();

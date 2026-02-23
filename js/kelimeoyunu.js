// KELİME OYUNU
// ═══════════════════════════════════════════════════════════════

// ─── Kelime → Emoji tablosu ───────────────────────────────────
const KELIME_EMOJI = {
  // Hayvanlar
  'kedi':    '🐱',
  'köpek':   '🐶',
  'kuş':     '🐦',
  'balık':   '🐟',
  'arı':     '🐝',
  'inek':    '🐄',
  'at':      '🐴',
  'tavuk':   '🐔',
  'kelebek': '🦋',
  'karınca': '🐜',
  // Doğa
  'çiçek':   '🌸',
  'ağaç':    '🌳',
  'elma':    '🍎',
  'güneş':   '☀️',
  'ay':      '🌙',
  'yıldız':  '⭐',
  'bulut':   '☁️',
  'kar':     '❄️',
  'yağmur':  '🌧️',
  // Nesneler
  'kitap':   '📚',
  'kalem':   '✏️',
  'okul':    '🏫',
  'ev':      '🏠',
  'araba':   '🚗',
  'top':     '⚽',
  'balon':   '🎈',
  'pasta':   '🎂',
  'elma':    '🍎',
  'armut':   '🍐',
  'muz':     '🍌',
  'çilek':   '🍓',
  'portakal':'🍊',
  // Renkler / Kavramlar
  'kırmızı': '🔴',
  'mavi':    '🔵',
  'yeşil':   '🟢',
  'sarı':    '🟡',
  'mor':     '🟣',
};

// ─── Oyun kelime listesi (görsel olan anlamlı kelimeler) ───────
const KOYUN_KELIMELER = [
  'kedi','köpek','kuş','balık','arı','inek','at','tavuk','kelebek',
  'çiçek','ağaç','elma','güneş','ay','yıldız','bulut',
  'kitap','kalem','okul','ev','araba','top','balon','pasta',
  'armut','muz','çilek','portakal',
  // renkler çıkarıldı — emoji gösterimi uygun değil
];

// ─── Kelime Oyunu Durumu ───────────────────────────────────────
let koyunIndex     = 0;
let koyunSkor      = 0;
let koyunYanlis    = 0;
let koyunAktif     = false;
let koyunRec       = null;
let koyunRecState  = 'idle';
let koyunSiralamis = [];

// ─── DOM ──────────────────────────────────────────────────────
const koyunScreen       = document.getElementById('koyunScreen');
const koyunBtnStart     = document.getElementById('koyunBtnStart');
const koyunBtnSkip      = document.getElementById('koyunBtnSkip');
const btnKoyunBack      = document.getElementById('btnKoyunBack');
const koyunEmoji        = document.getElementById('koyunEmoji');
const koyunHint         = document.getElementById('koyunHint');
const koyunResult       = document.getElementById('koyunResult');
const koyunMicIndicator = document.getElementById('koyunMicIndicator');
const koyunMicStatus    = document.getElementById('koyunMicStatus');
const koyunInterimText  = document.getElementById('koyunInterimText');
const koyunScoreEl      = document.getElementById('koyunScore');
const koyunErrorMsg     = document.getElementById('koyunErrorMsg');
const koyunCard         = document.getElementById('koyunCard');

// ─── Yardımcılar ──────────────────────────────────────────────
function koyunKarıstir(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function koyunHintYap(kelime) {
  // İlk harf göster, geri kalanı nokta
  return kelime[0] + ' ' + Array(kelime.length - 1).fill('_').join(' ');
}

function koyunGoster() {
  const kelime = koyunSiralamis[koyunIndex];
  const emoji  = KELIME_EMOJI[kelime] || '❓';
  koyunEmoji.textContent   = emoji;
  koyunHint.textContent    = koyunHintYap(kelime);
  koyunHint.className      = 'koyun-hint';
  koyunResult.textContent  = '';
  koyunResult.className    = 'koyun-result';
  koyunScoreEl.textContent = koyunSkor;
  koyunCard.className      = 'koyun-card';
  // v2: harf sistemini başlat
  koyunV2HarfGoster(kelime);
}

// ─── Ses tanıma ───────────────────────────────────────────────
function koyunRecBuild() {
  if (!SpeechRecognition) return;
  if (koyunRec) {
    koyunRec.onresult = null;
    koyunRec.onerror  = null;
    koyunRec.onend    = null;
    try { koyunRec.abort(); } catch(e) {}
  }
  koyunRec = new SpeechRecognition();
  koyunRec.lang           = 'tr-TR';
  koyunRec.continuous     = true;
  koyunRec.interimResults = true;
  koyunRec.maxAlternatives = 3;

  let koyunSilenceTimer = null;
  function koyunSessizlikSifirla() {
    if (koyunSilenceTimer) clearTimeout(koyunSilenceTimer);
    koyunSilenceTimer = setTimeout(() => {
      koyunSilenceTimer = null;
      koyunRecDurdur();
      koyunMicStatus.textContent = 'Başlamak için düğmeye bas';
    }, 25000);
  }

  koyunRec.onstart = () => {
    koyunRecState = 'listening';
    koyunMicIndicator.className = 'mic-indicator active';
    koyunMicStatus.className    = 'mic-status listening';
    koyunMicStatus.textContent  = '🎤 Dinliyorum...';
    koyunSessizlikSifirla();
  };

  koyunRec.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    koyunInterimText.textContent = transcript;
    koyunSessizlikSifirla();

    if (event.results[event.results.length - 1].isFinal) {
      koyunInterimText.textContent = '';
      _koyunSesliKontrol(transcript);
    }
  };

  koyunRec.onerror = (e) => {
    if (e.error === 'not-allowed') {
      koyunErrorMsg.textContent = 'Mikrofon izni reddedildi.';
      koyunErrorMsg.classList.add('visible');
    }
    koyunRecState = 'idle';
  };

  koyunRec.onend = () => {
    koyunRecState = 'idle';
    koyunMicIndicator.className = 'mic-indicator';
    koyunMicStatus.className    = 'mic-status';
    koyunMicStatus.textContent  = 'Tekrar dinlemek için Başla\'ya bas';
    // Aktifse otomatik yeniden başlat
    if (koyunAktif) {
      setTimeout(() => koyunRecBaslat(), 400);
    }
  };
}

function koyunRecBaslat() {
  if (!SpeechRecognition || !koyunAktif) return;
  if (koyunRecState === 'listening') return;
  koyunRecBuild();
  try {
    koyunRec.start();
    koyunRecState = 'listening';
  } catch(e) {}
}

function koyunRecDurdur() {
  koyunAktif = false;
  koyunRecState = 'idle';
  if (koyunRec) { try { koyunRec.abort(); } catch(e) {} }
  koyunMicIndicator.className = 'mic-indicator';
  koyunMicStatus.className    = 'mic-status';
  koyunMicStatus.textContent  = 'Başlamak için düğmeye bas';
  koyunInterimText.textContent = '';
}

// ─── Cevap kontrolü ───────────────────────────────────────────
function koyunCevapKontrol(soylenen) {
  const hedef    = koyunSiralamis[koyunIndex];
  const tokenler = normalizeText(soylenen);
  const dogru    = tokenler.some(t => kelimeEslesir(t, hedef));

  if (dogru) {
    // ✅ Doğru
    koyunSkor += 15;
    koyunScoreEl.textContent  = koyunSkor;
    koyunHint.textContent     = hedef;
    koyunHint.className       = 'koyun-hint revealed';
    koyunResult.textContent   = '✅ Harika! +15 puan';
    koyunResult.className     = 'koyun-result dogru';
    koyunCard.className       = 'koyun-card correct-flash';

    // totalScore'a da ekle
    totalScore += 15;

    setTimeout(() => {
      koyunSonraki();
    }, 1400);

  } else {
    // ❌ Yanlış
    koyunYanlis++;
    koyunResult.textContent = '❌ Tekrar dene!';
    koyunResult.className   = 'koyun-result yanlis';
    koyunCard.className     = 'koyun-card wrong-flash';
    setTimeout(() => {
      koyunCard.className = 'koyun-card';
    }, 400);
  }
}

function koyunSonraki() {
  koyunIndex++;
  if (koyunIndex >= koyunSiralamis.length) {
    // Tüm kelimeler bitti — yeniden karıştır
    koyunSiralamis = koyunKarıstir(KOYUN_KELIMELER);
    koyunIndex = 0;
  }
  koyunGoster();
  // Kelime oyunu turu ilerledikçe yıldız eşiği rozetini kontrol et
  kontrolRozetlerYildiz();
}

// ─── Buton işleyicileri ───────────────────────────────────────
// koyunBtnStart: v2'de gizlendi, ghost listener (mevcut referans korundu)
koyunBtnStart.addEventListener('click', () => {
  // v2: mikrofon kaldırıldı — bu buton artık kullanılmıyor
});

koyunBtnSkip.addEventListener('click', () => {
  koyunResult.textContent = '⏭ Geçildi';
  koyunResult.className   = 'koyun-result';
  setTimeout(() => koyunSonraki(), 600);
});

btnKoyunBack.addEventListener('click', () => {
  koyunRecDurdur();
  koyunScreen.style.display = 'none';
  menuScreen.style.display  = 'flex';
  menuGoster();
});

// ─── Menüden Kelime Oyunu'na geçiş ───────────────────────────
function kelimeOyunuGoster() {
  menuScreen.style.display    = 'none';
  gameContainer.style.display = 'none';
  koyunScreen.style.display   = 'flex';

  // Sıfırla ve başlat
  koyunSiralamis = koyunKarıstir(KOYUN_KELIMELER);
  koyunIndex  = 0;
  koyunSkor   = 0;
  koyunYanlis = 0;
  koyunAktif  = false;
  koyunGoster();
}


// ═══════════════════════════════════════════════════════════════
// WEB AUDIO SES EFEKTLERİ
// ═══════════════════════════════════════════════════════════════

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _audioCtx = null;

function _getAudioCtx() {
  if (!AudioCtx) return null;
  if (!_audioCtx || _audioCtx.state === 'closed') {
    try { _audioCtx = new AudioCtx(); } catch(e) { return null; }
  }
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume().catch(() => {});
  }
  return _audioCtx;
}

function sesCal(tip) {
  const ctx = _getAudioCtx();
  if (!ctx) return;
  try {

    if (tip === 'dogru') {
      // Neşeli iki nota: do → mi
      [[523, 0, 0.12], [659, 0.13, 0.22], [784, 0.26, 0.38]].forEach(([frekans, baslangic, bitis]) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frekans, ctx.currentTime + baslangic);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + baslangic);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + bitis);
        osc.start(ctx.currentTime + baslangic);
        osc.stop(ctx.currentTime + bitis);
      });

    } else if (tip === 'yanlis') {
      // Alçalan iki nota: la → fa
      [[330, 0, 0.15], [247, 0.16, 0.35]].forEach(([frekans, baslangic, bitis]) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frekans, ctx.currentTime + baslangic);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + baslangic);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + bitis);
        osc.start(ctx.currentTime + baslangic);
        osc.stop(ctx.currentTime + bitis);
      });
    }

  } catch(e) {}
}

// ─── Ses entegreli cevap kontrolü ────────────────────────────
function _koyunSesliKontrol(soylenen) {
  const hedef  = koyunSiralamis[koyunIndex];
  const tokenler = normalizeText(soylenen);
  const dogru  = tokenler.some(t => kelimeEslesir(t, hedef));

  if (dogru) {
    // Mikrofonu durdur → ses çal → sonraki kelimeye geç
    koyunAktif = false;
    if (koyunRec) { try { koyunRec.abort(); } catch(e) {} }
    koyunRecState = 'idle';

    // Kelime oyununda her doğru tahmin 2 ⭐
    koyunSkor += 2;
    totalScore += 2;
    koyunScoreEl.textContent = koyunSkor;
    koyunHint.textContent    = hedef;
    koyunHint.className      = 'koyun-hint revealed';
    koyunResult.textContent  = '✅ Harika! +15 puan';
    koyunResult.className    = 'koyun-result dogru';
    koyunCard.className      = 'koyun-card correct-flash';

    setTimeout(() => sesCal('dogru'), 50);

    setTimeout(() => {
      koyunAktif = true;
      koyunSonraki();
      setTimeout(() => koyunRecBaslat(), 300);
    }, 1000);

  } else {
    // Mikrofonu kısa dur → ses çal → tekrar dinle
    koyunAktif = false;
    if (koyunRec) { try { koyunRec.abort(); } catch(e) {} }
    koyunRecState = 'idle';

    koyunYanlis++;
    koyunResult.textContent = '❌ Tekrar dene!';
    koyunResult.className   = 'koyun-result yanlis';
    koyunCard.className     = 'koyun-card wrong-flash';

    setTimeout(() => sesCal('yanlis'), 50);

    setTimeout(() => {
      koyunCard.className = 'koyun-card';
      koyunAktif = true;
      koyunRecBaslat();
    }, 700);
  }
};

// koyunRecBuild içinde _koyunSesliKontrol direkt çağrılıyor — override gerekmez

// ═══════════════════════════════════════════════════════════════

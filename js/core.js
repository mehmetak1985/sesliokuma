// ─── localStorage yardımcıları ────────────────────────────────────────────────
const LS_KEY = 'sesliOkumaOyunu_v1';
function kaydet() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      grupIndex,
      cumleIndex,
      hikayeModu,
      hikayeIndex,
      hikayeCumle,
      totalScore,
      koyunSkor,
      achievements,
      tamamlananHikayeler
    }));
  } catch(e) {}
}
function yukle() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!d) return;
    grupIndex   = d.grupIndex   || 0;
    cumleIndex  = d.cumleIndex  || 0;
    hikayeModu  = d.hikayeModu  || false;
    hikayeIndex = d.hikayeIndex || 0;
    hikayeCumle = d.hikayeCumle || 0;
    totalScore  = d.totalScore  || 0;
    koyunSkor   = d.koyunSkor   || 0;
    if (d.achievements) {
      achievements = Object.assign({}, achievements, d.achievements);
    }
    if (Array.isArray(d.tamamlananHikayeler) && d.tamamlananHikayeler.length === HIKAYE_GRUPLARI.length) {
      tamamlananHikayeler = d.tamamlananHikayeler.slice();
    }
  } catch(e) {}
}

// Gruplar sırayla ilerler; her grup bitince sonraki başlar
let grupIndex  = 0;
let cumleIndex = 0;

// ─── Hikaye Modu Durumu ───────────────────────────────────────────────────────
let hikayeModu    = false;
let hikayeIndex   = 0;
let hikayeCumle   = 0;

// ─── Bölüm istatistikleri (rapor için) ───────────────────────────────────────
let bolumDogru    = 0;
let bolumYanlis   = 0;
let kelimeHatalar = {};  // { kelime: hataAdedi }

// CUMLELER kaldırıldı — HEDEF_METIN() fonksiyonu kullanılıyor
const HEDEF_METIN = () => {
  if (hikayeModu) {
    const hikaye = HIKAYE_GRUPLARI[hikayeIndex];
    return hikaye[hikayeCumle % hikaye.length];
  }
  const grup = CUMLE_GRUPLARI[grupIndex];
  return grup[cumleIndex % grup.length];
};

// ─── Oyun durumu ──────────────────────────────────────────────────────────────
let targetWords        = [];
let wordSpans          = [];
let currentWordIndex   = 0;
let score              = 0;
// totalScore: oyun boyunca toplanan toplam ⭐ (tüm modlardan)
let totalScore         = 0;
let yanlisSayac        = 0;   // yanlış telaffuz sayacı (TTS tetikleme için)
let yanlisSayacIndex   = -1;  // hangi kelime için sayılıyor (çapraz kelime birikimini önler)
let endGameTimer       = null; // race condition koruması
let navTimer           = null; // hikaye no gösterme timer'ı

// ─── Başarılar / Rozetler ─────────────────────────────────────────────────────
// achievements: her rozet için tek seferlik true/false
// tamamlananHikayeler: her hikaye en az bir kez bitmiş mi
let achievements = {
  minikOkur:        false, // İlk hikayeyi bitir
  hicPesEtmeyen:    false, // Çok zorlanıp yine de tamamla
  cesurOkuyucu:     false, // Zor hikayeden en az birini bitir
  parlayanYildiz:   false, // 100+ ⭐
  okumaSampiyonu:   false  // Tüm hikayeleri bitir
};
let tamamlananHikayeler = new Array(HIKAYE_GRUPLARI.length).fill(false);

// ══════════════════════════════════════════════════════════════════════════════
// SpeechController
// Tek sorumluluk: TTS ve Recognition lifecycle'ını çakışmasız yönetmek.
//
// KURAL: TTS aktifken Recognition kapalı.
//        Recognition aktifken TTS başlatılamaz.
//        TTS yalnızca yanlış telaffuzda dışarıdan tetiklenir.
// ══════════════════════════════════════════════════════════════════════════════
const SpeechController = (function () {

  // ── İç durum ────────────────────────────────────────────────────────────
  let recognition   = null;
  let recState      = 'idle';   // 'idle' | 'starting' | 'listening' | 'stopping'
  let isSpeaking    = false;
  let lastError     = null;
  let silenceTimer  = null;
  let restartTimer  = null;
  let watchdogTimer = null;   // recognition sessizce düştüyse yakalar
  let trVoiceCache  = null;

  // ── Türkçe ses seç ────────────────────────────────────────────────────
  function getTrVoice() {
    if (trVoiceCache) return trVoiceCache;
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    trVoiceCache = voices.find(v => v.lang === 'tr-TR' && v.localService)
                || voices.find(v => v.lang === 'tr-TR')
                || null;
    return trVoiceCache;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { trVoiceCache = null; getTrVoice(); };
  }

  // ── Timer yardımcıları ────────────────────────────────────────────────
  function clearTimers() {
    if (silenceTimer)  { clearTimeout(silenceTimer);  silenceTimer  = null; }
    if (restartTimer)  { clearTimeout(restartTimer);  restartTimer  = null; }
    if (watchdogTimer) { clearTimeout(watchdogTimer); watchdogTimer = null; }
  }

  // Watchdog: recognition sessizce düştüyse 3sn içinde yakalar ve restart yapar
  function resetWatchdog() {
    if (watchdogTimer) clearTimeout(watchdogTimer);
    watchdogTimer = setTimeout(() => {
      watchdogTimer = null;
      if (isSpeaking) return;
      if (currentWordIndex >= targetWords.length) return;
      if (recState !== 'listening') {
        // Recognition ayakta değil, yeniden başlat
        scheduleRestart(100);
      } else {
        // Ayakta görünüyor ama emin olmak için watchdog'u yenile
        resetWatchdog();
      }
    }, 3000);
  }

  function scheduleRestart(ms) {
    if (restartTimer) clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      restartTimer = null;
      if (!isSpeaking && recState === 'idle') _start();
    }, ms || 300);
  }

  function resetSilenceTimer() {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (recState !== 'listening') return;
    silenceTimer = setTimeout(() => {
      if (recState === 'listening' && !isSpeaking && currentWordIndex < targetWords.length) {
        stopAll(); // 25sn sessizlik → tamamen kapat
        btnStart.disabled = false;
        btnStop.disabled  = true;
        micStatus.textContent = 'Başlamak için düğmeye bas';
      }
    }, 25000);
  }

  // ── Recognition iç inşa ───────────────────────────────────────────────
  function _build() {
    if (!SpeechRecognition) return;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror  = null;
      recognition.onend    = null;
      try { recognition.abort(); } catch (e) {}
      recognition = null;
    }
    recognition = new SpeechRecognition();
    recognition.lang            = 'tr-TR';
    recognition.continuous      = true;
    recognition.interimResults  = true;
    recognition.maxAlternatives = 5;
    recognition.onstart  = _onStart;
    recognition.onresult = _onResult;
    recognition.onerror  = _onError;
    recognition.onend    = _onEnd;
  }

  // ── Recognition event handler'ları ───────────────────────────────────
  function _onStart() {
    // Recognition gerçekten başladı — state'i güvenle otur
    recState = 'listening';
    resetWatchdog();
    micIndicator.className = 'mic-indicator active';
    micStatus.className    = 'mic-status listening';
    micStatus.textContent  = '🎤 Dinliyorum...';
  }
  function _onResult(event) {
    if (!event || !event.results) return;
    if (isSpeaking) return;   // TTS aktifken echo koruması

    resetWatchdog();   // ses geldi → recognition ayakta, watchdog'u yenile
    interimText.textContent = event.results[event.results.length - 1][0].transcript;
    resetSilenceTimer();

    // ── Interim: sadece tam eşleşme kabul et ─────────────────────────────
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) continue;           // final'ler aşağıda işlenir
      if (currentWordIndex >= targetWords.length) break;
      const hedef   = targetWords[currentWordIndex];
      const tokenler = normalizeText(event.results[i][0].transcript);
      for (let t = 0; t < tokenler.length; t++) {
        if (currentWordIndex >= targetWords.length) break;
        if (kelimeEslesir(tokenler[t], targetWords[currentWordIndex])) {
          validateWord(tokenler[t]);
        }
      }
    }

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (!event.results[i].isFinal) continue;
      const sonuc = event.results[i];

      // Alternatifleri confidence'a göre azalan sıraya diz
      const altDizisi = [];
      for (let a = 0; a < sonuc.length; a++) {
        altDizisi.push({ transcript: sonuc[a].transcript, confidence: sonuc[a].confidence || 0 });
      }
      altDizisi.sort((x, y) => y.confidence - x.confidence);

      // Her alternatifin tokenlerini hazırla (confidence sırasında)
      const altTokenler = altDizisi.map(alt => normalizeText(alt.transcript));

      // Ana transcript token sayısını baz al (en yüksek confidence)
      const anaTokenler = altTokenler[0] || [];
      for (let t = 0; t < anaTokenler.length; t++) {
        if (currentWordIndex >= targetWords.length) break;
        const hedef = targetWords[currentWordIndex];
        // Bu pozisyon için tüm alternatiflerde eşleşen var mı?
        let bulunan = null;
        for (let a = 0; a < altTokenler.length; a++) {
          const tok = altTokenler[a][t];
          if (tok && kelimeEslesir(tok, hedef)) { bulunan = tok; break; }
        }
        // Pozisyon eşleşmedi — tüm alternatiflerde herhangi bir pozisyonda ara
        if (!bulunan) {
          for (let a = 0; a < altTokenler.length; a++) {
            for (let p = 0; p < altTokenler[a].length; p++) {
              const tok = altTokenler[a][p];
              if (tok && kelimeEslesir(tok, hedef)) { bulunan = tok; break; }
            }
            if (bulunan) break;
          }
        }
        // Eşleşme yoksa ana token'ı kullan (yanlış olarak işlenir)
        validateWord(bulunan || anaTokenler[t]);
      }
    }
  }

  function _onError(event) {
    lastError = event.error;
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      gosterHata('Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin ver.');
      recState = 'idle';
      btnStart.disabled = false;
      btnStop.disabled  = true;
    } else if (event.error === 'network') {
      gosterHata('Ağ hatası. İnternet bağlantını kontrol et.');
    }
    // 'no-speech', 'aborted' → _onEnd yönetir
  }

  function _onEnd() {
    recState = 'idle';
    if (lastError === 'not-allowed' || lastError === 'service-not-allowed') return;
    if (currentWordIndex >= targetWords.length) return;
    // TTS aktifse restart yapma — speakCorrection.ut.onend içinde yapacak
    if (isSpeaking) return;
    scheduleRestart(300);
  }

  // ── İç start/stop ────────────────────────────────────────────────────
  function _start() {
    if (!SpeechRecognition) return;
    if (recState === 'starting' || recState === 'listening') return;
    if (isSpeaking) return;
    if (lastError === 'not-allowed' || lastError === 'service-not-allowed') return;

    errorMsg.classList.remove('visible');
    lastError = null;
    _build();
    recState = 'starting';

    try {
      recognition.start();
      recState = 'starting';
      // micIndicator ve micStatus → _onStart'ta güncellenir
      interimText.textContent = '';
    } catch (e) {
      recState = 'idle';
      if (e.name === 'InvalidStateError') {
        scheduleRestart(500);
      } else {
        gosterHata('Mikrofon başlatılamadı: ' + e.message);
      }
    }
  }

  function _stop() {
    clearTimers();
    if (recState === 'idle') return;
    recState = 'stopping';
    if (recognition) { try { recognition.stop(); } catch (e) {} }
    micIndicator.className = 'mic-indicator';
    micStatus.className    = 'mic-status';
    micStatus.textContent  = 'Başlamak için düğmeye bas';
    interimText.textContent = '';
  }

  // ── Public API ────────────────────────────────────────────────────────
  return {

    /**
     * Başlat — oyun başlangıcı veya Tekrar butonunda çağrılır.
     */
    startListening() {
      lastError = null;
      resetWatchdog();
      scheduleRestart(100);
    },

    /**
     * TTS ile yanlış kelimeyi söyle.
     * Çağrılmadan önce Recognition otomatik durdurulur.
     * TTS bitince Recognition otomatik yeniden başlar.
     * SADECE yanlış telaffuzda dışarıdan çağrılmalı.
     */
    speakCorrection(metin, opts) {
      if (!window.speechSynthesis) return;
      opts = opts || {};
      const rate  = opts.rate  || 0.80;
      const pitch = opts.pitch || 1.05;

      // TTS başlamadan önce isSpeaking = true — _onEnd'in restart yapmasını engeller
      isSpeaking = true;
      window.speechSynthesis.cancel();
      clearTimers();

      // Recognition'ı sessizce iptal et (abort → _onEnd tetiklenir ama isSpeaking=true olduğu için restart yapmaz)
      if (recognition && recState !== 'idle') {
        recState = 'stopping';
        try { recognition.abort(); } catch (e) {}
      }

      micIndicator.className = 'mic-indicator speaking';
      micStatus.className    = 'mic-status speaking';
      micStatus.textContent  = '🔊 Dinle...';
      interimText.textContent = '';

      const ut    = new SpeechSynthesisUtterance(metin);
      ut.lang     = 'tr-TR';
      ut.rate     = rate;
      ut.pitch    = pitch;
      ut.volume   = 1;
      const voice = getTrVoice();
      if (voice) ut.voice = voice;

      ut.onend = () => {
        isSpeaking = false;
        micIndicator.className = 'mic-indicator';
        micStatus.className    = 'mic-status';
        micStatus.textContent  = '';
        if (currentWordIndex < targetWords.length) {
          resetWatchdog();
          scheduleRestart(250);
        }
      };

      ut.onerror = () => {
        isSpeaking = false;
        micIndicator.className = 'mic-indicator';
        micStatus.className    = 'mic-status';
        if (currentWordIndex < targetWords.length) {
          resetWatchdog();
          scheduleRestart(300);
        }
      };

      // Kısa gecikme: abort'un onEnd'i tetiklemesi için zaman tanı
      setTimeout(() => { window.speechSynthesis.speak(ut); }, 150);
    },

    /**
     * Her şeyi durdur — sıfırlama veya oyun sonu.
     */
    stopAll() {
      isSpeaking = false;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      clearTimers();
      if (recState !== 'idle') {
        recState = 'stopping';
        if (recognition) { try { recognition.stop(); } catch (e) {} }
      }
      micIndicator.className = 'mic-indicator';
      micStatus.className    = 'mic-status';
      micStatus.textContent  = 'Başlamak için düğmeye bas';
      interimText.textContent = '';
    },

    isSpeaking() { return isSpeaking; },
    isListening() { return recState === 'listening'; }
  };
})();

// ─── Türkçe normalizasyon ─────────────────────────────────────────────────────
function normalizeText(metin) {
  if (!metin || typeof metin !== 'string') return [];
  let sonuc = metin.replace(/I/g, 'ı').replace(/İ/g, 'i').toLocaleLowerCase('tr-TR');
  sonuc = sonuc.replace(/[^\p{L}\s]/gu, '');
  return sonuc.split(/\s+/).filter(t => t.length > 0);
}

// ─── Levenshtein mesafesi ─────────────────────────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = [];
  for (let i = 0; i <= m; i++) dp[i] = [i];
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

// ─── Toleranslı eşleşme (katmanlı, mod farkındalıklı) ────────────────────────
function kelimeEslesir(konusulan, hedef) {
  if (konusulan === hedef) return true;
  const dist     = levenshtein(konusulan, hedef);
  const maxLen   = Math.max(hedef.length, konusulan.length);
  const dogruluk = (1 - dist / maxLen) * 100;

  if (hikayeModu) {
    // ── Hikaye modu: daha sıkı ────────────────────────────────────────
    let esik;
    if (hedef.length <= 5)      esik = 75;
    else if (hedef.length <= 8) esik = 80;
    else                        esik = 85;
    return dogruluk >= esik;
  }

  // ── Normal mod: R/L gelişmekte olan dil için toleranslı ───────────
  let tolerans;
  if (hedef.length <= 3)      tolerans = 1;
  else if (hedef.length <= 5) tolerans = 2;
  else if (hedef.length <= 8) tolerans = 3;
  else                        tolerans = 4;

  let minDogruluk;
  if (hedef.length <= 4)      minDogruluk = 55;
  else if (hedef.length <= 6) minDogruluk = 62;
  else                        minDogruluk = 68;

  if (dogruluk < minDogruluk) return false;
  return dist <= Math.min(tolerans, Math.floor(maxLen * 0.45));
}

// ─── Tüm alternatifleri kontrol et ───────────────────────────────────────────
function checkAlternatives(result) {
  for (let a = 0; a < result.length; a++) {
    const tokenler = normalizeText(result[a].transcript);
    if (tokenler.length === 0) continue;
    if (kelimeEslesir(tokenler[0], targetWords[currentWordIndex])) return tokenler[0];
  }
  return normalizeText(result[0].transcript)[0] || '';
}

// ─── UI güncelle ──────────────────────────────────────────────────────────────
function updateUI() {
  wordSpans.forEach((span, i) => {
    if (i === currentWordIndex && !span.classList.contains('correct') && !span.classList.contains('wrong')) {
      span.className = 'word active';
    }
  });

  const eskiPuan = parseInt(scoreDisplay.textContent, 10);
  scoreDisplay.textContent = totalScore;
  if (totalScore !== eskiPuan) {
    scoreDisplay.classList.remove('bump');
    void scoreDisplay.offsetWidth;
    scoreDisplay.classList.add('bump');
  }
}

// ─── Oyunu kur ────────────────────────────────────────────────────────────────
function oyunuKur() {
  const metin = HEDEF_METIN();
  targetWords = normalizeText(metin);
  const fragment = document.createDocumentFragment();
  wordSpans = [];

  const orijinalKelimeler = metin.split(/\s+/);
  targetWords.forEach((kelime, i) => {
    const span = document.createElement('span');
    span.className   = 'word' + (i === 0 ? ' active' : '');
    span.textContent = orijinalKelimeler[i] || kelime;
    span.dataset.index = i;
    fragment.appendChild(span);
    wordSpans.push(span);
  });

  wordCard.innerHTML = '';
  wordCard.appendChild(fragment);
  // Kelime sayısına göre font boyutunu ayarla
  const adet = targetWords.length;
  wordCard.dataset.wordcount = adet <= 3 ? 'small' : adet <= 5 ? 'medium' : 'large';
}

// ─── Kelime doğrulama ─────────────────────────────────────────────────────────
function validateWord(konusulanKelime) {
  if (currentWordIndex >= targetWords.length) return;

  const tokenler = normalizeText(konusulanKelime);
  if (tokenler.length === 0) return;

  const token = tokenler[0];
  const hedef = targetWords[currentWordIndex];
  const span  = wordSpans[currentWordIndex];

  if (kelimeEslesir(token, hedef)) {
    // ✅ Doğru — TTS YOK
    span.className = 'word correct';
    // Her doğru kelime 1 ⭐
    score      += 1;
    totalScore += 1;
    bolumDogru++;
    yanlisSayac = 0;   // doğru olunca yanlış sayacını sıfırla
    yanlisSayacIndex = -1;
    currentWordIndex++;
    requestAnimationFrame(updateUI);

    if (currentWordIndex === targetWords.length) {
      // Cümle / hikaye bittiğinde yıldız ve zorlanma rozetlerini kontrol et
      kontrolRozetlerYildiz();
      kontrolRozetlerZorluk();
      endGame();
    }

  } else {
    // ❌ Yanlış
    // yanlisSayac: kelimeye bağlı — farklı kelimelerde birikmez
    if (yanlisSayacIndex !== currentWordIndex) {
      yanlisSayac      = 0;
      yanlisSayacIndex = currentWordIndex;
    }
    yanlisSayac++;

    // bolumYanlis: kelime başına bir kez say (ilk yanlışta)
    if (yanlisSayac === 1) {
      bolumYanlis++;
      kelimeHatalar[hedef] = (kelimeHatalar[hedef] || 0) + 1;
    }

    if (yanlisSayac === 1) {
      // İlk yanlış: hafif sarı ipucu efekti
      span.style.transform   = 'scale(1.06)';
      span.style.background  = 'rgba(255,209,102,0.18)';
      span.style.borderColor = 'var(--yellow)';
      span.style.color       = 'var(--yellow)';
      setTimeout(() => {
        if (currentWordIndex < targetWords.length && wordSpans[currentWordIndex] === span) {
          span.style.transform   = '';
          span.style.background  = '';
          span.style.borderColor = '';
          span.style.color       = '';
          span.className = 'word active';
        }
      }, 250);
    } else {
      // 2. ve sonraki yanlış: shake animasyonu
      span.className = 'word wrong';
      setTimeout(() => {
        if (currentWordIndex < targetWords.length && wordSpans[currentWordIndex] === span) {
          span.className = 'word active';
        }
      }, 250);
    }

    // 2. yanlışta telaffuzu seslendir
    if (yanlisSayac >= 2) {
      yanlisSayac = 0;
      SpeechController.speakCorrection(hedef, { rate: 0.72, pitch: 1.05 });
    }
  }
}

// ─── Rapor göster ────────────────────────────────────────────────────────────
function gosterRapor(opts) {
  // opts: { emoji, title, subtitle, autoMs (0=manuel), onDevam, onTekrar }
  reportEmoji.textContent    = opts.emoji   || '🌟';
  reportTitle.textContent    = opts.title   || 'Tamamlandı!';
  reportSubtitle.textContent = opts.subtitle || '';
  reportDogru.textContent    = bolumDogru;
  reportYanlis.textContent   = bolumYanlis;
  reportPuan.textContent     = totalScore;

  // En çok hata yapılan kelimeler (max 3)
  const hatalar = Object.entries(kelimeHatalar)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
  if (hatalar.length > 0) {
    reportHardList.innerHTML = hatalar.map(k => `<strong>${k}</strong>`).join('  ·  ');
    reportHardWords.style.display = 'block';
  } else {
    reportHardWords.style.display = 'none';
  }

  // Butonları ayarla
  reportBtnRow.innerHTML = '';
  if (opts.onTekrar) {
    const btn = document.createElement('button');
    btn.className = 'report-btn secondary';
    btn.textContent = '🔄 Tekrar Oku';
    btn.onclick = () => { kapatRapor(); opts.onTekrar(); };
    reportBtnRow.appendChild(btn);
  }
  const btnNext = document.createElement('button');
  btnNext.className = 'report-btn primary';
  btnNext.textContent = opts.nextLabel || '▶ Devam';
  btnNext.onclick = () => { kapatRapor(); opts.onDevam(); };
  reportBtnRow.appendChild(btnNext);

  // Otomatik geçiş timer bar
  if (opts.autoMs && opts.autoMs > 0) {
    reportTimerWrap.style.display = 'block';
    reportTimerBar.style.transition = 'none';
    reportTimerBar.style.width = '100%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reportTimerBar.style.transition = `width ${opts.autoMs}ms linear`;
        reportTimerBar.style.width = '0%';
      });
    });
    const t = setTimeout(() => { kapatRapor(); opts.onDevam(); }, opts.autoMs);
    reportBtnRow.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => clearTimeout(t), { once: true });
    });
  } else {
    reportTimerWrap.style.display = 'none';
  }

  reportOverlay.classList.add('visible');
}

function kapatRapor() {
  reportOverlay.classList.remove('visible');
}

// ─── Bölüm istatistiklerini sıfırla ──────────────────────────────────────────
function sifirlaIstatistik() {
  bolumDogru    = 0;
  bolumYanlis   = 0;
  kelimeHatalar = {};
}

// ─── Sonraki cümleye geç (ortak) ─────────────────────────────────────────────
function sonrakiCumleyeGec() {
  if (hikayeModu) {
    hikayeCumle++;
    const hikaye = HIKAYE_GRUPLARI[hikayeIndex];
    if (hikayeCumle >= hikaye.length) {
      hikayeCumle = 0;
      if (hikayeIndex < HIKAYE_GRUPLARI.length - 1) hikayeIndex++;
      else hikayeIndex = 0;
    }
    updateStoryProgress();
  } else {
    cumleIndex++;
    if (cumleIndex >= CUMLE_GRUPLARI[grupIndex].length) {
      cumleIndex = 0;
      if (grupIndex < CUMLE_GRUPLARI.length - 1) {
        grupIndex++;
        micStatus.textContent = '🌟 Yeni harf grubu başlıyor!';
        syncLevelButtons();
      }
    }
  }
  kaydet();
}

// ─── Oyun sonu ────────────────────────────────────────────────────────────────
function endGame() {
  SpeechController.stopAll();

  wordSpans.forEach((span, i) => {
    if (i >= currentWordIndex && !span.classList.contains('correct')) {
      span.className = 'word wrong';
    }
  });

  congratsBanner.classList.add('visible');
  wordCard.classList.add('celebrate');
  setTimeout(() => { wordCard.classList.remove('celebrate'); }, 600);
  btnStop.disabled  = true;
  btnStart.disabled = false;
  micStatus.textContent = '🎉 Harika iş çıkardın!';

  if (endGameTimer) clearTimeout(endGameTimer);

  if (hikayeModu) {
    // ── Hikaye modunda: cümle bitti, bir sonraki cümleye geç (2sn otomatik)
    // Hikayenin son cümlesi miydi? Kontrol et
    const hikaye      = HIKAYE_GRUPLARI[hikayeIndex];
    const sonCumle    = (hikayeCumle === hikaye.length - 1);

    if (sonCumle) {
      // Hikaye tamamen bitti → tam rapor, manuel geçiş
      // Hikaye tamamlama durumunu ve rozetleri güncelle
      tamamlananHikayeler[hikayeIndex] = true;
      kontrolRozetlerHikayeSonu();
      endGameTimer = setTimeout(() => {
        endGameTimer = null;
        congratsBanner.classList.remove('visible');
        errorMsg.classList.remove('visible');
        btnStop.disabled  = false;
        btnStart.disabled = false;

        const dogruYuzde = bolumDogru + bolumYanlis > 0
          ? Math.round((bolumDogru / (bolumDogru + bolumYanlis)) * 100) : 100;
        const emoji = dogruYuzde >= 90 ? '🏆' : dogruYuzde >= 70 ? '⭐' : '💪';

        gosterRapor({
          emoji,
          title: '📖 Hikaye Bitti!',
          subtitle: HIKAYE_ISIMLERI[hikayeIndex] + ' · %' + dogruYuzde + ' doğru',
          autoMs: 0,
          nextLabel: '▶ Sonraki Hikaye',
          onTekrar: () => {
            // Aynı hikayeyi başa sar
            hikayeCumle = 0;
            sifirlaIstatistik();
            resetCumle();
          },
          onDevam: () => {
            sonrakiCumleyeGec();
            sifirlaIstatistik();
            resetCumle();
          }
        });
      }, 1200);

    } else {
      // Hikaye devam ediyor → 2sn sonra otomatik geç
      endGameTimer = setTimeout(() => {
        endGameTimer = null;
        congratsBanner.classList.remove('visible');
        errorMsg.classList.remove('visible');
        btnStop.disabled  = false;
        btnStart.disabled = false;
        sonrakiCumleyeGec();
        resetCumle();
      }, 2000);
    }

  } else {
    // ── Normal mod: cümle bitti
    // Bölümün son cümlesi miydi?
    const sonCumle = (cumleIndex === CUMLE_GRUPLARI[grupIndex].length - 1);

    if (sonCumle) {
      // Bölüm bitti → rapor göster, 4sn otomatik geçiş
      endGameTimer = setTimeout(() => {
        endGameTimer = null;
        congratsBanner.classList.remove('visible');
        errorMsg.classList.remove('visible');
        btnStop.disabled  = false;
        btnStart.disabled = false;

        const dogruYuzde = bolumDogru + bolumYanlis > 0
          ? Math.round((bolumDogru / (bolumDogru + bolumYanlis)) * 100) : 100;
        const emoji = dogruYuzde >= 90 ? '🏆' : dogruYuzde >= 70 ? '⭐' : '💪';
        const bolumNo = grupIndex + 1;

        gosterRapor({
          emoji,
          title: bolumNo + '. Bölüm Tamamlandı!',
          subtitle: 'Harika iş çıkardın! %' + dogruYuzde + ' doğru',
          autoMs: 5000,
          nextLabel: '▶ Sonraki Bölüm',
          onDevam: () => {
            sonrakiCumleyeGec();
            sifirlaIstatistik();
            resetCumle();
          }
        });
      }, 1200);

    } else {
      // Normal cümle geçişi — istatistikler bölüm sonuna kadar birikir
      endGameTimer = setTimeout(() => {
        endGameTimer = null;
        congratsBanner.classList.remove('visible');
        errorMsg.classList.remove('visible');
        btnStop.disabled  = false;
        btnStart.disabled = false;
        sonrakiCumleyeGec();
        resetCumle();
      }, 2000);
    }
  }
}

// ─── Cümle sıfırla ve başlat (ortak) ─────────────────────────────────────────
function resetCumle() {
  currentWordIndex   = 0;
  score              = 0;
  yanlisSayac        = 0; yanlisSayacIndex = -1;
  interimText.textContent  = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');
  oyunuKur();
  SpeechController.startListening();
}

// ─── Hata mesajı göster ───────────────────────────────────────────────────────
function gosterHata(mesaj) {
  errorMsg.textContent = mesaj;
  errorMsg.classList.add('visible');
}

// ─── Rozet kontrol yardımcıları ───────────────────────────────────────────────
function kontrolRozetlerYildiz() {
  // ⭐ Parlayan Yıldız — 100+ ⭐
  if (!achievements.parlayanYildiz && totalScore >= 100) {
    achievements.parlayanYildiz = true;
    kaydet();
    gosterRozetKutlama('⭐ Parlayan Yıldız', '100 yıldız topladın! Okuma ışığın parlıyor!');
  }
}

function kontrolRozetlerZorluk() {
  // 💪 Hiç Pes Etmeyen — çok sayıda yanlışla birlikte yine de bitir
  if (!achievements.hicPesEtmeyen && bolumYanlis >= 5 && bolumDogru > 0) {
    achievements.hicPesEtmeyen = true;
    kaydet();
    gosterRozetKutlama('💪 Hiç Pes Etmeyen', 'Zorlandın ama vazgeçmedin. İşte gerçek başarı!');
  }
}

function kontrolRozetlerHikayeSonu() {
  // 🐣 Minik Okur — en az bir hikayeyi ilk kez bitir
  if (!achievements.minikOkur) {
    achievements.minikOkur = true;
    kaydet();
    gosterRozetKutlama('🐣 Minik Okur', 'İlk hikayeni tamamladın. Okuma yolculuğun başladı!');
  }

  // 🦁 Cesur Okuyucu — zor hikayelerden (index 14–20) birini bitir
  if (!achievements.cesurOkuyucu) {
    if (hikayeIndex >= 14 && hikayeIndex <= 20) {
      achievements.cesurOkuyucu = true;
      kaydet();
      gosterRozetKutlama('🦁 Cesur Okuyucu', 'Zor bir hikayeyi bitirdin. Çok cesursun!');
    }
  }

  // 👑 Okuma Şampiyonu — tüm hikayeler en az bir kez bitmiş
  if (!achievements.okumaSampiyonu) {
    const hepsiBitti = tamamlananHikayeler.every(Boolean);
    if (hepsiBitti) {
      achievements.okumaSampiyonu = true;
      kaydet();
      gosterRozetKutlama('👑 Okuma Şampiyonu', 'Tüm hikayeleri bitirdin. Sen bir okuma şampiyonusun!');
    }
  }
}

// Küçük rozet kutlama kartı
function gosterRozetKutlama(baslik, aciklama) {
  const el = document.getElementById('achToast');
  if (!el) return;
  const titleEl = document.getElementById('achToastTitle');
  const descEl  = document.getElementById('achToastDesc');
  if (titleEl) titleEl.textContent = baslik;
  if (descEl)  descEl.textContent  = aciklama;
  el.classList.add('visible');
  setTimeout(() => {
    el.classList.remove('visible');
  }, 3500);
}

// ─── Buton işleyicileri ───────────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
  if (!SpeechRecognition) return;
  if (SpeechController.isListening()) return;

  btnStart.disabled = false;
  btnStop.disabled  = false;

  if (endGameTimer) { clearTimeout(endGameTimer); endGameTimer = null; }
  kapatRapor();
  sifirlaIstatistik();
  currentWordIndex   = 0;
  score              = 0;
  yanlisSayac        = 0; yanlisSayacIndex = -1;
  interimText.textContent  = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');

  SpeechController.stopAll();
  oyunuKur();
  SpeechController.startListening();
});

btnStop.addEventListener('click', () => {
  if (endGameTimer) { clearTimeout(endGameTimer); endGameTimer = null; }
  SpeechController.stopAll();
  kapatRapor();
  // currentWordIndex korunur — kaldığı kelimeden devam
  score = 0;
  yanlisSayac = 0; yanlisSayacIndex = -1;
  interimText.textContent = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');
  // Span durumlarını güncelle — geçmiş doğrular korunsun, aktif kelime vurgulansın
  wordSpans.forEach((span, i) => {
    if (i < currentWordIndex) {
      span.className = 'word correct';
    } else if (i === currentWordIndex) {
      span.className = 'word active';
    } else {
      span.className = 'word';
    }
  });
  btnStart.disabled = false;
  btnStop.disabled  = false;
  SpeechController.startListening();
});

btnSkip.addEventListener('click', () => {
  if (endGameTimer) { clearTimeout(endGameTimer); endGameTimer = null; }
  SpeechController.stopAll();
  kapatRapor();
  sifirlaIstatistik();
  sonrakiCumleyeGec();
  currentWordIndex   = 0;
  score              = 0;
  yanlisSayac        = 0; yanlisSayacIndex = -1;
  interimText.textContent  = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');
  oyunuKur();
  setTimeout(() => { btnStart.click(); }, 250);
});

// ─── Seviye butonları ─────────────────────────────────────────────────────────
function syncLevelButtons() {
  document.querySelectorAll('.lvl-btn').forEach(btn => {
    const aktif = !hikayeModu && parseInt(btn.dataset.level) === grupIndex;
    btn.classList.toggle('active', aktif);
    btn.style.opacity = hikayeModu ? '0.25' : '';
  });
  // Hikaye modunda seviye balonlarını tamamen gizle
  if (levelSelector) {
    levelSelector.style.display = hikayeModu ? 'none' : '';
  }
  // Alt sekmeleri (Alıştırma / Hikaye) her zaman gizle
  if (tabStrip) {
    tabStrip.style.display = 'none';
  }
}

document.querySelectorAll('.lvl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (hikayeModu) return;
    const secilenGrup = parseInt(btn.dataset.level);
    if (secilenGrup === grupIndex) return;
    if (endGameTimer) { clearTimeout(endGameTimer); endGameTimer = null; }
    SpeechController.stopAll();
    kapatRapor();
    sifirlaIstatistik();
    grupIndex          = secilenGrup;
    cumleIndex         = 0;
    currentWordIndex   = 0;
    score              = 0;
    yanlisSayac        = 0; yanlisSayacIndex = -1;
    interimText.textContent  = '';
    congratsBanner.classList.remove('visible');
    errorMsg.classList.remove('visible');
    syncLevelButtons();
    oyunuKur();
    kaydet();
    setTimeout(() => { btnStart.click(); }, 250);
  });
});

// ─── Hikaye navigasyon butonları ─────────────────────────────────────────────
function hikayeSecGit(hedefIndex) {
  if (!hikayeModu) return;
  if (endGameTimer) { clearTimeout(endGameTimer); endGameTimer = null; }
  SpeechController.stopAll();
  kapatRapor();
  sifirlaIstatistik();
  hikayeIndex        = ((hedefIndex % HIKAYE_GRUPLARI.length) + HIKAYE_GRUPLARI.length) % HIKAYE_GRUPLARI.length;
  hikayeCumle        = 0;
  currentWordIndex   = 0;
  score              = 0;
  yanlisSayac        = 0; yanlisSayacIndex = -1;
  interimText.textContent = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');
  updateStoryProgress(true);  // ◀ ▶ butonunda hikaye no göster
  kaydet();
  oyunuKur();
  setTimeout(() => { btnStart.click(); }, 250);
}

btnHikayeGeri.addEventListener('click',  () => hikayeSecGit(hikayeIndex - 1));
btnHikayeIleri.addEventListener('click', () => hikayeSecGit(hikayeIndex + 1));

// ─── Hikaye ilerleme UI ───────────────────────────────────────────────────────
function updateStoryProgress(showNav) {
  if (!hikayeModu) return;
  const hikaye = HIKAYE_GRUPLARI[hikayeIndex];
  const toplam = hikaye.length;
  const yuzde  = Math.round((hikayeCumle / toplam) * 100);
  storyTitle.textContent = '📖 ' + HIKAYE_ISIMLERI[hikayeIndex];
  storyBar.style.width   = yuzde + '%';

  if (showNav) {
    // Hikaye no göster
    storyProgressText.textContent = (hikayeIndex + 1) + ' / ' + HIKAYE_GRUPLARI.length;
    storyProgressText.style.color = '#a78bfa';
    if (navTimer) clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      navTimer = null;
      storyProgressText.textContent = (hikayeCumle + 1) + ' / ' + toplam;
      storyProgressText.style.color = '';
    }, 1500);
  } else {
    // Cümle ilerlemesi göster
    if (navTimer) { clearTimeout(navTimer); navTimer = null; }
    storyProgressText.textContent = (hikayeCumle + 1) + ' / ' + toplam;
    storyProgressText.style.color = '';
  }
}

// ─── Sekme butonları ──────────────────────────────────────────────────────────
function setMod(hikaye) {
  if (hikayeModu === hikaye) return;
  if (endGameTimer) { clearTimeout(endGameTimer); endGameTimer = null; }
  SpeechController.stopAll();
  kapatRapor();
  sifirlaIstatistik();
  hikayeModu = hikaye;
  if (hikayeModu) {
    hikayeIndex = 0;
    hikayeCumle = 0;
    storyProgress.classList.add('visible');
    updateStoryProgress();
  } else {
    storyProgress.classList.remove('visible');
  }
  currentWordIndex   = 0;
  score              = 0;
  yanlisSayac        = 0; yanlisSayacIndex = -1;
  interimText.textContent  = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');
  syncLevelButtons();
  oyunuKur();
  kaydet();
  setTimeout(() => { btnStart.click(); }, 250);
}

tabAlistirma.addEventListener('click', () => setMod(false));
tabHikaye.addEventListener('click',    () => setMod(true));

// ─── Ses seviyesi → mic daire efekti ─────────────────────────────────────────
(function () {
  let audioCtx = null, analyser = null, dataArr = null, rafId = null;

  function startAnalyser(stream) {
    if (audioCtx) return;
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    analyser  = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArr   = new Uint8Array(analyser.frequencyBinCount);
    audioCtx.createMediaStreamSource(stream).connect(analyser);
    tick();
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    analyser.getByteFrequencyData(dataArr);
    const avg   = dataArr.reduce((s, v) => s + v, 0) / dataArr.length;
    const level = Math.min(avg / 60, 1);           // 0–1 arası normalize
    const scale = 1 + level * 0.45;                // max 1.45x büyür
    const glow  = Math.round(level * 32);           // max 32px glow
    micIndicator.style.transform  = `scale(${scale.toFixed(2)})`;
    micIndicator.style.boxShadow  = `0 0 ${glow}px rgba(6,214,160,${(level * 0.8).toFixed(2)})`;
  }

  function stopAnalyser() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    micIndicator.style.transform = '';
    micIndicator.style.boxShadow = '';
    if (audioCtx) { audioCtx.close(); audioCtx = null; analyser = null; }
  }

  // Mikrofon izni alınınca başlat
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => { startAnalyser(stream); })
      .catch(() => {});  // izin reddedilirse sessizce geç
  }
})();

// ─── İlk yükleme ─────────────────────────────────────────────────────────────
yukle();   // localStorage'dan kaldığı yeri yükle
syncLevelButtons();
// storyProgress sadece hikaye modundaysa görünür
storyProgress.classList.toggle('visible', hikayeModu);
if (hikayeModu) updateStoryProgress();
oyunuKur();

// ─── Ana Menü Geçiş Sistemi ───────────────────────────────────────────────────
const menuScreen   = document.getElementById('menuScreen');
const btnBack      = document.getElementById('btnBack');
const menuScoreText  = document.getElementById('menuScoreText');
const menuTotalScore = document.getElementById('menuTotalScore');
const menuLevelText  = document.getElementById('menuLevelText');
const menuLevelBar   = document.getElementById('menuLevelBar');
const hmAchievements  = document.getElementById('hmAchievements');


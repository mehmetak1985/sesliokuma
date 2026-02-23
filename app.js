"use strict";

// ─── Yıldız arka planı ───────────────────────────────────────────────────────
// yaratYildizlar — .stars gizli, devre dışı
// (function yaratYildizlar() { ... })();

// ─── Tarayıcı desteği ────────────────────────────────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// ─── DOM referansları ─────────────────────────────────────────────────────────
const btnStart       = document.getElementById('btnStart');
const btnStop        = document.getElementById('btnStop');
const btnSkip        = document.getElementById('btnSkip');
const wordCard       = document.getElementById('wordCard');
const scoreDisplay   = document.getElementById('scoreDisplay');
const micIndicator   = document.getElementById('micIndicator');
const micStatus      = document.getElementById('micStatus');
const interimText    = document.getElementById('interimText');
const congratsBanner = document.getElementById('congratsBanner');
const errorMsg       = document.getElementById('errorMsg');
const noSupport         = document.getElementById('noSupport');
const tabAlistirma      = document.getElementById('tabAlistirma');
const tabHikaye         = document.getElementById('tabHikaye');
const storyProgress     = document.getElementById('storyProgress');
const storyTitle        = document.getElementById('storyTitle');
const storyBar          = document.getElementById('storyBar');
const storyProgressText = document.getElementById('storyProgressText');
const btnHikayeGeri     = document.getElementById('btnHikayeGeri');
const btnHikayeIleri    = document.getElementById('btnHikayeIleri');
const reportOverlay     = document.getElementById('reportOverlay');
const reportEmoji       = document.getElementById('reportEmoji');
const reportTitle       = document.getElementById('reportTitle');
const reportSubtitle    = document.getElementById('reportSubtitle');
const reportDogru       = document.getElementById('reportDogru');
const reportYanlis      = document.getElementById('reportYanlis');
const reportPuan        = document.getElementById('reportPuan');
const reportHardWords   = document.getElementById('reportHardWords');
const reportHardList    = document.getElementById('reportHardList');
const reportTimerWrap   = document.getElementById('reportTimerWrap');
const reportTimerBar    = document.getElementById('reportTimerBar');
const reportBtnRow      = document.getElementById('reportBtnRow');
const reportBtnNext     = document.getElementById('reportBtnNext');

if (!SpeechRecognition) {
  noSupport.classList.add('visible');
  btnStart.disabled = true;
}

// ─── Cümle listesi (MEB Harf Grupları) ───────────────────────────────────────
const CUMLE_GRUPLARI = [
  // ── Grup 1: E L A K İ N ──────────────────────────────────────────────────
  [
    "Ali kal",
    "Lale al",
    "İnek kal",
    "Ekin al",
    "Kale al",
    "Ali kale",
    "İnek al",
    "Kel kal",
    "Lale kal",
    "Ali ile kal",
    "İnek kale",
    "Ekin ile al",
    "Kale kal",
    "Ali inek",
    "Lale ile kal",
  ],
  // ── Grup 2: + O M U T Ü Y ───────────────────────────────────────────────
  [
    "Mete kal",
    "Ütü al",
    "Yol kal",
    "Okul al",
    "Mutlu ol",
    "Mete yolu al",
    "Tüm yol kal",
    "Yolun otu",
    "Mutlu lale",
    "Okulun yolu",
    "Ütüyü al",
    "Ütü koy",
    "Mete okul",
    "Tüm okul",
    "Yolu taklit et",
  ],
  // ── Grup 3: + Ö R I(ı) D S B ────────────────────────────────────────────
  [
    "Arı bal al",
    "Balık al",
    "Bırak onu",
    "Dere kal",
    "Resim kal",
    "Söyle bana",
    "Dondurma al",
    "Araba sür",
    "Bal kadar",
    "Sıra kal",
    "Bırak al",
    "Dere balık",
    "Arı uyu",
    "Ördek al",
    "Büyük ördek",
  ],
  // ── Grup 4: + Z Ç G Ş C P ───────────────────────────────────────────────
  [
    "Çiçek al",
    "Gül bak",
    "Şeker al",
    "Çanta bul",
    "Pazara git",
    "Gözlük al",
    "Çocuk gel",
    "Şeker çok",
    "Çilek al",
    "Pazarda bul",
    "Gözleri sil",
    "Çanta doldur",
    "Şeker bul",
    "Çiçek bak",
    "Pazarda kal",
  ],
  // ── Grup 5: + H V Ğ F J ─────────────────────────────────────────────────
  [
    "Hava güzel",
    "Filmi gör",
    "Vahşi hayvan",
    "Hafif gel",
    "Varmak için git",
    "Filmi ver",
    "Havaya bak",
    "Ağaç var",
    "Hava çok güzel",
    "Filmi bitir",
    "Fırın al",
    "Havuz var",
    "Fındık al",
    "Hızla gel",
    "Yavaş git",
  ],
];

// ─── Hikaye Verileri ─────────────────────────────────────────────────────────
const HIKAYE_GRUPLARI = [
  [
    "Mina kırmızı oyuncak arabasını aldı.",
    "Arabayı yere koydu ve hafifçe itti.",
    "Araba hızla ilerledi ve masanın ayağına çarptı.",
    "Mina önce şaşırdı, sonra gülmeye başladı.",
    "Arabasını dikkatli sürmesi gerektiğini anladı.",
    "Soru: Mina arabasını sürerken neyi fark etti?"
  ],
  [
    "Baran yapboz parçalarını masaya yaydı.",
    "Önce köşe parçalarını buldu.",
    "Parçaları birleştirirken sabırlı davrandı.",
    "Sonunda güzel bir hayvan resmi ortaya çıktı.",
    "Baran başardığı için gurur duydu.",
    "Soru: Baran yapbozu tamamlarken nasıl davrandı?"
  ],
  [
    "Henna bahçeye çıktığında iki küçük kedi çimenlerde oynuyordu.",
    "Kediler bir kelebeği kovalamaya başladı.",
    "Henna da onların peşinden koştu ama dikkatli yürüdü.",
    "Kediler yorulunca gölgede dinlendiler.",
    "Henna onları severken mutlu hissetti.",
    "Soru: Kediler yorulunca ne yaptılar?"
  ],
  [
    "Mustafa yeni ayakkabılarını giydi.",
    "Çimlerde top oynamaya başladı.",
    "Koşarken ayakkabılarının çok rahat olduğunu fark etti.",
    "Ama çimenler ıslaktı ve biraz kaydı.",
    "Mustafa dikkatli olması gerektiğini öğrendi.",
    "Soru: Mustafa neden dikkatli olması gerektiğini anladı?"
  ],
  [
    "Asya camdan dışarı baktı.",
    "Yağmur yağıyordu.",
    "Şemsiyesini alıp annesiyle dışarı çıktı.",
    "Su birikintilerine basmamaya çalıştı ama birine bastı.",
    "Ayakkabıları ıslandı.",
    "Asya eve dönünce kuru çorap giydi.",
    "Soru: Asya'nın ayakkabıları neden ıslandı?"
  ],
  [
    "Yusuf kitaplığından bir hikaye kitabı seçti.",
    "Kitabı sessizce okumaya başladı.",
    "Anlamadığı bir kelimeyi annesine sordu.",
    "Yeni kelimenin anlamını öğrenince hikayeyi daha iyi anladı.",
    "Soru: Yusuf anlamadığı kelimeyi öğrenince ne oldu?"
  ],
  [
    "Zeynep bahçedeki çiçekleri suladı.",
    "Bazı çiçeklerin yaprakları solmuştu.",
    "Daha fazla su verdikten sonra birkaç gün bekledi.",
    "Çiçekler yeniden canlandı.",
    "Zeynep sabırlı olmanın önemini öğrendi.",
    "Soru: Çiçekler nasıl yeniden canlandı?"
  ],
  [
    "Maysa resim defterini açtı.",
    "Önce güneş çizdi, sonra bir ev yaptı.",
    "Boyarken çizgilerin dışına taştı ama pes etmedi.",
    "Resmini tamamladığında çok güzel görünüyordu.",
    "Soru: Maysa resim yaparken vazgeçti mi?"
  ],
  [
    "Mehmet uçurtmasını gökyüzüne bıraktı.",
    "Rüzgar hafif esiyordu.",
    "Uçurtma bazen düşer gibi oldu ama Mehmet ipi sıkı tuttu.",
    "Bir süre sonra uçurtma daha yükseğe çıktı.",
    "Soru: Uçurtma neden düşmedi?"
  ],
  [
    "Yağmur kütüphaneye gitti.",
    "Sessiz olması gerektiğini biliyordu.",
    "Kitabını dikkatle seçti ve yerine oturdu.",
    "Çevresindekileri rahatsız etmeden okudu.",
    "Soru: Yağmur kütüphanede neden sessiz davrandı?"
  ],
  [
    "Çiçek parkta tek başına oturan bir çocuk gördü.",
    "Yanına gidip selam verdi.",
    "Birlikte salıncağa bindiler.",
    "O gün yeni bir arkadaş edindi.",
    "Soru: Çiçek yeni arkadaşını nasıl kazandı?"
  ],
  [
    "Emir ödev yapmak için masaya oturdu.",
    "Kalemini bulamadı.",
    "Çantasını ve masasını aradı ama kalem yoktu.",
    "Sonra dün parkta ders çalıştığını hatırladı.",
    "Çantasının küçük cebine baktı ve kalemini buldu.",
    "Emir eşyalarını düzenli koyması gerektiğini anladı.",
    "Soru: Emir kalemini nerede buldu?"
  ],
  [
    "Beyaz parkta bisküviyle oturuyordu.",
    "Yanındaki çocuk üzgün görünüyordu çünkü yiyeceği yoktu.",
    "Beyaz bisküvisini ikiye böldü ve yarısını verdi.",
    "Çocuk gülümsedi.",
    "Beyaz paylaşmanın insanı mutlu ettiğini fark etti.",
    "Soru: Beyaz neden mutlu oldu?"
  ],
  [
    "Kaan sabah alarmı duydu ama kapattı.",
    "Biraz daha uyumak istedi.",
    "Uyandığında okula geç kaldığını fark etti.",
    "Aceleyle hazırlandı ama servisi kaçırdı.",
    "Ertesi gün alarm çalınca hemen kalktı.",
    "Soru: Kaan servisi neden kaçırdı?"
  ],
  [
    "Elvan küçük bir saksıya tohum ekti.",
    "Her gün düzenli olarak suladı.",
    "İlk gün hiçbir şey çıkmadı.",
    "Elvan biraz üzüldü ama beklemeye devam etti.",
    "Birkaç gün sonra küçük bir filiz gördü.",
    "Sabırlı olmanın önemli olduğunu öğrendi.",
    "Soru: Bitki neden büyüdü?"
  ],
  [
    "Berk mutfakta su almak istedi.",
    "Bardağı hızlıca aldı ve elinden düşürdü.",
    "Bardak kırıldı.",
    "Berk korktu ama annesine gerçeği söyledi.",
    "Annesi dikkatli olması gerektiğini anlattı.",
    "Berk bir dahaki sefere yavaş davranmaya karar verdi.",
    "Soru: Berk neden annesine gerçeği söyledi?"
  ],
  [
    "Defne okulda grup çalışması yaptı.",
    "Herkes bir görev aldı.",
    "Defne afişi boyadı.",
    "Arkadaşı yazıları yazdı.",
    "Birlikte çalışınca ödevleri daha güzel oldu.",
    "Öğretmenleri onları tebrik etti.",
    "Soru: Ödev neden güzel oldu?"
  ],
  [
    "Aras sınıfta şiir okumaktan çekiniyordu.",
    "Sırası geldiğinde kalbi hızlı attı.",
    "Derin bir nefes aldı ve okumaya başladı.",
    "Arkadaşları onu dikkatle dinledi.",
    "Şiiri bitirdiğinde alkış aldı.",
    "Aras cesur davrandığı için gurur duydu.",
    "Soru: Aras neden gurur duydu?"
  ],
  [
    "İlayda parkta oynarken yerde bir cüzdan buldu.",
    "İçinde para ve kimlik vardı.",
    "Parayı almak istemedi.",
    "En yakın görevliye götürdü.",
    "Cüzdanın sahibi gelip teşekkür etti.",
    "İlayda doğru olanı yaptığı için mutlu oldu.",
    "Soru: İlayda cüzdanı neden görevliye verdi?"
  ],
  [
    "Onur yeni bir model uçak yapmak istedi.",
    "Parçaları birleştirirken zorlandı.",
    "Birkaç kez hata yaptı.",
    "Sinirlenmek yerine talimatlara tekrar baktı.",
    "Yavaşça devam etti.",
    "Sonunda uçağı tamamladı.",
    "Onur sabırlı olunca başarabildiğini anladı.",
    "Soru: Onur modeli nasıl tamamladı?"
  ],
  [
    "Henna ve Asya sabah uyandı.",
    "Birlikte dışarı çıktılar.",
    "Kedilerini sevip bir süre izlediler.",
    "Sonra saklambaç oynadılar ve çok eğlendiler.",
    "Eve dönünce ellerini yıkadılar.",
    "Birlikte biraz dinlendiler.",
    "Akşam yemek yediler ve dişlerini fırçaladılar.",
    "Gece olunca mutlu bir günün ardından uyudular.",
    "Soru: Henna ve Asya gün içinde birlikte neler yaptılar?"
  ]
];

const HIKAYE_ISIMLERI = [
  'Mina ve Oyuncak Arabası',
  'Baran ve Yapboz',
  'Henna ve Kediler',
  'Mustafa ve Yeni Ayakkabıları',
  'Asya ve Yağmur',
  'Yusuf ve Kitap',
  'Zeynep ve Çiçekler',
  'Maysa ve Resim',
  'Mehmet ve Uçurtma',
  'Yağmur ve Kütüphane',
  'Çiçek ve Dostluk',
  'Emir ve Kayıp Kalem',
  'Beyaz ve Paylaşmak',
  'Kaan ve Zamanında Uyanmak',
  'Elvan ve Bitki',
  'Berk ve Kırılan Bardak',
  'Defne ve Grup Çalışması',
  'Aras ve Cesaret',
  'İlayda ve Doğru Karar',
  'Onur ve Sabır',
  'Henna ve Asya'
];

// ─── localStorage yardımcıları ────────────────────────────────────────────────
const LS_KEY = 'sesliOkumaOyunu_v1';
function kaydet() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      grupIndex, cumleIndex, hikayeModu, hikayeIndex, hikayeCumle, totalScore, koyunSkor
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
    koyunSkor   = d.koyunSkor   || 0;  // ← EKLENDİ
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
let kelimeHatalar = {};

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
let totalScore         = 0;
let yanlisSayac        = 0;
let yanlisSayacIndex   = -1;
let endGameTimer       = null;
let navTimer           = null;

// ══════════════════════════════════════════════════════════════════════════════
// SpeechController
// ══════════════════════════════════════════════════════════════════════════════
const SpeechController = (function () {

  let recognition   = null;
  let recState      = 'idle';
  let isSpeaking    = false;
  let lastError     = null;
  let silenceTimer  = null;
  let restartTimer  = null;
  let watchdogTimer = null;
  let trVoiceCache  = null;

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

  function clearTimers() {
    if (silenceTimer)  { clearTimeout(silenceTimer);  silenceTimer  = null; }
    if (restartTimer)  { clearTimeout(restartTimer);  restartTimer  = null; }
    if (watchdogTimer) { clearTimeout(watchdogTimer); watchdogTimer = null; }
  }

  function resetWatchdog() {
    if (watchdogTimer) clearTimeout(watchdogTimer);
    watchdogTimer = setTimeout(() => {
      watchdogTimer = null;
      if (isSpeaking) return;
      if (currentWordIndex >= targetWords.length) return;
      if (recState !== 'listening') {
        scheduleRestart(100);
      } else {
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
        _stop(true);
      }
    }, 3500);
  }

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

  function _onStart() {
    recState = 'listening';
    resetWatchdog();
    micIndicator.className = 'mic-indicator active';
    micStatus.className    = 'mic-status listening';
    micStatus.textContent  = '🎤 Dinliyorum...';
  }

  function _onResult(event) {
    if (!event || !event.results) return;
    if (isSpeaking) return;

    resetWatchdog();
    interimText.textContent = event.results[event.results.length - 1][0].transcript;
    resetSilenceTimer();

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) continue;
      if (currentWordIndex >= targetWords.length) break;
      const tokenler = normalizeText(event.results[i][0].transcript);
      for (let t = 0; t < tokenler.length; t++) {
        if (currentWordIndex >= targetWords.length) break;
        if (tokenler[t] === targetWords[currentWordIndex]) {
          validateWord(tokenler[t]);
        }
      }
    }

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (!event.results[i].isFinal) continue;
      const sonuc = event.results[i];

      const altDizisi = [];
      for (let a = 0; a < sonuc.length; a++) {
        altDizisi.push({ transcript: sonuc[a].transcript, confidence: sonuc[a].confidence || 0 });
      }
      altDizisi.sort((x, y) => y.confidence - x.confidence);

      const altTokenler = altDizisi.map(alt => normalizeText(alt.transcript));
      const anaTokenler = altTokenler[0] || [];

      for (let t = 0; t < anaTokenler.length; t++) {
        if (currentWordIndex >= targetWords.length) break;
        const hedef = targetWords[currentWordIndex];
        let bulunan = null;
        for (let a = 0; a < altTokenler.length; a++) {
          const tok = altTokenler[a][t];
          if (tok && kelimeEslesir(tok, hedef)) { bulunan = tok; break; }
        }
        if (!bulunan) {
          for (let a = 0; a < altTokenler.length; a++) {
            for (let p = 0; p < altTokenler[a].length; p++) {
              const tok = altTokenler[a][p];
              if (tok && kelimeEslesir(tok, hedef)) { bulunan = tok; break; }
            }
            if (bulunan) break;
          }
        }
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
  }

  function _onEnd() {
    recState = 'idle';
    if (lastError === 'not-allowed' || lastError === 'service-not-allowed') return;
    if (currentWordIndex >= targetWords.length) return;
    if (isSpeaking) return;
    scheduleRestart(300);
  }

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

  return {
    startListening() {
      lastError = null;
      resetWatchdog();
      scheduleRestart(100);
    },

    speakCorrection(metin, opts) {
      if (!window.speechSynthesis) return;
      opts = opts || {};
      const rate  = opts.rate  || 0.80;
      const pitch = opts.pitch || 1.05;

      isSpeaking = true;
      window.speechSynthesis.cancel();
      clearTimers();

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

      setTimeout(() => { window.speechSynthesis.speak(ut); }, 150);
    },

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

// ─── Toleranslı eşleşme ───────────────────────────────────────────────────────
function kelimeEslesir(konusulan, hedef) {
  if (konusulan === hedef) return true;
  const dist     = levenshtein(konusulan, hedef);
  const maxLen   = Math.max(hedef.length, konusulan.length);
  const dogruluk = (1 - dist / maxLen) * 100;

  if (hikayeModu) {
    let esik;
    if (hedef.length <= 5)      esik = 75;
    else if (hedef.length <= 8) esik = 80;
    else                        esik = 85;
    return dogruluk >= esik;
  }

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
    span.className = 'word correct';
    score      += 10;
    totalScore += 10;
    bolumDogru++;
    yanlisSayac = 0;
    yanlisSayacIndex = -1;
    currentWordIndex++;
    requestAnimationFrame(updateUI);

    if (currentWordIndex === targetWords.length) {
      endGame();
    }

  } else {
    if (yanlisSayacIndex !== currentWordIndex) {
      yanlisSayac      = 0;
      yanlisSayacIndex = currentWordIndex;
    }
    yanlisSayac++;

    if (yanlisSayac === 1) {
      bolumYanlis++;
      kelimeHatalar[hedef] = (kelimeHatalar[hedef] || 0) + 1;
    }

    if (yanlisSayac === 1) {
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
      span.className = 'word wrong';
      setTimeout(() => {
        if (currentWordIndex < targetWords.length && wordSpans[currentWordIndex] === span) {
          span.className = 'word active';
        }
      }, 250);
    }

    if (yanlisSayac >= 2) {
      yanlisSayac = 0;
      SpeechController.speakCorrection(hedef, { rate: 0.72, pitch: 1.05 });
    }
  }
}

// ─── Rapor göster ────────────────────────────────────────────────────────────
function gosterRapor(opts) {
  reportEmoji.textContent    = opts.emoji   || '🌟';
  reportTitle.textContent    = opts.title   || 'Tamamlandı!';
  reportSubtitle.textContent = opts.subtitle || '';
  reportDogru.textContent    = bolumDogru;
  reportYanlis.textContent   = bolumYanlis;
  reportPuan.textContent     = totalScore;

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

// ─── Sonraki cümleye geç ─────────────────────────────────────────────────────
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
    const hikaye   = HIKAYE_GRUPLARI[hikayeIndex];
    const sonCumle = (hikayeCumle === hikaye.length - 1);

    if (sonCumle) {
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
    const sonCumle = (cumleIndex === CUMLE_GRUPLARI[grupIndex].length - 1);

    if (sonCumle) {
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

// ─── Cümle sıfırla ve başlat ──────────────────────────────────────────────────
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
  score = 0;
  yanlisSayac = 0; yanlisSayacIndex = -1;
  interimText.textContent = '';
  congratsBanner.classList.remove('visible');
  errorMsg.classList.remove('visible');
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
  tabAlistirma.classList.toggle('active', !hikayeModu);
  tabHikaye.classList.toggle('active', hikayeModu);
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
  updateStoryProgress(true);
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
    storyProgressText.textContent = (hikayeIndex + 1) + ' / ' + HIKAYE_GRUPLARI.length;
    storyProgressText.style.color = '#a78bfa';
    if (navTimer) clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      navTimer = null;
      storyProgressText.textContent = (hikayeCumle + 1) + ' / ' + toplam;
      storyProgressText.style.color = '';
    }, 1500);
  } else {
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
    const level = Math.min(avg / 60, 1);
    const scale = 1 + level * 0.45;
    const glow  = Math.round(level * 32);
    micIndicator.style.transform  = `scale(${scale.toFixed(2)})`;
    micIndicator.style.boxShadow  = `0 0 ${glow}px rgba(6,214,160,${(level * 0.8).toFixed(2)})`;
  }

  function stopAnalyser() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    micIndicator.style.transform = '';
    micIndicator.style.boxShadow = '';
    if (audioCtx) { audioCtx.close(); audioCtx = null; analyser = null; }
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => { startAnalyser(stream); })
      .catch(() => {});
  }
})();

// ─── İlk yükleme ─────────────────────────────────────────────────────────────
yukle();
syncLevelButtons();
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

function menuGoster() {
  menuScoreText.textContent  = totalScore;
  menuTotalScore.textContent = totalScore;
  menuLevelText.textContent  = grupIndex + 1;
  menuLevelBar.style.width   = ((cumleIndex / 15) * 100) + '%';
  gameContainer.style.display = 'none';
  menuScreen.style.display    = 'flex';
  SpeechController.stopAll();
}

function oyunEkraniGoster(hikayeModuSecim) {
  if (hikayeModuSecim !== undefined && hikayeModuSecim !== hikayeModu) {
    hikayeModu = hikayeModuSecim;
    if (hikayeModu) {
      hikayeIndex = 0; hikayeCumle = 0;
      storyProgress.classList.add('visible');
      updateStoryProgress();
    } else {
      storyProgress.classList.remove('visible');
    }
    syncLevelButtons();
    oyunuKur();
    kaydet();
  }
  menuScreen.style.display    = 'none';
  gameContainer.style.display = 'flex';
  setTimeout(() => { btnStart.click(); }, 200);
}

document.querySelectorAll('.menu-card-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mod = btn.dataset.mod;
    if (mod === 'kelime') {
      kelimeOyunuGoster();
    } else {
      oyunEkraniGoster(mod === 'hikaye');
    }
  });
});

document.querySelectorAll('.menu-card').forEach(kart => {
  kart.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-card-btn')) return;
    const btn = kart.querySelector('.menu-card-btn');
    if (btn) btn.click();
  });
});

btnBack.addEventListener('click', () => {
  menuGoster();
});

menuGoster();

// ═══════════════════════════════════════════════════════════════
// KELİME OYUNU
// ═══════════════════════════════════════════════════════════════

const KELIME_EMOJI = {
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
  'çiçek':   '🌸',
  'ağaç':    '🌳',
  'elma':    '🍎',
  'güneş':   '☀️',
  'ay':      '🌙',
  'yıldız':  '⭐',
  'bulut':   '☁️',
  'kar':     '❄️',
  'yağmur':  '🌧️',
  'kitap':   '📚',
  'kalem':   '✏️',
  'okul':    '🏫',
  'ev':      '🏠',
  'araba':   '🚗',
  'top':     '⚽',
  'balon':   '🎈',
  'pasta':   '🎂',
  'armut':   '🍐',
  'muz':     '🍌',
  'çilek':   '🍓',
  'portakal':'🍊',
};

const KOYUN_KELIMELER = [
  'kedi','köpek','kuş','balık','arı','inek','at','tavuk','kelebek',
  'çiçek','ağaç','elma','güneş','ay','yıldız','bulut',
  'kitap','kalem','okul','ev','araba','top','balon','pasta',
  'armut','muz','çilek','portakal',
];

let koyunIndex     = 0;
let koyunSkor      = 0;
let koyunYanlis    = 0;
let koyunAktif     = false;
let koyunRec       = null;
let koyunRecState  = 'idle';
let koyunSiralamis = [];

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

function koyunKarıstir(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function koyunHintYap(kelime) {
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
}

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
  koyunRec.continuous     = false;
  koyunRec.interimResults = true;
  koyunRec.maxAlternatives = 3;

  koyunRec.onstart = () => {
    koyunRecState = 'listening';
    koyunMicIndicator.className = 'mic-indicator active';
    koyunMicStatus.className    = 'mic-status listening';
    koyunMicStatus.textContent  = '🎤 Dinliyorum...';
  };

  koyunRec.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    koyunInterimText.textContent = transcript;
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

function koyunCevapKontrol(soylenen) {
  const hedef    = koyunSiralamis[koyunIndex];
  const tokenler = normalizeText(soylenen);
  const dogru    = tokenler.some(t => kelimeEslesir(t, hedef));

  if (dogru) {
    koyunSkor += 15;
    koyunScoreEl.textContent  = koyunSkor;
    koyunHint.textContent     = hedef;
    koyunHint.className       = 'koyun-hint revealed';
    koyunResult.textContent   = '✅ Harika! +15 puan';
    koyunResult.className     = 'koyun-result dogru';
    koyunCard.className       = 'koyun-card correct-flash';
    totalScore += 15;
    setTimeout(() => { koyunSonraki(); }, 1400);
  } else {
    koyunYanlis++;
    koyunResult.textContent = '❌ Tekrar dene!';
    koyunResult.className   = 'koyun-result yanlis';
    koyunCard.className     = 'koyun-card wrong-flash';
    setTimeout(() => { koyunCard.className = 'koyun-card'; }, 400);
  }
}

function koyunSonraki() {
  koyunIndex++;
  if (koyunIndex >= koyunSiralamis.length) {
    koyunSiralamis = koyunKarıstir(KOYUN_KELIMELER);
    koyunIndex = 0;
  }
  koyunGoster();
}

koyunBtnStart.addEventListener('click', () => {
  koyunAktif = true;
  koyunErrorMsg.classList.remove('visible');
  koyunBtnStart.disabled = true;
  setTimeout(() => { koyunBtnStart.disabled = false; }, 1000);
  koyunRecBaslat();
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

function kelimeOyunuGoster() {
  menuScreen.style.display    = 'none';
  gameContainer.style.display = 'none';
  koyunScreen.style.display   = 'flex';
  koyunSiralamis = koyunKarıstir(KOYUN_KELIMELER);
  koyunIndex  = 0;
  koyunSkor   = 0;
  koyunYanlis = 0;
  koyunAktif  = false;
  koyunGoster();
  koyunMicStatus.textContent = 'Başlamak için düğmeye bas';
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

function _koyunSesliKontrol(soylenen) {
  const hedef    = koyunSiralamis[koyunIndex];
  const tokenler = normalizeText(soylenen);
  const dogru    = tokenler.some(t => kelimeEslesir(t, hedef));

  if (dogru) {
    koyunAktif = false;
    if (koyunRec) { try { koyunRec.abort(); } catch(e) {} }
    koyunRecState = 'idle';

    koyunSkor += 15;
    totalScore += 15;
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
}

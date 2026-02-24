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
// Başlık alanı
const modeTitleEl       = document.getElementById('modeTitle');
const modeSubtitleEl    = document.getElementById('modeSubtitle');
// Seviye ve sekme şeritleri
const levelSelector     = document.querySelector('.level-selector');
const tabStrip          = document.querySelector('.tab-strip');

if (!SpeechRecognition) {
  noSupport.classList.add('visible');
  btnStart.disabled = true;
}

// ─── Cümle listesi (MEB Harf Grupları) ───────────────────────────────────────
// Grup 1: E L A K İ N
// Grup 2: + O M U T Ü Y
// Grup 3: + Ö R I(=ı) D S B
// Grup 4: + Z Ç G Ş C P
// Grup 5: + H V Ğ F J
// Her cümle doğrulanmıştır: yalnızca ilgili ve önceki grupların harflerini içerir.

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
  // Hikaye 1: Mina ve Oyuncak Arabası
  [
    "Mina kırmızı oyuncak arabasını aldı.",
    "Arabayı yere koydu ve hafifçe itti.",
    "Araba hızla ilerledi ve masanın ayağına çarptı.",
    "Mina önce şaşırdı, sonra gülmeye başladı.",
    "Arabasını dikkatli sürmesi gerektiğini anladı.",
    "Soru: Mina arabasını sürerken neyi fark etti?"
  ],
  // Hikaye 2: Baran ve Yapboz
  [
    "Baran yapboz parçalarını masaya yaydı.",
    "Önce köşe parçalarını buldu.",
    "Parçaları birleştirirken sabırlı davrandı.",
    "Sonunda güzel bir hayvan resmi ortaya çıktı.",
    "Baran başardığı için gurur duydu.",
    "Soru: Baran yapbozu tamamlarken nasıl davrandı?"
  ],
  // Hikaye 3: Henna ve Kediler
  [
    "Henna bahçeye çıktığında iki küçük kedi çimenlerde oynuyordu.",
    "Kediler bir kelebeği kovalamaya başladı.",
    "Henna da onların peşinden koştu ama dikkatli yürüdü.",
    "Kediler yorulunca gölgede dinlendiler.",
    "Henna onları severken mutlu hissetti.",
    "Soru: Kediler yorulunca ne yaptılar?"
  ],
  // Hikaye 4: Mustafa ve Yeni Ayakkabıları
  [
    "Mustafa yeni ayakkabılarını giydi.",
    "Çimlerde top oynamaya başladı.",
    "Koşarken ayakkabılarının çok rahat olduğunu fark etti.",
    "Ama çimenler ıslaktı ve biraz kaydı.",
    "Mustafa dikkatli olması gerektiğini öğrendi.",
    "Soru: Mustafa neden dikkatli olması gerektiğini anladı?"
  ],
  // Hikaye 5: Asya ve Yağmur
  [
    "Asya camdan dışarı baktı.",
    "Yağmur yağıyordu.",
    "Şemsiyesini alıp annesiyle dışarı çıktı.",
    "Su birikintilerine basmamaya çalıştı ama birine bastı.",
    "Ayakkabıları ıslandı.",
    "Asya eve dönünce kuru çorap giydi.",
    "Soru: Asya'nın ayakkabıları neden ıslandı?"
  ],
  // Hikaye 6: Yusuf ve Kitap
  [
    "Yusuf kitaplığından bir hikaye kitabı seçti.",
    "Kitabı sessizce okumaya başladı.",
    "Anlamadığı bir kelimeyi annesine sordu.",
    "Yeni kelimenin anlamını öğrenince hikayeyi daha iyi anladı.",
    "Soru: Yusuf anlamadığı kelimeyi öğrenince ne oldu?"
  ],
  // Hikaye 7: Zeynep ve Çiçekler
  [
    "Zeynep bahçedeki çiçekleri suladı.",
    "Bazı çiçeklerin yaprakları solmuştu.",
    "Daha fazla su verdikten sonra birkaç gün bekledi.",
    "Çiçekler yeniden canlandı.",
    "Zeynep sabırlı olmanın önemini öğrendi.",
    "Soru: Çiçekler nasıl yeniden canlandı?"
  ],
  // Hikaye 8: Maysa ve Resim
  [
    "Maysa resim defterini açtı.",
    "Önce güneş çizdi, sonra bir ev yaptı.",
    "Boyarken çizgilerin dışına taştı ama pes etmedi.",
    "Resmini tamamladığında çok güzel görünüyordu.",
    "Soru: Maysa resim yaparken vazgeçti mi?"
  ],
  // Hikaye 9: Mehmet ve Uçurtma
  [
    "Mehmet uçurtmasını gökyüzüne bıraktı.",
    "Rüzgar hafif esiyordu.",
    "Uçurtma bazen düşer gibi oldu ama Mehmet ipi sıkı tuttu.",
    "Bir süre sonra uçurtma daha yükseğe çıktı.",
    "Soru: Uçurtma neden düşmedi?"
  ],
  // Hikaye 10: Yağmur ve Kütüphane
  [
    "Yağmur kütüphaneye gitti.",
    "Sessiz olması gerektiğini biliyordu.",
    "Kitabını dikkatle seçti ve yerine oturdu.",
    "Çevresindekileri rahatsız etmeden okudu.",
    "Soru: Yağmur kütüphanede neden sessiz davrandı?"
  ],
  // Hikaye 11: Çiçek ve Dostluk
  [
    "Çiçek parkta tek başına oturan bir çocuk gördü.",
    "Yanına gidip selam verdi.",
    "Birlikte salıncağa bindiler.",
    "O gün yeni bir arkadaş edindi.",
    "Soru: Çiçek yeni arkadaşını nasıl kazandı?"
  ],
  // Hikaye 12: Emir ve Kayıp Kalem
  [
    "Emir ödev yapmak için masaya oturdu.",
    "Kalemini bulamadı.",
    "Çantasını ve masasını aradı ama kalem yoktu.",
    "Sonra dün parkta ders çalıştığını hatırladı.",
    "Çantasının küçük cebine baktı ve kalemini buldu.",
    "Emir eşyalarını düzenli koyması gerektiğini anladı.",
    "Soru: Emir kalemini nerede buldu?"
  ],
  // Hikaye 13: Beyaz ve Paylaşmak
  [
    "Beyaz parkta bisküviyle oturuyordu.",
    "Yanındaki çocuk üzgün görünüyordu çünkü yiyeceği yoktu.",
    "Beyaz bisküvisini ikiye böldü ve yarısını verdi.",
    "Çocuk gülümsedi.",
    "Beyaz paylaşmanın insanı mutlu ettiğini fark etti.",
    "Soru: Beyaz neden mutlu oldu?"
  ],
  // Hikaye 14: Kaan ve Zamanında Uyanmak
  [
    "Kaan sabah alarmı duydu ama kapattı.",
    "Biraz daha uyumak istedi.",
    "Uyandığında okula geç kaldığını fark etti.",
    "Aceleyle hazırlandı ama servisi kaçırdı.",
    "Ertesi gün alarm çalınca hemen kalktı.",
    "Soru: Kaan servisi neden kaçırdı?"
  ],
  // Hikaye 15: Elvan ve Bitki
  [
    "Elvan küçük bir saksıya tohum ekti.",
    "Her gün düzenli olarak suladı.",
    "İlk gün hiçbir şey çıkmadı.",
    "Elvan biraz üzüldü ama beklemeye devam etti.",
    "Birkaç gün sonra küçük bir filiz gördü.",
    "Sabırlı olmanın önemli olduğunu öğrendi.",
    "Soru: Bitki neden büyüdü?"
  ],
  // Hikaye 16: Berk ve Kırılan Bardak
  [
    "Berk mutfakta su almak istedi.",
    "Bardağı hızlıca aldı ve elinden düşürdü.",
    "Bardak kırıldı.",
    "Berk korktu ama annesine gerçeği söyledi.",
    "Annesi dikkatli olması gerektiğini anlattı.",
    "Berk bir dahaki sefere yavaş davranmaya karar verdi.",
    "Soru: Berk neden annesine gerçeği söyledi?"
  ],
  // Hikaye 17: Defne ve Grup Çalışması
  [
    "Defne okulda grup çalışması yaptı.",
    "Herkes bir görev aldı.",
    "Defne afişi boyadı.",
    "Arkadaşı yazıları yazdı.",
    "Birlikte çalışınca ödevleri daha güzel oldu.",
    "Öğretmenleri onları tebrik etti.",
    "Soru: Ödev neden güzel oldu?"
  ],
  // Hikaye 18: Aras ve Cesaret
  [
    "Aras sınıfta şiir okumaktan çekiniyordu.",
    "Sırası geldiğinde kalbi hızlı attı.",
    "Derin bir nefes aldı ve okumaya başladı.",
    "Arkadaşları onu dikkatle dinledi.",
    "Şiiri bitirdiğinde alkış aldı.",
    "Aras cesur davrandığı için gurur duydu.",
    "Soru: Aras neden gurur duydu?"
  ],
  // Hikaye 19: İlayda ve Doğru Karar
  [
    "İlayda parkta oynarken yerde bir cüzdan buldu.",
    "İçinde para ve kimlik vardı.",
    "Parayı almak istemedi.",
    "En yakın görevliye götürdü.",
    "Cüzdanın sahibi gelip teşekkür etti.",
    "İlayda doğru olanı yaptığı için mutlu oldu.",
    "Soru: İlayda cüzdanı neden görevliye verdi?"
  ],
  // Hikaye 20: Onur ve Sabır
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
  // Hikaye 21: Henna ve Asya
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
let denemeHakki        = 0;   // 0=ilk deneme, 1=tekrar hakkı verildi → 2. başarısızlıkta otomatik doğru
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
        // Eşleşme yoksa validateWord çağırma — yanlış saymıyoruz
        if (bulunan) validateWord(bulunan);
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

// ─── Fonetik harita (çocuk ses gelişimi: r↔l, s↔ş, c↔ç vb.) ────────────────
const FONETIK_HARITA = [
  ['r','l'],['l','r'],
  ['s','ş'],['ş','s'],
  ['c','ç'],['ç','c'],
  ['b','p'],['p','b'],
  ['d','t'],['t','d'],
  ['g','k'],['k','g'],
  ['v','f'],['f','v'],
];
function fonetikNormalize(konusulan, hedef) {
  let s = konusulan;
  for (let i = 0; i < hedef.length && i < s.length; i++) {
    if (s[i] !== hedef[i]) {
      const eslesme = FONETIK_HARITA.find(([k, v]) => k === s[i] && v === hedef[i]);
      if (eslesme) s = s.slice(0, i) + hedef[i] + s.slice(i + 1);
    }
  }
  return s;
}

// ─── Toleranslı eşleşme (katmanlı, mod farkındalıklı) ────────────────────────
function kelimeEslesir(konusulan, hedef) {
  if (konusulan === hedef) return true;

  // Fonetik normalize edilmiş versiyonu da dene
  const fonetik  = fonetikNormalize(konusulan, hedef);
  if (fonetik === hedef) return true;

  // Levenshtein: orijinal ve fonetik arasından en iyiyi al
  const dist1    = levenshtein(konusulan, hedef);
  const dist2    = levenshtein(fonetik,   hedef);
  const dist     = Math.min(dist1, dist2);
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
    // ✅ Doğru
    kelimeKabul(span, hedef);

  } else {
    // Eşleşme yok — kelimeye bağlı sayaç
    if (yanlisSayacIndex !== currentWordIndex) {
      yanlisSayac      = 0;
      yanlisSayacIndex = currentWordIndex;
      denemeHakki      = 0;
    }
    yanlisSayac++;

    // bolumYanlis: kelime başına bir kez say
    if (yanlisSayac === 1) {
      bolumYanlis++;
      kelimeHatalar[hedef] = (kelimeHatalar[hedef] || 0) + 1;
    }

    if (denemeHakki === 0) {
      // İlk başarısızlık: sarı efekt + "Tekrar deneyelim" — TTS YOK
      denemeHakki = 1;
      span.style.transform   = 'scale(1.06)';
      span.style.background  = 'rgba(255,209,102,0.18)';
      span.style.borderColor = 'var(--yellow)';
      span.style.color       = 'var(--yellow)';
      micStatus.textContent  = '💪 Tekrar deneyelim!';
      setTimeout(() => {
        if (currentWordIndex < targetWords.length && wordSpans[currentWordIndex] === span) {
          span.style.transform   = '';
          span.style.background  = '';
          span.style.borderColor = '';
          span.style.color       = '';
          span.className = 'word active';
          micStatus.textContent = '🎤 Dinliyorum...';
        }
      }, 800);
    } else {
      // İkinci başarısızlık: otomatik doğru kabul et, puan ver
      denemeHakki = 0;
      kelimeKabul(span, hedef);
    }
  }
}

// ─── Kelimeyi doğru kabul et (puan ver, ilerle) ───────────────────────────────
function kelimeKabul(span, hedef) {
  span.className = 'word correct';
  score      += 1;
  totalScore += 1;
  bolumDogru++;
  yanlisSayac      = 0;
  yanlisSayacIndex = -1;
  denemeHakki      = 0;
  currentWordIndex++;
  requestAnimationFrame(updateUI);

  if (currentWordIndex === targetWords.length) {
    kontrolRozetlerYildiz();
    kontrolRozetlerZorluk();
    endGame();
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

function menuGoster() {
  // Menü skorunu güncelle
  menuScoreText.textContent  = totalScore;
  menuTotalScore.textContent = totalScore;
  if (menuLevelText) menuLevelText.textContent = grupIndex + 1;
  if (menuLevelBar)  menuLevelBar.style.width  = ((cumleIndex / 15) * 100) + '%';

  // Oyun ekranını gizle, menüyü göster
  gameContainer.style.display = 'none';
  menuScreen.style.display    = 'flex';
  SpeechController.stopAll();
}

function oyunEkraniGoster(hikayeModuSecim) {
  // Mod ayarla
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

  // Başlık alt yazısını moda göre ayarla
  if (modeSubtitleEl) {
    modeSubtitleEl.textContent = hikayeModu ? 'Hikaye' : 'Alıştırma';
  }

  // Menüyü gizle, oyun ekranını göster
  menuScreen.style.display    = 'none';
  gameContainer.style.display = 'flex';

  // Otomatik başlat
  setTimeout(() => { btnStart.click(); }, 200);
}

// Menü kart butonları
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

// Kart alanına tıklama da çalışsın
document.querySelectorAll('.menu-card').forEach(kart => {
  kart.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-card-btn')) return;
    const btn = kart.querySelector('.menu-card-btn');
    if (btn) btn.click();
  });
});

// Geri butonu
btnBack.addEventListener('click', () => {
  menuGoster();
});

// İlk açılışta: menüyü göster, oyun ekranını gizle
menuGoster();

// Başarılarım menü öğesi
if (hmAchievements) {
  hmAchievements.addEventListener('click', () => {
    // Şimdilik sadece küçük bir bilgi tostu gösterelim
    const aciklama = [
      (achievements.minikOkur      ? '🐣 Minik Okur: Açık'        : '🐣 Minik Okur: Kilitli'),
      (achievements.hicPesEtmeyen  ? '💪 Hiç Pes Etmeyen: Açık'   : '💪 Hiç Pes Etmeyen: Kilitli'),
      (achievements.cesurOkuyucu   ? '🦁 Cesur Okuyucu: Açık'     : '🦁 Cesur Okuyucu: Kilitli'),
      (achievements.parlayanYildiz ? '⭐ Parlayan Yıldız: Açık'   : '⭐ Parlayan Yıldız: Kilitli'),
      (achievements.okumaSampiyonu ? '👑 Okuma Şampiyonu: Açık'   : '👑 Okuma Şampiyonu: Kilitli')
    ].join(' · ');
    gosterRozetKutlama('Başarılarım', aciklama);
  });
}

// ═══════════════════════════════════════════════════════════════
// KELİME OYUNU — v3 (Otomatik Zorlaşan, 3 Tip, Offline)
// ═══════════════════════════════════════════════════════════════

// ─── Kelime → Emoji tablosu ───────────────────────────────────
const KELIME_EMOJI = {
  // Hayvanlar
  'kedi':'🐱','köpek':'🐶','kuş':'🐦','balık':'🐟','arı':'🐝',
  'inek':'🐄','at':'🐴','tavuk':'🐔','kelebek':'🦋','karınca':'🐜',
  'aslan':'🦁','kaplan':'🐯','fil':'🐘','maymun':'🐒','penguen':'🐧',
  'kaplumbağa':'🐢','timsah':'🐊','zürafa':'🦒','zebra':'🦓','kurt':'🐺',
  // Meyveler
  'elma':'🍎','armut':'🍐','muz':'🍌','çilek':'🍓','portakal':'🍊',
  'kiraz':'🍒','üzüm':'🍇','kavun':'🍈','karpuz':'🍉','şeftali':'🍑',
  'limon':'🍋','mango':'🥭','ananas':'🍍','kivi':'🥝','nar':'🍎',
  // Renkler
  'kırmızı':'🔴','mavi':'🔵','sarı':'🟡','yeşil':'🟢','mor':'🟣',
  'turuncu':'🟠','beyaz':'⚪','siyah':'⚫','pembe':'🩷','kahve':'🟫',
  // Diğer
  'güneş':'☀️','ay':'🌙','yıldız':'⭐','bulut':'☁️','çiçek':'🌸',
};

const KOYUN_KELIMELER = [
  // Hayvanlar (20)
  'kedi','köpek','kuş','balık','arı',
  'inek','at','tavuk','kelebek','aslan',
  'kaplan','fil','maymun','penguen','kaplumbağa',
  'timsah','zebra','kurt','karınca','zürafa',
  // Meyveler (15)
  'elma','armut','muz','çilek','portakal',
  'kiraz','üzüm','kavun','karpuz','şeftali',
  'limon','mango','ananas','kivi','nar',
  // Renkler (10)
  'kırmızı','mavi','sarı','yeşil','mor',
  'turuncu','beyaz','siyah','pembe','kahve',
];

// ─── Türkçe harf havuzu ───────────────────────────────────────
const HARF_HAVUZU = 'abcçdefgğhıijklmnoöprsştuüvyz'.split('');

// ─── State ────────────────────────────────────────────────────
let koyunIndex     = 0;
let koyunSkor      = 0;
let koyunYanlis    = 0;
let koyunSiralamis = [];
let koyunTurSayac  = 0;   // toplam doğru kelime (zorluk için)
let koyunTurYildiz = 0;   // bu turdaki yıldız (5'te bir tur sonu)
let koyunSureTimer = null;
let koyunSureSaniye= 0;
let koyunKilitli   = false;

// ─── DOM ──────────────────────────────────────────────────────
const koyunScreen   = document.getElementById('koyunScreen');
const btnKoyunBack  = document.getElementById('btnKoyunBack');
const koyunEmoji    = document.getElementById('koyunEmoji');
const koyunHint     = document.getElementById('koyunHint');
const koyunResult   = document.getElementById('koyunResult');
const koyunScoreEl  = document.getElementById('koyunScore');
const koyunCard     = document.getElementById('koyunCard');
const harfKutuSatir = document.getElementById('harfKutuSatir');
const harfButonSatir= document.getElementById('harfButonSatir');
const koyunBtnSkip  = document.getElementById('koyunBtnSkip');
// Gizli eski elementler (referans korunuyor)
const koyunBtnStart     = document.getElementById('koyunBtnStart');
const koyunMicIndicator = document.getElementById('koyunMicIndicator');
const koyunMicStatus    = document.getElementById('koyunMicStatus');
const koyunInterimText  = document.getElementById('koyunInterimText');
const koyunErrorMsg     = document.getElementById('koyunErrorMsg');

// ─── Süre sayacı alanı ────────────────────────────────────────
let sureSatirEl = null;
function sureSatirGetir() {
  if (!sureSatirEl) {
    sureSatirEl = document.createElement('div');
    sureSatirEl.id = 'koyunSureSatir';
    sureSatirEl.className = 'koyun-sure-satir';
    harfKutuSatir.parentNode.insertBefore(sureSatirEl, harfKutuSatir);
  }
  return sureSatirEl;
}

// ─── Yardımcılar ──────────────────────────────────────────────
function koyunKaristir(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function normalTR(h) {
  return h.toLocaleLowerCase('tr-TR');
}

// ─── Zorluk seviyesi belirle ──────────────────────────────────
// tip: 1=harfSec, 2=surukle, 3=karisik
// eksik: kaç harf boş
// secenek: kaç buton (tip1 için)
// sure: saniye (0=süresiz)
function koyunZorlukAl() {
  const n = koyunTurSayac; // toplam tamamlanan kelime sayısı
  if (n < 5)  return { tip:1, eksik:1, secenek:3, sure:0 };
  if (n < 10) return { tip: (n%2===0?1:2), eksik:2, secenek:4, sure:0 };
  if (n < 15) return { tip:2, eksik: (n%3===0?3:2), secenek:0, sure:0 };
  if (n < 20) return { tip:3, eksik:0, secenek:0, sure:0 };
  return { tip: (n%3===0?3:2), eksik:2, secenek:4, sure:20 };
}

// ─── Eksik harf indekslerini seç (ilk harf daima görünür) ─────
function eksikIndexlerSec(kelime, adet) {
  // Kullanılabilir indexler: 1..son (0 daima görünür), boşluklar hariç
  const available = [];
  for (let i = 1; i < kelime.length; i++) {
    if (kelime[i] !== ' ') available.push(i);
  }
  const karistir = koyunKaristir(available);
  return karistir.slice(0, Math.min(adet, available.length)).sort((a,b)=>a-b);
}

// ─── Süre sayacını başlat/durdur ──────────────────────────────
function sureyiBaslat(saniye) {
  sureyiDurdur();
  if (!saniye) { sureSatirGetir().style.display='none'; return; }
  koyunSureSaniye = saniye;
  const el = sureSatirGetir();
  el.style.display = 'flex';
  el.innerHTML = `<div class="sure-bar-wrap"><div class="sure-bar" id="sureBar"></div></div><span class="sure-text" id="sureSay">${saniye}</span>`;
  koyunSureTimer = setInterval(() => {
    koyunSureSaniye--;
    const sayEl  = document.getElementById('sureSay');
    const barEl  = document.getElementById('sureBar');
    if (sayEl) sayEl.textContent = koyunSureSaniye;
    if (barEl) barEl.style.width = (koyunSureSaniye / saniye * 100) + '%';
    if (koyunSureSaniye <= 0) {
      sureyiDurdur();
      // Süre doldu → geç
      koyunResult.textContent = '⏱ Süre doldu!';
      koyunResult.className   = 'koyun-result';
      koyunCard.className     = 'koyun-card';
      setTimeout(() => koyunSonraki(false), 800);
    }
  }, 1000);
}

function sureyiDurdur() {
  if (koyunSureTimer) { clearInterval(koyunSureTimer); koyunSureTimer = null; }
}

// ═══════════════════════════════════════════════════════════════
// TİP 1: HARF SEÇME
// ═══════════════════════════════════════════════════════════════
function tip1Goster(kelime, eksikIdxler, secenekSayisi) {
  let doldurulan   = 0;
  let yanlisSayac1 = 0;
  const eksikmis   = [...eksikIdxler];

  function kutuCiz() {
    harfKutuSatir.innerHTML = '';
    for (let i = 0; i < kelime.length; i++) {
      const kutu = document.createElement('div');
      if (kelime[i] === ' ') {
        kutu.className = 'harf-kutu harf-kutu--bosluk';
        kutu.textContent = ' ';
        harfKutuSatir.appendChild(kutu);
        continue;
      }
      kutu.className = 'harf-kutu';
      const eksikSira = eksikmis.indexOf(i);
      if (eksikSira >= 0) {
        if (eksikSira < doldurulan) {
          kutu.textContent = kelime[i].toLocaleUpperCase('tr-TR');
          kutu.classList.add('harf-kutu--dogru');
        } else if (eksikSira === doldurulan) {
          kutu.textContent = '_';
          kutu.classList.add('harf-kutu--bos', 'harf-kutu--aktif');
        } else {
          kutu.textContent = '_';
          kutu.classList.add('harf-kutu--bos');
        }
      } else {
        kutu.textContent = kelime[i].toLocaleUpperCase('tr-TR');
      }
      harfKutuSatir.appendChild(kutu);
    }
  }

  function butonCiz() {
    harfButonSatir.innerHTML = '';
    yanlisSayac1 = 0;
    const hedefHarf = kelime[eksikmis[doldurulan]];
    const yanlislar = HARF_HAVUZU
      .filter(h => normalTR(h) !== normalTR(hedefHarf))
      .sort(() => Math.random()-0.5)
      .slice(0, secenekSayisi - 1);
    const secenekler = koyunKaristir([hedefHarf, ...yanlislar]);
    secenekler.forEach(harf => {
      const btn = document.createElement('button');
      btn.className   = 'harf-btn';
      btn.textContent = harf.toLocaleUpperCase('tr-TR');
      btn.addEventListener('click', () => {
        if (koyunKilitli) return;
        if (normalTR(harf) === normalTR(hedefHarf)) {
          // ✅ Doğru
          btn.classList.add('harf-btn--dogru-flash');
          doldurulan++;
          if (doldurulan >= eksikmis.length) {
            sureyiDurdur();
            koyunKilitli = true;
            kutuCiz();
            harfButonSatir.innerHTML = '';
            koyunDogruYap(kelime);
          } else {
            kutuCiz();
            butonCiz();
          }
        } else {
          // ❌ Yanlış
          yanlisSayac1++;
          btn.classList.add('harf-btn--yanlis');
          koyunCard.className = 'koyun-card wrong-flash';
          setTimeout(() => {
            btn.classList.remove('harf-btn--yanlis');
            koyunCard.className = 'koyun-card';
          }, 600);
          if (yanlisSayac1 >= 2) {
            setTimeout(() => {
              harfButonSatir.querySelectorAll('.harf-btn').forEach(b => {
                if (normalTR(b.textContent) === normalTR(hedefHarf)) {
                  b.classList.add('harf-btn--ipucu');
                }
              });
            }, 650);
          }
        }
      });
      harfButonSatir.appendChild(btn);
    });
  }

  kutuCiz();
  butonCiz();
}

// ═══════════════════════════════════════════════════════════════
// TİP 2: DOKUNARAK YERLEŞTİR (sürükle bırak yerine)
// ═══════════════════════════════════════════════════════════════
function tip2Goster(kelime, eksikIdxler) {
  harfKutuSatir.innerHTML = '';
  harfButonSatir.innerHTML = '';

  const doldu      = new Array(eksikIdxler.length).fill(false);
  const yanlisSay2 = {};  // boşluk sira → yanlış sayısı
  let secilen      = null;

  function kutuCiz() {
    harfKutuSatir.innerHTML = '';
    for (let i = 0; i < kelime.length; i++) {
      const kutu = document.createElement('div');
      if (kelime[i] === ' ') {
        kutu.className = 'harf-kutu harf-kutu--bosluk';
        kutu.textContent = ' ';
        harfKutuSatir.appendChild(kutu);
        continue;
      }
      kutu.className = 'harf-kutu';
      const eksikSira = eksikIdxler.indexOf(i);
      if (eksikSira >= 0) {
        if (doldu[eksikSira]) {
          kutu.textContent = kelime[i].toLocaleUpperCase('tr-TR');
          kutu.classList.add('harf-kutu--dogru');
        } else {
          kutu.textContent = '_';
          kutu.classList.add('harf-kutu--bos', 'harf-kutu--drop');
          kutu.dataset.eksikSira = eksikSira;
          kutu.dataset.hedef = normalTR(kelime[i]);
          // Boşluğa tıklama → seçili harfi yerleştir
          kutu.addEventListener('click', () => {
            if (!secilen || koyunKilitli) return;
            const gelen    = normalTR(secilen.dataset.harf);
            const beklenen = kutu.dataset.hedef;
            const sira     = parseInt(kutu.dataset.eksikSira);
            if (gelen === beklenen) {
              doldu[parseInt(kutu.dataset.eksikSira)] = true;
              secilen.style.visibility = 'hidden';
              secilen.classList.remove('harf-btn--secili');
              secilen = null;
              kutuCiz();
              if (doldu.every(Boolean)) {
                sureyiDurdur();
                koyunKilitli = true;
                harfButonSatir.innerHTML = '';
                koyunDogruYap(kelime);
              }
            } else {
              // ❌ Yanlış
              yanlisSay2[sira] = (yanlisSay2[sira] || 0) + 1;
              secilen.classList.add('harf-btn--yanlis');
              secilen.classList.remove('harf-btn--secili');
              koyunCard.className = 'koyun-card wrong-flash';
              const eski = secilen;
              const beklenenIpucu = beklenen;
              secilen = null;
              setTimeout(() => {
                eski.classList.remove('harf-btn--yanlis');
                koyunCard.className = 'koyun-card';
              }, 600);
              if (yanlisSay2[sira] >= 2) {
                setTimeout(() => {
                  harfButonSatir.querySelectorAll('.harf-btn').forEach(b => {
                    if (normalTR(b.dataset.harf) === beklenenIpucu && b.style.visibility !== 'hidden') {
                      b.classList.add('harf-btn--ipucu');
                    }
                  });
                }, 650);
              }
            }
          });
        }
      } else {
        kutu.textContent = kelime[i].toLocaleUpperCase('tr-TR');
      }
      harfKutuSatir.appendChild(kutu);
    }
  }

  kutuCiz();

  // Harf butonları — tıklayınca seçilir, sonra boşluğa tıkla
  const karisik = koyunKaristir(eksikIdxler.map(i => kelime[i]));
  karisik.forEach(harf => {
    const btn = document.createElement('button');
    btn.className    = 'harf-btn';
    btn.textContent  = harf.toLocaleUpperCase('tr-TR');
    btn.dataset.harf = normalTR(harf);
    btn.addEventListener('click', () => {
      if (koyunKilitli || btn.style.visibility === 'hidden') return;
      // Önceki seçimi kaldır
      harfButonSatir.querySelectorAll('.harf-btn--secili')
        .forEach(b => b.classList.remove('harf-btn--secili'));
      if (secilen === btn) { secilen = null; return; } // toggle off
      secilen = btn;
      btn.classList.add('harf-btn--secili');
    });
    harfButonSatir.appendChild(btn);
  });
}

// ═══════════════════════════════════════════════════════════════
// TİP 3: KARIŞIK HARF DİZME
// ═══════════════════════════════════════════════════════════════
function tip3Goster(kelime) {
  harfKutuSatir.innerHTML = '';
  harfButonSatir.innerHTML = '';

  // İlk harf sabit, geri kalanlar karışık sırada seçilecek
  const hedefSira  = [];
  let siradakiIdx  = 1;
  let yanlisSayac3 = 0;

  // Boşlukları baştan otomatik dolu say ve siradakiIdx'i boşlukları atlayacak şekilde ilerlet
  function sonrakiHarfIdx(baslangic) {
    let idx = baslangic;
    while (idx < kelime.length && kelime[idx] === ' ') {
      hedefSira[idx] = true;
      idx++;
    }
    return idx;
  }
  siradakiIdx = sonrakiHarfIdx(siradakiIdx);

  function kutuCiz() {
    harfKutuSatir.innerHTML = '';
    for (let i = 0; i < kelime.length; i++) {
      const kutu = document.createElement('div');
      if (kelime[i] === ' ') {
        kutu.className = 'harf-kutu harf-kutu--bosluk';
        kutu.textContent = ' ';
        harfKutuSatir.appendChild(kutu);
        continue;
      }
      kutu.className = 'harf-kutu';
      if (i === 0 || hedefSira[i]) {
        kutu.textContent = kelime[i].toLocaleUpperCase('tr-TR');
        if (i > 0) kutu.classList.add('harf-kutu--dogru');
      } else {
        kutu.textContent = '_';
        kutu.classList.add('harf-kutu--bos');
        if (i === siradakiIdx) kutu.classList.add('harf-kutu--aktif');
      }
      harfKutuSatir.appendChild(kutu);
    }
  }

  function butonCiz() {
    harfButonSatir.innerHTML = '';
    // Kalan harfler (doldurulanlar ve boşluklar hariç)
    const kalanlar = [];
    for (let i = 1; i < kelime.length; i++) {
      if (!hedefSira[i] && kelime[i] !== ' ') kalanlar.push({ harf: kelime[i], idx: i });
    }
    const karisik = koyunKaristir(kalanlar);
    karisik.forEach(({ harf, idx }) => {
      const btn = document.createElement('button');
      btn.className   = 'harf-btn';
      btn.textContent = harf.toLocaleUpperCase('tr-TR');
      btn.dataset.idx = idx;
      btn.addEventListener('click', () => {
        if (koyunKilitli) return;
        if (idx === siradakiIdx) {
          // ✅ Doğru sıra
          yanlisSayac3 = 0;
          hedefSira[idx] = true;
          siradakiIdx = sonrakiHarfIdx(siradakiIdx + 1);
          kutuCiz();
          if (siradakiIdx >= kelime.length) {
            // Tamamlandı
            sureyiDurdur();
            koyunKilitli = true;
            harfButonSatir.innerHTML = '';
            koyunDogruYap(kelime);
          } else {
            butonCiz();
          }
        } else {
          // ❌ Yanlış sıra
          yanlisSayac3++;
          btn.classList.add('harf-btn--yanlis');
          koyunCard.className = 'koyun-card wrong-flash';
          setTimeout(() => {
            btn.classList.remove('harf-btn--yanlis');
            koyunCard.className = 'koyun-card';
          }, 600);
          if (yanlisSayac3 >= 2) {
            setTimeout(() => {
              harfButonSatir.querySelectorAll('.harf-btn').forEach(b => {
                if (parseInt(b.dataset.idx) === siradakiIdx) {
                  b.classList.add('harf-btn--ipucu');
                }
              });
            }, 650);
          }
        }
      });
      harfButonSatir.appendChild(btn);
    });
  }

  kutuCiz();
  butonCiz();
}

// ═══════════════════════════════════════════════════════════════
// ANA GÖSTER FONKSİYONU
// ═══════════════════════════════════════════════════════════════
function koyunGoster() {
  const kelime = koyunSiralamis[koyunIndex];
  const emoji  = KELIME_EMOJI[kelime] || '❓';
  koyunEmoji.textContent   = emoji;
  koyunHint.style.display  = 'none';
  koyunResult.textContent  = '';
  koyunResult.className    = 'koyun-result';
  koyunScoreEl.textContent = koyunSkor;
  koyunCard.className      = 'koyun-card';
  koyunKilitli             = false;

  const zorluk = koyunZorlukAl();
  sureyiBaslat(zorluk.sure);

  if (zorluk.tip === 1) {
    const eksik = eksikIndexlerSec(kelime, zorluk.eksik);
    tip1Goster(kelime, eksik, zorluk.secenek);
  } else if (zorluk.tip === 2) {
    const eksik = eksikIndexlerSec(kelime, zorluk.eksik);
    tip2Goster(kelime, eksik);
  } else {
    tip3Goster(kelime);
  }
}

// ─── Ses efektleri (offline, Web Audio API) ───────────────────
const _kAudioCtx = window.AudioContext || window.webkitAudioContext;
let _kACtx = null;
function _getKACtx() {
  if (!_kAudioCtx) return null;
  if (!_kACtx || _kACtx.state === 'closed') {
    try { _kACtx = new _kAudioCtx(); } catch(e) { return null; }
  }
  if (_kACtx.state === 'suspended') _kACtx.resume().catch(()=>{});
  return _kACtx;
}
function sesCal(tip) {
  const ctx = _getKACtx();
  if (!ctx) return;
  try {
    if (tip === 'dogru') {
      [[523,0,0.12],[659,0.13,0.22],[784,0.26,0.38]].forEach(([f,s,e]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(f, ctx.currentTime+s);
        g.gain.setValueAtTime(0.25, ctx.currentTime+s);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+e);
        o.start(ctx.currentTime+s); o.stop(ctx.currentTime+e);
      });
    } else if (tip === 'yanlis') {
      [[330,0,0.15],[247,0.16,0.35]].forEach(([f,s,e]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(f, ctx.currentTime+s);
        g.gain.setValueAtTime(0.18, ctx.currentTime+s);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+e);
        o.start(ctx.currentTime+s); o.stop(ctx.currentTime+e);
      });
    }
  } catch(e) {}
}

// ─── Doğru yapıldı → otomatik geçiş ──────────────────────────
function koyunDogruYap(kelime) {
  koyunSkor++;
  totalScore++;
  koyunTurSayac++;
  koyunTurYildiz++;
  koyunScoreEl.textContent = koyunSkor;

  koyunCard.className   = 'koyun-card correct-flash';
  koyunResult.innerHTML = '<span class="yildiz-anim">⭐</span> Harika!';
  koyunResult.className = 'koyun-result dogru';

  sesCal('dogru');
  kontrolRozetlerYildiz();

  // OTOMATİK GEÇİŞ — 1 sn sonra (tur sonu veya sonraki kelime)
  if (koyunTurYildiz >= 5) {
    setTimeout(() => koyunTurSonuGoster(), 1000);
  } else {
    setTimeout(() => koyunSonraki(), 1000);
  }
}

// ─── Tur sonu ekranı ──────────────────────────────────────────
function koyunTurSonuGoster() {
  sureyiDurdur();
  koyunTurYildiz = 0;
  // Mevcut rapor overlay'ini kullan
  reportEmoji.textContent   = '🌟';
  reportTitle.textContent   = 'Tur Tamamlandı!';
  reportSubtitle.textContent= `${koyunSkor} ⭐ kazandın`;
  reportDogru.textContent   = koyunSkor;
  reportYanlis.textContent  = koyunYanlis;
  reportPuan.textContent    = koyunSkor;
  reportHardWords.style.display = 'none';
  reportTimerWrap.style.display = 'none';
  reportBtnRow.innerHTML = '<button class="report-btn primary" id="koyunTurDevam">▶ Devam</button>';
  reportOverlay.classList.add('visible');
  document.getElementById('koyunTurDevam').addEventListener('click', () => {
    reportOverlay.classList.remove('visible');
    koyunSonraki();
  });
}

// ─── Sonraki kelime ───────────────────────────────────────────
function koyunSonraki(sayilsin=true) {
  koyunIndex++;
  if (koyunIndex >= koyunSiralamis.length) {
    koyunSiralamis = koyunKaristir(KOYUN_KELIMELER);
    koyunIndex = 0;
  }
  koyunGoster();
}

// ─── Geç butonu ───────────────────────────────────────────────
koyunBtnSkip.addEventListener('click', () => {
  sureyiDurdur();
  koyunResult.textContent = '⏭ Geçildi';
  koyunResult.className   = 'koyun-result';
  setTimeout(() => koyunSonraki(false), 500);
});

// ─── Geri butonu ──────────────────────────────────────────────
btnKoyunBack.addEventListener('click', () => {
  sureyiDurdur();
  koyunScreen.style.display = 'none';
  menuScreen.style.display  = 'flex';
  menuGoster();
});

// ─── Ghost listeners (eski referanslar için) ──────────────────
koyunBtnStart.addEventListener('click', () => {});

// ─── Menüden başlatma ─────────────────────────────────────────
function kelimeOyunuGoster() {
  menuScreen.style.display    = 'none';
  gameContainer.style.display = 'none';
  koyunScreen.style.display   = 'flex';
  koyunSiralamis = koyunKaristir(KOYUN_KELIMELER);
  koyunIndex     = 0;
  koyunSkor      = 0;
  koyunYanlis    = 0;
  koyunTurSayac  = 0;
  koyunTurYildiz = 0;
  koyunKilitli   = false;
  koyunGoster();
}


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


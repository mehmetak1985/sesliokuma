"use strict";

// ═══════════════════════════════════════════════════════════════
// HİKAYE MODU — v2 (Bağımsız, Offline, Mikrofonsuz)
// Her 2 cümlede bir boşluk doldurma etkileşimi.
// blankWord: null → sadece oku, string → boşluk doldur
// ═══════════════════════════════════════════════════════════════

const HIKAYE_DATA = [

  // ── 1: Mina ve Oyuncak Arabası ────────────────────────────
  {
    baslik: 'Mina ve Oyuncak Arabası',
    cumleler: [
      { text: 'Mina kırmızı oyuncak arabasını aldı.', blankWord: null },
      { text: 'Arabayı yere koydu ve hafifçe itti.', blankWord: 'yere', options: ['yere', 'suya', 'çantaya'], correctIndex: 0 },
      { text: 'Araba hızla ilerledi ve masanın ayağına çarptı.', blankWord: null },
      { text: 'Mina önce şaşırdı, sonra gülmeye başladı.', blankWord: 'şaşırdı', options: ['şaşırdı', 'uyudu', 'kaçtı'], correctIndex: 0 },
      { text: 'Arabasını dikkatli sürmesi gerektiğini anladı.', blankWord: null },
    ]
  },

  // ── 2: Baran ve Yapboz ────────────────────────────────────
  {
    baslik: 'Baran ve Yapboz',
    cumleler: [
      { text: 'Baran yapboz parçalarını masaya yaydı.', blankWord: null },
      { text: 'Önce köşe parçalarını buldu.', blankWord: 'köşe', options: ['köşe', 'renk', 'büyük'], correctIndex: 0 },
      { text: 'Parçaları birleştirirken sabırlı davrandı.', blankWord: null },
      { text: 'Sonunda güzel bir hayvan resmi ortaya çıktı.', blankWord: 'hayvan', options: ['hayvan', 'araba', 'çiçek'], correctIndex: 0 },
      { text: 'Baran başardığı için gurur duydu.', blankWord: null },
    ]
  },

  // ── 3: Henna ve Kediler ───────────────────────────────────
  {
    baslik: 'Henna ve Kediler',
    cumleler: [
      { text: 'Henna bahçeye çıktığında iki küçük kedi çimenlerde oynuyordu.', blankWord: null },
      { text: 'Kediler bir kelebeği kovalamaya başladı.', blankWord: 'kelebeği', options: ['kelebeği', 'topu', 'arabayı'], correctIndex: 0 },
      { text: 'Henna da onların peşinden koştu ama dikkatli yürüdü.', blankWord: null },
      { text: 'Kediler yorulunca gölgede dinlendiler.', blankWord: 'gölgede', options: ['gölgede', 'evde', 'okulda'], correctIndex: 0 },
      { text: 'Henna onları severken mutlu hissetti.', blankWord: null },
    ]
  },

  // ── 4: Mustafa ve Yeni Ayakkabıları ──────────────────────
  {
    baslik: 'Mustafa ve Yeni Ayakkabıları',
    cumleler: [
      { text: 'Mustafa yeni ayakkabılarını giydi.', blankWord: null },
      { text: 'Çimlerde top oynamaya başladı.', blankWord: 'top', options: ['top', 'kite', 'kitap'], correctIndex: 0 },
      { text: 'Koşarken ayakkabılarının çok rahat olduğunu fark etti.', blankWord: null },
      { text: 'Ama çimenler ıslaktı ve biraz kaydı.', blankWord: 'ıslaktı', options: ['ıslaktı', 'sertti', 'karanlıktı'], correctIndex: 0 },
      { text: 'Mustafa dikkatli olması gerektiğini öğrendi.', blankWord: null },
    ]
  },

  // ── 5: Asya ve Yağmur ────────────────────────────────────
  {
    baslik: 'Asya ve Yağmur',
    cumleler: [
      { text: 'Asya camdan dışarı baktı.', blankWord: null },
      { text: 'Yağmur yağıyordu.', blankWord: null },
      { text: 'Şemsiyesini alıp annesiyle dışarı çıktı.', blankWord: 'şemsiyesini', options: ['şemsiyesini', 'çantasını', 'kitabını'], correctIndex: 0 },
      { text: 'Su birikintilerine basmamaya çalıştı ama birine bastı.', blankWord: null },
      { text: 'Ayakkabıları ıslandı.', blankWord: 'ayakkabıları', options: ['ayakkabıları', 'çantası', 'saçları'], correctIndex: 0 },
      { text: 'Asya eve dönünce kuru çorap giydi.', blankWord: null },
    ]
  },

  // ── 6: Yusuf ve Kitap ────────────────────────────────────
  {
    baslik: 'Yusuf ve Kitap',
    cumleler: [
      { text: 'Yusuf kitaplığından bir hikaye kitabı seçti.', blankWord: null },
      { text: 'Kitabı sessizce okumaya başladı.', blankWord: 'sessizce', options: ['sessizce', 'hızlıca', 'koşarak'], correctIndex: 0 },
      { text: 'Anlamadığı bir kelimeyi annesine sordu.', blankWord: null },
      { text: 'Yeni kelimenin anlamını öğrenince hikayeyi daha iyi anladı.', blankWord: 'anlamını', options: ['anlamını', 'resmini', 'rengini'], correctIndex: 0 },
    ]
  },

  // ── 7: Zeynep ve Çiçekler ────────────────────────────────
  {
    baslik: 'Zeynep ve Çiçekler',
    cumleler: [
      { text: 'Zeynep bahçedeki çiçekleri suladı.', blankWord: null },
      { text: 'Bazı çiçeklerin yaprakları solmuştu.', blankWord: 'yaprakları', options: ['yaprakları', 'kökleri', 'renkleri'], correctIndex: 0 },
      { text: 'Daha fazla su verdikten sonra birkaç gün bekledi.', blankWord: null },
      { text: 'Çiçekler yeniden canlandı.', blankWord: 'canlandı', options: ['canlandı', 'soldu', 'büyüdü'], correctIndex: 0 },
      { text: 'Zeynep sabırlı olmanın önemini öğrendi.', blankWord: null },
    ]
  },

  // ── 8: Maysa ve Resim ────────────────────────────────────
  {
    baslik: 'Maysa ve Resim',
    cumleler: [
      { text: 'Maysa resim defterini açtı.', blankWord: null },
      { text: 'Önce güneş çizdi, sonra bir ev yaptı.', blankWord: 'güneş', options: ['güneş', 'araba', 'balık'], correctIndex: 0 },
      { text: 'Boyarken çizgilerin dışına taştı ama pes etmedi.', blankWord: null },
      { text: 'Resmini tamamladığında çok güzel görünüyordu.', blankWord: 'güzel', options: ['güzel', 'küçük', 'karanlık'], correctIndex: 0 },
    ]
  },

  // ── 9: Mehmet ve Uçurtma ─────────────────────────────────
  {
    baslik: 'Mehmet ve Uçurtma',
    cumleler: [
      { text: 'Mehmet uçurtmasını gökyüzüne bıraktı.', blankWord: null },
      { text: 'Rüzgar hafif esiyordu.', blankWord: 'hafif', options: ['hafif', 'sert', 'soğuk'], correctIndex: 0 },
      { text: 'Uçurtma bazen düşer gibi oldu ama Mehmet ipi sıkı tuttu.', blankWord: null },
      { text: 'Bir süre sonra uçurtma daha yükseğe çıktı.', blankWord: 'yükseğe', options: ['yükseğe', 'aşağıya', 'yana'], correctIndex: 0 },
    ]
  },

  // ── 10: Yağmur ve Kütüphane ──────────────────────────────
  {
    baslik: 'Yağmur ve Kütüphane',
    cumleler: [
      { text: 'Yağmur kütüphaneye gitti.', blankWord: null },
      { text: 'Sessiz olması gerektiğini biliyordu.', blankWord: 'sessiz', options: ['sessiz', 'hızlı', 'güçlü'], correctIndex: 0 },
      { text: 'Kitabını dikkatle seçti ve yerine oturdu.', blankWord: null },
      { text: 'Çevresindekileri rahatsız etmeden okudu.', blankWord: 'rahatsız', options: ['rahatsız', 'mutlu', 'yorgun'], correctIndex: 0 },
    ]
  },

  // ── 11: Çiçek ve Dostluk ─────────────────────────────────
  {
    baslik: 'Çiçek ve Dostluk',
    cumleler: [
      { text: 'Çiçek parkta tek başına oturan bir çocuk gördü.', blankWord: null },
      { text: 'Yanına gidip selam verdi.', blankWord: 'selam', options: ['selam', 'kitap', 'top'], correctIndex: 0 },
      { text: 'Birlikte salıncağa bindiler.', blankWord: null },
      { text: 'O gün yeni bir arkadaş edindi.', blankWord: 'arkadaş', options: ['arkadaş', 'kitap', 'oyuncak'], correctIndex: 0 },
    ]
  },

  // ── 12: Emir ve Kayıp Kalem ──────────────────────────────
  {
    baslik: 'Emir ve Kayıp Kalem',
    cumleler: [
      { text: 'Emir ödev yapmak için masaya oturdu.', blankWord: null },
      { text: 'Kalemini bulamadı.', blankWord: 'kalemini', options: ['kalemini', 'kitabını', 'çantasını'], correctIndex: 0 },
      { text: 'Çantasını ve masasını aradı ama kalem yoktu.', blankWord: null },
      { text: 'Sonra dün parkta ders çalıştığını hatırladı.', blankWord: 'parkta', options: ['parkta', 'okulda', 'evde'], correctIndex: 0 },
      { text: 'Çantasının küçük cebine baktı ve kalemini buldu.', blankWord: null },
      { text: 'Emir eşyalarını düzenli koyması gerektiğini anladı.', blankWord: 'düzenli', options: ['düzenli', 'hızlı', 'güzel'], correctIndex: 0 },
    ]
  },

  // ── 13: Beyaz ve Paylaşmak ───────────────────────────────
  {
    baslik: 'Beyaz ve Paylaşmak',
    cumleler: [
      { text: 'Beyaz parkta bisküviyle oturuyordu.', blankWord: null },
      { text: 'Yanındaki çocuk üzgün görünüyordu çünkü yiyeceği yoktu.', blankWord: 'üzgün', options: ['üzgün', 'mutlu', 'uykulu'], correctIndex: 0 },
      { text: 'Beyaz bisküvisini ikiye böldü ve yarısını verdi.', blankWord: null },
      { text: 'Çocuk gülümsedi.', blankWord: null },
      { text: 'Beyaz paylaşmanın insanı mutlu ettiğini fark etti.', blankWord: 'paylaşmanın', options: ['paylaşmanın', 'koşmanın', 'uyumanın'], correctIndex: 0 },
    ]
  },

  // ── 14: Kaan ve Zamanında Uyanmak ────────────────────────
  {
    baslik: 'Kaan ve Zamanında Uyanmak',
    cumleler: [
      { text: 'Kaan sabah alarmı duydu ama kapattı.', blankWord: null },
      { text: 'Biraz daha uyumak istedi.', blankWord: 'uyumak', options: ['uyumak', 'oynamak', 'yemek'], correctIndex: 0 },
      { text: 'Uyandığında okula geç kaldığını fark etti.', blankWord: null },
      { text: 'Aceleyle hazırlandı ama servisi kaçırdı.', blankWord: 'servisi', options: ['servisi', 'kitabı', 'alarmı'], correctIndex: 0 },
      { text: 'Ertesi gün alarm çalınca hemen kalktı.', blankWord: null },
    ]
  },

  // ── 15: Elvan ve Bitki ───────────────────────────────────
  {
    baslik: 'Elvan ve Bitki',
    cumleler: [
      { text: 'Elvan küçük bir saksıya tohum ekti.', blankWord: null },
      { text: 'Her gün düzenli olarak suladı.', blankWord: 'düzenli', options: ['düzenli', 'hızlı', 'az'], correctIndex: 0 },
      { text: 'İlk gün hiçbir şey çıkmadı.', blankWord: null },
      { text: 'Elvan biraz üzüldü ama beklemeye devam etti.', blankWord: 'üzüldü', options: ['üzüldü', 'sevindi', 'uyudu'], correctIndex: 0 },
      { text: 'Birkaç gün sonra küçük bir filiz gördü.', blankWord: null },
      { text: 'Sabırlı olmanın önemli olduğunu öğrendi.', blankWord: 'sabırlı', options: ['sabırlı', 'hızlı', 'güçlü'], correctIndex: 0 },
    ]
  },

  // ── 16: Berk ve Kırılan Bardak ───────────────────────────
  {
    baslik: 'Berk ve Kırılan Bardak',
    cumleler: [
      { text: 'Berk mutfakta su almak istedi.', blankWord: null },
      { text: 'Bardağı hızlıca aldı ve elinden düşürdü.', blankWord: 'bardağı', options: ['bardağı', 'kitabı', 'topu'], correctIndex: 0 },
      { text: 'Bardak kırıldı.', blankWord: null },
      { text: 'Berk korktu ama annesine gerçeği söyledi.', blankWord: 'gerçeği', options: ['gerçeği', 'hikayeyi', 'şiiri'], correctIndex: 0 },
      { text: 'Annesi dikkatli olması gerektiğini anlattı.', blankWord: null },
      { text: 'Berk bir dahaki sefere yavaş davranmaya karar verdi.', blankWord: 'yavaş', options: ['yavaş', 'hızlı', 'güçlü'], correctIndex: 0 },
    ]
  },

  // ── 17: Defne ve Grup Çalışması ──────────────────────────
  {
    baslik: 'Defne ve Grup Çalışması',
    cumleler: [
      { text: 'Defne okulda grup çalışması yaptı.', blankWord: null },
      { text: 'Herkes bir görev aldı.', blankWord: 'görev', options: ['görev', 'kitap', 'ödül'], correctIndex: 0 },
      { text: 'Defne afişi boyadı.', blankWord: null },
      { text: 'Arkadaşı yazıları yazdı.', blankWord: 'yazıları', options: ['yazıları', 'resimleri', 'soruları'], correctIndex: 0 },
      { text: 'Birlikte çalışınca ödevleri daha güzel oldu.', blankWord: null },
      { text: 'Öğretmenleri onları tebrik etti.', blankWord: 'tebrik', options: ['tebrik', 'uyar', 'çağır'], correctIndex: 0 },
    ]
  },

  // ── 18: Aras ve Cesaret ──────────────────────────────────
  {
    baslik: 'Aras ve Cesaret',
    cumleler: [
      { text: 'Aras sınıfta şiir okumaktan çekiniyordu.', blankWord: null },
      { text: 'Sırası geldiğinde kalbi hızlı attı.', blankWord: 'kalbi', options: ['kalbi', 'sesi', 'ayağı'], correctIndex: 0 },
      { text: 'Derin bir nefes aldı ve okumaya başladı.', blankWord: null },
      { text: 'Arkadaşları onu dikkatle dinledi.', blankWord: 'dikkatle', options: ['dikkatle', 'hızlıca', 'gülümseyerek'], correctIndex: 0 },
      { text: 'Şiiri bitirdiğinde alkış aldı.', blankWord: null },
      { text: 'Aras cesur davrandığı için gurur duydu.', blankWord: 'cesur', options: ['cesur', 'hızlı', 'sessiz'], correctIndex: 0 },
    ]
  },

  // ── 19: İlayda ve Doğru Karar ────────────────────────────
  {
    baslik: 'İlayda ve Doğru Karar',
    cumleler: [
      { text: 'İlayda parkta oynarken yerde bir cüzdan buldu.', blankWord: null },
      { text: 'İçinde para ve kimlik vardı.', blankWord: 'kimlik', options: ['kimlik', 'kalem', 'oyuncak'], correctIndex: 0 },
      { text: 'Parayı almak istemedi.', blankWord: null },
      { text: 'En yakın görevliye götürdü.', blankWord: 'görevliye', options: ['görevliye', 'arkadaşına', 'öğretmenine'], correctIndex: 0 },
      { text: 'Cüzdanın sahibi gelip teşekkür etti.', blankWord: null },
      { text: 'İlayda doğru olanı yaptığı için mutlu oldu.', blankWord: 'doğru', options: ['doğru', 'hızlı', 'güzel'], correctIndex: 0 },
    ]
  },

  // ── 20: Onur ve Sabır ────────────────────────────────────
  {
    baslik: 'Onur ve Sabır',
    cumleler: [
      { text: 'Onur yeni bir model uçak yapmak istedi.', blankWord: null },
      { text: 'Parçaları birleştirirken zorlandı.', blankWord: 'zorlandı', options: ['zorlandı', 'eğlendi', 'uyudu'], correctIndex: 0 },
      { text: 'Birkaç kez hata yaptı.', blankWord: null },
      { text: 'Sinirlenmek yerine talimatlara tekrar baktı.', blankWord: 'talimatlara', options: ['talimatlara', 'pencereye', 'arkadaşına'], correctIndex: 0 },
      { text: 'Yavaşça devam etti.', blankWord: null },
      { text: 'Sonunda uçağı tamamladı.', blankWord: 'uçağı', options: ['uçağı', 'resmi', 'kitabı'], correctIndex: 0 },
      { text: 'Onur sabırlı olunca başarabildiğini anladı.', blankWord: null },
    ]
  },

  // ── 21: Henna ve Asya ────────────────────────────────────
  {
    baslik: 'Henna ve Asya',
    cumleler: [
      { text: 'Henna ve Asya sabah uyandı.', blankWord: null },
      { text: 'Birlikte dışarı çıktılar.', blankWord: null },
      { text: 'Kedilerini sevip bir süre izlediler.', blankWord: 'kedilerini', options: ['kedilerini', 'kuşlarını', 'balıklarını'], correctIndex: 0 },
      { text: 'Sonra saklambaç oynadılar ve çok eğlendiler.', blankWord: null },
      { text: 'Eve dönünce ellerini yıkadılar.', blankWord: 'ellerini', options: ['ellerini', 'yüzlerini', 'ayaklarını'], correctIndex: 0 },
      { text: 'Birlikte biraz dinlendiler.', blankWord: null },
      { text: 'Akşam yemek yediler ve dişlerini fırçaladılar.', blankWord: 'dişlerini', options: ['dişlerini', 'saçlarını', 'ellerini'], correctIndex: 0 },
      { text: 'Gece olunca mutlu bir günün ardından uyudular.', blankWord: null },
    ]
  },

];

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let hk = {
  aktif:       false,
  hikayeIdx:   0,
  cumleIdx:    0,
  skor:        0,
  bekliyor:    false,  // etkileşim bekleniyor mu
};

// ═══════════════════════════════════════════════════════════════
// EKRAN — dinamik olarak oluşturulur, body'e eklenir
// ═══════════════════════════════════════════════════════════════
let hkEkran = null;

function hkEkranOlustur() {
  if (hkEkran) return;
  hkEkran = document.createElement('div');
  hkEkran.id = 'hikayeEkran';
  hkEkran.style.cssText = `
    display:none; position:fixed; inset:0; z-index:1000;
    background: linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
    flex-direction:column; align-items:center; justify-content:flex-start;
    padding: 0; overflow:hidden; font-family:'Baloo 2',sans-serif;
  `;
  hkEkran.innerHTML = `
    <div id="hkTopBar" style="
      width:100%; display:flex; align-items:center; justify-content:space-between;
      padding:12px 16px; box-sizing:border-box;
      background:rgba(255,255,255,0.06); backdrop-filter:blur(4px);
    ">
      <button id="hkGeriBtn" style="
        background:rgba(255,255,255,0.15); border:none; color:#fff;
        font-size:1rem; padding:8px 16px; border-radius:20px; cursor:pointer;
        font-family:'Baloo 2',sans-serif; font-weight:600;
      ">← Menü</button>

      <div id="hkBaslik" style="
        color:#fff; font-size:1rem; font-weight:700;
        text-align:center; flex:1; margin:0 10px;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      ">Hikaye</div>

      <div id="hkSkorBadge" style="
        background:rgba(255,215,0,0.2); border-radius:20px;
        padding:6px 14px; color:#ffd700; font-weight:800; font-size:1rem;
      ">⭐ 0</div>
    </div>

    <!-- İlerleme çubuğu -->
    <div style="width:100%; padding:0 16px; box-sizing:border-box; margin-top:8px;">
      <div style="background:rgba(255,255,255,0.1); border-radius:8px; height:6px; overflow:hidden;">
        <div id="hkProgressBar" style="height:100%; background:#a78bfa; border-radius:8px; width:0%; transition:width 0.4s;"></div>
      </div>
      <div id="hkProgressText" style="color:rgba(255,255,255,0.5); font-size:0.75rem; text-align:right; margin-top:3px;">1 / 1</div>
    </div>

    <!-- Cümle kartı -->
    <div id="hkCumleKart" style="
      background:rgba(255,255,255,0.08); border-radius:20px;
      margin:16px; padding:24px 20px; width:calc(100% - 32px);
      box-sizing:border-box; min-height:100px;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      border: 1.5px solid rgba(255,255,255,0.12);
    ">
      <div id="hkCumleText" style="
        color:#fff; font-size:1.35rem; font-weight:700;
        line-height:1.7; text-align:center; letter-spacing:0.02em;
      "></div>
    </div>

    <!-- Seçenek butonları (etkileşimli cümleler için) -->
    <div id="hkSecenekler" style="
      display:none; flex-direction:column; gap:10px;
      width:calc(100% - 32px); margin:0 16px;
    "></div>

    <!-- Geri bildirim -->
    <div id="hkGeriBildirim" style="
      min-height:36px; text-align:center; font-size:1rem;
      font-weight:700; color:#4ade80; margin:10px 16px 0;
      display:flex; align-items:center; justify-content:center; gap:6px;
    "></div>

    <!-- İleri butonu -->
    <button id="hkIleriBtn" style="
      margin-top:auto; margin-bottom:24px;
      background: linear-gradient(135deg,#7c3aed,#a855f7);
      color:#fff; border:none; border-radius:24px;
      font-size:1.15rem; font-weight:800; padding:16px 48px;
      cursor:pointer; font-family:'Baloo 2',sans-serif;
      box-shadow:0 4px 20px rgba(124,58,237,0.5);
      display:none;
    ">İleri ▶</button>
  `;
  document.body.appendChild(hkEkran);

  document.getElementById('hkGeriBtn').addEventListener('click', hkKapat);
  document.getElementById('hkIleriBtn').addEventListener('click', hkIleri);
}

// ═══════════════════════════════════════════════════════════════
// AÇMA / KAPAMA
// ═══════════════════════════════════════════════════════════════
function hkAc(hikayeIdx) {
  hkEkranOlustur();
  hk.hikayeIdx = hikayeIdx || 0;
  hk.cumleIdx  = 0;
  hk.skor      = 0;
  hk.bekliyor  = false;
  hk.aktif     = true;
  hkEkran.style.display = 'flex';
  hkCumleGoster();
}

function hkKapat() {
  if (hkEkran) hkEkran.style.display = 'none';
  hk.aktif = false;
  // Menüyü göster (app.js'deki menuGoster fonksiyonu)
  if (typeof menuGoster === 'function') {
    menuGoster();
  } else {
    const ms = document.getElementById('menuScreen');
    if (ms) ms.style.display = 'flex';
  }
  // Puan güncelle
  if (typeof totalScore !== 'undefined') totalScore += hk.skor;
  const mst = document.getElementById('menuTotalScore');
  if (mst && typeof totalScore !== 'undefined') mst.textContent = totalScore;
}

// ═══════════════════════════════════════════════════════════════
// CÜMLE GÖSTER
// ═══════════════════════════════════════════════════════════════
function hkCumleGoster() {
  const hikaye = HIKAYE_DATA[hk.hikayeIdx];
  const cumle  = hikaye.cumleler[hk.cumleIdx];
  const toplam = hikaye.cumleler.length;

  // Başlık
  document.getElementById('hkBaslik').textContent = '📖 ' + hikaye.baslik;

  // İlerleme
  const yuzde = Math.round((hk.cumleIdx / toplam) * 100);
  document.getElementById('hkProgressBar').style.width = yuzde + '%';
  document.getElementById('hkProgressText').textContent = (hk.cumleIdx + 1) + ' / ' + toplam;

  // Puan
  document.getElementById('hkSkorBadge').textContent = '⭐ ' + hk.skor;

  // Geri bildirim temizle
  document.getElementById('hkGeriBildirim').textContent = '';

  // Seçenekler gizle
  const secDiv = document.getElementById('hkSecenekler');
  secDiv.style.display = 'none';
  secDiv.innerHTML = '';

  // Kart arka plan — boşluklu cümle sarımsı, normal beyaz
  const kart = document.getElementById('hkCumleKart');
  kart.style.background = cumle.blankWord
    ? 'rgba(255,235,150,0.10)'
    : 'rgba(255,255,255,0.08)';
  kart.style.borderColor = cumle.blankWord
    ? 'rgba(255,215,0,0.3)'
    : 'rgba(255,255,255,0.12)';

  // Cümle metni
  const textEl = document.getElementById('hkCumleText');
  if (cumle.blankWord) {
    // Kelimeyi boşlukla değiştir
    const parca = cumle.text.replace(cumle.blankWord, '<span style="display:inline-block;min-width:80px;border-bottom:3px solid #ffd700;color:transparent;background:rgba(255,215,0,0.15);border-radius:6px;padding:0 8px;">____</span>');
    textEl.innerHTML = parca;
  } else {
    textEl.textContent = cumle.text;
  }

  hk.bekliyor = false;

  if (cumle.blankWord) {
    // Etkileşimli — seçenekleri göster, İleri gizle
    hkSecenekleriGoster(cumle);
    document.getElementById('hkIleriBtn').style.display = 'none';
    hk.bekliyor = true;
  } else {
    // Sadece oku — İleri göster
    document.getElementById('hkIleriBtn').style.display = 'block';
  }
}

// ═══════════════════════════════════════════════════════════════
// SEÇENEKLER
// ═══════════════════════════════════════════════════════════════
function hkSecenekleriGoster(cumle) {
  const secDiv = document.getElementById('hkSecenekler');
  secDiv.style.display = 'flex';
  secDiv.innerHTML = '';

  cumle.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.cssText = `
      background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.2);
      color: #fff; font-size: 1.1rem; font-weight: 700; padding: 14px 20px;
      border-radius: 16px; cursor: pointer; font-family: 'Baloo 2', sans-serif;
      transition: all 0.2s; text-align: center;
    `;
    btn.addEventListener('click', () => hkSecenekTikla(idx, cumle, btn, secDiv));
    secDiv.appendChild(btn);
  });
}

function hkSecenekTikla(idx, cumle, btn, secDiv) {
  if (!hk.bekliyor) return;

  const dogru = idx === cumle.correctIndex;
  const gbEl  = document.getElementById('hkGeriBildirim');

  if (dogru) {
    hk.bekliyor = false;
    hk.skor++;
    document.getElementById('hkSkorBadge').textContent = '⭐ ' + hk.skor;

    // Doğru butonu yeşil yap
    btn.style.background = 'rgba(74,222,128,0.25)';
    btn.style.borderColor = '#4ade80';
    btn.style.color = '#4ade80';

    // Cümleyi tamamla — boşluğu doldur
    const textEl = document.getElementById('hkCumleText');
    textEl.innerHTML = document.getElementById('hkCumleKart').querySelector('span')
      ? document.getElementById('hkCumleText').innerHTML.replace(
          /<span[^>]*>____<\/span>/,
          `<span style="color:#ffd700;font-weight:900;">${cumle.blankWord}</span>`
        )
      : document.getElementById('hkCumleText').textContent;

    // Yıldız animasyonu
    gbEl.innerHTML = '<span style="font-size:1.5rem;">⭐</span> Harika!';

    // Tüm butonları kapat
    secDiv.querySelectorAll('button').forEach(b => b.disabled = true);

    // İleri butonunu göster
    setTimeout(() => {
      document.getElementById('hkIleriBtn').style.display = 'block';
    }, 600);

  } else {
    // Yanlış — kırmızımsı flash, mesaj
    btn.style.background = 'rgba(239,68,68,0.2)';
    btn.style.borderColor = '#ef4444';
    setTimeout(() => {
      btn.style.background = 'rgba(255,255,255,0.12)';
      btn.style.borderColor = 'rgba(255,255,255,0.2)';
    }, 700);
    gbEl.innerHTML = '🔄 Tekrar deneyelim!';
    gbEl.style.color = '#fb923c';
    setTimeout(() => { gbEl.textContent = ''; gbEl.style.color = '#4ade80'; }, 1200);
  }
}

// ═══════════════════════════════════════════════════════════════
// İLERİ
// ═══════════════════════════════════════════════════════════════
function hkIleri() {
  const hikaye = HIKAYE_DATA[hk.hikayeIdx];
  hk.cumleIdx++;

  if (hk.cumleIdx >= hikaye.cumleler.length) {
    hkBitti();
  } else {
    hkCumleGoster();
  }
}

// ═══════════════════════════════════════════════════════════════
// BİTİŞ EKRANI
// ═══════════════════════════════════════════════════════════════
function hkBitti() {
  const kart   = document.getElementById('hkCumleKart');
  const secDiv = document.getElementById('hkSecenekler');
  const gbEl   = document.getElementById('hkGeriBildirim');
  const ileri  = document.getElementById('hkIleriBtn');
  const progText = document.getElementById('hkProgressText');

  document.getElementById('hkProgressBar').style.width = '100%';
  progText.textContent = 'Tamamlandı!';

  secDiv.style.display = 'none';
  gbEl.textContent = '';

  const emoji = hk.skor >= 5 ? '🏆' : hk.skor >= 3 ? '⭐' : '💪';

  kart.style.background = 'rgba(167,139,250,0.15)';
  kart.style.borderColor = 'rgba(167,139,250,0.4)';
  document.getElementById('hkCumleText').innerHTML = `
    <div style="font-size:3rem;margin-bottom:12px;">${emoji}</div>
    <div style="font-size:1.4rem;color:#a78bfa;font-weight:800;">Harika Okudun!</div>
    <div style="font-size:1rem;color:rgba(255,255,255,0.7);margin-top:8px;">
      ${HIKAYE_DATA[hk.hikayeIdx].baslik}
    </div>
    <div style="font-size:1.6rem;color:#ffd700;font-weight:900;margin-top:12px;">
      ⭐ ${hk.skor} puan kazandın!
    </div>
  `;

  ileri.textContent = '▶ Menüye Dön';
  ileri.style.display = 'block';
  ileri.onclick = hkKapat;
}

// ═══════════════════════════════════════════════════════════════
// MENÜ ENTEGRASYONU — app.js'deki hikaye butonunu devral
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
  // Menüden "Hikaye" kartına tıklandığında kendi ekranımızı aç
  const hikayeBtn = document.querySelector('[data-mod="hikaye"]');
  if (hikayeBtn) {
    // Mevcut listener'ların üstüne yeni bir capture listener ekle
    hikayeBtn.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      // Menü ekranını gizle
      const ms = document.getElementById('menuScreen');
      if (ms) ms.style.display = 'none';
      const gc = document.getElementById('gameContainer');
      if (gc) gc.style.display = 'none';
      hkAc(0);
    }, true); // capture: true → app.js'den önce çalışır
  }

  // Kart alanı tıklaması için de aynısı
  const hikayeKart = document.getElementById('menuCardHikaye');
  if (hikayeKart) {
    hikayeKart.addEventListener('click', function (e) {
      if (e.target.classList.contains('menu-card-btn')) return;
      e.stopImmediatePropagation();
      const ms = document.getElementById('menuScreen');
      if (ms) ms.style.display = 'none';
      hkAc(0);
    }, true);
  }
});

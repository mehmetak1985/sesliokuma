"use strict";

// ═══════════════════════════════════════════════════════════════
// HİKAYE MODU — v2
// blankWord: null  → sadece oku, İleri ile geç
// blankWord: 'kelime' → boşluk doldur, doğru cevap verilmeden geçilmez
// ═══════════════════════════════════════════════════════════════

const HIKAYE_DATA = [

  {
    baslik: 'Mina ve Oyuncak Arabası',
    cumleler: [
      { text: 'Mina kırmızı oyuncak arabasını aldı.', blankWord: null },
      { text: 'Arabayı yere koydu ve hafifçe itti.', blankWord: 'Arabayı', options: ['Arabayı','Kalemi','Defteri'], correctIndex: 0 },
      { text: 'Araba hızla ilerledi ve masanın ayağına çarptı.', blankWord: null },
      { text: 'Mina önce şaşırdı, sonra gülmeye başladı.', blankWord: 'gülmeye', options: ['gülmeye','ağlamaya','kaçmaya'], correctIndex: 0 },
      { text: 'Arabasını dikkatli sürmesi gerektiğini anladı.', blankWord: null },
    ]
  },

  {
    baslik: 'Baran ve Yapboz',
    cumleler: [
      { text: 'Baran yapboz parçalarını masaya yaydı.', blankWord: null },
      { text: 'Önce köşe parçalarını buldu.', blankWord: 'köşe', options: ['köşe','renkli','küçük'], correctIndex: 0 },
      { text: 'Parçaları birleştirirken sabırlı davrandı.', blankWord: null },
      { text: 'Sonunda güzel bir hayvan resmi ortaya çıktı.', blankWord: 'hayvan', options: ['hayvan','orman','şehir'], correctIndex: 0 },
      { text: 'Baran başardığı için gurur duydu.', blankWord: null },
    ]
  },

  {
    baslik: 'Henna ve Kediler',
    cumleler: [
      { text: 'Henna bahçeye çıktığında iki küçük kedi çimenlerde oynuyordu.', blankWord: null },
      { text: 'Kediler bir kelebeği kovalamaya başladı.', blankWord: 'kelebeği', options: ['kelebeği','topu','yaprağı'], correctIndex: 0 },
      { text: 'Henna da onların peşinden koştu ama dikkatli yürüdü.', blankWord: null },
      { text: 'Kediler yorulunca gölgede dinlendiler.', blankWord: 'gölgede', options: ['gölgede','yolda','evde'], correctIndex: 0 },
      { text: 'Henna onları severken mutlu hissetti.', blankWord: null },
    ]
  },

  {
    baslik: 'Mustafa ve Yeni Ayakkabıları',
    cumleler: [
      { text: 'Mustafa yeni ayakkabılarını giydi.', blankWord: null },
      { text: 'Çimlerde top oynamaya başladı.', blankWord: 'top', options: ['top','ip','kitap'], correctIndex: 0 },
      { text: 'Koşarken ayakkabılarının çok rahat olduğunu fark etti.', blankWord: null },
      { text: 'Ama çimenler ıslaktı ve biraz kaydı.', blankWord: 'ıslaktı', options: ['ıslaktı','kuruydu','temizdi'], correctIndex: 0 },
      { text: 'Mustafa dikkatli olması gerektiğini öğrendi.', blankWord: null },
    ]
  },

  {
    baslik: 'Asya ve Yağmur',
    cumleler: [
      { text: 'Asya camdan dışarı baktı.', blankWord: null },
      { text: 'Yağmur yağıyordu.', blankWord: 'Yağmur', options: ['Yağmur','Güneş','Rüzgar'], correctIndex: 0 },
      { text: 'Şemsiyesini alıp annesiyle dışarı çıktı.', blankWord: null },
      { text: 'Ayakkabıları ıslandı.', blankWord: 'ıslandı', options: ['ıslandı','kurudu','yandı'], correctIndex: 0 },
      { text: 'Asya eve dönünce kuru çorap giydi.', blankWord: null },
    ]
  },

  {
    baslik: 'Yusuf ve Kitap',
    cumleler: [
      { text: 'Yusuf kitaplığından bir hikaye kitabı seçti.', blankWord: null },
      { text: 'Kitabı sessizce okumaya başladı.', blankWord: 'sessizce', options: ['sessizce','hızlıca','yüksek sesle'], correctIndex: 0 },
      { text: 'Anlamadığı bir kelimeyi annesine sordu.', blankWord: null },
      { text: 'Yeni kelimenin anlamını öğrenince hikayeyi daha iyi anladı.', blankWord: 'anladı', options: ['anladı','unuttu','kapattı'], correctIndex: 0 },
    ]
  },

  {
    baslik: 'Zeynep ve Çiçekler',
    cumleler: [
      { text: 'Zeynep bahçedeki çiçekleri suladı.', blankWord: null },
      { text: 'Bazı çiçeklerin yaprakları solmuştu.', blankWord: 'solmuştu', options: ['solmuştu','açmıştı','kopmuştu'], correctIndex: 0 },
      { text: 'Daha fazla su verdikten sonra birkaç gün bekledi.', blankWord: null },
      { text: 'Çiçekler yeniden canlandı.', blankWord: 'canlandı', options: ['canlandı','kurudu','düştü'], correctIndex: 0 },
      { text: 'Zeynep sabırlı olmanın önemini öğrendi.', blankWord: null },
    ]
  },

  {
    baslik: 'Maysa ve Resim',
    cumleler: [
      { text: 'Maysa resim defterini açtı.', blankWord: null },
      { text: 'Önce güneş çizdi, sonra bir ev yaptı.', blankWord: 'güneş', options: ['güneş','ağaç','balık'], correctIndex: 0 },
      { text: 'Boyarken çizgilerin dışına taştı ama pes etmedi.', blankWord: null },
      { text: 'Resmini tamamladığında çok güzel görünüyordu.', blankWord: 'güzel', options: ['güzel','karanlık','küçük'], correctIndex: 0 },
    ]
  },

  {
    baslik: 'Mehmet ve Uçurtma',
    cumleler: [
      { text: 'Mehmet uçurtmasını gökyüzüne bıraktı.', blankWord: null },
      { text: 'Rüzgar hafif esiyordu.', blankWord: 'Rüzgar', options: ['Rüzgar','Yağmur','Kar'], correctIndex: 0 },
      { text: 'Uçurtma bazen düşer gibi oldu ama Mehmet ipi sıkı tuttu.', blankWord: null },
      { text: 'Bir süre sonra uçurtma daha yükseğe çıktı.', blankWord: 'yükseğe', options: ['yükseğe','aşağıya','yana'], correctIndex: 0 },
    ]
  },

  {
    baslik: 'Yağmur ve Kütüphane',
    cumleler: [
      { text: 'Yağmur kütüphaneye gitti.', blankWord: null },
      { text: 'Sessiz olması gerektiğini biliyordu.', blankWord: 'Sessiz', options: ['Sessiz','Hızlı','Mutlu'], correctIndex: 0 },
      { text: 'Kitabını dikkatle seçti ve yerine oturdu.', blankWord: null },
      { text: 'Çevresindekileri rahatsız etmeden okudu.', blankWord: 'okudu', options: ['okudu','koştu','uyudu'], correctIndex: 0 },
    ]
  },

  {
    baslik: 'Çiçek ve Dostluk',
    cumleler: [
      { text: 'Çiçek parkta tek başına oturan bir çocuk gördü.', blankWord: null },
      { text: 'Yanına gidip selam verdi.', blankWord: 'selam', options: ['selam','taş','oyuncak'], correctIndex: 0 },
      { text: 'Birlikte salıncağa bindiler.', blankWord: null },
      { text: 'O gün yeni bir arkadaş edindi.', blankWord: 'arkadaş', options: ['arkadaş','kalem','çiçek'], correctIndex: 0 },
    ]
  },

  {
    baslik: 'Emir ve Kayıp Kalem',
    cumleler: [
      { text: 'Emir ödev yapmak için masaya oturdu.', blankWord: null },
      { text: 'Kalemini bulamadı.', blankWord: 'Kalemini', options: ['Kalemini','Defterini','Silgisini'], correctIndex: 0 },
      { text: 'Çantasını ve masasını aradı ama kalem yoktu.', blankWord: null },
      { text: 'Çantasının küçük cebine baktı ve kalemini buldu.', blankWord: 'buldu', options: ['buldu','attı','kaybetti'], correctIndex: 0 },
      { text: 'Emir eşyalarını düzenli koyması gerektiğini anladı.', blankWord: null },
    ]
  },

  {
    baslik: 'Beyaz ve Paylaşmak',
    cumleler: [
      { text: 'Beyaz parkta bisküviyle oturuyordu.', blankWord: null },
      { text: 'Yanındaki çocuk üzgün görünüyordu çünkü yiyeceği yoktu.', blankWord: 'üzgün', options: ['üzgün','mutlu','hızlı'], correctIndex: 0 },
      { text: 'Beyaz bisküvisini ikiye böldü ve yarısını verdi.', blankWord: null },
      { text: 'Çocuk gülümsedi.', blankWord: 'gülümsedi', options: ['gülümsedi','ağladı','kaçtı'], correctIndex: 0 },
      { text: 'Beyaz paylaşmanın insanı mutlu ettiğini fark etti.', blankWord: null },
    ]
  },

  {
    baslik: 'Kaan ve Zamanında Uyanmak',
    cumleler: [
      { text: 'Kaan sabah alarmı duydu ama kapattı.', blankWord: null },
      { text: 'Biraz daha uyumak istedi.', blankWord: 'uyumak', options: ['uyumak','koşmak','yazmak'], correctIndex: 0 },
      { text: 'Uyandığında okula geç kaldığını fark etti.', blankWord: null },
      { text: 'Aceleyle hazırlandı ama servisi kaçırdı.', blankWord: 'kaçırdı', options: ['kaçırdı','yakaladı','bekledi'], correctIndex: 0 },
      { text: 'Ertesi gün alarm çalınca hemen kalktı.', blankWord: null },
    ]
  },

  {
    baslik: 'Elvan ve Bitki',
    cumleler: [
      { text: 'Elvan küçük bir saksıya tohum ekti.', blankWord: null },
      { text: 'Her gün düzenli olarak suladı.', blankWord: 'suladı', options: ['suladı','kesti','attı'], correctIndex: 0 },
      { text: 'İlk gün hiçbir şey çıkmadı.', blankWord: null },
      { text: 'Birkaç gün sonra küçük bir filiz gördü.', blankWord: 'filiz', options: ['filiz','taş','bulut'], correctIndex: 0 },
      { text: 'Sabırlı olmanın önemli olduğunu öğrendi.', blankWord: null },
    ]
  },

  {
    baslik: 'Berk ve Kırılan Bardak',
    cumleler: [
      { text: 'Berk mutfakta su almak istedi.', blankWord: null },
      { text: 'Bardağı hızlıca aldı ve elinden düşürdü.', blankWord: 'düşürdü', options: ['düşürdü','tuttu','sakladı'], correctIndex: 0 },
      { text: 'Bardak kırıldı.', blankWord: null },
      { text: 'Berk korktu ama annesine gerçeği söyledi.', blankWord: 'gerçeği', options: ['gerçeği','yalanı','hikayeyi'], correctIndex: 0 },
      { text: 'Berk bir dahaki sefere yavaş davranmaya karar verdi.', blankWord: null },
    ]
  },

  {
    baslik: 'Defne ve Grup Çalışması',
    cumleler: [
      { text: 'Defne okulda grup çalışması yaptı.', blankWord: null },
      { text: 'Herkes bir görev aldı.', blankWord: 'görev', options: ['görev','oyuncak','renk'], correctIndex: 0 },
      { text: 'Defne afişi boyadı.', blankWord: null },
      { text: 'Birlikte çalışınca ödevleri daha güzel oldu.', blankWord: 'güzel', options: ['güzel','kötü','küçük'], correctIndex: 0 },
      { text: 'Öğretmenleri onları tebrik etti.', blankWord: null },
    ]
  },

  {
    baslik: 'Aras ve Cesaret',
    cumleler: [
      { text: 'Aras sınıfta şiir okumaktan çekiniyordu.', blankWord: null },
      { text: 'Sırası geldiğinde kalbi hızlı attı.', blankWord: 'kalbi', options: ['kalbi','ayağı','eli'], correctIndex: 0 },
      { text: 'Derin bir nefes aldı ve okumaya başladı.', blankWord: null },
      { text: 'Şiiri bitirdiğinde alkış aldı.', blankWord: 'alkış', options: ['alkış','ceza','bağırış'], correctIndex: 0 },
      { text: 'Aras cesur davrandığı için gurur duydu.', blankWord: null },
    ]
  },

  {
    baslik: 'İlayda ve Doğru Karar',
    cumleler: [
      { text: 'İlayda parkta oynarken yerde bir cüzdan buldu.', blankWord: null },
      { text: 'İçinde para ve kimlik vardı.', blankWord: 'kimlik', options: ['kimlik','taş','oyuncak'], correctIndex: 0 },
      { text: 'Parayı almak istemedi.', blankWord: null },
      { text: 'En yakın görevliye götürdü.', blankWord: 'götürdü', options: ['götürdü','sakladı','attı'], correctIndex: 0 },
      { text: 'İlayda doğru olanı yaptığı için mutlu oldu.', blankWord: null },
    ]
  },

  {
    baslik: 'Onur ve Sabır',
    cumleler: [
      { text: 'Onur yeni bir model uçak yapmak istedi.', blankWord: null },
      { text: 'Parçaları birleştirirken zorlandı.', blankWord: 'zorlandı', options: ['zorlandı','koştu','uyudu'], correctIndex: 0 },
      { text: 'Birkaç kez hata yaptı.', blankWord: null },
      { text: 'Sonunda uçağı tamamladı.', blankWord: 'tamamladı', options: ['tamamladı','kırdı','bıraktı'], correctIndex: 0 },
      { text: 'Onur sabırlı olunca başarabildiğini anladı.', blankWord: null },
    ]
  },

  {
    baslik: 'Henna ve Asya',
    cumleler: [
      { text: 'Henna ve Asya sabah uyandı.', blankWord: null },
      { text: 'Birlikte dışarı çıktılar.', blankWord: 'dışarı', options: ['dışarı','içeri','okula'], correctIndex: 0 },
      { text: 'Kedilerini sevip bir süre izlediler.', blankWord: null },
      { text: 'Akşam yemek yediler ve dişlerini fırçaladılar.', blankWord: 'fırçaladılar', options: ['fırçaladılar','koştular','sakladılar'], correctIndex: 0 },
      { text: 'Gece olunca mutlu bir günün ardından uyudular.', blankWord: null },
    ]
  },

];

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let hk = {
  aktif:     false,
  hikayeIdx: 0,
  cumleIdx:  0,
  skor:      0,
  bekliyor:  false,
};

// ═══════════════════════════════════════════════════════════════
// EKRAN
// ═══════════════════════════════════════════════════════════════
let hkEkran = null;

function hkEkranOlustur() {
  if (hkEkran) return;
  hkEkran = document.createElement('div');
  hkEkran.id = 'hikayeEkran';
  hkEkran.style.cssText = 'display:none;position:fixed;inset:0;z-index:1000;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);flex-direction:column;align-items:center;justify-content:flex-start;overflow:hidden;font-family:\'Baloo 2\',sans-serif;';

  hkEkran.innerHTML = `
    <div style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;box-sizing:border-box;background:rgba(255,255,255,0.06);backdrop-filter:blur(4px);">
      <button id="hkGeriBtn" style="background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:1rem;padding:8px 16px;border-radius:20px;cursor:pointer;font-family:'Baloo 2',sans-serif;font-weight:600;">← Menü</button>
      <div id="hkBaslik" style="color:#fff;font-size:0.95rem;font-weight:700;text-align:center;flex:1;margin:0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Hikaye</div>
      <div id="hkSkorBadge" style="background:rgba(255,215,0,0.2);border-radius:20px;padding:6px 14px;color:#ffd700;font-weight:800;font-size:1rem;">⭐ 0</div>
    </div>

    <div style="width:100%;padding:8px 16px 0;box-sizing:border-box;">
      <div style="background:rgba(255,255,255,0.1);border-radius:8px;height:6px;overflow:hidden;">
        <div id="hkProgressBar" style="height:100%;background:#a78bfa;border-radius:8px;width:0%;transition:width 0.4s;"></div>
      </div>
      <div id="hkProgressText" style="color:rgba(255,255,255,0.5);font-size:0.75rem;text-align:right;margin-top:3px;">1 / 1</div>
    </div>

    <div id="hkCumleKart" style="background:rgba(255,255,255,0.08);border-radius:20px;margin:12px 16px 8px;padding:24px 20px;width:calc(100% - 32px);box-sizing:border-box;min-height:90px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(255,255,255,0.12);">
      <div id="hkCumleText" style="color:#fff;font-size:1.3rem;font-weight:700;line-height:1.7;text-align:center;letter-spacing:0.02em;"></div>
    </div>

    <div id="hkSecenekler" style="display:none;flex-direction:row;flex-wrap:wrap;gap:12px;justify-content:center;width:calc(100% - 32px);margin:0 16px;"></div>

    <div id="hkGeriBildirim" style="min-height:32px;text-align:center;font-size:1rem;font-weight:700;color:#4ade80;margin:8px 16px 0;display:flex;align-items:center;justify-content:center;gap:6px;"></div>

    <button id="hkIleriBtn" style="margin-top:auto;margin-bottom:28px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;border-radius:24px;font-size:1.15rem;font-weight:800;padding:16px 52px;cursor:pointer;font-family:'Baloo 2',sans-serif;box-shadow:0 4px 20px rgba(124,58,237,0.5);display:none;">İleri ▶</button>
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
  if (typeof menuGoster === 'function') menuGoster();
  else { const ms = document.getElementById('menuScreen'); if (ms) ms.style.display = 'flex'; }
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

  document.getElementById('hkBaslik').textContent = '📖 ' + hikaye.baslik;
  document.getElementById('hkProgressBar').style.width = Math.round((hk.cumleIdx / toplam) * 100) + '%';
  document.getElementById('hkProgressText').textContent = (hk.cumleIdx + 1) + ' / ' + toplam;
  document.getElementById('hkSkorBadge').textContent = '⭐ ' + hk.skor;
  document.getElementById('hkGeriBildirim').textContent = '';

  const secDiv = document.getElementById('hkSecenekler');
  secDiv.style.display = 'none';
  secDiv.innerHTML = '';

  const kart   = document.getElementById('hkCumleKart');
  const textEl = document.getElementById('hkCumleText');

  if (cumle.blankWord) {
    kart.style.background  = 'rgba(255,235,150,0.10)';
    kart.style.borderColor = 'rgba(255,215,0,0.3)';
    const boslukHTML = `<span id="hkBosluk" style="display:inline-block;min-width:90px;border-bottom:3px solid #ffd700;background:rgba(255,215,0,0.12);border-radius:6px;padding:0 10px;color:transparent;">____</span>`;
    textEl.innerHTML = cumle.text.replace(cumle.blankWord, boslukHTML);
    hkSecenekleriGoster(cumle);
    document.getElementById('hkIleriBtn').style.display = 'none';
    hk.bekliyor = true;
  } else {
    kart.style.background  = 'rgba(255,255,255,0.08)';
    kart.style.borderColor = 'rgba(255,255,255,0.12)';
    textEl.textContent = cumle.text;
    document.getElementById('hkIleriBtn').style.display = 'block';
    hk.bekliyor = false;
  }
}

// ═══════════════════════════════════════════════════════════════
// SEÇENEKLER — harf-btn sınıfını kullan
// ═══════════════════════════════════════════════════════════════
function hkSecenekleriGoster(cumle) {
  const secDiv = document.getElementById('hkSecenekler');
  secDiv.style.display = 'flex';

  cumle.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'harf-btn';
    btn.textContent = opt;
    btn.style.width       = 'auto';
    btn.style.height      = 'auto';
    btn.style.padding     = '12px 22px';
    btn.style.fontSize    = '1.1rem';
    btn.style.borderRadius= '18px';
    btn.style.minWidth    = '80px';
    btn.addEventListener('click', () => hkSecenekTikla(idx, cumle, btn, secDiv));
    secDiv.appendChild(btn);
  });
}

// ═══════════════════════════════════════════════════════════════
// SEÇENEK TIKLA
// ═══════════════════════════════════════════════════════════════
function hkSecenekTikla(idx, cumle, btn, secDiv) {
  if (!hk.bekliyor) return;

  const dogru = idx === cumle.correctIndex;
  const gbEl  = document.getElementById('hkGeriBildirim');

  if (dogru) {
    hk.bekliyor = false;
    hk.skor++;
    document.getElementById('hkSkorBadge').textContent = '⭐ ' + hk.skor;

    btn.style.background = 'linear-gradient(135deg,#bbf7d0,#4ade80)';
    btn.style.color      = '#14532d';

    const boslukEl = document.getElementById('hkBosluk');
    if (boslukEl) {
      boslukEl.style.color       = '#ffd700';
      boslukEl.style.fontWeight  = '900';
      boslukEl.style.background  = 'rgba(255,215,0,0.2)';
      boslukEl.style.borderBottom= '3px solid #ffd700';
      boslukEl.textContent       = cumle.blankWord;
    }

    secDiv.querySelectorAll('button').forEach(b => b.disabled = true);
    gbEl.innerHTML = '<span style="font-size:1.4rem;">⭐</span> Harika!';
    gbEl.style.color = '#4ade80';

    setTimeout(() => { document.getElementById('hkIleriBtn').style.display = 'block'; }, 500);

  } else {
    btn.classList.add('harf-btn--yanlis');
    setTimeout(() => btn.classList.remove('harf-btn--yanlis'), 600);
    gbEl.innerHTML = '🔄 Tekrar deneyelim!';
    gbEl.style.color = '#fb923c';
    setTimeout(() => { gbEl.textContent = ''; }, 1200);
  }
}

// ═══════════════════════════════════════════════════════════════
// İLERİ
// ═══════════════════════════════════════════════════════════════
function hkIleri() {
  const hikaye = HIKAYE_DATA[hk.hikayeIdx];
  hk.cumleIdx++;
  if (hk.cumleIdx >= hikaye.cumleler.length) hkBitti();
  else hkCumleGoster();
}

// ═══════════════════════════════════════════════════════════════
// BİTİŞ
// ═══════════════════════════════════════════════════════════════
function hkBitti() {
  document.getElementById('hkProgressBar').style.width = '100%';
  document.getElementById('hkProgressText').textContent = 'Tamamlandı! 🎉';
  document.getElementById('hkSecenekler').style.display = 'none';
  document.getElementById('hkGeriBildirim').textContent = '';

  const emoji = hk.skor >= 5 ? '🏆' : hk.skor >= 3 ? '⭐' : '💪';
  const kart  = document.getElementById('hkCumleKart');
  kart.style.background  = 'rgba(167,139,250,0.15)';
  kart.style.borderColor = 'rgba(167,139,250,0.4)';

  document.getElementById('hkCumleText').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      <div style="font-size:3rem;">${emoji}</div>
      <div style="font-size:1.4rem;color:#a78bfa;font-weight:800;">Harika Okudun!</div>
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.6);">${HIKAYE_DATA[hk.hikayeIdx].baslik}</div>
      <div style="font-size:1.6rem;color:#ffd700;font-weight:900;margin-top:4px;">⭐ ${hk.skor} puan!</div>
    </div>
  `;

  const ileri = document.getElementById('hkIleriBtn');
  ileri.textContent = '▶ Menüye Dön';
  ileri.style.display = 'block';
  ileri.onclick = hkKapat;
}

// ═══════════════════════════════════════════════════════════════
// MENÜ ENTEGRASYONU
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
  const hikayeBtn = document.querySelector('[data-mod="hikaye"]');
  if (hikayeBtn) {
    hikayeBtn.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      const ms = document.getElementById('menuScreen');
      if (ms) ms.style.display = 'none';
      const gc = document.getElementById('gameContainer');
      if (gc) gc.style.display = 'none';
      hkAc(0);
    }, true);
  }

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

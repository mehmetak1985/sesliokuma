"use strict";

// ═══════════════════════════════════════════════════════════════
// HİKAYE MODU — v2
// blankWord: null  → sadece oku, İleri ile geç
// blankWord: 'kelime' → boşluk doldur, doğru cevap verilmeden geçilmez
// ═══════════════════════════════════════════════════════════════

const HIKAYE_DATA = [
  {
    id: 1, baslik: 'Mina ve Oyuncak Arabası',
    cumleler: [
      { text: 'Mina kırmızı oyuncak arabasını aldı.', blankWord: null },
      { text: 'Arabayı yere koydu ve hafifçe itti.', blankWord: null },
      { text: 'Araba hızla ilerledi ve masanın ayağına çarptı.', blankWord: null },
      { text: 'Mina önce şaşırdı, sonra gülmeye başladı.', blankWord: null },
      { text: 'Arabasını dikkatli sürmesi gerektiğini anladı.', blankWord: null }
    ],
    sorular: [
      { soru: 'Mina ne ile oynuyordu?', secenekler: ['Bebek','Araba','Top'], cevapIndex: 1 },
      { soru: 'Araba nereye çarptı?', secenekler: ['Kapıya','Sandalyeye','Masaya'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Tebrikler! Dikkatli sürüş puanın: 100'
  },
  {
    id: 2, baslik: 'Baran ve Yapboz',
    cumleler: [
      { text: 'Baran yapboz parçalarını masaya yaydı.', blankWord: null },
      { text: 'Önce köşe parçalarını buldu.', blankWord: null },
      { text: 'Parçaları birleştirirken sabırlı davrandı.', blankWord: null },
      { text: 'Sonunda güzel bir hayvan resmi ortaya çıktı.', blankWord: null },
      { text: 'Baran başardığı için gurur duydu.', blankWord: null }
    ],
    sorular: [
      { soru: 'Baran masaya ne yaydı?', secenekler: ['Kitaplar','Parçalar','Boyalar'], cevapIndex: 1 },
      { soru: 'Yapbozdan ne resmi çıktı?', secenekler: ['Hayvan','Ev','Araba'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Harikasın! Sabırlı olduğun için kazandın: 100 Puan'
  },
  {
    id: 3, baslik: 'Henna ve Kediler',
    cumleler: [
      { text: 'Henna bahçeye çıktığında iki küçük kedi çimenlerde oynuyordu.', blankWord: null },
      { text: 'Kediler bir kelebeği kovalamaya başladı.', blankWord: null },
      { text: 'Henna da onların peşinden koştu ama dikkatli yürüdü.', blankWord: null },
      { text: 'Kediler yorulunca gölgede dinlendiler.', blankWord: null },
      { text: 'Henna onları severken mutlu hissetti.', blankWord: null }
    ],
    sorular: [
      { soru: 'Kediler neyi kovaladı?', secenekler: ['Kuşu','Kelebeği','Fareyi'], cevapIndex: 1 },
      { soru: 'Kediler nerede dinlendi?', secenekler: ['Gölgede','Çatıda','Ağaçta'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Mükemmel! Hayvan sevgisi puanın: 100'
  },
  {
    id: 4, baslik: 'Mustafa ve Yeni Ayakkabıları',
    cumleler: [
      { text: 'Mustafa yeni ayakkabılarını giydi.', blankWord: null },
      { text: 'Çimlerde top oynamaya başladı.', blankWord: null },
      { text: 'Koşarken ayakkabılarının çok rahat olduğunu fark etti.', blankWord: null },
      { text: 'Ama çimenler ıslaktı ve biraz kaydı.', blankWord: null },
      { text: 'Mustafa dikkatli olması gerektiğini öğrendi.', blankWord: null }
    ],
    sorular: [
      { soru: 'Mustafa ne oynamaya başladı?', secenekler: ['Saklambaç','Top','Koşu'], cevapIndex: 1 },
      { soru: 'Çimenler nasıldı?', secenekler: ['Kuru','Sarı','Islak'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Süper! Dikkat puanın: 100'
  },
  {
    id: 5, baslik: 'Asya ve Yağmur',
    cumleler: [
      { text: 'Asya camdan dışarı baktı.', blankWord: null },
      { text: 'Yağmur yağıyordu.', blankWord: null },
      { text: 'Şemsiyesini alıp annesiyle dışarı çıktı.', blankWord: null },
      { text: 'Ayakkabıları ıslandı.', blankWord: null },
      { text: 'Asya eve dönünce kuru çorap giydi.', blankWord: null }
    ],
    sorular: [
      { soru: 'Asya dışarı çıkarken yanına ne aldı?', secenekler: ['Mont','Şemsiye','Şapka'], cevapIndex: 1 },
      { soru: 'Asya eve dönünce ne giydi?', secenekler: ['Çorap','Terlik','Ceket'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Tebrikler! Yağmur macerası puanın: 100'
  },
  {
    id: 6, baslik: 'Yusuf ve Kitap',
    cumleler: [
      { text: 'Yusuf kitaplığından bir hikaye kitabı seçti.', blankWord: null },
      { text: 'Kitabı sessizce okumaya başladı.', blankWord: null },
      { text: 'Anlamadığı bir kelimeyi annesine sordu.', blankWord: null },
      { text: 'Yeni kelimenin anlamını öğrenince hikayeyi daha iyi anladı.', blankWord: null }
    ],
    sorular: [
      { soru: 'Yusuf kitabı nasıl okudu?', secenekler: ['Bağırarak','Sessizce','Hızlıca'], cevapIndex: 1 },
      { soru: 'Yusuf kelimeyi kime sordu?', secenekler: ['Babasına','Abisine','Annesine'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Harika! Okuma puanın: 100'
  },
  {
    id: 7, baslik: 'Zeynep ve Çiçekler',
    cumleler: [
      { text: 'Zeynep bahçedeki çiçekleri suladı.', blankWord: null },
      { text: 'Bazı çiçeklerin yaprakları solmuştu.', blankWord: null },
      { text: 'Daha fazla su verdikten sonra birkaç gün bekledi.', blankWord: null },
      { text: 'Çiçekler yeniden canlandı.', blankWord: null },
      { text: 'Zeynep sabırlı olmanın önemini öğrendi.', blankWord: null }
    ],
    sorular: [
      { soru: 'Zeynep neyi suladı?', secenekler: ['Ağaçları','Çiçekleri','Otları'], cevapIndex: 1 },
      { soru: 'Çiçeklere ne verince canlandılar?', secenekler: ['Toprak','Güneş','Su'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Tebrikler! Doğa dostu puanın: 100'
  },
  {
    id: 8, baslik: 'Maysa ve Resim',
    cumleler: [
      { text: 'Maysa resim defterini açtı.', blankWord: null },
      { text: 'Önce güneş çizdi, sonra bir ev yaptı.', blankWord: null },
      { text: 'Boyarken çizgilerin dışına taştı ama pes etmedi.', blankWord: null },
      { text: 'Resmini tamamladığında çok güzel görünüyordu.', blankWord: null }
    ],
    sorular: [
      { soru: 'Maysa ilk önce ne çizdi?', secenekler: ['Ev','Güneş','Bulut'], cevapIndex: 1 },
      { soru: 'Maysa neyin dışına taştı?', secenekler: ['Çizgilerin','Kağıdın','Masanın'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Harika! Sanatçı puanın: 100'
  },
  {
    id: 9, baslik: 'Mehmet ve Uçurtma',
    cumleler: [
      { text: 'Mehmet uçurtmasını gökyüzüne bıraktı.', blankWord: null },
      { text: 'Rüzgar hafif esiyordu.', blankWord: null },
      { text: 'Uçurtma bazen düşer gibi oldu ama Mehmet ipi sıkı tuttu.', blankWord: null },
      { text: 'Bir süre sonra uçurtma daha yükseğe çıktı.', blankWord: null }
    ],
    sorular: [
      { soru: 'Uçurtmanın uçması için ne esiyordu?', secenekler: ['Kar','Rüzgar','Duman'], cevapIndex: 1 },
      { soru: 'Mehmet neyi sıkı tuttu?', secenekler: ['İpi','Çubuğu','Kuyruğu'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Süper! Rüzgar puanın: 100'
  },
  {
    id: 10, baslik: 'Yağmur ve Kütüphane',
    cumleler: [
      { text: 'Yağmur kütüphaneye gitti.', blankWord: null },
      { text: 'Sessiz olması gerektiğini biliyordu.', blankWord: null },
      { text: 'Kitabını dikkatle seçti ve yerine oturdu.', blankWord: null },
      { text: 'Çevresindekileri rahatsız etmeden okudu.', blankWord: null }
    ],
    sorular: [
      { soru: 'Yağmur nereye gitti?', secenekler: ['Parka','Markete','Kütüphaneye'], cevapIndex: 2 },
      { soru: 'Yağmur kütüphanede nasıl olmalıydı?', secenekler: ['Hızlı','Sessiz','Hareketli'], cevapIndex: 1 }
    ],
    bitisMesaji: 'Harikasın! Kültür puanın: 100'
  },
  {
    id: 11, baslik: 'Çiçek ve Dostluk',
    cumleler: [
      { text: 'Çiçek parkta tek başına oturan bir çocuk gördü.', blankWord: null },
      { text: 'Yanına gidip selam verdi.', blankWord: null },
      { text: 'Birlikte salıncağa bindiler.', blankWord: null },
      { text: 'O gün yeni bir arkadaş edindi.', blankWord: null }
    ],
    sorular: [
      { soru: 'Çiçek çocukla birlikte neye bindi?', secenekler: ['Kaydırak','Araba','Salıncak'], cevapIndex: 2 },
      { soru: 'Çiçek o gün ne edindi?', secenekler: ['Arkadaş','Kedi','Kitap'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Tebrikler! Dostluk puanın: 100'
  },
  {
    id: 12, baslik: 'Emir ve Kayıp Kalem',
    cumleler: [
      { text: 'Emir ödev yapmak için masaya oturdu.', blankWord: null },
      { text: 'Kalemini bulamadı.', blankWord: null },
      { text: 'Çantasını ve masasını aradı ama kalem yoktu.', blankWord: null },
      { text: 'Çantasının küçük cebine baktı ve kalemini buldu.', blankWord: null },
      { text: 'Emir eşyalarını düzenli koyması gerektiğini anladı.', blankWord: null }
    ],
    sorular: [
      { soru: 'Emir masaya ne için oturdu?', secenekler: ['Yemek','Ödev','Oyun'], cevapIndex: 1 },
      { soru: 'Emir kalemini nerede buldu?', secenekler: ['Yerde','Cepte','Kitapta'], cevapIndex: 1 }
    ],
    bitisMesaji: 'Harika! Düzen puanın: 100'
  },
  {
    id: 13, baslik: 'Beyaz ve Paylaşmak',
    cumleler: [
      { text: 'Beyaz parkta bisküviyle oturuyordu.', blankWord: null },
      { text: 'Yanındaki çocuk üzgün görünüyordu çünkü yiyeceği yoktu.', blankWord: null },
      { text: 'Beyaz bisküvisini ikiye böldü ve yarısını verdi.', blankWord: null },
      { text: 'Çocuk gülümsedi.', blankWord: null },
      { text: 'Beyaz paylaşmanın insanı mutlu ettiğini fark etti.', blankWord: null }
    ],
    sorular: [
      { soru: 'Beyaz ne yiyordu?', secenekler: ['Elma','Bisküvi','Ekmek'], cevapIndex: 1 },
      { soru: 'Diğer çocuk bisküviyi alınca ne yaptı?', secenekler: ['Gülümsedi','Ağladı','Kızdı'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Mükemmel! Paylaşım puanın: 100'
  },
  {
    id: 14, baslik: 'Kaan ve Zamanında Uyanmak',
    cumleler: [
      { text: 'Kaan sabah alarmı duydu ama kapattı.', blankWord: null },
      { text: 'Biraz daha uyumak istedi.', blankWord: null },
      { text: 'Uyandığında okula geç kaldığını fark etti.', blankWord: null },
      { text: 'Aceleyle hazırlandı ama servisi kaçırdı.', blankWord: null },
      { text: 'Ertesi gün alarm çalınca hemen kalktı.', blankWord: null }
    ],
    sorular: [
      { soru: 'Kaan neyi kaçırdı?', secenekler: ['Topu','Servisi','Uçağı'], cevapIndex: 1 },
      { soru: 'Kaan sabah neyi kapattı?', secenekler: ['Işığı','Kapıyı','Alarmı'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Tebrikler! Zaman yönetimi puanın: 100'
  },
  {
    id: 15, baslik: 'Elvan ve Bitki',
    cumleler: [
      { text: 'Elvan küçük bir saksıya tohum ekti.', blankWord: null },
      { text: 'Her gün düzenli olarak suladı.', blankWord: null },
      { text: 'İlk gün hiçbir şey çıkmadı.', blankWord: null },
      { text: 'Birkaç gün sonra küçük bir filiz gördü.', blankWord: null },
      { text: 'Sabırlı olmanın önemli olduğunu öğrendi.', blankWord: null }
    ],
    sorular: [
      { soru: 'Elvan saksıya ne ekti?', secenekler: ['Çiçek','Tohum','Taş'], cevapIndex: 1 },
      { soru: 'Saksıdan ne çıktı?', secenekler: ['Dal','Böcek','Filiz'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Harika! Sabır puanın: 100'
  },
  {
    id: 16, baslik: 'Berk ve Kırılan Bardak',
    cumleler: [
      { text: 'Berk mutfakta su almak istedi.', blankWord: null },
      { text: 'Bardağı hızlıca aldı ve elinden düşürdü.', blankWord: null },
      { text: 'Bardak kırıldı.', blankWord: null },
      { text: 'Berk korktu ama annesine gerçeği söyledi.', blankWord: null },
      { text: 'Berk bir dahaki sefere yavaş davranmaya karar verdi.', blankWord: null }
    ],
    sorular: [
      { soru: 'Mutfakta ne kırıldı?', secenekler: ['Tabak','Bardak','Kaşık'], cevapIndex: 1 },
      { soru: 'Berk annesine neyi söyledi?', secenekler: ['Gerçeği','Yalanı','Şarkıyı'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Mükemmel! Dürüstlük puanın: 100'
  },
  {
    id: 17, baslik: 'Defne ve Grup Çalışması',
    cumleler: [
      { text: 'Defne okulda grup çalışması yaptı.', blankWord: null },
      { text: 'Herkes bir görev aldı.', blankWord: null },
      { text: 'Defne afişi boyadı.', blankWord: null },
      { text: 'Birlikte çalışınca ödevleri daha güzel oldu.', blankWord: null },
      { text: 'Öğretmenleri onları tebrik etti.', blankWord: null }
    ],
    sorular: [
      { soru: 'Defne nerede grup çalışması yaptı?', secenekler: ['Parkta','Okulda','Evde'], cevapIndex: 1 },
      { soru: 'Defne neyi boyadı?', secenekler: ['Masayı','Duvarı','Afişi'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Süper! İş birliği puanın: 100'
  },
  {
    id: 18, baslik: 'Aras ve Cesaret',
    cumleler: [
      { text: 'Aras sınıfta şiir okumaktan çekiniyordu.', blankWord: null },
      { text: 'Sırası geldiğinde kalbi hızlı attı.', blankWord: null },
      { text: 'Derin bir nefes aldı ve okumaya başladı.', blankWord: null },
      { text: 'Şiiri bitirdiğinde alkış aldı.', blankWord: null },
      { text: 'Aras cesur davrandığı için gurur duydu.', blankWord: null }
    ],
    sorular: [
      { soru: 'Aras ne okudu?', secenekler: ['Kitap','Şiir','Gazete'], cevapIndex: 1 },
      { soru: 'Aras şiiri bitirince ne aldı?', secenekler: ['Alkış','Hediye','Puan'], cevapIndex: 0 }
    ],
    bitisMesaji: 'Harika! Cesaret puanın: 100'
  },
  {
    id: 19, baslik: 'İlayda ve Doğru Karar',
    cumleler: [
      { text: 'İlayda parkta oynarken yerde bir cüzdan buldu.', blankWord: null },
      { text: 'İçinde para ve kimlik vardı.', blankWord: null },
      { text: 'Parayı almak istemedi.', blankWord: null },
      { text: 'En yakın görevliye götürdü.', blankWord: null },
      { text: 'İlayda doğru olanı yaptığı için mutlu oldu.', blankWord: null }
    ],
    sorular: [
      { soru: 'İlayda yerde ne buldu?', secenekler: ['Anahtar','Cüzdan','Kalem'], cevapIndex: 1 },
      { soru: 'İlayda cüzdanı kime götürdü?', secenekler: ['Arkadaşına','Annesine','Görevliye'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Tebrikler! Dürüstlük puanın: 100'
  },
  {
    id: 20, baslik: 'Onur ve Sabır',
    cumleler: [
      { text: 'Onur yeni bir model uçak yapmak istedi.', blankWord: null },
      { text: 'Parçaları birleştirirken zorlandı.', blankWord: null },
      { text: 'Birkaç kez hata yaptı.', blankWord: null },
      { text: 'Sonunda uçağı tamamladı.', blankWord: null },
      { text: 'Onur sabırlı olunca başarabildiğini anladı.', blankWord: null }
    ],
    sorular: [
      { soru: 'Onur ne yapmak istedi?', secenekler: ['Gemi','Uçak','Araba'], cevapIndex: 1 },
      { soru: 'Onur uçağı ne zaman bitirdi?', secenekler: ['Hemen','Sonunda','Ertesi gün'], cevapIndex: 1 }
    ],
    bitisMesaji: 'Süper! Sabır puanın: 100'
  },
  {
    id: 21, baslik: 'Henna ve Asya',
    cumleler: [
      { text: 'Henna ve Asya sabah uyandı.', blankWord: null },
      { text: 'Birlikte dışarı çıktılar.', blankWord: null },
      { text: 'Kedilerini sevip bir süre izlediler.', blankWord: null },
      { text: 'Akşam yemek yediler ve dişlerini fırçaladılar.', blankWord: null },
      { text: 'Gece olunca mutlu bir günün ardından uyudular.', blankWord: null }
    ],
    sorular: [
      { soru: 'Henna ve Asya kimi sevdiler?', secenekler: ['Köpeği','Kediyi','Kuşu'], cevapIndex: 1 },
      { soru: 'Uyumadan önce ne yaptılar?', secenekler: ['Oyun oynadılar','Süt içtiler','Diş fırçaladılar'], cevapIndex: 2 }
    ],
    bitisMesaji: 'Mükemmel! Sağlık puanın: 100'
  }
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
  hkEkran.style.cssText = 'display:none;position:fixed;inset:0;z-index:500;overflow-y:auto;flex-direction:column;align-items:center;padding:20px 0 40px;';

  hkEkran.innerHTML = `
    <div class="koyun-screen" style="gap:14px;">

      <button id="hkGeriBtn" class="btn-back" style="align-self:flex-start;">← Menü</button>

      <div class="koyun-header">
        <div>
          <h2 class="koyun-title">Minik <span class="menu-title-book">📖</span> Okur</h2>
          <p class="subtitle" id="hkBaslik">Hikaye</p>
        </div>
        <div class="koyun-score-badge">⭐ <span id="hkSkorBadge">0</span></div>
      </div>

      <div style="width:100%;">
        <div style="background:rgba(255,255,255,0.18);border-radius:8px;height:7px;overflow:hidden;">
          <div id="hkProgressBar" style="height:100%;background:#f9a825;border-radius:8px;width:0%;transition:width 0.4s;"></div>
        </div>
        <div id="hkProgressText" style="color:rgba(255,255,255,0.6);font-size:0.78rem;text-align:right;margin-top:3px;font-family:'Nunito',sans-serif;font-weight:700;">1 / 1</div>
      </div>

      <div class="koyun-card" id="hkCumleKart" style="min-height:130px;">
        <div id="hkCumleText" style="font-family:'Nunito',sans-serif;font-size:clamp(1.1rem,4vw,1.4rem);font-weight:800;color:#1a2744;line-height:1.7;text-align:center;"></div>
      </div>

      <div id="hkSecenekler" style="display:none;flex-direction:row;flex-wrap:wrap;gap:12px;justify-content:center;width:100%;"></div>

      <div id="hkGeriBildirim" class="koyun-result" style="min-height:36px;"></div>

      <button id="hkIleriBtn" class="btn btn-start" style="display:none;min-width:180px;">İleri ▶</button>

    </div>
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
// CÜMLE GÖSTER — kelime kelime göz takibi vurgulama
// ═══════════════════════════════════════════════════════════════
function hkCumleGoster() {
  const hikaye = HIKAYE_DATA[hk.hikayeIdx];

  // blankWord olan cümleleri tamamen atla, sıradakine geç
  while (hk.cumleIdx < hikaye.cumleler.length && hikaye.cumleler[hk.cumleIdx].blankWord) {
    hk.cumleIdx++;
  }
  if (hk.cumleIdx >= hikaye.cumleler.length) { hkBitti(); return; }

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

  kart.classList.remove('koyun-card--soru');
  hk.bekliyor = false;

  // İleri butonunu gizle — vurgulama bitince gösterilecek
  document.getElementById('hkIleriBtn').style.display = 'none';

  // Kelime kelime göz takibi vurgulama
  const kelimeler = cumle.text.split(' ');
  // %50 yavaşlatıldı: 600ms/kelime
  const KELIME_SURESI = 1176;

  // Her kelimeyi <span> içine al
  textEl.innerHTML = kelimeler
    .map((k, i) => `<span id="hkKelime_${i}">${k}</span>`)
    .join(' ');

  // Sırayla vurgula
  kelimeler.forEach((_, i) => {
    setTimeout(() => {
      // Önceki kelimeyi sıfırla
      if (i > 0) {
        const onceki = document.getElementById('hkKelime_' + (i - 1));
        if (onceki) {
          onceki.style.color        = '';
          onceki.style.background   = '';
          onceki.style.borderRadius = '';
          onceki.style.padding      = '';
          onceki.style.transition   = '';
          onceki.style.outline      = '';
          onceki.style.fontWeight   = '';
        }
      }
      // Mevcut kelimeyi vurgula
      const el = document.getElementById('hkKelime_' + i);
      if (el) {
        el.style.color        = '#e65100';
        el.style.fontWeight   = '900';
        el.style.background   = '#fff';
        el.style.outline      = '2.5px solid #f9a825';
        el.style.borderRadius = '8px';
        el.style.padding      = '1px 6px';
        el.style.transition   = 'all 0.08s';
      }

      // Son kelimeyse: vurguyu kaldır ve İleri'yi göster
      if (i === kelimeler.length - 1) {
        setTimeout(() => {
          if (el) {
            el.style.color        = '';
            el.style.fontWeight   = '';
            el.style.background   = '';
            el.style.outline      = '';
            el.style.borderRadius = '';
            el.style.padding      = '';
          }
          document.getElementById('hkIleriBtn').style.display = 'block';
        }, KELIME_SURESI);
      }
    }, i * KELIME_SURESI);
  });
}

// ═══════════════════════════════════════════════════════════════
// SEÇENEKLER — harf-btn sınıfını kullan
// ═══════════════════════════════════════════════════════════════
function hkSecenekleriGoster(cumle) {
  const secDiv = document.getElementById('hkSecenekler');
  secDiv.style.display = 'flex';

  cumle.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'hk-secbtn';
    btn.textContent = opt;
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

    btn.classList.add('hk-secbtn--dogru');

    const boslukEl = document.getElementById('hkBosluk');
    if (boslukEl) {
      boslukEl.style.color       = '#ffd700';
      boslukEl.style.fontWeight  = '900';
      boslukEl.style.background  = 'rgba(255,215,0,0.2)';
      boslukEl.style.borderBottom= '3px solid #ffd700';
      boslukEl.textContent       = cumle.blankWord;
    }

    secDiv.querySelectorAll('button').forEach(b => b.disabled = true);
    gbEl.textContent = '⭐ Harika!';
    gbEl.className = 'koyun-result dogru';

    setTimeout(() => { document.getElementById('hkIleriBtn').style.display = 'block'; }, 500);

  } else {
    btn.classList.add('hk-secbtn--yanlis');
    setTimeout(() => btn.classList.remove('hk-secbtn--yanlis'), 600);
    gbEl.textContent = '🔄 Tekrar deneyelim!';
    gbEl.className = 'koyun-result';
    gbEl.style.color = '#f97316';
    setTimeout(() => { gbEl.textContent = ''; gbEl.className = 'koyun-result'; gbEl.style.color = ''; }, 1200);
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
// BİTİŞ — Önce sorular, sonra bitiş ekranı
// ═══════════════════════════════════════════════════════════════
function hkBitti() {
  const hikaye = HIKAYE_DATA[hk.hikayeIdx];
  // Sorular varsa önce soruları göster
  if (hikaye.sorular && hikaye.sorular.length > 0) {
    hk.soruIdx   = 0;
    hk.soruSkor  = 0;
    hkSoruGoster();
  } else {
    hkBitisEkrani();
  }
}

function hkSoruGoster() {
  const hikaye = HIKAYE_DATA[hk.hikayeIdx];
  const soru   = hikaye.sorular[hk.soruIdx];
  const toplam = hikaye.sorular.length;

  document.getElementById('hkProgressBar').style.width = '100%';
  document.getElementById('hkProgressText').textContent = 'Soru ' + (hk.soruIdx + 1) + ' / ' + toplam;
  document.getElementById('hkGeriBildirim').textContent = '';
  document.getElementById('hkGeriBildirim').className = 'koyun-result';
  document.getElementById('hkIleriBtn').style.display = 'none';

  const kart   = document.getElementById('hkCumleKart');
  const textEl = document.getElementById('hkCumleText');
  kart.classList.remove('koyun-card--soru', 'koyun-card--bitis');
  kart.classList.add('koyun-card--soru');

  textEl.innerHTML = `<span style="font-size:1.1rem;color:#b45309;font-weight:700;">🔍 Anlama Sorusu</span><br><br>${soru.soru}`;

  const secDiv = document.getElementById('hkSecenekler');
  secDiv.innerHTML = '';
  secDiv.style.display = 'flex';

  soru.secenekler.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'hk-secbtn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      secDiv.querySelectorAll('button').forEach(b => b.disabled = true);
      const gbEl = document.getElementById('hkGeriBildirim');
      if (idx === soru.cevapIndex) {
        hk.soruSkor++;
        btn.classList.add('hk-secbtn--dogru');
        gbEl.textContent = '⭐ Doğru!';
        gbEl.className = 'koyun-result dogru';
      } else {
        btn.classList.add('hk-secbtn--yanlis');
        secDiv.querySelectorAll('button')[soru.cevapIndex].classList.add('hk-secbtn--dogru');
        gbEl.textContent = '🔄 ' + soru.secenekler[soru.cevapIndex] + ' doğruydu!';
        gbEl.className = 'koyun-result';
        gbEl.style.color = '#f97316';
      }
      setTimeout(() => {
        hk.soruIdx++;
        if (hk.soruIdx < hikaye.sorular.length) {
          hkSoruGoster();
        } else {
          hkBitisEkrani();
        }
      }, 1200);
    });
    secDiv.appendChild(btn);
  });
}

function hkBitisEkrani() {
  const hikaye   = HIKAYE_DATA[hk.hikayeIdx];
  const toplamSkor = hk.skor + (hk.soruSkor || 0);
  const emoji    = toplamSkor >= 6 ? '🏆' : toplamSkor >= 4 ? '⭐' : '💪';
  const sonHikaye = (hk.hikayeIdx >= HIKAYE_DATA.length - 1);

  document.getElementById('hkProgressText').textContent = 'Tamamlandı! 🎉';
  document.getElementById('hkSecenekler').style.display = 'none';
  document.getElementById('hkGeriBildirim').textContent = '';

  const kart = document.getElementById('hkCumleKart');
  kart.classList.remove('koyun-card--soru');
  kart.classList.add('koyun-card--bitis');

  document.getElementById('hkCumleText').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
      <div style="font-size:3rem;">${emoji}</div>
      <div style="font-size:1.4rem;color:#7c3aed;font-weight:800;">Harika Okudun!</div>
      <div style="font-size:0.9rem;color:#555;font-style:italic;">${hikaye.bitisMesaji || hikaye.baslik}</div>
      <div style="font-size:1.5rem;color:#f59e0b;font-weight:900;">⭐ ${toplamSkor} puan!</div>
    </div>
  `;

  const ileri = document.getElementById('hkIleriBtn');
  ileri.style.display = 'block';

  if (sonHikaye) {
    ileri.textContent = '▶ Menüye Dön';
    ileri.onclick = hkKapat;
  } else {
    ileri.textContent = '▶ Sonraki Hikaye';
    ileri.onclick = () => {
      hk.hikayeIdx++;
      hk.cumleIdx  = 0;
      hk.skor      = 0;
      hk.soruIdx   = 0;
      hk.soruSkor  = 0;
      hk.bekliyor  = false;
      kart.classList.remove('koyun-card--bitis');
      ileri.textContent = 'İleri ▶';
      ileri.onclick = hkIleri;
      hkCumleGoster();
    };
  }
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

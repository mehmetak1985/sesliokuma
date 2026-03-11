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

      <div class="koyun-card" id="hkCumleKart" style="min-height:130px;padding:0;overflow:hidden;gap:0;">
        <div id="hkResimAlan" style="width:100%;border-radius:16px 16px 0 0;overflow:hidden;display:none;"></div>
        <div id="hkCumleText" style="font-family:'Nunito',sans-serif;font-size:clamp(1.1rem,4vw,1.4rem);font-weight:800;color:#1a2744;line-height:1.7;text-align:center;padding:20px 20px 16px;"></div>
      </div>

      <div id="hkSecenekler" style="display:none;flex-direction:row;flex-wrap:wrap;gap:12px;justify-content:center;width:100%;"></div>

      <div id="hkGeriBildirim" class="koyun-result" style="min-height:36px;"></div>

      <button id="hkIleriBtn" class="btn btn-start" style="display:none;min-width:180px;">İleri ▶</button>

    </div>
  `;

  document.body.appendChild(hkEkran);
  document.getElementById('hkGeriBtn').onclick = hkKapat;
  document.getElementById('hkIleriBtn').onclick = hkIleri;
}

// ═══════════════════════════════════════════════════════════════
// AÇMA / KAPAMA
// ═══════════════════════════════════════════════════════════════
function hkAc(hikayeIdx) {
  if (typeof hkSecimAc === 'function') { hkSecimAc(); return; }
  hkAcHikaye(hikayeIdx || 0);
}

function hkAcHikaye(hikayeIdx) {
  hkEkranOlustur();
  hk.hikayeIdx = hikayeIdx;
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
  if (typeof hkSecimAc === 'function') hkSecimAc();
  else if (typeof menuGoster === 'function') menuGoster();
  else { var ms = document.getElementById('menuScreen'); if (ms) ms.style.display = 'flex'; }
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

  // Resmi göster
  const resimAlan = document.getElementById('hkResimAlan');
  const svgResim = HIKAYE_SVGS[hk.hikayeIdx + 1];
  if (resimAlan && svgResim) {
    resimAlan.style.display = 'block';
    resimAlan.innerHTML = svgResim;
    const svgEl = resimAlan.querySelector('svg');
    if (svgEl) {
      svgEl.style.width = '100%';
      svgEl.style.height = 'auto';
      svgEl.style.display = 'block';
      svgEl.style.maxHeight = '55vw';
    }
  }

  // İleri butonunu gizle — vurgulama bitince gösterilecek
  document.getElementById('hkIleriBtn').style.display = 'none';

  // Kelime kelime göz takibi vurgulama
  const kelimeler = cumle.text.split(' ');
  const KELIME_SURESI = 1176;

  // Her kelimeyi <span> içine al
  textEl.innerHTML = kelimeler
    .map((k, i) => `<span id="hkKelime_${i}">${k}</span>`)
    .join(' ');

  // Eski timer'ları iptal et (iki kelime aynı anda görünme bug'ı)
  if (window._hkTimerlar) {
    window._hkTimerlar.forEach(t => clearTimeout(t));
  }
  window._hkTimerlar = [];

  // Sırayla vurgula
  kelimeler.forEach((_, i) => {
    const t = setTimeout(() => {
      // Önceki kelimeyi sıfırla — sadece renk/fontWeight
      if (i > 0) {
        const onceki = document.getElementById('hkKelime_' + (i - 1));
        if (onceki) {
          onceki.style.color      = '';
          onceki.style.fontWeight = '';
        }
      }
      // Mevcut kelimeyi vurgula — sadece renk, boyut değişmez
      const el = document.getElementById('hkKelime_' + i);
      if (el) {
        el.style.color      = '#e65100';
        el.style.fontWeight = '900';
      }

      // Son kelimeyse: vurguyu kaldır ve İleri'yi göster
      if (i === kelimeler.length - 1) {
        const t2 = setTimeout(() => {
          if (el) {
            el.style.color      = '';
            el.style.fontWeight = '';
          }
          document.getElementById('hkIleriBtn').style.display = 'block';
        }, KELIME_SURESI);
        window._hkTimerlar.push(t2);
      }
    }, i * KELIME_SURESI);
    window._hkTimerlar.push(t);
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
  // Her ileri basışta +1 puan
  hk.skor++;
  if (typeof window.koyunSkoru === 'function') {
    window.koyunSkoru(1);
  }
  document.getElementById('hkSkorBadge').textContent = '⭐ ' + hk.skor;
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

  // Soru ekranında resmi gizle, padding geri ver
  const resimAlanSoru = document.getElementById('hkResimAlan');
  if (resimAlanSoru) resimAlanSoru.style.display = 'none';
  if (textEl) textEl.style.padding = '20px 20px 16px';

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
        if (typeof window.koyunSkoru === 'function') window.koyunSkoru(5);
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

  if (typeof window.koyunSkoru === 'function') window.koyunSkoru(15);
  if (window.profilAktiviteKaydet) window.profilAktiviteKaydet('hikaye');

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
// hikayeSecimBas ve hkAcHikaye global API olarak tanımla
// Navigasyon app.js tarafından yönetilir
window.hikayeSecimBas = function() {
  if (typeof hkSecimAc === 'function') hkSecimAc();
  else hkAcHikaye(0);
};
const HIKAYE_SVGS = {
  1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#E8F4E8"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg1)"/><rect x="0" y="170" width="400" height="50" fill="#C8A870"/><circle cx="340" cy="40" r="25" fill="#FFE066"/><ellipse cx="80" cy="50" rx="35" ry="16" fill="white" opacity="0.8"/><ellipse cx="55" cy="55" rx="20" ry="13" fill="white" opacity="0.8"/><ellipse cx="240" cy="35" rx="28" ry="13" fill="white" opacity="0.8"/><!-- Masa --><rect x="55" y="135" width="120" height="10" fill="#8B5E3C" rx="3"/><rect x="65" y="145" width="9" height="28" fill="#7A4F2D" rx="2"/><rect x="157" y="145" width="9" height="28" fill="#7A4F2D" rx="2"/><!-- Mina --><ellipse cx="265" cy="155" rx="24" ry="30" fill="#FF85A1"/><circle cx="265" cy="110" r="24" fill="#FDBCB4"/><path d="M243 102 Q265 90 287 102" fill="#4A2C0A"/><ellipse cx="257" cy="108" rx="4" ry="5" fill="#2C1810"/><ellipse cx="273" cy="108" rx="4" ry="5" fill="#2C1810"/><circle cx="258" cy="106" r="1.5" fill="white"/><circle cx="274" cy="106" r="1.5" fill="white"/><circle cx="248" cy="115" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="282" cy="115" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M258 120 Q265 126 272 120" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><rect x="248" y="183" width="9" height="25" fill="#FDBCB4" rx="3"/><rect x="263" y="183" width="9" height="25" fill="#FDBCB4" rx="3"/><ellipse cx="252" cy="209" rx="9" ry="4" fill="#FF5C8A"/><ellipse cx="267" cy="209" rx="9" ry="4" fill="#FF5C8A"/><!-- Araba --><rect x="78" y="155" width="68" height="24" fill="#FF4444" rx="7"/><rect x="90" y="145" width="44" height="16" fill="#FF6666" rx="5"/><rect x="93" y="148" width="16" height="10" fill="#AEE4FF" rx="2" opacity="0.8"/><rect x="113" y="148" width="16" height="10" fill="#AEE4FF" rx="2" opacity="0.8"/><circle cx="96" cy="181" r="10" fill="#222"/><circle cx="96" cy="181" r="5" fill="#555"/><circle cx="136" cy="181" r="10" fill="#222"/><circle cx="136" cy="181" r="5" fill="#555"/><ellipse cx="144" cy="162" rx="4" ry="3" fill="#FFD700" opacity="0.9"/><line x1="68" y1="160" x2="56" y2="160" stroke="#FFB800" stroke-width="2" opacity="0.6" stroke-linecap="round"/><line x1="66" y1="167" x2="52" y2="167" stroke="#FFB800" stroke-width="2" opacity="0.6" stroke-linecap="round"/><line x1="68" y1="174" x2="56" y2="174" stroke="#FFB800" stroke-width="2" opacity="0.6" stroke-linecap="round"/></svg>`,
  2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#FFF8E7"/><rect x="0" y="175" width="400" height="45" fill="#D4A96A"/><!-- Masa --><rect x="80" y="130" width="200" height="12" fill="#8B5E3C" rx="3"/><rect x="92" y="142" width="10" height="35" fill="#7A4F2D"/><rect x="258" y="142" width="10" height="35" fill="#7A4F2D"/><!-- Yapboz parçaları --><rect x="110" y="100" width="35" height="30" fill="#FF6B6B" rx="4" stroke="white" stroke-width="2"/><rect x="110" y="100" width="17" height="15" fill="#FF9999" rx="2"/><rect x="152" y="100" width="35" height="30" fill="#4ECDC4" rx="4" stroke="white" stroke-width="2"/><rect x="152" y="116" width="17" height="14" fill="#7EDDD8" rx="2"/><rect x="194" y="100" width="35" height="30" fill="#FFE66D" rx="4" stroke="white" stroke-width="2"/><rect x="210" y="100" width="19" height="15" fill="#FFF0A0" rx="2"/><rect x="131" y="72" width="35" height="30" fill="#A8E6CF" rx="4" stroke="white" stroke-width="2"/><rect x="173" y="72" width="35" height="30" fill="#FF8B94" rx="4" stroke="white" stroke-width="2"/><!-- Baran --><ellipse cx="310" cy="152" rx="22" ry="28" fill="#4A90D9"/><circle cx="310" cy="112" r="22" fill="#FDBCB4"/><path d="M290 105 Q310 94 330 105" fill="#3D2B1F"/><ellipse cx="303" cy="111" rx="4" ry="5" fill="#2C1810"/><ellipse cx="317" cy="111" rx="4" ry="5" fill="#2C1810"/><circle cx="304" cy="109" r="1.5" fill="white"/><circle cx="318" cy="109" r="1.5" fill="white"/><circle cx="295" cy="118" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="325" cy="118" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M303 123 Q310 129 317 123" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><rect x="290" y="150" width="10" height="13" fill="#FDBCB4"/><rect x="328" y="148" width="10" height="13" fill="#FDBCB4"/><rect x="295" y="178" width="9" height="22" fill="#FDBCB4" rx="3"/><rect x="311" y="178" width="9" height="22" fill="#FDBCB4" rx="3"/><ellipse cx="299" cy="201" rx="9" ry="4" fill="#2255AA"/><ellipse cx="315" cy="201" rx="9" ry="4" fill="#2255AA"/></svg>`,
  3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#90EE90"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg3)"/><rect x="0" y="175" width="400" height="45" fill="#5D8A3C"/><!-- Çimen detayları --><ellipse cx="50" cy="175" rx="30" ry="10" fill="#4CAF50"/><ellipse cx="150" cy="175" rx="40" ry="12" fill="#66BB6A"/><ellipse cx="300" cy="175" rx="35" ry="11" fill="#4CAF50"/><ellipse cx="380" cy="178" rx="25" ry="9" fill="#66BB6A"/><!-- Kelebek --><ellipse cx="200" cy="60" rx="18" ry="12" fill="#FF85A1" transform="rotate(-20,200,60)" opacity="0.9"/><ellipse cx="225" cy="60" rx="18" ry="12" fill="#FFB3BA" transform="rotate(20,225,60)" opacity="0.9"/><circle cx="212" cy="61" r="4" fill="#FF3D7F"/><!-- Anten --><line x1="210" y1="57" x2="205" y2="48" stroke="#FF3D7F" stroke-width="1.5"/><line x1="214" y1="57" x2="219" y2="48" stroke="#FF3D7F" stroke-width="1.5"/><circle cx="205" cy="47" r="2" fill="#FF3D7F"/><circle cx="219" cy="47" r="2" fill="#FF3D7F"/><!-- Kedi 1 --><ellipse cx="100" cy="175" rx="22" ry="14" fill="#F4A460"/><circle cx="90" cy="162" r="14" fill="#F4A460"/><polygon points="82,152 78,142 90,148" fill="#F4A460"/><polygon points="98,152 102,142 90,148" fill="#F4A460"/><ellipse cx="85" cy="163" rx="4" ry="5" fill="#2ECC71"/><ellipse cx="95" cy="163" rx="4" ry="5" fill="#2ECC71"/><ellipse cx="85" cy="164" rx="2" ry="4" fill="#1A1A2E"/><ellipse cx="95" cy="164" rx="2" ry="4" fill="#1A1A2E"/><path d="M84 170 Q90 174 96 170" fill="none" stroke="#C0605A" stroke-width="1.5"/><line x1="78" y1="168" x2="66" y2="166" stroke="#888" stroke-width="1.2"/><line x1="78" y1="170" x2="66" y2="171" stroke="#888" stroke-width="1.2"/><line x1="78" y1="172" x2="66" y2="174" stroke="#888" stroke-width="1.2"/><!-- Kedi 2 kuyruğu --><path d="M145 175 Q160 155 155 140" fill="none" stroke="#888" stroke-width="6" stroke-linecap="round"/><!-- Kedi 2 --><ellipse cx="145" cy="172" rx="20" ry="13" fill="#888"/><circle cx="135" cy="160" r="13" fill="#888"/><polygon points="128,151 124,141 135,147" fill="#888"/><polygon points="142,151 146,141 135,147" fill="#888"/><ellipse cx="130" cy="161" rx="4" ry="5" fill="#2ECC71"/><ellipse cx="140" cy="161" rx="4" ry="5" fill="#2ECC71"/><ellipse cx="130" cy="162" rx="2" ry="4" fill="#1A1A2E"/><ellipse cx="140" cy="162" rx="2" ry="4" fill="#1A1A2E"/><path d="M128 168 Q135 172 142 168" fill="none" stroke="#AAA" stroke-width="1.5"/><!-- Henna --><ellipse cx="300" cy="158" rx="23" ry="30" fill="#FF85A1"/><circle cx="300" cy="115" r="23" fill="#FDBCB4"/><path d="M279 108 Q300 96 321 108" fill="#4A2C0A"/><ellipse cx="293" cy="113" rx="4" ry="5" fill="#2C1810"/><ellipse cx="307" cy="113" rx="4" ry="5" fill="#2C1810"/><circle cx="294" cy="111" r="1.5" fill="white"/><circle cx="308" cy="111" r="1.5" fill="white"/><circle cx="285" cy="120" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="315" cy="120" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M293 125 Q300 131 307 125" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><rect x="284" y="185" width="9" height="22" fill="#FDBCB4" rx="3"/><rect x="302" y="185" width="9" height="22" fill="#FDBCB4" rx="3"/></svg>`,
  4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#7BC67E"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg4)"/><rect x="0" y="175" width="400" height="45" fill="#4CAF50"/><!-- Çimen --><ellipse cx="60" cy="175" rx="35" ry="11" fill="#66BB6A"/><ellipse cx="200" cy="172" rx="50" ry="13" fill="#81C784"/><ellipse cx="350" cy="174" rx="40" ry="12" fill="#66BB6A"/><!-- Top --><circle cx="320" cy="130" r="22" fill="#FF4444"/><path d="M300 120 Q320 112 340 120" fill="none" stroke="white" stroke-width="2"/><path d="M300 130 Q320 137 340 130" fill="none" stroke="white" stroke-width="2"/><line x1="320" y1="108" x2="320" y2="152" stroke="white" stroke-width="2"/><!-- Mustafa koşuyor --><ellipse cx="180" cy="150" rx="24" ry="28" fill="#3F51B5"/><circle cx="180" cy="112" r="23" fill="#FDBCB4"/><path d="M159 105 Q180 94 201 105" fill="#2C1810"/><ellipse cx="173" cy="111" rx="4" ry="5" fill="#2C1810"/><ellipse cx="187" cy="111" rx="4" ry="5" fill="#2C1810"/><circle cx="174" cy="109" r="1.5" fill="white"/><circle cx="188" cy="109" r="1.5" fill="white"/><circle cx="165" cy="118" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="195" cy="118" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M173 123 Q180 129 187 123" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Koşan kollar --><rect x="156" y="148" width="10" height="22" fill="#FDBCB4" rx="4" transform="rotate(-35,161,148)"/><rect x="194" y="148" width="10" height="22" fill="#FDBCB4" rx="4" transform="rotate(35,199,148)"/><!-- Koşan bacaklar --><rect x="168" y="176" width="10" height="26" fill="#FDBCB4" rx="4" transform="rotate(-15,173,176)"/><rect x="184" y="176" width="10" height="26" fill="#FDBCB4" rx="4" transform="rotate(20,189,176)"/><!-- Parlak ayakkabılar --><ellipse cx="164" cy="204" rx="13" ry="6" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/><ellipse cx="196" cy="200" rx="13" ry="6" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/><!-- Yıldız efekti ayakkabı --><text x="152" y="198" font-size="10" fill="white">✨</text><text x="198" y="194" font-size="10" fill="white">✨</text><!-- Su damlacıkları (çimen ıslak) --><circle cx="120" cy="172" r="3" fill="#4FC3F7" opacity="0.7"/><circle cx="240" cy="170" r="3" fill="#4FC3F7" opacity="0.7"/><circle cx="280" cy="173" r="3" fill="#4FC3F7" opacity="0.7"/></svg>`,
  5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#607D8B"/><stop offset="100%" stop-color="#90A4AE"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg5)"/><!-- Bulutlar (yağmurlu) --><ellipse cx="80" cy="45" rx="50" ry="25" fill="#78909C"/><ellipse cx="50" cy="52" rx="30" ry="20" fill="#607D8B"/><ellipse cx="110" cy="52" rx="30" ry="20" fill="#607D8B"/><ellipse cx="250" cy="38" rx="55" ry="27" fill="#78909C"/><ellipse cx="220" cy="46" rx="32" ry="21" fill="#607D8B"/><ellipse cx="282" cy="46" rx="32" ry="21" fill="#607D8B"/><!-- Yağmur damlaları --><g fill="#81D4FA" opacity="0.7"><line x1="40" y1="75" x2="36" y2="95" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="65" y1="72" x2="61" y2="92" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="90" y1="74" x2="86" y2="94" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="115" y1="70" x2="111" y2="90" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="220" y1="68" x2="216" y2="88" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="245" y1="65" x2="241" y2="85" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="270" y1="68" x2="266" y2="88" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="295" y1="65" x2="291" y2="85" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="155" y1="100" x2="151" y2="120" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="175" y1="105" x2="171" y2="125" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="330" y1="70" x2="326" y2="90" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/><line x1="355" y1="80" x2="351" y2="100" stroke="#81D4FA" stroke-width="2" stroke-linecap="round"/></g><rect x="0" y="178" width="400" height="42" fill="#5D6D7E"/><!-- Su birikintisi --><ellipse cx="200" cy="195" rx="60" ry="8" fill="#81D4FA" opacity="0.4"/><!-- Şemsiye --><path d="M200 75 Q200 115 240 120 Q200 120 200 120 Q200 120 160 120 Q200 115 200 75Z" fill="#FF5722"/><path d="M160 120 Q200 108 240 120" fill="none" stroke="#E64A19" stroke-width="2"/><line x1="200" y1="75" x2="200" y2="120" stroke="#E64A19" stroke-width="2"/><!-- Şemsiye sapı --><line x1="200" y1="120" x2="200" y2="168" stroke="#795548" stroke-width="3" stroke-linecap="round"/><!-- Asya --><circle cx="200" cy="148" r="20" fill="#FDBCB4"/><path d="M182 140 Q200 130 218 140" fill="#4A2C0A"/><ellipse cx="194" cy="147" rx="4" ry="5" fill="#2C1810"/><ellipse cx="206" cy="147" rx="4" ry="5" fill="#2C1810"/><circle cx="195" cy="145" r="1.5" fill="white"/><circle cx="207" cy="145" r="1.5" fill="white"/><circle cx="186" cy="153" r="5" fill="#FFB3BA" opacity="0.5"/><circle cx="214" cy="153" r="5" fill="#FFB3BA" opacity="0.5"/><path d="M193 158 Q200 163 207 158" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Annenin eli --><circle cx="240" cy="148" r="8" fill="#FDBCB4"/><!-- Su damlası ayakkabıda --><circle cx="195" cy="212" r="5" fill="#81D4FA" opacity="0.8"/><circle cx="205" cy="212" r="5" fill="#81D4FA" opacity="0.8"/></svg>`,
  6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#FFF9F0"/><!-- Raf --><rect x="40" y="60" width="320" height="12" fill="#8B5E3C" rx="3"/><rect x="40" y="155" width="320" height="12" fill="#8B5E3C" rx="3"/><!-- Kitaplar rafta --><rect x="55" y="25" width="22" height="35" fill="#E53935" rx="2"/><rect x="80" y="30" width="18" height="30" fill="#1E88E5" rx="2"/><rect x="101" y="22" width="25" height="38" fill="#43A047" rx="2"/><rect x="129" y="28" width="20" height="32" fill="#FB8C00" rx="2"/><rect x="152" y="24" width="23" height="36" fill="#8E24AA" rx="2"/><rect x="178" y="27" width="19" height="33" fill="#00ACC1" rx="2"/><rect x="200" y="22" width="24" height="38" fill="#E53935" rx="2"/><rect x="227" y="29" width="17" height="31" fill="#7CB342" rx="2"/><rect x="247" y="25" width="22" height="35" fill="#FFB300" rx="2"/><!-- Açık kitap masa üzerinde --><rect x="120" y="120" width="160" height="12" fill="#8B5E3C" rx="3"/><path d="M140 80 Q200 70 260 80 L260 120 Q200 110 140 120 Z" fill="white" stroke="#DDD" stroke-width="1.5"/><path d="M200 72 L200 120" stroke="#CCC" stroke-width="1.5"/><line x1="148" y1="88" x2="195" y2="88" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><line x1="148" y1="95" x2="195" y2="95" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><line x1="148" y1="102" x2="195" y2="102" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><line x1="148" y1="109" x2="195" y2="109" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><line x1="205" y1="88" x2="252" y2="88" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><line x1="205" y1="95" x2="252" y2="95" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><line x1="205" y1="102" x2="252" y2="102" stroke="#AAA" stroke-width="1.2" opacity="0.6"/><!-- Yusuf --><ellipse cx="85" cy="160" rx="20" ry="24" fill="#1565C0"/><circle cx="85" cy="130" r="20" fill="#FDBCB4"/><path d="M67 123 Q85 113 103 123" fill="#2C1810"/><ellipse cx="79" cy="129" rx="4" ry="5" fill="#2C1810"/><ellipse cx="91" cy="129" rx="4" ry="5" fill="#2C1810"/><circle cx="80" cy="127" r="1.5" fill="white"/><circle cx="92" cy="127" r="1.5" fill="white"/><circle cx="71" cy="136" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="99" cy="136" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M79 140 Q85 146 91 140" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Konuşma balonu --><rect x="110" y="108" width="100" height="35" fill="white" rx="10" stroke="#FFB300" stroke-width="2"/><polygon points="118,143 108,152 128,143" fill="white" stroke="#FFB300" stroke-width="1.5"/><text x="120" y="122" font-size="9" fill="#333" font-family="sans-serif">Bu kelime</text><text x="120" y="134" font-size="9" fill="#333" font-family="sans-serif">ne demek?</text></svg>`,
  7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#A5D6A7"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg7)"/><rect x="0" y="175" width="400" height="45" fill="#558B2F"/><!-- Çiçekler --><line x1="80" y1="175" x2="80" y2="130" stroke="#2E7D32" stroke-width="4"/><circle cx="80" cy="122" r="16" fill="#FF5722"/><circle cx="70" cy="126" r="8" fill="#FF7043"/><circle cx="90" cy="126" r="8" fill="#FF7043"/><circle cx="80" cy="115" r="8" fill="#FF7043"/><circle cx="80" cy="122" r="5" fill="#FFD600"/><!-- Çiçek 2 --><line x1="130" y1="175" x2="128" y2="125" stroke="#2E7D32" stroke-width="4"/><circle cx="128" cy="117" r="14" fill="#E040FB"/><circle cx="119" cy="121" r="7" fill="#CE93D8"/><circle cx="137" cy="121" r="7" fill="#CE93D8"/><circle cx="128" cy="111" r="7" fill="#CE93D8"/><circle cx="128" cy="117" r="4" fill="#FFD600"/><!-- Sulama kabı --><path d="M300 155 L285 180 L315 180 Z" fill="#4FC3F7"/><rect x="283" y="150" width="34" height="8" fill="#29B6F6" rx="2"/><path d="M317 154 Q335 150 338 165" fill="none" stroke="#29B6F6" stroke-width="3" stroke-linecap="round"/><!-- Su damlacıkları --><circle cx="335" cy="170" r="3" fill="#81D4FA"/><circle cx="342" cy="176" r="2" fill="#81D4FA"/><circle cx="348" cy="168" r="2.5" fill="#81D4FA"/><!-- Zeynep --><ellipse cx="200" cy="158" rx="23" ry="28" fill="#F06292"/><circle cx="200" cy="118" r="22" fill="#FDBCB4"/><path d="M180 110 Q200 100 220 110" fill="#4A2C0A"/><!-- Saç tokası --><circle cx="200" cy="100" r="5" fill="#FF4081"/><ellipse cx="193" cy="116" rx="4" ry="5" fill="#2C1810"/><ellipse cx="207" cy="116" rx="4" ry="5" fill="#2C1810"/><circle cx="194" cy="114" r="1.5" fill="white"/><circle cx="208" cy="114" r="1.5" fill="white"/><circle cx="185" cy="123" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="215" cy="123" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M193 128 Q200 134 207 128" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Kollar uzanmış (sulama yapıyor) --><rect x="221" y="152" width="10" height="24" fill="#FDBCB4" rx="4" transform="rotate(30,226,152)"/><rect x="169" y="150" width="10" height="20" fill="#FDBCB4" rx="4" transform="rotate(-20,174,150)"/><rect x="185" y="184" width="9" height="22" fill="#FDBCB4" rx="3"/><rect x="202" y="184" width="9" height="22" fill="#FDBCB4" rx="3"/></svg>`,
  8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#FFF3E0"/><!-- Masa --><rect x="60" y="155" width="280" height="12" fill="#8B5E3C" rx="3"/><rect x="72" y="167" width="10" height="35" fill="#7A4F2D"/><rect x="318" y="167" width="10" height="35" fill="#7A4F2D"/><!-- Resim kağıdı --><rect x="130" y="90" width="140" height="68" fill="white" rx="4" stroke="#DDD" stroke-width="2"/><!-- Çizilen resim --><circle cx="185" cy="112" r="14" fill="#FFE066" stroke="#FFB800" stroke-width="2"/><!-- Güneş ışınları --><line x1="185" y1="94" x2="185" y2="88" stroke="#FFB800" stroke-width="2"/><line x1="185" y1="130" x2="185" y2="136" stroke="#FFB800" stroke-width="2"/><line x1="167" y1="112" x2="161" y2="112" stroke="#FFB800" stroke-width="2"/><line x1="203" y1="112" x2="209" y2="112" stroke="#FFB800" stroke-width="2"/><!-- Ev --><polygon points="215,148 215,118 250,108 285,118 285,148" fill="#FF8A65"/><polygon points="210,120 250,105 290,120" fill="#E53935"/><rect x="228" y="130" width="15" height="18" fill="#4FC3F7"/><rect x="252" y="130" width="15" height="10" fill="#4FC3F7"/><!-- Boyalar --><circle cx="95" cy="105" r="10" fill="#FF5722"/><circle cx="95" cy="125" r="10" fill="#2196F3"/><circle cx="95" cy="145" r="10" fill="#4CAF50"/><!-- Fırça --><rect x="108" y="90" width="5" height="30" fill="#795548" rx="1"/><ellipse cx="110" cy="90" rx="5" ry="8" fill="#FF5722"/><!-- Maysa --><ellipse cx="310" cy="155" rx="22" ry="27" fill="#7B1FA2"/><circle cx="310" cy="116" r="21" fill="#FDBCB4"/><path d="M291 109 Q310 98 329 109" fill="#4A2C0A"/><!-- Saç bantı --><path d="M291 105 Q310 96 329 105" fill="none" stroke="#AB47BC" stroke-width="3"/><ellipse cx="303" cy="115" rx="4" ry="5" fill="#2C1810"/><ellipse cx="317" cy="115" rx="4" ry="5" fill="#2C1810"/><circle cx="304" cy="113" r="1.5" fill="white"/><circle cx="318" cy="113" r="1.5" fill="white"/><circle cx="295" cy="122" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="325" cy="122" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M303 127 Q310 133 317 127" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- El fırça tutuyor --><rect x="326" y="148" width="10" height="22" fill="#FDBCB4" rx="4" transform="rotate(15,331,148)"/></svg>`,
  9: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg9" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#64B5F6"/><stop offset="100%" stop-color="#A5D6A7"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg9)"/><rect x="0" y="180" width="400" height="40" fill="#558B2F"/><!-- Bulutlar --><ellipse cx="300" cy="50" rx="45" ry="20" fill="white" opacity="0.85"/><ellipse cx="275" cy="56" rx="25" ry="16" fill="white" opacity="0.85"/><ellipse cx="325" cy="56" rx="25" ry="16" fill="white" opacity="0.85"/><ellipse cx="80" cy="70" rx="35" ry="16" fill="white" opacity="0.7"/><!-- Uçurtma --><polygon points="200,30 165,70 200,95 235,70" fill="#FF5722"/><polygon points="200,30 200,95 235,70" fill="#FF7043" opacity="0.6"/><line x1="200" y1="30" x2="200" y2="95" stroke="#E64A19" stroke-width="1.5"/><line x1="165" y1="70" x2="235" y2="70" stroke="#E64A19" stroke-width="1.5"/><!-- Uçurtma kuyruğu --><path d="M200 95 Q210 110 195 125 Q210 138 200 150" fill="none" stroke="#FFB300" stroke-width="2.5" stroke-dasharray="5,3" stroke-linecap="round"/><!-- İp --><path d="M200 150 Q240 160 270 175" fill="none" stroke="#795548" stroke-width="1.5"/><!-- Mehmet --><ellipse cx="290" cy="165" rx="23" ry="27" fill="#1976D2"/><circle cx="290" cy="126" r="22" fill="#FDBCB4"/><path d="M270 119 Q290 108 310 119" fill="#2C1810"/><!-- Kep --><ellipse cx="290" cy="115" rx="22" ry="8" fill="#0D47A1"/><rect x="280" y="108" width="20" height="10" fill="#0D47A1" rx="2"/><rect x="268" y="113" width="12" height="4" fill="#0D47A1" rx="1"/><!-- Yüz --><ellipse cx="283" cy="125" rx="4" ry="5" fill="#2C1810"/><ellipse cx="297" cy="125" rx="4" ry="5" fill="#2C1810"/><circle cx="284" cy="123" r="1.5" fill="white"/><circle cx="298" cy="123" r="1.5" fill="white"/><circle cx="275" cy="131" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="305" cy="131" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M283 136 Q290 143 297 136" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Kol ip tutuyor --><rect x="311" y="155" width="10" height="22" fill="#FDBCB4" rx="4" transform="rotate(-20,316,155)"/><rect x="265" y="155" width="10" height="20" fill="#FDBCB4" rx="4" transform="rotate(20,270,155)"/><!-- Ayaklar --><rect x="278" y="190" width="9" height="20" fill="#FDBCB4" rx="3"/><rect x="295" y="190" width="9" height="20" fill="#FDBCB4" rx="3"/></svg>`,
  10: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#F3E5F5"/><!-- Raflar --><rect x="20" y="30" width="360" height="10" fill="#8B5E3C" rx="2"/><rect x="20" y="110" width="360" height="10" fill="#8B5E3C" rx="2"/><rect x="20" y="190" width="360" height="10" fill="#8B5E3C" rx="2"/><!-- Üst raf kitapları --><rect x="30" y="5" width="18" height="25" fill="#E53935" rx="1"/><rect x="51" y="8" width="15" height="22" fill="#1565C0" rx="1"/><rect x="69" y="4" width="20" height="26" fill="#2E7D32" rx="1"/><rect x="92" y="7" width="16" height="23" fill="#F57F17" rx="1"/><rect x="111" y="5" width="19" height="25" fill="#6A1B9A" rx="1"/><rect x="133" y="8" width="14" height="22" fill="#00838F" rx="1"/><rect x="150" y="4" width="21" height="26" fill="#BF360C" rx="1"/><rect x="174" y="7" width="17" height="23" fill="#1B5E20" rx="1"/><rect x="194" y="5" width="18" height="25" fill="#880E4F" rx="1"/><rect x="215" y="8" width="15" height="22" fill="#0D47A1" rx="1"/><!-- Alt raf kitapları --><rect x="30" y="85" width="18" height="25" fill="#FF7043" rx="1"/><rect x="51" y="88" width="15" height="22" fill="#7B1FA2" rx="1"/><rect x="69" y="84" width="20" height="26" fill="#00695C" rx="1"/><rect x="92" y="87" width="16" height="23" fill="#E91E63" rx="1"/><rect x="111" y="85" width="19" height="25" fill="#1976D2" rx="1"/><!-- Okuma masası --><rect x="180" y="148" width="200" height="10" fill="#A0522D" rx="2"/><rect x="192" y="158" width="10" height="30" fill="#8B4513"/><rect x="358" y="158" width="10" height="30" fill="#8B4513"/><!-- Açık kitap --><path d="M210 110 Q280 103 350 110 L350 148 Q280 142 210 148 Z" fill="white" stroke="#DDD" stroke-width="1"/><path d="M280 105 L280 148" stroke="#CCC" stroke-width="1.5"/><line x1="218" y1="120" x2="276" y2="120" stroke="#AAA" stroke-width="1" opacity="0.6"/><line x1="218" y1="128" x2="276" y2="128" stroke="#AAA" stroke-width="1" opacity="0.6"/><line x1="218" y1="136" x2="276" y2="136" stroke="#AAA" stroke-width="1" opacity="0.6"/><!-- Yağmur karakteri --><ellipse cx="100" cy="162" rx="22" ry="27" fill="#7986CB"/><circle cx="100" cy="122" r="21" fill="#FDBCB4"/><path d="M81 115 Q100 104 119 115" fill="#4A2C0A"/><ellipse cx="94" cy="121" rx="4" ry="5" fill="#2C1810"/><ellipse cx="106" cy="121" rx="4" ry="5" fill="#2C1810"/><circle cx="95" cy="119" r="1.5" fill="white"/><circle cx="107" cy="119" r="1.5" fill="white"/><circle cx="86" cy="128" r="6" fill="#FFB3BA" opacity="0.4"/><circle cx="114" cy="128" r="6" fill="#FFB3BA" opacity="0.4"/><path d="M93 132 Q100 138 107 132" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Parmak dudağa "sss" --><line x1="118" y1="122" x2="126" y2="118" stroke="#FDBCB4" stroke-width="2.5" stroke-linecap="round"/><circle cx="128" cy="117" r="4" fill="#FDBCB4"/><text x="133" y="115" font-size="11" fill="#7986CB" font-family="sans-serif" font-weight="bold">sss</text></svg>`,
  11: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg11" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#81D4FA"/><stop offset="100%" stop-color="#A5D6A7"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg11)"/><rect x="0" y="178" width="400" height="42" fill="#4CAF50"/><!-- Salıncak --><line x1="170" y1="20" x2="145" y2="120" stroke="#795548" stroke-width="4"/><line x1="230" y1="20" x2="255" y2="120" stroke="#795548" stroke-width="4"/><rect x="143" y="118" width="114" height="12" fill="#8D6E63" rx="5"/><!-- Çiçek --><circle cx="50" cy="180" r="8" fill="#FF85A1"/><circle cx="44" cy="174" r="5" fill="#FF85A1"/><circle cx="56" cy="174" r="5" fill="#FF85A1"/><line x1="50" y1="188" x2="50" y2="210" stroke="#4CAF50" stroke-width="3"/><!-- Çiçek karakteri (salıncakta) --><ellipse cx="185" cy="107" rx="18" ry="22" fill="#FF85A1"/><circle cx="185" cy="80" r="18" fill="#FDBCB4"/><path d="M169 73 Q185 63 201 73" fill="#4A2C0A"/><circle cx="185" cy="64" r="4" fill="#FF4081"/><ellipse cx="179" cy="79" rx="3" ry="4" fill="#2C1810"/><ellipse cx="191" cy="79" rx="3" ry="4" fill="#2C1810"/><circle cx="180" cy="77" r="1.2" fill="white"/><circle cx="192" cy="77" r="1.2" fill="white"/><path d="M180 87 Q185 93 190 87" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Yeni arkadaş --><ellipse cx="245" cy="107" rx="18" ry="22" fill="#64B5F6"/><circle cx="245" cy="80" r="18" fill="#FDBCB4"/><path d="M229 73 Q245 63 261 73" fill="#2C1810"/><ellipse cx="239" cy="79" rx="3" ry="4" fill="#2C1810"/><ellipse cx="251" cy="79" rx="3" ry="4" fill="#2C1810"/><circle cx="240" cy="77" r="1.2" fill="white"/><circle cx="252" cy="77" r="1.2" fill="white"/><path d="M239 87 Q245 93 251 87" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Kalpler --><text x="205" y="65" font-size="14" fill="#FF4081">♥</text><text x="220" y="55" font-size="10" fill="#FF4081">♥</text></svg>`,
  12: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#FFFDE7"/><!-- Masa --><rect x="80" y="140" width="240" height="12" fill="#8B5E3C" rx="3"/><rect x="92" y="152" width="10" height="40" fill="#7A4F2D"/><rect x="298" y="152" width="10" height="40" fill="#7A4F2D"/><!-- Çanta --><rect x="110" y="95" width="80" height="50" fill="#FF7043" rx="8"/><rect x="125" y="85" width="50" height="15" fill="#FF5722" rx="5"/><circle cx="150" cy="120" r="8" fill="#FFD600"/><!-- Küçük cep vurgulanmış --><rect x="280" y="100" width="45" height="38" fill="#FF9800" rx="6" stroke="#FFD600" stroke-width="2.5"/><!-- yıldız --><text x="293" y="125" font-size="16" fill="#FFD600">★</text><!-- Kalem çantadan çıkıyor --><rect x="295" y="88" width="6" height="20" fill="#FF5722" rx="2"/><ellipse cx="298" cy="88" rx="4" ry="5" fill="#FFD600"/><!-- Emir --><ellipse cx="200" cy="158" rx="23" ry="27" fill="#1565C0"/><circle cx="200" cy="118" r="22" fill="#FDBCB4"/><path d="M180 111 Q200 100 220 111" fill="#2C1810"/><ellipse cx="194" cy="117" rx="4" ry="5" fill="#2C1810"/><ellipse cx="206" cy="117" rx="4" ry="5" fill="#2C1810"/><circle cx="195" cy="115" r="1.5" fill="white"/><circle cx="207" cy="115" r="1.5" fill="white"/><circle cx="185" cy="124" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="215" cy="124" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M193 128 Q200 134 207 128" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Soru işareti balonu --><circle cx="240" cy="100" r="22" fill="#FFD600" opacity="0.9"/><text x="232" y="108" font-size="22" fill="#795548" font-weight="bold">?</text></svg>`,
  13: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg13" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#A5D6A7"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg13)"/><rect x="0" y="178" width="400" height="42" fill="#4CAF50"/><!-- Bank --><rect x="130" y="155" width="140" height="12" fill="#795548" rx="4"/><rect x="145" y="167" width="12" height="25" fill="#6D4C41"/><rect x="243" y="167" width="12" height="25" fill="#6D4C41"/><!-- Beyaz --><ellipse cx="175" cy="148" rx="22" ry="27" fill="#FF7043"/><circle cx="175" cy="108" r="21" fill="#FDBCB4"/><path d="M156 101 Q175 90 194 101" fill="#4A2C0A"/><ellipse cx="169" cy="107" rx="4" ry="5" fill="#2C1810"/><ellipse cx="181" cy="107" rx="4" ry="5" fill="#2C1810"/><circle cx="170" cy="105" r="1.5" fill="white"/><circle cx="182" cy="105" r="1.5" fill="white"/><path d="M169 118 Q175 124 181 118" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Bisküvi --><ellipse cx="190" cy="145" rx="16" ry="9" fill="#D7A96A" stroke="#B8860B" stroke-width="1.5"/><line x1="176" y1="145" x2="204" y2="145" stroke="#B8860B" stroke-width="1" opacity="0.5"/><!-- El uzanmış --><rect x="192" y="138" width="10" height="18" fill="#FDBCB4" rx="4" transform="rotate(25,197,138)"/><!-- Üzgün çocuk --><ellipse cx="245" cy="150" rx="21" ry="25" fill="#64B5F6"/><circle cx="245" cy="113" r="20" fill="#FDBCB4"/><path d="M228 107 Q245 97 262 107" fill="#2C1810"/><ellipse cx="239" cy="112" rx="4" ry="5" fill="#2C1810"/><ellipse cx="251" cy="112" rx="4" ry="5" fill="#2C1810"/><circle cx="240" cy="110" r="1.5" fill="white"/><circle cx="252" cy="110" r="1.5" fill="white"/><path d="M238 122 Q245 116 252 122" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Kalp --><text x="206" y="80" font-size="20" fill="#FF4081">♥</text></svg>`,
  14: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#E8EAF6"/><!-- Pencere --><rect x="40" y="30" width="100" height="120" fill="#B3E5FC" rx="5" stroke="#7986CB" stroke-width="3"/><line x1="90" y1="30" x2="90" y2="150" stroke="#7986CB" stroke-width="2"/><line x1="40" y1="90" x2="140" y2="90" stroke="#7986CB" stroke-width="2"/><!-- Güneş doğuyor --><circle cx="90" cy="28" r="18" fill="#FFB300" opacity="0.8"/><line x1="90" y1="6" x2="90" y2="0" stroke="#FFB300" stroke-width="2" opacity="0.7"/><!-- Alarm saati --><circle cx="300" cy="100" r="36" fill="white" stroke="#FF5722" stroke-width="4"/><circle cx="300" cy="100" r="4" fill="#333"/><line x1="300" y1="100" x2="300" y2="72" stroke="#333" stroke-width="3" stroke-linecap="round"/><!-- dakika --><line x1="300" y1="100" x2="320" y2="100" stroke="#333" stroke-width="3" stroke-linecap="round"/><!-- Çan --><circle cx="280" cy="68" r="6" fill="#FF5722"/><circle cx="320" cy="68" r="6" fill="#FF5722"/><!-- Titreme çizgileri --><line x1="258" y1="82" x2="252" y2="76" stroke="#FF5722" stroke-width="2" opacity="0.7"/><line x1="342" y1="82" x2="348" y2="76" stroke="#FF5722" stroke-width="2" opacity="0.7"/><!-- Yatak --><rect x="100" y="155" width="200" height="50" fill="#90CAF9" rx="8"/><rect x="100" y="148" width="60" height="25" fill="#EF9A9A" rx="5"/><!-- Kaan yatakta --><circle cx="165" cy="148" r="20" fill="#FDBCB4"/><path d="M147 141 Q165 130 183 141" fill="#2C1810"/><ellipse cx="159" cy="147" rx="4" ry="4" fill="#2C1810" opacity="0.5"/><!-- Gözler kapanmış --><path d="M155 147 Q159 151 163 147" fill="none" stroke="#2C1810" stroke-width="2"/><path d="M163 147 Q167 151 171 147" fill="none" stroke="#2C1810" stroke-width="2"/><!-- Z Z Z --><text x="185" y="140" font-size="14" fill="#7986CB" font-weight="bold">z</text><text x="198" y="128" font-size="18" fill="#7986CB" font-weight="bold">z</text><text x="213" y="114" font-size="22" fill="#7986CB" font-weight="bold">z</text></svg>`,
  15: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8F5E9"/><stop offset="100%" stop-color="#C8E6C9"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg15)"/><rect x="0" y="180" width="400" height="40" fill="#558B2F"/><!-- Güneş --><circle cx="340" cy="40" r="28" fill="#FFE066"/><line x1="340" y1="6" x2="340" y2="0" stroke="#FFB800" stroke-width="2"/><line x1="340" y1="74" x2="340" y2="80" stroke="#FFB800" stroke-width="2"/><!-- Saksı büyüme aşamaları --><rect x="60" y="162" width="35" height="28" fill="#FF7043" rx="4"/><rect x="68" y="150" width="19" height="14" fill="#8B4513" rx="2"/><!-- Tohum --><ellipse cx="78" cy="156" rx="6" ry="4" fill="#795548"/><!-- Ok --><text x="108" y="158" font-size="18" fill="#558B2F">→</text><!-- Saksı 2 filiz --><rect x="140" y="162" width="35" height="28" fill="#FF7043" rx="4"/><rect x="148" y="150" width="19" height="14" fill="#8B4513" rx="2"/><line x1="158" y1="150" x2="158" y2="130" stroke="#4CAF50" stroke-width="3"/><ellipse cx="152" cy="126" rx="8" ry="6" fill="#66BB6A"/><!-- Ok --><text x="188" y="158" font-size="18" fill="#558B2F">→</text><!-- Saksı 3 büyük --><rect x="220" y="162" width="40" height="28" fill="#FF7043" rx="4"/><rect x="230" y="150" width="20" height="14" fill="#8B4513" rx="2"/><line x1="240" y1="150" x2="240" y2="108" stroke="#4CAF50" stroke-width="3.5"/><circle cx="240" cy="100" r="14" fill="#FF5722"/><circle cx="230" cy="106" r="7" fill="#FF7043"/><circle cx="250" cy="106" r="7" fill="#FF7043"/><circle cx="240" cy="94" r="7" fill="#FF7043"/><circle cx="240" cy="100" r="4" fill="#FFD600"/><!-- Elvan --><ellipse cx="330" cy="160" rx="22" ry="27" fill="#CE93D8"/><circle cx="330" cy="120" r="21" fill="#FDBCB4"/><path d="M311 113 Q330 102 349 113" fill="#4A2C0A"/><ellipse cx="324" cy="119" rx="4" ry="5" fill="#2C1810"/><ellipse cx="336" cy="119" rx="4" ry="5" fill="#2C1810"/><circle cx="325" cy="117" r="1.5" fill="white"/><circle cx="337" cy="117" r="1.5" fill="white"/><circle cx="316" cy="126" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="344" cy="126" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M323 131 Q330 137 337 131" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/></svg>`,
  16: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#FFF8F0"/><!-- Mutfak arka plan --><rect x="0" y="0" width="400" height="130" fill="#FFF3E0"/><!-- Mutfak tezgahı --><rect x="0" y="130" width="400" height="20" fill="#BCAAA4"/><rect x="0" y="148" width="400" height="12" fill="#A1887F"/><!-- Dolap kapıları --><rect x="20" y="20" width="80" height="108" fill="#FFCCBC" rx="4" stroke="#FFAB91" stroke-width="2"/><rect x="60" y="20" width="2" height="108" fill="#FFAB91"/><circle cx="58" cy="74" r="5" fill="#FF8A65"/><!-- Kırık bardak --><g transform="translate(200, 150)"><polygon points="0,-15 12,-5 8,15 -8,15 -12,-5" fill="#B3E5FC" stroke="#81D4FA" stroke-width="1.5" opacity="0.8"/><polygon points="-20,5 -5,-10 -8,15 -18,15" fill="#B3E5FC" stroke="#81D4FA" stroke-width="1.5" opacity="0.8"/><polygon points="20,5 5,-10 8,15 18,15" fill="#B3E5FC" stroke="#81D4FA" stroke-width="1.5" opacity="0.8"/><!-- Su --><ellipse cx="0" cy="20" rx="25" ry="6" fill="#81D4FA" opacity="0.4"/></g><!-- Yıldız etkisi --><text x="225" y="145" font-size="14" fill="#FFD600">✦</text><text x="245" y="155" font-size="10" fill="#FFD600">✦</text><!-- Berk --><ellipse cx="310" cy="162" rx="22" ry="27" fill="#42A5F5"/><circle cx="310" cy="122" r="21" fill="#FDBCB4"/><path d="M291 115 Q310 104 329 115" fill="#2C1810"/><ellipse cx="304" cy="121" rx="4" ry="5" fill="#2C1810"/><ellipse cx="316" cy="121" rx="4" ry="5" fill="#2C1810"/><circle cx="305" cy="119" r="1.5" fill="white"/><circle cx="317" cy="119" r="1.5" fill="white"/><!-- Endişeli ifade --><path d="M303 132 Q310 128 317 132" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Kaşlar --><path d="M300 116 Q304 112 308 116" fill="none" stroke="#8B5E3C" stroke-width="2"/><path d="M312 116 Q316 112 320 116" fill="none" stroke="#8B5E3C" stroke-width="2"/><!-- Yanak kızarma --><circle cx="296" cy="128" r="7" fill="#FFB3BA" opacity="0.6"/><circle cx="324" cy="128" r="7" fill="#FFB3BA" opacity="0.6"/><!-- Anne eli omuzda --><circle cx="285" cy="148" r="9" fill="#FDBCB4"/><rect x="265" y="138" width="22" height="14" fill="#E91E63" rx="4"/></svg>`,
  17: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#F1F8E9"/><!-- Okul arka planı --><rect x="0" y="0" width="400" height="80" fill="#E8EAF6"/><!-- Tahta --><rect x="40" y="20" width="200" height="55" fill="#388E3C" rx="4"/><text x="55" y="52" font-size="12" fill="white" font-family="sans-serif">Grup Ödevi ✓</text><!-- Masa --><rect x="30" y="140" width="340" height="12" fill="#8B5E3C" rx="3"/><rect x="42" y="152" width="10" height="35" fill="#7A4F2D"/><rect x="348" y="152" width="10" height="35" fill="#7A4F2D"/><!-- Afiş (üzerinde çalışıyorlar) --><rect x="90" y="95" width="220" height="48" fill="white" rx="4" stroke="#FFD600" stroke-width="2"/><!-- Afiş içeriği --><circle cx="130" cy="119" r="10" fill="#FF5722"/><rect x="150" y="109" width="50" height="6" fill="#AAA" rx="2"/><rect x="150" y="119" width="70" height="6" fill="#AAA" rx="2"/><rect x="150" y="129" width="55" height="6" fill="#AAA" rx="2"/><rect x="230" y="106" width="65" height="36" fill="#E8F5E9" rx="3" stroke="#66BB6A" stroke-width="1.5"/><!-- Defne boyuyor --><ellipse cx="310" cy="155" rx="20" ry="25" fill="#AB47BC"/><circle cx="310" cy="118" r="19" fill="#FDBCB4"/><path d="M293 111 Q310 101 327 111" fill="#4A2C0A"/><ellipse cx="304" cy="117" rx="3" ry="4" fill="#2C1810"/><ellipse cx="316" cy="117" rx="3" ry="4" fill="#2C1810"/><circle cx="305" cy="115" r="1.2" fill="white"/><circle cx="317" cy="115" r="1.2" fill="white"/><path d="M303 127 Q310 133 317 127" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Fırça eli --><rect x="326" y="143" width="8" height="20" fill="#FDBCB4" rx="3" transform="rotate(15,330,143)"/><!-- Diğer çocuklar --><circle cx="110" cy="118" r="16" fill="#FDBCB4"/><path d="M96 112 Q110 103 124 112" fill="#2C1810"/><ellipse cx="105" cy="117" rx="3" ry="4" fill="#2C1810"/><ellipse cx="115" cy="117" rx="3" ry="4" fill="#2C1810"/><path d="M104 124 Q110 130 116 124" fill="none" stroke="#C0605A" stroke-width="1.5" stroke-linecap="round"/><!-- Öğretmen onaylıyor --><text x="170" y="75" font-size="16" fill="#FFD600">★★★</text></svg>`,
  18: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#E8EAF6"/><!-- Sınıf --><rect x="0" y="0" width="400" height="90" fill="#C5CAE9"/><!-- Tahta --><rect x="20" y="15" width="360" height="70" fill="#388E3C" rx="4"/><!-- Şiir satırları tahtada --><line x1="40" y1="32" x2="200" y2="32" stroke="white" stroke-width="1.5" opacity="0.5"/><line x1="40" y1="44" x2="180" y2="44" stroke="white" stroke-width="1.5" opacity="0.5"/><line x1="40" y1="56" x2="200" y2="56" stroke="white" stroke-width="1.5" opacity="0.5"/><line x1="40" y1="68" x2="170" y2="68" stroke="white" stroke-width="1.5" opacity="0.5"/><!-- Sıralar --><rect x="20" y="168" width="100" height="40" fill="#9FA8DA" rx="4"/><rect x="150" y="168" width="100" height="40" fill="#9FA8DA" rx="4"/><rect x="280" y="168" width="100" height="40" fill="#9FA8DA" rx="4"/><!-- Arkadaşlar alkışlıyor --><circle cx="60" cy="162" r="14" fill="#FDBCB4"/><circle cx="190" cy="162" r="14" fill="#FDBCB4"/><circle cx="340" cy="162" r="14" fill="#FDBCB4"/><!-- Eller alkış --><text x="42" y="185" font-size="12">👏</text><text x="172" y="185" font-size="12">👏</text><text x="322" y="185" font-size="12">👏</text><!-- Aras önde duruyor --><ellipse cx="240" cy="142" rx="23" ry="28" fill="#F57F17"/><circle cx="240" cy="102" r="22" fill="#FDBCB4"/><path d="M220 95 Q240 84 260 95" fill="#2C1810"/><ellipse cx="234" cy="101" rx="4" ry="5" fill="#2C1810"/><ellipse cx="246" cy="101" rx="4" ry="5" fill="#2C1810"/><circle cx="235" cy="99" r="1.5" fill="white"/><circle cx="247" cy="99" r="1.5" fill="white"/><circle cx="225" cy="108" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="255" cy="108" r="6" fill="#FFB3BA" opacity="0.5"/><!-- Gülümseme --><path d="M233 113 Q240 120 247 113" fill="none" stroke="#C0605A" stroke-width="2.5" stroke-linecap="round"/><!-- Kağıt elinde --><rect x="256" y="128" width="22" height="28" fill="white" rx="2" stroke="#DDD" stroke-width="1"/><line x1="259" y1="134" x2="275" y2="134" stroke="#AAA" stroke-width="1"/><line x1="259" y1="139" x2="275" y2="139" stroke="#AAA" stroke-width="1"/><line x1="259" y1="144" x2="273" y2="144" stroke="#AAA" stroke-width="1"/><!-- Yıldızlar --><text x="140" y="90" font-size="14" fill="#FFD600">★</text><text x="158" y="78" font-size="18" fill="#FFD600">★</text><text x="178" y="88" font-size="14" fill="#FFD600">★</text></svg>`,
  19: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg19" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#A5D6A7"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg19)"/><rect x="0" y="178" width="400" height="42" fill="#4CAF50"/><!-- Park yolu --><rect x="100" y="160" width="200" height="20" fill="#B0BEC5" rx="3"/><!-- Cüzdan yerde --><rect x="175" y="168" width="50" height="35" fill="#795548" rx="5"/><rect x="179" y="172" width="42" height="27" fill="#8D6E63" rx="3"/><!-- Para görünüyor --><rect x="183" y="175" width="34" height="18" fill="#4CAF50" rx="2"/><line x1="183" y1="180" x2="217" y2="180" stroke="#388E3C" stroke-width="1.5"/><line x1="183" y1="186" x2="217" y2="186" stroke="#388E3C" stroke-width="1.5"/><!-- Yıldız parlaması --><text x="155" y="170" font-size="12" fill="#FFD600">✦</text><text x="232" y="175" font-size="10" fill="#FFD600">✦</text><!-- İlayda --><ellipse cx="280" cy="158" rx="22" ry="27" fill="#E91E63"/><circle cx="280" cy="118" r="21" fill="#FDBCB4"/><path d="M261 111 Q280 100 299 111" fill="#4A2C0A"/><!-- Uzun saç --><path d="M259 115 Q252 140 258 160" fill="none" stroke="#4A2C0A" stroke-width="6" stroke-linecap="round"/><path d="M301 115 Q308 140 302 160" fill="none" stroke="#4A2C0A" stroke-width="6" stroke-linecap="round"/><ellipse cx="274" cy="117" rx="4" ry="5" fill="#2C1810"/><ellipse cx="286" cy="117" rx="4" ry="5" fill="#2C1810"/><circle cx="275" cy="115" r="1.5" fill="white"/><circle cx="287" cy="115" r="1.5" fill="white"/><circle cx="266" cy="124" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="294" cy="124" r="6" fill="#FFB3BA" opacity="0.5"/><path d="M273 129 Q280 135 287 129" fill="none" stroke="#C0605A" stroke-width="2" stroke-linecap="round"/><!-- Eğilmiş (cüzdanı almak için) --><rect x="264" y="178" width="10" height="22" fill="#FDBCB4" rx="3" transform="rotate(20,269,178)"/><!-- Kalp balonu --><text x="295" y="105" font-size="16" fill="#FF4081">♥</text></svg>`,
  20: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect width="400" height="220" fill="#FFF8E7"/><!-- Masa --><rect x="60" y="145" width="280" height="12" fill="#8B5E3C" rx="3"/><rect x="72" y="157" width="10" height="40" fill="#7A4F2D"/><rect x="318" y="157" width="10" height="40" fill="#7A4F2D"/><!-- Uçak parçaları dağınık --><rect x="100" y="110" width="25" height="12" fill="#90CAF9" rx="3" transform="rotate(-15,112,116)"/><rect x="135" y="118" width="35" height="8" fill="#64B5F6" rx="2"/><polygon points="170,95 155,120 185,120" fill="#42A5F5"/><!-- Tamamlanmış uçak --><rect x="200" y="95" width="80" height="18" fill="#1565C0" rx="5"/><!-- Kanatlar --><polygon points="240,95 210,75 270,75" fill="#1976D2"/><polygon points="240,113 215,130 265,130" fill="#1976D2"/><!-- Kuyruk --><polygon points="280,95 295,80 295,113" fill="#0D47A1"/><!-- Pencereler --><circle cx="218" cy="104" r="5" fill="#B3E5FC"/><circle cx="234" cy="104" r="5" fill="#B3E5FC"/><circle cx="250" cy="104" r="5" fill="#B3E5FC"/><!-- Yıldız --><text x="285" y="100" font-size="14" fill="#FFD600">★</text><!-- Onur --><ellipse cx="320" cy="158" rx="22" ry="27" fill="#FF7043"/><circle cx="320" cy="118" r="21" fill="#FDBCB4"/><path d="M301 111 Q320 100 339 111" fill="#2C1810"/><ellipse cx="314" cy="117" rx="4" ry="5" fill="#2C1810"/><ellipse cx="326" cy="117" rx="4" ry="5" fill="#2C1810"/><circle cx="315" cy="115" r="1.5" fill="white"/><circle cx="327" cy="115" r="1.5" fill="white"/><circle cx="306" cy="124" r="6" fill="#FFB3BA" opacity="0.5"/><circle cx="334" cy="124" r="6" fill="#FFB3BA" opacity="0.5"/><!-- Geniş gülümseme --><path d="M312 129 Q320 137 328 129" fill="none" stroke="#C0605A" stroke-width="2.5" stroke-linecap="round"/><!-- Kaldırılmış yumruk (başardım!) --><rect x="336" y="138" width="10" height="20" fill="#FDBCB4" rx="4" transform="rotate(-30,341,138)"/><!-- Gurur yıldızları --><text x="340" y="95" font-size="12" fill="#FFD600">★</text><text x="353" y="108" font-size="16" fill="#FFD600">★</text><text x="340" y="122" font-size="12" fill="#FFD600">★</text></svg>`,
  21: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><defs><linearGradient id="bg21" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF9C4"/><stop offset="100%" stop-color="#FFECB3"/></linearGradient></defs><rect width="400" height="220" fill="url(#bg21)"/><!-- Ay ve yıldızlar (gece) --><circle cx="340" cy="35" r="28" fill="#FFF176"/><circle cx="355" cy="25" r="18" fill="#FFF9C4"/><!-- Yıldızlar --><text x="40" y="30" font-size="14" fill="#FFD600">★</text><text x="100" y="45" font-size="10" fill="#FFD600">★</text><text x="160" y="25" font-size="16" fill="#FFD600">★</text><text x="220" y="40" font-size="12" fill="#FFD600">★</text><text x="280" y="20" font-size="10" fill="#FFD600">★</text><!-- Yatak --><rect x="60" y="148" width="280" height="55" fill="#90CAF9" rx="10"/><rect x="60" y="140" width="90" height="30" fill="#EF9A9A" rx="6"/><rect x="250" y="140" width="90" height="30" fill="#CE93D8" rx="6"/><!-- Henna uyuyor --><circle cx="110" cy="140" r="20" fill="#FDBCB4"/><path d="M93 133 Q110 122 127 133" fill="#4A2C0A"/><!-- Uyuyan gözler --><path d="M101 139 Q105 143 109 139" fill="none" stroke="#2C1810" stroke-width="2"/><path d="M111 139 Q115 143 119 139" fill="none" stroke="#2C1810" stroke-width="2"/><circle cx="96" cy="145" r="5" fill="#FFB3BA" opacity="0.4"/><!-- Asya uyuyor --><circle cx="290" cy="140" r="20" fill="#FDBCB4"/><path d="M273 133 Q290 122 307 133" fill="#4A2C0A"/><!-- Uyuyan gözler --><path d="M281 139 Q285 143 289 139" fill="none" stroke="#2C1810" stroke-width="2"/><path d="M291 139 Q295 143 299 139" fill="none" stroke="#2C1810" stroke-width="2"/><circle cx="304" cy="145" r="5" fill="#FFB3BA" opacity="0.4"/><!-- Kedi yatakta --><ellipse cx="200" cy="168" rx="25" ry="14" fill="#F4A460"/><circle cx="192" cy="157" r="13" fill="#F4A460"/><polygon points="185,147 181,137 192,143" fill="#F4A460"/><polygon points="199,147 203,137 192,143" fill="#F4A460"/><!-- Kedi gözleri (uykuya dalmış) --><path d="M186 157 Q189 160 192 157" fill="none" stroke="#2C1810" stroke-width="1.5"/><path d="M192 157 Q195 160 198 157" fill="none" stroke="#2C1810" stroke-width="1.5"/><!-- Z Z Z --><text x="215" y="148" font-size="10" fill="#9E9E9E">z</text><text x="226" y="138" font-size="13" fill="#9E9E9E">z</text><text x="238" y="126" font-size="16" fill="#9E9E9E">z</text><!-- Diş fırçası --><rect x="30" y="175" width="5" height="28" fill="#7986CB" rx="2"/><ellipse cx="32" cy="175" rx="8" ry="5" fill="#7986CB"/><!-- Diş fırçası 2 --><rect x="365" y="175" width="5" height="28" fill="#F06292" rx="2"/><ellipse cx="367" cy="175" rx="8" ry="5" fill="#F06292"/></svg>`,
};

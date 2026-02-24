// ═══════════════════════════════════════════════════════════════
//  UZAY YOLU
// ═══════════════════════════════════════════════════════════════
(function(){
"use strict";

// MEB sırasına göre soru-cevap çiftleri: {soru, dogru, yanlis}
const SORULAR=[
  // Seviye 1: E L A K İ N
  {soru:'"EL" mi yoksa "LA" mı?',dogru:'EL',yanlis:'LA'},
  {soru:'"KAL" mı yoksa "KEL" mi?',dogru:'KAL',yanlis:'KEL'},
  {soru:'"İNEK" mi yoksa "EKİ" mi?',dogru:'İNEK',yanlis:'EKİ'},
  {soru:'"ALİ" mi yoksa "ELİ" mi?',dogru:'ALİ',yanlis:'ELİ'},
  {soru:'"KALE" mi yoksa "LEKE" mi?',dogru:'KALE',yanlis:'LEKE'},
  {soru:'"EKİN" mi yoksa "İKEN" mi?',dogru:'EKİN',yanlis:'İKEN'},
  // Seviye 2: O M U T Ü Y
  {soru:'"OKUL" mu yoksa "KOLU" mu?',dogru:'OKUL',yanlis:'KOLU'},
  {soru:'"MUTLU" mu yoksa "TULMU" mu?',dogru:'MUTLU',yanlis:'TULMU'},
  {soru:'"ÜTÜYÜ" mü yoksa "YÜÜTÜ" mü?',dogru:'ÜTÜYÜ',yanlis:'YÜÜTÜ'},
  {soru:'"YOLU" mu yoksa "LOYU" mu?',dogru:'YOLU',yanlis:'LOYU'},
  {soru:'"METE" mi yoksa "TEME" mi?',dogru:'METE',yanlis:'TEME'},
  {soru:'"TÜYLÜ" mü yoksa "LÜYTÜ" mü?',dogru:'TÜYLÜ',yanlis:'LÜYTÜ'},
  // Seviye 3: A R I B D S
  {soru:'"ARABA" mı yoksa "BARAA" mı?',dogru:'ARABA',yanlis:'BARAA'},
  {soru:'"BALIK" mı yoksa "LAKIB" mı?',dogru:'BALIK',yanlis:'LAKIB'},
  {soru:'"DEREde" mi yoksa "REDEde" mi?',dogru:'DERE',yanlis:'REDE'},
  {soru:'"RESIM" mi yoksa "SİREM" mi?',dogru:'RESİM',yanlis:'SİREM'},
  {soru:'"SÖYLE" mi yoksa "ÖYSLE" mi?',dogru:'SÖYLE',yanlis:'ÖYSLE'},
  // Seviye 4: Ç G Ş Z P
  {soru:'"ÇİÇEK" mi yoksa "İÇÇEK" mi?',dogru:'ÇİÇEK',yanlis:'İÇÇEK'},
  {soru:'"GÖZLÜK" mü yoksa "ZÖGÜLK" mü?',dogru:'GÖZLÜK',yanlis:'ZÖGÜLK'},
  {soru:'"ŞEKER" mi yoksa "KEŞER" mi?',dogru:'ŞEKER',yanlis:'KEŞER'},
  {soru:'"ÇİLEK" mi yoksa "İLEÇK" mi?',dogru:'ÇİLEK',yanlis:'İLEÇK'},
  {soru:'"PAZAR" mı yoksa "ZAPAR" mı?',dogru:'PAZAR',yanlis:'ZAPAR'},
  // Seviye 5: H F V
  {soru:'"HAVA" mı yoksa "AVAH" mı?',dogru:'HAVA',yanlis:'AVAH'},
  {soru:'"FİLMİ" mi yoksa "LİFMİ" mi?',dogru:'FİLMİ',yanlis:'LİFMİ'},
  {soru:'"VAHŞI" mı yoksa "HAŞVI" mı?',dogru:'VAHŞİ',yanlis:'HAŞVİ'},
];

let soruIndex=0,puan=0,durduruldu=false;
let mevcutSoru=null,cevapBekleniyor=false;

const alan    = document.getElementById('uzayAlan');
const puanEl  = document.getElementById('uzayScore');

function render(){
  if(!alan)return;
  alan.innerHTML='';

  mevcutSoru=SORULAR[soruIndex%SORULAR.length];
  // Sağ/sol rastgele yerleştir
  const solMu=Math.random()>0.5;
  const solMetin=solMu?mevcutSoru.dogru:mevcutSoru.yanlis;
  const sagMetin=solMu?mevcutSoru.yanlis:mevcutSoru.dogru;

  alan.innerHTML=`
    <div class="uzay-soru-kart">${mevcutSoru.soru}</div>
    <div class="uzay-gemi-alan">
      <div class="uzay-gemi" id="uzayGemi">🚀</div>
    </div>
    <div class="uzay-yollar">
      <div class="uzay-yol" id="uzayYolSol" data-dir="SOL" data-deger="${solMetin}">${solMetin}</div>
      <div class="uzay-yol" id="uzayYolSag" data-dir="SAĞ" data-deger="${sagMetin}">${sagMetin}</div>
    </div>
  `;

  cevapBekleniyor=true;
  document.getElementById('uzayYolSol').addEventListener('click',()=>cevapla(solMetin));
  document.getElementById('uzayYolSag').addEventListener('click',()=>cevapla(sagMetin));
}

function cevapla(secilen){
  if(!cevapBekleniyor||durduruldu)return;
  cevapBekleniyor=false;
  const dogru=secilen===mevcutSoru.dogru;
  const gemi=document.getElementById('uzayGemi');
  const yollar=alan.querySelectorAll('.uzay-yol');

  yollar.forEach(y=>{
    if(y.dataset.deger===mevcutSoru.dogru)y.classList.add('uzay-yol--dogru');
    else if(y.dataset.deger===secilen&&!dogru)y.classList.add('uzay-yol--yanlis');
  });

  if(dogru){
    puan+=15;
    if(puanEl)puanEl.textContent=puan;
    if(window.koyunSkoru)window.koyunSkoru(15);
    if(gemi)gemi.classList.add('hizlan');
    audioFeedback(true);
  } else {
    puan=Math.max(0,puan-5);
    if(puanEl)puanEl.textContent=puan;
    audioFeedback(false);
  }

  soruIndex++;
  setTimeout(()=>{if(!durduruldu)render();},1000);
}

function audioFeedback(dogru){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    if(dogru){osc.frequency.setValueAtTime(660,ctx.currentTime);osc.frequency.setValueAtTime(880,ctx.currentTime+0.12);}
    else{osc.frequency.setValueAtTime(250,ctx.currentTime);osc.frequency.setValueAtTime(180,ctx.currentTime+0.15);}
    gain.gain.setValueAtTime(0.25,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.35);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.35);
  }catch(e){}
}

window.uzayBas=function(){
  durduruldu=false;
  puan=0;soruIndex=0;
  if(puanEl)puanEl.textContent=0;
  render();
};

window.uzayDurdur=function(){
  durduruldu=true;
  cevapBekleniyor=false;
};

})();

"use strict";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// ─── DOM ───────────────────────────────────────────────────────────────────────
const btnStart=document.getElementById('btnStart'),btnStop=document.getElementById('btnStop'),btnSkip=document.getElementById('btnSkip'),wordCard=document.getElementById('wordCard'),scoreDisplay=document.getElementById('scoreDisplay'),micIndicator=document.getElementById('micIndicator'),micStatus=document.getElementById('micStatus'),interimText=document.getElementById('interimText'),congratsBanner=document.getElementById('congratsBanner'),errorMsg=document.getElementById('errorMsg'),noSupport=document.getElementById('noSupport'),tabAlistirma=document.getElementById('tabAlistirma'),tabHikaye=document.getElementById('tabHikaye'),storyProgress=document.getElementById('storyProgress'),storyTitle=document.getElementById('storyTitle'),storyBar=document.getElementById('storyBar'),storyProgressText=document.getElementById('storyProgressText'),btnHikayeGeri=document.getElementById('btnHikayeGeri'),btnHikayeIleri=document.getElementById('btnHikayeIleri'),reportOverlay=document.getElementById('reportOverlay'),reportEmoji=document.getElementById('reportEmoji'),reportTitle=document.getElementById('reportTitle'),reportSubtitle=document.getElementById('reportSubtitle'),reportDogru=document.getElementById('reportDogru'),reportYanlis=document.getElementById('reportYanlis'),reportPuan=document.getElementById('reportPuan'),reportHardWords=document.getElementById('reportHardWords'),reportHardList=document.getElementById('reportHardList'),reportTimerWrap=document.getElementById('reportTimerWrap'),reportTimerBar=document.getElementById('reportTimerBar'),reportBtnRow=document.getElementById('reportBtnRow'),levelSelector=document.querySelector('.level-selector');
if(!SpeechRecognition){if(noSupport)noSupport.classList.add('visible');if(btnStart)btnStart.disabled=true;}

// ─── Cümle Grupları (MEB) ─────────────────────────────────────────────────────
const CUMLE_GRUPLARI=[["Ali kal","Lale al","İnek kal","Ekin al","Kale al","Ali kale","İnek al","Kel kal","Lale kal","Ali ile kal","İnek kale","Ekin ile al","Kale kal","Ali inek","Lale ile kal"],["Mete kal","Ütü al","Yol kal","Okul al","Mutlu ol","Mete yolu al","Tüm yol kal","Yolun otu","Mutlu lale","Okulun yolu","Ütüyü al","Ütü koy","Mete okul","Tüm okul","Yolu taklit et"],["Arı bal al","Balık al","Bırak onu","Dere kal","Resim kal","Söyle bana","Dondurma al","Araba sür","Bal kadar","Sıra kal","Bırak al","Dere balık","Arı uyu","Ördek al","Büyük ördek"],["Çiçek al","Gül bak","Şeker al","Çanta bul","Pazara git","Gözlük al","Çocuk gel","Şeker çok","Çilek al","Pazarda bul","Gözleri sil","Çanta doldur","Şeker bul","Çiçek bak","Pazarda kal"],["Hava güzel","Filmi gör","Vahşi hayvan","Hafif gel","Varmak için git","Filmi ver","Havaya bak","Ağaç var","Hava çok güzel","Filmi bitir","Fırın al","Havuz var","Fındık al","Hızla gel","Yavaş git"]];
const HIKAYE_GRUPLARI=[["Mina kırmızı oyuncak arabasını aldı.","Arabayı yere koydu ve hafifçe itti.","Araba hızla ilerledi ve masanın ayağına çarptı.","Mina önce şaşırdı, sonra gülmeye başladı.","Arabasını dikkatli sürmesi gerektiğini anladı.","Soru: Mina arabasını sürerken neyi fark etti?"],["Baran yapboz parçalarını masaya yaydı.","Önce köşe parçalarını buldu.","Parçaları birleştirirken sabırlı davrandı.","Sonunda güzel bir hayvan resmi ortaya çıktı.","Baran başardığı için gurur duydu.","Soru: Baran yapbozu tamamlarken nasıl davrandı?"],["Henna bahçeye çıktığında iki küçük kedi çimenlerde oynuyordu.","Kediler bir kelebeği kovalamaya başladı.","Henna da onların peşinden koştu ama dikkatli yürüdü.","Kediler yorulunca gölgede dinlendiler.","Henna onları severken mutlu hissetti.","Soru: Kediler yorulunca ne yaptılar?"],["Mustafa yeni ayakkabılarını giydi.","Çimlerde top oynamaya başladı.","Koşarken ayakkabılarının çok rahat olduğunu fark etti.","Ama çimenler ıslaktı ve biraz kaydı.","Mustafa dikkatli olması gerektiğini öğrendi.","Soru: Mustafa neden dikkatli olması gerektiğini anladı?"],["Asya camdan dışarı baktı.","Yağmur yağıyordu.","Şemsiyesini alıp annesiyle dışarı çıktı.","Su birikintilerine basmamaya çalıştı ama birine bastı.","Ayakkabıları ıslandı.","Asya eve dönünce kuru çorap giydi.","Soru: Asya'nın ayakkabıları neden ıslandı?"],["Yusuf kitaplığından bir hikaye kitabı seçti.","Kitabı sessizce okumaya başladı.","Anlamadığı bir kelimeyi annesine sordu.","Yeni kelimenin anlamını öğrenince hikayeyi daha iyi anladı.","Soru: Yusuf anlamadığı kelimeyi öğrenince ne oldu?"],["Zeynep bahçedeki çiçekleri suladı.","Bazı çiçeklerin yaprakları solmuştu.","Daha fazla su verdikten sonra birkaç gün bekledi.","Çiçekler yeniden canlandı.","Zeynep sabırlı olmanın önemini öğrendi.","Soru: Çiçekler nasıl yeniden canlandı?"],["Maysa resim defterini açtı.","Önce güneş çizdi, sonra bir ev yaptı.","Boyarken çizgilerin dışına taştı ama pes etmedi.","Resmini tamamladığında çok güzel görünüyordu.","Soru: Maysa resim yaparken vazgeçti mi?"],["Mehmet uçurtmasını gökyüzüne bıraktı.","Rüzgar hafif esiyordu.","Uçurtma bazen düşer gibi oldu ama Mehmet ipi sıkı tuttu.","Bir süre sonra uçurtma daha yükseğe çıktı.","Soru: Uçurtma neden düşmedi?"],["Yağmur kütüphaneye gitti.","Sessiz olması gerektiğini biliyordu.","Kitabını dikkatle seçti ve yerine oturdu.","Çevresindekileri rahatsız etmeden okudu.","Soru: Yağmur kütüphanede neden sessiz davrandı?"],["Çiçek parkta tek başına oturan bir çocuk gördü.","Yanına gidip selam verdi.","Birlikte salıncağa bindiler.","O gün yeni bir arkadaş edindi.","Soru: Çiçek yeni arkadaşını nasıl kazandı?"],["Emir ödev yapmak için masaya oturdu.","Kalemini bulamadı.","Çantasını ve masasını aradı ama kalem yoktu.","Sonra dün parkta ders çalıştığını hatırladı.","Çantasının küçük cebine baktı ve kalemini buldu.","Emir eşyalarını düzenli koyması gerektiğini anladı.","Soru: Emir kalemini nerede buldu?"],["Beyaz parkta bisküviyle oturuyordu.","Yanındaki çocuk üzgün görünüyordu çünkü yiyeceği yoktu.","Beyaz bisküvisini ikiye böldü ve yarısını verdi.","Çocuk gülümsedi.","Beyaz paylaşmanın insanı mutlu ettiğini fark etti.","Soru: Beyaz neden mutlu oldu?"],["Kaan sabah alarmı duydu ama kapattı.","Biraz daha uyumak istedi.","Uyandığında okula geç kaldığını fark etti.","Aceleyle hazırlandı ama servisi kaçırdı.","Ertesi gün alarm çalınca hemen kalktı.","Soru: Kaan servisi neden kaçırdı?"],["Elvan küçük bir saksıya tohum ekti.","Her gün düzenli olarak suladı.","İlk gün hiçbir şey çıkmadı.","Elvan biraz üzüldü ama beklemeye devam etti.","Birkaç gün sonra küçük bir filiz gördü.","Sabırlı olmanın önemli olduğunu öğrendi.","Soru: Bitki neden büyüdü?"],["Berk mutfakta su almak istedi.","Bardağı hızlıca aldı ve elinden düşürdü.","Bardak kırıldı.","Berk korktu ama annesine gerçeği söyledi.","Annesi dikkatli olması gerektiğini anlattı.","Berk bir dahaki sefere yavaş davranmaya karar verdi.","Soru: Berk neden annesine gerçeği söyledi?"],["Defne okulda grup çalışması yaptı.","Herkes bir görev aldı.","Defne afişi boyadı.","Arkadaşı yazıları yazdı.","Birlikte çalışınca ödevleri daha güzel oldu.","Öğretmenleri onları tebrik etti.","Soru: Ödev neden güzel oldu?"],["Aras sınıfta şiir okumaktan çekiniyordu.","Sırası geldiğinde kalbi hızlı attı.","Derin bir nefes aldı ve okumaya başladı.","Arkadaşları onu dikkatle dinledi.","Şiiri bitirdiğinde alkış aldı.","Aras cesur davrandığı için gurur duydu.","Soru: Aras neden gurur duydu?"],["İlayda parkta oynarken yerde bir cüzdan buldu.","İçinde para ve kimlik vardı.","Parayı almak istemedi.","En yakın görevliye götürdü.","Cüzdanın sahibi gelip teşekkür etti.","İlayda doğru olanı yaptığı için mutlu oldu.","Soru: İlayda cüzdanı neden görevliye verdi?"],["Onur yeni bir model uçak yapmak istedi.","Parçaları birleştirirken zorlandı.","Birkaç kez hata yaptı.","Sinirlenmek yerine talimatlara tekrar baktı.","Yavaşça devam etti.","Sonunda uçağı tamamladı.","Onur sabırlı olunca başarabildiğini anladı.","Soru: Onur modeli nasıl tamamladı?"],["Henna ve Asya sabah uyandı.","Birlikte dışarı çıktılar.","Kedilerini sevip bir süre izlediler.","Sonra saklambaç oynadılar ve çok eğlendiler.","Eve dönünce ellerini yıkadılar.","Birlikte biraz dinlendiler.","Akşam yemek yediler ve dişlerini fırçaladılar.","Gece olunca mutlu bir günün ardından uyudular.","Soru: Henna ve Asya gün içinde birlikte neler yaptılar?"]];
const HIKAYE_ISIMLERI=['Mina ve Oyuncak Arabası','Baran ve Yapboz','Henna ve Kediler','Mustafa ve Yeni Ayakkabıları','Asya ve Yağmur','Yusuf ve Kitap','Zeynep ve Çiçekler','Maysa ve Resim','Mehmet ve Uçurtma','Yağmur ve Kütüphane','Çiçek ve Dostluk','Emir ve Kayıp Kalem','Beyaz ve Paylaşmak','Kaan ve Zamanında Uyanmak','Elvan ve Bitki','Berk ve Kırılan Bardak','Defne ve Grup Çalışması','Aras ve Cesaret','İlayda ve Doğru Karar','Onur ve Sabır','Henna ve Asya'];

// ─── State ────────────────────────────────────────────────────────────────────
const LS_KEY='minikOkur_v2';

// Merkezi rozet tanımları — 8 rozet, puan eşiğine göre
const ROZETLER=[
  {id:'minikOkur',     emoji:'🌱', baslik:'Minik Okur',     aciklama:'İlk adımını attın!',  esik:10},
  {id:'caliskan',      emoji:'⭐', baslik:'Çalışkan',        aciklama:'50 puana ulaştın!',   esik:50},
  {id:'harfUstasi',    emoji:'🔤', baslik:'Harf Ustası',     aciklama:'150 puana ulaştın!',  esik:150},
  {id:'kelimeUstasi',  emoji:'📖', baslik:'Kelime Ustası',   aciklama:'300 puana ulaştın!',  esik:300},
  {id:'yildizOkur',    emoji:'🌟', baslik:'Yıldız Okur',    aciklama:'500 puana ulaştın!',  esik:500},
  {id:'minikSampiyon', emoji:'🏅', baslik:'Minik Şampiyon', aciklama:'750 puana ulaştın!',  esik:750},
  {id:'superOkur',     emoji:'🏆', baslik:'Süper Okur',      aciklama:'1000 puana ulaştın!', esik:1000},
  {id:'efsane',        emoji:'👑', baslik:'Efsane',          aciklama:'1500 puana ulaştın!', esik:1500},
];

let grupIndex=0,cumleIndex=0,hikayeModu=false,hikayeIndex=0,hikayeCumle=0;
let bolumDogru=0,bolumYanlis=0,kelimeHatalar={};
let targetWords=[],wordSpans=[],currentWordIndex=0,score=0,totalScore=0;
let yanlisSayac=0,yanlisSayacIndex=-1,denemeHakki=0;
let endGameTimer=null;
let kazanilanRozetler=[];
let tamamlananHikayeler=new Array(HIKAYE_GRUPLARI.length).fill(false);
let mikIzniAlindi=false;

function HEDEF_METIN(){return hikayeModu?HIKAYE_GRUPLARI[hikayeIndex][hikayeCumle%HIKAYE_GRUPLARI[hikayeIndex].length]:CUMLE_GRUPLARI[grupIndex][cumleIndex%CUMLE_GRUPLARI[grupIndex].length];}

function kaydet(){try{localStorage.setItem(LS_KEY,JSON.stringify({grupIndex,cumleIndex,hikayeModu,hikayeIndex,hikayeCumle,totalScore,kazanilanRozetler,tamamlananHikayeler}));}catch(e){}}
function yukle(){try{const d=JSON.parse(localStorage.getItem(LS_KEY)||'null');if(!d)return;grupIndex=d.grupIndex||0;cumleIndex=d.cumleIndex||0;hikayeModu=d.hikayeModu||false;hikayeIndex=d.hikayeIndex||0;hikayeCumle=d.hikayeCumle||0;totalScore=d.totalScore||0;if(Array.isArray(d.kazanilanRozetler))kazanilanRozetler=d.kazanilanRozetler.slice();if(Array.isArray(d.tamamlananHikayeler))tamamlananHikayeler=d.tamamlananHikayeler.slice();}catch(e){}}

// ─── SpeechController ─────────────────────────────────────────────────────────
const SpeechController=(function(){
let recognition=null,recState='idle',isSpeaking=false,lastError=null,silenceTimer=null,restartTimer=null,watchdogTimer=null,trVoiceCache=null;
function getTrVoice(){if(trVoiceCache)return trVoiceCache;const v=window.speechSynthesis?window.speechSynthesis.getVoices():[];trVoiceCache=v.find(x=>x.lang==='tr-TR'&&x.localService)||v.find(x=>x.lang==='tr-TR')||null;return trVoiceCache;}
if(window.speechSynthesis)window.speechSynthesis.onvoiceschanged=()=>{trVoiceCache=null;getTrVoice();};
function clrTimers(){if(silenceTimer){clearTimeout(silenceTimer);silenceTimer=null;}if(restartTimer){clearTimeout(restartTimer);restartTimer=null;}if(watchdogTimer){clearTimeout(watchdogTimer);watchdogTimer=null;}}
function resetWatchdog(){if(watchdogTimer)clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{watchdogTimer=null;if(isSpeaking||currentWordIndex>=targetWords.length)return;if(recState!=='listening')scheduleRestart(100);else resetWatchdog();},3000);}
function scheduleRestart(ms){if(restartTimer)clearTimeout(restartTimer);restartTimer=setTimeout(()=>{restartTimer=null;if(!isSpeaking&&recState==='idle')_start();},ms||300);}
function resetSilenceTimer(){if(silenceTimer)clearTimeout(silenceTimer);if(recState!=='listening')return;silenceTimer=setTimeout(()=>{if(recState==='listening'&&!isSpeaking&&currentWordIndex<targetWords.length){stopAll();if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;if(micStatus)micStatus.textContent='Başlamak için düğmeye bas';}},25000);}
function _build(){if(!SpeechRecognition)return;if(recognition){recognition.onresult=null;recognition.onerror=null;recognition.onend=null;try{recognition.abort();}catch(e){}}recognition=new SpeechRecognition();recognition.lang='tr-TR';recognition.continuous=true;recognition.interimResults=true;recognition.maxAlternatives=5;recognition.onstart=_onStart;recognition.onresult=_onResult;recognition.onerror=_onError;recognition.onend=_onEnd;}
function _onStart(){recState='listening';resetWatchdog();if(micIndicator)micIndicator.className='mic-indicator active';if(micStatus){micStatus.className='mic-status listening';micStatus.textContent='🎤 Dinliyorum...';}}
function _onResult(event){if(!event||!event.results||isSpeaking)return;resetWatchdog();if(interimText)interimText.textContent=event.results[event.results.length-1][0].transcript;resetSilenceTimer();for(let i=event.resultIndex;i<event.results.length;i++){if(event.results[i].isFinal)continue;if(currentWordIndex>=targetWords.length)break;const tokenler=normalizeText(event.results[i][0].transcript);for(let t=0;t<tokenler.length;t++){if(currentWordIndex>=targetWords.length)break;if(kelimeEslesir(tokenler[t],targetWords[currentWordIndex]))validateWord(tokenler[t]);}}for(let i=event.resultIndex;i<event.results.length;i++){if(!event.results[i].isFinal)continue;const sonuc=event.results[i];const altDizisi=[];for(let a=0;a<sonuc.length;a++)altDizisi.push({transcript:sonuc[a].transcript,confidence:sonuc[a].confidence||0});altDizisi.sort((x,y)=>y.confidence-x.confidence);const altTokenler=altDizisi.map(alt=>normalizeText(alt.transcript));const anaTokenler=altTokenler[0]||[];for(let t=0;t<anaTokenler.length;t++){if(currentWordIndex>=targetWords.length)break;const hedef=targetWords[currentWordIndex];let bulunan=null;for(let a=0;a<altTokenler.length;a++){const tok=altTokenler[a][t];if(tok&&kelimeEslesir(tok,hedef)){bulunan=tok;break;}}if(!bulunan){for(let a=0;a<altTokenler.length;a++){for(let p=0;p<altTokenler[a].length;p++){const tok=altTokenler[a][p];if(tok&&kelimeEslesir(tok,hedef)){bulunan=tok;break;}}if(bulunan)break;}}if(bulunan)validateWord(bulunan);}}}
function _onError(event){lastError=event.error;if(event.error==='not-allowed'||event.error==='service-not-allowed'){gosterHata('Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin ver.');recState='idle';if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;}else if(event.error==='network'){gosterHata('Ağ hatası. İnternet bağlantını kontrol et.');}}
function _onEnd(){recState='idle';if(lastError==='not-allowed'||lastError==='service-not-allowed')return;if(currentWordIndex>=targetWords.length||isSpeaking)return;scheduleRestart(300);}
function _start(){if(!SpeechRecognition||recState==='starting'||recState==='listening'||isSpeaking)return;if(lastError==='not-allowed'||lastError==='service-not-allowed')return;if(errorMsg)errorMsg.classList.remove('visible');lastError=null;_build();recState='starting';try{recognition.start();if(interimText)interimText.textContent='';}catch(e){recState='idle';if(e.name==='InvalidStateError')scheduleRestart(500);else gosterHata('Mikrofon başlatılamadı: '+e.message);}}
function stopAll(){isSpeaking=false;if(window.speechSynthesis)window.speechSynthesis.cancel();clrTimers();if(recState!=='idle'){recState='stopping';if(recognition){try{recognition.stop();}catch(e){}}}if(micIndicator)micIndicator.className='mic-indicator';if(micStatus){micStatus.className='mic-status';micStatus.textContent='Başlamak için düğmeye bas';}if(interimText)interimText.textContent='';}
return{
startListening(){lastError=null;resetWatchdog();scheduleRestart(100);},
speakCorrection(metin,opts){if(!window.speechSynthesis)return;opts=opts||{};isSpeaking=true;window.speechSynthesis.cancel();clrTimers();if(recognition&&recState!=='idle'){recState='stopping';try{recognition.abort();}catch(e){}}if(micIndicator)micIndicator.className='mic-indicator speaking';if(micStatus){micStatus.className='mic-status speaking';micStatus.textContent='🔊 Dinle...';}if(interimText)interimText.textContent='';const ut=new SpeechSynthesisUtterance(metin);ut.lang='tr-TR';ut.rate=opts.rate||0.80;ut.pitch=opts.pitch||1.05;ut.volume=1;const voice=getTrVoice();if(voice)ut.voice=voice;ut.onend=()=>{isSpeaking=false;if(micIndicator)micIndicator.className='mic-indicator';if(micStatus){micStatus.className='mic-status';micStatus.textContent='';}if(currentWordIndex<targetWords.length){resetWatchdog();scheduleRestart(250);}};ut.onerror=()=>{isSpeaking=false;if(micIndicator)micIndicator.className='mic-indicator';if(micStatus)micStatus.className='mic-status';if(currentWordIndex<targetWords.length){resetWatchdog();scheduleRestart(300);}};setTimeout(()=>{window.speechSynthesis.speak(ut);},150);},
stopAll,
isSpeaking(){return isSpeaking;},
isListening(){return recState==='listening';}
};
})();

// ─── Normalizasyon & Eşleşme ──────────────────────────────────────────────────
function normalizeText(metin){if(!metin||typeof metin!=='string')return[];let s=metin.replace(/I/g,'ı').replace(/İ/g,'i').toLocaleLowerCase('tr-TR');s=s.replace(/[^\p{L}\s]/gu,'');return s.split(/\s+/).filter(t=>t.length>0);}
function levenshtein(a,b){const m=a.length,n=b.length;if(m===0)return n;if(n===0)return m;const dp=[];for(let i=0;i<=m;i++)dp[i]=[i];for(let j=0;j<=n;j++)dp[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);return dp[m][n];}
const FONETIK_HARITA=[['r','l'],['l','r'],['s','ş'],['ş','s'],['c','ç'],['ç','c'],['b','p'],['p','b'],['d','t'],['t','d'],['g','k'],['k','g'],['v','f'],['f','v']];
function fonetikNormalize(k,h){let s=k;for(let i=0;i<h.length&&i<s.length;i++){if(s[i]!==h[i]){const e=FONETIK_HARITA.find(([a,b])=>a===s[i]&&b===h[i]);if(e)s=s.slice(0,i)+h[i]+s.slice(i+1);}}return s;}
function kelimeEslesir(k,h){if(k===h)return true;const f=fonetikNormalize(k,h);if(f===h)return true;const dist=Math.min(levenshtein(k,h),levenshtein(f,h));const maxLen=Math.max(h.length,k.length);const dogruluk=(1-dist/maxLen)*100;if(hikayeModu){const esik=h.length<=5?75:h.length<=8?80:85;return dogruluk>=esik;}const tolerans=h.length<=3?1:h.length<=5?2:h.length<=8?3:4;const minD=h.length<=4?55:h.length<=6?62:68;if(dogruluk<minD)return false;return dist<=Math.min(tolerans,Math.floor(maxLen*0.45));}

// ─── UI ───────────────────────────────────────────────────────────────────────
function updateUI(){wordSpans.forEach((span,i)=>{if(i===currentWordIndex&&!span.classList.contains('correct')&&!span.classList.contains('wrong'))span.className='word active';});const eskiPuan=parseInt(scoreDisplay.textContent,10);scoreDisplay.textContent=totalScore;if(totalScore!==eskiPuan){scoreDisplay.classList.remove('bump');void scoreDisplay.offsetWidth;scoreDisplay.classList.add('bump');}}
function oyunuKur(){const metin=HEDEF_METIN();targetWords=normalizeText(metin);const fragment=document.createDocumentFragment();wordSpans=[];const orijinal=metin.split(/\s+/);targetWords.forEach((k,i)=>{const span=document.createElement('span');span.className='word'+(i===0?' active':'');span.textContent=orijinal[i]||k;span.dataset.index=i;fragment.appendChild(span);wordSpans.push(span);});wordCard.innerHTML='';wordCard.appendChild(fragment);const adet=targetWords.length;wordCard.dataset.wordcount=adet<=3?'small':adet<=5?'medium':'large';}
function validateWord(konusulan){if(currentWordIndex>=targetWords.length)return;const tokenler=normalizeText(konusulan);if(!tokenler.length)return;const token=tokenler[0],hedef=targetWords[currentWordIndex],span=wordSpans[currentWordIndex];if(kelimeEslesir(token,hedef)){kelimeKabul(span,hedef);}else{if(yanlisSayacIndex!==currentWordIndex){yanlisSayac=0;yanlisSayacIndex=currentWordIndex;denemeHakki=0;}yanlisSayac++;if(yanlisSayac===1){bolumYanlis++;kelimeHatalar[hedef]=(kelimeHatalar[hedef]||0)+1;}if(denemeHakki===0){denemeHakki=1;span.style.transform='scale(1.06)';span.style.background='rgba(255,209,102,0.18)';span.style.borderColor='var(--yellow)';span.style.color='var(--yellow)';if(micStatus)micStatus.textContent='💪 Tekrar deneyelim!';setTimeout(()=>{if(currentWordIndex<targetWords.length&&wordSpans[currentWordIndex]===span){span.style.transform='';span.style.background='';span.style.borderColor='';span.style.color='';span.className='word active';if(micStatus)micStatus.textContent='🎤 Dinliyorum...';}},800);}else{denemeHakki=0;kelimeKabul(span,hedef);}}}
function kelimeKabul(span,hedef){span.className='word correct';score+=1;totalScore+=1;bolumDogru++;yanlisSayac=0;yanlisSayacIndex=-1;denemeHakki=0;currentWordIndex++;requestAnimationFrame(updateUI);kontrolRozetler();if(currentWordIndex===targetWords.length){endGame();}}
function gosterHata(mesaj){if(errorMsg){errorMsg.textContent=mesaj;errorMsg.classList.add('visible');}}
function syncLevelButtons(){document.querySelectorAll('.lvl-btn').forEach(btn=>{btn.classList.toggle('active',parseInt(btn.dataset.level,10)===grupIndex);});}
function updateStoryProgress(){if(!hikayeModu){if(storyProgress)storyProgress.classList.remove('visible');return;}if(storyProgress)storyProgress.classList.add('visible');const hikaye=HIKAYE_GRUPLARI[hikayeIndex];if(storyTitle)storyTitle.textContent='📖 '+HIKAYE_ISIMLERI[hikayeIndex];if(storyProgressText)storyProgressText.textContent=(hikayeCumle+1)+' / '+hikaye.length;if(storyBar)storyBar.style.width=Math.round(((hikayeCumle+1)/hikaye.length)*100)+'%';}
function menuSkorGuncelle(){
  const el1=document.getElementById('menuScoreText'),el2=document.getElementById('menuTotalScore');
  if(el1)el1.textContent=totalScore;
  if(el2)el2.textContent=totalScore;
  // Oyun içi badge'leri de güncelle
  document.querySelectorAll('.oyun-toplam-puan').forEach(el=>el.textContent=totalScore);
  menuRozetGuncelle();
}

// ─── Rapor ────────────────────────────────────────────────────────────────────
function gosterRapor(opts){reportEmoji.textContent=opts.emoji||'🌟';reportTitle.textContent=opts.title||'Tamamlandı!';reportSubtitle.textContent=opts.subtitle||'';reportDogru.textContent=bolumDogru;reportYanlis.textContent=bolumYanlis;reportPuan.textContent=totalScore;const hatalar=Object.entries(kelimeHatalar).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);if(hatalar.length){reportHardList.textContent='';hatalar.forEach((k,i)=>{const s=document.createElement('strong');s.textContent=k;reportHardList.appendChild(s);if(i<hatalar.length-1){const sep=document.createTextNode('  ·  ');reportHardList.appendChild(sep);}});reportHardWords.style.display='block';}else reportHardWords.style.display='none';reportBtnRow.innerHTML='';if(opts.onTekrar){const btn=document.createElement('button');btn.className='report-btn secondary';btn.textContent='🔄 Tekrar Oku';btn.onclick=()=>{kapatRapor();opts.onTekrar();};reportBtnRow.appendChild(btn);}const btnNext=document.createElement('button');btnNext.className='report-btn primary';btnNext.textContent=opts.nextLabel||'▶ Devam';btnNext.onclick=()=>{kapatRapor();opts.onDevam();};reportBtnRow.appendChild(btnNext);if(opts.autoMs&&opts.autoMs>0){reportTimerWrap.style.display='block';reportTimerBar.style.transition='none';reportTimerBar.style.width='100%';requestAnimationFrame(()=>requestAnimationFrame(()=>{reportTimerBar.style.transition='width '+opts.autoMs+'ms linear';reportTimerBar.style.width='0%';}));const t=setTimeout(()=>{kapatRapor();opts.onDevam();},opts.autoMs);reportBtnRow.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>clearTimeout(t),{once:true}));}else reportTimerWrap.style.display='none';reportOverlay.classList.add('visible');}
function kapatRapor(){reportOverlay.classList.remove('visible');}
function sifirlaIstatistik(){bolumDogru=0;bolumYanlis=0;kelimeHatalar={};}

// ─── Rozet ────────────────────────────────────────────────────────────────────
const achToast=document.getElementById('achToast'),achToastTitle=document.getElementById('achToastTitle'),achToastDesc=document.getElementById('achToastDesc');
let toastTimer=null;

function rozetGoster(baslik,aciklama){
  if(achToastTitle)achToastTitle.textContent=baslik;
  if(achToastDesc)achToastDesc.textContent=aciklama;
  if(achToast)achToast.classList.add('visible');
  if(toastTimer)clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{if(achToast)achToast.classList.remove('visible');toastTimer=null;},3500);
}

// Puan değişiminde rozet kontrolü yap — tek merkezi fonksiyon
function kontrolRozetler(){
  ROZETLER.forEach(r=>{
    if(!kazanilanRozetler.includes(r.id) && totalScore>=r.esik){
      kazanilanRozetler.push(r.id);
      rozetGoster(r.emoji+' '+r.baslik, r.aciklama);
      kaydet();
      menuRozetGuncelle();
    }
  });
}

// Menü footer rozet alanını güncelle
function menuRozetGuncelle(){
  const alan=document.getElementById('menuRozetAlan');
  if(!alan)return;
  // Kazanılan rozetlerin son 4'ünü göster
  const gorunecek=ROZETLER.filter(r=>kazanilanRozetler.includes(r.id)).slice(-4);
  if(gorunecek.length===0){
    alan.innerHTML='<span style="color:rgba(255,255,255,0.5);font-size:0.8rem;font-family:Nunito,sans-serif;">Henüz rozet kazanılmadı</span>';
  } else {
    alan.innerHTML=gorunecek.map(r=>`<span title="${r.baslik}" style="font-size:1.6rem;cursor:default;">${r.emoji}</span>`).join('');
  }
}

// ─── Oyun akışı ───────────────────────────────────────────────────────────────
function sonrakiCumleyeGec(){if(hikayeModu){hikayeCumle++;const hikaye=HIKAYE_GRUPLARI[hikayeIndex];if(hikayeCumle>=hikaye.length){hikayeCumle=0;hikayeIndex=hikayeIndex<HIKAYE_GRUPLARI.length-1?hikayeIndex+1:0;}updateStoryProgress();}else{cumleIndex++;if(cumleIndex>=CUMLE_GRUPLARI[grupIndex].length){cumleIndex=0;if(grupIndex<CUMLE_GRUPLARI.length-1){grupIndex++;if(micStatus)micStatus.textContent='🌟 Yeni harf grubu!';syncLevelButtons();}}}kaydet();}
function resetCumle(){currentWordIndex=0;score=0;yanlisSayac=0;yanlisSayacIndex=-1;if(interimText)interimText.textContent='';if(congratsBanner)congratsBanner.classList.remove('visible');if(errorMsg)errorMsg.classList.remove('visible');oyunuKur();SpeechController.startListening();}
function endGame(){SpeechController.stopAll();wordSpans.forEach((span,i)=>{if(i>=currentWordIndex&&!span.classList.contains('correct'))span.className='word wrong';});if(congratsBanner)congratsBanner.classList.add('visible');if(wordCard){wordCard.classList.add('celebrate');setTimeout(()=>wordCard.classList.remove('celebrate'),600);}if(btnStop)btnStop.disabled=true;if(btnStart)btnStart.disabled=false;if(micStatus)micStatus.textContent='🎉 Harika iş çıkardın!';if(endGameTimer)clearTimeout(endGameTimer);
if(hikayeModu){const hikaye=HIKAYE_GRUPLARI[hikayeIndex];const sonCumle=(hikayeCumle===hikaye.length-1);if(sonCumle){tamamlananHikayeler[hikayeIndex]=true;kaydet();endGameTimer=setTimeout(()=>{endGameTimer=null;if(congratsBanner)congratsBanner.classList.remove('visible');if(errorMsg)errorMsg.classList.remove('visible');if(btnStop)btnStop.disabled=false;if(btnStart)btnStart.disabled=false;const dp=bolumDogru+bolumYanlis>0?Math.round((bolumDogru/(bolumDogru+bolumYanlis))*100):100;gosterRapor({emoji:dp>=90?'🏆':dp>=70?'⭐':'💪',title:'📖 Hikaye Bitti!',subtitle:HIKAYE_ISIMLERI[hikayeIndex]+' · %'+dp+' doğru',autoMs:0,nextLabel:'▶ Sonraki Hikaye',onTekrar:()=>{hikayeCumle=0;sifirlaIstatistik();resetCumle();},onDevam:()=>{sonrakiCumleyeGec();sifirlaIstatistik();resetCumle();}});},1200);}else{endGameTimer=setTimeout(()=>{endGameTimer=null;if(congratsBanner)congratsBanner.classList.remove('visible');if(errorMsg)errorMsg.classList.remove('visible');if(btnStop)btnStop.disabled=false;if(btnStart)btnStart.disabled=false;sonrakiCumleyeGec();resetCumle();},2000);}}else{const sonCumle=(cumleIndex===CUMLE_GRUPLARI[grupIndex].length-1);if(sonCumle){endGameTimer=setTimeout(()=>{endGameTimer=null;if(congratsBanner)congratsBanner.classList.remove('visible');if(errorMsg)errorMsg.classList.remove('visible');if(btnStop)btnStop.disabled=false;if(btnStart)btnStart.disabled=false;const dp=bolumDogru+bolumYanlis>0?Math.round((bolumDogru/(bolumDogru+bolumYanlis))*100):100;gosterRapor({emoji:dp>=90?'🏆':dp>=70?'⭐':'💪',title:(grupIndex+1)+'. Bölüm Tamamlandı!',subtitle:'Harika iş çıkardın! %'+dp+' doğru',autoMs:5000,nextLabel:'▶ Sonraki Bölüm',onDevam:()=>{sonrakiCumleyeGec();sifirlaIstatistik();resetCumle();}});},1200);}else{endGameTimer=setTimeout(()=>{endGameTimer=null;if(congratsBanner)congratsBanner.classList.remove('visible');if(errorMsg)errorMsg.classList.remove('visible');if(btnStop)btnStop.disabled=false;if(btnStart)btnStart.disabled=false;sonrakiCumleyeGec();resetCumle();},2000);}}}

// ─── Sesli Okuma buton olayları ───────────────────────────────────────────────
if(btnStart)btnStart.addEventListener('click',()=>{if(errorMsg)errorMsg.classList.remove('visible');btnStart.disabled=true;btnStop.disabled=false;SpeechController.startListening();currentWordIndex=0;score=0;yanlisSayac=0;yanlisSayacIndex=-1;if(interimText)interimText.textContent='';if(congratsBanner)congratsBanner.classList.remove('visible');oyunuKur();});
if(btnStop)btnStop.addEventListener('click',()=>{SpeechController.stopAll();btnStart.disabled=false;btnStop.disabled=true;if(micStatus)micStatus.textContent='Başlamak için düğmeye bas';});
if(btnSkip)btnSkip.addEventListener('click',()=>{SpeechController.stopAll();bolumYanlis++;sonrakiCumleyeGec();sifirlaIstatistik();resetCumle();btnStart.disabled=true;btnStop.disabled=false;});
document.querySelectorAll('.lvl-btn').forEach(btn=>{btn.addEventListener('click',()=>{grupIndex=parseInt(btn.dataset.level,10);cumleIndex=0;syncLevelButtons();kaydet();SpeechController.stopAll();if(!btnStart.disabled){btnStart.disabled=true;btnStop.disabled=false;currentWordIndex=0;score=0;sifirlaIstatistik();resetCumle();SpeechController.startListening();}else{sifirlaIstatistik();oyunuKur();}});});
if(tabAlistirma)tabAlistirma.addEventListener('click',()=>{hikayeModu=false;tabAlistirma.classList.add('active');tabHikaye.classList.remove('active');if(levelSelector)levelSelector.style.display='';cumleIndex=0;kaydet();if(storyProgress)storyProgress.classList.remove('visible');SpeechController.stopAll();sifirlaIstatistik();oyunuKur();if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;});
if(tabHikaye)tabHikaye.addEventListener('click',()=>{hikayeModu=true;tabHikaye.classList.add('active');tabAlistirma.classList.remove('active');if(levelSelector)levelSelector.style.display='none';kaydet();updateStoryProgress();SpeechController.stopAll();sifirlaIstatistik();oyunuKur();if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;});
if(btnHikayeGeri)btnHikayeGeri.addEventListener('click',()=>{if(!hikayeModu)return;hikayeIndex=hikayeIndex>0?hikayeIndex-1:HIKAYE_GRUPLARI.length-1;hikayeCumle=0;kaydet();updateStoryProgress();SpeechController.stopAll();sifirlaIstatistik();oyunuKur();if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;});
if(btnHikayeIleri)btnHikayeIleri.addEventListener('click',()=>{if(!hikayeModu)return;hikayeIndex=hikayeIndex<HIKAYE_GRUPLARI.length-1?hikayeIndex+1:0;hikayeCumle=0;kaydet();updateStoryProgress();SpeechController.stopAll();sifirlaIstatistik();oyunuKur();if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;});

// ─── Mikrofon izin yönetimi ───────────────────────────────────────────────────
function mikIzniSorVeBasla(cb){if(mikIzniAlindi){if(cb)cb(true);return;}if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){mikIzniAlindi=true;if(cb)cb(true);return;}navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{stream.getTracks().forEach(t=>t.stop());mikIzniAlindi=true;if(cb)cb(true);}).catch(()=>{gosterHata('Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin ver.');if(cb)cb(false);});}
function mikrofoniSerbest(){SpeechController.stopAll();mikIzniAlindi=false;}

// ══════════════════════════════════════════════════════════════════════════════
//  EKRAN NAVİGASYON
// ══════════════════════════════════════════════════════════════════════════════
const menuScreen=document.getElementById('menuScreen'),gameContainer=document.getElementById('gameContainer'),koyunScreen=document.getElementById('koyunScreen'),kelimeDunyaScreen=document.getElementById('kelimeDunyaScreen'),oyunKoseScreen=document.getElementById('oyunKoseScreen'),balonScreen=document.getElementById('balonScreen'),uzayScreen=document.getElementById('uzayScreen'),hazineScreen=document.getElementById('hazineScreen'),hafizaScreen=document.getElementById('hafizaScreen'),yapbozScreen=document.getElementById('yapbozScreen'),betaModalOverlay=document.getElementById('betaModalOverlay'),betaDevamBtn=document.getElementById('betaDevamBtn'),betaGeriBtn=document.getElementById('betaGeriBtn');

const TUM_EKRANLAR=[menuScreen,gameContainer,koyunScreen,kelimeDunyaScreen,oyunKoseScreen,balonScreen,uzayScreen,hazineScreen,hafizaScreen,yapbozScreen];
function tumEkranlariGizle(){TUM_EKRANLAR.forEach(el=>{if(el)el.style.display='none';});}
function ekranGoster(el){tumEkranlariGizle();if(el){el.style.display='';el.classList.remove('fade-in');void el.offsetWidth;el.classList.add('fade-in');}menuSkorGuncelle();}

// Ana menü kart butonları
document.querySelectorAll('.menu-card-btn').forEach(btn=>{btn.addEventListener('click',function(e){e.stopPropagation();const mod=this.dataset.mod;if(!mod)return;if(mod==='kelime-dunya'){ekranGoster(kelimeDunyaScreen);}else if(mod==='hikaye'){if(window.hikayeSecimBas)window.hikayeSecimBas();else ekranGoster(menuScreen);}else if(mod==='oyun-kose'){ekranGoster(oyunKoseScreen);}else if(mod==='sesli'){betaModalAc();}});});

// Kelime Dünyası alt menü — DÜZELTME: koyunScreen açılmıyor, doğrudan kelimeOyunuBas
document.getElementById('smKelimeOyunu').addEventListener('click',()=>{tumEkranlariGizle();if(window.kelimeOyunuBas)window.kelimeOyunuBas();});
document.getElementById('smBalonPatlatma').addEventListener('click',()=>{ekranGoster(balonScreen);if(window.balonBas)window.balonBas();});
document.getElementById('smUzayYolu').addEventListener('click',()=>{ekranGoster(uzayScreen);if(window.uzayBas)window.uzayBas();});

// Oyun Köşesi alt menü
document.getElementById('smGizliHazine').addEventListener('click',()=>{ekranGoster(hazineScreen);if(window.hazineBas)window.hazineBas();});
document.getElementById('smHafizaKartlari').addEventListener('click',()=>{ekranGoster(hafizaScreen);if(window.hafizaBas)window.hafizaBas();});
document.getElementById('smKelimeYapbozu').addEventListener('click',()=>{ekranGoster(yapbozScreen);if(window.yapbozBas)window.yapbozBas();});

// Geri butonları
document.getElementById('btnKelimeDunyaBack').addEventListener('click',()=>ekranGoster(menuScreen));
document.getElementById('btnOyunKoseBack').addEventListener('click',()=>ekranGoster(menuScreen));
document.getElementById('btnBack').addEventListener('click',()=>{mikrofoniSerbest();ekranGoster(menuScreen);});
document.getElementById('btnKoyunBack').addEventListener('click',()=>{if(window.kelimeOyunuDurdur)window.kelimeOyunuDurdur();else ekranGoster(menuScreen);});
document.getElementById('btnBalonBack').addEventListener('click',()=>{if(window.balonDurdur)window.balonDurdur();ekranGoster(kelimeDunyaScreen);});
document.getElementById('btnUzayBack').addEventListener('click',()=>{if(window.uzayDurdur)window.uzayDurdur();ekranGoster(kelimeDunyaScreen);});
document.getElementById('btnHazineBack').addEventListener('click',()=>{if(window.hazineDurdur)window.hazineDurdur();ekranGoster(oyunKoseScreen);});
document.getElementById('btnHafizaBack').addEventListener('click',()=>{if(window.hafizaDurdur)window.hafizaDurdur();ekranGoster(oyunKoseScreen);});
document.getElementById('btnYapbozBack').addEventListener('click',()=>{if(window.yapbozDurdur)window.yapbozDurdur();ekranGoster(oyunKoseScreen);});

// Beta modal
function betaModalAc(){if(betaModalOverlay)betaModalOverlay.style.display='flex';}
if(betaGeriBtn)betaGeriBtn.addEventListener('click',()=>{if(betaModalOverlay)betaModalOverlay.style.display='none';});
if(betaDevamBtn)betaDevamBtn.addEventListener('click',()=>{if(betaModalOverlay)betaModalOverlay.style.display='none';mikIzniSorVeBasla(ok=>{if(!ok)return;ekranGoster(gameContainer);if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;sifirlaIstatistik();oyunuKur();if(hikayeModu)updateStoryProgress();syncLevelButtons();});});

// Dış köprüler
window.sesliOkumayaGec=function(hIndex){hikayeModu=true;hikayeIndex=hIndex||0;hikayeCumle=0;if(tabHikaye)tabHikaye.classList.add('active');if(tabAlistirma)tabAlistirma.classList.remove('active');if(levelSelector)levelSelector.style.display='none';ekranGoster(gameContainer);if(btnStart)btnStart.disabled=false;if(btnStop)btnStop.disabled=true;sifirlaIstatistik();oyunuKur();updateStoryProgress();};
window.koyunSkoru=function(puan){totalScore+=puan;menuSkorGuncelle();kontrolRozetler();kaydet();};

// ─── Başlangıç ─────────────────────────────────────────────────────────────────
yukle();
syncLevelButtons();
oyunuKur();
if(hikayeModu){if(tabHikaye)tabHikaye.classList.add('active');if(tabAlistirma)tabAlistirma.classList.remove('active');if(levelSelector)levelSelector.style.display='none';updateStoryProgress();}
menuSkorGuncelle();
menuRozetGuncelle();
ekranGoster(menuScreen);

# MİNİK OKUR — Dosya Paketleri

Bu dosya, projedeki tüm JS/HTML/CSS dosyalarının hangi paketle gönderileceğini tanımlar.
Bir şey çalışmadığında ilgili paketin adını söyle ve o paketteki dosyaları at.

---

## 🎈 balon-uzay paketi
**Dosyalar:** `balon.js` + `uzay.js`
**İçerik:**
- `balon.js` → Balon Patlatma oyunu (hece bulma, balonlar yukarı çıkar, tıklayarak patlat)
- `uzay.js` → Uzay Yolu oyunu (emoji gör, doğru kelimeyi seç, roket fırlatma animasyonu)
**Ne zaman at:** Balon Patlatma veya Uzay Yolu çalışmıyorsa

---

## 🃏 hafıza-kelime paketi
**Dosyalar:** `hafiza.js` + `kelime.js`
**İçerik:**
- `hafiza.js` → Hafıza Kartları oyunu (hece-emoji eşleştirme, kartları çevir)
- `kelime.js` → Kelime Oyunu (sürükle-bırak harf yerleştirme, 5 seviye)
**Ne zaman at:** Hafıza Kartları veya Kelime Oyunu çalışmıyorsa

---

## 🪙 hazine-yapboz paketi
**Dosyalar:** `hazine.js` + `yapboz.js`
**İçerik:**
- `hazine.js` → Gizli Hazine oyunu (sandık aç, harfleri doğru sırala)
- `yapboz.js` → Kelime Yapbozu oyunu (emoji gör, harflere tıklayarak kelimeyi tamamla)
**Ne zaman at:** Gizli Hazine veya Kelime Yapbozu çalışmıyorsa

---

## 📖 hikaye paketi
**Dosyalar:** `hikaye.js` + `hikaye-secim.js`
**İçerik:**
- `hikaye.js` → 21 hikaye, cümle gösterimi, anlama soruları, puan sistemi
- `hikaye-secim.js` → Hikaye seçim ekranı (yatay kaydırmalı liste)
**Ne zaman at:** Hikaye ekranı açılmıyorsa veya hikaye seçimi çalışmıyorsa
**Not:** Bu iki dosya birbirine bağımlı, her zaman birlikte gönderilmeli

---

## 🧭 app-index paketi
**Dosyalar:** `app.js` + `index.html`
**İçerik:**
- `app.js` → Ana navigasyon, sesli okuma motoru, rozet sistemi, puan yönetimi
- `index.html` → Tüm ekranların HTML yapısı, script bağlantıları
**Ne zaman at:** Menü açılmıyorsa, ekranlar arası geçiş bozuksa, sesli okuma çalışmıyorsa
**Not:** En kritik paket, dikkatli düzenle

---

## 🎨 style paketi
**Dosyalar:** `style.css`
**İçerik:** Tüm görsel tasarım (renkler, animasyonlar, layout, kart stilleri)
**Ne zaman at:** Görsel bozukluk varsa, tasarım değişikliği istiyorsan

---

## 🔍 Şikayete Göre Hangi Paketi İste

| Kullanıcı ne dedi | Hangi paketi iste |
|---|---|
| Balon açılmıyor / patlamıyor | balon-uzay paketi |
| Uzay yolu çalışmıyor / roket gitmiyor | balon-uzay paketi |
| Hafıza kartları açılmıyor / eşleşmiyor | hafıza-kelime paketi |
| Kelime oyunu açılmıyor / harf sürüklenmiyor | hafıza-kelime paketi |
| Gizli hazine açılmıyor / sandık çalışmıyor | hazine-yapboz paketi |
| Yapboz açılmıyor / harfler tıklanmıyor | hazine-yapboz paketi |
| Hikaye açılmıyor / hikaye seçilemiyor | hikaye paketi |
| Hikaye soruları çalışmıyor / ileri butonu yok | hikaye paketi |
| Menü açılmıyor / ekranlar arası geçiş bozuk | app-index paketi |
| Geri butonu çalışmıyor | app-index paketi |
| Sesli okuma çalışmıyor / mikrofon açılmıyor | app-index paketi |
| Puan görünmüyor / rozet çıkmıyor | app-index paketi |
| Tasarım bozuk / renkler yanlış / düzen kayıyor | style paketi |
| Buton görünmüyor / kart şekli bozuk | style paketi |
| Yazı tipi yanlış / animasyon çalışmıyor | style paketi |

---

## 📌 Genel Kurallar
- `bg.jpg` hiç gönderilmez, değişmez
- En fazla 2 dosya aynı anda gönder
- HİKAYE paketindeki 2 dosya her zaman birlikte gönderilmeli
- Düzeltilmiş son sürümler her zaman bu projenin outputs klasöründedir

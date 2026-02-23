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

/**
 * ===== RULE ENGINE: DIGITAL WELLNESS SCORE =====
 * Prinsip: mulai dari skor sempurna (100), lalu KURANGI berdasarkan
 * aturan yang melanggar prinsip Self-Regulation & Habit Formation.
 * Fungsi ini murni kalkulasi -- tidak menyentuh HTML sama sekali.
 */
function calculateWellnessScore(data) {
  let score = 100;

  // ----- RULE: SCREEN TIME (Self-Regulation) -----
  // Screen time tinggi menandakan lemahnya regulasi diri terhadap teknologi
  if (data.screenTime > 10) {
    score -= 20;
  } else if (data.screenTime > 8) {
    score -= 10;
  } else if (data.screenTime > 6) {
    score -= 5;
  }

  // ----- RULE: SLEEP DURATION (Habit Formation) -----
  // Tidur < 6 jam mengganggu siklus kebiasaan sehat jangka panjang
  if (data.sleep < 5) {
    score -= 20;
  } else if (data.sleep < 6) {
    score -= 10;
  } else if (data.sleep < 7) {
    score -= 5;
  }

  // ----- RULE: SOCIAL MEDIA (Behavioral Psychology) -----
  // Social media berlebihan berkaitan dengan pola reward-seeking behavior
  if (data.socialMedia > 6) {
    score -= 15;
  } else if (data.socialMedia > 4) {
    score -= 8;
  }

  // ----- RULE: GAMING (Behavioral Psychology) -----
  if (data.gaming > 5) {
    score -= 15;
  } else if (data.gaming > 3) {
    score -= 8;
  }

  // ----- RULE: STUDY DURATION (Habit Formation - reward positif) -----
  // Durasi belajar cukup justru MENAMBAH skor, bukan mengurangi
  if (data.study >= 3) {
    score += 5;
  }

  // Pastikan skor tidak pernah keluar dari rentang 0-100
  score = Math.max(0, Math.min(100, score));

  return score;
}

/**
 * ===== MENENTUKAN CATEGORY BERDASARKAN SKOR =====
 * Dipisah jadi fungsi sendiri (bukan digabung ke atas) supaya
 * satu fungsi = satu tanggung jawab: mudah ditest & dibaca ulang.
 */
function getWellnessCategory(score) {
  if (score >= 85) {
    return "Excellent";
  } else if (score >= 70) {
    return "Good";
  } else if (score >= 50) {
    return "Fair";
  } else {
    return "Poor";
  }
}

/**
 * ===== ANALYSIS LOADING SEQUENCE =====
 * Modul ini HANYA mengatur transisi visual antara Assessment dan Dashboard.
 * Tidak membaca maupun mengubah logika scoring.js atau recommendation.js.
 */

// Urutan tahap analisis -- tambah/kurangi item di sini kalau perlu diubah nanti
const analysisSteps = [
  "📱 Menganalisis Screen Time",
  "😴 Mengevaluasi Pola Tidur",
  "💬 Menganalisis Aktivitas Media Sosial",
  "🎮 Menghitung Intensitas Gaming",
  "📚 Mengevaluasi Waktu Belajar",
  "🧠 Menghitung Digital Wellness Score",
  "✨ Menyusun Rekomendasi Personal",
];

const TOTAL_DURATION = 2800; // 0% -> 100%, dalam ms (2,8 detik)
const STEP_DURATION = TOTAL_DURATION / analysisSteps.length; // durasi tampil tiap teks
const COMPLETION_DURATION = 400; // durasi teks "Analisis Selesai"

/**
 * Mengubah setTimeout menjadi sesuatu yang bisa "ditunggu" dengan await.
 * Tanpa ini, tiap tahap harus ditulis sebagai callback bersarang.
 */
function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

/**
 * Menjalankan progress bar murni lewat CSS transition (bukan JS yang
 * menggeser width sedikit-sedikit). Angka persentase dihitung terpisah,
 * disinkronkan pakai durasi yang sama persis.
 */
function startProgressBar(fillElement, percentageElement) {
  fillElement.style.transitionDuration = `${TOTAL_DURATION}ms`;

  requestAnimationFrame(function () {
    fillElement.style.width = "100%";
  });

  const startTime = performance.now();

  function updatePercentage(now) {
    const elapsed = now - startTime;
    const percentage = Math.min(
      100,
      Math.round((elapsed / TOTAL_DURATION) * 100),
    );
    percentageElement.textContent = `${percentage}%`;

    if (percentage < 100) {
      requestAnimationFrame(updatePercentage);
    }
  }

  requestAnimationFrame(updatePercentage);
}

/**
 * Mengganti teks analisis dengan efek fade singkat.
 */
function setAnalysisText(textElement, newText) {
  textElement.classList.add("fade-out");

  setTimeout(function () {
    textElement.textContent = newText;
    textElement.classList.remove("fade-out");
  }, 150);
}

/**
 * ===== FUNGSI UTAMA =====
 * Menjalankan seluruh sequence loading, lalu memanggil onComplete
 * (script.js yang menentukan apa yang terjadi setelahnya).
 */
async function runAnalysisLoading(onComplete) {
  const overlay = document.querySelector("#loadingOverlay");
  const progressFill = document.querySelector("#loadingProgressFill");
  const percentageText = document.querySelector("#loadingPercentage");
  const analysisText = document.querySelector("#loadingAnalysisText");
  const activeSection = document.querySelector("main > section:not(.hidden)");

  // Reset kondisi awal, jaga-jaga kalau overlay pernah dipakai sebelumnya
  progressFill.style.transitionDuration = "0ms";
  progressFill.style.width = "0%";
  percentageText.textContent = "0%";
  analysisText.textContent = analysisSteps[0];
  analysisText.classList.remove("fade-out", "loading-complete-text");
  overlay.classList.remove("hidden");

  requestAnimationFrame(function () {
    overlay.classList.add("visible");
    activeSection.classList.add("shrink");
    document.querySelector("main").classList.add("blurred");
  });

  startProgressBar(progressFill, percentageText);

  // for loop (bukan forEach) -- forEach tidak bisa "dijeda" dengan await
  // di tengah perulangan, sedangkan for biasa bisa.
  for (let i = 1; i < analysisSteps.length; i++) {
    await wait(STEP_DURATION);
    setAnalysisText(analysisText, analysisSteps[i]);
  }
  await wait(STEP_DURATION);

  // ----- Finishing animation -----
  analysisText.classList.add("fade-out");
  await wait(150);
  analysisText.textContent = "✨ Analisis Selesai";
  analysisText.classList.add("loading-complete-text");
  analysisText.classList.remove("fade-out");
  await wait(COMPLETION_DURATION);

  // ----- Bersihkan tampilan & pindah ke dashboard -----
  overlay.classList.remove("visible");
  activeSection.classList.remove("shrink");
  document.querySelector("main").classList.remove("blurred");

  await wait(300); // beri waktu fade-out overlay selesai sebelum disembunyikan total
  overlay.classList.add("hidden");

  onComplete();
}

// ===== NAVIGASI ANTAR SECTION =====
const sections = document.querySelectorAll("main > section");

function showSection(sectionId) {
  sections.forEach(function (section) {
    section.classList.add("hidden");
    section.classList.remove("section-enter");
  });

  const target = document.querySelector(`#${sectionId}`);
  target.classList.remove("hidden");

  // requestAnimationFrame memberi browser satu "frame" untuk mendaftarkan
  // section ini masih dalam kondisi awal (belum ber-animasi), SEBELUM
  // class animasi ditambahkan pada frame berikutnya -- inilah yang membuat
  // transisinya benar-benar terlihat, bukan langsung "meloncat" ke akhir.
  requestAnimationFrame(function () {
    target.classList.add("section-enter");
  });
}

document
  .querySelector("#btnStartAssessment")
  .addEventListener("click", function () {
    showSection("assessment");
  });

document.querySelector("#btnRestart").addEventListener("click", function () {
  showSection("landing");
});

// ===== AMBIL SEMUA SLIDER =====
// querySelectorAll mengembalikan daftar (NodeList) semua elemen ber-class "slider"
const allSliders = document.querySelectorAll(".slider");

/**
 * Menghitung persentase nilai slider saat ini (0% - 100%)
 * Rumus: (nilai - min) / (max - min) * 100
 */
function getSliderPercentage(slider) {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const value = Number(slider.value);
  return ((value - min) / (max - min)) * 100;
}

/**
 * Update angka teks di sebelah slider (mis. "6 jam" -> "8 jam")
 */
function updateSliderValue(slider) {
  // closest() mencari card pembungkus terdekat, lalu cari elemen .input-value di dalamnya
  const card = slider.closest(".input-card");
  const valueDisplay = card.querySelector(".input-value");
  valueDisplay.textContent = `${slider.value} jam`;
}

/**
 * Update warna track slider agar bagian kiri thumb terlihat "terisi"
 */
function updateSliderTrack(slider) {
  const percentage = getSliderPercentage(slider);
  // linear-gradient: warna primary dari 0% sampai posisi thumb, sisanya warna secondary
  slider.style.background = `linear-gradient(
        to right,
        var(--color-primary) 0%,
        var(--color-primary) ${percentage}%,
        var(--color-secondary) ${percentage}%,
        var(--color-secondary) 100%
    )`;
}

/**
 * Fungsi gabungan yang dipanggil setiap slider berubah
 */
function handleSliderInput(event) {
  const slider = event.target;
  updateSliderValue(slider);
  updateSliderTrack(slider);
}

// ===== PASANG EVENT LISTENER & SET TAMPILAN AWAL =====
// forEach untuk loop semua slider yang ditemukan
allSliders.forEach(function (slider) {
  // Set tampilan awal saat halaman pertama dimuat (sebelum slider disentuh)
  updateSliderValue(slider);
  updateSliderTrack(slider);

  // "input" menyala terus-menerus selagi slider digeser (real-time)
  slider.addEventListener("input", handleSliderInput);
});

// ===== TOMBOL "LIHAT HASIL" =====
const btnSeeResult = document.querySelector("#btnSeeResult");

btnSeeResult.addEventListener("click", function () {
  const userData = {
    screenTime: Number(document.querySelector("#screenTime").value),
    sleep: Number(document.querySelector("#sleep").value),
    socialMedia: Number(document.querySelector("#socialMedia").value),
    gaming: Number(document.querySelector("#gaming").value),
    study: Number(document.querySelector("#study").value),
  };

  // Skor & kategori dihitung SEKARANG, sebelum animasi dimulai --
  // loading tidak pernah tahu hasilnya, murni kosmetik.
  const wellnessScore = calculateWellnessScore(userData);
  const wellnessCategory = getWellnessCategory(wellnessScore);

  // Dashboard baru dirender & ditampilkan SETELAH loading selesai
  runAnalysisLoading(function () {
    renderDashboard(userData, wellnessScore, wellnessCategory);
    showSection("dashboard");
  });
});

/**
 * Menampilkan hasil scoring ke elemen-elemen dashboard
 */
function renderDashboard(userData, score, category) {
  // ----- Skor & Kategori -----
  animateScore(score);

  const categoryBadge = document.querySelector(".category-badge");
  categoryBadge.textContent = category;
  // className mengganti SELURUH class sekaligus -> otomatis reset warna lama, pasang warna baru
  categoryBadge.className = `category-badge category-${category.toLowerCase()}`;

  // ----- Progress tiap indikator -----
  const progressItems = document.querySelectorAll(".progress-item");
  progressItems.forEach(function (item) {
    // dataset membaca atribut data-metric & data-max yang ditulis di HTML
    const metric = item.dataset.metric;
    const max = Number(item.dataset.max);
    const value = userData[metric];
    const percentage = (value / max) * 100;

    item.querySelector(".progress-value").textContent = `${value} jam`;
    item.querySelector(".progress-fill").style.width = `${percentage}%`;

    // ----- Psychology Insight -----
    document.querySelector(".psychology-insight").textContent =
      getPsychologyInsight(category);

    // ----- Recommendation List -----
    const recommendationList = document.querySelector(".recommendation-list");
    recommendationList.innerHTML = ""; // Kosongkan dulu, cegah rekomendasi lama menumpuk

    const recommendations = generateRecommendations(userData);
    recommendations.forEach(function (text) {
      const li = document.createElement("li");
      li.textContent = text;
      recommendationList.appendChild(li);
    });
  });
}

/**
 * Menganimasikan angka skor dari 0 naik bertahap ke nilai akhir.
 */
/**
 * Menganimasikan angka skor dari 0 naik ke nilai akhir dengan efek
 * ease-out: cepat di awal, melambat menjelang akhir.
 */
function animateScore(finalScore) {
    const scoreElement = document.querySelector(".score-number");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        scoreElement.textContent = finalScore;
        return;
    }

    const duration = 10000; // total durasi animasi (ms)
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration); // 0 -> 1, dibatasi maks 1

        // Rumus cubic ease-out: melengkungkan progress linear jadi "cepat lalu melambat"
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

        const currentValue = Math.round(easedProgress * finalScore);
        scoreElement.textContent = currentValue;

        if (rawProgress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}
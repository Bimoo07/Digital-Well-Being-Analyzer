# 🧠 Digital Well-Being Analyzer

Aplikasi web edukatif yang membantu siswa SMA memahami kondisi *digital well-being* mereka berdasarkan kebiasaan penggunaan teknologi sehari-hari. Dibangun sebagai media promosi Program Studi Digital Psychology untuk event **DIGICAMP**.

> ⚠️ **Catatan penting:** Aplikasi ini adalah *educational demonstration*, **bukan** alat diagnosis psikologis profesional.

---

## 📋 Daftar Isi

- [Tentang Project](#tentang-project)
- [Konsep yang Digabungkan](#konsep-yang-digabungkan)
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur Folder](#struktur-folder)
- [Cara Menjalankan](#cara-menjalankan)
- [Alur Aplikasi](#alur-aplikasi)
- [Sistem Penilaian (Rule-Based)](#sistem-penilaian-rule-based)
- [Analysis Transition](#analysis-transition)
- [Landasan Teori Psikologi](#landasan-teori-psikologi)
- [Desain](#desain)
- [Aksesibilitas](#aksesibilitas)
- [Batasan Project](#batasan-project)
- [Pengembang](#pengembang)

---

## Tentang Project

**Digital Well-Being Analyzer** adalah demonstrasi bagaimana **Psikologi** dan **Computer Science** dapat digabungkan dalam satu aplikasi sederhana. Pengguna mengisi lima indikator kebiasaan digital lewat slider interaktif, lalu aplikasi menghitung **Digital Wellness Score (0–100)** menggunakan sistem **Rule-Based AI** — bukan Machine Learning — dan menampilkan rekomendasi personal beserta wawasan psikologi yang relevan.

## Konsep yang Digabungkan
| Sisi Psikologi | Sisi Computer Science |
| Self-Regulation Theory | Rule-Based AI |
| Behavioral Psychology | Decision Tree sederhana (if/else berlapis) |
| Habit Formation | Data Visualization (progress bar, score circle) |
| — | Digital Wellness Score (algoritma skoring) |

## Fitur
- ✅ Assessment interaktif dengan 5 slider (Screen Time, Sleep, Social Media, Gaming, Study)
- ✅ Live feedback: nilai & warna track slider berubah real-time saat digeser
- ✅ Digital Wellness Score (0–100) dengan animasi hitung naik (ease-out — cepat di awal, melambat di akhir)
- ✅ Kategori hasil: **Excellent / Good / Fair / Poor**
- ✅ Progress bar visual untuk kelima indikator
- ✅ Rekomendasi personal — hanya muncul untuk indikator yang benar-benar bermasalah
- ✅ Psychology Insight — penjelasan singkat berbasis teori sesuai kategori hasil
- ✅ Analysis Transition — overlay loading dengan progress bar & teks analisis bertahap sebelum hasil ditampilkan
- ✅ Transisi & animasi halus antar-section
- ✅ Menghormati preferensi `prefers-reduced-motion` pengguna

## Teknologi
- HTML5 (Semantic HTML)
- CSS3 (Custom Properties, Grid, Flexbox, Keyframe Animation)
- Vanilla JavaScript (ES6+, tanpa framework/library eksternal)

**Tidak menggunakan** framework, library UI, backend, maupun database — seluruh logika berjalan di sisi browser (client-side).

## Struktur Folder
Digital-WellBeing-Analyzer/
│
├── assets/
│   ├── images/
│   └── icons/
│
├── css/
│   └── style.css              # Seluruh styling & design system
│
├── js/
│   ├── script.js               # Interaksi UI, navigasi, render dashboard
│   ├── scoring.js              # Rule engine penghitung Wellness Score
│   ├── recommendation.js       # Rule engine rekomendasi & psychology insight
│   └── loading.js              # Sequence animasi Analysis Transition
│
├── index.html                  # Struktur utama (Single Page Application)
└── README.md
```

## Cara Menjalankan

1. Clone atau download folder project ini
2. Buka folder di **Visual Studio Code**
3. Pastikan extension **Live Server** sudah terpasang
4. Klik kanan pada `index.html` → **Open with Live Server**
5. Aplikasi otomatis terbuka di browser default

Tidak dibutuhkan instalasi dependency, build tool, atau server backend apa pun.

## Alur Aplikasi

Aplikasi menggunakan konsep **Single Page Application (SPA)** sederhana — seluruh section berada dalam satu `index.html`, ditampilkan/disembunyikan lewat JavaScript.

```
Landing Page
     ↓  (klik "Mulai Assessment")
Assessment (5 slider input)
     ↓  (klik "Lihat Hasil")
Analysis Transition (overlay loading ~2.8 detik)
     ↓  (otomatis setelah selesai)
Dashboard (score, kategori, progress, rekomendasi, insight)
     ↓  (klik "Ulangi Assessment")
Kembali ke Landing Page
```

## Sistem Penilaian (Rule-Based)

Skor dimulai dari **100**, lalu dikurangi/ditambah berdasarkan aturan berikut:

| Indikator | Aturan |
|---|---|
| Screen Time | Semakin tinggi dari 6 jam → skor semakin berkurang (maks. -20) |
| Sleep Duration | Semakin rendah dari 7 jam → skor semakin berkurang (maks. -20) |
| Social Media | > 4 jam → -8, > 6 jam → -15 |
| Gaming | > 3 jam → -8, > 5 jam → -15 |
| Study Duration | ≥ 3 jam → **+5** (bonus, satu-satunya faktor penambah) |

Skor akhir dibatasi antara **0–100**, lalu dipetakan ke kategori:

| Skor | Kategori |
|---|---|
| 85–100 | Excellent |
| 70–84 | Good |
| 50–69 | Fair |
| 0–49 | Poor |

> Seluruh aturan bersifat **transparan dan bisa ditelusuri manusia** (`if screenTime > 8 then -10`) — ini prinsip utama Rule-Based AI, berbeda dari Machine Learning yang polanya tersembunyi di dalam model.

## Analysis Transition

Sebelum hasil ditampilkan, aplikasi menampilkan overlay loading selama ±2,8 detik untuk memberi kesan sistem sedang "menganalisis" data pengguna.

**Penting:** Skor & kategori sudah selesai dihitung **sebelum** overlay ini muncul — overlay murni kosmetik dan tidak pernah mengetahui hasil skor, sehingga **setiap pengguna mendapat pengalaman loading yang identik**, tidak peduli hasil skornya tinggi atau rendah.

Tahapan yang ditampilkan overlay secara berurutan:

1. 📱 Menganalisis Screen Time
2. 😴 Mengevaluasi Pola Tidur
3. 💬 Menganalisis Aktivitas Media Sosial
4. 🎮 Menghitung Intensitas Gaming
5. 📚 Mengevaluasi Waktu Belajar
6. 🧠 Menghitung Digital Wellness Score
7. ✨ Menyusun Rekomendasi Personal
8. ✨ Analisis Selesai *(±400ms sebelum berpindah ke dashboard)*

Progress bar berjalan linear 0→100% via CSS `transition`, disinkronkan dengan `performance.now()` di JavaScript untuk angka persentase. Efek blur diterapkan ke section aktif di belakang overlay, dan seluruh sequence tetap berjalan normal (tanpa animasi visual) saat `prefers-reduced-motion` aktif.

## Landasan Teori Psikologi

- **Self-Regulation Theory** — dasar penilaian Screen Time; kemampuan mengatur dorongan penggunaan teknologi.
- **Behavioral Psychology** — dasar penilaian Social Media & Gaming; berkaitan dengan pola *reward-seeking behavior*.
- **Habit Formation** — dasar penilaian Sleep & Study; konsistensi kecil yang membentuk kebiasaan otomatis jangka panjang.

Ketiga teori ini menjadi rujukan baik untuk logika skor (`scoring.js`) maupun teks Psychology Insight (`recommendation.js`).

## Desain

**Design System** (CSS Custom Properties di `:root`):

| Elemen | Warna |
|---|---|
| Primary | `#2563EB` |
| Primary Hover | `#1D4ED8` |
| Secondary | `#60A5FA` |
| Background | `#F8FAFC` |
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |

**Font:** Montserrat (Google Fonts)

**Gaya visual:** Modern, minimalis, rounded card, soft shadow, banyak white space — terinspirasi dari Google Fit, Apple Health, dan Samsung Health.

**Pendekatan responsif:** Mobile-first, dengan breakpoint tablet/desktop di `768px`.

**Animasi skor (count-up):** Angka Digital Wellness Score dianimasikan dari 0 ke nilai akhir memakai kurva *cubic ease-out* (`1 - (1 - progress)³`) — bergerak cepat di awal lalu melambat menjelang nilai akhir, dihitung lewat `requestAnimationFrame` agar mulus dan sinkron dengan refresh rate layar.

## Aksesibilitas

- Semantic HTML (`main`, `section`, `label`, `button`, heading berjenjang)
- Setiap slider terhubung dengan `<label for="...">`
- Kontras warna sesuai design system
- Mendukung navigasi keyboard (elemen native `<button>` dan `<input>`)
- Menghormati pengaturan sistem `prefers-reduced-motion` — animasi otomatis nonaktif untuk pengguna yang sensitif terhadap gerakan

## Batasan Project

Sesuai ketentuan awal, project ini **sengaja tidak** menggunakan:

- Framework JS (React, Vue, Angular)
- CSS Framework (Bootstrap, Tailwind)
- Backend/server (Node.js, Express, Laravel)
- Database
- Machine Learning atau AI Generatif

Seluruh logika — termasuk "kecerdasan" penilaian — murni ditulis sebagai aturan (rules) eksplisit dalam JavaScript.

## Pengembang

Dibuat oleh **Aloysius Bimo Prasetyo** sebagai project pembelajaran web development, sekaligus media promosi Program Studi Digital Psychology untuk **DIGICAMP**.

---

*Project ini dibangun secara bertahap melalui 7 sprint pembelajaran (Landing Page → Assessment UI → JavaScript Slider → Scoring Engine → Dashboard → Recommendation Engine → Animation & Finishing), dilanjutkan dengan fitur tambahan Analysis Transition (loading overlay) dan penyempurnaan animasi count-up skor.*

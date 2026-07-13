# 🧠 Digital Well-Being Analyzer

Aplikasi web edukatif yang menganalisis pola penggunaan perangkat digital dan memberikan wawasan psikologis berbasis skor. Dibangun sebagai proyek demonstrasi **DIGICAMP**, yang menunjukkan bagaimana psikologi dan ilmu komputer dapat bertemu dalam satu produk digital.

---

## 📌 Latar Belakang

Digital Well-Being Analyzer dibuat untuk menjawab pertanyaan sederhana namun relevan bagi pelajar SMA: *"Seberapa sehat kebiasaan digital saya?"*

Melalui lima dimensi (screen time, tidur, media sosial, gaming, dan belajar), aplikasi ini mengubah kebiasaan sehari-hari menjadi skor yang dapat dipahami, lengkap dengan interpretasi psikologis dan rekomendasi yang relevan — semuanya dihitung dan dirender di sisi klien, tanpa backend.

## 🎯 Tujuan Proyek

- Mendemonstrasikan penerapan konsep psikologi (kategorisasi perilaku, interpretasi pola) ke dalam logika pemrograman.
- Menjadi contoh SPA (*Single Page Application*) yang dibangun murni dengan **HTML5, CSS3, dan JavaScript vanilla** — tanpa framework atau library — sebagai latihan penguasaan fundamental web development.
- Menjadi bahan ajar bagi peserta DIGICAMP tentang bagaimana sebuah ide non-teknis (kesehatan digital) diterjemahkan menjadi sistem logika terstruktur.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Assessment 5-Slider** | Input interaktif untuk screen time, tidur, media sosial, gaming, dan durasi belajar |
| **Scoring Model** | Model rata-rata kategorikal (Poor/Fair/Good/Excellent → 25/50/75/100) menghasilkan skor 0–100 |
| **Dashboard Hasil** | Skor total, progress bar per kategori, badge kategori, dan animasi *count-up* |
| **Pattern Interpretation** | Klasifikasi tiga tingkat (Low/Medium/High) untuk mengidentifikasi *Dominant Factors* dan narasi interpretasi pola (Rule A–E) |
| **Recommendation Engine** | Rekomendasi dan wawasan psikologis berbasis aturan (*rule-based*), disusun sebagai array of objects |
| **Konsistensi Penjelasan Skor** | Pesan penjelasan skor dibangun dari data breakdown yang sama dengan mesin scoring, sehingga tidak ada inkonsistensi angka |
| **Transisi Analisis** | Overlay loading fullscreen (~2.8 detik) yang sepenuhnya independen dari logika skor |
| **Desain Responsif** | Pendekatan *mobile-first*, dengan aksesibilitas dasar (semantic HTML, kontras, navigasi) |
| **UI Glassmorphism** | Micro-interactions, floating background shapes, dan animasi CSS keyframe |

---

## 🛠️ Tech Stack

- **HTML5** — struktur semantik
- **CSS3** — glassmorphism, animasi keyframe, responsive design (tanpa framework CSS)
- **JavaScript (Vanilla, ES6+)** — modular, tanpa library eksternal

Pilihan "vanilla-only" ini disengaja: proyek ini juga berfungsi sebagai pembuktian bahwa aplikasi web interaktif dan estetis dapat dibangun hanya dengan fundamental, tanpa bergantung pada React/Vue/Tailwind, dsb.

---

## 📁 Struktur Proyek

```
digital-wellbeing-analyzer/
│
├── index.html          # Struktur halaman (hero, assessment, dashboard)
├── style.css            # Seluruh styling (glassmorphism, animasi, layout responsif)
│
├── scoring.js            # Model scoring: kategorisasi & rata-rata skor
├── pattern.js            # Klasifikasi 3-tingkat (Low/Medium/High) & narasi pola
├── recommendation.js     # Rule-based engine untuk insight & rekomendasi
├── loading.js             # Animasi transisi analisis (terpisah dari logika skor)
└── script.js              # Orkestrasi utama: event listener, render dashboard
```

**Urutan pemuatan script** (penting — mengikuti urutan dependensi):

```html
<script src="scoring.js"></script>
<script src="recommendation.js"></script>
<script src="loading.js"></script>
<script src="pattern.js"></script>
<script src="script.js"></script>
```

---

## 🧩 Arsitektur & Alur Data

1. **Input** — Pengguna menggeser 5 slider assessment.
2. **Scoring (`scoring.js`)** — Nilai slider dikategorikan (Poor–Excellent), dikonversi ke skala 25–100, lalu dirata-rata menjadi skor akhir 0–100.
3. **Pattern (`pattern.js`)** — Secara paralel, nilai yang sama diklasifikasikan ke tingkat Low/Medium/High untuk mengidentifikasi faktor dominan dan menyusun narasi interpretasi (Rule A–E).
4. **Loading (`loading.js`)** — Overlay transisi ditampilkan via `runAnalysisLoading(onComplete)`. Modul ini **tidak menerima data skor sama sekali** — murni animasi, dipicu lewat callback setelah selesai.
5. **Recommendation (`recommendation.js`)** — Berdasarkan hasil scoring & pattern, engine memilih insight psikologi dan rekomendasi yang relevan dari kumpulan aturan.
6. **Render (`script.js`)** — `renderDashboard()` adalah fungsi render murni (*pure function*) yang dipanggil **hanya setelah** animasi loading selesai, memastikan urutan pengalaman pengguna tetap mulus.

### Prinsip Desain yang Diterapkan

- **Separation of Concerns** — setiap modul punya satu tanggung jawab jelas (scoring ≠ pattern ≠ recommendation ≠ animasi ≠ render).
- **Decoupling by Design** — animasi loading sepenuhnya independen dari kalkulasi skor lewat pola callback; render dipisah dari perhitungan agar tidak ada duplikasi logika saat iterasi data (contoh nyata: Psychology Insight & Recommendation List awalnya sempat dirender di dalam `progressItems.forEach` sehingga terduplikasi 5x — telah diperbaiki dengan memindahkan logic tersebut keluar dari loop).
- **DRY (Don't Repeat Yourself)** — breakdown data yang sama dipakai baik untuk skor maupun pesan penjelasan skor, sehingga tidak ada angka yang bisa saling bertentangan. Komponen UI baru (hero, info card) menggunakan ulang grup CSS glassmorphism yang sudah ada, bukan membuat pola baru.
- **Modular JavaScript** — setiap file berdiri sendiri secara logis namun saling terhubung lewat variabel/fungsi global yang disepakati, sehingga rawan collision jika penamaan tidak dijaga (lihat catatan teknis di bawah).

---

## 🎓 Catatan Teknis (Pembelajaran dari Proses Development)

- **Global scope collision**: deklarasi `const` dengan nama sama di lebih dari satu file (mis. `CATEGORY_LABEL_ID` di `scoring.js` dan `pattern.js`) memicu `SyntaxError` yang secara diam-diam mematikan seluruh event listener — kesalahan yang sulit dilacak karena tidak ada error runtime yang jelas.
- **CSS cascade**: urutan aturan CSS memengaruhi hasil akhir; `display: flex` pada overlay bisa mengalahkan utility class `.hidden { display: none }` jika lebih spesifik/lebih akhir — diatasi dengan `!important` pada utility class.
- **Pola diagnosis debugging** yang digunakan sepanjang proyek: cek tipe error di console terlebih dahulu (`SyntaxError` → kemungkinan masalah parsing/deklarasi; `ReferenceError` → masalah scope; `TypeError` → tipe data salah atau elemen tidak ditemukan), baru kemudian mempersempit ke scope mismatch, naming collision, atau duplikasi blok eksekusi.

---

## 🚀 Cara Menjalankan

Karena proyek ini murni client-side (tanpa build tool, tanpa backend):

1. Clone atau unduh repository ini.
2. Buka `index.html` langsung di browser, **atau**
3. Gunakan live server (disarankan agar path relatif tetap konsisten):
   ```bash
   # Jika menggunakan VS Code, gunakan ekstensi Live Server
   # atau jalankan server sederhana:
   python -m http.server 8000
   ```
4. Akses `http://localhost:8000` di browser.

Tidak ada dependency untuk diinstal — cukup browser modern.

---

## 👤 Developer

**Aloysius Bimo Prasetyo**
Dibuat untuk **DIGICAMP** — BINUS

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan edukasi/demonstrasi. Silakan hubungi developer untuk penggunaan lebih lanjut.

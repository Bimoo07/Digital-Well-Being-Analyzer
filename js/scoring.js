/**
 * ===== KATEGORISASI PER ASPEK =====
 * Tiap aspek dinilai independen dulu jadi kategori (Poor/Fair/Good/Excellent),
 * BARU skor akhir = rata-rata nilai numerik dari kategori-kategori itu.
 * Jumlah tingkat kategori sengaja mengikuti jumlah level penalti versi lama --
 * tidak menambah ambang batas baru yang belum pernah didiskusikan.
 */
const ASPECT_CATEGORY_VALUE = {
    Excellent: 100,
    Good: 75,
    Fair: 50,
    Poor: 25,
};

// Label Bahasa Indonesia -- khusus untuk pesan penjelasan (poin 2),
// dipisah dari "Excellent/Good/Fair/Poor" yang tetap dipakai category-badge
const CATEGORY_LABEL_ID = {
    Excellent: "Sangat Baik",
    Good: "Baik",
    Fair: "Cukup",
    Poor: "Kurang",
};

function categorizeScreenTime(value) {
    if (value > 10) return "Poor";
    if (value > 8) return "Fair";
    if (value > 6) return "Good";
    return "Excellent";
}

function categorizeSleep(value) {
    if (value < 5) return "Poor";
    if (value < 6) return "Fair";
    if (value < 7) return "Good";
    return "Excellent";
}

function categorizeSocialMedia(value) {
    if (value > 6) return "Poor";
    if (value > 4) return "Fair";
    return "Excellent";
}

function categorizeGaming(value) {
    if (value > 5) return "Poor";
    if (value > 3) return "Fair";
    return "Excellent";
}

function categorizeStudy(value) {
    // Aturan lama hanya punya bonus (tidak ada penalti), jadi "buruk" di sini
    // dipetakan ke Fair (netral), bukan Poor -- supaya tidak menghukum lebih
    // keras dari yang pernah disepakati sebelumnya.
    return value >= 3 ? "Excellent" : "Fair";
}

// Satu sumber kebenaran untuk urutan & label aspek -- dipakai kalkulasi
// skor MAUPUN pesan penjelasan, supaya keduanya tidak pernah "beda cerita".
const aspectDefinitions = [
    { metric: "screenTime", label: "Screen Time", categorize: categorizeScreenTime },
    { metric: "sleep", label: "Durasi Tidur", categorize: categorizeSleep },
    { metric: "socialMedia", label: "Social Media", categorize: categorizeSocialMedia },
    { metric: "gaming", label: "Gaming", categorize: categorizeGaming },
    { metric: "study", label: "Durasi Belajar", categorize: categorizeStudy },
];

/**
 * Mengembalikan kategori TIAP aspek secara terpisah -- inilah data
 * yang dipakai ulang untuk membangun pesan penjelasan skor.
 */
function getAspectBreakdown(data) {
    return aspectDefinitions.map(function (aspect) {
        const category = aspect.categorize(data[aspect.metric]);
        return {
            metric: aspect.metric,
            label: aspect.label,
            category: category,
            categoryLabelID: CATEGORY_LABEL_ID[category],
            value: ASPECT_CATEGORY_VALUE[category],
        };
    });
}

/**
 * ===== SKOR AKHIR = RATA-RATA KATEGORI PER ASPEK =====
 */
function calculateWellnessScore(data) {
    const breakdown = getAspectBreakdown(data);
    const total = breakdown.reduce(function (sum, aspect) {
        return sum + aspect.value;
    }, 0);

    return Math.round(total / breakdown.length);
}

/**
 * ===== MENENTUKAN CATEGORY BERDASARKAN SKOR ===== (TIDAK BERUBAH)
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

/**
 * ===== PESAN PENJELASAN SKOR (poin 2) =====
 * Disusun dari breakdown yang SAMA PERSIS dipakai untuk menghitung skor --
 * menjamin pesan ini selalu konsisten dengan angka yang ditampilkan.
 */
function buildScoreExplanation(breakdown, score, category) {
    const categoryLabelText = CATEGORY_LABEL_ID[category];
    const perAspectText = breakdown
        .map(function (aspect) {
            return `${aspect.label}: ${aspect.categoryLabelID}`;
        })
        .join(", ");

    return `Skor ${score} (${categoryLabelText}) didapat dari rata-rata kategori 5 aspek berikut — ${perAspectText}.`;
}
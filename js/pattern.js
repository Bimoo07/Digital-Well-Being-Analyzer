/**
 * ===== MODUL: KATEGORISASI VARIABEL (PATTERN-BASED) =====
 * Kategorisasi di sini TERPISAH dari categorizeX() di scoring.js.
 * scoring.js memakai 2-4 tingkat berbeda per aspek (warisan struktur
 * rule-deduction lama). Modul ini SELALU memakai 3 tingkat seragam
 * (Low/Medium/High, atau Good/Moderate/Poor khusus utk sleep) sesuai
 * kebutuhan pattern matching -- supaya kombinasi pola bisa dicocokkan
 * dengan cara yang konsisten. Threshold numeriknya tetap diselaraskan
 * dengan scoring.js sebisa mungkin (mis. batas 6 & 10 jam screenTime),
 * supaya tidak ada dua "kebenaran" berbeda soal kapan sesuatu dianggap
 * tinggi/rendah.
 */
function patternCategorizeScreenTime(value) {
    if (value > 10) return "High";
    if (value > 6) return "Medium";
    return "Low";
}

function patternCategorizeSleep(value) {
    if (value < 6) return "Poor";
    if (value < 7) return "Moderate";
    return "Good";
}

function patternCategorizeSocialMedia(value) {
    if (value > 6) return "High";
    if (value > 4) return "Medium";
    return "Low";
}

function patternCategorizeGaming(value) {
    if (value > 5) return "High";
    if (value > 3) return "Medium";
    return "Low";
}

function patternCategorizeStudy(value) {
    if (value >= 4) return "High";
    if (value >= 2) return "Medium";
    return "Low";
}

/**
 * Satu sumber kebenaran urutan & metadata tiap variabel -- dipakai
 * ulang oleh getVariableCategories() dan getDominantFactors(), supaya
 * keduanya tidak pernah "beda cerita" soal ikon/label tiap aspek.
 */
const patternVariableDefinitions = [
    { metric: "screenTime", categorize: patternCategorizeScreenTime, icon: "📱", labelId: "Screen Time" },
    { metric: "sleep", categorize: patternCategorizeSleep, icon: "😴", labelId: "Durasi Tidur" },
    { metric: "socialMedia", categorize: patternCategorizeSocialMedia, icon: "📲", labelId: "Social Media" },
    { metric: "gaming", categorize: patternCategorizeGaming, icon: "🎮", labelId: "Gaming" },
    { metric: "study", categorize: patternCategorizeStudy, icon: "📚", labelId: "Durasi Belajar" },
];

/**
 * Menghasilkan kategori SEMUA variabel sekaligus dalam 1 object,
 * mis. { screenTime: "High", sleep: "Poor", ... } -- inilah yang
 * dicocokkan ke patternRules di bawah.
 */
function getVariableCategories(data) {
    const categories = {};
    patternVariableDefinitions.forEach(function (variable) {
        categories[variable.metric] = variable.categorize(data[variable.metric]);
    });
    return categories;
}

/**
 * ===== MODUL: PATTERN MATCHING (NORMA BERTINGKAT) =====
 * Tiap rule berisi "match" (object PARSIAL -- hanya variabel yang jadi
 * ciri khas pola itu perlu disebut, TIDAK wajib mencantumkan semua 5)
 * dan "interpretation" (narasi 2-4 kalimat, netral & tidak menghakimi).
 * Urutan array = urutan prioritas pencocokan: rule pertama yang cocok
 * SEMUA field yang disebutkan langsung dipakai, sisanya diabaikan.
 */
const patternRules = [
    {
        id: "A",
        match: { sleep: "Poor", screenTime: "High", gaming: "High", study: "Low" },
        interpretation:
            "Pola penggunaan digital menunjukkan dominasi aktivitas hiburan dengan durasi penggunaan perangkat yang tinggi. Kondisi ini berpotensi mengurangi waktu istirahat dan waktu belajar sehingga keseimbangan digital perlu ditingkatkan.",
    },
    {
        id: "B",
        match: { sleep: "Poor", screenTime: "High", gaming: "Low", study: "High", socialMedia: "High" },
        interpretation:
            "Durasi penggunaan perangkat yang tinggi tampaknya lebih banyak dipengaruhi oleh aktivitas belajar dan media sosial dibandingkan permainan digital. Meskipun aktivitas belajar cukup baik, menjaga waktu istirahat tetap penting.",
    },
    {
        id: "C",
        match: { sleep: "Good", screenTime: "Medium", study: "High", gaming: "Low" },
        interpretation:
            "Pola penggunaan digital menunjukkan keseimbangan yang cukup baik antara aktivitas produktif, hiburan, dan waktu istirahat.",
    },
    {
        id: "D",
        match: { sleep: "Good", screenTime: "High", gaming: "Low", study: "Medium", socialMedia: "Medium" },
        interpretation:
            "Penggunaan perangkat relatif tinggi namun masih diimbangi dengan waktu istirahat yang baik. Perhatikan agar screen time tidak terus meningkat.",
    },
    {
        id: "E",
        match: { sleep: "Moderate", screenTime: "Medium", gaming: "Medium", study: "Medium", socialMedia: "Medium" },
        interpretation:
            "Pola aktivitas digital berada pada tingkat yang cukup seimbang. Beberapa aspek masih dapat ditingkatkan untuk memperoleh kebiasaan digital yang lebih sehat.",
    },
];

// Dipakai kalau tidak ada satu pun patternRules yang cocok -- tetap netral,
// tidak menghakimi, dan tidak memberi diagnosis (sesuai instruksi gaya bahasa).
const DEFAULT_INTERPRETATION =
    "Kombinasi kebiasaan digitalmu belum sepenuhnya sesuai dengan pola umum yang tersedia. Secara umum, memperhatikan keseimbangan antara waktu layar, istirahat, dan aktivitas belajar tetap disarankan untuk menjaga kebiasaan digital yang sehat.";

/**
 * Mencocokkan categories user ke salah satu patternRules.
 * "Cocok" berarti SETIAP key yang disebut di rule.match harus identik
 * dengan categories[key]; key yang TIDAK disebut di rule diabaikan
 * (tidak dianggap gagal match).
 */
function matchPattern(categories) {
    for (let i = 0; i < patternRules.length; i++) {
        const rule = patternRules[i];
        const requiredKeys = Object.keys(rule.match);

        const isMatch = requiredKeys.every(function (key) {
            return categories[key] === rule.match[key];
        });

        if (isMatch) {
            return rule;
        }
    }
    return null;
}

/**
 * ===== FUNGSI PUBLIK: PATTERN INTERPRETATION =====
 * Dipanggil dari script.js. Mengembalikan 1 string narasi.
 */
function getPatternInterpretation(data) {
    const categories = getVariableCategories(data);
    const matchedRule = matchPattern(categories);
    return matchedRule ? matchedRule.interpretation : DEFAULT_INTERPRETATION;
}

/**
 * ===== MODUL: DOMINANT FACTORS =====
 * "Dominan" didefinisikan sbg kategori yang PALING JAUH dari titik
 * netral -- bukan 3 variabel pertama secara acak. Tiap kategori diberi
 * skor intensitas:
 *   High / Poor      = 2  (paling menonjol)
 *   Medium / Moderate = 1
 *   Low / Good        = 0  (netral -- meski scr wellness ini kondisi
 *                            paling sehat, secara statistik ia tidak
 *                            "menonjol" dibanding titik tengah)
 * 2-3 variabel dengan skor tertinggi yang ditampilkan. Kalau skor
 * semua variabel 0 (user sangat seimbang), tetap tampilkan 2 teratas
 * apa adanya -- card ini tidak boleh pernah kosong.
 */
const INTENSITY_SCORE = {
    High: 2, Poor: 2,
    Medium: 1, Moderate: 1,
    Low: 0, Good: 0,
};

// Warna dipetakan LANGSUNG per kategori (bukan "baik/buruk") supaya
// tidak berkesan menghakimi -- sesuai instruksi gaya bahasa sprint ini.
const BADGE_COLOR_CLASS = {
    High: "badge-soft-orange", Poor: "badge-soft-orange",
    Medium: "badge-soft-yellow", Moderate: "badge-soft-yellow",
    Low: "badge-soft-green",
    Good: "badge-soft-blue",
};

const PATTERN_CATEGORY_LABEL_ID = {
    High: "Tinggi", Medium: "Sedang", Low: "Rendah",
    Good: "Baik", Moderate: "Sedang", Poor: "Rendah",
};

/**
 * ===== FUNGSI PUBLIK: DOMINANT FACTORS =====
 * Dipanggil dari script.js. Mengembalikan array 2-3 object
 * { icon, text, colorClass } siap dirender jadi chip.
 */
function getDominantFactors(data) {
    const categories = getVariableCategories(data);

    const scoredFactors = patternVariableDefinitions.map(function (variable) {
        const category = categories[variable.metric];
        return {
            icon: variable.icon,
            text: `${variable.labelId} ${PATTERN_CATEGORY_LABEL_ID[category]}`,
            colorClass: BADGE_COLOR_CLASS[category],
            intensity: INTENSITY_SCORE[category],
        };
    });

    // sort menurun berdasarkan intensitas; utk skor sama, urutan asli
    // (urutan array patternVariableDefinitions) dipertahankan sbg
    // tie-breaker deterministik.
    scoredFactors.sort(function (a, b) {
        return b.intensity - a.intensity;
    });

    const notableFactors = scoredFactors.filter(function (factor) {
        return factor.intensity > 0;
    });

    // Fallback: kalau kurang dari 2 faktor yang "menonjol", tampilkan
    // 2 teratas apa adanya supaya card tidak pernah kosong.
    return notableFactors.length >= 2 ? notableFactors.slice(0, 3) : scoredFactors.slice(0, 2);
}
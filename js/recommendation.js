/**
 * ===== ATURAN REKOMENDASI =====
 * Setiap objek berisi:
 * - condition: fungsi yang menerima data user, return true/false
 * - text: pesan yang ditampilkan JIKA condition bernilai true
 * Format array ini artinya menambah aturan baru = tambah 1 objek,
 * tanpa menyentuh logika di bawahnya sama sekali.
 */
const recommendationRules = [
    {
        condition: (data) => data.screenTime > 8,
        text: "Coba kurangi screen time secara bertahap, misalnya 30 menit lebih sedikit setiap hari.",
    },
    {
        condition: (data) => data.sleep < 7,
        text: "Usahakan tidur minimal 7 jam agar tubuh dan otak punya waktu pemulihan yang cukup.",
    },
    {
        condition: (data) => data.socialMedia > 4,
        text: "Batasi social media dengan fitur screen time limit, atau tentukan jam bebas gadget.",
    },
    {
        condition: (data) => data.gaming > 3,
        text: "Gaming boleh jadi hiburan, tapi coba seimbangkan dengan aktivitas fisik atau sosial langsung.",
    },
    {
        condition: (data) => data.study < 2,
        text: "Coba tambah durasi belajar sedikit demi sedikit dengan teknik seperti Pomodoro (25 menit fokus, 5 menit istirahat).",
    },
];

/**
 * Menyaring aturan mana saja yang "menyala" (kondisinya true untuk data ini),
 * lalu mengembalikan hanya teksnya sebagai array string.
 */
function generateRecommendations(data) {
    const activeRecommendations = [];

    recommendationRules.forEach(function (rule) {
        if (rule.condition(data)) {
            activeRecommendations.push(rule.text);
        }
    });

    // Kalau semua kebiasaan sudah ideal, tidak ada rule yang menyala -> beri apresiasi
    if (activeRecommendations.length === 0) {
        activeRecommendations.push("Kebiasaan digitalmu sudah cukup seimbang. Pertahankan pola ini!");
    }

    return activeRecommendations;
}

/**
 * ===== PSYCHOLOGY INSIGHT =====
 * Insight dipilih berdasarkan KATEGORI (bukan angka mentah), karena tujuannya
 * memberi konteks teori psikologi, bukan mengulang detail rekomendasi teknis.
 */
function getPsychologyInsight(category) {
    const insights = {
        Excellent: "Kamu menunjukkan Self-Regulation yang baik — kemampuan mengatur dorongan penggunaan teknologi sesuai kebutuhan, bukan sekadar kebiasaan otomatis.",
        Good: "Sebagian besar kebiasaanmu sudah sehat. Menurut teori Habit Formation, konsistensi kecil yang dijaga akan memperkuat pola ini menjadi otomatis dalam jangka panjang.",
        Fair: "Pola penggunaanmu menunjukkan tanda-tanda reward-seeking behavior — dorongan mencari kepuasan instan dari layar. Menyadari pola ini adalah langkah pertama Self-Regulation.",
        Poor: "Skor ini mengindikasikan kebiasaan digital yang kuat namun belum seimbang. Dalam Behavioral Psychology, kebiasaan seperti ini terbentuk bertahap — dan bisa diubah bertahap juga, mulai dari satu perubahan kecil.",
    };

    return insights[category];
}
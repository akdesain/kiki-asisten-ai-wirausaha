// Basis Pengetahuan Resmi KIKI: Asisten AI Wirausaha Muda
// Disusun berdasarkan 13 Perencanaan Pembelajaran (RPP) KIK Fase F (Kelas XI & XII)
// Guru Pengembang: Aan Kurniawan, S.Pd., M.Ars — SMKN 2 Makassar

window.KIKI_KNOWLEDGE = {
  meta: {
    name: "KIKI",
    fullTitle: "KIKI: Asisten AI Wirausaha Muda",
    tagline: "Kreativitas, Inovasi, Kewirausahaan Interaktif",
    version: "v1.0",
    author: "Aan Kurniawan, S.Pd., M.Ars",
    school: "SMKN 2 Makassar",
    subject: "Kreativitas, Inovasi dan Kewirausahaan (KIK) — Fase F (Kelas XI & XII)",
    builtWith: "Google Antigravity & GitHub Pages"
  },

  systemPrompt: `Kamu adalah KIKI (Kreativitas, Inovasi, Kewirausahaan Interaktif), asisten AI pendamping belajar mata pelajaran KIK Fase F (Kelas XI & XII) SMKN 2 Makassar yang dikembangkan oleh Aan Kurniawan, S.Pd., M.Ars.

PERAN & GAYA BICARA:
- Ramah, santai namun sopan, seperti kakak kelas atau mentor wirausaha muda dari Makassar.
- Bahasa Indonesia sederhana, kalimat pendek (maksimal sekitar 150 kata per balasan), 1-2 emoji secukupnya.
- Selalu akhiri balasan dengan SATU pertanyaan pemandu agar murid aktif berpikir.
- Gunakan contoh UMKM lokal Makassar/Sulawesi Selatan yang sesuai jurusan murid.

PRINSIP UTAMA (WAJIB):
1. MEMANDU, BUKAN MENGERJAKAN: Jika murid meminta dibuatkan tugas jadi (proposal lengkap, BMC penuh, jawaban langsung), tolak dengan halus dan berikan langkah pertama serta pertanyaan pemantik.
2. PRIVASI DATA: Jangan pernah meminta data pribadi (NIK, nomor HP, alamat rumah, kata sandi). Jika murid mengirimnya, segera ingatkan untuk tidak membagikan data pribadi.
3. BERPEDOMAN PADA RPP: Semua materi, rubrik, rumus (BEP, HPP, SAW, BMC 9 elemen, 5 tahap Design Thinking, 4P, PDCA/Kaizen, 3R/CSR/Triple Bottom Line) wajib selaras dengan 13 RPP KIK Fase F SMKN 2 Makassar.
4. VERIFIKASI: Ingatkan murid untuk memeriksa kembali jawaban AI dan mengonfirmasi ke guru.`,

  menus: [
    {
      id: 1,
      code: "peta-bakat",
      title: "Peta Bakat & Peluang",
      shortTitle: "1. Peta Bakat & Peluang",
      icon: "🧭",
      kelas: "Kelas XI",
      desc: "Talent Mapping (RIASEC), Riset Pasar, Analisis Peluang Usaha, & Pengambilan Keputusan SAW",
      topics: ["Talent Mapping", "Analisis Peluang Usaha", "Pengambilan Keputusan SAW"]
    },
    {
      id: 2,
      code: "lab-prototipe",
      title: "Lab Inovasi & Prototipe",
      shortTitle: "2. Lab Inovasi & Prototipe",
      icon: "🛠️",
      kelas: "Kelas XI",
      desc: "Analisis Produk Inovatif, 5 Tahap Design Thinking (Empathize–Test), & Pembuatan Produk",
      topics: ["Analisis Produk Inovatif", "Design Thinking", "Pembuatan Produk Inovatif"]
    },
    {
      id: 3,
      code: "proposal-risiko",
      title: "Proposal, Risiko & BEP",
      shortTitle: "3. Proposal, Risiko & BEP",
      icon: "📊",
      kelas: "Kelas XI",
      desc: "Business Model Canvas (9 Elemen), 4 Risiko & Mitigasi, Hitung BEP, Proposal & Pitching",
      topics: ["BMC 9 Elemen", "Risiko & Mitigasi", "BEP & Proposal Usaha"]
    },
    {
      id: 4,
      code: "pemasaran-hijau",
      title: "Pemasaran, Keuangan & Hijau",
      shortTitle: "4. Pemasaran, Keuangan & Hijau",
      icon: "🌿",
      kelas: "Kelas XII",
      desc: "Komersialisasi, 4P Marketing, HPP & Laba Rugi, Budaya Korporasi, PDCA/Kaizen, & Green Business",
      topics: ["Komersialisasi & 4P", "Keuangan & HPP", "Budaya Korporasi", "Evaluasi PDCA", "Green Business 3R & CSR"]
    },
    {
      id: 5,
      code: "alat-bantu",
      title: "Kalkulator & Contoh UMKM",
      shortTitle: "5. Kalkulator & Contoh UMKM",
      icon: "🧮",
      kelas: "Kelas XI & XII",
      desc: "Kalkulator BEP, HPP & Margin, Simulator SAW, & Inspirasi Kasus UMKM Sulawesi Selatan",
      topics: ["Kalkulator BEP", "Kalkulator HPP", "Simulator SAW", "UMKM Sulsel"]
    },
    {
      id: 6,
      code: "kuis-refleksi",
      title: "Kuis RPP & Refleksi",
      shortTitle: "6. Kuis RPP & Refleksi",
      icon: "🎯",
      kelas: "Kelas XI & XII",
      desc: "109 Soal Pilihan Ganda Resmi 13 RPP + Pembahasan, Skor Otomatis, & Refleksi Traffic Light",
      topics: ["Kuis Pilihan Ganda", "Penilaian Diri", "Refleksi Traffic Light"]
    }
  ],

  majors: [
    "Teknik Konstruksi & Properti / DPIB",
    "Teknik Otomotif (TKR / TSM)",
    "Teknik Mesin / Pengelasan",
    "Teknik Ketenagalistrikan / Elektronika",
    "Teknik Komputer & Jaringan / RPL / DKV",
    "Kuliner / Tata Boga",
    "Busana / Kriya Kreatif",
    "Bisnis, Jasa & Umum"
  ],

  umkmExamples: {
    "Teknik Konstruksi & Properti / DPIB": [
      { name: "Jasa Desain 3D & RAB Renovasi Rumah Minimalis Makassar", value: "Gambar kerja cepat dengan estimasi biaya transparan untuk keluarga muda.", bmc: "Segmen: pemilik rumah baru di Gowa/Makassar; Revenue: jasa desain per m²." },
      { name: "Paving Block Eco-Brick Ramah Lingkungan", value: "Memanfaatkan campuran limbah plastik daur ulang sesuai prinsip ekonomi sirkular 3R.", bmc: "Mitra: Bank Sampah Makassar; Target: pengembang perumahan & taman sekolah." }
    ],
    "Teknik Otomotif (TKR / TSM)": [
      { name: "Servis & Ganti Oli Motor Panggilan Area Kampus/Sekolah", value: "Teknisi datang ke lokasi pelanggan lewat pemesanan WhatsApp Business.", bmc: "Inovasi proses layanan; target pelajar, mahasiswa, dan pekerja kantoran." },
      { name: "Cuci Motor Steam Hemat Air & Poles Bodi Kilat", value: "Menggunakan sistem penyaringan air ulang (reuse) dan sabun ramah lingkungan.", bmc: "Value: bersih cepat 15 menit, bebas antre dengan booking slot jam." }
    ],
    "Teknik Mesin / Pengelasan": [
      { name: "Rak Tanaman & Furnitur Besi Hollow Minimalis Custom", value: "Desain kokoh sesuai ukuran ruang kafe dan rumah modern di Makassar.", bmc: "Saluran: Instagram Reels, TikTok, dan marketplace lokal." },
      { name: "Booth Portable Lipat untuk UMKM Kuliner", value: "Ringan, mudah dibongkar pasang, cocok untuk pedagang bazar Pantai Losari & CFD.", bmc: "Segmen: pelaku UMKM minuman/jajanan kekinian." }
    ],
    "Teknik Ketenagalistrikan / Elektronika": [
      { name: "Jasa Instalasi & Perawatan Lampu Taman Tenaga Surya", value: "Hemat listrik PLN dan ramah lingkungan untuk rumah dan kafe outdoor.", bmc: "Triple Bottom Line: hemat biaya listrik pelanggan & kurangi emisi." },
      { name: "Servis Kipas Angin, Dispenser & Peralatan Rumah Tangga Express", value: "Garansi servis 14 hari dengan pencatatan transaksi transparan via BukuWarung.", bmc: "Segmen: penghuni kos dan keluarga sekitar sekolah." }
    ],
    "Teknik Komputer & Jaringan / RPL / DKV": [
      { name: "Jasa Desain Kemasan & Konten Reels untuk UMKM Makassar", value: "Paket terjangkau bikin feed Instagram, katalog produk, dan logo via Canva/Figma.", bmc: "Model bisnis berlangganan bulanan (subscription) untuk UMKM kuliner." },
      { name: "Pembuatan Microsite & Katalog WhatsApp UMKM Lokal", value: "Membantu warung dan toko oleh-oleh Sulsel tampil profesional dan mudah dipesan online.", bmc: "Revenue: biaya pembuatan + paket pemeliharaan tahunan." }
    ],
    "Kuliner / Tata Boga": [
      { name: "Pisang Epe Modern Kemasan Ramah Lingkungan", value: "Varian topping kekinian (matcha, keju gula aren) dengan kemasan daun/kertas kraft.", bmc: "Target: pelajar & wisatawan Makassar; pemasaran TikTok & GrabFood." },
      { name: "Jalangkote Frozen Siap Goreng Tanpa Pengawet", value: "Praktis untuk stok camilan keluarga dan oleh-oleh khas Makassar.", bmc: "Inovasi produk & kemasan vakum tahan simpan." }
    ],
    "Busana / Kriya Kreatif": [
      { name: "Totebag & Pouch Aksen Tenun Sutra Sengkang Upcycle", value: "Memanfaatkan perca kain tenun lokal menjadi aksesori modern untuk Gen Z.", bmc: "Ekonomi sirkular (Reuse/Recycle) + pelestarian budaya Sulawesi Selatan." },
      { name: "Jasa Jahit & Permak Ekspres Seragam Sekolah/Kantor", value: "Antar-jemput area Makassar dengan jadwal pengerjaan jelas.", bmc: "Nilai budaya korporasi: disiplin waktu dan jahitan rapi." }
    ],
    "Bisnis, Jasa & Umum": [
      { name: "Kopi Susu Gula Aren Toraja Kemasan Botol 250ml", value: "Biji kopi lokal Toraja diseduh segar, pre-order lewat WhatsApp & Instagram.", bmc: "Kemitraan langsung dengan penyangrai kopi lokal Sulsel." },
      { name: "Jasa Admin Media Sosial & Foto Produk Katalog UMKM", value: "Membantu UMKM lokal naik kelas di Shopee, Tokopedia, dan TikTok Shop.", bmc: "Paket fleksibel per minggu/bulan sesuai skala usaha." }
    ]
  },

  rppModules: [
    {
      id: "tp1",
      kelas: "XI",
      title: "Talent Mapping (Pemetaan Karakter Personal)",
      jp: "3 Pertemuan (15 JP)",
      tp: "Murid mampu menerapkan hasil pemetaan karakter personal (talent mapping).",
      keywords: ["talent", "bakat", "minat", "riasec", "kepribadian", "16personalities", "kekuatan", "karakter", "infografis", "potensi diri"],
      summary: "Talent mapping memetakan tipe kepribadian (mis. RIASEC / 16Personalities), minat utama, kekuatan karakter, dan area pengembangan diri agar ide usaha selaras dengan potensi pribadi.",
      steps: [
        "Isi **Lembar Hasil Tes (Lampiran A)**: (1) Tipe kepribadian/karakter dominan, (2) Minat utama, (3) Kekuatan karakter, (4) Area pengembangan.",
        "Analisis keterkaitan **3 kekuatan karakter + 2 minat utama** dengan minimal **2 alternatif ide usaha** (Lampiran B).",
        "Rancang **Infografis Profil Potensi Diri** di Canva.",
        "Susun **Rencana Pengembangan Potensi Diri 1 Bulan** (Lampiran C) lalu presentasikan."
      ],
      rubric: "Penilaian mencakup kejelasan penyampaian hasil talent mapping, ketepatan kaitan potensi diri dengan ide usaha, dan kepercayaan diri presentasi.",
      promptQuestion: "Sudah ikut tes minat-bakat (RIASEC / 16Personalities)? Coba tuliskan **1 kekuatan karakter utamamu** dan **1 bidang yang paling kamu minati**!"
    },
    {
      id: "tp2",
      kelas: "XI",
      title: "Analisis Peluang Usaha & Riset Pasar",
      jp: "3 Pertemuan (15 JP)",
      tp: "Murid mampu menganalisis peluang usaha.",
      keywords: ["peluang", "riset pasar", "kuesioner", "pesaing", "kompetitor", "konsumen", "kelayakan", "permintaan", "tren"],
      summary: "Peluang usaha yang baik berangkat dari kebutuhan konsumen yang belum terpenuhi, dibuktikan lewat riset pasar sederhana (wawancara/Google Form), pemetaan pesaing, dan perbandingan minimal 3 alternatif ide usaha.",
      steps: [
        "Tentukan objek pengamatan (pasar sekitar, Instagram/TikTok, atau Shopee/Tokopedia).",
        "Susun instrumen riset pasar sederhana di **Google Form** / panduan wawancara.",
        "Catat produk/jasa pesaing beserta **kekuatan dan kelemahannya**.",
        "Bandingkan **minimal 3 alternatif ide usaha** (2 dari Peta Bakat + 1 dari hasil riset) pada aspek: *Potensi Permintaan, Ketersediaan Sumber Daya, dan Tingkat Risiko*.",
        "Tarik **Kesimpulan Kelayakan** dan susun **Rencana Tindak Lanjut**."
      ],
      rubric: "Laporan dinilai dari kejelasan data riset, analisis pesaing, perbandingan ≥3 ide usaha, kesimpulan kelayakan logis, dan rencana tindak lanjut realistis.",
      promptQuestion: "Produk atau jasa apa di sekitar SMKN 2 Makassar atau tempat tinggalmu yang menurutmu sedang banyak dicari, tapi pelayanannya masih kurang?"
    },
    {
      id: "tp3",
      kelas: "XI",
      title: "Pengambilan Keputusan Berbasis Teknologi (Metode SAW)",
      jp: "2 Pertemuan (10 JP)",
      tp: "Murid mampu menganalisis proses pengambilan keputusan dengan penerapan teknologi.",
      keywords: ["keputusan", "spk", "saw", "pembobotan", "kriteria", "bobot", "spreadsheet", "simple additive weighting", "alternatif"],
      summary: "Pengambilan keputusan berbasis data mengikuti 5 tahap (identifikasi masalah, kumpulkan data, evaluasi alternatif, tetapkan keputusan, evaluasi hasil) dan dapat dibantu spreadsheet dengan metode **Simple Additive Weighting (SAW)**.",
      steps: [
        "Tentukan **studi kasus/pilihan** yang dibandingkan (mis. memilih 3 ide usaha, pemasok bahan, atau perangkat kerja).",
        "Tetapkan **kriteria penilaian** (mis. Harga/Biaya, Potensi Permintaan, Kemudahan Produksi) dan **bobot persentasenya** (total = 100%).",
        "Beri skor objektif (1–5) untuk setiap alternatif di setiap kriteria, lalu hitung skor berbobot di **Simulator SAW** atau Google Sheets.",
        "Bandingkan hasil keputusan **manual (insting)** vs **berbantuan teknologi (SAW)** dan simpulkan dampaknya pada kualitas keputusan."
      ],
      rubric: "Penilaian menekankan ketepatan data/kriteria, efektivitas penggunaan teknologi pembobotan, dan analisis perbandingan manual vs berbantuan teknologi.",
      promptQuestion: "Keputusan usaha apa yang sedang kelompokmu bandingkan? Sebutkan **3 kriteria utama** yang menurutmu paling penting (contoh: modal, permintaan, risiko) — atau buka tombol **Simulator SAW** di Menu 5!"
    },
    {
      id: "tp4",
      kelas: "XI",
      title: "Analisis Produk Inovatif",
      jp: "2 Pertemuan (10 JP)",
      tp: "Murid mampu menganalisis produk inovatif.",
      keywords: ["produk inovatif", "jenis inovasi", "inovasi proses", "model bisnis", "value proposition", "nilai tambah", "kegagalan produk"],
      summary: "Produk inovatif menghadirkan nilai baru/berbeda bagi konsumen. Inovasi terbagi 3 jenis: **Inovasi Produk** (fitur/desain), **Inovasi Proses/Layanan** (cara produksi/pesan), dan **Inovasi Model Bisnis** (mis. sistem langganan/subscription).",
      steps: [
        "Pilih 1 produk inovatif nyata (dari UMKM lokal, marketplace, atau media sosial).",
        "Identifikasi **jenis inovasinya**: inovasi produk, inovasi proses/layanan, atau inovasi model bisnis.",
        "Analisis **faktor pendukung keberhasilan** dan **potensi risiko kegagalan** produk tersebut.",
        "Bandingkan **Value Proposition (nilai tambah)** produk dengan kompetitor sejenis pada tabel 4 aspek (keunggulan, harga, kualitas/fitur, nilai tambah).",
        "Susun kesimpulan dan rekomendasi pengembangan berbasis data."
      ],
      rubric: "Kelengkapan deskripsi, ketepatan klasifikasi 3 jenis inovasi, perbandingan nilai tambah dengan kompetitor, dan rekomendasi berbasis data.",
      promptQuestion: "Sebutkan **1 produk inovatif** yang pernah kamu lihat di Makassar atau marketplace! Menurutmu, inovasi utamanya ada di **produk, proses layanan, atau model bisnisnya**?"
    },
    {
      id: "tp5",
      kelas: "XI",
      title: "Prototipe Produk/Jasa (Design Thinking)",
      jp: "2 Pertemuan (10 JP)",
      tp: "Murid mampu merancang prototipe produk/jasa sesuai bidang keahlian dengan pendekatan design thinking.",
      keywords: ["design thinking", "prototipe", "prototype", "empathize", "define", "ideate", "test", "iterasi", "problem statement", "user flow", "low-fidelity", "high-fidelity"],
      summary: "Design Thinking memiliki 5 tahapan berurutan: **1) Empathize** (pahami pengguna), **2) Define** (rumuskan *problem statement*), **3) Ideate** (brainstorming ide), **4) Prototype** (purwarupa *low-fidelity* → *high-fidelity* & *user flow*), dan **5) Test** (uji ke ≥3 pengguna lalu **iterasi**).",
      steps: [
        "**Tahap 1 — Empathize:** Wawancarai/survei calon pengguna untuk menggali keluhan nyatanya.",
        "**Tahap 2 — Define:** Rumuskan *Problem Statement* (contoh: *'Pelajar SMK butuh camilan sehat cepat saji karena jam istirahat terbatas'*).",
        "**Tahap 3 — Ideate:** Lakukan *brainstorming* banyak ide lalu pilih 1 solusi paling layak.",
        "**Tahap 4 — Prototype:** Buat sketsa/maket/mock-up (*low-fidelity* di kertas/Canva/Figma) dan susun *user flow*.",
        "**Tahap 5 — Test & Iterasi:** Uji ke minimal **3 calon pengguna**, catat umpan balik, lalu sempurnakan (iterasi)!"
      ],
      rubric: "Penilaian berfokus pada penguasaan 5 tahap Design Thinking (bobot 4), kualitas prototipe (bobot 2), penyampaian (bobot 2), media (bobot 1), dan kerja sama (bobot 1).",
      promptQuestion: "Kita mulai dari **Tahap 1 (Empathize)**: siapa calon pengguna produk/jasa kelompokmu, dan masalah nyata apa yang paling sering mereka keluhkan?"
    },
    {
      id: "tp6",
      kelas: "XI",
      title: "Pembuatan Produk Inovatif (PjBL)",
      jp: "6 Pertemuan (30 JP)",
      tp: "Murid mampu membuat produk inovatif.",
      keywords: ["buat produk", "membuat produk", "purwarupa", "produksi", "bazar", "kemasan", "efisiensi bahan", "keselamatan kerja"],
      summary: "Proyek pembuatan produk inovatif berjalan 6 pertemuan: riset ke ≥10 responden, pemilihan ide inovatif (unik, bernilai tambah, layak produksi), desain + BMC, pembuatan prototipe dengan K3 & efisiensi bahan, pengujian & perbaikan, hingga simulasi bazar.",
      steps: [
        "Riset pasar ke minimal **10 responden** untuk menemukan 5 kebutuhan nyata konsumen.",
        "Seleksi ide produk yang memenuhi 4 kriteria: **unik, bernilai tambah, layak diproduksi, sesuai pasar**.",
        "Buat desain bentuk/bahan/kemasan di Canva + ringkasan BMC.",
        "Produksi prototipe dengan memperhatikan **keselamatan kerja (K3)** dan dokumentasi foto/video.",
        "Uji produk ke calon konsumen, catat *feedback*, lakukan perbaikan, lalu pamerkan di **simulasi bazar**."
      ],
      rubric: "Menilai kualitas & orisinalitas produk, kelayakan produksi, dokumentasi uji/perbaikan, dan performa simulasi penjualan bazar.",
      promptQuestion: "Sudah sampai tahap mana proyek produk inovatifmu: **riset 10 responden, desain kemasan, produksi prototipe, atau uji coba konsumen**?"
    },
    {
      id: "tp7",
      kelas: "XI",
      title: "Proposal Usaha, BMC, Manajemen Risiko & BEP",
      jp: "8 Pertemuan (40 JP)",
      tp: "Menyusun Proposal Usaha dan Mengelola Risiko dalam Berwirausaha.",
      keywords: ["proposal", "bmc", "business model canvas", "risiko", "mitigasi", "bep", "titik impas", "break even", "pitching", "pitch deck", "biaya tetap", "biaya variabel"],
      summary: "Menyusun proposal usaha utuh mencakup **BMC 9 elemen**, identifikasi **4 jenis risiko** (Pasar, Operasional, Keuangan, SDM) beserta **4 strategi mitigasi** (Menghindari, Mengurangi, Memindahkan, Menerima), perhitungan **BEP**, kerangka proposal, dan simulasi **pitching** (10–12 menit + 5 menit tanya jawab).",
      steps: [
        "**BMC 9 Elemen:** *Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure*.",
        "**Analisis 4 Risiko & Mitigasi:** Kelompokkan risiko (Pasar, Operasional, Keuangan, SDM) lalu tentukan strategi (*Menghindari, Mengurangi, Memindahkan/Asuransi, Menerima*) dan penanggung jawabnya.",
        "**Hitung BEP:** Rumus `BEP (unit) = Biaya Tetap ÷ (Harga Jual − Biaya Variabel)` (selalu dibulatkan ke atas agar tidak rugi!).",
        "**Sistematika Proposal:** Profil Usaha, Latar Belakang, BMC, Pemasaran, Operasional, Keuangan (Modal & BEP), Manajemen Risiko, Penutup.",
        "**Latihan Pitching:** Siapkan *pitch deck* Canva/Slides dan latih tanya jawab bersama KIKI."
      ],
      rubric: "Penilaian pitching bobot: Penguasaan Materi (4), Penyampaian (2), Media (2), Bahasa/Artikulasi (1), Kontak Mata/Gestur (1) × 2 = maks 100.",
      promptQuestion: "Bagian mana yang ingin kita kerjakan dulu: **BMC 9 elemen, tabel risiko & mitigasi, hitung BEP** (bisa langsung ketik angkanya di sini!), atau **simulasi tanya jawab pitching**?"
    },
    {
      id: "tp8",
      kelas: "XI",
      title: "Komersialisasi Produk Inovatif",
      jp: "2 Pertemuan (10 JP)",
      tp: "Menerapkan komersialisasi produk inovatif.",
      keywords: ["komersialisasi", "positioning", "branding", "saluran distribusi", "proyeksi pendapatan", "strategi harga"],
      summary: "Komersialisasi mengubah produk inovatif menjadi siap jual dan diterima pasar melalui 5 pilar: **riset pasar (≥15 responden), positioning, branding, penetapan harga, dan saluran distribusi** (media sosial, marketplace, bazar).",
      steps: [
        "Lakukan riset pasar Google Form ke minimal **15 calon konsumen** (kebutuhan, preferensi, daya beli).",
        "Susun **Strategi Pemasaran Awal**: target pasar, keunggulan produk (*positioning*), dan saluran promosi.",
        "Lengkapi **Rencana Komersialisasi (5 komponen)**: Deskripsi Produk, Target Pasar, Strategi Harga, Strategi Promosi, dan Proyeksi Pendapatan (`Perkiraan Penjualan × Harga`).",
        "Buat poster/konten promosi di Canva dan lakukan simulasi pitching di depan calon konsumen/investor."
      ],
      rubric: "5 aspek berbobot sama (Penguasaan Materi, Penyampaian, Media Promosi, Strategi Komersialisasi, Kepercayaan Diri/Kerja Sama).",
      promptQuestion: "Untuk produk inovatif kelompokmu, **berapa kisaran harga** yang paling masuk akal dengan daya beli target konsumenmu, dan lewat saluran mana kamu akan menjualnya?"
    },
    {
      id: "tp9",
      kelas: "XII",
      title: "Pemasaran Produk & Bauran 4P",
      jp: "4 Pertemuan (20 JP)",
      tp: "Murid mampu menerapkan pemasaran produk.",
      keywords: ["pemasaran", "marketing", "4p", "product", "price", "place", "promotion", "segmentasi", "demografis", "geografis", "psikografis", "cta", "call to action", "konten promosi"],
      summary: "Pemasaran produk memadukan **segmentasi pasar** (Demografis, Geografis, Psikografis, Perilaku), **Bauran Pemasaran 4P** (*Product, Price, Place, Promotion*), pembuatan konten promosi dengan **Call to Action (CTA)** yang jujur/etis, serta evaluasi respons konsumen.",
      steps: [
        "Tentukan **Segmentasi Target Pasar**: Demografis (usia/pendapatan), Geografis (lokasi), Psikografis (gaya hidup), Perilaku.",
        "Susun **Bauran 4P**: *Product* (keunggulan/kemasan), *Price* (strategi harga), *Place* (offline/Shopee/Tokopedia/WA), *Promotion* (IG/TikTok/brosur).",
        "Buat konten promosi (Canva/CapCut) memuat 3 elemen: **pesan jelas, visual menonjol, dan Call to Action (CTA)** tanpa informasi menyesatkan.",
        "Uji coba promosi & simulasi bazar, catat interaksi (like/komentar/penjualan di BukuWarung), lalu evaluasi efektivitasnya."
      ],
      rubric: "Kelengkapan segmentasi target pasar, kejelasan 4P, kualitas konten promosi + CTA, data respons konsumen, dan evaluasi efektivitas.",
      promptQuestion: "Siapa **target pasar utama** produkmu (usia, lokasi, dan kebiasaannya), dan ajakan **Call to Action (CTA)** apa yang ingin kamu pasang di konten promosimu?"
    },
    {
      id: "tp10",
      kelas: "XII",
      title: "Pengelolaan Keuangan Usaha (HPP, Arus Kas & Laba Rugi)",
      jp: "4 Pertemuan (20 JP)",
      tp: "Murid mampu membuat pengelolaan keuangan.",
      keywords: ["keuangan", "hpp", "harga pokok", "arus kas", "cash flow", "laba rugi", "modal", "bukuwarung", "bukukas", "margin", "pembukuan", "likuiditas"],
      summary: "Pengelolaan keuangan usaha yang akuntabel memisahkan uang pribadi dan usaha, mencatat transaksi (≥15 transaksi/bulan di BukuWarung/Sheets), menganalisis **Arus Kas (Cash Flow)**, menghitung **HPP & Harga Jual**, dan menyusun **Laporan Laba Rugi**.",
      steps: [
        "Pisahkan **Modal Awal, Biaya Tetap** (sewa, gaji tetap), dan **Biaya Variabel** (bahan baku, kemasan).",
        "Catat minimal **15 simulasi transaksi** masuk/keluar di BukuWarung atau Google Sheets untuk memantau **Arus Kas** (jangan sampai kas keluar > kas masuk berkepanjangan → risiko likuiditas!).",
        "Hitung **HPP per unit** (`Total Biaya Produksi ÷ Jumlah Unit`) lalu tentukan **Harga Jual** (`HPP + Margin Keuntungan`).",
        "Susun **Laporan Laba Rugi** (`Total Pendapatan − Total Biaya`) dan strategi efisiensi biaya."
      ],
      rubric: "8 indikator laporan: modal, ≥15 transaksi, ketepatan HPP, alasan harga jual, laporan laba rugi, analisis arus kas, strategi berkelanjutan, dan kerapian.",
      promptQuestion: "Mau coba hitung **HPP & Harga Jual** produkmu? Ketikkan total biaya produksi, jumlah unit, dan target margin % (atau klik **Kalkulator HPP** di Menu 5)!"
    },
    {
      id: "tp11",
      kelas: "XII",
      title: "Budaya Korporasi (Corporate Culture)",
      jp: "3 Pertemuan (15 JP)",
      tp: "Murid mampu menerapkan budaya korporasi.",
      keywords: ["budaya korporasi", "corporate culture", "nilai inti", "core values", "kode etik", "integritas", "disiplin", "role play", "role-play", "pelanggan"],
      summary: "Budaya korporasi adalah nilai, norma, etika kerja, simbol, dan kebiasaan bersama dalam usaha (seperti disiplin, integritas, kerja sama, orientasi pelanggan) yang dituangkan dalam **Pedoman Budaya Korporasi** dan dipraktikkan lewat simulasi *role-play*.",
      steps: [
        "Analisis budaya kerja 1 UMKM/perusahaan nyata (nilai, norma, etika kerja, dan simbolnya).",
        "Tentukan **Visi-Misi** dan **Nilai Inti (Core Values)** yang cocok dengan usaha simulasi kelompokmu.",
        "Susun **Pedoman Budaya Korporasi** (standar sikap kerja + aturan interaksi pelanggan/rekan) dan desain **Poster Nilai Perusahaan** di Canva.",
        "Lakukan simulasi **role-play 5–7 menit** (melayani pelanggan, rapat tim, atau menangani keluhan secara sopan & solutif)."
      ],
      rubric: "Pedoman memuat core values, kode etik sikap kerja, standar layanan pelanggan, kesesuaian jenis usaha, serta poster nilai yang komunikatif.",
      promptQuestion: "Untuk usaha simulasi kelompokmu, sebutkan **3 nilai inti (core values)** paling penting yang wajib dipegang seluruh anggota tim!"
    },
    {
      id: "tp12",
      kelas: "XII",
      title: "Evaluasi Usaha & Perbaikan Berkelanjutan (PDCA / Kaizen)",
      jp: "4 Pertemuan (20 JP)",
      tp: "Murid mampu mengevaluasi proses kewirausahaan dan melakukan perbaikan berkelanjutan.",
      keywords: ["evaluasi", "pdca", "kaizen", "perbaikan berkelanjutan", "continuous improvement", "finansial", "non-finansial", "plan", "do", "check", "act", "umpan balik pelanggan"],
      summary: "Evaluasi usaha mengukur indikator **Finansial** (omzet, laba, arus kas) dan **Non-Finansial** (kepuasan pelanggan, loyalitas, citra usaha), lalu menindaklanjuti kekurangan secara bertahap dengan prinsip **Kaizen** dan siklus **PDCA (Plan–Do–Check–Act)**.",
      steps: [
        "Tetapkan **indikator keberhasilan** (finansial & non-finansial) serta buat kuesioner kepuasan pelanggan di Google Form.",
        "Kumpulkan & analisis data kinerja pada aspek **produksi, pemasaran, keuangan, dan layanan**.",
        "Rancang perbaikan dengan siklus **PDCA**: **Plan** (rencana perbaikan), **Do** (pelaksanaan), **Check** (pantau & evaluasi hasil), **Act** (tindak lanjut/standardisasi).",
        "Uji coba perbaikan (mis. kemasan/promosi baru) di bazar mini dan presentasikan hasilnya."
      ],
      rubric: "Laporan memuat indikator jelas, data kinerja, analisis kelebihan/kekurangan, rencana siklus PDCA, dan penyajian sistematis.",
      promptQuestion: "Jika usahamu mendapat keluhan pelanggan (mis. kemasan mudah bocor atau respons chat lambat), langkah **Plan** dan **Check** apa yang akan kamu buat dalam siklus PDCA?"
    },
    {
      id: "tp13",
      kelas: "XII",
      title: "Usaha Hijau, Etika & Tanggung Jawab Sosial (Green Business)",
      jp: "3 Pertemuan (15 JP)",
      tp: "Murid mampu menerapkan pengelolaan lingkungan berkelanjutan dengan memperhatikan etika dan tanggung jawab sosial.",
      keywords: ["lingkungan", "hijau", "green business", "3r", "reduce", "reuse", "recycle", "csr", "tanggung jawab sosial", "triple bottom line", "profit", "people", "planet", "ekonomi sirkular", "limbah"],
      summary: "Usaha berkelanjutan menerapkan **Etika Bisnis**, **Ekonomi Sirkular 3R** (*Reduce, Reuse, Recycle*), **CSR** (Tanggung Jawab Sosial), dan mengevaluasi kelayakan dengan **Triple Bottom Line**: **Profit** (ekonomi), **People** (sosial), dan **Planet** (lingkungan).",
      steps: [
        "Identifikasi dampak lingkungan (limbah, bahan baku) dan sosial dari kegiatan usaha di sekitarmu.",
        "Susun strategi **3R** pada 4 aspek: *sumber bahan baku, proses produksi, pengelolaan limbah, dan kemasan ramah lingkungan*.",
        "Rancang **1 Program CSR nyata** (mis. kemitraan bank sampah Makassar, pelatihan warga, atau bahan baku petani lokal).",
        "Evaluasi **Green Business Plan** kelompokmu berdasarkan **Triple Bottom Line (Profit, People, Planet)** dan buat poster kampanye di Canva."
      ],
      rubric: "Laporan memuat identifikasi dampak, strategi 3R lengkap, program CSR jelas, dan evaluasi kelayakan Profit-People-Planet.",
      promptQuestion: "Limbah atau isu lingkungan apa di sekitar Makassar/sekolahmu yang bisa kamu ubah jadi peluang **Green Business**, dan prinsip **3R** mana yang kamu pakai?"
    }
  ],

  glossary: {
    "talent mapping": "Proses mengidentifikasi dan memetakan potensi, minat, serta karakter personal seseorang agar selaras dengan pilihan usaha/karier.",
    "riasec": "Model tes minat-karier (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) untuk membantu mengenali kecenderungan potensi diri.",
    "bep": "Break Even Point (Titik Impas): jumlah penjualan minimal di mana total pendapatan sama dengan total biaya (belum untung, belum rugi). Rumus: Biaya Tetap ÷ (Harga Jual − Biaya Variabel).",
    "hpp": "Harga Pokok Produksi: seluruh biaya yang dikeluarkan untuk menghasilkan satu unit produk hingga siap dijual.",
    "bmc": "Business Model Canvas: peta rencana bisnis dalam 1 halaman yang terdiri dari 9 elemen (Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure).",
    "design thinking": "Pendekatan pemecahan masalah kreatif yang berpusat pada pengguna melalui 5 tahap: Empathize, Define, Ideate, Prototype, dan Test.",
    "saw": "Simple Additive Weighting: metode pembobotan kriteria berbantuan spreadsheet untuk memilih alternatif keputusan terbaik secara objektif berbasis data.",
    "value proposition": "Nilai tambah atau manfaat unik yang ditawarkan produk kepada konsumen dibandingkan produk pesaing.",
    "4p": "Bauran Pemasaran (Marketing Mix): Product (Produk), Price (Harga), Place (Tempat/Distribusi), dan Promotion (Promosi).",
    "cta": "Call to Action: kalimat ajakan yang mendorong calon konsumen segera bertindak (membeli, menghubungi WA, atau klik tautan).",
    "pdca": "Plan–Do–Check–Act: siklus empat langkah manajemen untuk melakukan evaluasi dan perbaikan usaha secara berkelanjutan.",
    "kaizen": "Filosofi perbaikan kecil yang dilakukan secara terus-menerus (continuous improvement) untuk meningkatkan mutu usaha.",
    "csr": "Corporate Social Responsibility: tanggung jawab sosial perusahaan/usaha terhadap masyarakat dan lingkungan sekitar.",
    "triple bottom line": "Kerangka evaluasi kelayakan usaha berkelanjutan pada 3 pilar: Profit (ekonomi), People (sosial), dan Planet (lingkungan).",
    "ekonomi sirkular": "Model usaha yang meminimalkan limbah melalui prinsip 3R (Reduce, Reuse, Recycle) sehingga material terus dimanfaatkan kembali.",
    "arus kas": "Cash flow: catatan keluar masuknya uang tunai dalam kegiatan usaha selama periode tertentu."
  }
};

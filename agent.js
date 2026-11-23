// Mesin Agen AI KIKI: Asisten AI Wirausaha Muda
// Mendukung Mode Mandiri (100% Lokal Berbasis 13 RPP KIK) + Mode Opsional Gemini API (BYOK)

class KikiAgent {
  constructor() {
    this.kb = window.KIKI_KNOWLEDGE;
    this.quizzes = window.KIKI_QUIZZES;
    this.tools = window.KIKI_TOOLS;
    this.state = {
      studentName: "",
      studentClass: "XI",
      studentMajor: "",
      activeMenu: null,
      activeStep: 0,
      quizSession: null, // { quizId, index, score, answers: [] }
      reflectionMode: false,
      notes: [], // Catatan penting untuk Rangkuman Siap Salin
      apiKey: localStorage.getItem("kiki_gemini_key") || "",
      useGemini: localStorage.getItem("kiki_use_gemini") === "true"
    };
  }

  saveApiConfig(apiKey, useGemini) {
    this.state.apiKey = (apiKey || "").trim();
    this.state.useGemini = Boolean(useGemini && this.state.apiKey);
    localStorage.setItem("kiki_gemini_key", this.state.apiKey);
    localStorage.setItem("kiki_use_gemini", String(this.state.useGemini));
  }

  setProfile(name, cls, major) {
    if (name) this.state.studentName = name.trim();
    if (cls) this.state.studentClass = cls;
    if (major) this.state.studentMajor = major;
  }

  getGreeting() {
    const nama = this.state.studentName ? ` **${this.state.studentName}**` : "";
    return {
      text: `Halo${nama}! Aku **KIKI** 💡 (*Kreativitas, Inovasi, Kewirausahaan Interaktif*), asisten AI pendamping belajar mapel KIK SMKN 2 Makassar.\n\nAku siap memandumu langkah demi langkah sesuai **13 Modul RPP KIK (Kelas XI & XII)** — *bukan mengerjakan tugasmu, ya, tapi membantu kamu menyusunnya sendiri dengan percaya diri!*\n\n**Pilih menu untuk mulai:**\n1. 🧭 **Peta Bakat & Peluang** *(Talent Mapping, Riset Pasar, SAW)*\n2. 🛠️ **Lab Inovasi & Prototipe** *(Produk Inovatif & 5 Tahap Design Thinking)*\n3. 📊 **Proposal, Risiko & BEP** *(BMC 9 Elemen, Risiko, Hitung BEP, Pitching)*\n4. 🌿 **Pemasaran, Keuangan & Hijau** *(4P, HPP, Budaya Korporasi, PDCA, 3R/CSR)*\n5. 🧮 **Kalkulator & Contoh UMKM** *(BEP, HPP, SAW, Kasus UMKM Sulsel)*\n6. 🎯 **Kuis RPP & Refleksi** *(109 Soal PG Resmi + Refleksi Traffic Light)*\n\nBoleh kenalan dulu? Ketik **nama panggilan, kelas (XI/XII), jurusanmu**, atau langsung pilih **angka menu (1–6)** di bawah!`,
      chips: [
        "1. Peta Bakat & Peluang",
        "2. Lab Inovasi & Prototipe",
        "3. Proposal, Risiko & BEP",
        "4. Pemasaran, Keuangan & Hijau",
        "5. Kalkulator & Contoh UMKM",
        "6. Kuis RPP & Refleksi"
      ]
    };
  }

  // Guardrail 1: Deteksi Data Pribadi Sensitif
  checkPrivacyGuardrail(text) {
    const hasPhone = /(?:\+62|62|0)8[1-9][0-9\-\s]{7,12}/.test(text);
    const hasNIK = /\b\d{16}\b/.test(text);
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasSensitiveWord = /(nik saya|no\.?\s*hp|nomor\s*wa|password|kata sandi|alamat rumah saya|jl\.\s*[a-z]+\s*no\.?\s*\d)/i.test(text);

    if (hasPhone || hasNIK || hasEmail || hasSensitiveWord) {
      return {
        blocked: true,
        text: `🔒 **Pengingat Privasi KIKI**\n\nWah, sepertinya pesanmu memuat **data pribadi** (seperti nomor HP/WA, NIK, email, alamat rumah, atau kata sandi). Demi keamananmu, **KIKI tidak meminta dan tidak menyimpan data pribadi**.\n\nCukup gunakan nama panggilan dan jurusan saja saat berdiskusi ya! Yuk lanjut belajar KIK — menu mana yang mau kita bahas sekarang?`,
        chips: ["Kembali ke Menu", "3. Proposal, Risiko & BEP", "6. Kuis RPP & Refleksi"]
      };
    }
    return { blocked: false };
  }

  // Guardrail 2: Prinsip Memandu, Bukan Mengerjakan Tugas Penuh
  checkAntiCheatGuardrail(text) {
    const lower = text.toLowerCase();
    const cheatPattern = /(buatkan\s+(?:proposal|bmc|tugas|laporan|green business|pedoman).*?(?:lengkap|jadi|siap kumpul|penuh|utuh)|kerjakan\s+tugas|tolong\s+kerjakan|bikinin\s+tugas|kasih\s+jawaban\s+langsung|buatkan\s+semua)/i;
    if (cheatPattern.test(lower)) {
      const name = this.state.studentName ? `, ${this.state.studentName}` : "";
      return {
        blocked: true,
        text: `✋ **Prinsip Belajar KIKI**\n\nMaaf ya${name}, KIKI dirancang sebagai **mentor pendamping** agar kamu benar-benar menguasai kompetensi KIK — jadi KIKI **tidak membuatkan tugas jadi siap kumpul** secara instan.\n\nKabar baiknya, kita bisa menyusunnya **langkah demi langkah dengan cepat**! Kamu tulis ide awalamu dengan kalimat sendiri, nanti KIKI bantu cek dan beri umpan balik sesuai rubrik RPP.\n\nYuk mulai langkah pertama: **apa ide produk/jasa usaha** yang ingin kelompokmu bahas sekarang?`,
        chips: ["Mulai Panduan BMC", "Mulai Design Thinking", "Contoh UMKM Sulsel", "Kembali ke Menu"]
      };
    }
    return { blocked: false };
  }

  // Guardrail 3: Deteksi topik di luar KIK
  checkOutOfScope(text) {
    const lower = text.toLowerCase();
    const offTopic = /(ramalan zodiak|gosip artis|cheat game|hack akun|politik praktis|matematika integral|resep obat|buatkan puisi cinta)/i;
    if (offTopic.test(lower)) {
      return {
        blocked: true,
        text: `🧭 **Fokus Topik KIK**\n\nTopik tersebut berada di luar materi **Kreativitas, Inovasi dan Kewirausahaan (KIK)**. KIKI fokus mendampingimu pada 13 modul KIK (Talent Mapping, Peluang Usaha, SAW, Design Thinking, BMC, Risiko, BEP, Pemasaran 4P, HPP/Keuangan, Budaya Korporasi, PDCA, dan Green Business).\n\nMau lanjut ke menu KIK yang mana?`,
        chips: ["Kembali ke Menu", "1. Peta Bakat & Peluang", "6. Kuis RPP & Refleksi"]
      };
    }
    return { blocked: false };
  }

  // Catat ringkasan interaksi untuk Rangkuman Siap Salin
  recordNote(topic, snippet) {
    const clean = snippet.replace(/\s+/g, " ").trim().slice(0, 220);
    if (!clean) return;
    this.state.notes.push({
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      topic,
      content: clean
    });
    if (this.state.notes.length > 25) this.state.notes.shift();
  }

  generateCopyableSummary() {
    const nama = this.state.studentName || "(Belum diisi)";
    const kelas = `Kelas ${this.state.studentClass} — ${this.state.studentMajor || "SMKN 2 Makassar"}`;
    const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    let lines = [
      "==================================================",
      "RANGKUMAN SESI BELAJAR — KIKI: ASISTEN AI WIRAUSAHA MUDA",
      "Mata Pelajaran: Kreativitas, Inovasi & Kewirausahaan (KIK)",
      "Satuan Pendidikan: SMKN 2 Makassar",
      "==================================================",
      `Nama Murid    : ${nama}`,
      `Kelas/Jurusan : ${kelas}`,
      `Tanggal Sesi  : ${dateStr}`,
      ""
    ];

    if (this.state.notes.length === 0) {
      lines.push("Belum ada catatan kerja pada sesi ini. Mulai pilih Menu 1–6 lalu berdiskusi dengan KIKI agar hasil belajarmu otomatis terangkum di sini!");
    } else {
      lines.push("RINGKASAN HASIL DISKUSI & LATIHAN:");
      this.state.notes.forEach((n, i) => {
        lines.push(`${i + 1}. [${n.time}] (${n.topic}) ${n.content}`);
      });
    }

    lines.push("");
    lines.push("CATATAN VERIFIKASI:");
    lines.push("- Periksa kembali seluruh hasil diskusi/perhitungan dengan RPP & konfirmasi ke guru.");
    lines.push("- Pastikan tidak mencantumkan data pribadi sensitif saat menempel ke Lembar Kerja/Canva/Google Docs.");
    return lines.join("\n");
  }

  async processMessage(rawText) {
    const text = (rawText || "").trim();
    if (!text) return this.getGreeting();
    const lower = text.toLowerCase();

    // 1. Cek Guardrail Privasi (Prioritas Tertinggi)
    const privacy = this.checkPrivacyGuardrail(text);
    if (privacy.blocked) return privacy;

    // 2. Cek perintah navigasi cepat "menu" / "halo" / "rangkuman"
    if (/^(menu|kembali ke menu|awal|beranda|halo|hai|hi|selamat pagi|selamat siang)$/i.test(lower)) {
      this.state.quizSession = null;
      this.state.reflectionMode = false;
      this.state.activeMenu = null;
      return this.getGreeting();
    }

    if (/^(rangkuman|buat rangkuman|penutup|selesai)$/i.test(lower)) {
      this.state.quizSession = null;
      return {
        text: `📋 **Penutup & Rangkuman Siap Salin**\n\nKeren sekali progres belajarmu hari ini! Kamu bisa klik tombol **"Rangkuman Siap Salin"** di bagian atas untuk langsung menyalin hasil sesi ke Lembar Kerja, Google Docs, atau Canva.\n\n⚠️ *Ingat ya:* selalu periksa kembali jawaban AI dengan RPP/guru dan jangan bagikan data pribadi sensitif.\n\nMau lanjut ke menu lain atau isi **Refleksi Traffic Light** dulu?`,
        chips: ["Buka Rangkuman Siap Salin", "Refleksi Traffic Light", "Kembali ke Menu"],
        action: "open-summary"
      };
    }

    // 3. Cek Sesi Kuis Aktif
    if (this.state.quizSession) {
      return this.handleQuizAnswer(text);
    }

    // 4. Cek Mode Refleksi Traffic Light
    if (this.state.reflectionMode) {
      return this.handleReflectionResponse(text);
    }

    // 5. Cek Guardrail Anti-Joki & Out-of-Scope
    const antiCheat = this.checkAntiCheatGuardrail(text);
    if (antiCheat.blocked) return antiCheat;

    const oos = this.checkOutOfScope(text);
    if (oos.blocked) return oos;

    // 6. Cek Perhitungan Otomatis BEP / HPP langsung dari chat!
    const bepRes = this.tools.extractBEPFromText(text);
    if (bepRes) {
      if (!bepRes.ok) {
        return { text: `⚠️ **Cek Angka BEP:** ${bepRes.error}\n\nCoba kirim ulang dengan format: *Biaya tetap 1.500.000, harga jual 15.000, biaya variabel 8.000*.`, chips: ["Buka Kalkulator BEP", "3. Proposal, Risiko & BEP"] };
      }
      this.recordNote("Perhitungan BEP", `Biaya Tetap ${this.tools.formatRp(bepRes.fixedCost)}, Harga ${this.tools.formatRp(bepRes.pricePerUnit)}, Variabel ${this.tools.formatRp(bepRes.variableCost)} → BEP ${bepRes.unitsCeil} unit (${this.tools.formatRp(bepRes.bepRupiah)}).`);
      return {
        text: `🧮 **Hasil Perhitungan BEP (Titik Impas)**\n\n- **Biaya Tetap (FC):** ${this.tools.formatRp(bepRes.fixedCost)}\n- **Harga Jual/unit (P):** ${this.tools.formatRp(bepRes.pricePerUnit)}\n- **Biaya Variabel/unit (VC):** ${this.tools.formatRp(bepRes.variableCost)}\n- **Margin Kontribusi (P − VC):** ${this.tools.formatRp(bepRes.contributionMargin)} (${bepRes.marginRatio}%)\n\n📐 **Rumus:** \`BEP (unit) = FC ÷ (P − VC)\`\n\`${bepRes.fixedCost.toLocaleString("id-ID")} ÷ ${bepRes.contributionMargin.toLocaleString("id-ID")} = ${bepRes.exactUnits}\`\n\n✅ **BEP Unit (dibulatkan ke atas):** **${bepRes.unitsCeil} unit/porsi**\n✅ **BEP Rupiah (Omzet Impas):** **${this.tools.formatRp(bepRes.bepRupiah)}**\n\n*Catatan:* Pembulatan ke atas wajib dilakukan agar biaya tetap tertutup penuh (tidak rugi). Menurutmu, target penjualan **${bepRes.unitsCeil} unit/bulan** realistis untuk target pasarmu?`,
        chips: ["Buka Kalkulator BEP", "Lanjut Kerangka Proposal", "Simulasi Pitching", "Rangkuman"]
      };
    }

    const hppRes = this.tools.extractHPPFromText(text);
    if (hppRes) {
      if (!hppRes.ok) {
        return { text: `⚠️ **Cek Angka HPP:** ${hppRes.error}`, chips: ["Buka Kalkulator HPP"] };
      }
      this.recordNote("Perhitungan HPP", `HPP ${this.tools.formatRp(hppRes.hppPerUnit)}/unit, margin ${hppRes.marginPercent}% → Harga Jual ${this.tools.formatRp(hppRes.sellingPrice)}/unit.`);
      return {
        text: `💰 **Hasil Perhitungan HPP & Harga Jual**\n\n- **HPP per unit:** **${this.tools.formatRp(hppRes.hppPerUnit)}**\n- **Target Margin (${hppRes.marginPercent}%):** ${this.tools.formatRp(hppRes.profitPerUnit)}/unit\n- **Rekomendasi Harga Jual:** **${this.tools.formatRp(hppRes.sellingPrice)}/unit**\n- **Estimasi Total Laba (${hppRes.totalUnits} unit):** ${this.tools.formatRp(hppRes.totalProfit)}\n\nMenurutmu, apakah harga **${this.tools.formatRp(hppRes.sellingPrice)}** sudah kompetitif dan sesuai daya beli konsumen di sekitarmu?`,
        chips: ["Buka Kalkulator HPP", "4. Pemasaran, Keuangan & Hijau", "Rangkuman"]
      };
    }

    // 7. Cek Pilihan Menu 1–6 atau Submenu
    const menuHandled = this.handleMenuSelection(text);
    if (menuHandled) return menuHandled;

    // 8. Cek Pilihan Topik Kuis
    const quizTrigger = this.checkQuizStart(text);
    if (quizTrigger) return quizTrigger;

    // 9. Cek Perkenalan Nama/Jurusan
    const introMatch = text.match(/(?:nama(?:ku| saya)?|saya|aku)\s+([a-zA-Z\s]{2,25})(?:,| dari| kelas| jurusan)/i);
    if (introMatch && !this.state.studentName) {
      this.state.studentName = introMatch[1].trim();
      if (/xii|12/i.test(text)) this.state.studentClass = "XII";
      else if (/xi|11/i.test(text)) this.state.studentClass = "XI";
      const foundMajor = this.kb.majors.find(m => lower.includes(m.split(" ")[0].toLowerCase()) || (lower.includes("kuliner") && m.includes("Kuliner")) || (lower.includes("tkj") && m.includes("Komputer")) || (lower.includes("rpl") && m.includes("Komputer")) || (lower.includes("otomotif") && m.includes("Otomotif")) || (lower.includes("busana") && m.includes("Busana")) || (lower.includes("dpib") && m.includes("DPIB")) || (lower.includes("listrik") && m.includes("listrik")));
      if (foundMajor) this.state.studentMajor = foundMajor;
      this.recordNote("Profil Murid", `Nama: ${this.state.studentName}, Kelas ${this.state.studentClass}${this.state.studentMajor ? " (" + this.state.studentMajor + ")" : ""}.`);
      return {
        text: `Salam kenal, **${this.state.studentName}**! 👋 Senang bisa mendampingi murid **Kelas ${this.state.studentClass}${this.state.studentMajor ? " — " + this.state.studentMajor : ""}** SMKN 2 Makassar.\n\nYuk langsung praktik! Menu mana yang sedang kamu pelajari hari ini?`,
        chips: [
          "1. Peta Bakat & Peluang",
          "2. Lab Inovasi & Prototipe",
          "3. Proposal, Risiko & BEP",
          "4. Pemasaran, Keuangan & Hijau",
          "6. Kuis RPP & Refleksi"
        ]
      };
    }

    // 10. Cek Mode Gemini API (Opsional jika pengguna mengaktifkan BYOK)
    if (this.state.useGemini && this.state.apiKey) {
      const geminiReply = await this.callGeminiAPI(text);
      if (geminiReply) {
        this.recordNote("Diskusi AI (Gemini)", `Tanya: ${text.slice(0, 80)} | Jawab: ${geminiReply.slice(0, 110)}...`);
        return {
          text: geminiReply,
          chips: ["Lanjut Langkah Berikutnya", "Buka Kalkulator", "6. Kuis RPP & Refleksi", "Kembali ke Menu"]
        };
      }
    }

    // 11. Mode Agen Mandiri (RAG Pencarian Cerdas di 13 RPP + Glosarium + Scaffolding Umpan Balik)
    return this.answerFromKnowledgeBase(text);
  }

  handleMenuSelection(text) {
    const lower = text.toLowerCase().trim();

    // Menu 1
    if (/^(1|1\.|menu 1|peta bakat)/i.test(lower) || lower.includes("peta bakat & peluang")) {
      this.state.activeMenu = 1;
      return {
        text: `🧭 **Menu 1: Peta Bakat & Peluang (Kelas XI)**\n\nMenu ini memandumu pada 3 modul RPP:\n- **TP 1 — Talent Mapping:** Pemetaan tipe kepribadian (RIASEC/16Personalities), 3 kekuatan karakter, 2 minat utama, ≥2 ide usaha, & rencana 1 bulan.\n- **TP 2 — Analisis Peluang Usaha:** Kuesioner Google Form, analisis pesaing, perbandingan **3 alternatif ide usaha** (permintaan, sumber daya, risiko).\n- **TP 3 — Pengambilan Keputusan (SAW):** Pembobotan kriteria secara objektif berbasis spreadsheet.\n\nPilih topik yang mau kita kerjakan bertahap sekarang:`,
        chips: ["Panduan Talent Mapping", "Panduan Riset Pasar", "Panduan Keputusan SAW", "Buka Simulator SAW", "Kuis Talent Mapping"]
      };
    }

    // Menu 2
    if (/^(2|2\.|menu 2|lab inovasi|lab prototipe)/i.test(lower)) {
      this.state.activeMenu = 2;
      return {
        text: `🛠️ **Menu 2: Lab Inovasi & Prototipe (Kelas XI)**\n\nMenu ini memandumu pada 3 modul RPP:\n- **Analisis Produk Inovatif:** Bedah inovasi produk, proses/layanan, model bisnis, & perbandingan *Value Proposition*.\n- **5 Tahap Design Thinking:** **Empathize → Define → Ideate → Prototype → Test** (+ Iterasi berdasarkan umpan balik ≥3 pengguna).\n- **Pembuatan Produk Inovatif:** Riset ≥10 responden, desain kemasan Canva, produksi prototipe (K3), hingga simulasi bazar.\n\nMau mulai dari tahapan yang mana?`,
        chips: ["Mulai Design Thinking", "Analisis Produk Inovatif", "Panduan Pembuatan Produk", "Kuis Design Thinking"]
      };
    }

    // Menu 3
    if (/^(3|3\.|menu 3|proposal.*risiko|mulai panduan bmc)/i.test(lower)) {
      this.state.activeMenu = 3;
      return {
        text: `📊 **Menu 3: Proposal, Risiko & BEP (Kelas XI)**\n\nMenu ini mendampingi proyek 8 pertemuan RPP:\n1. **Business Model Canvas (BMC) 9 Elemen**\n2. **4 Jenis Risiko** (Pasar, Operasional, Keuangan, SDM) + **4 Strategi Mitigasi** (Menghindari, Mengurangi, Memindahkan, Menerima)\n3. **Perhitungan BEP (Titik Impas):** ketik langsung angkanya di chat atau pakai **Kalkulator BEP**\n4. **Sistematika Proposal Usaha** & **Simulasi Tanya Jawab Pitching**\n\nBagian mana yang mau kamu susun dulu?`,
        chips: ["Panduan BMC 9 Elemen", "Tabel Risiko & Mitigasi", "Contoh Hitung BEP", "Simulasi Pitching", "Buka Kalkulator BEP"]
      };
    }

    // Menu 4
    if (/^(4|4\.|menu 4|pemasaran.*hijau)/i.test(lower)) {
      this.state.activeMenu = 4;
      return {
        text: `🌿 **Menu 4: Pemasaran, Keuangan & Usaha Hijau (Kelas XII)**\n\nMenu ini mencakup 5 modul lengkap KIK Kelas XII:\n- **Komersialisasi & Pemasaran 4P:** Segmentasi pasar, 4P (*Product, Price, Place, Promotion*), konten promosi & CTA.\n- **Pengelolaan Keuangan:** Modal, Arus Kas (≥15 transaksi BukuWarung), HPP, Harga Jual, & Laba Rugi.\n- **Budaya Korporasi:** Visi-misi, *Core Values*, Kode Etik, & *Role-play*.\n- **Evaluasi PDCA / Kaizen:** Indikator finansial/non-finansial & perbaikan berkelanjutan.\n- **Green Business Plan:** Ekonomi Sirkular **3R**, **CSR**, & **Triple Bottom Line** (*Profit–People–Planet*).\n\nTopik Kelas XII mana yang ingin kamu pelajari dulu?`,
        chips: ["Strategi Pemasaran 4P", "Keuangan & Hitung HPP", "Budaya Korporasi", "Evaluasi PDCA/Kaizen", "Green Business 3R & CSR"]
      };
    }

    // Menu 5
    if (/^(5|5\.|menu 5|kalkulator.*umkm|contoh umkm)/i.test(lower)) {
      this.state.activeMenu = 5;
      const major = this.state.studentMajor || "Teknik Komputer & Jaringan / RPL / DKV";
      const list = this.kb.umkmExamples[major] || this.kb.umkmExamples["Bisnis, Jasa & Umum"];
      const exText = list.map((x, i) => `${i + 1}. **${x.name}**\n   - *Nilai Tambah:* ${x.value}\n   - *Catatan Bisnis:* ${x.bmc}`).join("\n");
      return {
        text: `🧮 **Menu 5: Kalkulator & Contoh UMKM Sulawesi Selatan**\n\nBerikut contoh inspirasi usaha lokal (**${major}**):\n${exText}\n\nKamu juga bisa langsung memakai 3 alat interaktif di bawah ini (**Kalkulator BEP, HPP & Margin, atau Simulator Keputusan SAW**), atau ketik nama jurusan lain (mis. *Kuliner, Otomotif, DPIB, Mesin, Listrik, Busana*)!`,
        chips: ["Buka Kalkulator BEP", "Buka Kalkulator HPP", "Buka Simulator SAW", "Contoh UMKM Kuliner", "Contoh UMKM Otomotif", "Contoh UMKM DPIB"]
      };
    }

    // Menu 6
    if (/^(6|6\.|menu 6|kuis.*refleksi|kuis rpp)/i.test(lower)) {
      this.state.activeMenu = 6;
      return {
        text: `🎯 **Menu 6: Kuis RPP & Refleksi (109 Soal Resmi)**\n\nUji pemahamanmu dengan bank soal pilihan ganda langsung dari **13 RPP KIK SMKN 2 Makassar**! Target ketuntasan: **skor ≥ 75**.\n\n**Pilih topik kuis (10 soal + pembahasan otomatis):**\n- Kuis 1: Talent Mapping\n- Kuis 2: Analisis Peluang Usaha\n- Kuis 3: Analisis Produk Inovatif\n- Kuis 4: Design Thinking\n- Kuis 5: Pembuatan Produk Inovatif\n- Kuis 6: Proposal, BMC, Risiko & BEP\n- Kuis 7: Pemasaran 4P\n- Kuis 8: Keuangan & HPP\n- Kuis 9: Budaya Korporasi\n- Kuis 10: Evaluasi PDCA/Kaizen\n- Kuis 11: Green Business (3R & CSR)\n\nKetik nama/nomor kuis di atas, atau pilih **Refleksi Traffic Light**!`,
        chips: ["Kuis Talent Mapping", "Kuis Peluang Usaha", "Kuis Design Thinking", "Kuis Proposal & BEP", "Kuis Keuangan & HPP", "Kuis Green Business", "Refleksi Traffic Light"]
      };
    }

    // Aksi cepat pembuka modal alat
    if (lower === "buka kalkulator bep" || lower === "buka kalkulator") {
      return { text: `🧮 Membuka **Kalkulator BEP Otomatis**! Masukkan Biaya Tetap, Harga Jual, dan Biaya Variabel untuk melihat titik impas (dibulatkan ke atas) lalu kirim hasilnya ke chat untuk umpan balik.`, chips: ["Contoh Hitung BEP", "3. Proposal, Risiko & BEP"], action: "open-bep" };
    }
    if (lower === "buka kalkulator hpp") {
      return { text: `💰 Membuka **Kalkulator HPP & Harga Jual**! Hitung HPP per unit dan margin keuntungan usaha kelompokmu dengan akurat.`, chips: ["4. Pemasaran, Keuangan & Hijau"], action: "open-hpp" };
    }
    if (lower === "buka simulator saw") {
      return { text: `⚖️ Membuka **Simulator Pembobotan Keputusan (Metode SAW)**! Bandingkan alternatif ide usaha atau pemasok secara objektif berbasis bobot kriteria.`, chips: ["1. Peta Bakat & Peluang"], action: "open-saw" };
    }
    if (lower === "buka rangkuman siap salin") {
      return { text: `📋 Membuka jendela **Rangkuman Siap Salin**! Kamu bisa klik *Salin Teks* atau *Unduh (.txt)* untuk ditempel ke Lembar Kerja.`, chips: ["Kembali ke Menu"], action: "open-summary" };
    }

    // Contoh cepat BEP
    if (lower === "contoh hitung bep") {
      const demo = this.tools.calculateBEP(1500000, 15000, 8000);
      this.recordNote("Contoh BEP", "Simulasi BEP: FC Rp1.500.000, P Rp15.000, VC Rp8.000 → 215 porsi.");
      return {
        text: `📐 **Contoh Perhitungan BEP (Sesuai RPP KIK)**\n\nMisal usaha kuliner memiliki:\n- Biaya Tetap = **Rp1.500.000**\n- Harga Jual = **Rp15.000/porsi**\n- Biaya Variabel = **Rp8.000/porsi**\n\n**Hitung:** \`1.500.000 ÷ (15.000 − 8.000) = 1.500.000 ÷ 7.000 = 214,29\`\n✅ Dibulatkan ke atas → **${demo.unitsCeil} porsi** (Omzet impas **${this.tools.formatRp(demo.bepRupiah)}**).\n\nSekarang giliran usahamu! Ketikkan: *Biaya tetap ..., harga jual ..., biaya variabel ...* atau klik **Buka Kalkulator BEP**!`,
        chips: ["Buka Kalkulator BEP", "Simulasi Pitching", "Tabel Risiko & Mitigasi"]
      };
    }

    // Simulasi Pitching
    if (lower.includes("simulasi pitching") || lower.includes("latihan pitching")) {
      this.recordNote("Latihan Pitching", "Memulai simulasi tanya jawab pitching 3 pertanyaan investor.");
      return {
        text: `🎤 **Simulasi Tanya Jawab Pitching (Investor Mode)**\n\nBayangkan KIKI adalah juri/investor dari UMKM Makassar! Ingat rubrik RPP: *Penguasaan Materi (bobot 4), Penyampaian (2), Media (2), Bahasa (1), Kontak Mata/Gestur (1)*.\n\n**Pertanyaan Investor #1:**\n*"Coba jelaskan dalam 3 kalimat: produk apa yang kalian tawarkan, masalah pelanggan apa yang diselesaikan, dan mengapa pelanggan harus membeli dari kalian, bukan dari pesaing?"*\n\nKetik jawaban pitching-mu sekarang — nanti KIKI nilai dan beri masukan!`,
        chips: ["Kembali ke Menu", "Buka Kalkulator BEP", "Rangkuman"]
      };
    }

    // Refleksi Traffic Light
    if (lower.includes("refleksi traffic light") || lower === "refleksi") {
      this.state.reflectionMode = true;
      return {
        text: `🚦 **Refleksi Pembelajaran (Metode Traffic Light)**\n\nPilih warna yang paling menggambarkan pemahamanmu hari ini:\n- 🟢 **HIJAU:** Sudah paham dan siap praktik/presentasi!\n- 🟡 **KUNING:** Cukup paham, tapi masih ada 1 bagian yang agak membingungkan.\n- 🔴 **MERAH:** Masih butuh bimbingan ulang pada materi tertentu.\n\nKetik **Hijau, Kuning, atau Merah** beserta 1 hal baru yang kamu pelajari hari ini!`,
        chips: ["🟢 Hijau - Saya sudah paham!", "🟡 Kuning - Masih ada yang bingung", "🔴 Merah - Butuh bimbingan lagi"]
      };
    }

    // Contoh UMKM berdasarkan jurusan tertentu
    if (lower.startsWith("contoh umkm")) {
      let targetKey = "Bisnis, Jasa & Umum";
      if (lower.includes("kuliner")) targetKey = "Kuliner / Tata Boga";
      else if (lower.includes("otomotif")) targetKey = "Teknik Otomotif (TKR / TSM)";
      else if (lower.includes("dpib") || lower.includes("bangunan")) targetKey = "Teknik Konstruksi & Properti / DPIB";
      else if (lower.includes("mesin") || lower.includes("las")) targetKey = "Teknik Mesin / Pengelasan";
      else if (lower.includes("listrik") || lower.includes("elektro")) targetKey = "Teknik Ketenagalistrikan / Elektronika";
      else if (lower.includes("busana") || lower.includes("kriya")) targetKey = "Busana / Kriya Kreatif";
      else if (lower.includes("tkj") || lower.includes("rpl") || lower.includes("digital")) targetKey = "Teknik Komputer & Jaringan / RPL / DKV";

      const list = this.kb.umkmExamples[targetKey];
      const out = list.map((x, i) => `${i + 1}. **${x.name}**\n   - *Keunggulan:* ${x.value}\n   - *Model Bisnis:* ${x.bmc}`).join("\n");
      this.recordNote("Inspirasi UMKM", `Melihat contoh UMKM Sulsel bidang ${targetKey}.`);
      return {
        text: `🏪 **Contoh Kasus UMKM Sulsel — ${targetKey}**\n\n${out}\n\nDari contoh di atas, ide usaha mana yang memicu inspirasimu untuk dikembangkan di kelompokmu?`,
        chips: ["1. Peta Bakat & Peluang", "2. Lab Inovasi & Prototipe", "3. Proposal, Risiko & BEP"]
      };
    }

    return null;
  }

  checkQuizStart(text) {
    const lower = text.toLowerCase();
    if (!lower.includes("kuis")) return null;

    let selected = null;
    if (lower.includes("talent") || lower.includes("bakat") || /kuis\s*1\b/.test(lower)) selected = this.quizzes[0];
    else if (lower.includes("peluang") || /kuis\s*2\b/.test(lower)) selected = this.quizzes[1];
    else if (lower.includes("analisis produk") || /kuis\s*3\b/.test(lower)) selected = this.quizzes[2];
    else if (lower.includes("design") || lower.includes("prototipe") || /kuis\s*4\b/.test(lower)) selected = this.quizzes[3];
    else if (lower.includes("buat produk") || lower.includes("pembuatan") || /kuis\s*5\b/.test(lower)) selected = this.quizzes[4];
    else if (lower.includes("proposal") || lower.includes("bmc") || lower.includes("bep") || lower.includes("risiko") || /kuis\s*6\b/.test(lower)) selected = this.quizzes[5];
    else if (lower.includes("pemasaran") || lower.includes("4p") || /kuis\s*7\b/.test(lower)) selected = this.quizzes[6];
    else if (lower.includes("keuangan") || lower.includes("hpp") || /kuis\s*8\b/.test(lower)) selected = this.quizzes[7];
    else if (lower.includes("budaya") || lower.includes("korporasi") || /kuis\s*9\b/.test(lower)) selected = this.quizzes[8];
    else if (lower.includes("evaluasi") || lower.includes("pdca") || lower.includes("kaizen") || /kuis\s*10\b/.test(lower)) selected = this.quizzes[9];
    else if (lower.includes("hijau") || lower.includes("green") || lower.includes("3r") || lower.includes("csr") || /kuis\s*11\b/.test(lower)) selected = this.quizzes[10];

    if (!selected) return null;

    this.state.quizSession = {
      quiz: selected,
      index: 0,
      correct: 0,
      answers: []
    };
    return this.formatQuizQuestion();
  }

  formatQuizQuestion() {
    const qs = this.state.quizSession;
    const item = qs.quiz.questions[qs.index];
    const letters = ["A", "B", "C", "D", "E"];
    const optsStr = item.opts.map((o, i) => `**${letters[i]}.** ${o}`).join("\n");

    return {
      text: `🎯 **${qs.quiz.title}** — *Soal ${qs.index + 1} dari ${qs.quiz.questions.length}*\n\n**${item.q}**\n\n${optsStr}\n\nKetik atau klik huruf jawabanmu (**A–E**), atau ketik **menu** untuk berhenti.`,
      chips: ["A", "B", "C", "D", "E", "Menu"]
    };
  }

  handleQuizAnswer(text) {
    const qs = this.state.quizSession;
    const match = text.trim().toUpperCase().match(/^([A-E])\b/);
    if (!match) {
      return {
        text: `Pilih salah satu huruf **A, B, C, D, atau E** untuk menjawab Soal ${qs.index + 1}, atau ketik **menu** untuk keluar dari kuis.`,
        chips: ["A", "B", "C", "D", "E", "Menu"]
      };
    }

    const letters = ["A", "B", "C", "D", "E"];
    const chosenIdx = letters.indexOf(match[1]);
    const item = qs.quiz.questions[qs.index];
    const isCorrect = chosenIdx === item.ans;
    if (isCorrect) qs.correct++;
    qs.answers.push({ q: qs.index + 1, chosen: match[1], right: letters[item.ans], isCorrect });

    const feedback = isCorrect
      ? `✅ **Benar!** (${letters[item.ans]})\n*Pembahasan:* ${item.exp}`
      : `❌ **Kurang tepat.** Jawabanmu **${match[1]}**, kunci yang benar adalah **${letters[item.ans]}**.\n*Pembahasan:* ${item.exp}`;

    qs.index++;

    if (qs.index >= qs.quiz.questions.length) {
      const total = qs.quiz.questions.length;
      const score = Math.round((qs.correct / total) * 100);
      const passed = score >= 75;
      const statusText = passed
        ? `🏆 **TUNTAS (≥ 75)!** Keren! Kamu siap lanjut ke tahap pengayaan/proyek.`
        : `📘 **Belum Tuntas (< 75).** Yuk pelajari kembali ringkasan materi lalu ulangi kuisnya (sesuai rencana remedial RPP).`;

      this.recordNote("Hasil Kuis RPP", `${qs.quiz.title}: Benar ${qs.correct}/${total} — Skor ${score}/100 (${passed ? "Tuntas" : "Perlu Remedial"}).`);
      this.state.quizSession = null;

      return {
        text: `${feedback}\n\n---\n🎉 **Kuis Selesai — ${qs.quiz.title}**\n- **Jawaban Benar:** ${qs.correct} dari ${total} soal\n- **Skor Akhir:** **${score} / 100**\n- **Status:** ${statusText}\n\nYuk tutup dengan **Refleksi Traffic Light** atau pilih topik kuis lainnya!`,
        chips: ["Refleksi Traffic Light", "6. Kuis RPP & Refleksi", "Buka Rangkuman Siap Salin", "Kembali ke Menu"]
      };
    }

    const nextQ = this.formatQuizQuestion();
    return {
      text: `${feedback}\n\n---\n${nextQ.text}`,
      chips: nextQ.chips
    };
  }

  handleReflectionResponse(text) {
    this.state.reflectionMode = false;
    const lower = text.toLowerCase();
    let badge = "🟢 Hijau (Paham)";
    let advice = "Mantap! Pertahankan semangatmu — kamu bisa lanjut ke tantangan pengayaan atau menyalin rangkuman ke Lembar Kerja.";
    if (lower.includes("kuning")) {
      badge = "🟡 Kuning (Cukup Paham)";
      advice = "Bagus sekali sudah jujur merefleksi! Coba tanyakan langsung bagian yang masih membingungkan ke KIKI agar makin mantap sebelum presentasi.";
    } else if (lower.includes("merah")) {
      badge = "🔴 Merah (Perlu Bimbingan)";
      advice = "Tidak apa-apa! Kita bisa mengulang materi secara perlahan bersama KIKI dan berdiskusi dengan guru/kelompokmu saat jam pelajaran.";
    }
    this.recordNote("Refleksi Traffic Light", `${badge} — "${text}"`);
    return {
      text: `✨ **Terima kasih atas refleksimu (${badge})!**\n\n${advice}\n\nCatatan refleksi ini sudah KIKI masukkan otomatis ke **Rangkuman Siap Salin**. Mau buka rangkumannya sekarang?`,
      chips: ["Buka Rangkuman Siap Salin", "6. Kuis RPP & Refleksi", "Kembali ke Menu"]
    };
  }

  answerFromKnowledgeBase(text) {
    const lower = text.toLowerCase();

    // 1. Cek Glosarium jika berupa pertanyaan definisi ("apa itu...", "pengertian...")
    if (/(apa\s+itu|apa\s+yang\s+dimaksud|pengertian|arti\s+dari|jelaskan\s+singkat)/i.test(lower)) {
      for (const [term, def] of Object.entries(this.kb.glossary)) {
        if (lower.includes(term)) {
          this.recordNote("Glosarium KIK", `Mempelajari istilah "${term.toUpperCase()}".`);
          return {
            text: `📖 **Glosarium KIK — ${term.toUpperCase()}**\n\n${def}\n\nSupaya makin paham, coba sebutkan **1 contoh penerapannya** pada ide usaha kelompokmu!`,
            chips: ["Kuis RPP & Refleksi", "5. Kalkulator & Contoh UMKM", "Kembali ke Menu"]
          };
        }
      }
    }

    // 2. Pencocokan modul RPP terbaik berbasis skor kata kunci
    let bestMod = null;
    let bestScore = 0;
    for (const mod of this.kb.rppModules) {
      let score = 0;
      for (const kw of mod.keywords) {
        if (lower.includes(kw)) score += kw.length > 5 ? 3 : 2;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMod = mod;
      }
    }

    if (bestMod && bestScore >= 2) {
      const stepsList = bestMod.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
      this.recordNote(`Materi ${bestMod.title}`, `Mempelajari panduan ${bestMod.title} (Kelas ${bestMod.kelas}).`);
      return {
        text: `📚 **${bestMod.title}** *(Kelas ${bestMod.kelas} • ${bestMod.jp})*\n\n**Inti Materi (RPP):** ${bestMod.summary}\n\n**Langkah Kerja Bertahap:**\n${stepsList}\n\n💬 **Pertanyaan Pemandu:** ${bestMod.promptQuestion}`,
        chips: ["6. Kuis RPP & Refleksi", "Buka Kalkulator BEP", "Buka Kalkulator HPP", "Buka Rangkuman Siap Salin", "Kembali ke Menu"]
      };
    }

    // 3. Jika murid sedang mengirim jawaban ide/draf panjang (Scaffolding Umpan Balik 3 bagian seperti contoh KIKI!)
    if (text.length >= 25) {
      this.recordNote("Draf Ide Murid", text);
      return {
        text: `👏 **Umpan Balik KIKI untuk Jawabanmu**\n\n- **Yang sudah baik:** Kamu sudah berani menuangkan gagasan dengan kalimatmu sendiri — ini langkah penting dalam berpikir kreatif!\n- **Yang perlu diperkuat (sesuai rubrik RPP):** Pastikan idemu disertai **data kebutuhan calon konsumen**, **nilai tambah dibanding pesaing**, dan **estimasi biaya/risiko yang realistis**.\n- **Langkah berikutnya:** Catat hasil ini ke Lembar Kerja/Canva, atau uji kelayakannya dengan kalkulator BEP/HPP/SAW.\n\nMenurutmu, **siapa target pelanggan paling potensial** untuk gagasanmu di atas dan apa alasan mereka mau membelinya?`,
        chips: ["Buka Kalkulator BEP", "Buka Simulator SAW", "Simulasi Pitching", "Buka Rangkuman Siap Salin", "Kembali ke Menu"]
      };
    }

    // 4. Fallback ramah
    return {
      text: `💡 Aku siap membantumu belajar KIK! Coba pilih salah satu **Menu 1–6**, atau tanyakan langsung topik RPP (misalnya: *"panduan design thinking"*, *"apa itu BMC"*, *"hitung BEP biaya tetap 1500000 harga 15000 variabel 8000"*, atau *"kuis keuangan"*).`,
      chips: ["1. Peta Bakat & Peluang", "2. Lab Inovasi & Prototipe", "3. Proposal, Risiko & BEP", "4. Pemasaran, Keuangan & Hijau", "6. Kuis RPP & Refleksi"]
    };
  }

  async callGeminiAPI(userPrompt) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(this.state.apiKey)}`;
      const contextSummary = this.kb.rppModules.map(m => `- ${m.title} (Kls ${m.kelas}): ${m.summary}`).join("\n");
      const body = {
        system_instruction: {
          parts: [{ text: `${this.kb.systemPrompt}\n\nRINGKASAN 13 RPP KIK SMKN 2 MAKASSAR:\n${contextSummary}` }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: `Profil murid: ${this.state.studentName || "Murid SMKN 2 Makassar"}, Kelas ${this.state.studentClass}, Jurusan ${this.state.studentMajor || "Umum"}.\nPesan murid: ${userPrompt}` }]
          }
        ],
        generationConfig: { temperature: 0.6, maxOutputTokens: 350 }
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch {
      return null;
    }
  }
}

window.KikiAgent = KikiAgent;

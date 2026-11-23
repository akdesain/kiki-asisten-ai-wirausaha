// Mesin Alat Bantu & Kalkulator Presisi KIKI
// Kalkulator BEP, HPP & Harga Jual, serta Simulator Pembobotan SAW (RPP KIK Fase F)

window.KIKI_TOOLS = {
  formatRp(num) {
    if (!Number.isFinite(num)) return "Rp0";
    return "Rp" + Math.round(num).toLocaleString("id-ID");
  },

  parseNumberLoose(raw) {
    if (typeof raw === "number") return raw;
    if (!raw) return NaN;
    let s = String(raw).toLowerCase().trim();
    let mult = 1;
    if (s.includes("juta") || s.includes("jt")) {
      mult = 1000000;
      s = s.replace(/juta|jt/g, "");
    } else if (s.includes("ribu") || s.includes("rb") || /\dk\b/.test(s)) {
      mult = 1000;
      s = s.replace(/ribu|rb|k/g, "");
    }
    s = s.replace(/rp/g, "").replace(/\s+/g, "");
    if (mult === 1) {
      s = s.replace(/\./g, "").replace(/,/g, ".");
    } else {
      s = s.replace(/,/g, ".");
    }
    const val = parseFloat(s);
    return Number.isFinite(val) ? val * mult : NaN;
  },

  calculateBEP(fixedCost, pricePerUnit, variableCost) {
    const fc = Number(fixedCost);
    const p = Number(pricePerUnit);
    const vc = Number(variableCost);

    if (!(fc > 0) || !(p > 0) || !(vc >= 0)) {
      return { ok: false, error: "Pastikan Biaya Tetap dan Harga Jual bernilai lebih dari 0, serta Biaya Variabel tidak negatif." };
    }
    const margin = p - vc;
    if (margin <= 0) {
      return { ok: false, error: "Harga Jual harus lebih besar daripada Biaya Variabel per unit agar usaha dapat mencapai titik impas (BEP)." };
    }
    const exactUnits = fc / margin;
    const unitsCeil = Math.ceil(exactUnits);
    const bepRupiah = unitsCeil * p;
    const marginRatio = (margin / p) * 100;

    return {
      ok: true,
      fixedCost: fc,
      pricePerUnit: p,
      variableCost: vc,
      contributionMargin: margin,
      marginRatio: marginRatio.toFixed(1),
      exactUnits: exactUnits.toFixed(2),
      unitsCeil,
      bepRupiah
    };
  },

  calculateHPP(totalProductionCost, totalUnits, marginPercent) {
    const cost = Number(totalProductionCost);
    const units = Number(totalUnits);
    const margin = Number(marginPercent);

    if (!(cost > 0) || !(units > 0) || !(margin >= 0)) {
      return { ok: false, error: "Pastikan Total Biaya Produksi & Jumlah Unit lebih dari 0, dan Margin minimal 0%." };
    }
    const hppPerUnit = cost / units;
    const profitPerUnit = hppPerUnit * (margin / 100);
    const sellingPrice = hppPerUnit + profitPerUnit;
    const totalRevenue = sellingPrice * units;
    const totalProfit = totalRevenue - cost;

    return {
      ok: true,
      totalCost: cost,
      totalUnits: units,
      marginPercent: margin,
      hppPerUnit,
      profitPerUnit,
      sellingPrice,
      totalRevenue,
      totalProfit
    };
  },

  // Metode Simple Additive Weighting (SAW) — sesuai RPP Pengambilan Keputusan Berbasis Teknologi
  calculateSAW(criteria, alternatives) {
    // criteria: [{ name, weight, type: 'benefit' | 'cost' }]
    // alternatives: [{ name, scores: [number, ...] }]
    if (!criteria.length || !alternatives.length) {
      return { ok: false, error: "Masukkan minimal 1 kriteria dan 2 alternatif pilihan." };
    }
    const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);
    if (totalWeight <= 0) {
      return { ok: false, error: "Total bobot kriteria harus lebih dari 0." };
    }

    const normWeights = criteria.map(c => Number(c.weight) / totalWeight);
    const colStats = criteria.map((c, idx) => {
      const vals = alternatives.map(a => Math.max(0.01, Number(a.scores[idx] || 1)));
      return {
        max: Math.max(...vals),
        min: Math.min(...vals),
        type: c.type || "benefit"
      };
    });

    const ranked = alternatives.map(alt => {
      let totalScore = 0;
      const normalized = alt.scores.map((val, idx) => {
        const v = Math.max(0.01, Number(val || 1));
        const st = colStats[idx];
        const r = st.type === "cost" ? st.min / v : v / st.max;
        totalScore += r * normWeights[idx];
        return Number(r.toFixed(3));
      });
      return {
        name: alt.name,
        rawScores: alt.scores,
        normalized,
        score: Number((totalScore * 100).toFixed(2))
      };
    }).sort((a, b) => b.score - a.score);

    return {
      ok: true,
      totalWeight,
      ranked,
      best: ranked[0]
    };
  },

  // Deteksi otomatis permintaan hitung BEP dari kalimat natural murid
  extractBEPFromText(text) {
    const lower = text.toLowerCase();
    if (!/(bep|titik impas|break\s*even|biaya tetap)/i.test(lower)) return null;

    const fcMatch = lower.match(/(?:biaya\s*tetap|fixed\s*cost|bt|fc)\s*(?:=|:|sebesar|rp\.?)?\s*([\d.,]+\s*(?:juta|jt|ribu|rb|k)?)/i);
    const pMatch = lower.match(/(?:harga\s*jual|harga|price|hj)\s*(?:=|:|sebesar|rp\.?)?\s*([\d.,]+\s*(?:juta|jt|ribu|rb|k)?)/i);
    const vcMatch = lower.match(/(?:biaya\s*variabel|variabel|variable\s*cost|bv|vc)\s*(?:=|:|sebesar|rp\.?)?\s*([\d.,]+\s*(?:juta|jt|ribu|rb|k)?)/i);

    if (fcMatch && pMatch && vcMatch) {
      const fc = this.parseNumberLoose(fcMatch[1]);
      const p = this.parseNumberLoose(pMatch[1]);
      const vc = this.parseNumberLoose(vcMatch[1]);
      if (Number.isFinite(fc) && Number.isFinite(p) && Number.isFinite(vc)) {
        return this.calculateBEP(fc, p, vc);
      }
    }
    return null;
  },

  extractHPPFromText(text) {
    const lower = text.toLowerCase();
    if (!/(hpp|harga\s*pokok|harga\s*jual.*margin)/i.test(lower)) return null;

    // Kasus langsung HPP diketahui + margin
    const directHpp = lower.match(/hpp\s*(?:=|:|sebesar|produk|rp\.?)?\s*([\d.,]+\s*(?:juta|jt|ribu|rb|k)?)/i);
    const marginMatch = lower.match(/margin\s*(?:keuntungan|laba)?\s*(?:=|:|sebesar)?\s*([\d.,]+)\s*%/i);
    const costMatch = lower.match(/(?:total\s*biaya|biaya\s*produksi)\s*(?:=|:|sebesar|rp\.?)?\s*([\d.,]+\s*(?:juta|jt|ribu|rb|k)?)/i);
    const unitMatch = lower.match(/(?:jumlah|unit|porsi|buah|pcs)\s*(?:=|:|sebanyak)?\s*([\d.,]+)/i);

    if (costMatch && unitMatch) {
      const c = this.parseNumberLoose(costMatch[1]);
      const u = this.parseNumberLoose(unitMatch[1]);
      const m = marginMatch ? parseFloat(marginMatch[1].replace(",", ".")) : 25;
      if (Number.isFinite(c) && Number.isFinite(u) && u > 0) {
        return this.calculateHPP(c, u, m);
      }
    } else if (directHpp && marginMatch) {
      const h = this.parseNumberLoose(directHpp[1]);
      const m = parseFloat(marginMatch[1].replace(",", "."));
      if (Number.isFinite(h) && Number.isFinite(m)) {
        return this.calculateHPP(h, 1, m);
      }
    }
    return null;
  }
};

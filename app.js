// Pengendali Antarmuka KIKI — Gaya Apple × Duolingo (Mode Hitam & Putih)
// SMKN 2 Makassar — Aan Kurniawan, S.Pd., M.Ars

(function () {
  const agent = new window.KikiAgent();
  const kb = window.KIKI_KNOWLEDGE;
  const tools = window.KIKI_TOOLS;

  const htmlEl = document.documentElement;
  const drawer = document.getElementById("drawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const openDrawerBtn = document.getElementById("openDrawerBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  const welcomeHero = document.getElementById("welcomeHero");
  const menuCardGrid = document.getElementById("menuCardGrid");
  const chatMessagesEl = document.getElementById("chatMessages");
  const quickChipsEl = document.getElementById("quickChips");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const aiModeBadge = document.getElementById("aiModeBadge");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const drawerThemeBtn = document.getElementById("drawerThemeBtn");

  // === TEMA HITAM (DARK) & PUTIH (LIGHT) ===
  function applyTheme(theme) {
    const t = theme === "dark" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", t);
    localStorage.setItem("kiki_theme", t);
    themeToggleBtn.textContent = t === "dark" ? "☀️" : "🌙";
    themeToggleBtn.title = t === "dark" ? "Ganti ke Mode Putih" : "Ganti ke Mode Hitam";
    if (drawerThemeBtn) {
      drawerThemeBtn.textContent = t === "dark" ? "☀️ Ganti ke Mode Putih" : "🌙 Ganti ke Mode Hitam";
    }
  }
  applyTheme(localStorage.getItem("kiki_theme") || "light");

  function toggleTheme() {
    const cur = htmlEl.getAttribute("data-theme");
    applyTheme(cur === "dark" ? "light" : "dark");
  }
  themeToggleBtn.addEventListener("click", toggleTheme);
  if (drawerThemeBtn) drawerThemeBtn.addEventListener("click", toggleTheme);

  // === PROFIL SESI (Kelas X, XI, XII, Guru) ===
  const studentNameInput = document.getElementById("studentNameInput");
  const studentClassInput = document.getElementById("studentClassInput");
  const studentMajorInput = document.getElementById("studentMajorInput");

  kb.majors.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    studentMajorInput.appendChild(opt);
  });

  function syncProfile() {
    agent.setProfile(studentNameInput.value, studentClassInput.value, studentMajorInput.value);
  }
  studentNameInput.addEventListener("change", syncProfile);
  studentClassInput.addEventListener("change", syncProfile);
  studentMajorInput.addEventListener("change", syncProfile);

  // === 6 KARTU MENU GAYA DUOLINGO (RINGKAS TANPA PADAT TEKS) ===
  const shortCards = [
    { icon: "🧭", title: "Peta Bakat & Peluang", tag: "Kelas X–XI", cmd: "1. Peta Bakat & Peluang" },
    { icon: "🛠️", title: "Lab Prototipe", tag: "Design Thinking", cmd: "2. Lab Inovasi & Prototipe" },
    { icon: "📊", title: "Proposal & BEP", tag: "BMC & Risiko", cmd: "3. Proposal, Risiko & BEP" },
    { icon: "🌿", title: "Pemasaran & Hijau", tag: "4P, HPP, 3R", cmd: "4. Pemasaran, Keuangan & Hijau" },
    { icon: "🧮", title: "UMKM & Hitung", tag: "Kasus Sulsel", cmd: "5. Kalkulator & Contoh UMKM" },
    { icon: "🎯", title: "Kuis & Refleksi", tag: "109 Soal RPP", cmd: "6. Kuis RPP & Refleksi" }
  ];

  shortCards.forEach(card => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "duo-card";
    btn.innerHTML = `
      <span class="dc-icon">${card.icon}</span>
      <span class="dc-title">${card.title}</span>
      <span class="dc-tag">${card.tag}</span>
    `;
    btn.addEventListener("click", () => sendUserMessage(card.cmd));
    menuCardGrid.appendChild(btn);
  });

  // === 13 MODUL RPP DI MODAL ===
  const rppGrid = document.getElementById("rppGrid");
  kb.rppModules.forEach((mod, idx) => {
    const card = document.createElement("div");
    card.className = "rpp-card";
    card.innerHTML = `
      <span class="rpp-badge">Kelas ${mod.kelas}</span>
      <h4>${idx + 1}. ${mod.title}</h4>
      <p>${mod.tp}</p>
    `;
    card.addEventListener("click", () => {
      closeModal("rppModal");
      closeDrawer();
      sendUserMessage(`Jelaskan materi dan langkah ${mod.title}`);
    });
    rppGrid.appendChild(card);
  });

  // === DRAWER CONTROLS ===
  function openDrawer() {
    drawer.classList.add("open");
    drawerOverlay.classList.add("open");
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
  }
  openDrawerBtn.addEventListener("click", openDrawer);
  closeDrawerBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // === MODAL CONTROLS ===
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === "summaryModal") {
      document.getElementById("summaryTextarea").value = agent.generateCopyableSummary();
    }
    if (id === "settingsModal") {
      document.getElementById("toggleGeminiInput").checked = agent.state.useGemini;
      document.getElementById("geminiKeyInput").value = agent.state.apiKey;
      document.getElementById("settingsStatus").textContent = "";
    }
    el.classList.add("open");
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("open");
  }

  document.querySelectorAll("[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeDrawer();
      openModal(btn.dataset.modal);
    });
  });
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", e => {
      if (e.target === m) m.classList.remove("open");
    });
  });

  document.getElementById("btnSummary").addEventListener("click", () => openModal("summaryModal"));
  document.getElementById("btnSettings").addEventListener("click", () => {
    closeDrawer();
    openModal("settingsModal");
  });

  function resetToHome() {
    chatMessagesEl.innerHTML = "";
    quickChipsEl.innerHTML = "";
    welcomeHero.classList.remove("hidden");
    agent.state.quizSession = null;
    agent.state.reflectionMode = false;
    agent.state.activeMenu = null;
    agent.state.notes = [];
  }

  document.getElementById("btnReset").addEventListener("click", resetToHome);
  brandHomeBtn.addEventListener("click", resetToHome);

  // === MODE AI BADGE ===
  function updateModeBadge() {
    if (agent.state.useGemini && agent.state.apiKey) {
      aiModeBadge.textContent = "Gemini";
      aiModeBadge.classList.add("gemini");
    } else {
      aiModeBadge.textContent = "13 RPP";
      aiModeBadge.classList.remove("gemini");
    }
  }
  updateModeBadge();

  document.getElementById("saveSettingsBtn").addEventListener("click", () => {
    const key = document.getElementById("geminiKeyInput").value.trim();
    const enabled = document.getElementById("toggleGeminiInput").checked;
    agent.saveApiConfig(key, enabled);
    updateModeBadge();
    document.getElementById("settingsStatus").textContent = enabled && key
      ? "✅ Mode Gemini AI aktif."
      : "✅ Mode Mandiri (13 RPP) aktif.";
  });

  // === MARKDOWN RENDERER AMAN ===
  function renderMarkdownSafe(md) {
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^---$/gm, "<hr>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

    const lines = html.split("\n");
    const out = [];
    let inUl = false;
    let inOl = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^-\s+/.test(trimmed)) {
        if (inOl) { out.push("</ol>"); inOl = false; }
        if (!inUl) { out.push("<ul>"); inUl = true; }
        out.push(`<li>${trimmed.replace(/^-\s+/, "")}</li>`);
      } else if (/^\d+\.\s+/.test(trimmed)) {
        if (inUl) { out.push("</ul>"); inUl = false; }
        if (!inOl) { out.push("<ol>"); inOl = true; }
        out.push(`<li>${trimmed.replace(/^\d+\.\s+/, "")}</li>`);
      } else {
        if (inUl) { out.push("</ul>"); inUl = false; }
        if (inOl) { out.push("</ol>"); inOl = false; }
        if (trimmed === "<hr>") out.push("<hr>");
        else if (trimmed.length > 0) out.push(`<p>${trimmed}</p>`);
      }
    }
    if (inUl) out.push("</ul>");
    if (inOl) out.push("</ol>");
    return out.join("");
  }

  function appendMessage(role, text) {
    welcomeHero.classList.add("hidden");
    const row = document.createElement("div");
    row.className = `msg-row ${role}`;
    const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const avatarLabel = role === "bot" ? "💡" : (agent.state.studentName ? agent.state.studentName[0].toUpperCase() : "👤");

    row.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">${avatarLabel}</div>
      <div>
        <div class="msg-bubble">${role === "bot" ? renderMarkdownSafe(text) : `<p>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`}</div>
        <div class="msg-time">${role === "bot" ? "KIKI" : (agent.state.studentName || "Kamu")} • ${timeStr}</div>
      </div>
    `;
    chatMessagesEl.appendChild(row);
    const stage = document.querySelector(".main-stage");
    stage.scrollTop = stage.scrollHeight;
  }

  function renderChips(chips) {
    quickChipsEl.innerHTML = "";
    (chips || []).forEach(label => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-btn";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        if (label.toLowerCase() === "kembali ke menu" || label.toLowerCase() === "menu") {
          resetToHome();
        } else {
          sendUserMessage(label);
        }
      });
      quickChipsEl.appendChild(btn);
    });
  }

  function renderBotReply(reply) {
    appendMessage("bot", reply.text);
    renderChips(reply.chips);
    if (reply.action === "open-bep") openModal("bepModal");
    if (reply.action === "open-hpp") openModal("hppModal");
    if (reply.action === "open-saw") openModal("sawModal");
    if (reply.action === "open-summary") openModal("summaryModal");
  }

  async function sendUserMessage(rawText) {
    const text = (rawText || "").trim();
    if (!text) return;
    if (/^(beranda|home)$/i.test(text)) {
      resetToHome();
      return;
    }
    syncProfile();
    appendMessage("user", text);
    chatInput.value = "";
    const reply = await agent.processMessage(text);
    renderBotReply(reply);
  }

  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    sendUserMessage(chatInput.value);
  });

  // === KALKULATOR BEP ===
  document.getElementById("calcBepBtn").addEventListener("click", () => {
    const fc = document.getElementById("bepFC").value;
    const p = document.getElementById("bepPrice").value;
    const vc = document.getElementById("bepVC").value;
    const res = tools.calculateBEP(fc, p, vc);
    const out = document.getElementById("bepOutput");
    out.className = "calc-result show" + (res.ok ? "" : " error");
    if (!res.ok) { out.innerHTML = `⚠️ ${res.error}`; return; }

    out.innerHTML = `
      <div>Margin Kontribusi: <strong>${tools.formatRp(res.contributionMargin)}</strong> (${res.marginRatio}%)</div>
      <div class="calc-highlight">✅ BEP: ${res.unitsCeil} unit/porsi</div>
      <div>Omzet Impas: <strong>${tools.formatRp(res.bepRupiah)}</strong></div>
      <button id="sendBepToChat" class="btn-accent">Kirim ke Chat KIKI ➤</button>
    `;
    document.getElementById("sendBepToChat").addEventListener("click", () => {
      closeModal("bepModal");
      sendUserMessage(`Hitung BEP biaya tetap ${res.fixedCost} harga jual ${res.pricePerUnit} biaya variabel ${res.variableCost}`);
    });
  });

  // === KALKULATOR HPP ===
  document.getElementById("calcHppBtn").addEventListener("click", () => {
    const cost = document.getElementById("hppCost").value;
    const units = document.getElementById("hppUnits").value;
    const margin = document.getElementById("hppMargin").value;
    const res = tools.calculateHPP(cost, units, margin);
    const out = document.getElementById("hppOutput");
    out.className = "calc-result show" + (res.ok ? "" : " error");
    if (!res.ok) { out.innerHTML = `⚠️ ${res.error}`; return; }

    out.innerHTML = `
      <div>HPP / Unit: <strong>${tools.formatRp(res.hppPerUnit)}</strong></div>
      <div class="calc-highlight">✅ Harga Jual: ${tools.formatRp(res.sellingPrice)} / unit</div>
      <div>Estimasi Laba: <strong>${tools.formatRp(res.totalProfit)}</strong></div>
      <button id="sendHppToChat" class="btn-accent">Kirim ke Chat KIKI ➤</button>
    `;
    document.getElementById("sendHppToChat").addEventListener("click", () => {
      closeModal("hppModal");
      sendUserMessage(`Hitung HPP total biaya ${res.totalCost} jumlah ${res.totalUnits} margin ${res.marginPercent}%`);
    });
  });

  // === SIMULATOR SAW ===
  document.getElementById("calcSawBtn").addEventListener("click", () => {
    const names = Array.from(document.querySelectorAll(".saw-name")).map(i => i.value.trim() || "Ide");
    const criteria = [
      { name: "Permintaan", weight: 40, type: "benefit" },
      { name: "Sumber Daya", weight: 35, type: "benefit" },
      { name: "Biaya/Risiko", weight: 25, type: "cost" }
    ];
    const alternatives = names.map((name, r) => ({
      name,
      scores: [0, 1, 2].map(c => Number(document.querySelector(`.saw-val[data-row="${r}"][data-col="${c}"]`).value || 1))
    }));
    const res = tools.calculateSAW(criteria, alternatives);
    const out = document.getElementById("sawOutput");
    out.className = "calc-result show" + (res.ok ? "" : " error");
    if (!res.ok) { out.innerHTML = `⚠️ ${res.error}`; return; }

    const rowsHtml = res.ranked.map((item, idx) => `<div><strong>#${idx + 1} ${item.name}</strong> — ${item.score}/100</div>`).join("");
    out.innerHTML = `
      <div class="calc-highlight">🏆 Terbaik: ${res.best.name} (${res.best.score}/100)</div>
      ${rowsHtml}
      <button id="sendSawToChat" class="btn-accent">Simpan ke Rangkuman ➤</button>
    `;
    document.getElementById("sendSawToChat").addEventListener("click", () => {
      agent.recordNote("Keputusan SAW", `Terbaik #1: ${res.best.name} (${res.best.score}/100).`);
      closeModal("sawModal");
      appendMessage("bot", `⚖️ **Hasil SAW Tersimpan!**\n\nRekomendasi terbaik: **${res.best.name}** (**${res.best.score}/100**).\n\nApakah hasil ini sesuai dengan pengamatan kelompokmu?`);
      renderChips(["Buka Rangkuman Siap Salin", "Kembali ke Menu"]);
    });
  });

  // === RANGKUMAN SIAP SALIN ===
  document.getElementById("copySummaryBtn").addEventListener("click", async () => {
    const txt = document.getElementById("summaryTextarea").value;
    try {
      await navigator.clipboard.writeText(txt);
      document.getElementById("copySummaryBtn").textContent = "✅ Tersalin!";
      setTimeout(() => { document.getElementById("copySummaryBtn").textContent = "📋 Salin Teks"; }, 1600);
    } catch {
      document.getElementById("summaryTextarea").select();
      document.execCommand("copy");
    }
  });

  document.getElementById("downloadSummaryBtn").addEventListener("click", () => {
    const txt = document.getElementById("summaryTextarea").value;
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Rangkuman_KIKI_SMKN2Makassar.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
})();

// Pengendali Antarmuka Web App KIKI: Asisten AI Wirausaha Muda
// SMKN 2 Makassar — Aan Kurniawan, S.Pd., M.Ars

(function () {
  const agent = new window.KikiAgent();
  const kb = window.KIKI_KNOWLEDGE;
  const tools = window.KIKI_TOOLS;

  // Elemen DOM utama
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const openSidebarBtn = document.getElementById("openSidebarBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const menuListEl = document.getElementById("menuList");
  const chatMessagesEl = document.getElementById("chatMessages");
  const quickChipsEl = document.getElementById("quickChips");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const aiModeBadge = document.getElementById("aiModeBadge");

  // Profil Sesi
  const studentNameInput = document.getElementById("studentNameInput");
  const studentClassInput = document.getElementById("studentClassInput");
  const studentMajorInput = document.getElementById("studentMajorInput");

  // Populate daftar jurusan SMKN 2 Makassar / SMK
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

  // Render 6 Menu Utama di Sidebar (ringkas agar rapi di HP & Desktop)
  kb.menus.forEach(menu => {
    const btn = document.createElement("button");
    btn.className = "menu-item";
    btn.dataset.menuId = menu.id;
    btn.innerHTML = `
      <span class="m-icon">${menu.icon}</span>
      <span>
        <span class="m-title">${menu.shortTitle}</span>
        <span class="m-desc">${menu.kelas} • ${menu.topics.slice(0, 2).join(", ")}</span>
      </span>
    `;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      closeSidebar();
      sendUserMessage(menu.shortTitle);
    });
    menuListEl.appendChild(btn);
  });

  // Tombol tutup banner pengingat agar ruang baca HP lebih lega
  const closeBannerBtn = document.getElementById("closeBannerBtn");
  const infoBanner = document.getElementById("infoBanner");
  if (closeBannerBtn && infoBanner) {
    closeBannerBtn.addEventListener("click", () => infoBanner.classList.add("hidden"));
  }

  // Render 13 Modul RPP pada Modal
  const rppGrid = document.getElementById("rppGrid");
  kb.rppModules.forEach((mod, idx) => {
    const card = document.createElement("div");
    card.className = "rpp-card";
    card.innerHTML = `
      <span class="rpp-badge">Kelas ${mod.kelas} • ${mod.jp}</span>
      <h4>${idx + 1}. ${mod.title}</h4>
      <p>${mod.tp}</p>
    `;
    card.addEventListener("click", () => {
      closeModal("rppModal");
      closeSidebar();
      sendUserMessage(`Jelaskan materi dan langkah ${mod.title}`);
    });
    rppGrid.appendChild(card);
  });

  // Sidebar Mobile Toggle
  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
  }
  openSidebarBtn.addEventListener("click", openSidebar);
  closeSidebarBtn.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Modal Helper
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
      closeSidebar();
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
  document.getElementById("btnSettings").addEventListener("click", () => openModal("settingsModal"));
  document.getElementById("btnReset").addEventListener("click", () => {
    chatMessagesEl.innerHTML = "";
    agent.state.quizSession = null;
    agent.state.reflectionMode = false;
    agent.state.activeMenu = null;
    agent.state.notes = [];
    renderBotReply(agent.getGreeting());
  });

  // Update Badge Mode AI (ringkas agar rapi di layar HP)
  function updateModeBadge() {
    if (agent.state.useGemini && agent.state.apiKey) {
      aiModeBadge.textContent = "Gemini AI";
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
      ? "✅ Mode Gemini AI aktif (tersimpan aman di browser ini)."
      : "✅ Mode Mandiri (100% Lokal Berbasis 13 RPP) aktif.";
  });

  // Markdown Renderer Aman (tanpa raw HTML berbahaya)
  function renderMarkdownSafe(md) {
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Horizontal rule
    html = html.replace(/^---$/gm, "<hr>");
    // Code inline
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Paragraf & list sederhana
    const lines = html.split("\n");
    let out = [];
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
        if (trimmed === "<hr>") {
          out.push("<hr>");
        } else if (trimmed.length > 0) {
          out.push(`<p>${trimmed}</p>`);
        }
      }
    }
    if (inUl) out.push("</ul>");
    if (inOl) out.push("</ol>");
    return out.join("");
  }

  function appendMessage(role, text) {
    const row = document.createElement("div");
    row.className = `msg-row ${role}`;
    const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const avatarLabel = role === "bot" ? "💡" : (agent.state.studentName ? agent.state.studentName[0].toUpperCase() : "👤");

    row.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">${avatarLabel}</div>
      <div>
        <div class="msg-bubble">${role === "bot" ? renderMarkdownSafe(text) : `<p>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`}</div>
        <div class="msg-time">${role === "bot" ? "KIKI" : (agent.state.studentName || "Murid")} • ${timeStr}</div>
      </div>
    `;
    chatMessagesEl.appendChild(row);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function renderChips(chips) {
    quickChipsEl.innerHTML = "";
    (chips || []).forEach(label => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-btn";
      btn.textContent = label;
      btn.addEventListener("click", () => sendUserMessage(label));
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

    if (!res.ok) {
      out.innerHTML = `⚠️ ${res.error}`;
      return;
    }

    out.innerHTML = `
      <div>Margin Kontribusi per Unit: <strong>${tools.formatRp(res.contributionMargin)}</strong> (${res.marginRatio}%)</div>
      <div>Hasil Eksak: <code>${res.fixedCost.toLocaleString("id-ID")} ÷ ${res.contributionMargin.toLocaleString("id-ID")} = ${res.exactUnits}</code></div>
      <div class="calc-highlight">✅ BEP Unit: ${res.unitsCeil} unit/porsi (dibulatkan ke atas)</div>
      <div>✅ BEP Rupiah (Omzet Impas): <strong>${tools.formatRp(res.bepRupiah)}</strong></div>
      <button id="sendBepToChat" class="btn-accent">Kirim Hasil ke Chat KIKI ➤</button>
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

    if (!res.ok) {
      out.innerHTML = `⚠️ ${res.error}`;
      return;
    }

    out.innerHTML = `
      <div>HPP per Unit: <strong>${tools.formatRp(res.hppPerUnit)}</strong></div>
      <div>Laba per Unit (${res.marginPercent}%): <strong>${tools.formatRp(res.profitPerUnit)}</strong></div>
      <div class="calc-highlight">✅ Rekomendasi Harga Jual: ${tools.formatRp(res.sellingPrice)} / unit</div>
      <div>Estimasi Total Laba (${res.totalUnits} unit): <strong>${tools.formatRp(res.totalProfit)}</strong></div>
      <button id="sendHppToChat" class="btn-accent">Kirim Hasil ke Chat KIKI ➤</button>
    `;

    document.getElementById("sendHppToChat").addEventListener("click", () => {
      closeModal("hppModal");
      sendUserMessage(`Hitung HPP total biaya ${res.totalCost} jumlah ${res.totalUnits} margin ${res.marginPercent}%`);
    });
  });

  // === SIMULATOR SAW ===
  document.getElementById("calcSawBtn").addEventListener("click", () => {
    const names = Array.from(document.querySelectorAll(".saw-name")).map(i => i.value.trim() || "Alternatif");
    const criteria = [
      { name: "Permintaan Pasar", weight: 40, type: "benefit" },
      { name: "Sumber Daya & Skill", weight: 35, type: "benefit" },
      { name: "Biaya/Risiko", weight: 25, type: "cost" }
    ];
    const alternatives = names.map((name, r) => {
      const scores = [0, 1, 2].map(c => Number(document.querySelector(`.saw-val[data-row="${r}"][data-col="${c}"]`).value || 1));
      return { name, scores };
    });

    const res = tools.calculateSAW(criteria, alternatives);
    const out = document.getElementById("sawOutput");
    out.className = "calc-result show" + (res.ok ? "" : " error");
    if (!res.ok) {
      out.innerHTML = `⚠️ ${res.error}`;
      return;
    }

    const rowsHtml = res.ranked.map((item, idx) =>
      `<div><strong>#${idx + 1} ${item.name}</strong> — Skor SAW: <strong>${item.score}</strong> / 100</div>`
    ).join("");

    out.innerHTML = `
      <div class="calc-highlight">🏆 Rekomendasi Terbaik: ${res.best.name} (${res.best.score}/100)</div>
      ${rowsHtml}
      <button id="sendSawToChat" class="btn-accent">Simpan ke Rangkuman Sesi ➤</button>
    `;

    document.getElementById("sendSawToChat").addEventListener("click", () => {
      agent.recordNote("Keputusan SAW", `Peringkat #1: ${res.best.name} (Skor ${res.best.score}/100) dibanding ${res.ranked.length} alternatif.`);
      closeModal("sawModal");
      appendMessage("bot", `⚖️ **Hasil Simulator SAW Tersimpan!**\n\nAlternatif terbaik berdasarkan pembobotan kriteria adalah **${res.best.name}** (Skor **${res.best.score}/100**).\n\nBagaimana perbandingan hasil perhitungan SAW ini dibanding keputusan manual/insting kelompokmu sebelumnya?`);
      renderChips(["Buka Rangkuman Siap Salin", "2. Lab Inovasi & Prototipe", "Kembali ke Menu"]);
    });
  });

  // === RANGKUMAN SIAP SALIN ===
  document.getElementById("copySummaryBtn").addEventListener("click", async () => {
    const txt = document.getElementById("summaryTextarea").value;
    try {
      await navigator.clipboard.writeText(txt);
      document.getElementById("copySummaryBtn").textContent = "✅ Berhasil Disalin!";
      setTimeout(() => { document.getElementById("copySummaryBtn").textContent = "📋 Salin Teks"; }, 1800);
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
    a.download = "Rangkuman_KIKI_KIK_SMKN2Makassar.txt";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Sapaan Awal KIKI saat halaman dibuka
  renderBotReply(agent.getGreeting());
})();

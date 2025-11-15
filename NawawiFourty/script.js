(function () {
  if (!Array.isArray(window.HADITHS)) {
    console.error("لم يتم العثور على HADITHS من data.js");
    return;
  }

  const hadiths = window.HADITHS
    .slice()
    .sort((a, b) => (a.index || 0) - (b.index || 0))
    .map((h, i) => ({ ...h, index: h.index || i + 1 }));

  const TOTAL = hadiths.length;

  const appTitleEl = document.getElementById("appTitle");
  const hadithListEl = document.getElementById("hadithList");
  const searchInputEl = document.getElementById("searchInput");
  const progressBadgeEl = document.getElementById("progressBadge");

  const numbersBarEl = document.getElementById("numbersBar");
  const positionPillEl = document.getElementById("positionPill");
  const hadithLabelEl = document.getElementById("hadithLabel");
  const hadithTextEl = document.getElementById("hadithText");
  const explanationTextEl = document.getElementById("explanationText");

  const noteInputEl = document.getElementById("noteInput");
  const saveNoteBtn = document.getElementById("saveNoteBtn");
  const noteStatusEl = document.getElementById("noteStatus");
  const exportNotesBtn = document.getElementById("exportNotesBtn");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const themeToggle = document.getElementById("themeToggle");

  const STORAGE_PREFIX = "arbain_notes_";

  let filteredIndexes = hadiths.map((_, i) => i);
  let currentIndex = filteredIndexes[0] ?? 0;

  /* عنوان التطبيق */
  if (window.APP_CONFIG && window.APP_CONFIG.title && appTitleEl) {
    appTitleEl.textContent = window.APP_CONFIG.title;
  }

  /* ثيم الليل/النهار */
  (function initTheme() {
    try {
      const saved = localStorage.getItem("arbain_theme");
      if (saved === "light" || saved === "dark") {
        document.body.dataset.theme = saved;
      }
    } catch (e) {}

    themeToggle.addEventListener("click", () => {
      const current = document.body.dataset.theme === "light" ? "dark" : "light";
      document.body.dataset.theme = current;
      try {
        localStorage.setItem("arbain_theme", current);
      } catch (e) {}
    });
  })();

  /* ===== تمييز السند والمتن بدون تغيير النص ===== */

  function escapeHtml(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * يعتمد على أن المتن بين علامتي تنصيص عادية " "
   * يدعم أكثر من مقطع متن في نفس الحديث:
   * عن فلان قال: "نص 1" ثم قال: "نص 2"
   * كل ما بين " " → متن (hadith-matn)
   * ما عدا ذلك → سند (hadith-narrator)
   */
  function formatHadithText(rawText) {
    if (!rawText) return "";
    const text = String(rawText);

    const segments = [];
    let current = "";
    let inMatn = false; // false = سند, true = متن

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch === '"') {
        // نغلق المقطع الحالي قبل قلب الحالة
        if (current) {
          segments.push({
            type: inMatn ? "matn" : "narrator",
            text: current
          });
          current = "";
        }
        // نقلب الحالة (داخل/خارج التنصيص) ونضيف علامة التنصيص للمقطع الجديد
        inMatn = !inMatn;
        current += ch;
      } else {
        current += ch;
      }
    }

    // آخر مقطع
    if (current) {
      segments.push({
        type: inMatn ? "matn" : "narrator",
        text: current
      });
    }

    // لو ما لقينا أي " أصلاً → اعتبر النص كله متن
    if (segments.length === 1 && !text.includes('"')) {
      return `<span class="hadith-matn">${escapeHtml(text).replace(/\n/g, "<br>")}</span>`;
    }

    let html = segments
      .map(seg => {
        const cls = seg.type === "matn" ? "hadith-matn" : "hadith-narrator";
        return `<span class="${cls}">${escapeHtml(seg.text)}</span>`;
      })
      .join("");

    // نحافظ على فواصل الأسطر
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  /* ملاحظات */
  function noteKey(hIndex) {
    return STORAGE_PREFIX + String(hIndex);
  }

  function loadNote(hIndex) {
    try {
      return localStorage.getItem(noteKey(hIndex)) || "";
    } catch (e) {
      return "";
    }
  }

  function saveNote(hIndex, val) {
    try {
      if (!val.trim()) localStorage.removeItem(noteKey(hIndex));
      else localStorage.setItem(noteKey(hIndex), val);
    } catch (e) {}
  }

  function updateProgressBadge() {
    let count = 0;
    try {
      hadiths.forEach(h => {
        const v = localStorage.getItem(noteKey(h.index));
        if (v && v.trim()) count++;
      });
    } catch (e) {}
    progressBadgeEl.textContent = `${count} / ${TOTAL} حديث عليه تعليقات`;
  }

  /* قائمة الأحاديث */
  function renderHadithList() {
    hadithListEl.innerHTML = "";

    if (filteredIndexes.length === 0) {
      const div = document.createElement("div");
      div.className = "hadith-item";
      div.textContent = "لا توجد نتائج مطابقة للبحث.";
      hadithListEl.appendChild(div);
      return;
    }

    filteredIndexes.forEach((realIndex, visiblePos) => {
      const h = hadiths[realIndex];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hadith-item";
      if (realIndex === currentIndex) btn.classList.add("active");

      const hasNote = !!loadNote(h.index).trim();

      btn.innerHTML = `
        <div class="hadith-item-header">
          <span class="hadith-index">${h.index}</span>
          <span class="hadith-label">${h.label || ("الحديث " + h.index)}</span>
        </div>
        <div class="hadith-meta">
          <span>${hasNote ? "📌 يوجد تعليق" : "بدون تعليق"}</span>
          <span>${visiblePos + 1} / ${filteredIndexes.length}</span>
        </div>
      `;

      btn.addEventListener("click", () => {
        currentIndex = realIndex;
        renderCurrentHadith();
        renderHadithList();
        updateNumbersBarActive();
      });

      hadithListEl.appendChild(btn);
    });
  }

  /* أزرار الأرقام */
  function renderNumbersBar() {
    numbersBarEl.innerHTML = "";
    hadiths.forEach((h, realIndex) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "number-btn";
      b.textContent = h.index;
      if (realIndex === currentIndex) b.classList.add("active");
      b.addEventListener("click", () => {
        currentIndex = realIndex;
        renderCurrentHadith();
        renderHadithList();
        updateNumbersBarActive();
      });
      numbersBarEl.appendChild(b);
    });
  }

  function updateNumbersBarActive() {
    const buttons = numbersBarEl.querySelectorAll(".number-btn");
    buttons.forEach((b, idx) => {
      if (idx === currentIndex) b.classList.add("active");
      else b.classList.remove("active");
    });
  }

  /* عرض الحديث الحالي */
  function renderCurrentHadith() {
    const h = hadiths[currentIndex];
    if (!h) return;

    const posInFiltered = filteredIndexes.indexOf(currentIndex);
    const displayPos = posInFiltered >= 0 ? posInFiltered + 1 : currentIndex + 1;

    positionPillEl.textContent = `الحديث ${h.index} — موضعه: ${displayPos} / ${filteredIndexes.length}`;
    hadithLabelEl.textContent = h.label || `الحديث رقم ${h.index}`;

    // المتن مع تمييز السند والمتن
    const rawHadithText = h.hadith || "";
    hadithTextEl.innerHTML = formatHadithText(rawHadithText);

    // الشرح كما هو
    explanationTextEl.textContent = h.explanation || "";

    const note = loadNote(h.index);
    noteInputEl.value = note;
    noteStatusEl.textContent = note.trim()
      ? "✅ يوجد تعليق محفوظ لهذا الحديث."
      : "لم يتم الحفظ بعد.";

    prevBtn.disabled = (posInFiltered <= 0);
    nextBtn.disabled = (posInFiltered === -1 || posInFiltered >= filteredIndexes.length - 1);
  }

  /* بحث */
  function applySearch() {
    const q = (searchInputEl.value || "").trim().toLowerCase();
    if (!q) {
      filteredIndexes = hadiths.map((_, i) => i);
    } else {
      filteredIndexes = hadiths
        .map((h, i) => ({ h, i }))
        .filter(({ h }) => {
          const text = (h.label || "") + " " + (h.hadith || "") + " " + (h.explanation || "");
          return text.toLowerCase().includes(q);
        })
        .map(({ i }) => i);
    }

    if (!filteredIndexes.includes(currentIndex)) {
      currentIndex = filteredIndexes[0] ?? 0;
    }

    renderHadithList();
    renderCurrentHadith();
    updateNumbersBarActive();
  }

  /* تنقّل السابق/التالي */
  function goPrev() {
    const p = filteredIndexes.indexOf(currentIndex);
    if (p > 0) {
      currentIndex = filteredIndexes[p - 1];
      renderCurrentHadith();
      renderHadithList();
      updateNumbersBarActive();
    }
  }

  function goNext() {
    const p = filteredIndexes.indexOf(currentIndex);
    if (p >= 0 && p < filteredIndexes.length - 1) {
      currentIndex = filteredIndexes[p + 1];
      renderCurrentHadith();
      renderHadithList();
      updateNumbersBarActive();
    }
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  searchInputEl.addEventListener("input", applySearch);

  /* حفظ الملاحظات */
  saveNoteBtn.addEventListener("click", () => {
    const h = hadiths[currentIndex];
    if (!h) return;
    const val = noteInputEl.value || "";
    saveNote(h.index, val);
    noteStatusEl.textContent = val.trim()
      ? "✅ تم حفظ التعليق لهذا الحديث."
      : "تم مسح التعليق من هذا الحديث.";
    updateProgressBadge();
    renderHadithList();
  });

  /* تصدير الملاحظات */
  exportNotesBtn.addEventListener("click", () => {
    let lines = [];
    lines.push("تعليقات على أحاديث الأربعين النووية");
    lines.push("==================================");
    lines.push("");

    hadiths.forEach(h => {
      const n = loadNote(h.index);
      if (n.trim()) {
        lines.push(`الحديث رقم ${h.index} — ${h.label || ""}`);
        lines.push("تعليقاتي:");
        lines.push(n);
        lines.push("----------------------------------------");
      }
    });

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const iso = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `arbain-notes-${iso}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  /* أسهم لوحة المفاتيح */
  window.addEventListener("keydown", (e) => {
    if (e.target === noteInputEl || e.target === searchInputEl) return;
    if (e.key === "ArrowRight") goPrev();
    if (e.key === "ArrowLeft") goNext();
  });

  /* تهيئة أولية */
  renderHadithList();
  renderNumbersBar();
  if (TOTAL > 0) {
    currentIndex = 0;
    renderCurrentHadith();
  }
  updateProgressBadge();
})();

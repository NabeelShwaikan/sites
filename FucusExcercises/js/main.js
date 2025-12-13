// js/main.js
(function () {
  // ==============================
  // 1) أنواع التمارين + بياناتها
  // ==============================
  const EX_TYPE_VISUAL_TRACKING = "visualTracking";
  const EX_TYPE_WORKING_MEMORY  = "workingMemory";
  const EX_TYPE_MEMORY_GRID     = "memoryGrid";
  const EX_TYPE_LAST_DOT        = "lastDot";
  const EX_TYPE_FLASH_FOCUS     = "flashFocus";   // (5)
  const EX_TYPE_BREATH_VISUAL   = "breathVisual"; // (6)
  const EX_TYPE_BODY_SCAN       = "bodyScan";     // (7)
  const EX_TYPE_ODD_SPOT        = "oddSpot";      // (8) NEW

  const exercises = [
    {
      id: "visual-tracking-reset",
      name: "إعادة ضبط الانتباه البصري",
      tagline: "تتبُّع بصري هادئ لكُرة مضيئة تتحرك بمسار ناعم لإعادة تركيز الذهن.",
      category: "تركيز لاواعي",
      definition:
        "جلسة قصيرة تتابع فيها العين حركة نقطة مضيئة تتحرك بمسار سلس داخل الإطار، بدون أي نقر أو استجابة من المتدرّب.",
      benefit:
        "تهدئة ضوضاء الدماغ بعد يوم مشتّت، وإعادة تنظيم مسار الانتباه البصري المستمر بطريقة لاواعية ومريحة.",
      defaultDurationNote:
        "مناسب لجلسات بين ٢–٤ دقائق؛ ويمكن زيادتها لاحقًا لجلسات استشفاء أطول.",
      type: EX_TYPE_VISUAL_TRACKING
    },
    {
      id: "working-memory-pulse",
      name: "نبض الذاكرة اللحظية",
      tagline: "كل ٢–٣ ثوانٍ يتغيّر الرمز، ومهمتك أن تقرّر: هل هو نفس الرمز السابق أم مختلف عنه؟",
      category: "تمرين إدراكي",
      definition:
        "يعرض رموزًا بسيطة متتابعة في المنتصف. في كل مرة يتغيّر فيها الرمز، تقرّر هل الرمز الحالي هو نفس الرمز الذي كان قبله مباشرة أم مختلف عنه.",
      benefit:
        "ينشّط الذاكرة العاملة والانتباه اللحظي بدون مجهود معقّد، مما يساعد على إعادة شحذ الوعي بعد يوم مشتّت.",
      defaultDurationNote:
        "يفضّل أداء التمرين بين ٢–٣ دقائق في الجلسة الواحدة؛ ويمكن زيادة المدة تدريجيًا حسب الشعور بالراحة.",
      type: EX_TYPE_WORKING_MEMORY
    },
    {
      id: "calm-pairs-grid",
      name: "شبكة الأزواج الهادئة",
      tagline: "ابحث عن أزواج الرموز المتطابقة في شبكة بسيطة بهدوء ودون استعجال.",
      category: "تمرين ذاكرة بصري",
      definition:
        "شبكة ٤×٤ من البطاقات المقلوبة. تقلب بطاقتين في كل محاولة لتحاول مطابقة الرموز المتشابهة. البطاقات المتطابقة تبقى مكشوفة، وغير المتطابقة تُغلق تلقائيًا.",
      benefit:
        "تقوية الذاكرة البصرية القصيرة المدى والانتباه للتفاصيل، في سياق لعبة هادئة بعيدة عن الضغط والتوتر.",
      defaultDurationNote:
        "جلسة من ٣–٥ دقائق عادة تكفي لإكمال الشبكة. يمكنك إيقاف التمرين في أي وقت إذا شعرت بالاكتفاء.",
      type: EX_TYPE_MEMORY_GRID
    },
    {
      id: "last-dot-trace",
      name: "أثر النقطة الأخيرة",
      tagline: "تابع نقطة هادئة تتحرك ثم تختفي، وحاول تقدير مكانها الأخير بنقرة واحدة.",
      category: "تركيز بصري عميق",
      definition:
        "نقطة صغيرة تتحرك داخل إطار بمسار ناعم. بعد ثوانٍ قليلة تختفي فجأة، ثم يُطلب منك النقر في المكان الذي تعتقد أنها اختفت فيه.",
      benefit:
        "تعميق الانتباه البصري واستحضار صورة الموقع الأخير في الذهن، مما يدرب على تتبّع التفاصيل الدقيقة وتهدئة الضوضاء الذهنية.",
      defaultDurationNote:
        "لا يعتمد التمرين على وقت محدد؛ كل جولة تستغرق بضع ثوانٍ من التتبّع ثم نقرة تقدير واحدة، ويمكنك تكرار الجولات حسب رغبتك.",
      type: EX_TYPE_LAST_DOT
    },
    {
      // ==============================
      // (5) التمرين الخامس: وميض الانتباه
      // ==============================
      id: "flash-focus",
      name: "وميض الانتباه",
      tagline: "رمز واحد يظهر بسرعة ثم يختفي. فقط لاحِظ الوميض.",
      category: "استشفاء ذهني",
      definition:
        "يظهر رمز واحد في منتصف الإطار لجزء من الثانية ثم يختفي. لا توجد نقرات أو إجابات؛ المطلوب هو الملاحظة الهادئة للوميض.",
      benefit:
        "تهدئة الحمل الإدراكي وتصفير الضوضاء الذهنية عبر تركيز بسيط جدًا على حدث بصري قصير ومتكرر.",
      defaultDurationNote:
        "يفضّل ١–٣ دقائق. يمكنك الإيقاف بأي وقت؛ سيظهر ملخص بعدد الومضات.",
      type: EX_TYPE_FLASH_FOCUS
    },
    {
      // ==============================
      // (6) التمرين السادس: تنفّس الانتباه البصري
      // ==============================
      id: "breath-visual-focus",
      name: "تنفّس الانتباه البصري",
      tagline: "دائرة تتسع وتضيق ببطء لتزامن التنفّس مع النظر، بدون نقر أو قرارات.",
      category: "تهيئة ذهنية",
      definition:
        "دائرة واحدة في المنتصف تتسع (شهيق) ثم تتوقف لحظة قصيرة ثم تضيق (زفير). المطلوب فقط متابعة الدائرة وتزامن التنفّس معها.",
      benefit:
        "تهدئة الجهاز العصبي وتقليل التشتت، وتهيئة الدماغ لدخول حالة تركيز أكثر استقرارًا قبل التمارين الإدراكية.",
      defaultDurationNote:
        "يفضّل ٢–٣ دقائق كبداية جلسة أو قبل أي تمرين إدراكي. يمكن الاكتفاء بدقيقتين أو زيادة المدة حسب الراحة.",
      type: EX_TYPE_BREATH_VISUAL
    },
    {
      // ==============================
      // (7) التمرين السابع: المسح الجسدي السريع
      // ==============================
      id: "body-scan-reset",
      name: "المسح الجسدي السريع",
      tagline: "تنقّل هادئ بالانتباه على أجزاء الجسم لتخفيف التوتر خلال دقائق.",
      category: "استشفاء جسدي-ذهني",
      definition:
        "إرشاد بصري نصي بسيط ينتقل كل عدة ثوانٍ بين أجزاء الجسم. لا يوجد نقر أو تقييم؛ فقط لاحظ الجزء وأرخِه قدر الإمكان.",
      benefit:
        "تقليل التوتر الجسدي وتصفية الذهن قبل الدخول في تمارين إدراكية أو بعد إجهاد طويل.",
      defaultDurationNote:
        "يفضّل ٢–٣ دقائق. يمكن تكراره حسب الحاجة دون ضغط.",
      type: EX_TYPE_BODY_SCAN
    },

    {
      // ==============================
      // (8) التمرين الثامن: تمييز العنصر المختلف (Odd-Element Spotting)
      // ==============================
      id: "odd-element-spotting",
      name: "تمييز العنصر المختلف",
      tagline: "شبكة رموز: عنصر واحد مختلف. التقطه بهدوء وانقر عليه.",
      category: "إعادة التقاط التركيز",
      definition:
        "يعرض شبكة رموز متشابهة مع عنصر واحد مختلف (رمز مختلف). مهمتك العثور على المختلف والنقر عليه. يتم قياس الدقة وزمن الاستجابة.",
      benefit:
        "يرفع دقة الانتباه الانتقائي ويعيد ضبط التركيز بسرعة، خصوصًا بعد التشتت أو التصفح الطويل.",
      defaultDurationNote:
        "يفضّل ٢–٣ دقائق. لا يوجد ضغط وقت؛ لكن يتم قياس زمن الاستجابة لكل جولة لقياس التحسن تدريجيًا.",
      type: EX_TYPE_ODD_SPOT
    }
  ];

  // ==============================
  // 2) مراجع عناصر الصفحة
  // ==============================
  const listContainer   = document.getElementById("exerciseList");
  const titleEl         = document.getElementById("exerciseTitle");
  const tagEl           = document.getElementById("exerciseTagline");
  const catEl           = document.getElementById("exerciseCategoryChip");
  const defEl           = document.getElementById("exerciseDefinition");
  const benEl           = document.getElementById("exerciseBenefit");
  const durNoteEl       = document.getElementById("exerciseDurationNote");
  const stageEl         = document.getElementById("exerciseStage");
  const stageHint       = document.getElementById("stageHint");
  const btnStart        = document.getElementById("btnStartExercise");
  const btnStop         = document.getElementById("btnStopExercise");
  const durationChips   = document.querySelectorAll("#durationChips .chip-btn");

  let activeExercise = null;
  let activeType     = null;

  // ==============================
  // 3) تمرين تتبّع الكرة (visualTracking)
  // ==============================
  let vtContainer   = null;
  let vtCanvas      = null;
  let vtCtx         = null;
  let vtAnimationId = null;
  let vtStartTime   = null;
  let vtDurationMs  = null;

  function vtResizeCanvas() {
    if (!vtContainer || !vtCanvas) return;
    const rect = vtContainer.getBoundingClientRect();
    vtCanvas.width  = rect.width;
    vtCanvas.height = rect.height;
  }

  function vtOnResize() {
    vtResizeCanvas();
  }

  function vtDrawFrame(timestamp) {
    if (!vtCtx || !vtCanvas) return;

    if (!vtStartTime) vtStartTime = timestamp;
    const elapsed = timestamp - vtStartTime;

    if (vtDurationMs && elapsed >= vtDurationMs) {
      vtStop();
      return;
    }

    const w = vtCanvas.width;
    const h = vtCanvas.height;

    vtCtx.clearRect(0, 0, w, h);

    const gradient = vtCtx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.05,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.7
    );
    gradient.addColorStop(0, "rgba(148, 163, 184, 0.08)");
    gradient.addColorStop(1, "rgba(15, 23, 42, 0.08)");
    vtCtx.fillStyle = gradient;
    vtCtx.fillRect(0, 0, w, h);

    const t  = elapsed / 1000;
    const cx = w / 2;
    const cy = h / 2;
    const A  = w * 0.35;
    const B  = h * 0.25;

    const x = cx + A * Math.sin(0.7 * t);
    const y = cy + B * Math.sin(1.3 * t);

    const baseRadius = Math.min(w, h) * 0.03;
    const radius = baseRadius + Math.sin(t * 2) * 2;

    vtCtx.beginPath();
    vtCtx.arc(cx, cy, Math.min(w, h) * 0.4, 0, Math.PI * 2);
    vtCtx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    vtCtx.lineWidth = 1;
    vtCtx.setLineDash([4, 8]);
    vtCtx.stroke();
    vtCtx.setLineDash([]);

    vtCtx.beginPath();
    vtCtx.arc(x, y, radius, 0, Math.PI * 2);
    vtCtx.closePath();
    vtCtx.fillStyle = "rgba(56, 189, 248, 0.95)";
    vtCtx.shadowColor = "rgba(56, 189, 248, 0.8)";
    vtCtx.shadowBlur  = 22;
    vtCtx.fill();
    vtCtx.shadowBlur = 0;

    vtAnimationId = requestAnimationFrame(vtDrawFrame);
  }

  function vtInit(container) {
    vtCleanup();

    vtContainer = container;
    if (!vtContainer) return;

    vtContainer.innerHTML = "";
    vtCanvas = document.createElement("canvas");
    vtCanvas.className = "tracking-canvas";
    vtContainer.appendChild(vtCanvas);

    vtResizeCanvas();
    vtCtx = vtCanvas.getContext("2d");

    window.addEventListener("resize", vtOnResize);
  }

  function vtStart(durationMs) {
    if (!vtContainer) return;

    if (!vtCanvas || !vtCtx) {
      vtInit(vtContainer);
    }

    vtDurationMs = durationMs || null;

    if (vtAnimationId) {
      cancelAnimationFrame(vtAnimationId);
      vtAnimationId = null;
    }
    vtStartTime = null;
    vtAnimationId = requestAnimationFrame(vtDrawFrame);
  }

  function vtStop() {
    if (vtAnimationId) {
      cancelAnimationFrame(vtAnimationId);
      vtAnimationId = null;
    }
    if (vtCtx && vtCanvas) {
      vtCtx.clearRect(0, 0, vtCanvas.width, vtCanvas.height);
    }
  }

  function vtCleanup() {
    if (vtAnimationId) {
      cancelAnimationFrame(vtAnimationId);
      vtAnimationId = null;
    }
    if (vtCtx && vtCanvas) {
      vtCtx.clearRect(0, 0, vtCanvas.width, vtCanvas.height);
    }
    window.removeEventListener("resize", vtOnResize);
    vtCanvas     = null;
    vtCtx        = null;
    vtContainer  = null;
    vtStartTime  = null;
    vtDurationMs = null;
  }

  // ==============================
  // 4) تمرين نبض الذاكرة اللحظية (workingMemory)
  // ==============================
  const WM_SYMBOLS = ["●", "■", "▲", "◆", "★", "⬤", "⬛", "✦"];

  let wmContainer     = null;
  let wmSymbolEl      = null;
  let wmSameBtn       = null;
  let wmDiffBtn       = null;
  let wmStatusEl      = null;
  let wmTimerId       = null;
  let wmRunning       = false;
  let wmPrevSymbol    = null;
  let wmCurrentSymbol = null;
  let wmTrials        = 0;
  let wmCorrect       = 0;

  function wmInit(container) {
    wmCleanup();

    wmContainer = container;
    if (!wmContainer) return;

    wmContainer.innerHTML = "";

    const isDark = document.body.getAttribute("data-theme") === "dark";

    const shell = document.createElement("div");
    shell.style.textAlign = "center";
    shell.style.padding = "1.5rem";
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1.2rem";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      "كل ٢–٣ ثوانٍ سيتغيّر الرمز في المنتصف تلقائيًا. بعد كل تغيير، قرّر: هل الرمز الحالي هو نفس الرمز الذي كان قبله مباشرة أم مختلف عنه؟ الرمز الأول فقط للتعريف ولا تحتاج للضغط فيه على أي زر.";

    const symbolBox = document.createElement("div");
    symbolBox.style.display = "flex";
    symbolBox.style.justifyContent = "center";
    symbolBox.style.alignItems = "center";
    symbolBox.style.height = "180px";
    symbolBox.style.borderRadius = "16px";
    symbolBox.style.border = "1px solid rgba(148, 163, 184, 0.45)";
    symbolBox.style.boxShadow = "0 18px 45px rgba(15, 23, 42, 0.35)";
    symbolBox.style.background = isDark ? "rgba(15, 23, 42, 0.96)" : "#ffffff";

    const symbol = document.createElement("div");
    symbol.textContent = "●";
    symbol.style.fontSize = "4.5rem";
    symbol.style.fontWeight = "700";
    symbol.style.lineHeight = "1";
    symbol.style.userSelect = "none";
    symbol.style.color = isDark ? "#f1f5f9" : "#020617";
    symbol.style.transition = "transform 0.18s ease, opacity 0.18s ease";
    symbol.style.transform  = "scale(1)";

    symbolBox.appendChild(symbol);

    const buttonsRow = document.createElement("div");
    buttonsRow.style.display = "flex";
    buttonsRow.style.justifyContent = "center";
    buttonsRow.style.gap = "1rem";
    buttonsRow.style.marginTop = "0.5rem";

    const sameBtn = document.createElement("button");
    sameBtn.type = "button";
    sameBtn.className = "chip-btn";
    sameBtn.textContent = "نفس السابق";
    sameBtn.style.padding = "0.7rem 1.2rem";
    sameBtn.style.fontSize = "1rem";
    sameBtn.style.fontWeight = "600";

    const diffBtn = document.createElement("button");
    diffBtn.type = "button";
    diffBtn.className = "chip-btn";
    diffBtn.textContent = "مختلف عن السابق";
    diffBtn.style.padding = "0.7rem 1.2rem";
    diffBtn.style.fontSize = "1rem";
    diffBtn.style.fontWeight = "600";

    buttonsRow.appendChild(sameBtn);
    buttonsRow.appendChild(diffBtn);

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent =
      "اضغط (بدء التمرين) لبدء الجلسة، وستظهر هنا نتيجتك أثناء الجلسة وفي نهايتها.";

    shell.appendChild(intro);
    shell.appendChild(symbolBox);
    shell.appendChild(buttonsRow);
    shell.appendChild(status);

    wmContainer.appendChild(shell);

    wmSymbolEl = symbol;
    wmSameBtn  = sameBtn;
    wmDiffBtn  = diffBtn;
    wmStatusEl = status;

    wmSameBtn.addEventListener("click", () => wmHandleResponse(true));
    wmDiffBtn.addEventListener("click", () => wmHandleResponse(false));
  }

  function wmHandleResponse(thinksSame) {
    if (!wmRunning || !wmCurrentSymbol) return;

    const isSame = wmPrevSymbol && wmCurrentSymbol === wmPrevSymbol;
    wmTrials++;

    if (thinksSame === isSame) {
      wmCorrect++;
    }

    wmUpdateStatus();
  }

  function wmUpdateStatus() {
    if (!wmStatusEl) return;
    wmStatusEl.textContent =
      `النتيجة حتى الآن: ${wmCorrect} صحيحة من ${wmTrials} محاولة.`;
  }

  function wmNextTrial() {
    if (!wmRunning) return;

    const previous = wmCurrentSymbol;
    wmPrevSymbol = previous;

    let nextSymbol;
    if (wmPrevSymbol && Math.random() < 0.5) {
      nextSymbol = wmPrevSymbol;
    } else {
      const pool = WM_SYMBOLS;
      nextSymbol = pool[Math.floor(Math.random() * pool.length)];
    }

    wmCurrentSymbol = nextSymbol;

    if (wmSymbolEl) {
      wmSymbolEl.style.transform = "scale(0.8)";
      wmSymbolEl.style.opacity   = "0.35";

      setTimeout(() => {
        wmSymbolEl.textContent = wmCurrentSymbol;
        wmSymbolEl.style.transform = "scale(1)";
        wmSymbolEl.style.opacity   = "1";
        wmUpdateStatus();
      }, 90);
    }

    wmTimerId = setTimeout(wmNextTrial, 2400);
  }

  function wmStart() {
    if (!wmContainer) return;

    if (!wmSymbolEl) {
      wmInit(wmContainer);
    }

    wmRunning       = true;
    wmPrevSymbol    = null;
    wmCurrentSymbol = null;
    wmTrials        = 0;
    wmCorrect       = 0;

    if (wmTimerId) {
      clearTimeout(wmTimerId);
      wmTimerId = null;
    }

    wmUpdateStatus();
    wmNextTrial();
  }

  function wmStop() {
    wmRunning = false;
    if (wmTimerId) {
      clearTimeout(wmTimerId);
      wmTimerId = null;
    }

    let accuracy = 0;
    if (wmTrials > 0) {
      accuracy = Math.round((wmCorrect / wmTrials) * 100);
    }

    alert(
      `انتهت جلسة نبض الذاكرة اللحظية.\n\n` +
      `إجابات صحيحة: ${wmCorrect}\n` +
      `إجمالي المحاولات: ${wmTrials}\n` +
      `نسبة الدقة: ${accuracy}٪`
    );

    if (wmStatusEl) {
      wmStatusEl.textContent =
        `انتهت الجلسة. النتيجة النهائية: ${wmCorrect} إجابة صحيحة من ${wmTrials} محاولة (دقة ${accuracy}%).`;
    }
  }

  function wmCleanup() {
    wmRunning       = false;
    if (wmTimerId) {
      clearTimeout(wmTimerId);
      wmTimerId = null;
    }
    wmContainer     = null;
    wmSymbolEl      = null;
    wmSameBtn       = null;
    wmDiffBtn       = null;
    wmStatusEl      = null;
    wmPrevSymbol    = null;
    wmCurrentSymbol = null;
    wmTrials        = 0;
    wmCorrect       = 0;
  }

  // ==============================
  // 5) تمرين شبكة الأزواج الهادئة (memoryGrid)
  // ==============================
  const MG_SYMBOLS_BASE = ["●", "■", "▲", "◆", "★", "⬤", "⬛", "✦"];

  let mgContainer    = null;
  let mgStatusEl     = null;
  let mgCards        = [];
  let mgPairsCount   = 0;
  let mgRevealed     = []; // indices
  let mgFoundPairs   = 0;
  let mgAttempts     = 0;
  let mgRunning      = false;

  function mgInit(container) {
    mgCleanup();

    mgContainer = container;
    if (!mgContainer) return;

    mgContainer.innerHTML = "";

    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1rem";
    shell.style.padding = "1.2rem";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      "اقلب البطاقات بهدوء وحاول مطابقة أزواج الرموز المتشابهة. كل محاولتين تعتبر محاولة واحدة. لا يوجد وقت محدد صارم، خذ الجلسة براحتك.";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
    grid.style.gap = "0.75rem";

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent = "ابدأ التمرين من زر (بدء التمرين).";

    shell.appendChild(intro);
    shell.appendChild(grid);
    shell.appendChild(status);

    mgContainer.appendChild(shell);

    mgStatusEl = status;
    mgCards    = [];
    mgRevealed = [];
    mgFoundPairs = 0;
    mgAttempts   = 0;
    mgPairsCount = 8;

    const symbols = MG_SYMBOLS_BASE.slice(0, mgPairsCount);
    const deck = [...symbols, ...symbols];

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    deck.forEach((sym, index) => {
      const card = document.createElement("div");
      card.className = "memory-grid-card";
      card.dataset.index = String(index);
      card.dataset.symbol = sym;
      card.dataset.state = "hidden"; // hidden / revealed / matched

      card.style.position = "relative";
      card.style.borderRadius = "14px";
      card.style.border = "1px solid rgba(148, 163, 184, 0.6)";
      card.style.padding = "0.5rem";
      card.style.fontSize = "1.8rem";
      card.style.fontWeight = "600";
      card.style.cursor = "pointer";
      card.style.background = "rgba(15, 23, 42, 0.03)";
      card.style.color = "transparent";
      card.style.transition =
        "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease";

      card.style.display = "flex";
      card.style.alignItems = "center";
      card.style.justifyContent = "center";
      card.style.height = "20vw";
      card.style.maxHeight = "50px";
      card.style.minHeight = "15px";
      card.style.boxSizing = "border-box";
      card.style.transform = "none";

      card.addEventListener("click", () => mgOnCardClick(card));

      mgCards.push(card);
      grid.appendChild(card);
    });

    mgUpdateStatus();
  }

  function mgOnCardClick(card) {
    if (!mgRunning) return;
    const state = card.dataset.state;
    if (state === "matched" || state === "revealed") return;

    const index = parseInt(card.dataset.index, 10);
    if (mgRevealed.length === 2) return;

    mgRevealCard(card);
    mgRevealed.push(index);

    if (mgRevealed.length === 2) {
      mgAttempts++;
      const [i1, i2] = mgRevealed;
      const c1 = mgCards[i1];
      const c2 = mgCards[i2];

      const match = c1.dataset.symbol === c2.dataset.symbol;

      if (match) {
        c1.dataset.state = "matched";
        c2.dataset.state = "matched";
        mgFoundPairs++;
        mgRevealed = [];
        mgUpdateStatus();

        if (mgFoundPairs === mgPairsCount) {
          mgFinish(true);
        }
      } else {
        setTimeout(() => {
          mgHideCard(c1);
          mgHideCard(c2);
          mgRevealed = [];
          mgUpdateStatus();
        }, 700);
      }
    }
  }

  function mgRevealCard(card) {
    card.dataset.state = "revealed";
    card.textContent = card.dataset.symbol || "";
    card.style.background = "rgba(56, 189, 248, 0.12)";
    card.style.boxShadow = "0 14px 32px rgba(15, 23, 42, 0.35)";
    card.style.transform = "scale(1)";
    card.style.color = "#0f172a";
  }

  function mgHideCard(card) {
    if (card.dataset.state === "matched") return;
    card.dataset.state = "hidden";
    card.textContent = "";
    card.style.background = "rgba(15, 23, 42, 0.03)";
    card.style.boxShadow = "none";
    card.style.transform = "scale(1)";
    card.style.color = "transparent";
  }

  function mgUpdateStatus() {
    if (!mgStatusEl) return;
    mgStatusEl.textContent =
      `الأزواج المكتشفة: ${mgFoundPairs} من ${mgPairsCount} – عدد المحاولات: ${mgAttempts}.`;
  }

  function mgStart() {
    if (!mgContainer) return;
    if (!mgCards.length) {
      mgInit(mgContainer);
    }

    mgRunning    = true;
    mgFoundPairs = 0;
    mgAttempts   = 0;
    mgRevealed   = [];

    mgCards.forEach((card) => {
      card.dataset.state = "hidden";
      mgHideCard(card);
    });

    mgUpdateStatus();
  }

  function mgFinish(completed) {
    mgRunning = false;

    let accuracy = 0;
    if (mgAttempts > 0) {
      accuracy = Math.round((mgFoundPairs / mgAttempts) * 100);
    }

    const msg = completed
      ? `أحسنت، أكملت كل الأزواج.\n\nالأزواج المكتشفة: ${mgFoundPairs} من ${mgPairsCount}\nعدد المحاولات: ${mgAttempts}\nنسبة النجاح التقريبية: ${accuracy}٪`
      : `تم إيقاف التمرين.\n\nالأزواج المكتشفة: ${mgFoundPairs} من ${mgPairsCount}\nعدد المحاولات: ${mgAttempts}\nنسبة النجاح التقريبية: ${accuracy}٪`;

    alert(msg);

    if (mgStatusEl) {
      mgStatusEl.textContent =
        `نتيجة الجلسة: ${mgFoundPairs} زوجًا من ${mgPairsCount} في ${mgAttempts} محاولة (نسبة تقريبية: ${accuracy}٪).`;
    }
  }

  function mgStop() {
    if (!mgRunning) {
      mgFinish(false);
      return;
    }
    mgFinish(false);
  }

  function mgCleanup() {
    mgRunning    = false;
    mgContainer  = null;
    mgStatusEl   = null;
    mgCards      = [];
    mgRevealed   = [];
    mgFoundPairs = 0;
    mgAttempts   = 0;
    mgPairsCount = 0;
  }

  // ==============================
  // 6) تمرين أثر النقطة الأخيرة (lastDot)
  // ==============================
  let ldContainer   = null;
  let ldArea        = null;
  let ldDot         = null;
  let ldStatusEl    = null;

  let ldRunning     = false;
  let ldAnimationId = null;
  let ldStartTime   = null;
  let ldPhase       = "idle"; // idle | moving | waitingClick

  let ldLastPos     = null;
  let ldAttempts    = 0;
  let ldTotalScore  = 0;

  let ldRoundDurationMs = 3800;
  let ldOffsetX     = 0;
  let ldOffsetY     = 0;
  let ldSpeedFactor = 1;

  function ldPrepareRound() {
    ldRoundDurationMs = 3200 + Math.random() * 2000;
    ldOffsetX = Math.random() * Math.PI * 2;
    ldOffsetY = Math.random() * Math.PI * 2;
    ldSpeedFactor = 0.7 + Math.random() * 0.6;

    ldStartTime = null;
    ldPhase     = "moving";

    if (ldDot) {
      ldDot.style.opacity = "1";
    }
  }

  function ldInit(container) {
    ldCleanup();

    ldContainer = container;
    if (!ldContainer) return;

    ldContainer.innerHTML = "";

    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1rem";
    shell.style.padding = "1.2rem";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      "تابع حركة النقطة الصغيرة داخل الإطار بهدوء. بعد عدة ثوانٍ ستختفي النقطة، ثم يُطلب منك النقر في المكان الذي تعتقد أنها اختفت فيه. لا يوجد وقت محدد، خذ راحتك.";

    const area = document.createElement("div");
    area.style.position = "relative";
    area.style.borderRadius = "18px";
    area.style.border = "1px solid rgba(148, 163, 184, 0.6)";
    area.style.height = "220px";
    area.style.overflow = "hidden";
    area.style.background = "rgba(15, 23, 42, 0.03)";
    area.style.boxShadow = "0 18px 45px rgba(15, 23, 42, 0.35)";
    area.style.cursor = "crosshair";

    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.width = "14px";
    dot.style.height = "14px";
    dot.style.borderRadius = "999px";
    dot.style.background = "rgba(56, 189, 248, 0.96)";
    dot.style.boxShadow = "0 0 18px rgba(56, 189, 248, 0.85)";
    dot.style.transform = "translate(-50%, -50%)";
    dot.style.left = "50%";
    dot.style.top  = "50%";
    dot.style.opacity = "0";

    area.appendChild(dot);

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent =
      "اضغط (بدء التمرين) لتبدأ جولة هادئة. بعد اختفاء النقطة، انقر داخل الإطار حيث تتوقع مكانها الأخير. ستظهر لك درجة التقريب.";

    shell.appendChild(intro);
    shell.appendChild(area);
    shell.appendChild(status);

    ldContainer.appendChild(shell);

    ldArea     = area;
    ldDot      = dot;
    ldStatusEl = status;

    ldPhase      = "idle";
    ldLastPos    = null;
    ldAttempts   = 0;
    ldTotalScore = 0;

    ldArea.addEventListener("click", ldOnAreaClick);
  }

  function ldStart() {
    if (!ldContainer || !ldArea || !ldDot) return;

    ldRunning = true;
    ldPrepareRound();

    if (ldStatusEl) {
      ldStatusEl.textContent =
        "تابع النقطة بهدوء داخل الإطار. بعد قليل ستختفي، ثم يمكنك النقر على مكانها الأخير.";
    }

    if (ldAnimationId) {
      cancelAnimationFrame(ldAnimationId);
      ldAnimationId = null;
    }
    ldAnimationId = requestAnimationFrame(ldAnimate);
  }

  function ldStop() {
    ldRunning = false;
    ldPhase   = "idle";

    if (ldAnimationId) {
      cancelAnimationFrame(ldAnimationId);
      ldAnimationId = null;
    }

    if (ldDot) {
      ldDot.style.opacity = "0";
    }

    if (ldStatusEl) {
      if (ldAttempts > 0) {
        const avgScore = Math.round(ldTotalScore / ldAttempts);
        ldStatusEl.textContent =
          `تم إيقاف التمرين. عدد المحاولات: ${ldAttempts}، متوسط دقة التقدير: حوالي ${avgScore}٪. يمكنك بدء جلسة جديدة في أي وقت.`;
      } else {
        ldStatusEl.textContent =
          "تم إيقاف التمرين. يمكنك بدء جولة هادئة جديدة في أي وقت بالضغط على زر (بدء التمرين).";
      }
    }
  }

  function ldCleanup() {
    ldRunning = false;
    ldPhase   = "idle";

    if (ldAnimationId) {
      cancelAnimationFrame(ldAnimationId);
      ldAnimationId = null;
    }

    if (ldArea) {
      ldArea.removeEventListener("click", ldOnAreaClick);
    }

    ldContainer   = null;
    ldArea        = null;
    ldDot         = null;
    ldStatusEl    = null;
    ldStartTime   = null;
    ldLastPos     = null;
    ldAttempts    = 0;
    ldTotalScore  = 0;
    ldRoundDurationMs = 3800;
    ldOffsetX     = 0;
    ldOffsetY     = 0;
    ldSpeedFactor = 1;
  }

  function ldAnimate(timestamp) {
    if (!ldRunning || !ldArea || !ldDot) return;

    if (!ldStartTime) ldStartTime = timestamp;
    const elapsed = timestamp - ldStartTime;

    const rect = ldArea.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const cx = w / 2;
    const cy = h / 2;
    const A  = w * 0.35;
    const B  = h * 0.25;

    const t = (elapsed / 1000) * ldSpeedFactor;
    const x = cx + A * Math.sin(0.65 * t + ldOffsetX);
    const y = cy + B * Math.sin(1.05 * t + ldOffsetY);

    ldLastPos = { x, y };

    if (elapsed < ldRoundDurationMs) {
      ldDot.style.opacity = "1";
      ldDot.style.left = `${x}px`;
      ldDot.style.top  = `${y}px`;

      ldAnimationId = requestAnimationFrame(ldAnimate);
    } else {
      ldDot.style.opacity = "0";
      ldPhase = "waitingClick";
      if (ldStatusEl) {
        ldStatusEl.textContent =
          "اختفت النقطة الآن. انقر داخل الإطار في المكان الذي تعتقد أنها اختفت فيه. لا تستعجل.";
      }
    }
  }

  function ldOnAreaClick(evt) {
    if (!ldRunning || ldPhase !== "waitingClick" || !ldArea || !ldLastPos) return;

    const rect = ldArea.getBoundingClientRect();
    const clickX = evt.clientX - rect.left;
    const clickY = evt.clientY - rect.top;

    const dx = clickX - ldLastPos.x;
    const dy = clickY - ldLastPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxDist = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
    let score = Math.max(0, 1 - dist / maxDist);
    score = Math.round(score * 100);

    ldAttempts += 1;
    ldTotalScore += score;

    const avgScore = Math.round(ldTotalScore / ldAttempts);

    if (ldStatusEl) {
      ldStatusEl.textContent =
        `محاولتك الحالية: دقة تقريبية ${score}٪. عدد المحاولات: ${ldAttempts}، متوسط الدقة حتى الآن حوالي ${avgScore}٪. ` +
        `يمكنك بدء جولة جديدة بهدوء بالضغط على (بدء التمرين) أو إيقاف الجلسة متى شئت.`;
    }

    ldPhase = "idle";
  }

  // ==============================
  // (5) التمرين الخامس: وميض الانتباه (Flash Focus)
  // ==============================
  const FF_SYMBOLS = ["●", "■", "▲", "◆", "★", "⬤", "⬛", "✦"];

  let ffContainer   = null;
  let ffBox         = null;
  let ffSymbolEl    = null;
  let ffStatusEl    = null;

  let ffRunning     = false;
  let ffTimerId     = null;
  let ffFlashes     = 0;

  const ffShowMs    = 250;
  const ffCycleMs   = 1200;

  function ffInit(container) {
    ffCleanup();

    ffContainer = container;
    if (!ffContainer) return;

    ffContainer.innerHTML = "";

    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1rem";
    shell.style.padding = "1.2rem";
    shell.style.textAlign = "center";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      `سيظهر رمز واحد في منتصف الإطار لمدة قصيرة ثم يختفي. لا تحتاج لأي نقرات. فقط لاحِظ الوميض بهدوء.`;

    const box = document.createElement("div");
    box.style.position = "relative";
    box.style.borderRadius = "18px";
    box.style.border = "1px solid rgba(148, 163, 184, 0.6)";
    box.style.height = "220px";
    box.style.background = "rgba(15, 23, 42, 0.03)";
    box.style.boxShadow = "0 18px 45px rgba(15, 23, 42, 0.35)";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.overflow = "hidden";

    const symbol = document.createElement("div");
    symbol.textContent = "●";
    symbol.style.fontSize = "4.5rem";
    symbol.style.fontWeight = "800";
    symbol.style.lineHeight = "1";
    symbol.style.userSelect = "none";
    symbol.style.opacity = "0";
    symbol.style.transform = "scale(0.92)";
    symbol.style.transition = "opacity 0.12s ease, transform 0.12s ease";

    const isDark = document.body.getAttribute("data-theme") === "dark";
    symbol.style.color = isDark ? "#f1f5f9" : "#0f172a";

    box.appendChild(symbol);

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent = "اضغط (بدء التمرين) لبدء الومضات. عند الإيقاف ستظهر النتيجة.";

    shell.appendChild(intro);
    shell.appendChild(box);
    shell.appendChild(status);

    ffContainer.appendChild(shell);

    ffBox      = box;
    ffSymbolEl = symbol;
    ffStatusEl = status;

    ffFlashes = 0;
    ffRunning = false;
  }

  function ffPulseOnce() {
    if (!ffRunning || !ffSymbolEl) return;

    const sym = FF_SYMBOLS[Math.floor(Math.random() * FF_SYMBOLS.length)];
    ffSymbolEl.textContent = sym;

    ffSymbolEl.style.opacity = "1";
    ffSymbolEl.style.transform = "scale(1)";

    ffFlashes++;

    setTimeout(() => {
      if (!ffRunning || !ffSymbolEl) return;
      ffSymbolEl.style.opacity = "0";
      ffSymbolEl.style.transform = "scale(0.92)";
    }, ffShowMs);

    ffTimerId = setTimeout(ffPulseOnce, ffCycleMs);

    if (ffStatusEl) {
      ffStatusEl.textContent =
        `التمرين جارٍ... عدد الومضات: ${ffFlashes} (ظهور ${ffShowMs}ms / تكرار ${ffCycleMs}ms)`;
    }
  }

  function ffStart() {
    if (!ffContainer) return;
    if (!ffSymbolEl) {
      ffInit(ffContainer);
    }

    ffRunning = true;
    ffFlashes = 0;

    if (ffTimerId) {
      clearTimeout(ffTimerId);
      ffTimerId = null;
    }

    if (ffStatusEl) {
      ffStatusEl.textContent =
        `التمرين جارٍ... عدد الومضات: 0 (ظهور ${ffShowMs}ms / تكرار ${ffCycleMs}ms)`;
    }

    ffPulseOnce();
  }

  function ffStop() {
    ffRunning = false;

    if (ffTimerId) {
      clearTimeout(ffTimerId);
      ffTimerId = null;
    }

    if (ffSymbolEl) {
      ffSymbolEl.style.opacity = "0";
      ffSymbolEl.style.transform = "scale(0.92)";
    }

    alert(
      `انتهى تمرين وميض الانتباه.\n\n` +
      `عدد الومضات: ${ffFlashes}\n` +
      `مدة ظهور الرمز: ${ffShowMs}ms\n` +
      `التكرار: كل ${ffCycleMs}ms`
    );

    if (ffStatusEl) {
      ffStatusEl.textContent =
        `انتهت الجلسة. عدد الومضات: ${ffFlashes}. يمكنك بدء جلسة جديدة في أي وقت.`;
    }
  }

  function ffCleanup() {
    ffRunning = false;

    if (ffTimerId) {
      clearTimeout(ffTimerId);
      ffTimerId = null;
    }

    ffContainer = null;
    ffBox       = null;
    ffSymbolEl  = null;
    ffStatusEl  = null;
    ffFlashes   = 0;
  }

  // ==============================
  // (6) التمرين السادس: تنفّس الانتباه البصري (Breath Visual)
  // ==============================
  let bvContainer   = null;
  let bvArea        = null;
  let bvCircle      = null;
  let bvStatusEl    = null;
  let bvAnimId      = null;
  let bvStartTime   = null;
  let bvDurationMs  = null;
  let bvRunning     = false;

  // إعدادات دورة التنفس (ثوانٍ)
  const BV_INHALE_S = 4.0;
  const BV_HOLD_S   = 0.8;
  const BV_EXHALE_S = 6.0; // <-- الزفير 6 ثواني
  const BV_CYCLE_S  = BV_INHALE_S + BV_HOLD_S + BV_EXHALE_S;

  function bvInit(container) {
    bvCleanup();

    bvContainer = container;
    if (!bvContainer) return;

    bvContainer.innerHTML = "";

    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1rem";
    shell.style.padding = "1.2rem";
    shell.style.textAlign = "center";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      "تابع الدائرة في المنتصف: عندما تتسع خذ شهيقًا ببطء، وعندما تضيق أخرج زفيرًا ببطء. لا يوجد نقر أو تقييم، فقط مزامنة هادئة.";

    const area = document.createElement("div");
    area.style.position = "relative";
    area.style.borderRadius = "18px";
    area.style.border = "1px solid rgba(148, 163, 184, 0.6)";
    area.style.height = "220px";
    area.style.background = "rgba(15, 23, 42, 0.03)";
    area.style.boxShadow = "0 18px 45px rgba(15, 23, 42, 0.35)";
    area.style.display = "flex";
    area.style.alignItems = "center";
    area.style.justifyContent = "center";
    area.style.overflow = "hidden";

    const circle = document.createElement("div");
    circle.style.width = "120px";
    circle.style.height = "120px";
    circle.style.borderRadius = "999px";
    circle.style.background = "rgba(56, 189, 248, 0.18)";
    circle.style.boxShadow = "0 0 26px rgba(56, 189, 248, 0.35)";
    circle.style.border = "1px solid rgba(56, 189, 248, 0.35)";
    circle.style.transform = "scale(0.85)";
    circle.style.opacity = "1";
    circle.style.willChange = "transform";

    area.appendChild(circle);

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent =
      "اضغط (بدء التمرين) لتبدأ. استمر بهدوء حتى تنتهي المدة المختارة أو أوقفه متى شئت.";

    shell.appendChild(intro);
    shell.appendChild(area);
    shell.appendChild(status);

    bvContainer.appendChild(shell);

    bvArea     = area;
    bvCircle   = circle;
    bvStatusEl = status;
  }

  function bvStart(durationMs) {
    if (!bvContainer || !bvCircle) return;

    bvRunning    = true;
    bvDurationMs = durationMs || null;
    bvStartTime  = null;

    if (bvAnimId) {
      cancelAnimationFrame(bvAnimId);
      bvAnimId = null;
    }

    bvAnimId = requestAnimationFrame(bvAnimate);
  }

  function bvStop() {
    bvRunning = false;

    if (bvAnimId) {
      cancelAnimationFrame(bvAnimId);
      bvAnimId = null;
    }

    if (bvCircle) {
      bvCircle.style.transform = "scale(0.85)";
      bvCircle.style.background = "rgba(56, 189, 248, 0.18)";
      bvCircle.style.boxShadow = "0 0 26px rgba(56, 189, 248, 0.35)";
    }

    if (bvStatusEl) {
      bvStatusEl.textContent =
        "تم إيقاف تمرين التنفّس. إذا أردت، ابدأه مرة أخرى لدقيقتين كتهيئة قبل أي تمرين إدراكي.";
    }
  }

  function bvCleanup() {
    bvRunning    = false;
    bvDurationMs = null;
    bvStartTime  = null;

    if (bvAnimId) {
      cancelAnimationFrame(bvAnimId);
      bvAnimId = null;
    }

    bvContainer = null;
    bvArea      = null;
    bvCircle    = null;
    bvStatusEl  = null;
  }

  function bvAnimate(ts) {
    if (!bvRunning || !bvCircle) return;

    if (!bvStartTime) bvStartTime = ts;
    const elapsed = ts - bvStartTime;

    if (bvDurationMs && elapsed >= bvDurationMs) {
      bvStop();

      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 660;
        g.gain.value = 0.04;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => { o.stop(); ctx.close(); }, 140);
      } catch (e) {}

      alert(
        "انتهت جلسة التنفّس.\n\n" +
        "سؤال سريع:\n" +
        "ماذا أحسست الآن؟\n" +
        "1) أهدأ\n2) نفس الشيء\n3) متوتر\n\n" +
        "هل تحتاج هدوءًا أكبر (جلسة إضافية) أم يكفي؟"
      );
      return;
    }

    const t = (elapsed / 1000) % BV_CYCLE_S;

    let phase = "inhale";
    let k = 0;

    if (t < BV_INHALE_S) {
      phase = "inhale";
      k = t / BV_INHALE_S;
    } else if (t < BV_INHALE_S + BV_HOLD_S) {
      phase = "hold";
      k = 1;
    } else {
      phase = "exhale";
      const te = t - (BV_INHALE_S + BV_HOLD_S);
      k = 1 - (te / BV_EXHALE_S);
      k = Math.max(0, Math.min(1, k));
    }

    const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

    const sMin = 0.85;
    const sMax = 1.25;
    const scale = sMin + (sMax - sMin) * ease(k);

    bvCircle.style.transform = `scale(${scale.toFixed(4)})`;

    if (bvStatusEl) {
      if (phase === "inhale") bvStatusEl.textContent = `شهيق ببطء... (${BV_INHALE_S}s)`;
      else if (phase === "hold") bvStatusEl.textContent = `توقّف قصير... (${BV_HOLD_S}s)`;
      else bvStatusEl.textContent = `زفير ببطء... (${BV_EXHALE_S}s)`;
    }

    bvAnimId = requestAnimationFrame(bvAnimate);
  }

  // ==============================
  // (7) التمرين السابع: المسح الجسدي السريع (Body Scan)
  // ==============================
  let bsContainer  = null;
  let bsBox        = null;
  let bsTextEl     = null;
  let bsStatusEl   = null;
  let bsTimerId    = null;
  let bsStartTime  = null;
  let bsDurationMs = null;
  let bsRunning    = false;
  let bsIndex      = 0;

  const BS_STEP_MS = 6500; // مدة كل خطوة
  const BS_STEPS = [
    { title: "الجبهة والعينان", hint: "خفّف العبوس… أرخِ الجبهة." },
    { title: "الفك واللسان",     hint: "اترك الفك مرتخيًا… لا تعضّ." },
    { title: "الرقبة",           hint: "أرخِ الرقبة… دعها خفيفة." },
    { title: "الكتفان",          hint: "أنزل الكتفين… دع الثقل يهبط." },
    { title: "الصدر",            hint: "تنفّس بهدوء… لاحظ فقط." },
    { title: "البطن",            hint: "اترك البطن لينًا… دون شدّ." },
    { title: "اليدان والذراعان", hint: "افتح الكف قليلًا… أرخِ الساعدين." },
    { title: "الفخذان",          hint: "أرخِ الفخذين… دع العضلات تهدأ." },
    { title: "الساقان",          hint: "خفّف الشد… دع الساق ترتاح." },
    { title: "القدمان",          hint: "لاحظ القدمين… أرخِ الأصابع." }
  ];

  function bsInit(container) {
    bsCleanup();

    bsContainer = container;
    if (!bsContainer) return;

    bsContainer.innerHTML = "";

    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1rem";
    shell.style.padding = "1.2rem";
    shell.style.textAlign = "center";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      "اتّبع الإرشادات النصية بهدوء. لا تحتاج لأي نقرات. فقط لاحظ الجزء المذكور وحاول إرخاءه قدر الإمكان.";

    const box = document.createElement("div");
    box.style.position = "relative";
    box.style.borderRadius = "18px";
    box.style.border = "1px solid rgba(148, 163, 184, 0.6)";
    box.style.height = "220px";
    box.style.background = "rgba(15, 23, 42, 0.03)";
    box.style.boxShadow = "0 18px 45px rgba(15, 23, 42, 0.35)";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.overflow = "hidden";
    box.style.padding = "1rem";

    const text = document.createElement("div");
    text.style.display = "flex";
    text.style.flexDirection = "column";
    text.style.gap = "0.6rem";
    text.style.maxWidth = "560px";

    const title = document.createElement("div");
    title.style.fontSize = "1.8rem";
    title.style.fontWeight = "800";
    title.style.lineHeight = "1.2";
    title.textContent = "ابدأ المسح الجسدي";

    const hint = document.createElement("div");
    hint.style.fontSize = "1.05rem";
    hint.style.opacity = "0.9";
    hint.textContent = "اضغط (بدء التمرين) لتبدأ…";

    text.appendChild(title);
    text.appendChild(hint);
    box.appendChild(text);

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent =
      "عند انتهاء المدة المختارة سيتوقف التمرين تلقائيًا بصوت خفيف ورسالة انعكاس شعوري.";

    shell.appendChild(intro);
    shell.appendChild(box);
    shell.appendChild(status);

    bsContainer.appendChild(shell);

    bsBox      = box;
    bsTextEl   = text;
    bsStatusEl = status;

    bsRunning = false;
    bsIndex = 0;
  }

  function bsRenderStep() {
    if (!bsTextEl) return;

    const step = BS_STEPS[bsIndex % BS_STEPS.length];

    const titleEl = bsTextEl.children[0];
    const hintEl  = bsTextEl.children[1];

    titleEl.textContent = step.title;
    hintEl.textContent  = step.hint;

    bsIndex++;
  }

  function bsTick() {
    if (!bsRunning) return;

    const now = performance.now();
    if (bsDurationMs && bsStartTime && (now - bsStartTime) >= bsDurationMs) {
      bsFinish();
      return;
    }

    bsRenderStep();
    bsTimerId = setTimeout(bsTick, BS_STEP_MS);
  }

  function bsStart(durationMs) {
    if (!bsContainer) return;
    if (!bsTextEl) bsInit(bsContainer);

    bsRunning    = true;
    bsDurationMs = durationMs || null;
    bsStartTime  = performance.now();
    bsIndex      = 0;

    if (bsTimerId) {
      clearTimeout(bsTimerId);
      bsTimerId = null;
    }

    if (bsStatusEl) {
      bsStatusEl.textContent =
        `التمرين جارٍ... خطوة كل ${(BS_STEP_MS/1000).toFixed(1)} ثانية. سيُنهى تلقائيًا عند نهاية المدة.`;
    }

    bsTick();
  }

  function bsFinish() {
    bsRunning = false;

    if (bsTimerId) {
      clearTimeout(bsTimerId);
      bsTimerId = null;
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 660;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 140);
    } catch (e) {}

    alert(
      "انتهى تمرين المسح الجسدي.\n\n" +
      "سؤال سريع:\n" +
      "1) ماذا تشعر الآن؟ (أهدأ / نفس الشي / متوتر)\n" +
      "2) هل تحتاج هدوءًا أكبر أم يكفي؟\n\n" +
      "ملاحظة: كرره ٢–٣ دقائق أخرى إذا رغبت."
    );

    if (bsStatusEl) {
      bsStatusEl.textContent =
        "انتهى التمرين. إذا رغبت، أعده ٢–٣ دقائق إضافية أو انتقل لتمرين إدراكي.";
    }
  }

  function bsStop() {
    bsRunning = false;

    if (bsTimerId) {
      clearTimeout(bsTimerId);
      bsTimerId = null;
    }

    if (bsStatusEl) {
      bsStatusEl.textContent =
        "تم إيقاف تمرين المسح الجسدي. يمكنك بدء جلسة جديدة في أي وقت.";
    }
  }

  function bsCleanup() {
    bsRunning = false;

    if (bsTimerId) {
      clearTimeout(bsTimerId);
      bsTimerId = null;
    }

    bsContainer  = null;
    bsBox        = null;
    bsTextEl     = null;
    bsStatusEl   = null;
    bsStartTime  = null;
    bsDurationMs = null;
    bsIndex      = 0;
  }

  // ==============================
  // (8) التمرين الثامن: تمييز العنصر المختلف (Odd Spotting)
  // ==============================
  const OS_SYMBOLS = ["●", "■", "▲", "◆", "★", "⬤", "⬛", "✦"];

  let osContainer     = null;
  let osGridEl        = null;
  let osStatusEl      = null;
  let osRunning       = false;
  let osTimerId       = null;
  let osStartTime     = null;
  let osDurationMs    = null;

  let osTrials         = 0;
  let osCorrect        = 0;
  let osTotalReaction  = 0;

  let osOddIndex       = -1;
  let osTargetSymbol   = null;
  let osOddSymbol      = null;

  const OS_GRID_SIZE   = 4;         // 4x4
  const OS_CELL_COUNT  = OS_GRID_SIZE * OS_GRID_SIZE;
  const OS_NEXT_DELAY  = 380;       // ms بعد الإجابة قبل الجولة التالية (لطيف بدون استعجال)

  function osInit(container) {
    osCleanup();

    osContainer = container;
    if (!osContainer) return;

    osContainer.innerHTML = "";

    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.flexDirection = "column";
    shell.style.gap = "1rem";
    shell.style.padding = "1.2rem";

    const intro = document.createElement("p");
    intro.className = "placeholder-text";
    intro.textContent =
      "ستظهر شبكة رموز متشابهة وفيها رمز واحد مختلف. حدّد المختلف بهدوء وانقر عليه. يتم قياس الدقة وزمن الاستجابة لكل جولة.";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${OS_GRID_SIZE}, minmax(0, 1fr))`;
    grid.style.gap = "0.75rem";
    grid.style.userSelect = "none";

    const status = document.createElement("p");
    status.className = "meta-note";
    status.textContent = "اضغط (بدء التمرين) لبدء الجولات.";

    shell.appendChild(intro);
    shell.appendChild(grid);
    shell.appendChild(status);

    osContainer.appendChild(shell);

    osGridEl   = grid;
    osStatusEl = status;

    osTrials        = 0;
    osCorrect       = 0;
    osTotalReaction = 0;

    // بناء الخلايا مرة واحدة
    for (let i = 0; i < OS_CELL_COUNT; i++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "chip-btn";
      cell.dataset.index = String(i);

      cell.style.height = "56px";
      cell.style.borderRadius = "14px";
      cell.style.display = "flex";
      cell.style.alignItems = "center";
      cell.style.justifyContent = "center";
      cell.style.fontSize = "1.6rem";
      cell.style.fontWeight = "800";
      cell.style.border = "1px solid rgba(148, 163, 184, 0.6)";
      cell.style.background = "rgba(15, 23, 42, 0.03)";
      cell.style.boxShadow = "none";
      cell.style.transition = "transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease";

      cell.addEventListener("click", () => osOnCellClick(cell));

      osGridEl.appendChild(cell);
    }

    osRenderStatus();
  }

  function osPickTwoDifferentSymbols() {
    const a = OS_SYMBOLS[Math.floor(Math.random() * OS_SYMBOLS.length)];
    let b = a;
    while (b === a) {
      b = OS_SYMBOLS[Math.floor(Math.random() * OS_SYMBOLS.length)];
    }
    return { base: a, odd: b };
  }

  function osNewRound() {
    if (!osRunning || !osGridEl) return;

    // اختيار الرمز الأساسي + المختلف
    const { base, odd } = osPickTwoDifferentSymbols();
    osTargetSymbol = base;
    osOddSymbol    = odd;

    // اختيار موقع المختلف
    osOddIndex = Math.floor(Math.random() * OS_CELL_COUNT);

    // تعبئة الشبكة
    const cells = osGridEl.querySelectorAll("button[data-index]");
    cells.forEach((cell) => {
      const idx = parseInt(cell.dataset.index, 10);
      cell.disabled = false;

      cell.textContent = (idx === osOddIndex) ? osOddSymbol : osTargetSymbol;

      // إعادة مظهر الخلايا
      cell.style.transform = "scale(1)";
      cell.style.boxShadow = "none";
      cell.style.background = "rgba(15, 23, 42, 0.03)";
    });

    osStartTime = performance.now();

    if (osStatusEl) {
      osStatusEl.textContent =
        `جولة جديدة... ابحث عن المختلف وانقر عليه. (محاولات: ${osTrials}، صحيحة: ${osCorrect})`;
    }
  }

  function osOnCellClick(cell) {
    if (!osRunning || !osGridEl || !osStartTime) return;

    const idx = parseInt(cell.dataset.index, 10);
    const reaction = performance.now() - osStartTime;

    osTrials += 1;

    const isCorrect = idx === osOddIndex;
    if (isCorrect) {
      osCorrect += 1;
      osTotalReaction += reaction;

      cell.style.background = "rgba(56, 189, 248, 0.14)";
      cell.style.boxShadow = "0 16px 38px rgba(15, 23, 42, 0.35)";
      cell.style.transform = "scale(1.03)";
    } else {
      // تمييز اختيار خاطئ + تمييز الصحيح بشكل خفيف
      cell.style.background = "rgba(239, 68, 68, 0.10)";
      cell.style.boxShadow = "0 16px 38px rgba(15, 23, 42, 0.22)";
      cell.style.transform = "scale(0.99)";

      const correctCell = osGridEl.querySelector(`button[data-index="${osOddIndex}"]`);
      if (correctCell) {
        correctCell.style.background = "rgba(56, 189, 248, 0.10)";
        correctCell.style.boxShadow = "0 14px 30px rgba(15, 23, 42, 0.25)";
      }
    }

    // قفل الشبكة لحظة ثم جولة جديدة
    osGridEl.querySelectorAll("button[data-index]").forEach((c) => c.disabled = true);

    osRenderStatus(reaction, isCorrect);

    setTimeout(() => {
      if (!osRunning) return;
      osNewRound();
    }, OS_NEXT_DELAY);
  }

  function osRenderStatus(lastReactionMs, lastCorrect) {
    if (!osStatusEl) return;

    const accuracy = osTrials > 0 ? Math.round((osCorrect / osTrials) * 100) : 0;
    const avgRt = osCorrect > 0 ? Math.round(osTotalReaction / osCorrect) : 0;

    const lastLine = (typeof lastReactionMs === "number")
      ? `— آخر جولة: ${lastCorrect ? "صحيح" : "خطأ"} (${Math.round(lastReactionMs)}ms)`
      : "";

    osStatusEl.textContent =
      `النتيجة: ${osCorrect} صحيحة من ${osTrials} (دقة ${accuracy}٪) — متوسط زمن الاستجابة: ${avgRt}ms ${lastLine}`;
  }

  function osStart(durationMs) {
    if (!osContainer) return;
    if (!osGridEl) osInit(osContainer);

    osRunning    = true;
    osDurationMs = durationMs || null;

    // مؤقت إنهاء اختياري بناءً على chips
    if (osTimerId) {
      clearTimeout(osTimerId);
      osTimerId = null;
    }

    if (osDurationMs) {
      osTimerId = setTimeout(() => {
        osStop(true);
      }, osDurationMs);
    }

    osNewRound();
  }

  function osStop(showAlert) {
    osRunning = false;

    if (osTimerId) {
      clearTimeout(osTimerId);
      osTimerId = null;
    }

    // تعطيل الشبكة
    if (osGridEl) {
      osGridEl.querySelectorAll("button[data-index]").forEach((c) => c.disabled = true);
    }

    const accuracy = osTrials > 0 ? Math.round((osCorrect / osTrials) * 100) : 0;
    const avgRt = osCorrect > 0 ? Math.round(osTotalReaction / osCorrect) : 0;

    if (showAlert) {
      alert(
        "انتهى تمرين تمييز العنصر المختلف.\n\n" +
        `محاولات: ${osTrials}\n` +
        `صحيحة: ${osCorrect}\n` +
        `الدقة: ${accuracy}٪\n` +
        `متوسط زمن الاستجابة: ${avgRt}ms`
      );
    }

    if (osStatusEl) {
      osStatusEl.textContent =
        `انتهت الجلسة. النتيجة: ${osCorrect}/${osTrials} (دقة ${accuracy}٪)، متوسط زمن الاستجابة ${avgRt}ms.`;
    }
  }

  function osCleanup() {
    osRunning = false;

    if (osTimerId) {
      clearTimeout(osTimerId);
      osTimerId = null;
    }

    osContainer     = null;
    osGridEl        = null;
    osStatusEl      = null;
    osStartTime     = null;
    osDurationMs    = null;

    osTrials        = 0;
    osCorrect       = 0;
    osTotalReaction = 0;

    osOddIndex      = -1;
    osTargetSymbol  = null;
    osOddSymbol     = null;
  }

  // ==============================
  // 7) دوال الواجهة العامة
  // ==============================
  function renderExerciseList() {
    if (!listContainer) return;
    listContainer.innerHTML = "";

    if (!exercises.length) {
      const empty = document.createElement("div");
      empty.className = "exercise-list-item";
      empty.innerHTML = `
        <div class="exercise-list-item-title">لا توجد تدريبات مضافة حتى الآن</div>
        <div class="exercise-list-item-sub">
          سيتم لاحقاً إضافة تمارين التركيز والانتباه هنا، ويمكنك عندها اختيار أي تمرين لعرضه في منطقة العرض.
        </div>
      `;
      listContainer.appendChild(empty);

      if (btnStart) btnStart.disabled = true;
      if (btnStop) btnStop.disabled = true;
      return;
    }

    exercises.forEach((ex) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "exercise-list-item";
      item.dataset.exerciseId = ex.id;

      const title = document.createElement("div");
      title.className = "exercise-list-item-title";
      title.textContent = ex.name;

      const sub = document.createElement("div");
      sub.className = "exercise-list-item-sub";
      sub.textContent = ex.tagline;

      const meta = document.createElement("div");
      meta.className = "exercise-list-item-meta";
      const cat = document.createElement("span");
      cat.textContent = ex.category || "تمرين تركيز";
      const idSpan = document.createElement("span");
      idSpan.textContent = ex.id;
      meta.appendChild(cat);
      meta.appendChild(idSpan);

      item.appendChild(title);
      item.appendChild(sub);
      item.appendChild(meta);

      item.addEventListener("click", () => selectExercise(ex.id));

      listContainer.appendChild(item);
    });

    if (btnStart) btnStart.disabled = false;
    if (btnStop) btnStop.disabled = false;
  }

  function selectExercise(id) {
    const ex = exercises.find((e) => e.id === id);
    if (!ex) return;

    // تنظيف التمرين السابق
    if (activeType === EX_TYPE_VISUAL_TRACKING) {
      vtCleanup();
    } else if (activeType === EX_TYPE_WORKING_MEMORY) {
      wmCleanup();
    } else if (activeType === EX_TYPE_MEMORY_GRID) {
      mgCleanup();
    } else if (activeType === EX_TYPE_LAST_DOT) {
      ldCleanup();
    } else if (activeType === EX_TYPE_FLASH_FOCUS) {
      ffCleanup();
    } else if (activeType === EX_TYPE_BREATH_VISUAL) {
      bvCleanup();
    } else if (activeType === EX_TYPE_BODY_SCAN) {
      bsCleanup();
    } else if (activeType === EX_TYPE_ODD_SPOT) {
      osCleanup();
    }

    activeExercise = ex;
    activeType     = ex.type;

    document.querySelectorAll(".exercise-list-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.exerciseId === id);
    });

    if (titleEl)   titleEl.textContent   = ex.name;
    if (tagEl)     tagEl.textContent     = ex.tagline;
    if (catEl)     catEl.textContent     = ex.category || "تمرين تركيز";
    if (defEl)     defEl.textContent     = ex.definition || "";
    if (benEl)     benEl.textContent     = ex.benefit || "";
    if (durNoteEl) durNoteEl.textContent = ex.defaultDurationNote || "";

    if (stageEl) {
      if (activeType === EX_TYPE_VISUAL_TRACKING) {
        vtInit(stageEl);
      } else if (activeType === EX_TYPE_WORKING_MEMORY) {
        wmInit(stageEl);
      } else if (activeType === EX_TYPE_MEMORY_GRID) {
        mgInit(stageEl);
      } else if (activeType === EX_TYPE_LAST_DOT) {
        ldInit(stageEl);
      } else if (activeType === EX_TYPE_FLASH_FOCUS) {
        ffInit(stageEl);
      } else if (activeType === EX_TYPE_BREATH_VISUAL) {
        bvInit(stageEl);
      } else if (activeType === EX_TYPE_BODY_SCAN) {
        bsInit(stageEl);
      } else if (activeType === EX_TYPE_ODD_SPOT) {
        osInit(stageEl);
      } else {
        stageEl.innerHTML = "";
      }
    }

    if (stageHint) {
      if (activeType === EX_TYPE_VISUAL_TRACKING) {
        stageHint.textContent =
          "جلسة هادئة لتتبّع كرة مضيئة تتحرك بمسار ناعم داخل الإطار لإعادة ضبط الانتباه البصري بعد يوم مزدحم.";
      } else if (activeType === EX_TYPE_WORKING_MEMORY) {
        stageHint.textContent =
          "تابع تغيّر الرمز في المنتصف، وبعد كل تغيّر قرّر: نفس السابق أم مختلف عن السابق. النتيجة النهائية ستظهر بعد انتهاء الجلسة أو عند الإيقاف.";
      } else if (activeType === EX_TYPE_MEMORY_GRID) {
        stageHint.textContent =
          "شبكة بسيطة لمطابقة الأزواج المتشابهة. ركّز على أماكن الرموز بهدوء، وخذ الوقت الذي يناسبك.";
      } else if (activeType === EX_TYPE_LAST_DOT) {
        stageHint.textContent =
          "راقب النقطة حتى تختفي، ثم حاول تقدير موضعها الأخير بنقرة واحدة. الفكرة ليست في الكمال بل في تهدئة التركيز واستحضار الصورة في ذهنك.";
      } else if (activeType === EX_TYPE_FLASH_FOCUS) {
        stageHint.textContent =
          `رمز واحد يظهر بسرعة ثم يختفي. لا توجد نقرات. مدة ظهور الرمز ${ffShowMs}ms والتكرار كل ${ffCycleMs}ms.`;
      } else if (activeType === EX_TYPE_BREATH_VISUAL) {
        stageHint.textContent =
          `دائرة تتسع (شهيق ${BV_INHALE_S}s) ثم توقف ${BV_HOLD_S}s ثم تضيق (زفير ${BV_EXHALE_S}s). تمرين تهيئة هادئ قبل أي تمرين إدراكي.`;
      } else if (activeType === EX_TYPE_BODY_SCAN) {
        stageHint.textContent =
          `مسح جسدي موجّه: تنتقل الإرشادات كل ${(BS_STEP_MS/1000).toFixed(1)} ثانية لتخفيف التوتر. لا يوجد نقر أو تقييم.`;
      } else if (activeType === EX_TYPE_ODD_SPOT) {
        stageHint.textContent =
          "شبكة رموز: عنصر واحد مختلف. ابحث عنه وانقر عليه. يتم قياس الدقة ومتوسط زمن الاستجابة (ms) لقياس التحسن تدريجيًا.";
      } else {
        stageHint.textContent =
          "أي تمرين سيتم اختياره من القائمة سيستخدم هذه المنطقة نفسها لعرض محتواه البصري لاحقاً.";
      }
    }
  }

  function initDurationChips() {
    durationChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        durationChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });

    const first = durationChips[0];
    if (first) first.classList.add("active");
  }

  function getSelectedDurationMs() {
    let min = 2;
    const activeChip = document.querySelector("#durationChips .chip-btn.active");
    if (activeChip && activeChip.dataset.min) {
      const parsed = parseInt(activeChip.dataset.min, 10);
      if (!Number.isNaN(parsed)) {
        min = parsed;
      }
    }
    return min * 60 * 1000;
  }

  function initButtons() {
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        btnStart.classList.add("active");
        setTimeout(() => btnStart.classList.remove("active"), 160);

        if (!activeExercise || !activeType) {
          if (stageEl) {
            stageEl.innerHTML = "";
            const placeholder = document.createElement("div");
            placeholder.className = "stage-placeholder";

            const h = document.createElement("p");
            h.className = "placeholder-title";
            h.textContent = "لم يتم اختيار تمرين بعد";

            const p = document.createElement("p");
            p.className = "placeholder-text";
            p.textContent =
              "اختر أحد التدريبات من القائمة على اليمين (أو الأعلى في الجوال) قبل بدء الجلسة.";

            placeholder.appendChild(h);
            placeholder.appendChild(p);
            stageEl.appendChild(placeholder);
          }
          return;
        }

        const durationMs = getSelectedDurationMs();

        if (activeType === EX_TYPE_VISUAL_TRACKING) {
          vtStart(durationMs);
        } else if (activeType === EX_TYPE_WORKING_MEMORY) {
          wmStart();
        } else if (activeType === EX_TYPE_MEMORY_GRID) {
          mgStart();
        } else if (activeType === EX_TYPE_LAST_DOT) {
          ldStart();
        } else if (activeType === EX_TYPE_FLASH_FOCUS) {
          ffStart();
        } else if (activeType === EX_TYPE_BREATH_VISUAL) {
          bvStart(durationMs);
        } else if (activeType === EX_TYPE_BODY_SCAN) {
          bsStart(durationMs);
        } else if (activeType === EX_TYPE_ODD_SPOT) {
          osStart(durationMs);
        }
      });
    }

    if (btnStop) {
      btnStop.addEventListener("click", () => {
        btnStop.classList.add("active");
        setTimeout(() => btnStop.classList.remove("active"), 160);

        if (activeType === EX_TYPE_VISUAL_TRACKING) {
          vtStop();
        } else if (activeType === EX_TYPE_WORKING_MEMORY) {
          wmStop();
        } else if (activeType === EX_TYPE_MEMORY_GRID) {
          mgStop();
        } else if (activeType === EX_TYPE_LAST_DOT) {
          ldStop();
        } else if (activeType === EX_TYPE_FLASH_FOCUS) {
          ffStop();
        } else if (activeType === EX_TYPE_BREATH_VISUAL) {
          bvStop();
        } else if (activeType === EX_TYPE_BODY_SCAN) {
          bsStop();
        } else if (activeType === EX_TYPE_ODD_SPOT) {
          osStop(true);
        }
      });
    }
  }

  // ==============================
  // 8) التهيئة عند تحميل الصفحة
  // ==============================
  document.addEventListener("DOMContentLoaded", () => {
    renderExerciseList();
    initDurationChips();
    initButtons();

    if (exercises.length > 0) {
      selectExercise(exercises[0].id);
    }
  });
})();

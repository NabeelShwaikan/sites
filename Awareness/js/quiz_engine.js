(function () {
  // نتأكد أن بيانات الاختبار موجودة
  if (!window.QUIZ_CONFIG || !window.QUESTIONS) {
    console.error("QUIZ_CONFIG or QUESTIONS not defined for this quiz.");
    return;
  }

  const CONFIG = window.QUIZ_CONFIG;
  const QUESTIONS = window.QUESTIONS;
  const AXES = CONFIG.axes || [];
  const TOTAL_QUESTIONS = QUESTIONS.length;
  const ATTEMPT_KEY = "quiz_attempts_" + (CONFIG.id || "generic");

  function scoreToLevel(score, total) {
    if (total <= 0) return { label: "غير محدد", icon: "❔" };
    const ratio = score / total;
    if (ratio < 0.5) return { label: "تحتاج وعي", icon: "⚠️" };
    if (ratio < 0.7) return { label: "مقبول", icon: "🙂" };
    if (ratio < 0.9) return { label: "واعي", icon: "🔵" };
    return { label: "واعي جدًا", icon: "🌟" };
  }

  function getAttempts() {
    const raw = localStorage.getItem(ATTEMPT_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return isNaN(n) ? 0 : n;
  }

  function incrementAttempts() {
    const n = getAttempts() + 1;
    localStorage.setItem(ATTEMPT_KEY, String(n));
    return n;
  }

  function axisName(id) {
    const a = AXES.find((x) => x.id === id);
    return a ? a.name : id;
  }

  let currentIndex = -1; // -1 = شاشة المقدمة
  let answers = [];

  function updateProgress() {
    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    if (!fill || !label) return;

    if (currentIndex < 0) {
      fill.style.width = "0%";
      label.textContent = "لم يبدأ الاختبار بعد";
      return;
    }
    if (currentIndex >= TOTAL_QUESTIONS) {
      fill.style.width = "100%";
      label.textContent = "تم إكمال جميع الأسئلة";
      return;
    }
    const ratio = currentIndex / TOTAL_QUESTIONS;
    fill.style.width = (ratio * 100).toFixed(0) + "%";
    label.textContent = `السؤال ${currentIndex + 1} من ${TOTAL_QUESTIONS}`;
  }

  function renderIntro() {
    const main = document.getElementById("quizMain");
    if (!main) return;

    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    if (fill && label) {
      fill.style.width = "0%";
      label.textContent = 'اضغط على "ابدأ الاختبار" للبدء';
    }

    const title = CONFIG.title || "اختبار الوعي المعرفي";
    const ageRange = CONFIG.ageRange || "غير محدد";
    const introText =
      CONFIG.introText ||
      "هذا الاختبار يساعدك على اكتشاف مستوى وعيك في هذا المجال من خلال مواقف يومية بسيطة.";

    main.innerHTML = `
      <section class="quiz-card">
        <div class="quiz-meta">
          <span>${title}</span>
          <span>الأعمار: ${ageRange}</span>
          <span>عدد الأسئلة: ${TOTAL_QUESTIONS} سؤالًا</span>
        </div>
        <h2 class="quiz-question-text">مرحبًا بك في ${title}</h2>
        <p style="font-size:0.9rem; margin:0.2rem 0 0.4rem;">
          ${introText}
        </p>
        <ul style="font-size:0.85rem; margin:0.3rem 0 0.4rem; padding-right:1.1rem;">
          <li>الأسئلة قصيرة ومباشرة، ولا يوجد وقت محدد للإجابة.</li>
          <li>لا يمكنك الرجوع للسؤال السابق بعد الانتقال، لأننا نقيس ردّة فعلك الأولى.</li>
          <li>في النهاية ستحصل على تحليل للمحاور مع نصائح لتحسين وعيك في هذا المجال.</li>
        </ul>
        <p style="font-size:0.82rem; color:var(--muted); margin:0.35rem 0 0.6rem;">
          متوسط الوقت المتوقع: من ٥ إلى ٧ دقائق.
        </p>
        <div class="quiz-actions">
          <button class="primary-btn" type="button" id="startQuizBtn">ابدأ الاختبار الآن</button>
        </div>
      </section>
    `;

    const btn = document.getElementById("startQuizBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        answers = new Array(TOTAL_QUESTIONS).fill(null);
        currentIndex = 0;
        renderQuestion(true);
      });
    }
  }

  function renderQuestion(initial) {
    const main = document.getElementById("quizMain");
    if (!main) return;

    if (currentIndex < 0) {
      renderIntro();
      return;
    }
    if (currentIndex >= TOTAL_QUESTIONS) {
      renderResults();
      return;
    }

    const q = QUESTIONS[currentIndex];
    updateProgress();

    const existing = main.querySelector(".quiz-card");
    if (existing && !initial) {
      existing.classList.add("fade-out");
      setTimeout(doRender, 180);
    } else {
      doRender();
    }

    function doRender() {
      const selectedIndex = answers[currentIndex];

      let optionsHTML = "";
      q.options.forEach((opt, idx) => {
        const selectedClass = selectedIndex === idx ? " selected" : "";
        optionsHTML += `
          <button type="button" class="option-btn${selectedClass}" data-index="${idx}">
            <span class="option-label">${opt}</span>
            <span class="option-indicator"></span>
          </button>
        `;
      });

      main.innerHTML = `
        <section class="quiz-card fade-in">
          <div class="quiz-meta">
            <span>المحور: ${axisName(q.axis)}</span>
            <span>نوع السؤال: ${
              q.type === "tf" ? "صح / خطأ" : "اختيار من متعدد"
            }</span>
          </div>
          <p class="quiz-question-text">${q.text}</p>
          <div class="options-list">
            ${optionsHTML}
          </div>
          <div class="quiz-actions">
            <button class="primary-btn" type="button" id="nextBtn" disabled>
              ${
                currentIndex === TOTAL_QUESTIONS - 1
                  ? "إنهاء الاختبار"
                  : "السؤال التالي"
              }
            </button>
          </div>
        </section>
      `;

      const optionButtons = Array.from(
        main.querySelectorAll(".option-btn")
      );
      const nextBtn = document.getElementById("nextBtn");

      optionButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const idx = parseInt(btn.getAttribute("data-index"), 10);
          answers[currentIndex] = idx;
          optionButtons.forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          if (nextBtn) nextBtn.disabled = false;
        });
      });

      if (selectedIndex != null && selectedIndex >= 0) {
        const pre = optionButtons.find(
          (b) => parseInt(b.getAttribute("data-index"), 10) === selectedIndex
        );
        if (pre && nextBtn) {
          pre.classList.add("selected");
          nextBtn.disabled = false;
        }
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          currentIndex++;
          if (currentIndex > TOTAL_QUESTIONS) currentIndex = TOTAL_QUESTIONS;
          renderQuestion(false);
        });
      }
    }
  }

  function computeResults() {
    let correctCount = 0;
    const axisStats = {};
    AXES.forEach((a) => {
      axisStats[a.id] = { correct: 0, total: 0 };
    });

    const mistakes = [];

    QUESTIONS.forEach((q, idx) => {
      const userIndex = answers[idx];
      const isCorrect = userIndex === q.correctIndex;
      axisStats[q.axis].total += 1;
      if (isCorrect) {
        axisStats[q.axis].correct += 1;
        correctCount++;
      } else {
        mistakes.push({
          question: q.text,
          userAnswer:
            userIndex != null ? q.options[userIndex] : "لم يتم اختيار إجابة",
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
          tip: q.tip,
          axis: q.axis,
        });
      }
    });

    const overallLevel = scoreToLevel(correctCount, TOTAL_QUESTIONS);
    return { correctCount, total: TOTAL_QUESTIONS, axisStats, mistakes, overallLevel };
  }

  function renderResults() {
    const main = document.getElementById("quizMain");
    if (!main) return;

    const { correctCount, total, axisStats, mistakes, overallLevel } =
      computeResults();
    const attempts = incrementAttempts();
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    let axisHTML = "";
    AXES.forEach((axis) => {
      const s = axisStats[axis.id];
      const c = s.correct;
      const t = s.total || 1;
      const ratio = c / t;
      const pct = Math.round(ratio * 100);
      const level = scoreToLevel(c, t);
      axisHTML += `
        <div class="axis-item">
          <div class="axis-header">
            <span class="axis-name">${axis.name}</span>
            <span class="axis-value">${pct}% — ${level.icon} ${level.label}</span>
          </div>
          <div class="axis-track">
            <div class="axis-fill" style="width:${pct}%;"></div>
          </div>
          <div class="axis-label">${c} من ${t} إجابات صحيحة في هذا المحور</div>
        </div>
      `;
    });

    let mistakesHTML = "";
    if (mistakes.length === 0) {
      mistakesHTML = `
        <p>رائع! لم تُسجّل أي إجابات خاطئة في هذا الاختبار. استمر على هذا الوعي 👏</p>
      `;
    } else {
      mistakesHTML = `
        <div class="mistakes-list">
          ${mistakes
            .map(
              (m) => `
            <article class="mistake-card">
              <div class="mistake-q">${m.question}</div>
              <div class="mistake-your"><span class="mistake-label">إجابتك:</span> ${m.userAnswer}</div>
              <div class="mistake-correct"><span class="mistake-label">الإجابة الصحيحة:</span> ${m.correctAnswer}</div>
              <div class="mistake-explain"><span class="mistake-label">التفسير:</span> ${m.explanation}</div>
              <div class="mistake-tip"><span class="mistake-label">نصيحة سلوكية:</span> ${m.tip}</div>
            </article>
          `
            )
            .join("")}
        </div>
      `;
    }

    const resources = CONFIG.resources || [];

    main.innerHTML = `
      <section class="result-summary-card">
        <div class="result-main-line">
          <div class="result-score">
            نتيجتك: ${correctCount} من ${total} (${percent}%)
          </div>
          <div class="result-level">
            <span>${overallLevel.icon}</span>
            <span>مستواك: ${overallLevel.label}</span>
            <span class="result-level-badge">محاولتك رقم ${attempts}</span>
          </div>
        </div>
        <div class="result-sub-line">
          <span>${CONFIG.summaryLine1 || "هذا الاختبار يقيس وعيك في هذا المجال من خلال مواقف يومية."}</span>
          <span>${CONFIG.summaryLine2 || "يمكنك إعادة الاختبار لاحقًا لملاحظة تحسن وعيك."}</span>
        </div>
      </section>

      <section class="axis-section">
        <h2>خريطة محاور الوعي</h2>
        <p>يوضح كل شريط مستوى وعيك في محور محدد. ركّز على المحاور ذات النسبة الأقل لتحسين وعيك.</p>
        <div class="axis-list">
          ${axisHTML}
        </div>
      </section>

      <section class="mistakes-section">
        <h2>مراجعة الإجابات غير الصحيحة</h2>
        <p>اطّلع على الأسئلة التي لم تُجب عنها بشكل صحيح، مع تفسير ونصيحة سلوكية لكل حالة.</p>
        ${mistakesHTML}
      </section>

      <section class="resources-section">
        <h2>مصادر مقترحة للتعلم الذاتي</h2>
        <p>${CONFIG.resourcesIntro || "مصادر اختيارية تساعدك على تعميق فهم مفاهيم هذا المجال."}</p>
        <ul class="resources-list">
          ${
            resources.length
              ? resources.map((r) => `<li>🔹 ${r}</li>`).join("")
              : "<li>🔹 ابحث عن مواد توعوية موثوقة في هذا المجال باللغة التي تفضّلها.</li>"
          }
        </ul>
      </section>

      <div class="result-actions">
        <button class="primary-btn" type="button" id="retryBtn">إعادة الاختبار</button>
      </div>
    `;

    const retryBtn = document.getElementById("retryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        answers = new Array(TOTAL_QUESTIONS).fill(null);
        currentIndex = 0;
        renderQuestion(true);
      });
    }

    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    if (fill && label) {
      fill.style.width = "100%";
      label.textContent = "تم إكمال جميع الأسئلة";
    }
  }

  function init() {
    renderIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

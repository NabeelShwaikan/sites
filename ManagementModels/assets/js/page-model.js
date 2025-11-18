let model = null;
let sectionsItems = {}; // { key: [ {text, weight} ] }

function initModelPage() {
  const body = document.body;
  const currentModelId = body.dataset.modelId;

  if (typeof MODELS === "undefined") {
    document.getElementById("model-info").innerHTML = "<p>لم يتم تحميل تعريف النماذج (MODELS).</p>";
    return;
  }

  model = MODELS.find(m => m.id === currentModelId);

  const infoEl = document.getElementById("model-info");
  const inputEl = document.getElementById("input-area");
  const analysisEl = document.getElementById("analysis-area");
  const actionsEl = document.getElementById("actions");

  if (!model) {
    infoEl.innerHTML = "<p>النموذج غير موجود.</p>";
    return;
  }

  // معلومات النموذج
  infoEl.innerHTML = `
    <h1>${model.name_ar}</h1>
    <h2 class="sub-en">${model.name_en || ""}</h2>
    <p>${model.desc || ""}</p>
    ${model.serves ? `<p><strong>لمن يفيد؟</strong> ${model.serves}</p>` : ""}
    ${model.when ? `<p><strong>متى يُستخدم؟</strong> ${model.when}</p>` : ""}
    ${model.decisionLogic ? `<p><strong>آلية اتخاذ القرار:</strong> ${model.decisionLogic}</p>` : ""}
  `;

  // منطقة الإدخال: أولا عنوان المشكلة / القرار، ثم الأقسام
  sectionsItems = {};
  inputEl.innerHTML = `
    <div class="problem-title-block">
      <label for="problem-title">عنوان القرار / المشكلة</label>
      <input id="problem-title" type="text" placeholder="مثال: فتح فرع جديد في المدينة X أو اعتماد نظام جديد في القسم">
    </div>
  `;

  inputEl.innerHTML += model.sections.map(sec => {
    sectionsItems[sec.key] = [];
    return `
      <div class="section-block" data-section="${sec.key}">
        <h3>
          ${sec.label}
          ${sec.positive
            ? '<span class="badge-positive">عامل/جانب داعم</span>'
            : '<span class="badge-negative">عامل/جانب معطِّل أو يحتاج معالجة</span>'}
        </h3>
        <textarea class="bulk-input" placeholder="${sec.placeholder || ""}"></textarea>
        <button type="button" onclick="convertBulkToItems('${sec.key}')">تحويل النقاط إلى قائمة</button>
        <div class="section-items" id="items-${sec.key}"></div>
      </div>
    `;
  }).join("");

  // منطقة التحليل (اختيار ذكي / يدوي)
  analysisEl.innerHTML = `
    <h3>كيف تفضّل معالجة النتائج؟</h3>
    <label>
      <input type="radio" name="analysis-mode" value="auto" checked>
      تحليل ذكي تلقائي (يعتمد على الأوزان ويولّد توصية مبدئية + عرض بصري)
    </label><br>
    <label>
      <input type="radio" name="analysis-mode" value="manual">
      أُفضّل أن أكتب تحليلي واستنتاجي بنفسي
    </label>
    <div id="manual-box" style="display:none; margin-top:10px;">
      <textarea id="manual-text" placeholder="اكتب تحليلك النهائي واستنتاجك هنا..."></textarea>
    </div>
    <div id="analysis-result" class="analysis-summary" style="display:none;"></div>
  `;

  document.querySelectorAll('input[name="analysis-mode"]').forEach(r => {
    r.addEventListener('change', () => {
      const manual = document.querySelector('input[name="analysis-mode"]:checked').value === "manual";
      document.getElementById('manual-box').style.display = manual ? 'block' : 'none';
    });
  });

  // شريط الأزرار: زر رئيسي للتحليل + قائمة منسدلة للحفظ/التصدير + input مخفي لاستيراد JSON
  actionsEl.innerHTML = `
    <div class="actions-bar">
      <button type="button" onclick="runAnalysis()">تنفيذ التحليل</button>

      <select id="io-action">
        <option value="">اختر إجراء حفظ/استيراد/تصدير...</option>
        <option value="save">حفظ في المتصفح (الجهاز الحالي)</option>
        <option value="load">استيراد من المتصفح (الجهاز الحالي)</option>
        <option value="import_json">استيراد من ملف JSON</option>
        <option value="json">تصدير JSON (يمكن نقله لأي جهاز)</option>
        <option value="txt">تصدير TXT</option>
        <option value="pdf">تصدير PDF / طباعة</option>
      </select>

      <button type="button" onclick="runIOAction()">تنفيذ</button>

      <input type="file" id="json-file-input" accept="application/json" style="display:none" />
    </div>
  `;

  const fileInput = document.getElementById('json-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleJSONFileImport);
  }

  // إنشاء المودال (النافذة المنبثقة) للتحليل الذكي إذا لم يكن موجوداً
  ensureAnalysisModal();
}

function convertBulkToItems(sectionKey) {
  const block = document.querySelector(`.section-block[data-section="${sectionKey}"]`);
  const textarea = block.querySelector('.bulk-input');
  const lines = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
  textarea.value = "";

  lines.forEach(line => {
    const item = { text: line, weight: 3 }; // افتراضي 3 نجوم
    sectionsItems[sectionKey].push(item);
  });

  renderSectionItems(sectionKey);
}

function renderSectionItems(sectionKey) {
  const container = document.getElementById(`items-${sectionKey}`);
  container.innerHTML = "";
  (sectionsItems[sectionKey] || []).forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'section-item';
    row.innerHTML = `
      <span class="text">${item.text}</span>
      <select onchange="changeWeight('${sectionKey}', ${index}, this.value)">
        ${[1,2,3,4,5].map(v => `
          <option value="${v}" ${v === item.weight ? "selected" : ""}>
            ${"★".repeat(v)}${"☆".repeat(5-v)}
          </option>`).join("")}
      </select>
      <button type="button" onclick="removeItem('${sectionKey}', ${index})">حذف</button>
    `;
    container.appendChild(row);
  });
}

function changeWeight(sectionKey, index, value) {
  sectionsItems[sectionKey][index].weight = parseInt(value, 10);
}

function removeItem(sectionKey, index) {
  sectionsItems[sectionKey].splice(index, 1);
  renderSectionItems(sectionKey);
}

function runAnalysis() {
  const mode = document.querySelector('input[name="analysis-mode"]:checked').value;
  const resultBox = document.getElementById('analysis-result');
  resultBox.style.display = "block";

  let posWeight = 0;
  let negWeight = 0;

  model.sections.forEach(sec => {
    const items = sectionsItems[sec.key] || [];
    items.forEach(it => {
      if (sec.positive) posWeight += it.weight;
      else negWeight += it.weight;
    });
  });

  let summary = "";
  summary += `إجمالي وزن الجوانب الداعمة/الإيجابية: ${posWeight}\n`;
  summary += `إجمالي وزن الجوانب المعطِّلة/السلبية: ${negWeight}\n\n`;

  if (posWeight === 0 && negWeight === 0) {
    resultBox.innerText = "لم يتم إدخال أي نقاط بعد.";
    // في هذه الحالة لا حاجة لفتح مودال
    return;
  }

  // وضع التحليل اليدوي: يبقى كما هو (لا مودال)
  if (mode === "manual") {
    summary += "تم تلخيص الأوزان. اكتب تحليلك واستنتاجك في الحقل المخصص.\n";
    resultBox.innerText = summary;
    return;
  }

  // تحليل ذكي (مع توصية)
  let msg = "";
  const diff = posWeight - negWeight;

  if (model.id === "cba") {
    if (diff >= 5) {
      msg = "الفوائد أعلى بكثير من التكاليف. القرار يبدو مجديًا من ناحية الجدوى، مع ضرورة الانتباه للتكاليف ذات الوزن الأعلى.";
    } else if (diff >= 1) {
      msg = "الفوائد أعلى من التكاليف بفارق بسيط. القرار ممكن، مع مراجعة التكاليف وتقليل غير الضروري منها.";
    } else if (diff === 0) {
      msg = "توازن بين الفوائد والتكاليف، ما يعني أن القرار حساس وقد يحتاج تحسين الفوائد أو خفض التكاليف قبل التنفيذ.";
    } else if (diff <= -5) {
      msg = "التكاليف تفوق الفوائد بشكل واضح. في وضعه الحالي، القرار غير مجدٍ ماليًا أو جهديًا، يُفضّل إعادة النظر.";
    } else {
      msg = "التكاليف أعلى من الفوائد بفارق بسيط. يمكن التفكير في القرار بشرط إيجاد طرق عملية لتقليل التكاليف أو زيادة الفوائد.";
    }
  } else {
    if (diff >= 5) {
      msg = "العوامل أو الجوانب الداعمة أقوى بكثير من الجوانب المعطِّلة. يميل القرار إلى الإيجابية مع الانتباه للنقاط السلبية ذات الوزن الأعلى.";
    } else if (diff >= 1) {
      msg = "العوامل الداعمة أعلى من المعطِّلة، لكن الفارق ليس كبيرًا. القرار ممكن مع معالجة الجوانب السلبية ذات الوزن العالي.";
    } else if (diff === 0) {
      msg = "هناك توازن بين الجوانب الداعمة والمعطِّلة، ما يعني أن القرار غير محسوم ويحتاج مزيدًا من الدراسة أو التعديل.";
    } else if (diff <= -5) {
      msg = "الجوانب المعطِّلة أو السلبية تفوق الداعمة بشكل واضح. القرار في وضعه الحالي غير مناسب، يُفضّل إعادة تصميم الفكرة أو تقوية الموارد.";
    } else {
      msg = "الجوانب السلبية أعلى من الإيجابية بفارق بسيط. يُنصح بتقوية نقاط القوة أو تقليل التكاليف/المخاطر قبل اتخاذ القرار.";
    }
  }

  const fullText = summary + msg;
  resultBox.innerText = fullText;

  // فتح المودال مع رسم دائري
  openAnalysisModal(summary, msg, posWeight, negWeight);
}

// تنفيذ إجراء الحفظ/الاستيراد/التصدير من القائمة المنسدلة
function runIOAction() {
  const select = document.getElementById('io-action');
  const value = select.value;
  if (!value) return;

  if (value === "save") {
    saveState();
  } else if (value === "load") {
    loadState();
  } else if (value === "json") {
    exportJSON();
  } else if (value === "txt") {
    exportTXT();
  } else if (value === "pdf") {
    exportPDF();
  } else if (value === "import_json") {
    const fileInput = document.getElementById('json-file-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  // إعادة القائمة للحالة الافتراضية
  select.value = "";
}

// استيراد من ملف JSON
function handleJSONFileImport(event) {
  const file = event.target.files[0];
  if (!file) {
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      if (data.modelId && data.modelId !== model.id) {
        alert("ملف JSON يخص نموذجًا مختلفًا عن النموذج الحالي.");
        event.target.value = "";
        return;
      }

      const titleEl = document.getElementById('problem-title');
      if (titleEl && typeof data.problemTitle === "string") {
        titleEl.value = data.problemTitle;
      }

      sectionsItems = data.sectionsItems || {};

      model.sections.forEach(sec => {
        if (!sectionsItems[sec.key]) sectionsItems[sec.key] = [];
        renderSectionItems(sec.key);
      });

      alert("تم استيراد البيانات من ملف JSON بنجاح.");
    } catch (err) {
      console.error(err);
      alert("تعذر قراءة ملف JSON. تأكد أن الملف صادر من نفس الأداة.");
    } finally {
      event.target.value = "";
    }
  };

  reader.readAsText(file, "utf-8");
}

/* ========= المودال (النافذة المنبثقة) + الرسم الدائري ========= */

function ensureAnalysisModal() {
  if (document.getElementById('analysis-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'analysis-modal';
  modal.className = 'analysis-modal-backdrop';
  modal.innerHTML = `
    <div class="analysis-modal-dialog">
      <div class="analysis-modal-header">
        <h3>ملخص التحليل الذكي</h3>
        <button type="button" class="close-btn" onclick="closeAnalysisModal()">✕</button>
      </div>
      <div class="analysis-modal-body">
        <div class="analysis-modal-text">
          <pre id="modal-summary"></pre>
          <p id="modal-message" class="modal-message"></p>
        </div>
        <div class="analysis-modal-chart">
          <div id="analysis-pie" class="analysis-pie"></div>
          <div class="chart-legend">
            <span><span class="legend-color legend-positive"></span> الجوانب الداعمة / الإيجابية</span>
            <span><span class="legend-color legend-negative"></span> الجوانب المعطِّلة / السلبية</span>
          </div>
          <div class="chart-values">
            <span id="chart-pos"></span>
            <span id="chart-neg"></span>
          </div>
        </div>
      </div>
      <div class="analysis-modal-footer">
        <button type="button" onclick="closeAnalysisModal()">إغلاق</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target.id === 'analysis-modal') {
      closeAnalysisModal();
    }
  });
}

function openAnalysisModal(summaryText, msg, posWeight, negWeight) {
  const modal = document.getElementById('analysis-modal');
  if (!modal) return;

  const total = posWeight + negWeight;
  let posPercent = 0;
  let negPercent = 0;

  if (total > 0) {
    posPercent = Math.round((posWeight / total) * 100);
    negPercent = 100 - posPercent;
  }

  const summaryEl = document.getElementById('modal-summary');
  const msgEl = document.getElementById('modal-message');
  const pieEl = document.getElementById('analysis-pie');
  const posLabel = document.getElementById('chart-pos');
  const negLabel = document.getElementById('chart-neg');

  if (summaryEl) summaryEl.textContent = summaryText.trim();
  if (msgEl) msgEl.textContent = msg;
  if (posLabel) posLabel.textContent = `الإيجابي: ${posWeight} (${posPercent}٪)`;
  if (negLabel) negLabel.textContent = `السلبي: ${negWeight} (${negPercent}٪)`;

if (pieEl) {
  pieEl.style.background = total > 0
    ? `conic-gradient(#0ea5e9 0 ${posPercent}%, #ef4444 ${posPercent}% 100%)`
    : `radial-gradient(circle, rgba(148,163,184,0.5), transparent 60%)`;

  }

  modal.classList.add('show');
}

function closeAnalysisModal() {
  const modal = document.getElementById('analysis-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// تعريض الدوال للاستخدام من الـ HTML
window.convertBulkToItems = convertBulkToItems;
window.changeWeight = changeWeight;
window.removeItem = removeItem;
window.runAnalysis = runAnalysis;
window.runIOAction = runIOAction;
window.handleJSONFileImport = handleJSONFileImport;
window.closeAnalysisModal = closeAnalysisModal;

document.addEventListener('DOMContentLoaded', initModelPage);

function getProblemTitle() {
  const el = document.getElementById('problem-title');
  return el ? el.value.trim() : "";
}

function exportJSON() {
  const payload = {
    modelId: model.id,
    modelNameAr: model.name_ar,
    modelNameEn: model.name_en,
    problemTitle: getProblemTitle(),
    sectionsItems
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${model.id}-analysis.json`;
  a.click();
}

function exportTXT() {
  let txt = `${model.name_ar} / ${model.name_en}\n\n`;
  const title = getProblemTitle();
  if (title) {
    txt += `عنوان القرار/المشكلة: ${title}\n\n`;
  }

  model.sections.forEach(sec => {
    txt += `== ${sec.label} ==\n`;
    (sectionsItems[sec.key] || []).forEach(it => {
      txt += `- (${it.weight}/5) ${it.text}\n`;
    });
    txt += "\n";
  });

  const res = document.getElementById('analysis-result');
  if (res && res.style.display !== "none" && res.innerText.trim()) {
    txt += "ملخص التحليل:\n";
    txt += res.innerText + "\n\n";
  }

  const manualText = document.getElementById('manual-text');
  if (manualText && manualText.value.trim()) {
    txt += "تحليل المستخدم:\n";
    txt += manualText.value + "\n";
  }

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${model.id}-analysis.txt`;
  a.click();
}

function exportPDF() {
  const title = getProblemTitle();

  let html = `
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${model.name_ar}</title>
      <style>
        body { font-family: Tahoma, sans-serif; padding:20px; line-height:1.7; direction:rtl; }
        h1,h2 { margin:0 0 8px; }
        h3 { margin:12px 0 4px; }
        .sec { margin-bottom:12px; }
        ul { margin: 4px 0 0 0; padding-right: 18px; }
        li { margin-bottom: 2px; }
        pre { white-space: pre-wrap; background:#f3f4f6; padding:8px; border-radius:6px; }
        .title-line { margin: 8px 0 16px; font-weight:bold; }
      </style>
    </head>
    <body>
      <h1>${model.name_ar}</h1>
      <h2>${model.name_en || ""}</h2>
      <p>${model.desc || ""}</p>
  `;

  if (title) {
    html += `<p class="title-line">عنوان القرار/المشكلة: ${title}</p>`;
  }

  model.sections.forEach(sec => {
    html += `<div class="sec"><h3>${sec.label}</h3><ul>`;
    (sectionsItems[sec.key] || []).forEach(it => {
      html += `<li>(${it.weight}/5) ${it.text}</li>`;
    });
    html += `</ul></div>`;
  });

  const res = document.getElementById('analysis-result');
  if (res && res.style.display !== "none" && res.innerText.trim()) {
    html += `<h3>ملخص التحليل</h3><pre>${res.innerText}</pre>`;
  }

  const manualText = document.getElementById('manual-text');
  if (manualText && manualText.value.trim()) {
    html += `<h3>تحليل المستخدم</h3><pre>${manualText.value}</pre>`;
  }

  html += `</body></html>`;

  const w = window.open("", "_blank");
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.print();
}

window.exportJSON = exportJSON;
window.exportTXT = exportTXT;
window.exportPDF = exportPDF;

function saveState() {
  const titleEl = document.getElementById('problem-title');
  const payload = {
    modelId: model.id,
    problemTitle: titleEl ? titleEl.value : "",
    sectionsItems
  };
  localStorage.setItem("decision-tool-" + model.id, JSON.stringify(payload));
  alert("تم حفظ التحليل في هذا الجهاز.");
}

function loadState() {
  const raw = localStorage.getItem("decision-tool-" + model.id);
  if (!raw) {
    alert("لا يوجد حفظ سابق لهذا النموذج.");
    return;
  }
  const parsed = JSON.parse(raw);
  if (parsed.modelId !== model.id) {
    alert("البيانات لا تطابق هذا النموذج.");
    return;
  }
  sectionsItems = parsed.sectionsItems || {};

  const titleEl = document.getElementById('problem-title');
  if (titleEl && typeof parsed.problemTitle === "string") {
    titleEl.value = parsed.problemTitle;
  }

  model.sections.forEach(sec => {
    if (!sectionsItems[sec.key]) sectionsItems[sec.key] = [];
    renderSectionItems(sec.key);
  });
  alert("تم الاستيراد من الحفظ.");
}

window.saveState = saveState;
window.loadState = loadState;

window.Masar = window.Masar || {};
Masar.UI = Masar.UI || {};

Masar.UI.Updater = (function(){
  function open(){ document.getElementById('updaterModal').classList.add('open'); }
  function close(){ document.getElementById('updaterModal').classList.remove('open'); }

  function renderReport(result){
    const area = document.getElementById('updaterReport');
    const valid = result.validation.isValid;
    const dateChanges = Object.keys(result.sourceDates.changed || {});
    const errors = [];
    if(result.validation.duplicates.symbols.length) errors.push('رموز مكررة: ' + result.validation.duplicates.symbols.join('، '));
    if(result.validation.missingFields.length) errors.push('حقول ناقصة: ' + result.validation.missingFields.length);
    if(result.validation.invalidApprovals.length) errors.push('مشاكل في الجهات: ' + result.validation.invalidApprovals.length);
    if(result.validation.emptySectors.length) errors.push('قطاعات فارغة: ' + result.validation.emptySectors.length);

    const dateHtml = dateChanges.length
      ? dateChanges.map(key => {
          const d = result.sourceDates.changed[key];
          return `<div class="diffItem">${Masar.Services.DataService.sourceName(key)}: الحالي ${d.current || 'غير محدد'} · المصدر ${d.incoming}</div>`;
        }).join('')
      : '<div class="diffItem">لا توجد فروقات في تواريخ المصادر المستخرجة.</div>';

    const changesPreview = result.changed.slice(0,12).map(item => {
      const beforeCount = Masar.Services.DataService.approvalCount(item.before);
      const afterCount = Masar.Services.DataService.approvalCount(item.after);
      return `<div class="diffItem">${item.after.symbol} - ${item.after.name}<br>قبل: ${beforeCount}/3 · بعد: ${afterCount}/3</div>`;
    }).join('') || '<div class="diffItem">لا يوجد</div>';

    area.innerHTML = `
      <div class="reportGrid">
        <div class="reportCard"><b>${result.total}</b><span>سجل بعد التحليل</span></div>
        <div class="reportCard"><b>${result.added.length}</b><span>إضافة</span></div>
        <div class="reportCard"><b>${result.removed.length}</b><span>حذف</span></div>
        <div class="reportCard"><b>${result.changed.length}</b><span>تغييرات</span></div>
      </div>
      ${valid ? '<div class="successText">الفحص ناجح. يستطيع الأدمن توليد ملف البيانات الجديد بعد المراجعة.</div>' : '<div class="errorText">' + errors.join('<br>') + '</div>'}
      <div class="diffList">
        <div class="diffBox"><h3>تواريخ المصادر</h3>${dateHtml}</div>
        <div class="diffBox"><h3>معاينة التغييرات</h3>${changesPreview}</div>
      </div>
    `;

    document.getElementById('generateUpdateBtn').disabled = !valid || !result.total;
    Masar.UI.StatusPanel.updateAfterCheck(result.sourceDates, valid);
  }

  function injectModal(){
    if(document.getElementById('updaterModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="updaterBackdrop" id="updaterModal" role="dialog" aria-modal="true">
        <div class="updaterModal">
          <div class="updaterHead">
            <div>
              <h2>فحص حالة التحديث</h2>
              <p>ألصق بيانات المصدر الجديدة. يستطيع أي مستخدم الفحص والمقارنة، أما اعتماد التحديث الرسمي واستبدال الملفات فهو مسؤولية مدير الصفحة.</p>
            </div>
            <button class="updaterClose" id="updaterCloseBtn" type="button">×</button>
          </div>
          <textarea class="updaterTextarea" id="updaterInput" placeholder="الصق بيانات أرقام هنا..."></textarea>
          <div class="updaterActions">
            <button class="btn" id="analyzeUpdateBtn" type="button">تحليل ومقارنة</button>
            <button class="btn" id="generateUpdateBtn" type="button" disabled>توليد ملف للأدمن</button>
          </div>
          <div class="updaterReport" id="updaterReport">لم يتم تحليل بيانات بعد.</div>
        </div>
      </div>
    `);
  }

  function addButton(){
    const tools = document.querySelector('.tools');
    if(!tools || document.getElementById('openUpdaterBtn')) return;
    tools.insertAdjacentHTML('afterbegin', '<button class="btn" id="openUpdaterBtn" type="button">فحص حالة التحديث</button>');
  }

  function init(){
    injectModal();
    addButton();
    document.getElementById('openUpdaterBtn')?.addEventListener('click', open);
    document.getElementById('updaterCloseBtn')?.addEventListener('click', close);
    document.getElementById('updaterModal')?.addEventListener('click', (e) => { if(e.target.id === 'updaterModal') close(); });
    document.getElementById('analyzeUpdateBtn')?.addEventListener('click', () => Masar.Features.Updater.analyze());
    document.getElementById('generateUpdateBtn')?.addEventListener('click', () => Masar.Features.Updater.generateDataFile());
  }

  return { init, renderReport, open, close };
})();

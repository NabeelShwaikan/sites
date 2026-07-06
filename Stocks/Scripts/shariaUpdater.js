window.ShariaUpdater = (function(){
  let parsedRows = [];
  let comparison = null;

  function open(){ document.getElementById('updaterModal').classList.add('open'); }
  function close(){ document.getElementById('updaterModal').classList.remove('open'); }

  function normalizeLine(line){
    return line.replace(/\t+/g,'|').replace(/\s{2,}/g,' ').trim();
  }

  function parsePastedText(raw){
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const rows = [];
    let currentSector = '';

    for(const original of lines){
      const line = normalizeLine(original);
      if(!line) continue;

      // Ignore navigation/source/footer lines
      if(/^(New|ENG|الاشتراك|الدخول|البحث|دليل الشركات|السعودية|الأخبار|المزيد|ملاحظة|الأكثر مشاهدة|تابعونا|Argaam)/i.test(line)) continue;
      if(line.includes('رمز السهم') || line.includes('آخر تحديث') || line.includes('الشركات المتوافقة')) continue;

      const pipeParts = line.split('|').map(x => x.trim()).filter(x => x !== '');
      let symbol='', name='', flags=[];

      if(pipeParts.length >= 3 && /^\d{4}$/.test(pipeParts[0])){
        symbol = pipeParts[0];
        name = pipeParts[1] || '';
        flags = pipeParts.slice(2).map(x => /✔|✓|1|true/i.test(x));
      } else {
        const m = line.match(/^(\d{4})\s+(.+?)\s*([✔✓\s]*)$/);
        if(m){
          symbol = m[1];
          name = m[2].replace(/[✔✓]/g,'').trim();
          const checks = (original.match(/[✔✓]/g) || []).length;
          // This fallback only knows count, not exact columns, so reject later if not structured.
          flags = checks === 3 ? [true,true,true] : checks === 2 ? [true,false,true] : checks === 1 ? [true,false,false] : [false,false,false];
        }
      }

      if(symbol && name){
        rows.push({
          symbol,
          name,
          sector: currentSector || 'غير مصنف',
          approvals: {
            rajhi: !!flags[0],
            osaimi: !!flags[1],
            albilad: !!flags[2]
          }
        });
      } else if(!/\d{4}/.test(line) && line.length < 80 && !/[✔✓]/.test(line)){
        currentSector = line;
      }
    }

    return rows;
  }

  function compareRows(newRows){
    const service = window.ShariaDataService;
    const oldRows = service.all();
    const oldMap = new Map(oldRows.map(stock => [stock.symbol, stock]));
    const newMap = new Map(newRows.map(stock => [stock.symbol, stock]));

    const added = [];
    const removed = [];
    const changed = [];

    newRows.forEach(stock => {
      const old = oldMap.get(stock.symbol);
      if(!old){
        added.push(stock);
        return;
      }

      const keys = service.approvalKeys();
      const approvalChanged = keys.some(key => old.approvals[key] !== stock.approvals[key]);
      const metaChanged = old.name !== stock.name || old.sector !== stock.sector;

      if(approvalChanged || metaChanged){
        changed.push({before:old, after:stock});
      }
    });

    oldRows.forEach(stock => {
      if(!newMap.has(stock.symbol)) removed.push(stock);
    });

    const validation = service.validateData(newRows);
    return {added, removed, changed, validation, total:newRows.length};
  }

  function renderReport(result){
    const area = document.getElementById('updaterReport');
    const valid = result.validation.isValid;
    const errors = [];
    if(result.validation.duplicates.symbols.length) errors.push('رموز مكررة: ' + result.validation.duplicates.symbols.join('، '));
    if(result.validation.missingFields.length) errors.push('حقول ناقصة: ' + result.validation.missingFields.length);
    if(result.validation.invalidApprovals.length) errors.push('مشاكل في الجهات: ' + result.validation.invalidApprovals.length);
    if(result.validation.emptySectors.length) errors.push('قطاعات فارغة: ' + result.validation.emptySectors.length);

    const changesPreview = result.changed.slice(0,12).map(item => {
      const beforeCount = window.ShariaDataService.approvalCount(item.before);
      const afterCount = window.ShariaDataService.approvalCount(item.after);
      return `<div class="diffItem">${item.after.symbol} - ${item.after.name}<br>قبل: ${beforeCount}/3 · بعد: ${afterCount}/3</div>`;
    }).join('') || '<div class="diffItem">لا يوجد</div>';

    area.innerHTML = `
      <div class="reportGrid">
        <div class="reportCard"><b>${result.total}</b><span>سجل بعد التحليل</span></div>
        <div class="reportCard"><b>${result.added.length}</b><span>إضافة</span></div>
        <div class="reportCard"><b>${result.removed.length}</b><span>حذف</span></div>
        <div class="reportCard"><b>${result.changed.length}</b><span>تغييرات</span></div>
      </div>
      ${valid ? '<div class="successText">التحقق ناجح. يمكن توليد ملف البيانات الجديد.</div>' : '<div class="errorText">' + errors.join('<br>') + '</div>'}
      <div class="diffList">
        <div class="diffBox"><h3>معاينة التغييرات</h3>${changesPreview}</div>
      </div>
    `;

    document.getElementById('generateUpdateBtn').disabled = !valid || !result.total;
  }

  function analyze(){
    const raw = document.getElementById('updaterInput').value;
    parsedRows = parsePastedText(raw);
    comparison = compareRows(parsedRows);
    renderReport(comparison);
  }

  function generateDataFile(){
    if(!comparison || !comparison.validation.isValid) return;

    const js = 'window.shariaStocks = ' + JSON.stringify(parsedRows, null, 2) + ';' + '\n';
    const blob = new Blob([js], {type:'text/javascript;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shariaStocks.js';
    link.click();

    const report = {
      generatedAt: new Date().toISOString(),
      total: comparison.total,
      added: comparison.added.map(s => s.symbol),
      removed: comparison.removed.map(s => s.symbol),
      changed: comparison.changed.map(x => x.after.symbol)
    };
    const reportBlob = new Blob([JSON.stringify(report, null, 2)], {type:'application/json;charset=utf-8'});
    const reportLink = document.createElement('a');
    reportLink.href = URL.createObjectURL(reportBlob);
    reportLink.download = 'shariaUpdateReport.json';
    reportLink.click();
  }

  function injectModal(){
    if(document.getElementById('updaterModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="updaterBackdrop" id="updaterModal" role="dialog" aria-modal="true">
        <div class="updaterModal">
          <div class="updaterHead">
            <div>
              <h2>تحديث القائمة</h2>
              <p>ألصق بيانات المصدر الجديدة، ثم اضغط تحليل البيانات. لن يتم تعديل القائمة الأصلية داخل المتصفح؛ سيتم توليد ملف جديد للاستبدال بعد المراجعة.</p>
            </div>
            <button class="updaterClose" id="updaterCloseBtn" type="button">×</button>
          </div>
          <textarea class="updaterTextarea" id="updaterInput" placeholder="الصق بيانات أرقام هنا..."></textarea>
          <div class="updaterActions">
            <button class="btn" id="analyzeUpdateBtn" type="button">تحليل البيانات</button>
            <button class="btn" id="generateUpdateBtn" type="button" disabled>توليد ملف التحديث</button>
          </div>
          <div class="updaterReport" id="updaterReport">لم يتم تحليل بيانات بعد.</div>
        </div>
      </div>
    `);
  }

  function addButton(){
    const tools = document.querySelector('.tools');
    if(!tools || document.getElementById('openUpdaterBtn')) return;
    tools.insertAdjacentHTML('afterbegin', '<button class="btn" id="openUpdaterBtn" type="button">تحديث القائمة</button>');
  }

  function init(){
    injectModal();
    addButton();
    document.getElementById('openUpdaterBtn')?.addEventListener('click', open);
    document.getElementById('updaterCloseBtn')?.addEventListener('click', close);
    document.getElementById('updaterModal')?.addEventListener('click', (e) => { if(e.target.id === 'updaterModal') close(); });
    document.getElementById('analyzeUpdateBtn')?.addEventListener('click', analyze);
    document.getElementById('generateUpdateBtn')?.addEventListener('click', generateDataFile);
  }

  return { init, open, close, parsePastedText, compareRows };
})();

function initUpdater(){
  window.ShariaUpdater.init();
}

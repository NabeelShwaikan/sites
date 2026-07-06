window.Masar = window.Masar || {};
Masar.UI = Masar.UI || {};

Masar.UI.StatusPanel = (function(){
  let status = 'updated';

  function setStatus(newStatus){
    status = newStatus || 'updated';
    const badge = document.getElementById('dataStatusBadge');
    if(!badge) return;
    badge.className = 'dataBadge ' + (status === 'available' ? 'available' : status === 'review' ? 'review' : 'updated');
    badge.textContent = status === 'available' ? 'تحديث متوفر' : status === 'review' ? 'تحتاج مراجعة' : 'محدثة';
  }

  function render(){
    const data = Masar.Services.DataService;
    const meta = data.meta();
    const box = document.getElementById('statusPanel');
    if(!box) return;

    const sources = data.approvalKeys().map(key => {
      return `<span class="sourceDate">${data.sourceName(key)}: ${data.sourceLastUpdate(key) || 'غير محدد'}</span>`;
    }).join('');

    box.innerHTML = `
      <div class="statusCard">
        <div class="statusTitle">إصدار البيانات</div>
        <div class="statusValue">${meta.version || 'غير محدد'}</div>
      </div>
      <div class="statusCard">
        <div class="statusTitle">مصادر البيانات</div>
        <div class="sourceDates">${sources}</div>
      </div>
    `;

    setStatus(meta.status || 'updated');
  }

  function updateAfterCheck(dateComparison, validationOk){
    if(!validationOk){ setStatus('review'); return; }
    const hasDateChanges = dateComparison && Object.keys(dateComparison.changed || {}).length > 0;
    setStatus(hasDateChanges ? 'available' : 'updated');
  }

  return { render, setStatus, updateAfterCheck };
})();

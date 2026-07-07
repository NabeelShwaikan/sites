window.Masar = window.Masar || {};
Masar.UI = Masar.UI || {};

Masar.UI.Table = (function(){
  function approvalRows(stock){
    const data = Masar.Services.DataService;
    return data.approvalKeys().map(key => {
      const approved = stock.approvals[key] === true;
      const date = data.sourceLastUpdate(key);
      return `
        <div class="approvalRow ${approved ? 'approved' : 'notApproved'}">
          <span class="approvalMark">${approved ? '✓' : '×'}</span>
          <span class="approvalName">${data.sourceName(key)}</span>
          <span class="approvalState">${approved ? 'مجازة' : 'غير مجازة'}</span>
          <span class="approvalDate">${date ? 'آخر تحديث: ' + date : 'لا يوجد تاريخ تحديث'}</span>
        </div>`;
    }).join('');
  }

  function render(rows){
    const data = Masar.Services.DataService;
    const body = document.getElementById('body');

    if(!rows.length){
      body.innerHTML = `<div class="emptyState">لا توجد نتائج مطابقة للفلاتر الحالية.</div>`;
    } else {
      body.innerHTML = rows.map((stock, idx) => {
        const count = data.approvalCount(stock);
        const detailsId = `stock-details-${stock.symbol}-${idx}`;

        return `
          <article class="stockCard v3" data-symbol="${stock.symbol}">
            <button class="stockCardHead" type="button" aria-expanded="false" aria-controls="${detailsId}">
              <span class="stockIdentity">
                <span class="stockSymbol">${stock.symbol}</span>
                <span class="stockTitleBlock">
                  <span class="stockName">${stock.name}</span>
                  <span class="stockSubline">
                    <span class="sector">${stock.sector}</span>
                  </span>
                </span>
              </span>
              <span class="stockMeta">
                <span class="pill ${data.pillClass(count)}">${count}/3</span>
                <span class="expandIcon" aria-hidden="true">+</span>
              </span>
            </button>
            <div class="stockDetails" id="${detailsId}" hidden>
              <div class="stockDetailsInner">
                <div class="detailsGrid">
                  <div class="detailBox">
                    <span>رمز السهم</span>
                    <b>${stock.symbol}</b>
                  </div>
                  <div class="detailBox">
                    <span>المجال</span>
                    <b>${stock.sector}</b>
                  </div>
                  <div class="detailBox">
                    <span>ملخص الإجازة</span>
                    <b>${count} من 3 جهات</b>
                  </div>
                </div>
                <div class="approvalList">
                  ${approvalRows(stock)}
                </div>
              </div>
            </div>
          </article>`;
      }).join('');
    }

    document.getElementById('resultLine').textContent =
      'النتائج المعروضة: ' + rows.length + ' من أصل ' + data.all().length + ' شركة/صندوق';
  }

  function openDetails(card, head, details, icon){
    details.hidden = false;
    details.style.height = '0px';
    details.style.opacity = '0';
    details.offsetHeight;
    const targetHeight = details.scrollHeight;
    details.style.height = targetHeight + 'px';
    details.style.opacity = '1';
    head.setAttribute('aria-expanded', 'true');
    card.classList.add('isOpen');
    if(icon) icon.textContent = '−';

    const finish = () => {
      if(card.classList.contains('isOpen')){
        details.style.height = 'auto';
      }
      details.removeEventListener('transitionend', finish);
    };
    details.addEventListener('transitionend', finish);
  }

  function closeDetails(card, head, details, icon){
    details.style.height = details.scrollHeight + 'px';
    details.offsetHeight;
    details.style.height = '0px';
    details.style.opacity = '0';
    head.setAttribute('aria-expanded', 'false');
    card.classList.remove('isOpen');
    if(icon) icon.textContent = '+';

    const finish = () => {
      if(!card.classList.contains('isOpen')){
        details.hidden = true;
      }
      details.removeEventListener('transitionend', finish);
    };
    details.addEventListener('transitionend', finish);
  }

  function initInteractions(){
    document.addEventListener('click', (event) => {
      const head = event.target.closest('.stockCardHead');
      if(!head) return;

      const card = head.closest('.stockCard');
      const details = card.querySelector('.stockDetails');
      const icon = card.querySelector('.expandIcon');
      const isOpen = head.getAttribute('aria-expanded') === 'true';

      if(isOpen){
        closeDetails(card, head, details, icon);
      } else {
        openDetails(card, head, details, icon);
      }
    });
  }

  return { render, initInteractions };
})();

function downloadCSV(){ Masar.Services.ExportService.exportCsv(); }

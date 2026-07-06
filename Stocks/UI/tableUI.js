window.Masar = window.Masar || {};
Masar.UI = Masar.UI || {};

Masar.UI.Table = (function(){
  function render(rows){
    const data = Masar.Services.DataService;
    const body = document.getElementById('body');

    body.innerHTML = rows.map(stock => {
      const count = data.approvalCount(stock);
      const approvalsHtml = count
        ? data.approvalKeys()
            .filter(key => stock.approvals[key] === true)
            .map(key => {
              const date = data.sourceLastUpdate(key);
              const title = date ? `آخر تحديث: ${date}` : '';
              return `<span class="ok" title="${title}">✓ ${data.sourceName(key)}</span>`;
            }).join('')
        : '<span class="none">لا توجد إجازة في الجهات الثلاث</span>';

      return `<tr>
        <td class="sym">${stock.symbol}</td>
        <td>${stock.name}</td>
        <td><span class="sector">${stock.sector}</span></td>
        <td><span class="pill ${data.pillClass(count)}">${count}/3</span></td>
        <td>${approvalsHtml}</td>
      </tr>`;
    }).join('');

    document.getElementById('resultLine').textContent =
      'النتائج المعروضة: ' + rows.length + ' من أصل ' + data.all().length + ' شركة/صندوق';
  }

  return { render };
})();

function downloadCSV(){ Masar.Services.ExportService.exportCsv(); }

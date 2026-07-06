function renderTable(rows){
  const service = window.ShariaDataService;
  const body = document.getElementById('body');

  body.innerHTML = rows.map(stock => {
    const count = service.approvalCount(stock);
    const approvalsHtml = count
      ? service.approvalKeys()
          .filter(key => stock.approvals[key] === true)
          .map(key => {
            const date = service.sourceLastUpdate(key);
            const title = date ? `آخر تحديث: ${date}` : '';
            return `<span class="ok" title="${title}">✓ ${service.sourceName(key)}</span>`;
          }).join('')
      : '<span class="none">لا توجد إجازة في الجهات الثلاث</span>';

    return `<tr>
      <td class="sym">${stock.symbol}</td>
      <td>${stock.name}</td>
      <td><span class="sector">${stock.sector}</span></td>
      <td><span class="pill ${service.pillClass(count)}">${count}/3</span></td>
      <td>${approvalsHtml}</td>
    </tr>`;
  }).join('');

  document.getElementById('resultLine').textContent =
    'النتائج المعروضة: ' + rows.length + ' من أصل ' + service.all().length + ' شركة/صندوق';
}

function downloadCSV(){
  const service = window.ShariaDataService;
  const header = ['رمز السهم','الشركة','المجال','عدد المجيزين','الجهات المجيزة'];
  const rows = service.all().map(stock => [
    stock.symbol,
    stock.name,
    stock.sector,
    service.approvalCount(stock),
    service.approvalNames(stock).join('، ')
  ]);
  const csv = '\ufeff' + [header, ...rows]
    .map(row => row.map(value => '"' + String(value).replaceAll('"','""') + '"').join(','))
    .join('\n');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  link.download = 'sharia_stocks.csv';
  link.click();
}

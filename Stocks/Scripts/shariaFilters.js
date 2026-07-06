function fillSectors(){
  const sectorSelect = document.getElementById('sector');
  const current = sectorSelect.value;
  const sectors = window.ShariaDataService.sectors();
  sectorSelect.innerHTML =
    '<option value="">كل المجالات</option>' +
    sectors.map(sector => `<option value="${sector}" ${sector === current ? 'selected' : ''}>${sector}</option>`).join('');
}

function getFilteredRows(){
  const app = window.MasarSharia;
  const service = window.ShariaDataService;
  const query = document.getElementById('q').value.trim();
  const sector = document.getElementById('sector').value;
  const approvalCount = document.getElementById('count').value;
  const authority = document.getElementById('auth').value;
  const sort = document.getElementById('sort').value;

  let rows = service.all().filter(stock => {
    const count = service.approvalCount(stock);
    const quick = app.quickMode;
    const quickOk =
      quick === 'all' ||
      (quick === '3' && count === 3) ||
      (quick === '2plus' && count >= 2) ||
      (quick === '1' && count === 1) ||
      (quick === '0' && count === 0) ||
      (quick === 'rajhi' && stock.approvals.rajhi) ||
      (quick === 'osaimi' && stock.approvals.osaimi) ||
      (quick === 'albilad' && stock.approvals.albilad);

    return (!query || [stock.symbol, stock.name, stock.sector].join(' ').includes(query)) &&
      (!sector || stock.sector === sector) &&
      (!approvalCount || String(count) === approvalCount) &&
      (!authority || stock.approvals[authority]) &&
      quickOk;
  });

  rows.sort((a,b) => {
    if(sort === 'symbol') return a.symbol.localeCompare(b.symbol);
    if(sort === 'count') return service.approvalCount(b) - service.approvalCount(a) || a.symbol.localeCompare(b.symbol);
    if(sort === 'name') return a.name.localeCompare(b.name,'ar');
    return a.sector.localeCompare(b.sector,'ar') || a.symbol.localeCompare(b.symbol);
  });

  app.filteredRows = rows;
  return rows;
}

function render(){
  renderTable(getFilteredRows());
  updateStats();
}

function resetFilters(){
  ['q','sector','count','auth'].forEach(id => document.getElementById(id).value = '');
  window.MasarSharia.quickMode = 'all';
  document.querySelectorAll('.chip').forEach(button =>
    button.classList.toggle('active', button.dataset.quick === 'all')
  );
  render();
}

function initFilters(){
  ['q','sector','count','auth','sort'].forEach(id =>
    document.getElementById(id).addEventListener('input', render)
  );

  document.querySelectorAll('.chip').forEach(button => {
    button.addEventListener('click', () => {
      window.MasarSharia.quickMode = button.dataset.quick;
      document.querySelectorAll('.chip').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      render();
    });
  });
}

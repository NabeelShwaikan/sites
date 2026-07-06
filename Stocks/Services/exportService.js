window.Masar = window.Masar || {};
Masar.Services = Masar.Services || {};

Masar.Services.ExportService = (function(){
  function exportCsv(){
    const data = Masar.Services.DataService;
    const header = ['رمز السهم','الشركة','المجال','عدد المجيزين','الجهات المجيزة'];
    const rows = data.all().map(stock => [
      stock.symbol,
      stock.name,
      stock.sector,
      data.approvalCount(stock),
      data.approvalNames(stock).join('، ')
    ]);
    const csv = '\ufeff' + [header, ...rows]
      .map(row => row.map(Masar.Utils.escapeCsv).join(','))
      .join('\n');
    Masar.Utils.downloadTextFile('sharia_stocks.csv', csv, 'text/csv;charset=utf-8');
  }

  function exportStocksJs(rows){
    const js = 'window.shariaStocks = ' + JSON.stringify(rows, null, 2) + ';\\n';
    Masar.Utils.downloadTextFile('shariaStocks.js', js, 'text/javascript;charset=utf-8');
  }

  function exportJson(filename, data){
    Masar.Utils.downloadTextFile(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
  }

  return { exportCsv, exportStocksJs, exportJson };
})();

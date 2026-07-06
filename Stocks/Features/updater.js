window.Masar = window.Masar || {};
Masar.Features = Masar.Features || {};

Masar.Features.Updater = (function(){
  let parsedRows = [];
  let comparison = null;

  function analyze(){
    const raw = document.getElementById('updaterInput').value;
    const parsed = Masar.Services.ParserService.parsePastedText(raw);
    parsedRows = parsed.rows;

    const rowComparison = Masar.Services.CompareService.compareRows(parsedRows);
    const validation = Masar.Services.ValidationService.validateData(parsedRows);
    const sourceDates = Masar.Services.CompareService.compareSourceDates(parsed.sourceDates);

    comparison = {
      ...rowComparison,
      validation,
      sourceDates
    };

    Masar.UI.Updater.renderReport(comparison);
  }

  function generateDataFile(){
    if(!comparison || !comparison.validation.isValid) return;

    Masar.Services.ExportService.exportStocksJs(parsedRows);

    const report = {
      generatedAt: new Date().toISOString(),
      total: comparison.total,
      added: comparison.added.map(s => s.symbol),
      removed: comparison.removed.map(s => s.symbol),
      changed: comparison.changed.map(x => x.after.symbol),
      sourceDates: comparison.sourceDates
    };

    Masar.Services.ExportService.exportJson('shariaUpdateReport.json', report);
  }

  return { analyze, generateDataFile };
})();

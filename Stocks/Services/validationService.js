window.Masar = window.Masar || {};
Masar.Services = Masar.Services || {};

Masar.Services.ValidationService = (function(){
  function validateData(rows = Masar.Services.DataService.all()){
    const service = Masar.Services.DataService;
    const sch = service.schema();
    const required = sch.requiredFields || [];
    const keys = sch.approvalKeys || [];
    const seenSymbols = new Set();
    const seenNames = new Map();

    const report = {
      total: rows.length,
      duplicates:{symbols:[],names:[]},
      missingFields:[],
      invalidApprovals:[],
      invalidTypes:[],
      emptySectors:[],
      isValid:false
    };

    rows.forEach((stock,index)=>{
      const label = stock && (stock.symbol || stock.name) ? (stock.symbol || stock.name) : `row_${index+1}`;

      required.forEach(field => {
        if(!(field in stock) || stock[field] === '' || stock[field] == null){
          report.missingFields.push({row:index+1, stock:label, field});
        }
      });

      if(stock.symbol){
        if(seenSymbols.has(stock.symbol)) report.duplicates.symbols.push(stock.symbol);
        seenSymbols.add(stock.symbol);
      }

      if(stock.name){
        if(seenNames.has(stock.name)) report.duplicates.names.push(stock.name);
        seenNames.set(stock.name,true);
      }

      if(!stock.sector || !String(stock.sector).trim()) report.emptySectors.push(label);

      if(!stock.approvals || typeof stock.approvals !== 'object'){
        report.invalidApprovals.push({row:index+1, stock:label, reason:'approvals_missing'});
      } else {
        keys.forEach(key => {
          if(typeof stock.approvals[key] !== 'boolean'){
            report.invalidApprovals.push({row:index+1, stock:label, authority:key, value:stock.approvals[key]});
          }
        });
      }

      if(typeof stock.symbol !== 'string') report.invalidTypes.push({row:index+1, stock:label, field:'symbol'});
      if(typeof stock.name !== 'string') report.invalidTypes.push({row:index+1, stock:label, field:'name'});
      if(typeof stock.sector !== 'string') report.invalidTypes.push({row:index+1, stock:label, field:'sector'});
    });

    report.isValid =
      report.duplicates.symbols.length === 0 &&
      report.missingFields.length === 0 &&
      report.invalidApprovals.length === 0 &&
      report.invalidTypes.length === 0 &&
      report.emptySectors.length === 0;

    return report;
  }

  return { validateData };
})();

window.ShariaDataService = (function(){
  let statsCache = null;

  function all(){ return Array.isArray(window.shariaStocks) ? window.shariaStocks : []; }
  function sources(){ return window.shariaSources || {}; }
  function schema(){ return window.shariaSchema || { requiredFields:['symbol','name','sector','approvals'], approvalKeys:['rajhi','osaimi','albilad'] }; }
  function approvalKeys(){ return schema().approvalKeys || Object.keys(sources()); }
  function sourceName(key){ const src=sources()[key]; return src && src.name ? src.name : key; }
  function sourceLastUpdate(key){ const src=sources()[key]; return src && src.lastUpdate ? src.lastUpdate : ''; }

  function approvalNames(stock){
    if(!stock || !stock.approvals) return [];
    return approvalKeys().filter(key => stock.approvals[key] === true).map(sourceName);
  }

  function approvalCount(stock){ return approvalNames(stock).length; }
  function pillClass(count){ return count===3?'p3':count===2?'p2':count===1?'p1':'p0'; }
  function getStock(symbol){ return all().find(stock => stock.symbol === String(symbol)); }
  function getBySector(sector){ return all().filter(stock => stock.sector === sector); }
  function getApprovedBy(authorityKey){ return all().filter(stock => stock.approvals && stock.approvals[authorityKey] === true); }
  function sectors(){ return [...new Set(all().map(stock => stock.sector))].filter(Boolean).sort((a,b)=>a.localeCompare(b,'ar')); }

  function getStatistics(forceRefresh=false){
    if(statsCache && !forceRefresh) return statsCache;
    const rows=all();
    const byApprovalCount={0:0,1:0,2:0,3:0};
    const bySector={};
    const byAuthority={};
    approvalKeys().forEach(key => byAuthority[key]=0);

    rows.forEach(stock => {
      const c=approvalCount(stock);
      byApprovalCount[c]=(byApprovalCount[c] || 0)+1;
      bySector[stock.sector]=(bySector[stock.sector] || 0)+1;
      approvalKeys().forEach(key => {
        if(stock.approvals && stock.approvals[key] === true) byAuthority[key]=(byAuthority[key] || 0)+1;
      });
    });

    statsCache={total:rows.length, byApprovalCount, bySector, byAuthority};
    return statsCache;
  }

  function validateData(rows=all()){
    const sch=schema();
    const required=sch.requiredFields || [];
    const keys=sch.approvalKeys || [];
    const seenSymbols=new Set();
    const seenNames=new Map();
    const report={
      total: rows.length,
      duplicates:{symbols:[],names:[]},
      missingFields:[],
      invalidApprovals:[],
      invalidTypes:[],
      emptySectors:[],
      isValid:false
    };

    rows.forEach((stock,index)=>{
      const label=stock && (stock.symbol || stock.name) ? (stock.symbol || stock.name) : `row_${index+1}`;

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

  function resetCache(){ statsCache=null; }

  return {
    all, sources, schema, approvalKeys, sourceName, sourceLastUpdate,
    approvalNames, approvalCount, pillClass, getStock, getBySector, getApprovedBy,
    sectors, getStatistics, validateData, resetCache
  };
})();

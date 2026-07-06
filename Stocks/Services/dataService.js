window.Masar = window.Masar || {};
Masar.Services = Masar.Services || {};

Masar.Services.DataService = (function(){
  let statsCache = null;

  function all(){ return Array.isArray(window.shariaStocks) ? window.shariaStocks : []; }
  function meta(){ return window.shariaMeta || {}; }
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
  function sectors(){ return [...new Set(all().map(s => s.sector))].filter(Boolean).sort((a,b)=>a.localeCompare(b,'ar')); }

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

  function resetCache(){ statsCache=null; }

  return {
    all, meta, sources, schema, approvalKeys, sourceName, sourceLastUpdate,
    approvalNames, approvalCount, pillClass, sectors, getStatistics, resetCache
  };
})();

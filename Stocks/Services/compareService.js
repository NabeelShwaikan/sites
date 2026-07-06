window.Masar = window.Masar || {};
Masar.Services = Masar.Services || {};

Masar.Services.CompareService = (function(){
  function compareRows(newRows){
    const data = Masar.Services.DataService;
    const oldRows = data.all();
    const oldMap = new Map(oldRows.map(stock => [stock.symbol, stock]));
    const newMap = new Map(newRows.map(stock => [stock.symbol, stock]));

    const added = [];
    const removed = [];
    const changed = [];

    newRows.forEach(stock => {
      const old = oldMap.get(stock.symbol);
      if(!old){ added.push(stock); return; }

      const approvalChanged = data.approvalKeys().some(key => old.approvals[key] !== stock.approvals[key]);
      const metaChanged = old.name !== stock.name || old.sector !== stock.sector;

      if(approvalChanged || metaChanged){
        changed.push({before:old, after:stock});
      }
    });

    oldRows.forEach(stock => { if(!newMap.has(stock.symbol)) removed.push(stock); });

    return { added, removed, changed, total:newRows.length };
  }

  function compareSourceDates(newDates){
    const data = Masar.Services.DataService;
    const current = {};
    const changed = {};

    data.approvalKeys().forEach(key => {
      current[key] = data.sourceLastUpdate(key);
      if(newDates[key] && newDates[key] !== current[key]){
        changed[key] = {current: current[key], incoming: newDates[key]};
      }
    });

    return { current, incoming:newDates, changed };
  }

  return { compareRows, compareSourceDates };
})();

window.MasarSharia = {
  quickMode: 'all',
  filteredRows: [],
  names(stock){ return window.ShariaDataService.approvalNames(stock); },
  approvalCount(stock){ return window.ShariaDataService.approvalCount(stock); },
  pillClass(count){ return window.ShariaDataService.pillClass(count); },
  validateData(){ return window.ShariaDataService.validateData(); }
};

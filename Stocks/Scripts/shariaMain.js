document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  const report = window.ShariaDataService.validateData();
  if(!report.isValid){
    console.warn('Sharia stocks data validation report:', report);
  }

  fillSectors();
  initFilters();
  render();

  if(typeof initUpdater === 'function'){
    initUpdater();
  }
});

window.Masar = window.Masar || {};

document.addEventListener('DOMContentLoaded', () => {
  Masar.UI.Theme.init();

  const report = Masar.Services.ValidationService.validateData();
  if(!report.isValid){
    console.warn('Sharia stocks data validation report:', report);
  }

  Masar.UI.StatusPanel.render();
  Masar.UI.Filters.init();
  Masar.UI.Filters.render();
  Masar.UI.Updater.init();
});

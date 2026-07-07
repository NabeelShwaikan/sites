window.Masar = window.Masar || {};

Masar.UI = Masar.UI || {};
Masar.UI.BackToTop = (function(){
  function init(){
    const btn = document.getElementById('backToTopBtn');
    if(!btn) return;

    const sync = () => {
      btn.classList.toggle('show', window.scrollY > 420);
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', sync, { passive: true });
    sync();
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  Masar.UI.Theme.init();

  const report = Masar.Services.ValidationService.validateData();
  if(!report.isValid){
    console.warn('Sharia stocks data validation report:', report);
  }

  Masar.UI.StatusPanel.render();
  Masar.UI.Table.initInteractions();
  Masar.UI.Filters.init();
  Masar.UI.Filters.render();
  Masar.UI.Updater.init();
  Masar.UI.BackToTop.init();
});

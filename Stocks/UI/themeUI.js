window.Masar = window.Masar || {};
Masar.UI = Masar.UI || {};

Masar.UI.Theme = (function(){
  function applyTheme(theme){
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
    Masar.Storage.set('masarTheme', isDark ? 'dark' : 'light');

    const btn = document.getElementById('themeToggle');
    if(btn){
      btn.setAttribute('aria-label', isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن');
      const ic = document.getElementById('themeIcon');
      if(ic) ic.textContent = isDark ? '🌙' : '☀️';
    }
  }

  function init(){
    const saved = Masar.Storage.get('masarTheme', 'light');
    applyTheme(saved);
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  return { init, applyTheme };
})();

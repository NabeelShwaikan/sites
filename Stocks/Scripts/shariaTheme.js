function applyTheme(theme){
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  try { localStorage.setItem('masarTheme', isDark ? 'dark' : 'light'); } catch(e) {}
  const btn = document.getElementById('themeToggle');
  if(btn){
    btn.setAttribute('aria-label', isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن');
    const ic = document.getElementById('themeIcon');
    if(ic) ic.textContent = isDark ? '🌙' : '☀️';
  }
}

function initTheme(){
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('masarTheme') || 'light'; } catch(e) {}
  applyTheme(savedTheme);
  const btn = document.getElementById('themeToggle');
  if(btn){
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
}

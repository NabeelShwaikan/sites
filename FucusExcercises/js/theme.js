(function () {
  const KEY = "focus-shell-theme-v1";

  function applyTheme(mode) {
    document.body.dataset.theme = mode;
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent = mode === "dark" ? "☀️" : "🌙";
    }
    try {
      localStorage.setItem(KEY, mode);
    } catch (_) {}
  }

  function initTheme() {
    let mode = "dark";
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "light" || stored === "dark") {
        mode = stored;
      }
    } catch (_) {}
    applyTheme(mode);

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = document.body.dataset.theme === "light" ? "light" : "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initTheme);
})();

(function () {
  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    var btns = document.querySelectorAll("#themeToggle");
    btns.forEach(function (btn) {
      if (theme === "dark") {
        btn.textContent = "☀️ التبديل إلى الوضع النهاري";
      } else {
        btn.textContent = "🌙 التبديل إلى الوضع الليلي";
      }
    });
  }

  function initTheme() {
    var saved = localStorage.getItem("awareness_theme");
    var initial = saved === "dark" ? "dark" : "light";
    applyTheme(initial);

    document.addEventListener("click", function (e) {
      if (e.target && e.target.id === "themeToggle") {
        var current = document.body.getAttribute("data-theme") || "light";
        var next = current === "light" ? "dark" : "light";
        localStorage.setItem("awareness_theme", next);
        applyTheme(next);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();

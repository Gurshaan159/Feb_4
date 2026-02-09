(() => {
  const $ = (id) => document.getElementById(id);

  const storageKey = "feb4.theme";
  const preferred = localStorage.getItem(storageKey);
  if (preferred === "light" || preferred === "dark") {
    document.documentElement.dataset.theme = preferred;
  }

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
  };

  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  };

  $("themeToggle")?.addEventListener("click", toggleTheme);

  const countValue = $("countValue");
  let count = 0;

  const render = () => {
    if (countValue) countValue.textContent = String(count);
  };

  $("increment")?.addEventListener("click", () => {
    count += 1;
    render();
  });

  $("decrement")?.addEventListener("click", () => {
    count -= 1;
    render();
  });

  $("reset")?.addEventListener("click", () => {
    count = 0;
    render();
  });

  render();

  const loadedAt = $("loadedAt");
  if (loadedAt) {
    loadedAt.textContent = new Date().toLocaleString();
  }

  const year = $("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const hostingHint = $("hostingHint");
  if (hostingHint) {
    const path = window.location.pathname;
    const looksLikeProjectSite = /^\\/[^/]+\\//.test(path);
    hostingHint.textContent = looksLikeProjectSite
      ? `Detected project-site style path: ${path}`
      : `Path: ${path} (if this is GitHub Pages, you may be using a user site)`;
  }
})();

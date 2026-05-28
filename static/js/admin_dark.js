// Fuerza modo oscuro siempre — se ejecuta antes del render de Unfold
(function () {
  document.documentElement.classList.add("dark");
  try { localStorage.setItem("theme", "dark"); } catch (_) {}
})();

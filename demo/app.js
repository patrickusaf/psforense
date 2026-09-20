// Comportamientos de la interfaz. La política de seguridad (CSP) no permite manejadores en línea
// (onclick, onchange…), así que se activan con atributos data-*:
//   <select data-auto>          envía el formulario al cambiar (filtros)
//   <form data-confirm="…">     pide confirmación antes de enviar
//   <button data-print>         abre el diálogo de impresión
document.addEventListener("change", (e) => {
  const s = e.target;
  if (s.matches && s.matches("select[data-auto]") && s.form) s.form.submit();
});
document.addEventListener("submit", (e) => {
  const msg = e.target.getAttribute && e.target.getAttribute("data-confirm");
  if (msg && !window.confirm(msg)) e.preventDefault();
});
document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest("[data-print]")) window.print();
});

// Menú principal: botón en móvil, grupos desplegables (uno abierto a la vez en escritorio; en móvil se abre el activo)
(function () {
  var boton = document.querySelector("[data-menu]"), nav = document.getElementById("menu-principal");
  if (!boton || !nav) return;
  var movil = function () { return window.matchMedia("(max-width: 860px)").matches; };
  var grupos = Array.prototype.slice.call(nav.querySelectorAll("details.grupo"));
  var cerrarGrupos = function (menos) { grupos.forEach(function (g) { if (g !== menos) g.open = false; }); };
  boton.addEventListener("click", function () {
    var abierto = nav.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  grupos.forEach(function (g) {
    if (movil() && g.classList.contains("on")) g.open = true;
    g.addEventListener("toggle", function () { if (g.open && !movil()) cerrarGrupos(g); });
  });
  document.addEventListener("click", function (e) { if (!movil() && !e.target.closest("details.grupo")) cerrarGrupos(null); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    cerrarGrupos(null); nav.classList.remove("abierto"); boton.setAttribute("aria-expanded", "false");
  });
})();

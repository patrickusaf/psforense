(function () {
  var t = document.getElementById("demo-toast"), h;
  function aviso(m) { if (!t) return; t.textContent = m; t.hidden = false; clearTimeout(h); h = setTimeout(function () { t.hidden = true; }, 3800); }
  document.addEventListener("submit", function (e) {
    if (!e.target.closest("[data-demo-form]")) return;
    e.preventDefault();
    aviso("Demostración: aquí se guardaría el cambio. En esta demo no se guarda nada.");
  }, true);
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-demo-off]");
    if (!a) return;
    e.preventDefault();
    aviso("Esta función no está disponible en la demostración.");
  }, true);
})();

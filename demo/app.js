// Comportamientos de la interfaz. La política de seguridad (CSP) no permite manejadores en línea
// (onclick, onchange…), así que se activan con atributos data-*:
//   <select data-auto> / <input type=checkbox data-auto>   envía el formulario al cambiar (filtros)
//   <form data-confirm="…">     pide confirmación antes de enviar
//   <button data-print>         abre el diálogo de impresión
document.addEventListener("change", (e) => {
  const s = e.target;
  if (s.matches && s.matches("select[data-auto], input[type=checkbox][data-auto]") && s.form) s.form.submit();
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

// Chat y comentarios: cada pocos segundos pide los mensajes nuevos del canal y los añade (el texto se inserta como texto, nunca como HTML).
(function () {
  var cajas = Array.prototype.slice.call(document.querySelectorAll("[data-chat]"));
  if (!cajas.length || !window.fetch) return;
  var nuevo = function (m) {
    var a = document.createElement("article");
    a.className = "msg" + (m.mio ? " mio" : "") + (m.eliminado ? " eliminado" : "");
    a.setAttribute("data-id", m.id);
    var h = document.createElement("header"), b = document.createElement("b"), t = document.createElement("span"), p = document.createElement("p");
    b.textContent = m.autor; t.className = "mini"; t.textContent = " " + m.hora; h.appendChild(b); h.appendChild(t);
    p.className = "texto"; p.textContent = m.eliminado ? "Mensaje eliminado" : m.texto;
    a.appendChild(h); a.appendChild(p);
    return a;
  };
  var abajo = function (el) { return el.scrollHeight - el.scrollTop - el.clientHeight < 80; };
  cajas.forEach(function (caja) {
    caja.scrollTop = caja.scrollHeight;
    var ocupado = false;
    setInterval(function () {
      if (ocupado || document.hidden) return;
      ocupado = true;
      var desde = parseInt(caja.getAttribute("data-ultimo"), 10) || 0;
      fetch("/chat/api?canal=" + encodeURIComponent(caja.getAttribute("data-canal")) + "&desde=" + desde, { credentials: "same-origin", headers: { Accept: "application/json" } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.mensajes || !d.mensajes.length) return;
          var seguir = abajo(caja), vacio = caja.querySelector(".chat-vacio");
          if (vacio) vacio.remove();
          d.mensajes.forEach(function (m) { if (!caja.querySelector('[data-id="' + m.id + '"]')) caja.appendChild(nuevo(m)); caja.setAttribute("data-ultimo", m.id); });
          if (seguir) caja.scrollTop = caja.scrollHeight;
        })
        .catch(function () {})
        .then(function () { ocupado = false; });
    }, 4000);
  });
  // Ctrl/⌘ + Intro envía el mensaje
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && e.target.matches && e.target.matches(".chat-form textarea") && e.target.form) e.target.form.submit();
  });
})();
